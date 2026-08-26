const fs = require('fs');
const path = require('path');

function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) scan(fullPath);
        else if (fullPath.endsWith('qs.json') && !fullPath.includes('staging')) {
            let data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            data.forEach(q => {
                let qLower = q.question.toLowerCase();
                if (qLower.includes('tự luận') || qLower.includes('thảo luận') || qLower.includes('trình bày') || qLower.includes('phân tích')) {
                    console.log("Found in", fullPath, ":", q.question.substring(0, 50), "... Options:", JSON.stringify(q.options));
                }
            });
        }
    });
}
scan('_sources/TVU');
