// Global variables for Data-Driven Rendering
window.quizData = [];
window.filteredData = [];
window.currentRendered = 0;
window.currentLimit = 15;

function normalizeTextForSearch(text) {
    if (!text) return "";
    let s = text.replace(/<br\s*\/?>/gi, ' ');
    s = s.replace(/<[^>]+>/g, ' ');
    s = s.toLowerCase().normalize('NFC');
    s = s.replace(/[\p{Cf}\u200B-\u200D\uFEFF\u00AD]/gu, '');
    s = s.replace(/oà/g, 'òa').replace(/oá/g, 'óa').replace(/oả/g, 'ỏa').replace(/oã/g, 'õa').replace(/oạ/g, 'ọa');
    s = s.replace(/oè/g, 'òe').replace(/oé/g, 'óe').replace(/oẻ/g, 'ỏe').replace(/oẽ/g, 'õe').replace(/oẹ/g, 'ọe');
    s = s.replace(/uỳ/g, 'ùy').replace(/uý/g, 'úy').replace(/uỷ/g, 'ủy').replace(/uỹ/g, 'ũy').replace(/uỵ/g, 'ụy');
    s = s.replace(/[^\p{L}\p{N}\s]/gu, ' ');
    return s.replace(/\s+/g, ' ').trim();
}

function buildFilterUI(data) {
    let wrap = document.querySelector('.search-wrap');
    if (!wrap) return;
    
    // Thu thập tất cả tags từ data
    let allTags = new Set();
    data.forEach(q => {
        if(q.tags && Array.isArray(q.tags)) {
            q.tags.forEach(t => allTags.add(t));
        }
    });
    
    let tagOptions = `<option value="all">Tất cả dạng câu hỏi</option>`;
    Array.from(allTags).sort().forEach(t => {
        tagOptions += `<option value="${t}">${t}</option>`;
    });
    
    let limitOptions = `
        <option value="5">Hiển thị: 5 câu</option>
        <option value="10">Hiển thị: 10 câu</option>
        <option value="15" selected>Hiển thị: 15 câu</option>
        <option value="20">Hiển thị: 20 câu</option>
        <option value="40">Hiển thị: 40 câu</option>
        <option value="all">Hiển thị: Tất cả</option>
    `;
    
    let controlsHtml = `
        <div style="display:flex; gap:10px; margin-top:10px; flex-wrap:wrap; width:100%;">
            <select id="tagFilter" onchange="filterQuestions()" style="padding:8px; border-radius:8px; border:1px solid #ccc; flex:1; min-width:150px; background: #fff; font-family: inherit;">
                ${tagOptions}
            </select>
            <select id="limitFilter" onchange="changeLimit()" style="padding:8px; border-radius:8px; border:1px solid #ccc; flex:1; min-width:150px; background: #fff; font-family: inherit;">
                ${limitOptions}
            </select>
        </div>
    `;
    
    // Inject controls into search-wrap
    if(!document.getElementById('tagFilter')) {
        let div = document.createElement('div');
        div.innerHTML = controlsHtml;
        wrap.appendChild(div.firstElementChild);
    }
}

function changeLimit() {
    let val = document.getElementById('limitFilter').value;
    if (val === 'all') {
        window.currentLimit = window.filteredData.length;
    } else {
        window.currentLimit = parseInt(val);
    }
    window.currentRendered = 0;
    document.getElementById('questions-list').innerHTML = '';
    renderBatch();
}

function filterQuestions() {
    const rawQuery = document.getElementById('searchBox').value;
    const query = normalizeTextForSearch(rawQuery);
    const tagFilter = document.getElementById('tagFilter') ? document.getElementById('tagFilter').value : 'all';
    
    window.filteredData = window.quizData.filter(q => {
        let matchSearch = true;
        let matchTag = true;
        
        if (query) {
             let htmlStr = q.question.replace(/<br\s*\/?>/gi, ' ');
             let plainText = htmlStr.replace(/<[^>]+>/g, ' ');
             const qText = normalizeTextForSearch(plainText);
             
             let qStr = query.replace(/^dien vao cho trong /, '');
             let tStr = qText.replace(/^dien vao cho trong /, '');
             
             // Tìm kiếm tương đối:
             matchSearch = tStr.includes(qStr);
        }
        
        if (tagFilter !== 'all') {
             if (!q.tags || !q.tags.includes(tagFilter)) {
                 matchTag = false;
             }
        }
        
        return matchSearch && matchTag;
    });
    
    window.currentRendered = 0;
    document.getElementById('questions-list').innerHTML = '';
    renderBatch();
    
    const meta = document.getElementById('searchMeta');
    const noRes = document.getElementById('noResult');
    if (window.filteredData.length === 0) {
        if(meta) meta.innerHTML = '';
        if(noRes) noRes.style.display = 'block';
    } else {
        if(meta) meta.innerHTML = `Tìm thấy <b>${window.filteredData.length}</b> câu hỏi.`;
        if(noRes) noRes.style.display = 'none';
    }
}

function clearSearch() {
    document.getElementById('searchBox').value = '';
    if(document.getElementById('tagFilter')) document.getElementById('tagFilter').value = 'all';
    filterQuestions();
}

