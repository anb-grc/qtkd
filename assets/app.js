// Global variables for Data-Driven Rendering
window.quizData = [];
window.filteredData = [];
window.activeTagFilters = new Set();
window.currentRendered = 0;
window.currentLimit = 15;
window.practiceMode = 'mcq';


function isEssayQuestion(q) {
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
    return isEssay;
}

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

function toggleTagsDropdown() {
    let list = document.getElementById('tagsDropdownList');
    if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }
}

function toggleTagCheckbox(cb) {
    let tag = cb.value;
    if (cb.checked) {
        window.activeTagFilters.add(tag);
    } else {
        window.activeTagFilters.delete(tag);
    }
    
    let label = document.getElementById('tagsDropdownLabel');
    if (label) {
        if (window.activeTagFilters.size === 0) {
            label.innerText = 'Tất cả';
        } else {
            label.innerText = `Đã chọn (${window.activeTagFilters.size})`;
        }
    }
    
    filterQuestions();
}

document.addEventListener('click', function(e) {
    let container = document.getElementById('tagsDropdownContainer');
    if (container && !container.contains(e.target)) {
        let list = document.getElementById('tagsDropdownList');
        if (list) list.style.display = 'none';
    }
});

function buildFilterUI(data) {
    let wrap = document.querySelector('.search-wrap');
    if (!wrap) return;
    
    if (document.getElementById('tagsDropdownContainer')) return; // Đã build rồi thì không build lại

    // Auto-switch practice mode if there are NO mcqs or NO essays
    if (!window._hasAutoSwitchedMode) {
        window._hasAutoSwitchedMode = true;
        let hasMcq = data.some(q => !isEssayQuestion(q));
        let hasEssay = data.some(q => isEssayQuestion(q));
        if (hasEssay && !hasMcq) {
            window.practiceMode = 'essay';
        } else {
            window.practiceMode = 'mcq';
        }
    }

    
    // Thu thập tất cả tags từ data
    let allTags = new Set();
    data.forEach(q => {
        if(q.tags && Array.isArray(q.tags)) {
            q.tags.forEach(t => allTags.add(t));
        }
    });
    
    const fwTags = [
        'Nền tảng', '[Nền tảng]', 'Cấu trúc', '[Cấu trúc]',
        'Hệ thống', '[Hệ thống]', 'Phân luồng', '[Phân luồng]',
        'Logic & Nguyên tắc', '[Logic & Nguyên tắc]',
        'Giới hạn & Rủi ro', '[Giới hạn & Rủi ro]',
        'Góc nhìn Đa chiều', '[Góc nhìn Đa chiều]', 'Góc nhìn đa chiều', '[Góc nhìn đa chiều]'
    ];
    
    let tagsArr = Array.from(allTags).sort().filter(t => {
        if (t === 'Mẫu' || t === 'Kiến thức') return true;
        return fwTags.includes(t);
    });
    
    let tagsHtml = `
        <div id="tagsDropdownContainer" style="position: relative; flex-shrink: 0;">
            <button id="tagsDropdownBtn" onclick="toggleTagsDropdown()" style="padding: 6px 8px; border-radius: var(--r); border: 1px solid var(--border); background: var(--surface); color: var(--text); font-family: inherit; font-size: 0.85em; display: flex; align-items: center; gap: 6px; box-shadow: var(--shadow); cursor: pointer; transition: all 0.2s; white-space: nowrap;">
                <span id="tagsDropdownLabel">Tất cả</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div id="tagsDropdownList" style="display: none; position: absolute; top: 100%; left: 0; min-width: 220px; margin-top: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; max-height: 280px; overflow-y: auto; padding: 6px;">
    `;
    
    const exactOrder = [
        'Mẫu', 'Kiến thức',
        'Nền tảng', '[Nền tảng]', 
        'Cấu trúc', '[Cấu trúc]',
        'Hệ thống', '[Hệ thống]', 
        'Phân luồng', '[Phân luồng]',
        'Logic & Nguyên tắc', '[Logic & Nguyên tắc]',
        'Giới hạn & Rủi ro', '[Giới hạn & Rủi ro]',
        'Góc nhìn Đa chiều', '[Góc nhìn Đa chiều]', 'Góc nhìn đa chiều', '[Góc nhìn đa chiều]'
    ];
    
    let sortedTags = tagsArr.sort((a, b) => {
        let idxA = exactOrder.indexOf(a);
        let idxB = exactOrder.indexOf(b);
        if (idxA === -1) idxA = 999;
        if (idxB === -1) idxB = 999;
        if (idxA !== idxB) return idxA - idxB;
        return a.localeCompare(b);
    });
    
    sortedTags.forEach(t => {
        let isActive = window.activeTagFilters.has(t);
        tagsHtml += `
                <label class="tag-checkbox-label" style="display: flex; align-items: center; padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; margin-bottom: 2px;">
                    <input type="checkbox" value="${t}" ${isActive ? 'checked' : ''} onchange="toggleTagCheckbox(this)" style="margin-right: 10px; transform: scale(1.1); accent-color: var(--primary); cursor: pointer;">
                    <span style="font-size: 0.9em; color: var(--text); font-weight: 500;">${t}</span>
                </label>
        `;
    });
    tagsHtml += `
            </div>
        </div>
    `;
    
    let currentLabel = "15 câu";
    if (window.currentLimitValue === "all") currentLabel = "Tất cả";
    else if (window.currentLimitValue) currentLabel = window.currentLimitValue + " câu";
    
    let limitHtml = `
        <div id="limitDropdownContainer" style="position: relative; display: inline-block; flex-shrink: 0;">
            <button id="limitDropdownBtn" onclick="toggleLimitDropdown()" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 12px; background: var(--surface); color: var(--text); border: 1px solid var(--border); border-radius: var(--r); cursor: pointer; font-size: 0.85em; font-weight: 500; gap: 8px;">
                <span id="limitDropdownLabel" style="white-space: nowrap;">${currentLabel}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div id="limitDropdownList" style="display: none; position: absolute; top: 100%; left: 0; min-width: 100px; margin-top: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100; padding: 6px;">
                <div class="limit-option" onclick="selectLimit('5', '5 câu')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">5 câu</div>
                <div class="limit-option" onclick="selectLimit('10', '10 câu')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">10 câu</div>
                <div class="limit-option" onclick="selectLimit('15', '15 câu')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">15 câu</div>
                <div class="limit-option" onclick="selectLimit('20', '20 câu')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">20 câu</div>
                <div class="limit-option" onclick="selectLimit('40', '40 câu')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">40 câu</div>
                <div class="limit-option" onclick="selectLimit('all', 'Tất cả')" style="padding: 8px 10px; cursor: pointer; border-radius: 6px; transition: background 0.2s; font-size: 0.9em; font-weight: 500;">Tất cả</div>
            </div>
        </div>
    `;
    
    let controlsHtml = `
        <div style="display:flex; gap:6px; margin-top:12px; flex-wrap:wrap; width:100%; align-items:center; overflow: visible; padding-bottom: 2px;">
            ${tagsHtml}
            ${limitHtml}
            <div style="flex: 1; min-width: 10px;"></div>
            <div style="display:flex; gap:0px; align-items:center; flex-shrink: 0; margin-left: auto; flex-wrap: nowrap; justify-content: flex-end;">
                <!-- Nhóm 3 nút Filter/Mode -->
                <button id="toggleOptionsBtn" class="bottom-icon-btn" onclick="toggleMcqOptions()" title="Ẩn/Hiện 4 đáp án" style="padding:4px; border:none; background:transparent; color: ${window.showMcqOptions ? 'var(--warn)' : 'var(--text)'}; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg id="icon-eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: ${window.showMcqOptions ? 'block' : 'none'};">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    <svg id="icon-eye-closed" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: ${window.showMcqOptions ? 'none' : 'block'};">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                </button>
                <button id="btnModeMcq" class="bottom-icon-btn" onclick="setPracticeMode('mcq')" title="Trắc nghiệm" style="padding:4px; border:none; background:transparent; color: ${window.practiceMode === 'mcq' ? 'var(--warn)' : 'var(--text)'}; cursor:pointer; display: flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
                </button>
                <button id="btnModeEssay" class="bottom-icon-btn" onclick="setPracticeMode('essay')" title="Tự luận" style="padding:4px; border:none; background:transparent; color: ${window.practiceMode === 'essay' ? 'var(--warn)' : 'var(--text)'}; cursor:pointer; display: flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>

                

                <!-- Nhóm 3 nút Chức năng -->
                <button id="sortBtn" class="bottom-icon-btn" onclick="sortQuestions()" title="Trọng tâm" style="padding:4px; border:none; background:transparent; color: ${window.isHighSorted ? 'var(--warn)' : 'var(--text)'}; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                </button>
                <button id="modeBtn" class="bottom-icon-btn" onclick="toggleKeywordMode()" title="Keyword" style="padding:4px; border:none; background:transparent; color: ${window.isKeywordMode ? 'var(--warn)' : 'var(--text)'}; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                </button>
                <button id="printBtn" class="bottom-icon-btn" onclick="window.print()" title="In" style="padding:4px; border:none; background:transparent; color: var(--text); cursor:pointer; display:flex; align-items:center; justify-content:center; transition: color 0.2s;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                </button>
            </div>
        </div>
    `;
    
    // Inject controls into search-wrap
    let div = document.createElement('div');
    div.style.width = '100%';
    div.innerHTML = controlsHtml;
    wrap.appendChild(div);
}

