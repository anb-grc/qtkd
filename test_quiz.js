const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync('11. Kinh tế chính trị Mác - Lênin/Ngan_hang_de_Mac_Lenin.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;
const document = window.document;

try {
    window.switchMode('quiz');
    console.log("Success! quiz-content:", document.getElementById('quiz-content').innerHTML.substring(0, 50));
} catch (e) {
    console.error("Error calling switchMode:", e);
}
