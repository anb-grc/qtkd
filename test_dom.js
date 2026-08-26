const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const html = fs.readFileSync('11. Kinh tế chính trị Mác - Lênin/Ngan_hang_de_Mac_Lenin.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;
console.log("page-header contains:", document.querySelector('.page-header').innerHTML);
console.log("mode-switch exists?", !!document.querySelector('.mode-switch'));
console.log("btnQuizMode parent node:", document.getElementById('btnQuizMode').parentNode.className);
