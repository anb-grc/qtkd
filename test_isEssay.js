const fs = require('fs');
const path = require('path');

function scan(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) scan(fullPath);
        else if (fullPath.endsWith('qs.json') && !fullPath.includes('staging')) {
            let data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
            let count = 0;
            data.forEach(q => {
                let isEssay = false;
                let displayQ = q.question || '';
                let qTextLower = displayQ.toLowerCase();
                
                if (q.tags && (q.tags.includes('Tự luận') || q.tags.includes('Essay'))) {
                    isEssay = true;
                } else if (qTextLower.includes('tự luận:') || qTextLower.includes('câu hỏi tự luận') || qTextLower.includes('thảo luận:')) {
                    isEssay = true;
                } else if (!q.options || q.options.length === 0) {
                    let hasEmbedded = [...displayQ.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)].length > 0;
                    if (!hasEmbedded) {
                        if (qTextLower.includes('hãy trình bày') || qTextLower.includes('hãy phân tích') || 
                            qTextLower.includes('hãy so sánh') || qTextLower.includes('phân biệt ')) {
                            isEssay = true;
                        }
                    }
                }
                if (isEssay) count++;
            });
            console.log(fullPath.padEnd(80), "Essay count:", count, "Total:", data.length);
        }
    });
}
scan('_sources/TVU');
