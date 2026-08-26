const fs = require('fs');
const path = require('path');

function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) scan(fullPath);
        else if (fullPath.endsWith('qs.json')) {
            let data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            let emptyOpts = 0;
            let withOpts = 0;
            let noOpts = 0;
            let embOpts = 0;
            data.forEach(q => {
                if (q.options && q.options.length > 0) withOpts++;
                else if (q.options && q.options.length === 0) {
                    emptyOpts++;
                    let displayQ = q.question || '';
                    let matches = [...displayQ.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
                    if (matches.length > 0) embOpts++;
                }
                else noOpts++;
            });
            console.log(fullPath.padEnd(80), `withOpts: ${withOpts}, emptyOpts: ${emptyOpts}, noOpts: ${noOpts}, embOpts (in empty): ${embOpts}`);
        }
    });
}
scan('_sources/TVU');