function renderBatch() {
    const list = document.getElementById('questions-list');
    if (!list) return;
    
    // Xóa nút "Xem thêm" cũ nếu có
    let oldBtn = document.getElementById('btnLoadMore');
    if(oldBtn) oldBtn.remove();
    
    let endIndex = Math.min(window.currentRendered + window.currentLimit, window.filteredData.length);
    let batch = window.filteredData.slice(window.currentRendered, endIndex);
    
    let html = '';
    batch.forEach((q, idx) => {
        let actualIndex = window.currentRendered + idx;
        let weightAttr = (q.weight && q.weight !== 'normal') ? `data-weight="${q.weight}"` : '';
        
        let displayQ = q.question;
        let matches = [...displayQ.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
        if (matches.length > 0 && !displayQ.includes('options-grid')) {
            let cutIndex = matches[matches.length - 1].index;
            let questionPart = displayQ.substring(0, cutIndex).trim();
            questionPart = questionPart.replace(/(<br\s*\/?>\s*)+$/, "");
            let optionsPart = displayQ.substring(cutIndex).replace(/^(?:<br\s*\/?>\s*)+/i, '');
            
            optionsPart = optionsPart.replace(/([A-D][\.\)])(?:\s|<br\s*\/?>)*/gi, '</div></div><div style="display: flex; align-items: flex-start; margin-bottom: 12px; line-height: 1.5;"><div style="font-weight: 600; color: var(--primary); min-width: 24px; flex-shrink: 0;">$1</div><div>');
            optionsPart = optionsPart.replace(/^(?:<\/div>){1,2}/i, '') + '</div></div>';
            
            displayQ = `<div style="font-weight: 600;">${questionPart}</div><div style="font-weight: normal; margin-top: 12px;">${optionsPart}</div>`;
        }
        
        // Render tags visually
        let tagsHtml = '';
        if(q.tags && Array.isArray(q.tags)) {
            tagsHtml = '<div style="margin-bottom:8px;">' + q.tags.map(t => `<span style="display:inline-block; background:var(--surface); border:1px solid #ddd; padding:2px 8px; border-radius:12px; font-size:0.8em; margin-right:5px; margin-bottom:5px; color:#555;">🏷️ ${t}</span>`).join('') + '</div>';
        }
        
        // Using onclick directly instead of addEventListener for simplicity
        let ansHtml = q.answer.replace(/(<div class="answer-title">[\s\S]*?<\/div>)([\s\S]*?)(?=<div|$)/i, function(match, p1, p2) {
            if(p2.trim()) {
                return p1 + `<div class="answer-text" style="flex: 1; line-height: 1.6; padding-top: 2px;">${p2}</div>`;
            }
            return match;
        });

        html += `
        <div class="question-container" ${weightAttr} onclick="toggleAnswer(this)">
            ${tagsHtml}
            <div class="question" style="font-weight: normal;">${displayQ}</div>
            <div class="answer" style="display: none;">${ansHtml}</div>
        </div>
        `;
    });
    
    // Append html
    list.insertAdjacentHTML('beforeend', html);
    window.currentRendered = endIndex;
    
    // Add "Xem thêm" button if more items
    if(window.currentRendered < window.filteredData.length) {
        let remain = window.filteredData.length - window.currentRendered;
        let nextBatchSize = Math.min(window.currentLimit, remain);
        list.insertAdjacentHTML('beforeend', `<button id="btnLoadMore" onclick="renderBatch()" style="display:block; width:100%; padding:12px; background:var(--border); color:var(--muted); border:none; border-radius:8px; font-weight:bold; cursor:pointer; margin-top:15px; font-size:1.1em; transition: opacity 0.2s;">⬇️ Xem thêm ${nextBatchSize} câu nữa (Còn ${remain})</button>`);
    }
    
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise();
    }
    
    updateCounter();
}

function toggleAnswer(el) {
    const answer = el.querySelector('.answer');
    if(answer) answer.style.display = answer.style.display === 'flex' ? 'none' : 'flex';
}

function updateCounter() {
    let txt = `Tổng: <span>${window.filteredData.length} câu`;
    const countEl = document.getElementById('totalCount');
    if (countEl) countEl.innerHTML = txt;
}

window.onload = async () => {
    if (typeof QS_DATA_URL !== 'undefined') {
        try {
            const res = await fetch(QS_DATA_URL);
            window.quizData = await res.json();
            window.filteredData = window.quizData;
            
            buildFilterUI(window.quizData);
            renderBatch();
        } catch(e) {
            console.error("Error loading questions: ", e);
        }
    } else {
        updateCounter();
    }
};

// QUIZ LOGIC
let quizQuestions = [];

function switchMode(mode) {
    if(mode === 'quiz') {
      showQuizModal();
      return;
    }

    document.body.classList.remove('quiz-mode', 'knowledge-mode');
    
    const summary = document.getElementById('quiz-result-summary');
    if (summary) summary.style.display = 'none';
    
    const btnStudy = document.getElementById('btnStudyMode');
    const btnQuiz = document.getElementById('btnQuizMode');
    const btnKnowledge = document.getElementById('btnKnowledgeMode');
    const instEl = document.getElementById('mode-instruction');
    
    if (btnStudy) btnStudy.classList.remove('active');
    if (btnQuiz) btnQuiz.classList.remove('active');
    if (btnKnowledge) btnKnowledge.classList.remove('active');

    if(mode === 'study') {
      if (btnStudy) btnStudy.classList.add('active');
      if (instEl) instEl.innerHTML = '💡 Trắc nghiệm: Đọc → Tự nghĩ → CLICK để kiểm tra &nbsp;|&nbsp; Tự luận: Đọc → Tự viết → CLICK xem gợi ý';
    } else if(mode === 'knowledge') {
      document.body.classList.add('knowledge-mode');
      if (btnKnowledge) btnKnowledge.classList.add('active');
      if (instEl) instEl.innerHTML = '💡 Nhấn vào từng chương để xem nội dung &nbsp;|&nbsp; Tương tác với các thẻ, biểu đồ để ghi nhớ sâu';
      if (typeof renderKnowledgeBase === 'function') { renderKnowledgeBase(); }
    }
}

