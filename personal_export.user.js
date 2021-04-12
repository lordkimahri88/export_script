// ==UserScript==
// @name         LSS-PersonalExport-Leitstellenedition
// @version      1.0.0
// @description  Exportiert das Personal der Gebäude einer Leitstelle als Datei
// @grant        none
// @include      https://www.leitstellenspiel.de/buildings/*
// ==/UserScript==
if (document.querySelector('#tab_buildings')) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(record => {
            if (
                Array.from(record.addedNodes).find(
                    node => node.tagName === 'SCRIPT'
                )
            ) {
                const exportBtn = document.createElement('a');
                exportBtn.classList.add('btn', 'btn-warning', 'pull-right');
                exportBtn.innerText = 'Personal exportieren';
                document
                    .querySelector('#tab_buildings .search_input_field')
                    .after(exportBtn);
                const clickHandler = async e => {
                    e.preventDefault();
                    exportBtn.removeEventListener('click', clickHandler);
                    exportBtn.classList.add('disabled');
                    exportBtn.innerText = 'Personalexport generieren…';
                    const buildings = Array.from(
                        document.querySelectorAll(
                            '#building_table tbody tr.alliance_buildings_table_searchable'
                        )
                    )
                        .filter(r => r.children[4].textContent.trim() !== '0')
                        .map(r => ({
                            id: r.children[1]
                                .querySelector('a')
                                .href.replace(/.*?(?=\d+$)/, ''),
                            lst: r.children[6]
                                .querySelector('a.btn-success')
                                .href.replace(/.*?(?=\d+$)/, ''),
                        }));
                    const updateBuilding = async (index = 0) => {
                        exportBtn.innerText = `Personalexport generieren… (mind. ${(
                            (buildings.length - index) /
                            10
                        ).toLocaleString()} Sekunden verbleiben (100 ms pro Gebäude wegen Spielseitigen Beschränkungen))`;
                        const source = await fetch(
                            `/buildings/${buildings[index].id}/personals`
                        ).then(res => res.text());
                        buildings[index].personal = Array.from(
                            new DOMParser()
                                .parseFromString(source, 'text/html')
                                .querySelectorAll('#personal_table tbody tr')
                        ).map(row => ({
                            name: row.children[0].textContent.trim(),
                            ausbildung: row.children[1].textContent.trim(),
                        }));
                        if (index < buildings.length - 1)
                            await updateBuilding(index + 1);
                    };
                    await updateBuilding();
                    exportBtn.classList.remove('disabled');
                    exportBtn.href = `data:application/json;charset=utf-8,${encodeURIComponent(
                        JSON.stringify(buildings)
                    )}`;
                    exportBtn.download = 'leitstelle_'+ window.location.pathname.match(/\d+/)[0] + '.json';
                    exportBtn.innerText = 'Personal exportieren';
                    exportBtn.click();
                };
                exportBtn.addEventListener('click', clickHandler);
            }
        });
    });
    observer.observe(document.querySelector('#tab_buildings'), {
        childList: true,
    });
}