window.isKeywordMode = false;
function toggleKeywordMode() {
    window.isKeywordMode = !window.isKeywordMode;
    const btn = document.getElementById('modeBtn');
    if (window.isKeywordMode) {
        btn.style.color = 'var(--warn)';
        document.body.classList.add('keyword-mode-active');
    } else {
        btn.style.color = 'var(--text)';
        document.body.classList.remove('keyword-mode-active');
    }
}
function stripHighlight(htmlStr) {
    let tmp = document.createElement('div');
    tmp.innerHTML = htmlStr;
    let tags = tmp.querySelectorAll('.answer-keyword, .keyword, b, strong');
    tags.forEach(t => {
        let textNode = document.createTextNode(t.textContent);
        t.parentNode.replaceChild(textNode, t);
    });
    return tmp.innerHTML;
}

function extractKeywords(htmlStr, isAnswer) {
    let div = document.createElement('div');
    div.innerHTML = htmlStr;
    let keywords = [];
    let selector = isAnswer ? '.answer-keyword' : '.keyword';
    let nodes = div.querySelectorAll(selector);
    
    if (nodes.length === 0) {
        if (isAnswer) {
            let note = div.querySelector('.note');
            if(note) note.remove();
            return div.innerHTML;
        }
        return htmlStr;
    }
    
    nodes.forEach(node => {
        keywords.push(`<span class="${node.className}">${node.innerHTML}</span>`);
    });
    
    let prefix = isAnswer ? '<div class="answer-title">✅ </div>' : '';
    return prefix + keywords.join(' ... ');
}

function toggleLimitDropdown() {
    let list = document.getElementById('limitDropdownList');
    if (list) {
        list.style.display = list.style.display === 'none' ? 'block' : 'none';
    }
}

function selectLimit(val, label) {
    window.currentLimitValue = val;
    let lblElement = document.getElementById('limitDropdownLabel');
    if (lblElement) lblElement.innerText = label;
    
    if (val === 'all') {
        window.currentLimit = window.filteredData.length;
    } else {
        window.currentLimit = parseInt(val);
    }
    
    let list = document.getElementById('limitDropdownList');
    if (list) list.style.display = 'none';
    
    window.currentRendered = 0;
    document.getElementById('questions-list').innerHTML = '';
    renderBatch();
}

function changeLimit() {
    // Deprecated native select change
}

// Sắp xếp: toggle High↑ (high trước) ↔ Low↑ (low trước)
window.currentSortDir = 'high-first';
window.isHighSorted = false;
function sortQuestions() {
    window.isHighSorted = !window.isHighSorted;
    const btn = document.getElementById('sortBtn');
    if (window.isHighSorted) {
        btn.style.color = 'var(--warn)';
        document.body.classList.add('sort-high-active');
    } else {
        btn.style.color = 'var(--text)';
        document.body.classList.remove('sort-high-active');
    }
    filterQuestions();
}

window.showMcqOptions = true;
function toggleMcqOptions() {
    window.showMcqOptions = !window.showMcqOptions;
    const btn = document.getElementById('toggleOptionsBtn');
    const iconOpen = document.getElementById('icon-eye-open');
    const iconClosed = document.getElementById('icon-eye-closed');
    
    if (window.showMcqOptions) {
        document.body.classList.remove('hide-mcq-options');
        if(btn) btn.style.color = 'var(--warn)';
        if(iconOpen) iconOpen.style.display = 'block';
        if(iconClosed) iconClosed.style.display = 'none';
    } else {
        document.body.classList.add('hide-mcq-options');
        if(btn) btn.style.color = 'var(--text)';
        if(iconOpen) iconOpen.style.display = 'none';
        if(iconClosed) iconClosed.style.display = 'block';
    }
}

function setPracticeMode(mode) {
    window.practiceMode = mode;
    const btnMcq = document.getElementById('btnModeMcq');
    const btnEssay = document.getElementById('btnModeEssay');
    if (btnMcq && btnEssay) {
        if (mode === 'mcq') {
            btnMcq.style.color = 'var(--warn)';
            btnEssay.style.color = 'var(--text)';
        } else {
            btnEssay.style.color = 'var(--warn)';
            btnMcq.style.color = 'var(--text)';
        }
    }
    filterQuestions();
}