function toggleKb(id) {
    const el = document.getElementById(id);
    if(el.classList.contains('open')) el.classList.remove('open');
    else el.classList.add('open');
}

function extractRawAnswerData(qObj) {
    let tmpDiv = document.createElement('div');
    tmpDiv.innerHTML = qObj.answer;
    
    let title = tmpDiv.querySelector('.answer-title');
    if(!title) return "Đúng"; 
    let ans = title.innerHTML.replace(/✅ Đáp án:\s*/g, '').trim();
    
    if (ans.length === 0) {
        let clone = tmpDiv.cloneNode(true);
        let t = clone.querySelector('.answer-title');
        if (t) t.remove();
        
        let divs = clone.querySelectorAll('div');
        divs.forEach(d => {
            if (d.classList.contains('note') || d.textContent.includes('Giải thích:') || d.textContent.startsWith('- Hoặc:')) {
                d.remove();
            }
        });
        
        let text = clone.innerHTML.replace(/^-\s*(Hoặc:\s*)?/, '').replace(/\s*Gắn cờ$/, '').trim();
        if (text.length > 0) {
            ans = text;
        }
    }
    if (ans.length === 0) ans = "Đáp án đúng";
    return ans;
}

function startQuiz(quizMode = 'optimized') {
    let modal = document.getElementById('quiz-mode-modal');
    if (modal) modal.style.display = 'none';

    // Đổi giao diện sang chế độ Thi thử
    document.body.classList.remove('knowledge-mode');
    document.body.classList.add('quiz-mode');
    
    const btnStudy = document.getElementById('btnStudyMode');
    const btnQuiz = document.getElementById('btnQuizMode');
    const btnKnowledge = document.getElementById('btnKnowledgeMode');
    const instEl = document.getElementById('mode-instruction');
    
    if (btnStudy) btnStudy.classList.remove('active');
    if (btnKnowledge) btnKnowledge.classList.remove('active');
    if (btnQuiz) btnQuiz.classList.add('active');
    if (instEl) instEl.innerHTML = '💡 Đọc kỹ câu hỏi → Chọn 1 đáp án đúng nhất → Bấm Nộp bài để chấm điểm & xem giải thích';
    
    document.getElementById('quiz-result-summary').style.display = 'none';
    
    let selected = [];
    const totalQuestions = (window.subjectConfig && window.subjectConfig.quizTotal) ? window.subjectConfig.quizTotal : 40;
    
    if (quizMode === 'optimized') {
        let highPriority = window.quizData.filter(q => q.weight === 'high' || (q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
        highPriority.sort(() => 0.5 - Math.random());
        
        let numHigh = Math.min(totalQuestions, highPriority.length);
        selected = [...highPriority.slice(0, numHigh)];
        
        // Nếu không đủ câu hỏi trọng tâm, bù thêm bằng câu thường
        if (selected.length < totalQuestions) {
            let normalPriority = window.quizData.filter(q => q.weight !== 'high' && !(q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
            normalPriority.sort(() => 0.5 - Math.random());
            let remain = totalQuestions - selected.length;
            selected = [...selected, ...normalPriority.slice(0, Math.min(remain, normalPriority.length))];
        }
    } else if (quizMode === 'structured') {
        if (window.subjectConfig && window.subjectConfig.structure && window.subjectConfig.structure.length > 0) {
            let usedQuestions = new Set();
            window.subjectConfig.structure.forEach(rule => {
                let pool = window.quizData.filter(q => q.tags && q.tags.includes(rule.tag) && !usedQuestions.has(q.question));
                pool.sort(() => 0.5 - Math.random());
                let picked = pool.slice(0, rule.count);
                picked.forEach(q => {
                    selected.push(q);
                    usedQuestions.add(q.question);
                });
            });
            // Nếu cấu trúc không bốc đủ totalQuestions, bù thêm ngẫu nhiên
            if (selected.length < totalQuestions) {
                let pool = window.quizData.filter(q => !usedQuestions.has(q.question));
                pool.sort(() => 0.5 - Math.random());
                let remain = totalQuestions - selected.length;
                let picked = pool.slice(0, Math.min(remain, pool.length));
                picked.forEach(q => selected.push(q));
            }
        } else {
            // Fallback nếu không có config cấu trúc: Bốc ngẫu nhiên toàn bộ
            let pool = [...window.quizData];
            pool.sort(() => 0.5 - Math.random());
            selected = pool.slice(0, Math.min(totalQuestions, pool.length));
        }
    }
    
    selected.sort(() => 0.5 - Math.random());
    quizQuestions = selected;
    
    const allAnswers = window.quizData.map(q => extractRawAnswerData(q)).filter(a => a.length > 0);
    
    let stripHighlight = (htmlStr) => {
        let tmp = document.createElement('div');
        tmp.innerHTML = htmlStr;
        let tags = tmp.querySelectorAll('.answer-keyword, .keyword, b, strong');
        tags.forEach(t => {
            let textNode = document.createTextNode(t.textContent);
            t.parentNode.replaceChild(textNode, t);
        });
        return tmp.innerHTML;
    };
    
    let html = '';
    quizQuestions.forEach((qObj, index) => {
      let qHtml = qObj.question;
      let correctAns = extractRawAnswerData(qObj);
      let options = [];
      let finalQHtml = qHtml;
      
      let tmpDiv = document.createElement('div');
      tmpDiv.innerHTML = qHtml;
      
      let optionsGrid = tmpDiv.querySelector('.options-grid');
      
      if (optionsGrid) {
          // Extract the options directly from the grid
          let optDivs = optionsGrid.querySelectorAll('div');
          options = Array.from(optDivs).map(d => d.innerHTML.trim());
          
          // Remove options-grid from the question text
          optionsGrid.remove();
          finalQHtml = tmpDiv.innerHTML.trim();
          finalQHtml = finalQHtml.replace(/(<br\s*\/?>\s*)+$/, "");
      } else {
          // Legacy fallback if options-grid is missing
          let textForRegex = qHtml.replace(/<br\s*\/?>/gi, '\n');
          let tmpTextDiv = document.createElement('div');
          tmpTextDiv.innerHTML = textForRegex;
          let plainText = tmpTextDiv.textContent || tmpTextDiv.innerText;
          
          let match = plainText.match(/A[\.\)]\s*(.*?)\s*B[\.\)]\s*(.*?)\s*C[\.\)]\s*(.*?)\s*D[\.\)]\s*(.*)/is);
          if (match) {
              options = [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim()];
              options = options.map(opt => opt.replace(/\n/g, '<br>'));
              let matches = [...qHtml.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
              let cutIndex = matches.length > 0 ? matches[matches.length - 1].index : -1;
              if(cutIndex > -1) {
                  finalQHtml = qHtml.substring(0, cutIndex).trim();
                  finalQHtml = finalQHtml.replace(/(<br\s*\/?>\s*)+$/, "");
              }
          } else {
              // Final fallback: no options found, and we no longer borrow distractors.
              options = [correctAns, "N/A", "N/A", "N/A"];
          }
      }

      // Cleanup A., B., C., D. prefixes if they exist at the start of options
      options = options.map(opt => {
          return opt.replace(/^((?:<[^>]+>\s*)*)[A-D][\.\)]\s*(?:<br\s*\/?>\s*)?/i, '$1').trim();
      });

      // Find the correct option index
      let tmpCorrectDiv = document.createElement('div');
      tmpCorrectDiv.innerHTML = correctAns;
      let plainCorrect = tmpCorrectDiv.textContent || tmpCorrectDiv.innerText;
      let normCorrect = normalizeTextForSearch(plainCorrect);
      
      let correctIdx = options.findIndex(opt => {
         let tmpOptDiv = document.createElement('div');
         tmpOptDiv.innerHTML = opt;
         let plainOpt = tmpOptDiv.textContent || tmpOptDiv.innerText;
         let normOpt = normalizeTextForSearch(plainOpt);
         return normOpt.includes(normCorrect) || normCorrect.includes(normOpt);
      });
      
      if (correctIdx === -1) {
         let tokens = normCorrect.split(' ').filter(t => t.length > 0);
         if (tokens.length > 0) {
             let regexPattern = tokens.join('[\\s\\S]*?');
             let regex = new RegExp(regexPattern, 'i');
             correctIdx = options.findIndex(opt => {
                let tmpOptDiv = document.createElement('div');
                tmpOptDiv.innerHTML = opt;
                let plainOpt = tmpOptDiv.textContent || tmpOptDiv.innerText;
                let normOpt = normalizeTextForSearch(plainOpt);
                return regex.test(normOpt);
             });
         }
      }
      if(correctIdx === -1) correctIdx = 0;
      
      let mappedOptions = options.map((opt, idx) => {
          let text = opt;
          if (idx !== correctIdx) {
              text = stripHighlight(text);
          }
          return { text: text, isCorrect: idx === correctIdx };
      });
      mappedOptions.sort(() => 0.5 - Math.random());
      options = mappedOptions.map(o => o.text);
      correctAns = mappedOptions.find(o => o.isCorrect).text;
      
      html += `
        <div class="quiz-q-box" id="quiz-q-${index}" data-correct="${options.indexOf(correctAns)}">
          <div class="quiz-q-num">Câu ${index + 1}</div>
          <div class="quiz-q-text">${finalQHtml}</div>
          <div class="quiz-options">
      `;
      options.forEach((opt, optIdx) => {
        html += `
          <label class="quiz-opt-label" id="lbl-q${index}-opt${optIdx}">
            <input type="radio" name="q_${index}" value="${optIdx}">
            <span class="opt-text">${opt}</span>
          </label>
        `;
      });
      let ansHtml = qObj.answer.replace(/(<div class="answer-title">[\s\S]*?<\/div>)([\s\S]*?)(?=<div|$)/i, function(match, p1, p2) {
          if(p2.trim()) {
              return p1 + `<div class="answer-text" style="flex: 1; line-height: 1.6; padding-top: 2px;">${p2}</div>`;
          }
          return match;
      });

      html += `</div>
        <div class="answer quiz-explanation" id="quiz-exp-${index}">
          ${ansHtml}
        </div>
      </div>`;
    });
    
    html += `<div class="quiz-actions"><button class="btn-submit-quiz" id="btnSubmitQuiz" onclick="submitQuiz()">Nộp Bài (Chấm Điểm)</button></div>`;
    document.getElementById('quiz-content').innerHTML = html;
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') { MathJax.typesetPromise(); }
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function submitQuiz() {
    let score = 0;
    let wrongIndices = [];
    
    quizQuestions.forEach((card, index) => {
      let qBox = document.getElementById(`quiz-q-${index}`);
      let correctIdx = parseInt(qBox.dataset.correct);
      let selected = document.querySelector(`input[name="q_${index}"]:checked`);
      
      document.getElementById(`lbl-q${index}-opt${correctIdx}`).classList.add('correct');
      
      if(selected) {
        let selectedIdx = parseInt(selected.value);
        if(selectedIdx === correctIdx) {
          score++;
        } else {
          document.getElementById(`lbl-q${index}-opt${selectedIdx}`).classList.add('wrong');
          wrongIndices.push(index);
          qBox.classList.add('is-wrong');
        }
      } else {
        wrongIndices.push(index);
        qBox.classList.add('is-wrong');
      }
      
      qBox.querySelectorAll('input').forEach(inp => inp.disabled = true);
      document.getElementById(`quiz-exp-${index}`).style.display = 'flex';
      qBox.classList.add('show-hints');
    });
    
    document.getElementById('btnSubmitQuiz').style.display = 'none';
    saveHistory(score, quizQuestions.length);
    
    let summary = document.getElementById('quiz-result-summary');
    summary.style.display = 'block';
    let score10 = ((score / quizQuestions.length) * 10).toFixed(1);
    summary.innerHTML = `
      <div>🎯 Điểm của bạn: <span style="color:var(--primary);font-size:1.5em;">${score10} / 10</span></div>
      <div style="font-size: 0.9em; color: #666; margin-top: 5px;">(Trả lời đúng ${score} / ${quizQuestions.length} câu)</div>
      <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
        ${wrongIndices.length > 0 ? `<button class="btn-filter-wrong" onclick="filterWrongQuestions()">👁️ Chỉ xem ${wrongIndices.length} câu sai</button>` : `<div style="color:var(--success); display:flex; align-items:center;">Tuyệt vời! Bạn làm đúng hết!</div>`}
        <button class="btn-continue-quiz" onclick="showQuizModal()">🔄 Luyện tiếp</button>
      </div>
    `;
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function filterWrongQuestions() {
    quizQuestions.forEach((card, index) => {
      let qBox = document.getElementById(`quiz-q-${index}`);
      if(!qBox.classList.contains('is-wrong')) {
        qBox.style.display = 'none';
      }
    });
}

// LỊCH SỬ LÀM BÀI LOGIC (LOCAL STORAGE)
function getSubjectKey() {
    if (typeof QS_DATA_URL !== 'undefined') {
        return 'tvu_history_' + QS_DATA_URL.replace(/[^a-zA-Z0-9]/g, '_');
    }
    return 'tvu_history_' + document.title.replace(/[^a-zA-Z0-9]/g, '_');
}

function saveHistory(score, total) {
    const key = getSubjectKey();
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    const now = new Date();
    history.push({
      date: now.toLocaleString('vi-VN'),
      timestamp: now.getTime(),
      score: score,
      total: total,
      percent: Math.round((score / total) * 100)
    });
    localStorage.setItem(key, JSON.stringify(history));
}

function renderHistory() {
    const key = getSubjectKey();
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    let modal = document.getElementById('history-modal');
    if (!modal) {
        alert("Chưa cài đặt UI Lịch sử cho trang này!");
        return;
    }
    
    let contentHtml = '<h2 style="margin-top:0; color:var(--primary); font-size:1.5rem;">📈 Lịch sử thi thử</h2>';
    contentHtml += '<p style="color:var(--muted); font-size:0.9em; margin-bottom:20px;">💡 Theo dõi sự tiến bộ của bạn qua các lần thi thử. Hãy cố gắng duy trì mức điểm Tốt (màu xanh lá).</p>';
    
    if (history.length === 0) {
      contentHtml += '<p style="color:#666;">Bạn chưa có lịch sử làm bài nào cho môn này.</p>';
    } else {
      contentHtml += `
        <div style="max-height: 250px; overflow-y: auto; margin-bottom: 20px; border-radius: 8px; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.9em;">
            <thead style="background: #f8f9fa; position: sticky; top: 0;">
              <tr>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Lần</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Thời gian</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Điểm (Hệ 10)</th>
                <th style="padding: 10px; border-bottom: 2px solid #ddd;">Câu đúng</th>
              </tr>
            </thead>
            <tbody>
      `;
      history.forEach((h, i) => {
        let color = h.percent >= 80 ? 'var(--success)' : (h.percent >= 50 ? '#f39c12' : '#e74c3c');
        let score10 = ((h.score / h.total) * 10).toFixed(1);
        contentHtml += `
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; color:#888;">#${i + 1}</td>
            <td style="padding: 10px; color: #555;">${h.date}</td>
            <td style="padding: 10px; font-weight: 600; color: ${color};">${score10}</td>
            <td style="padding: 10px; font-weight: bold; color: #555;">${h.score}/${h.total}</td>
          </tr>
        `;
      });
      contentHtml += `</tbody></table></div>`;
      
      if (history.length > 1) {
          const w = 320;
          const h = 120;
          const padX = 20;
          const padY = 20;
          let points = history.map((item, idx) => {
              let x = padX + (idx / (history.length - 1)) * (w - 2 * padX);
              let y = h - padY - (item.percent / 100) * (h - 2 * padY);
              return `${x},${y}`;
          }).join(' ');
          
          contentHtml += `
            <div style="text-align: center; margin-top: 15px;">
              <h3 style="font-size: 0.9rem; margin-bottom: 10px; color:#555;">Sự tiến bộ (Điểm hệ 10)</h3>
              <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="border: 1px solid #eaeaea; border-radius: 8px; background: #fafafa; width:100%; max-width:320px;">
                <polyline fill="none" stroke="var(--primary)" stroke-width="3" points="${points}" />
                ${history.map((item, idx) => {
                    let x = padX + (idx / (history.length - 1)) * (w - 2 * padX);
                    let y = h - padY - (item.percent / 100) * (h - 2 * padY);
                    return `<circle cx="${x}" cy="${y}" r="4" fill="#fff" stroke="var(--primary)" stroke-width="2" />`;
                }).join('')}
              </svg>
            </div>
          `;
      }
      contentHtml += `<div style="text-align: center; margin-top: 20px;"><button class="btn-clear-history" onclick="clearHistory()">🗑️ Xóa lịch sử</button></div>`;
    }
    document.getElementById('history-content').innerHTML = contentHtml;
    modal.style.display = 'flex';
}

function closeHistory() {
    let modal = document.getElementById('history-modal');
    if (modal) modal.style.display = 'none';
}

function clearHistory() {
    if(confirm('Bạn có chắc muốn xóa toàn bộ lịch sử thi thử của môn này không?')) {
        const key = getSubjectKey();
        localStorage.removeItem(key);
        renderHistory(); 
    }
}

// ---------------------------------
// QUIZ MODAL LOGIC
// ---------------------------------
function showQuizModal() {
    let modal = document.getElementById('quiz-mode-modal');
    if (!modal) {
        let html = `
        <div id="quiz-mode-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:var(--surface); width:90%; max-width:400px; border-radius:16px; padding:24px; text-align:center; box-shadow:var(--shadow-md); animation: fadeUp 0.3s ease;">
                <h2 style="margin-top:0; color:var(--text); font-size:1.4em;">Chọn chế độ Luyện thi</h2>
                <p style="color:var(--muted); font-size:0.9em; margin-bottom:20px;">Bạn muốn làm bài theo hình thức nào?</p>
                <div style="display:flex; flex-direction:column; gap:12px;">
                    <button onclick="startQuiz('optimized')" style="padding:14px; background:var(--warn-lt); color:var(--warn); border:2px solid var(--warn); border-radius:12px; font-size:1.05em; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center;">
                        <span>🎯 Luyện Tối Ưu (80/20)</span>
                        <span style="font-size:0.75em; font-weight:normal; opacity:0.8; margin-top:4px;">Chỉ bốc câu hỏi trọng tâm, thường ra thi</span>
                    </button>
                    <button onclick="startQuiz('structured')" style="padding:14px; background:var(--primary-lt); color:var(--primary); border:2px solid var(--primary); border-radius:12px; font-size:1.05em; font-weight:700; cursor:pointer; display:flex; flex-direction:column; align-items:center;">
                        <span>📑 Luyện Cấu Trúc Đề</span>
                        <span style="font-size:0.75em; font-weight:normal; opacity:0.8; margin-top:4px;">Bốc theo cấu trúc chương/dạng bài chuẩn</span>
                    </button>
                </div>
                <button onclick="document.getElementById('quiz-mode-modal').style.display='none'" style="margin-top:20px; padding:8px 20px; background:transparent; border:none; color:var(--muted); font-weight:600; cursor:pointer;">Hủy bỏ</button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        modal = document.getElementById('quiz-mode-modal');
    }
    modal.style.display = 'flex';
}

// ---------------------------------
// KNOWLEDGE BASE LOGIC (19 Components & 6D Matrix)
// ---------------------------------
window.kbData = [];
window.kbRendered = false;

async function renderKnowledgeBase() {
    if (window.kbRendered) return;
    const kbContainer = document.getElementById('knowledge-content');
    if (!kbContainer) return;

    try {
        let kbUrl = 'kb.json'; // Link to kb.json in the same directory as the HTML file
        if (typeof KB_DATA_URL !== 'undefined') kbUrl = KB_DATA_URL; 
        
        const res = await fetch(kbUrl + "?t=" + new Date().getTime());
        if (!res.ok) throw new Error("Could not fetch " + kbUrl);
        window.kbData = await res.json();
        
        let html = '';
        window.kbData.forEach((chapter, index) => {
            let chapterId = 'kb-chap-' + index;
            html += `
            <div class="kb-section">
                <div class="kb-header" onclick="toggleKb('${chapterId}')">
                    <span>📚 ${chapter.title}</span>
                    <span>▼</span>
                </div>
                <div class="kb-content" id="${chapterId}">
            `;
            
            if (chapter.blocks && chapter.blocks.length > 0) {
                chapter.blocks.forEach(block => {
                    html += renderKbBlock(block);
                });
            }
            
            html += `
                </div>
            </div>`;
        });
        
        kbContainer.innerHTML = html;
        window.kbRendered = true;
        
        // Setup interactive listeners
        setupKbInteractions(kbContainer);

    } catch (e) {
        console.error("Knowledge Base Error:", e);
        kbContainer.innerHTML = `<div style="padding:20px; color:var(--warn); text-align:center;">Chưa có dữ liệu Kiến thức nền (kb.json) cho môn này.</div>`;
    }
}

function renderKbBlock(block) {
    let type = block.type;
    switch(type) {
        case 'vs-wrap':
            let leftTitle = block.titleA || (block.content && block.content.left && block.content.left.title) || 'Vấn đề A';
            let leftDesc = block.descA || (block.content && block.content.left && block.content.left.items ? block.content.left.items.join('<br>') : '');
            let rightTitle = block.titleB || (block.content && block.content.right && block.content.right.title) || 'Vấn đề B';
            let rightDesc = block.descB || (block.content && block.content.right && block.content.right.items ? block.content.right.items.join('<br>') : '');
            let conclusion = (block.content && block.content.conclusion) ? `<div style="text-align:center; margin-top:10px; font-weight:bold; color:var(--primary); font-size:0.9em;">💡 ${block.content.conclusion}</div>` : '';
            return `
            <div class="kb-vs-wrap">
                <div class="kb-vs-card green">
                    <div class="vs-title">🟢 ${leftTitle}</div>
                    <div class="vs-body">${leftDesc}</div>
                </div>
                <div class="kb-vs-badge pulseBadge">VS</div>
                <div class="kb-vs-card amber">
                    <div class="vs-title">🔴 ${rightTitle}</div>
                    <div class="vs-body">${rightDesc}</div>
                </div>
            </div>
            ${conclusion}`;

        case 'venn-diagram':
            let vTitleA = block.titleA || (block.content && block.content.setA && block.content.setA.name) || 'Tập hợp A';
            let vDescA = block.descA || (block.content && block.content.setA && block.content.setA.attributes ? block.content.setA.attributes.join('<br>') : '');
            let vTitleB = block.titleB || (block.content && block.content.setB && block.content.setB.name) || 'Tập hợp B';
            let vDescB = block.descB || (block.content && block.content.setB && block.content.setB.attributes ? block.content.setB.attributes.join('<br>') : '');
            let vOverlap = block.overlap || (block.content && block.content.intersection ? block.content.intersection.join('<br>') : '');
            return `
            <div class="kb-venn">
                <div class="kb-venn-circle left">
                    <div class="kb-venn-title">${vTitleA}</div>
                    <div class="kb-venn-desc" style="font-size:0.8em; font-weight:normal; margin-top:4px;">${vDescA}</div>
                </div>
                <div class="kb-venn-circle right">
                    <div class="kb-venn-title">${vTitleB}</div>
                    <div class="kb-venn-desc" style="font-size:0.8em; font-weight:normal; margin-top:4px;">${vDescB}</div>
                </div>
                <div class="kb-venn-overlap kb-interactive" data-action="reveal-venn">
                    <div class="kb-venn-overlap-text hidden-content" style="font-size:0.8em;">${vOverlap}</div>
                    <div class="kb-venn-overlap-hint">???</div>
                </div>
            </div>`;

        case 'mindmap':
            let mmNodes = (block.content && block.content.nodes) ? block.content.nodes : (block.nodes || []);
            let mmConns = (block.content && block.content.connections) ? block.content.connections : [];
            let mmHtml = mmNodes.map(n => `<div style="padding:8px 14px; background:var(--bg); border:1px solid var(--border); border-radius:20px; font-weight:600; font-size:0.9em; display:inline-block;">📌 ${n}</div>`).join('');
            let connHtml = mmConns.map(c => `<div style="font-size:0.85em; color:var(--muted); margin:4px 0;">⚡ <b>${c.from}</b> ➔ <b>${c.to}</b>: ${c.label}</div>`).join('');
            return `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px; margin:15px 0;">
                <div style="font-weight:700; margin-bottom:12px; color:var(--primary);">🗺️ ${block.title || 'Sơ đồ tư duy'}</div>
                <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">${mmHtml}</div>
                ${connHtml ? `<div style="border-top:1px dashed var(--border); padding-top:8px;">${connHtml}</div>` : ''}
            </div>`;

        case 'pyramid':
            let levels = (block.content && block.content.levels) ? block.content.levels : [];
            let context = (block.content && block.content.context) ? block.content.context : '';
            let pyrHtml = levels.map((lvl, idx) => {
                let width = 100 - (idx * 15);
                return `<div class="kb-pyr-level" style="width:${width}%; margin:4px auto; padding:8px 12px; text-align:center; background:linear-gradient(135deg, var(--primary), var(--secondary)); color:white; border-radius:6px; font-weight:600; font-size:0.9em;">${lvl}</div>`;
            }).reverse().join('');
            return `
            <div style="margin:20px 0; text-align:center;">
                <div style="font-weight:700; margin-bottom:10px; color:var(--primary);">🔺 ${block.title || 'Mô hình tháp'}</div>
                <div style="display:flex; flex-direction:column; align-items:center;">${pyrHtml}</div>
                ${context ? `<div style="font-size:0.85em; color:var(--muted); margin-top:8px;">${context}</div>` : ''}
            </div>`;

        case 'formula-breakdown':
            let formStr = block.formula || (block.content && block.content.formula) || '';
            let varsList = block.variables || (block.content && block.content.variables) || [];
            let exp = (block.content && block.content.explanation) || block.explanation || '';
            let varsHtml = varsList.map(v => `<div class="kb-formula-part"><b>${v.symbol}</b>: ${v.meaning || v.desc}</div>`).join('');
            return `
            <div class="kb-formula">
                <div style="font-weight:700; margin-bottom:8px; color:var(--primary);">🧮 ${block.title || 'Công thức'}</div>
                <div class="kb-formula-main">${formStr}</div>
                <div class="kb-formula-parts">${varsHtml}</div>
                ${exp ? `<div style="font-size:0.85em; color:var(--muted); margin-top:8px; line-height:1.4;">${exp}</div>` : ''}
            </div>`;

        case 'process-steps':
            let steps = (block.content && block.content.steps) ? block.content.steps : [];
            let stepsHtml = steps.map(s => `
                <div style="display:flex; gap:12px; align-items:flex-start; margin-bottom:10px;">
                    <div style="background:var(--primary); color:white; width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:0.8em; flex-shrink:0;">${s.step}</div>
                    <div>
                        <div style="font-weight:700; font-size:0.95em;">${s.name}</div>
                        <div style="font-size:0.85em; color:var(--muted);">${s.desc}</div>
                    </div>
                </div>
            `).join('');
            return `
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px; margin:15px 0;">
                <div style="font-weight:700; margin-bottom:12px; color:var(--primary);">🔄 ${block.title || 'Quy trình'}</div>
                ${stepsHtml}
            </div>`;

        case 't-account':
            let leftHeader = (block.content && block.content.left && block.content.left.header) || 'Bên Trái';
            let leftEntries = (block.content && block.content.left && block.content.left.entries) || [];
            let rightHeader = (block.content && block.content.right && block.content.right.header) || 'Bên Phải';
            let rightEntries = (block.content && block.content.right && block.content.right.entries) || [];
            let summary = (block.content && block.content.summary) || '';
            let lHtml = leftEntries.map(e => `<div class="kb-t-row"><span>${typeof e === 'string' ? e : e.text}</span></div>`).join('');
            let rHtml = rightEntries.map(e => `<div class="kb-t-row"><span>${typeof e === 'string' ? e : e.text}</span></div>`).join('');
            return `
            <div class="kb-t-account">
                <div class="kb-t-header">${block.title || 'Tài khoản T'}</div>
                <div class="kb-t-body">
                    <div class="kb-t-side debit">
                        <div class="kb-t-title">${leftHeader}</div>
                        ${lHtml}
                    </div>
                    <div class="kb-t-side credit">
                        <div class="kb-t-title">${rightHeader}</div>
                        ${rHtml}
                    </div>
                </div>
                ${summary ? `<div style="padding:10px; font-size:0.85em; text-align:center; color:var(--muted); font-style:italic;">${summary}</div>` : ''}
            </div>`;

        case 'matrix-table':
            let headers = (block.content && block.content.headers) ? block.content.headers : [];
            let rows = (block.content && block.content.rows) ? block.content.rows : [];
            let thHtml = headers.map(h => `<th style="padding:8px; border:1px solid var(--border); background:var(--bg); font-weight:700;">${h}</th>`).join('');
            let trHtml = rows.map(r => `<tr>${r.map(c => `<td style="padding:8px; border:1px solid var(--border); font-size:0.9em;">${c}</td>`).join('')}</tr>`).join('');
            return `
            <div style="margin:15px 0; overflow-x:auto;">
                <div style="font-weight:700; margin-bottom:8px; color:var(--primary);">📊 ${block.title || 'Bảng tổng hợp'}</div>
                <table style="width:100%; border-collapse:collapse;">
                    <thead><tr>${thHtml}</tr></thead>
                    <tbody>${trHtml}</tbody>
                </table>
            </div>`;

        case 'timeline':
            let events = (block.content && block.content.events) ? block.content.events : [];
            let tlHtml = events.map(ev => `
                <div class="kb-tl-item">
                    <div class="kb-tl-content">
                        <div class="kb-tl-title">⏳ ${ev.time}</div>
                        <div class="kb-tl-desc">${ev.desc}</div>
                    </div>
                </div>
            `).join('');
            return `
            <div style="margin:15px 0;">
                <div style="font-weight:700; margin-bottom:8px; color:var(--primary);">📅 ${block.title || 'Dòng thời gian'}</div>
                <div class="kb-timeline">${tlHtml}</div>
            </div>`;

        case 'flip-card':
            let frontText = block.front || (block.content && block.content.front) || '';
            let backText = block.back || (block.content && block.content.back) || '';
            return `
            <div class="kb-flip-wrap" style="margin:15px 0;">
                <div style="font-weight:700; margin-bottom:6px; color:var(--primary);">🃏 ${block.title || 'Thẻ lật (Bấm để lật)'}</div>
                <div class="kb-flip-card kb-interactive" data-action="flip" onclick="this.classList.toggle('flipped')">
                    <div class="kb-flip-inner">
                        <div class="kb-flip-front" style="padding:15px; background:var(--surface); border:2px dashed var(--primary); border-radius:12px; text-align:center;">
                            <p style="font-weight:600; margin:0;">${frontText}</p>
                        </div>
                        <div class="kb-flip-back" style="padding:15px; background:var(--primary-lt); border:2px solid var(--primary); border-radius:12px; text-align:center;">
                            <p style="margin:0; white-space:pre-line;">${backText}</p>
                        </div>
                    </div>
                </div>
            </div>`;

        default:
            let defaultContent = typeof block.content === 'object' ? JSON.stringify(block.content, null, 2) : (block.content || '');
            return `<div style="padding:15px; border-left:4px solid var(--primary); background:white; margin:15px 0; border-radius:8px;">
                <div style="font-weight:700; margin-bottom:4px;">${block.title || ''}</div>
                <pre style="white-space:pre-wrap; font-family:inherit; font-size:0.9em; margin:0;">${defaultContent}</pre>
            </div>`;
    }
}

function setupKbInteractions(container) {
    container.addEventListener('click', function(e) {
        let interactiveEl = e.target.closest('.kb-interactive');
        if (!interactiveEl) return;
        
        let action = interactiveEl.getAttribute('data-action');
        
        if (action === 'cloze') {
            interactiveEl.style.background = '';
            interactiveEl.style.color = '';
            let hint = interactiveEl.querySelector('.cloze-hint');
            if (hint) hint.remove();
        }
        else if (action === 'reveal-venn') {
            let hint = interactiveEl.querySelector('.kb-venn-overlap-hint');
            let text = interactiveEl.querySelector('.kb-venn-overlap-text');
            if (hint) hint.style.display = 'none';
            if (text) text.classList.remove('hidden-content');
        }
    });
}
