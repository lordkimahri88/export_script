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

    download.style.width = '160px'; // setting the width to 200px
    download.style.height = '80px'; // setting the height to 200px
    download.style.background = 'red'; // setting the background color to teal
    download.style.color = 'white'; // setting the color to white
    download.style.fontSize = '26px'; // setting the font size to 20px
    download.style.borderColor = "darkred";
    download.style.borderRadius = '40px';

document.querySelector('h1').append(download);