function filterQuestions() {
    const rawQuery = document.getElementById('searchBox').value;
    const query = normalizeTextForSearch(rawQuery);
    const tagFilter = document.getElementById('tagFilter') ? document.getElementById('tagFilter').value : 'all';
    
    let baseFiltered = window.quizData.filter(q => {
        let matchSearch = true;
        let matchTag = true;
        q._searchScore = 0;
        
        if (query.length > 0) {
            let normQ = normalizeTextForSearch(q.question || '');
            let normOpt = normalizeTextForSearch(q.options ? q.options.join(" ") : "");
            let normAns = normalizeTextForSearch(q.answer || '');
            let normFull = normQ + " " + normOpt + " " + normAns;
            
            // Logic tìm kiếm đa từ khoá (AND)
            let terms = query.split(/\s+/).filter(t => t.length > 0);
            matchSearch = terms.every(term => normFull.includes(term));
            
            if (matchSearch) {
                // Điểm Exact Match
                if (normFull.includes(query)) {
                    q._searchScore += 1000;
                    if (normQ.includes(query)) q._searchScore += 500; // Ưu tiên xuất hiện ở câu hỏi
                }
                // Điểm Scattered Match (Trọng số theo vùng)
                terms.forEach(term => {
                    if (normQ.includes(term)) q._searchScore += 20;
                    else if (normOpt.includes(term)) q._searchScore += 5;
                    else if (normAns.includes(term)) q._searchScore += 5;
                });
            }
        }
        
        if (window.activeTagFilters && window.activeTagFilters.size > 0) {
            matchTag = false;
            if (q.tags && Array.isArray(q.tags)) {
                for (let t of window.activeTagFilters) {
                    if (q.tags.includes(t)) {
                        matchTag = true;
                        break;
                    }
                }
            }
        }
        
        let matchMode = true;
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
        
        return matchSearch && matchTag;
    });

    // 2. Map and Convert if PracticeMode == 'essay'
    window.filteredData = [];
    baseFiltered.forEach(q => {
        let isNativeEssay = isEssayQuestion(q);
        
        if (window.practiceMode === 'mcq') {
            if (!isNativeEssay) window.filteredData.push(q);
        } else if (window.practiceMode === 'essay') {
            if (isNativeEssay) {
                window.filteredData.push(JSON.parse(JSON.stringify(q)));
            } else {
                let displayQ = q.question || '';
                let qTextLower = displayQ.toLowerCase();
                let isExclude = qTextLower.includes('sau đây') || 
                                qTextLower.includes('dưới đây') || 
                                qTextLower.includes('ngoại trừ') || 
                                qTextLower.includes('câu sai') ||
                                qTextLower.includes('không phải là') ||
                                qTextLower.includes('đúng nhất');
                
                if (!isExclude) {
                    let clonedQ = JSON.parse(JSON.stringify(q));
                    if (!clonedQ.answer.includes('answer-keyword') && !clonedQ.answer.includes('keyword')) {
                        let correctAnsRaw = extractRawAnswerData(clonedQ);
                        let options = clonedQ.options || [];
                        options = options.map(opt => opt.replace(/^((?:<[^>]+>\s*)*)[A-D][\.\)]\s*(?:<br\s*\/?>\s*)?/i, '$1').trim());
                        let tmpCorrectDiv = document.createElement('div');
                        tmpCorrectDiv.innerHTML = correctAnsRaw;
                        let normCorrect = normalizeTextForSearch(tmpCorrectDiv.textContent || tmpCorrectDiv.innerText);
                        let correctIdx = options.findIndex(opt => {
                             let tmpOptDiv = document.createElement('div');
                             tmpOptDiv.innerHTML = opt;
                             let normOpt = normalizeTextForSearch(tmpOptDiv.textContent || tmpOptDiv.innerText);
                             return normOpt.includes(normCorrect) || normCorrect.includes(normOpt);
                        });
                        if(correctIdx === -1) correctIdx = 0;
                        let correctText = options[correctIdx] || "";
                        let tmpText = document.createElement('div');
                        tmpText.innerHTML = correctText;
                        let cleanText = tmpText.textContent || tmpText.innerText;
                        
                        clonedQ.answer = `<div style="margin-bottom:10px; padding:8px; background:rgba(46, 204, 113, 0.1); border-left:3px solid #2ecc71; border-radius:4px;"><strong>ĐÁP ÁN CỐT LÕI (Auto-extracted):</strong> <span class="answer-keyword">${cleanText}</span></div>` + clonedQ.answer;
                    }
                    clonedQ.options = [];
                    window.filteredData.push(clonedQ);
                }
            }
        }
    });
    
    // Sort logic
    const weightOrder = { high: 0, normal: 1 };
    window.filteredData.sort((a, b) => {
        // 1. Ưu tiên điểm Search (nếu có)
        if (query.length > 0 && b._searchScore !== a._searchScore) {
            return b._searchScore - a._searchScore;
        }
        // 2. Phá hòa (Tie-breaker) bằng Trọng tâm (High) HOẶC nếu user đang bật nút High
        if (query.length > 0 || window.isHighSorted) {
            const wA = weightOrder[a.weight] ?? 1;
            const wB = weightOrder[b.weight] ?? 1;
            if (wA !== wB) return wA - wB;
        }
        return 0;
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
        if(meta) {
            let countToShow = window.filteredData.length;
            if (window.isHighSorted) {
                countToShow = window.filteredData.filter(q => q.weight === 'high' || (q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm')))).length;
            }
            meta.innerHTML = `Tìm thấy <b>${countToShow}</b> câu hỏi.`;
        }
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
        
        let displayQ = q.question || '';
        let cleanQ = displayQ.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');
        let matches = [...cleanQ.matchAll(/A[\.\)](?:\s|&nbsp;|<br|<\/?p>|<span)/g)];
        
        if (matches.length > 0 && !cleanQ.includes('options-grid')) {
            let cutIndex = matches[matches.length - 1].index;
            let questionPart = cleanQ.substring(0, cutIndex).trim();
            questionPart = questionPart.replace(/(<br\s*\/?>\s*)+$/, "");
            let optionsPart = cleanQ.substring(cutIndex).replace(/^(?:<br\s*\/?>\s*)+/i, '');
            
            // Xóa highlight để không lộ đáp án
            optionsPart = stripHighlight(optionsPart);
            
            optionsPart = optionsPart.replace(/([A-D][\.\)])(?:\s|<br\s*\/?>)*/gi, '</div></div><div style="display: flex; align-items: flex-start; margin-bottom: 12px; line-height: 1.5;"><div style="font-weight: 600; color: var(--primary); min-width: 24px; flex-shrink: 0;">$1</div><div>');
            optionsPart = optionsPart.replace(/^(?:<\/div>){1,2}/i, '') + '</div></div>';
            
            displayQ = `<div style="font-weight: 600;">${questionPart}</div><div class="mcq-options-container" style="font-weight: normal; margin-top: 12px;">${optionsPart}</div>`;
        } else if (q.options && q.options.length > 0) {
            let optionsPart = '<div class="options-grid mcq-options-container" style="margin-top: 12px; font-weight: normal;">';
            const labels = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
            q.options.forEach((opt, idx) => {
                let lbl = labels[idx] || '-';
                // Remove A. B. C. D. from start of option if it exists
                let cleanOpt = opt.replace(/^((?:<[^>]+>\s*)*)[A-D][\.\)]\s*(?:<br\s*\/?>\s*)?/i, '$1').trim();
                // Xóa highlight để không lộ đáp án
                cleanOpt = stripHighlight(cleanOpt);
                
                optionsPart += `<div style="display: flex; align-items: flex-start; margin-bottom: 12px; line-height: 1.5;">
                                  <div style="font-weight: 600; color: var(--primary); min-width: 24px; flex-shrink: 0;">${lbl}</div>
                                  <div>${cleanOpt}</div>
                                </div>`;
            });
            optionsPart += '</div>';
            displayQ = `<div style="font-weight: 600;">${cleanQ}</div>${optionsPart}`;
        }


        // Render tags visually with color-coding & Glassmorphism
        let tagsHtml = '';
        if(q.tags && Array.isArray(q.tags)) {
            const fwTags = [
                'Nền tảng', '[Nền tảng]', 'Cấu trúc', '[Cấu trúc]',
                'Hệ thống', '[Hệ thống]', 'Phân luồng', '[Phân luồng]',
                'Logic & Nguyên tắc', '[Logic & Nguyên tắc]',
                'Giới hạn & Rủi ro', '[Giới hạn & Rủi ro]',
                'Góc nhìn Đa chiều', '[Góc nhìn Đa chiều]', 'Góc nhìn đa chiều', '[Góc nhìn đa chiều]'
            ];
            
            let displayTags = q.tags.filter(t => t === 'High' || t === 'Trọng tâm' || t === '80/20' || t === 'Mẫu' || t === 'Kiến thức' || fwTags.includes(t));
            
            if (q.weight === 'high' && !displayTags.includes('High')) {
                displayTags.unshift('High');
            }
            
            let tagsMapHtml = displayTags.map(t => {
                let style = '';
                if(t === 'High' || t === 'Trọng tâm' || t === '80/20') {
                    style = `color: var(--secondary);`;
                } else {
                    style = `color: #74b9ff;`;
                }
                return `<span style="display:inline-block; font-size:0.72em; margin-right:12px; margin-bottom:8px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px; ${style}">${t}</span>`;
            }).join('');
            
            if (displayTags.length > 0) {
                tagsHtml = `<div style="margin-bottom:12px; display:flex; flex-wrap:wrap;">${tagsMapHtml}</div>`;
            }
        }
        
        // Using onclick directly instead of addEventListener for simplicity
        let rawAnswer = q.answer.replace(/(✅|💡)\s*/g, '');
        rawAnswer = rawAnswer.replace(/<div class="answer-title">\s*(Đáp án:\s*)([\s\S]*?)<\/div>/i, function(match, label, content) {
            return `<span class="answer-title">${label.trim()}</span>` + (content.trim() ? ` ${content}` : '');
        });
        let ansHtml = rawAnswer.replace(/(<span class="answer-title">[\s\S]*?<\/span>)([\s\S]*?)(?=<div|$)/i, function(match, p1, p2) {
            if(p2.trim()) {
                return p1 + `<span class="answer-text">${p2}</span>`;
            }
            return match;
        });
        
        let keywordQ = extractKeywords(displayQ, false);
        let keywordA = extractKeywords(ansHtml, true);

        let isEssay = false;
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
        
        let containerStyle = isEssay ? "touch-action: manipulation; user-select: none;" : "";
        let eventHandler = isEssay ? `ondblclick="toggleAnswer(this)"` : `onclick="toggleAnswer(this)"`;

        html += `
        <div class="question-container" ${weightAttr} style="${containerStyle}" ${eventHandler}>
            ${tagsHtml}
            <div class="question" style="font-weight: normal;">
                <div class="q-full-text">${displayQ}</div>
                <div class="q-keyword-only" style="display: none;">${keywordQ}</div>
            </div>
            <div class="answer" style="display: none;">
                <div class="a-full-text">${ansHtml}</div>
                <div class="a-keyword-only" style="display: none;">${keywordA}</div>
            </div>
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
        list.insertAdjacentHTML('beforeend', `<button id="btnLoadMore" onclick="renderBatch()" style="display:block; width:100%; padding:10px; background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:8px; font-weight:bold; cursor:pointer; margin-top:10px; font-size:1em; transition: opacity 0.2s;">Xem thêm ${nextBatchSize} câu nữa (Còn ${remain})</button>`);
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
            let qsData = await res.json();
            
            window.subjectBlueprint = null;
            try {
                let dirPath = QS_DATA_URL.substring(0, QS_DATA_URL.lastIndexOf('/'));
                let bpUrl = dirPath + '/blueprint.json';
                const bpRes = await fetch(bpUrl);
                if (bpRes.ok) {
                    window.subjectBlueprint = await bpRes.json();
                    console.log(`[Hệ thống] Đã tải Ma trận Đề thi (Blueprint):`, window.subjectBlueprint);
                }
            } catch(e) {
                console.warn("[Hệ thống] Không tìm thấy file blueprint.json, lùi về thuật toán cũ.");
            }
            
            let kienThucCount = 0;
            let mauCount = 0;
            
            // Dán nhãn [Mẫu] cho câu hỏi gốc nếu chưa được dán nhãn [Kiến thức]
            qsData.forEach(q => {
                if (!q.tags) q.tags = [];
                if (q.tags.includes('Kiến thức')) {
                    kienThucCount++;
                } else {
                    if (!q.tags.includes('Mẫu')) q.tags.push('Mẫu');
                    mauCount++;
                }
            });
            
            console.log(`[Hệ thống] Đã tải ${mauCount} câu [Mẫu] và ${kienThucCount} câu [Kiến thức].`);
            
            window.quizData = qsData;
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
let quizSubmitted = false;

// Variables for Countdown Timer
let timerInterval = null;
let timeRemaining = 0;

function showToast(msg) {
    let t = document.createElement('div');
    t.style.cssText = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:#fff; padding:10px 20px; border-radius:20px; z-index:99999;";
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2000);
}

function switchMode(mode) {
    if(mode === 'quiz') {
      showQuizModal();
      return;
    }

    stopTimer(); // Always stop timer when leaving quiz mode

    const fabSubmit = document.getElementById('fabSubmit');
    if (fabSubmit) fabSubmit.classList.remove('visible');

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
      const tc = document.getElementById('totalCount');
      if (tc) tc.innerHTML = `Tổng: <span>${window.quizData ? window.quizData.length : 0} câu</span>`;
      if (instEl) instEl.innerHTML = 'Trắc nghiệm: Đọc → Tự nghĩ → CLICK để kiểm tra <br> Tự luận: Đọc → Tự viết → CLICK xem gợi ý';
    } else if(mode === 'knowledge') {
      document.body.classList.add('knowledge-mode');
      if (btnKnowledge) btnKnowledge.classList.add('active');
      const tc = document.getElementById('totalCount');
      if (tc) tc.innerHTML = `Trực quan hóa: <span>Sơ đồ tư duy</span>`;
      if (instEl) instEl.innerHTML = 'Thu phóng: Cuộn chuột hoặc dùng 2 ngón tay <br> Di chuyển: Nhấn giữ & Kéo sơ đồ';
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

function startQuiz(quizMode = 'optimized', quizFormat = 'mcq') {
    window.currentQuizFormat = quizFormat;
    let modal = document.getElementById('quiz-mode-modal');
    if (modal) modal.style.display = 'none';

    stopTimer(); // Ensure previous timer is stopped
    quizSubmitted = false;

    // Lọc bỏ Tự Luận (options rỗng & không chứa format A.) khỏi Thi Thử
    let poolData = [];
    window.quizData.forEach(q => {
        let isNativeEssay = isEssayQuestion(q);
        
        if (quizFormat === 'mcq') {
            if (!isNativeEssay) poolData.push(q);
        } else if (quizFormat === 'essay') {
            if (isNativeEssay) {
                poolData.push(JSON.parse(JSON.stringify(q)));
            } else {
                let displayQ = q.question || '';
                let qTextLower = displayQ.toLowerCase();
                let isExclude = qTextLower.includes('sau đây') || 
                                qTextLower.includes('dưới đây') || 
                                qTextLower.includes('ngoại trừ') || 
                                qTextLower.includes('câu sai') ||
                                qTextLower.includes('không phải là') ||
                                qTextLower.includes('đúng nhất');
                
                if (!isExclude) {
                    let clonedQ = JSON.parse(JSON.stringify(q));
                    if (!clonedQ.answer.includes('answer-keyword') && !clonedQ.answer.includes('keyword')) {
                        let correctAnsRaw = extractRawAnswerData(clonedQ);
                        let options = clonedQ.options || [];
                        options = options.map(opt => opt.replace(/^((?:<[^>]+>\s*)*)[A-D][\.\)]\s*(?:<br\s*\/?>\s*)?/i, '$1').trim());
                        let tmpCorrectDiv = document.createElement('div');
                        tmpCorrectDiv.innerHTML = correctAnsRaw;
                        let normCorrect = normalizeTextForSearch(tmpCorrectDiv.textContent || tmpCorrectDiv.innerText);
                        let correctIdx = options.findIndex(opt => {
                             let tmpOptDiv = document.createElement('div');
                             tmpOptDiv.innerHTML = opt;
                             let normOpt = normalizeTextForSearch(tmpOptDiv.textContent || tmpOptDiv.innerText);
                             return normOpt.includes(normCorrect) || normCorrect.includes(normOpt);
                        });
                        if(correctIdx === -1) correctIdx = 0;
                        let correctText = options[correctIdx] || "";
                        let tmpText = document.createElement('div');
                        tmpText.innerHTML = correctText;
                        let cleanText = tmpText.textContent || tmpText.innerText;
                        
                        clonedQ.answer = `<div style="margin-bottom:10px; padding:8px; background:rgba(46, 204, 113, 0.1); border-left:3px solid #2ecc71; border-radius:4px;"><strong>ĐÁP ÁN CỐT LÕI (Auto-extracted):</strong> <span class="answer-keyword">${cleanText}</span></div>` + clonedQ.answer;
                    }
                    clonedQ.options = [];
                    poolData.push(clonedQ);
                }
            }
        }
    });

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
    if (instEl) instEl.innerHTML = 'Đọc kỹ câu hỏi → Chọn 1 đáp án đúng nhất → Bấm Nộp bài để chấm điểm & xem giải thích';
    
    document.getElementById('quiz-result-summary').style.display = 'none';
    
    let selected = [];
    const totalQuestions = window.selectedQuizCount || ((window.subjectConfig && window.subjectConfig.quizTotal) ? window.subjectConfig.quizTotal : 40);
    
    if (quizMode === 'optimized' || quizMode === 'structured') {
        let matrix = [];
        if (window.subjectBlueprint && window.subjectBlueprint.exam_matrix) {
             matrix = window.subjectBlueprint.exam_matrix;
        } else if (window.subjectConfig && window.subjectConfig.structure && window.subjectConfig.structure.length > 0) {
             matrix = window.subjectConfig.structure.map(r => ({tag: r.tag, percentage: (r.count / window.subjectConfig.quizTotal) * 100}));
        }

        if (matrix.length > 0) {
            let usedQuestions = new Set(); // Lưu object reference
            let totalPercentage = matrix.reduce((sum, rule) => sum + rule.percentage, 0);
            
            matrix.forEach(rule => {
                let scaledCount = Math.round((rule.percentage / totalPercentage) * totalQuestions);
                let pool = poolData.filter(q => q.tags && q.tags.includes(rule.tag) && !usedQuestions.has(q));
                
                if (quizMode === 'optimized') {
                     let highPool = pool.filter(q => q.weight === 'high' || (q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
                     let normalPool = pool.filter(q => q.weight !== 'high' && !(q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
                     
                     highPool.sort(() => 0.5 - Math.random());
                     normalPool.sort(() => 0.5 - Math.random());
                     
                     let picked = highPool.slice(0, scaledCount);
                     if (picked.length < scaledCount) {
                         let remain = scaledCount - picked.length;
                         picked = [...picked, ...normalPool.slice(0, Math.min(remain, normalPool.length))];
                     }
                     
                     picked.forEach(q => { selected.push(q); usedQuestions.add(q); });
                } else {
                     pool.sort(() => 0.5 - Math.random());
                     let picked = pool.slice(0, Math.min(scaledCount, pool.length));
                     picked.forEach(q => { selected.push(q); usedQuestions.add(q); });
                }
            });
            
            // Bù thêm nếu thiếu
            if (selected.length < totalQuestions) {
                let pool = poolData.filter(q => !usedQuestions.has(q));
                pool.sort(() => 0.5 - Math.random());
                let picked = pool.slice(0, totalQuestions - selected.length);
                picked.forEach(q => { selected.push(q); usedQuestions.add(q); });
            }
            if (selected.length > totalQuestions) {
                selected = selected.slice(0, totalQuestions);
            }
        } else {
             // Fallback Random
             let pool = [...poolData];
             if (quizMode === 'optimized') {
                  let highPool = pool.filter(q => q.weight === 'high' || (q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
                  highPool.sort(() => 0.5 - Math.random());
                  let normalPool = pool.filter(q => q.weight !== 'high' && !(q.tags && (q.tags.includes('80/20') || q.tags.includes('Trọng tâm'))));
                  normalPool.sort(() => 0.5 - Math.random());
                  
                  selected = highPool.slice(0, Math.min(totalQuestions, highPool.length));
                  if (selected.length < totalQuestions) {
                      selected = [...selected, ...normalPool.slice(0, totalQuestions - selected.length)];
                  }
             } else {
                  pool.sort(() => 0.5 - Math.random());
                  selected = pool.slice(0, Math.min(totalQuestions, pool.length));
             }
        }
    }
    
    selected.sort(() => 0.5 - Math.random());
    quizQuestions = selected;
    
    const allAnswers = poolData.map(q => extractRawAnswerData(q)).filter(a => a.length > 0);
    

    
    let html = '';
    quizQuestions.forEach((qObj, index) => {
      let qHtml = qObj.question.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br>');
      let correctAns = extractRawAnswerData(qObj);
      console.log("QOBJ:", qObj.question, "OPTIONS:", qObj.options);
      let options = qObj.options && qObj.options.length > 0 ? [...qObj.options] : [];
      let finalQHtml = qHtml;

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
      
      if (options.length > 0) {
          let mappedOptions = options.map((opt, idx) => {
              let text = stripHighlight(opt);
              return { text: text, isCorrect: idx === correctIdx, rawCorrect: opt };
          });
          mappedOptions.sort(() => 0.5 - Math.random());
          options = mappedOptions.map(o => o.text);
          let correctOption = mappedOptions.find(o => o.isCorrect);
          correctAns = correctOption ? correctOption.text : "";
      } else {
          correctAns = "";
      }
      
      html += `
        <div class="quiz-q-box" id="quiz-q-${index}" data-correct="${options.indexOf(correctAns)}">
          <div class="quiz-q-num">Câu ${index + 1}</div>
          <div class="quiz-q-text">${finalQHtml}</div>
          <div class="quiz-options">
      `;
      
      if (options.length > 0) {
          options.forEach((opt, optIdx) => {
            html += `
              <label class="quiz-opt-label" id="lbl-q${index}-opt${optIdx}">
                <input type="radio" name="q_${index}" value="${optIdx}">
                <span class="opt-text">${opt}</span>
              </label>
            `;
          });
      } else {
          html += `
              <div class="quiz-essay-placeholder" style="padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 12px;">
                 
                 <textarea id="essay-ans-${index}" style="width: 100%; min-height: 80px; background: var(--surface-hover); color: var(--text); border: 1px solid var(--border); border-radius: 6px; padding: 10px; font-family: inherit; font-size: 0.95em; resize: vertical;" placeholder="Nhập câu trả lời của bạn vào đây..." oninput="checkEssayTyping()"></textarea>
                 <div id="essay-feedback-${index}" style="display:none; margin-top:12px;"></div>
                 ${!document.body.classList.contains('quiz-mode') ? `<button onclick="document.getElementById('quiz-ans-${index}').classList.toggle('hidden-ans')" style="margin-top:12px; background:var(--primary); color:#fff; border:none; padding:8px 16px; border-radius:6px; cursor:pointer;">Lật Đáp Án</button>` : ''}
              </div>
          `;
      }
      let rawAnswerObj = qObj.answer.replace(/(✅|💡)\s*/g, '');
      rawAnswerObj = rawAnswerObj.replace(/<div class="answer-title">\s*(Đáp án:\s*)([\s\S]*?)<\/div>/i, function(match, label, content) {
          return `<span class="answer-title">${label.trim()}</span>` + (content.trim() ? ` ${content}` : '');
      });
      let ansHtml = rawAnswerObj.replace(/(<span class="answer-title">[\s\S]*?<\/span>)([\s\S]*?)(?=<div|$)/i, function(match, p1, p2) {
          if(p2.trim()) {
              return p1 + `<span class="answer-text">${p2}</span>`;
          }
          return match;
      });

      html += `</div>
        <div class="answer quiz-explanation" id="quiz-exp-${index}">
          ${ansHtml}
        </div>
      </div>`;
    });
    
    html += `<div class="quiz-actions"><button class="btn-submit-quiz" id="btnSubmitQuiz" onclick="submitQuiz()">NỘP</button></div>`;
    document.getElementById('quiz-content').innerHTML = html;
    let fabSubmit = document.getElementById('fabSubmit');
    if (fabSubmit) {
        fabSubmit.innerHTML = 'Nộp';
    }
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') { MathJax.typesetPromise(); }
    window.scrollTo({top: 0, behavior: 'smooth'});

    // Khởi động đồng hồ đếm ngược (1.5 phút mỗi câu)
    const totalTimeSeconds = quizQuestions.length * 90; 
    startTimer(totalTimeSeconds);
}

// ---------------------------------
// TIMER LOGIC
// ---------------------------------
function startTimer(seconds) {
    timeRemaining = seconds;
    const timerEl = document.getElementById('quizTimer');
    if (timerEl) {
        timerEl.style.display = 'flex';
        updateTimerDisplay();
    }
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining <= 0) {
            stopTimer();
            const textEl = document.getElementById('timerText');
            if (textEl) textEl.innerText = "HẾT GIỜ!";
            if (!quizSubmitted) {
                showToast("Hết giờ! Hệ thống tự động nộp bài.");
                submitQuiz();
            }
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    const timerEl = document.getElementById('quizTimer');
    if (timerEl && quizSubmitted) {
        // Giữ lại hiển thị
    } else if (timerEl) {
        timerEl.style.display = 'none';
    }
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('quizTimer');
    const textEl = document.getElementById('timerText');
    if (!timerEl || !textEl) return;
    
    let m = Math.floor(timeRemaining / 60);
    let s = timeRemaining % 60;
    
    if (timeRemaining <= 60) {
        timerEl.style.borderColor = '#ff7675';
        textEl.style.color = '#ff7675';
        timerEl.style.animation = 'pulse 1s infinite';
    } else {
        timerEl.style.borderColor = 'var(--secondary)';
        textEl.style.color = 'inherit';
        timerEl.style.animation = 'none';
    }
    
    textEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function submitQuiz() {
    if (window.currentQuizFormat === 'essay') {
        submitEssayPhase1();
        return;
    }
    quizSubmitted = true;
    stopTimer();
    
    let score = 0;
    let wrongIndices = [];
    
    quizQuestions.forEach((card, index) => {
      let qBox = document.getElementById(`quiz-q-${index}`);
      let correctIdx = parseInt(qBox.dataset.correct);
      let selected = document.querySelector(`input[name="q_${index}"]:checked`);
      
      let allRadios = qBox.querySelectorAll('input[type="radio"]');
      let isEssay = allRadios.length === 0;
      
      if (!isEssay) {
          let correctLabel = document.getElementById(`lbl-q${index}-opt${correctIdx}`);
          if (correctLabel) correctLabel.classList.add('correct');
          
          if(selected) {
            let selectedIdx = parseInt(selected.value);
            if(selectedIdx === correctIdx) {
              score++;
            } else {
              document.getElementById(`lbl-q${index}-opt${selectedIdx}`).classList.add('wrong');
              wrongIndices.push(index);
              qBox.classList.add('is-wrong');
              qBox.querySelector('.quiz-q-num').style.color = '#ff7675';
            }
          } else {
            wrongIndices.push(index);
            qBox.classList.add('is-wrong');
            qBox.querySelector('.quiz-q-num').style.color = '#ff7675';
          }
          allRadios.forEach(inp => inp.disabled = true);
      } else {
          // Tự luận: Không chấm điểm sai, mặc định cộng điểm khuyến khích để ko bị điểm 0.
          score++;
      }
      
      qBox.querySelectorAll('input').forEach(inp => inp.disabled = true);
      document.getElementById(`quiz-exp-${index}`).style.display = 'flex';
      qBox.classList.add('show-hints');
    });
    
    const fabSubmit = document.getElementById('fabSubmit');
    if (fabSubmit) fabSubmit.classList.remove('visible');

    let score10 = ((score / quizQuestions.length) * 10).toFixed(1);
    saveHistory(score, quizQuestions.length);
    
    let summary = document.getElementById('quiz-result-summary');
    summary.style.display = 'block';
    summary.innerHTML = `
      <div>Điểm của bạn: <span style="color:var(--primary);font-size:1.4em;">${score10} / 10</span></div>
      <div style="font-size: 0.85em; color: #666; margin-top: 2px;">(Trả lời đúng ${score} / ${quizQuestions.length} câu)</div>
      <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
        ${wrongIndices.length > 0 ? `<button class="btn-filter-wrong" onclick="filterWrongQuestions()" style="margin-top:0;">Chỉ xem ${wrongIndices.length} câu sai</button>` : `<div style="color:var(--success); display:flex; align-items:center;">Tuyệt vời! Bạn làm đúng hết!</div>`}
        <button class="btn-continue-quiz" onclick="showQuizModal()">Luyện tiếp</button>
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
    
    let contentHtml = '<h2 style="margin-top:0; color:var(--text); font-size:1.4em; text-align:center;">LỊCH SỬ THI THỬ</h2>';
    contentHtml += '<p style="color:var(--muted); font-size:0.9em; margin-bottom:20px; text-align:center;">Theo dõi sự tiến bộ của bạn qua các lần thi thử.</p>';
    
    if (history.length === 0) {
      contentHtml += '<p style="color:var(--muted); text-align:center;">Bạn chưa có lịch sử làm bài nào cho môn này.</p>';
    } else {
      contentHtml += `
        <div style="max-height: 250px; overflow-y: auto; margin-bottom: 20px; border-radius: 8px; border: 1px solid var(--border);">
          <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.9em; background: var(--surface); color: var(--text);">
            <thead style="background: rgba(15,15,26,0.6); position: sticky; top: 0;">
              <tr>
                <th style="padding: 10px; border-bottom: 1px solid var(--border);">Lần</th>
                <th style="padding: 10px; border-bottom: 1px solid var(--border);">Thời gian</th>
                <th style="padding: 10px; border-bottom: 1px solid var(--border);">Điểm (Hệ 10)</th>
                <th style="padding: 10px; border-bottom: 1px solid var(--border);">Câu đúng</th>
              </tr>
            </thead>
            <tbody>
      `;
      history.forEach((h, i) => {
        let color = h.percent >= 80 ? 'var(--success)' : (h.percent >= 50 ? 'var(--warn)' : 'var(--danger)');
        let score10 = ((h.score / h.total) * 10).toFixed(1);
        contentHtml += `
          <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 10px; color:var(--muted);">#${i + 1}</td>
            <td style="padding: 10px; color: var(--text);">${h.date}</td>
            <td style="padding: 10px; font-weight: 600; color: ${color};">${score10}</td>
            <td style="padding: 10px; font-weight: bold; color: var(--text);">${h.score}/${h.total}</td>
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
              <h3 style="font-size: 0.9rem; margin-bottom: 10px; color:var(--text);">Sự tiến bộ (Điểm hệ 10)</h3>
              <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="border: 1px solid var(--border); border-radius: 8px; background: var(--surface); width:100%; max-width:320px;">
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
      contentHtml += `<div style="text-align: center; margin-top: 20px;"><button class="btn-clear-history" onclick="clearHistory()">Xóa lịch sử</button></div>`;
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
    const fabSubmit = document.getElementById('fabSubmit');
    if (fabSubmit) fabSubmit.classList.remove('visible');

    let hasMcq = window.quizData.some(q => !isEssayQuestion(q));
    let hasEssay = window.quizData.some(q => isEssayQuestion(q));

    let modal = document.getElementById('quiz-mode-modal');
    if (modal) modal.remove(); // Rebuild modal to ensure dynamic buttons
    
    let html = `
    <div id="quiz-mode-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center; backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);">
        <div style="background:var(--surface); border:1px solid var(--border); width:90%; max-width:400px; border-radius:16px; padding:26px; text-align:center; box-shadow:var(--shadow-md); animation: fadeUp 0.3s ease; position:relative; overflow:hidden;">
            
            <!-- BƯỚC 0: CHỌN HÌNH THỨC -->
            <div id="quiz-modal-step-0">
                <h2 style="margin-top:0; color:var(--text); font-size:1.35em;">HÌNH THỨC THI THỬ</h2>
                <p style="color:var(--muted); font-size:0.92em; margin-bottom:22px;">Chọn hình thức bạn muốn làm bài</p>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    ${hasMcq ? `<button onclick="selectQuizFormat('mcq')" class="modal-btn modal-btn-opt">
                        <span>Trắc Nghiệm</span>
                        <span class="modal-btn-sub">Thi trắc nghiệm chấm điểm tự động</span>
                    </button>` : ''}
                    <button onclick="selectQuizFormat('essay')" class="modal-btn modal-btn-str">
                        <span>Tự Luận</span>
                        <span class="modal-btn-sub">Thi tự luận có gợi ý chấm điểm</span>
                    </button>
                </div>
                <button onclick="document.getElementById('quiz-mode-modal').style.display='none'" class="modal-btn-cancel">Đóng</button>
            </div>

            <!-- BƯỚC 1: CHỌN CHIẾN THUẬT (CHỈ TRẮC NGHIỆM) -->
            <div id="quiz-modal-step-1" style="display:none;">
                <h2 style="margin-top:0; color:var(--text); font-size:1.35em;">CHIẾN THUẬT BỐC ĐỀ</h2>
                <p style="color:var(--muted); font-size:0.92em; margin-bottom:22px;">Bạn muốn lấy câu hỏi từ đâu?</p>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    <button onclick="selectQuizMode('optimized')" class="modal-btn modal-btn-opt">
                        <span>Tối Ưu</span>
                        <span class="modal-btn-sub">Tập trung 20% câu hỏi chiếm 80% tỉ lệ ra thi</span>
                    </button>
                    <button onclick="selectQuizMode('structured')" class="modal-btn modal-btn-str">
                        <span>Cấu Trúc Đề</span>
                        <span class="modal-btn-sub">Các câu hỏi theo cấu trúc đề thi chuẩn</span>
                    </button>
                </div>
                <button onclick="if(window.autoSkippedStep0) { document.getElementById('quiz-mode-modal').style.display='none'; } else { document.getElementById('quiz-modal-step-1').style.display='none'; document.getElementById('quiz-modal-step-0').style.display='block'; }" class="modal-btn-cancel">Quay lại</button>
            </div>

            <!-- BƯỚC 2: CHỌN SỐ CÂU HỎI -->
            <div id="quiz-modal-step-2" style="display:none;">
                <h2 style="margin-top:0; color:var(--text); font-size:1.35em;">SỐ LƯỢNG CÂU HỎI</h2>
                <p style="color:var(--muted); font-size:0.92em; margin-bottom:22px;">Bạn muốn thi bao nhiêu câu?</p>
                <div style="display:flex; flex-direction:column; gap:14px;">
                    <button onclick="startQuizWithCount(15)" class="modal-btn modal-btn-str">
                        <span>Kiểm tra nhanh</span>
                        <span class="modal-btn-sub">(15 Câu)</span>
                    </button>
                    <button onclick="startQuizWithCount(20)" class="modal-btn modal-btn-str">
                        <span>Tiêu chuẩn</span>
                        <span class="modal-btn-sub">(20 Câu)</span>
                    </button>
                    <button onclick="startQuizWithCount(40)" class="modal-btn modal-btn-opt">
                        <span>Thi thật</span>
                        <span class="modal-btn-sub">(40 Câu)</span>
                    </button>
                </div>
                <button onclick="document.getElementById('quiz-modal-step-2').style.display='none'; if(window.tempQuizFormat === 'mcq') { document.getElementById('quiz-modal-step-1').style.display='block'; } else { if(window.autoSkippedStep0) { document.getElementById('quiz-mode-modal').style.display='none'; } else { document.getElementById('quiz-modal-step-0').style.display='block'; } }" class="modal-btn-cancel">Quay lại</button>
            </div>

        </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById('quiz-mode-modal');
    
    document.getElementById('quiz-modal-step-1').style.display = 'none';
    document.getElementById('quiz-modal-step-2').style.display = 'none';
    document.getElementById('quiz-modal-step-0').style.display = 'block';
    
    // Auto skip if only one format is available
    window.autoSkippedStep0 = false;
    if (hasEssay && !hasMcq) {
        window.autoSkippedStep0 = true;
        selectQuizFormat('essay');
    }
    
    modal.style.display = 'flex';
}

window.tempQuizFormat = 'mcq';
window.tempQuizMode = 'optimized';

window.selectQuizFormat = function(format) {
    window.tempQuizFormat = format;
    document.getElementById('quiz-modal-step-0').style.display = 'none';
    if (format === 'mcq') {
        document.getElementById('quiz-modal-step-1').style.display = 'block';
    } else {
        document.getElementById('quiz-modal-step-2').style.display = 'block';
    }
}

window.selectQuizMode = function(mode) {
    window.tempQuizMode = mode;
    document.getElementById('quiz-modal-step-1').style.display = 'none';
    document.getElementById('quiz-modal-step-2').style.display = 'block';
}


window.tempQuizMode = 'optimized';
window.selectQuizMode = function(mode) {
    window.tempQuizMode = mode;
    document.getElementById('quiz-modal-step-1').style.display = 'none';
    document.getElementById('quiz-modal-step-2').style.display = 'block';
}

window.startQuizWithCount = function(count) {
    window.selectedQuizCount = count;
    startQuiz(window.tempQuizMode, window.tempQuizFormat);
}

// ---------------------------------
// MODAL CLOSE HANDLERS (ESC & BACKDROP)
// ---------------------------------
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
        let quizModal = document.getElementById('quiz-mode-modal');
        if (quizModal && quizModal.style.display !== 'none') {
            quizModal.style.display = 'none';
        }
        let historyModal = document.getElementById('history-modal');
        if (historyModal && historyModal.style.display !== 'none') {
            historyModal.style.display = 'none';
        }
    }
});

