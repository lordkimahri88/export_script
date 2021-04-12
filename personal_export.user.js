// ==UserScript==
// @name         Personal-Export
// @include      /^https?:\/\/(?:w{3}\.)?leitstellenspiel\.de\/buildings\/\d+\/personals\/?$/

// ==/UserScript==

var download = document.createElement('a');
var wachenId = window.location.pathname.split('/').reverse()[1];
download.innerText = ' \u00A0 Exportieren \u00A0';
download.href = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(Array.from(document.querySelectorAll('#personal_table tbody tr')).map(row => ({
        name: row.children[0].textContent.trim(),
        ausbildung: row.children[1].textContent.trim(),
        bid: wachenId ,
    }))))}`;
download.download = wachenId + "_personals.json";

download.classList.add('btn','btn-danger', 'pull-right');
document.querySelector('h1').append(download);