document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'quiz-mode-modal') {
        e.target.style.display = 'none';
    }
    if (e.target && e.target.id === 'history-modal') {
        e.target.style.display = 'none';
    }
});

// ---------------------------------
// KNOWLEDGE BASE LOGIC (19 Components & 6D Matrix)
// ---------------------------------
window.kbData = [];
window.kbRendered = false;

async function renderKnowledgeBase() {
    // Vô hiệu hóa hàm này vì đã có React (knowledge-app) đảm nhận việc render vào #knowledge-content
    if (window.kbRendered) return;
    window.kbRendered = true;
    console.log("Knowledge base is now managed by React knowledge-app.");
}

function renderKbBlock(block) {
    let type = block.type;
    let data = block.data || {};
    let content = block.content || {};
    let title = block.title || '';
    
    // Wrapper helper
    const wrapBlock = (icon, defaultTitle, innerHtml, extraClass = '') => `
        <div class="kb-block ${extraClass}">
            <div class="kb-block-title">${icon} ${title || defaultTitle}</div>
            <div class="kb-block-content">${innerHtml}</div>
        </div>`;

    switch(type) {
        case 'timeline':
            let events = data.items || data.events || content.events || [];
            let tlHtml = events.map(ev => `
                <div class="kb-tl-item">
                    <div class="kb-tl-content">
                        <div class="kb-tl-title">⏳ ${ev.time || ev.year || ev.date || ''}</div>
                        <div class="kb-tl-desc">${ev.content || ev.desc || ev.description || ev.event || ''}</div>
                    </div>
                </div>
            `).join('');
            return wrapBlock('📅', 'Dòng thời gian', `<div class="kb-timeline">${tlHtml}</div>`);

        case 'features':
            let features = data.items || data.features || [];
            let featHtml = features.map(f => `
                <div class="kb-card feature-card">
                    <div class="kb-card-title">${f.title || f.name || ''}</div>
                    <div class="kb-card-desc">${f.description || f.desc || f.content || ''}</div>
                </div>
            `).join('');
            return wrapBlock('📋', 'Đặc điểm', featHtml);
            
        case 'mindmap':
            let root = data.root || 'Root';
            let children = data.children || data.branches || data.nodes || content.nodes || block.nodes || [];
            let nodesHtml = children.map(n => `<div class="kb-mindmap-node">📌 ${n.name || n.label || n.title || n}</div>`).join('');
            return wrapBlock('', 'Sơ đồ tư duy', `
                <div class="kb-mindmap-root">🧠 ${root}</div>
                <div class="kb-mindmap-children">${nodesHtml}</div>
            `, 'text-center');
            
        case 'pyramid':
            let levels = data.levels || content.levels || [];
            let pyrHtml = levels.map((lvl, idx) => {
                let width = 100 - (idx * 15);
                let name = lvl.name || lvl.title || lvl.level || lvl;
                let desc = lvl.description || lvl.desc || '';
                return `<div class="kb-pyr-level" style="width:${width}%;">${name} <div class="kb-pyr-desc">${desc}</div></div>`;
            }).reverse().join('');
            return wrapBlock('🔺', 'Mô hình tháp', `<div class="kb-pyramid">${pyrHtml}</div>`, 'text-center');
            
        case 'formula':
        case 'formula-breakdown':
            let formStr = data.formula || data.equation || block.formula || content.formula || '';
            let varsList = data.variables || block.variables || content.variables || [];
            let varsHtml = varsList.map(v => `<div class="kb-formula-part"><b>${v.symbol || v.name || v.key || '?'}</b>: ${v.definition || v.meaning || v.desc || v.description || ''}</div>`).join('');
            return wrapBlock('🧮', 'Công thức', `
                <div class="kb-formula-main">${formStr}</div>
                <div class="kb-formula-parts">${varsHtml}</div>
            `);
            
        case 'vs-wrap':
            let lTitle = (data.left && data.left.title) || data.col1_title || data.side1_title || block.titleA || 'Vấn đề A';
            let lDesc = (data.left && (data.left.content || data.left.desc || data.left.description)) || data.col1_desc || data.side1_desc || block.descA || (data.left && data.left.items ? data.left.items.join('<br>') : '');
            let rTitle = (data.right && data.right.title) || data.col2_title || data.side2_title || block.titleB || 'Vấn đề B';
            let rDesc = (data.right && (data.right.content || data.right.desc || data.right.description)) || data.col2_desc || data.side2_desc || block.descB || (data.right && data.right.items ? data.right.items.join('<br>') : '');
            if (Array.isArray(lDesc)) lDesc = lDesc.join('<br>• ');
            if (Array.isArray(rDesc)) rDesc = rDesc.join('<br>• ');
            return wrapBlock('', 'So sánh', `
                <div class="kb-vs-wrap">
                    <div class="kb-vs-card green">
                        <div class="vs-title">🟢 ${lTitle}</div>
                        <div class="vs-body">${lDesc}</div>
                    </div>
                    <div class="kb-vs-badge pulseBadge">VS</div>
                    <div class="kb-vs-card amber">
                        <div class="vs-title">🔴 ${rTitle}</div>
                        <div class="vs-body">${rDesc}</div>
                    </div>
                </div>
            `);
            
        case 'quadrant':
            let qs = data.quadrants || data.items || [];
            let q1 = qs[0] || data.q1 || data.top_left || {title: 'Q1', content: ''};
            let q2 = qs[1] || data.q2 || data.top_right || {title: 'Q2', content: ''};
            let q3 = qs[2] || data.q3 || data.bottom_left || {title: 'Q3', content: ''};
            let q4 = qs[3] || data.q4 || data.bottom_right || {title: 'Q4', content: ''};
            return wrapBlock('⊞', 'Ma trận 4 góc', `
                <div class="kb-quadrant">
                    <div class="kb-quad-cell q1"><h4>${q1.title || q1.name || ''}</h4><p>${q1.content || q1.desc || q1.description || ''}</p></div>
                    <div class="kb-quad-cell q2"><h4>${q2.title || q2.name || ''}</h4><p>${q2.content || q2.desc || q2.description || ''}</p></div>
                    <div class="kb-quad-cell q3"><h4>${q3.title || q3.name || ''}</h4><p>${q3.content || q3.desc || q3.description || ''}</p></div>
                    <div class="kb-quad-cell q4"><h4>${q4.title || q4.name || ''}</h4><p>${q4.content || q4.desc || q4.description || ''}</p></div>
                </div>
            `);
            
        case 'cycle':
        case 'flowchart':
        case 'process-steps':
            let steps = data.steps || data.process || content.steps || [];
            let flowHtml = steps.map((s, i) => {
                let name = s.name || s.title || s.step || s;
                let desc = s.desc || s.description || s.content || '';
                return `
                <div class="kb-process-step">
                    <div class="kb-process-idx">${i+1}</div>
                    <div class="kb-card process-card">
                        <div class="kb-card-title">${name}</div>
                        ${desc ? `<div class="kb-card-desc">${desc}</div>` : ''}
                    </div>
                </div>`;
            }).join('');
            return wrapBlock('', 'Quy trình / Chu trình', flowHtml);
            
        case 'onion':
            let layers = data.layers || data.levels || [];
            let onionHtml = layers.map((l, i) => {
                let classN = (i === 0) ? 'l1' : (i === 1) ? 'l2' : 'l3';
                let name = l.name || l.title || l.layer || l;
                let desc = l.description || l.desc || l.content || '';
                return `<div class="kb-onion-layer ${classN}" style="z-index:${10-i}">
                    <div><strong>${name}</strong><br><span class="onion-desc">${desc}</span></div>
                </div>`;
            }).join('');
            return wrapBlock('', 'Mô hình Onion', `<div class="kb-onion">${onionHtml}</div>`, 'onion-block');
            
        case 'venn':
        case 'venn-diagram':
            let vLTitle = (data.left && data.left.title) || data.left || data.setA || block.titleA || 'Tập hợp A';
            let vRTitle = (data.right && data.right.title) || data.right || data.setB || block.titleB || 'Tập hợp B';
            let vOverlap = (data.intersection && data.intersection.desc) || data.intersection || data.overlap || block.overlap || 'Giao điểm';
            if (Array.isArray(vOverlap)) vOverlap = vOverlap.join('<br>');
            return wrapBlock('⭕', 'Biểu đồ Venn', `
                <div class="kb-venn">
                    <div class="kb-venn-circle left"><div class="kb-venn-title">${vLTitle.name || vLTitle}</div></div>
                    <div class="kb-venn-circle right"><div class="kb-venn-title">${vRTitle.name || vRTitle}</div></div>
                    <div class="kb-venn-overlap kb-interactive" data-action="reveal-venn">
                        <div class="kb-venn-overlap-text hidden-content">${vOverlap}</div>
                        <div class="kb-venn-overlap-hint">???</div>
                    </div>
                </div>
            `);
            
        case 'hotspot':
            let points = data.points || data.items || [];
            let ptsHtml = points.map((p, i) => {
                let left = 20 + (i * 20) % 60;
                let top = 30 + (i * 25) % 50;
                return `
                <div class="kb-hotspot-point" style="left:${left}%; top:${top}%;">
                    <div class="kb-hotspot-tooltip"><strong>${p.title || p.name}</strong><br>${p.description || p.desc || p.content}</div>
                </div>`;
            }).join('');
            return wrapBlock('📍', 'Hotspot', `
                <div class="kb-hotspot-wrap">
                    <div class="kb-hotspot-bg-text">Bản đồ Tương tác</div>
                    ${ptsHtml}
                </div>
            `);
            
        case 't-account':
            let leftHeader = (data.left && data.left.header) || data.debit_title || 'Bên Trái';
            let leftEntries = (data.left && data.left.entries) || data.debit_entries || [];
            let rightHeader = (data.right && data.right.header) || data.credit_title || 'Bên Phải';
            let rightEntries = (data.right && data.right.entries) || data.credit_entries || [];
            let lHtml = leftEntries.map(e => `<div class="kb-t-row"><span>${typeof e === 'string' ? e : e.text}</span></div>`).join('');
            let rHtml = rightEntries.map(e => `<div class="kb-t-row"><span>${typeof e === 'string' ? e : e.text}</span></div>`).join('');
            return wrapBlock('📈', 'Tài khoản T', `
                <div class="kb-t-account">
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
                </div>
            `);
            
        case 'flip-card':
            let frontText = block.front || data.front || content.front || 'Mặt trước';
            let backText = block.back || data.back || content.back || 'Mặt sau';
            return wrapBlock('🃏', 'Thẻ lật (Bấm để lật)', `
                <div class="kb-flip-card kb-interactive" data-action="flip" onclick="this.classList.toggle('flipped')">
                    <div class="kb-flip-inner">
                        <div class="kb-flip-front"><p>${frontText}</p></div>
                        <div class="kb-flip-back"><p>${backText}</p></div>
                    </div>
                </div>
            `);
            
        case 'spectrum':
            let specItems = data.items || [];
            let specPoints = specItems.map((item, idx) => {
                let left = (specItems.length > 1) ? (idx / (specItems.length - 1)) * 100 : 50;
                return `<div class="kb-spec-point" style="left: ${left}%" title="${item.title || ''}">${idx + 1}</div>`;
            }).join('');
            let specLabels = specItems.map(item => `
                <div>
                    <div class="kb-spec-label-title">${item.title || ''}</div>
                    <div class="kb-spec-label-desc">${item.description || item.desc || ''}</div>
                </div>
            `).join('');
            return wrapBlock('🌈', 'Phổ khái niệm', `
                <div class="kb-spectrum">
                    <div class="kb-spec-line">${specPoints}</div>
                    <div class="kb-spec-labels">${specLabels}</div>
                </div>
            `);
            
        case 'carousel':
            let carItems = data.items || [];
            let carHtml = carItems.map(item => {
                let pts = '';
                if(item.points && Array.isArray(item.points)) {
                    pts = `<ul class="kb-points-list" style="text-align:left;">` + item.points.map(p => `<li>${p}</li>`).join('') + `</ul>`;
                }
                let desc = item.description || item.content || '';
                return `
                <div class="kb-carousel-item">
                    <h4>${item.title || item.name || ''}</h4>
                    <p>${desc}</p>
                    ${pts}
                </div>
                `;
            }).join('');
            return wrapBlock('🎠', 'Vuốt ngang', `
                <div class="kb-carousel-hint"><span>← Vuốt →</span></div>
                <div class="kb-carousel">${carHtml}</div>
            `);
            
        case 'matrix-table':
            let headers = data.headers || data.columns || [];
            let rows = data.rows || data.items || [];
            let thHtml = headers.map(h => `<th>${h}</th>`).join('');
            let trHtml = rows.map(r => {
                if (Array.isArray(r)) {
                    return `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`;
                } else if (typeof r === 'object') {
                    return `<tr>${headers.map(h => `<td>${r[h.toLowerCase()] || r[h] || ''}</td>`).join('')}</tr>`;
                }
                return '';
            }).join('');
            return wrapBlock('📊', 'Bảng tổng hợp', `
                <div class="kb-table-wrap">
                    <table class="kb-table">
                        <thead><tr>${thHtml}</tr></thead>
                        <tbody>${trHtml}</tbody>
                    </table>
                </div>
            `);
            
        default:
            let defaultContent = typeof data === 'object' && Object.keys(data).length > 0 ? JSON.stringify(data, null, 2) : 
                                 (typeof content === 'object' && Object.keys(content).length > 0 ? JSON.stringify(content, null, 2) : 
                                 (block.content || ''));
            return wrapBlock('📝', title || 'Thông tin', `<pre class="kb-default-pre">${defaultContent}</pre>`);
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

// FAB LOGIC
document.addEventListener('DOMContentLoaded', () => {
    let fabHtml = `
    <div class="fab-container" id="fabContainer">
        <button class="fab-btn fab-submit" id="fabSubmit" onclick="submitQuiz()">Nộp</button>
        <button class="fab-btn" id="fabBackToTop" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑</button>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', fabHtml);

    const fabBackToTop = document.getElementById('fabBackToTop');
    const fabSubmit = document.getElementById('fabSubmit');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            fabBackToTop.classList.add('visible');
        } else {
            fabBackToTop.classList.remove('visible');
        }
    });

    document.body.addEventListener('change', (e) => {
        if (document.body.classList.contains('quiz-mode') && e.target.type === 'radio') {
            const checkedCount = document.querySelectorAll('#quiz-content input[type="radio"]:checked').length;
            const validQuestions = quizQuestions.filter(q => Array.isArray(q.options) && q.options.length > 0).length;
            if (validQuestions > 0 && (checkedCount / validQuestions) >= 0.5) {
                fabSubmit.classList.add('visible');
            } else {
                fabSubmit.classList.remove('visible');
            }
        }
    });

window.checkEssayTyping = function() {
    if (!document.body.classList.contains('quiz-mode')) return;
    if (window.currentQuizFormat !== 'essay') return;
    
    let total = quizQuestions.length;
    let filled = 0;
    for(let i=0; i<total; i++) {
        let t = document.getElementById(`essay-ans-${i}`);
        if(t && t.value.trim().length > 10) filled++;
    }
    const fabSubmit = document.getElementById('fabSubmit');
    if (total > 0 && (filled / total) >= 0.5) {
        fabSubmit.classList.add('visible');
    } else {
        fabSubmit.classList.remove('visible');
    }
};
});


function submitEssayPhase1() {
    stopTimer();
    const fabSubmit = document.getElementById('fabSubmit');
    const bottomBtn = document.getElementById('btnSubmitQuiz');
    if (fabSubmit) fabSubmit.style.display = 'none'; // hide FAB completely
    if (bottomBtn) {
        bottomBtn.style.display = 'inline-block';
        bottomBtn.onclick = submitEssayPhase2;
    }
    
    // Evaluate keywords
    quizQuestions.forEach((qObj, index) => {
        let textarea = document.getElementById(`essay-ans-${index}`);
        if(textarea) textarea.disabled = true; // freeze
        
        let userText = normalizeTextForSearch(textarea ? textarea.value : "");
        
        // Extract raw answer html
        let tmp = document.createElement('div');
        tmp.innerHTML = qObj.answer || "";
        
        // Get highlighted keywords (green ones)
        let kTags = tmp.querySelectorAll('.answer-keyword, .keyword');
        let totalKeys = kTags.length;
        let matchedKeys = 0;
        
        kTags.forEach(tag => {
            let kText = normalizeTextForSearch(tag.textContent);
            if (userText.includes(kText) && kText.length > 0) {
                matchedKeys++;
                tag.style.color = '#2ecc71'; // Green
                tag.style.textDecoration = 'none';
            } else {
                tag.style.color = '#e74c3c'; // Red
                tag.style.textDecoration = 'line-through';
            }
        });
        
        let feedbackHtml = `
            <div style="font-weight:600; margin-bottom:10px; color:${matchedKeys === totalKeys && totalKeys > 0 ? 'var(--success)' : 'var(--warn)'};">
                🎯 Khớp ${matchedKeys}/${totalKeys} ý cốt lõi
            </div>
            <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; font-size: 0.95em; color: var(--text); max-height:200px; overflow-y:auto; margin-bottom:15px;">
                ${tmp.innerHTML}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
                <div style="font-weight:600; font-size:0.9em; color:var(--muted);">TỰ CHẤM ĐIỂM:</div>
                <div style="display:flex; gap:10px;" class="essay-score-group" data-index="${index}">
                    <button class="essay-score-btn" onclick="selectEssayScore(${index}, 0)" style="flex:1; padding:10px; border-radius:6px; border:1px solid #e74c3c; background:transparent; color:#e74c3c; cursor:pointer;">🔴 Quên sạch (0đ)</button>
                    <button class="essay-score-btn" onclick="selectEssayScore(${index}, 0.5)" style="flex:1; padding:10px; border-radius:6px; border:1px solid #f1c40f; background:transparent; color:#f1c40f; cursor:pointer;">🟡 Nhớ mấp mé (0.5đ)</button>
                    <button class="essay-score-btn" onclick="selectEssayScore(${index}, 1)" style="flex:1; padding:10px; border-radius:6px; border:1px solid #2ecc71; background:transparent; color:#2ecc71; cursor:pointer;">🟢 Chuẩn xác (1đ)</button>
                </div>
            </div>
        `;
        
        let fbBox = document.getElementById(`essay-feedback-${index}`);
        if(fbBox) {
            fbBox.innerHTML = feedbackHtml;
            fbBox.style.display = 'block';
        }
    });
    
    // Phase 2 setup
    window.essayScores = {};
    updateEssayFab();
    
    // Show summary box with instruction and scroll to top
    let summary = document.getElementById('quiz-result-summary');
    if (summary) {
        summary.style.display = 'block';
        summary.innerHTML = `
          <div>Tiến trình: <span style="color:var(--primary);font-size:1.4em;" id="essay-progress-text">0 / ${quizQuestions.length} câu</span></div>
          <div style="font-size: 0.85em; color: #666; margin-top: 2px;">(Hệ thống đã Auto-Highlight từ khóa. Bạn hãy đối chiếu và Tự Chấm Điểm)</div>
          <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
            <div style="color:var(--success); display:flex; align-items:center;">Kéo xuống để bắt đầu chấm điểm!</div>
          </div>
        `;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.essayScores = {};
function selectEssayScore(index, score) {
    window.essayScores[index] = score;
    
    // Update button UI
    let group = document.querySelector(`.essay-score-group[data-index="${index}"]`);
    if(group) {
        let btns = group.querySelectorAll('.essay-score-btn');
        btns.forEach((b, i) => {
            b.style.background = 'transparent';
            if(i === 0 && score === 0) b.style.background = 'rgba(231, 76, 60, 0.2)';
            if(i === 1 && score === 0.5) b.style.background = 'rgba(241, 196, 15, 0.2)';
            if(i === 2 && score === 1) b.style.background = 'rgba(46, 204, 113, 0.2)';
        });
    }
    updateEssayFab();
}

function updateEssayFab() {
    let btn = document.getElementById('btnSubmitQuiz');
    let fab = document.getElementById('fabSubmit');
    if(fab) {
        fab.classList.remove('visible');
        fab.style.display = 'none'; // force hide
    }
    if(!btn) return;
    
    let scoredCount = Object.keys(window.essayScores).length;
    let total = quizQuestions.length;
    
    btn.innerHTML = `CHẤM ĐIỂM (${scoredCount}/${total})`;
    
    if (scoredCount === total) {
        btn.style.background = 'var(--success)'; // Green when ready
    } else {
        btn.style.background = 'var(--primary)';
    }
}

function submitEssayPhase2() {
    let total = quizQuestions.length;
    let scoredCount = Object.keys(window.essayScores).length;
    if(scoredCount < total) {
        alert(`Bạn còn ${total - scoredCount} câu chưa tự chấm điểm!`);
        return;
    }
    
    quizSubmitted = true;
    let correctCount = 0;
    
    Object.values(window.essayScores).forEach(s => {
        correctCount += s;
    });
    
    // Save history
    let subjectKey = getSubjectKey();
    let history = JSON.parse(localStorage.getItem(subjectKey) || '[]');
    let percent = Math.round((correctCount / total) * 100);
    
    history.push({
        date: new Date().toISOString(),
        score: percent,
        correct: correctCount,
        total: total,
        mode: window.currentQuizMode,
        format: 'essay'
    });
    
    localStorage.setItem(subjectKey, JSON.stringify(history));
    
    // Hide fab & bottom btn
    const fabSubmit = document.getElementById('fabSubmit');
    if (fabSubmit) fabSubmit.classList.remove('visible');
    const bottomBtn = document.getElementById('btnSubmitQuiz');
    if (bottomBtn) bottomBtn.style.display = 'none';
    
    // Show summary
    let score10 = ((correctCount / total) * 10).toFixed(1);
    let summary = document.getElementById('quiz-result-summary');
    summary.style.display = 'block';
    
    // Đếm số câu có điểm < 1 (được tính là sai) và add class is-wrong
    let wrongCount = 0;
    Object.entries(window.essayScores).forEach(([index, s]) => {
        if (s < 1) {
            wrongCount++;
            let qBox = document.getElementById(`quiz-q-${index}`);
            if (qBox) qBox.classList.add('is-wrong');
        }
    });

    summary.innerHTML = `
      <div>Điểm của bạn: <span style="color:var(--primary);font-size:1.4em;">${score10} / 10</span></div>
      <div style="font-size: 0.85em; color: #666; margin-top: 2px;">(Trả lời đúng ${correctCount} / ${total} câu)</div>
      <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 8px; align-items: center;">
        ${wrongCount > 0 ? `<button class="btn-filter-wrong" onclick="filterWrongQuestions()" style="margin-top:0;">Chỉ xem ${wrongCount} câu sai</button>` : `<div style="color:var(--success); display:flex; align-items:center;">Tuyệt vời! Bạn làm đúng hết!</div>`}
        <button class="btn-continue-quiz" onclick="showQuizModal()">Luyện tiếp</button>
      </div>
    `;
    
    // Hide all self-assess buttons to finalize view
    document.querySelectorAll('.essay-score-group').forEach(el => el.style.pointerEvents = 'none');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
