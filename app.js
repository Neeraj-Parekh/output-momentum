// ============================================================
// PORTFOLIO APP — Main application logic
// ============================================================

// State management
const state = {
    dark: false,
    codeMode: {},
    codeStep: {},
    selTech: null,
    selProject: null,
    activeLayer: {},
    wifiDetailIndex: 3,
    collapsedProjects: {}, // Track which projects are collapsed
    currentCompany: 'CopperCloud' // Default company for display
};

// Initialize code modes for all projects
PROJECTS.forEach(p => {
    state.codeMode[p.id] = 'raw';
    state.codeStep[p.id] = 0;
    if (p.layers) state.activeLayer[p.id] = 0;
});

// Load collapsed state from localStorage
function loadCollapsedState() {
    try {
        const stored = localStorage.getItem('portfolio_collapsed');
        if (stored) {
            state.collapsedProjects = JSON.parse(stored);
        }
    } catch (err) {
        try {
            localStorage.removeItem('portfolio_collapsed');
        } catch (removeErr) {
            // Ignore storage removal failures.
        }
        state.collapsedProjects = {};
    }
}

// Save collapsed state to localStorage
function saveCollapsedState() {
    try {
        localStorage.setItem('portfolio_collapsed', JSON.stringify(state.collapsedProjects));
    } catch (err) {
        // Ignore storage save failures.
    }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function icon(name, size = 18) {
    const s = size;
    const I = {
        moon: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
        sun: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
        award: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
        database: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
        chevRight: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`,
        chevLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`,
        chevDown: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
        play: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>`,
        code: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
        network: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
        merge: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 20 5-5 5 5"/><path d="m7 4 5 5 5-5"/><path d="M12 9v11"/></svg>`,
        component: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 20.5v-2a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v2"/><path d="M9 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M15 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/><path d="M12 2a4 4 0 0 1 4 4c0 1.95-2 3-4 5-2-2-4-3.05-4-5a4 4 0 0 1 4-4Z"/></svg>`,
        arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
        arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
        shield: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
        cpu: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
        target: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
        zap: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`,
        layers: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2 12.5"/><path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2 17.5"/></svg>`,
        sigma: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H5l6 8-6 8h11"/><path d="M20 4v16"/></svg>`,
        settings: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6"/><path d="M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24"/><path d="M1 12h6m6 0h6"/><path d="M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24"/></svg>`,
        image: `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`
    };
    return I[name] || '';
}

function highlightLine(text, isDark) {
    let line = esc(text);
    const trimmed = text.trim();
    if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
        return `<span style="color:${isDark ? '#9ca3af' : '#6b7280'};font-style:italic">${line}</span>`;
    }
    const tokens = {};
    let tc = 0;
    const pushTok = v => {
        const k = `__TK${tc++}__`;
        tokens[k] = v;
        return k;
    };
    line = line.replace(/(&quot;[^&]*?&quot;|&#039;[^&]*?&#039;)/g, m =>
        pushTok(`<span style="color:${isDark ? '#4ade80' : '#16a34a'}">${m}</span>`)
    );
    line = line.replace(/(\/\/.*)$/, m =>
        pushTok(`<span style="color:${isDark ? '#9ca3af' : '#6b7280'};font-style:italic">${m}</span>`)
    );
    Object.keys(TOOLTIPS).forEach(term => {
        const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
        line = line.replace(re, m =>
            pushTok(
                `<span class="tip-trigger" style="color:${isDark ? '#fbbf24' : '#b45309'}">${m}<span class="tip-box">${TOOLTIPS[term]}</span></span>`
            )
        );
    });
    const parts = line.split(/(<[^>]*>)/);
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0) {
            KEYWORDS.forEach(kw => {
                parts[i] = parts[i].replace(
                    new RegExp(`\\b(${kw})\\b`, 'g'),
                    `<span style="color:${isDark ? '#c084fc' : '#7c3aed'};font-weight:700">$1</span>`
                );
            });
        }
    }
    line = parts.join('');
    let prev;
    while (line !== prev) {
        prev = line;
        Object.keys(tokens).forEach(k => {
            line = line.replace(k, tokens[k]);
        });
    }
    return line;
}

function renderCodeHTML(code, walk, projId) {
    if (!code) return '';
    const isDark = state.dark;
    const mode = state.codeMode[projId] || 'raw';
    const step = state.codeStep[projId] || 0;
    const lines = code.split('\n');
    const lineNums = lines
        .map((_,i) => `<div class="min-h-[1.5em] text-right pr-3 select-none" style="color:${isDark ? '#4b5563' : '#9ca3af'}">${i + 1}</div>`)
        .join('');
    const codeLines = lines
        .map((line, idx) => {
            let opacity = '1';
            if (mode === 'walkthrough' && walk) {
                const active = walk[step].lines;
                opacity = active[0] <= idx && idx <= active[1] ? '1' : '0.2';
            }
            return `<div class="code-line min-h-[1.5em] px-2 -mx-2" style="opacity:${opacity};transition:opacity .3s ease">${highlightLine(line, isDark) || '&nbsp;'}</div>`;
        })
        .join('');
    const isWalk = mode === 'walkthrough' && walk;
    const noteHTML = isWalk
        ? `<div class="p-4 flex flex-col justify-between h-full"><div><div class="text-xs font-bold uppercase tracking-wider mb-2" style="color:${isDark ? '#9ca3af' : '#6b7280'}">Execution Step ${step + 1}/${walk.length}</div><p class="text-sm leading-relaxed" style="color:${isDark ? '#d1d5db' : '#374151'}">${walk[step].note}</p></div><div class="flex justify-between items-center mt-4"><button onclick="codeStepPrev('${projId}')" class="p-1.5 border transition-colors ${step === 0 ? 'opacity-30 cursor-not-allowed' : ''}" style="border-color:${isDark ? '#374151' : '#000'}" onmouseenter="this.style.background='${isDark ? '#1f2937' : '#e5e7eb'}'" onmouseleave="this.style.background='transparent'">${icon('chevLeft', 16)}</button><button onclick="codeStepNext('${projId}')" class="p-1.5 border transition-colors ${step === walk.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}" style="border-color:${isDark ? '#374151' : '#000'}" onmouseenter="this.style.background='${isDark ? '#1f2937' : '#e5e7eb'}'" onmouseleave="this.style.background='transparent'">${icon('chevRight', 16)}</button></div></div>`
        : '';
    return `<div class="border shadow-inner" style="border-color:${isDark ? '#374151' : '#000'};background:${isDark ? '#050508' : '#f8fafc'}"><div class="flex justify-between items-center px-4 py-2 border-b" style="border-color:${isDark ? '#374151' : '#000'};background:${isDark ? '#12121a' : '#e5e7eb'}"><div class="flex gap-2"><button onclick="setCodeMode('${projId}','raw')" class="text-xs font-bold px-3 py-1 border transition-all" style="border-color:${mode === 'raw' ? (isDark ? '#4b5563' : '#000') : 'transparent'};background:${mode === 'raw' ? (isDark ? '#1f2937' : '#fff') : 'transparent'};color:${mode === 'raw' ? (isDark ? '#fff' : '#000') : (isDark ? '#6b7280' : '#9ca3af')}">Raw Source</button><button onclick="setCodeMode('${projId}','walkthrough')" class="text-xs font-bold px-3 py-1 flex items-center gap-1 border transition-all" style="border-color:${mode === 'walkthrough' ? (isDark ? '#4b5563' : '#000') : 'transparent'};background:${mode === 'walkthrough' ? (isDark ? '#1f2937' : '#fff') : 'transparent'};color:${mode === 'walkthrough' ? (isDark ? '#fff' : '#000') : (isDark ? '#6b7280' : '#9ca3af')}">${icon('play', 14)} Walkthrough</button></div></div><div class="flex code-split" style="flex-direction:row"><div class="flex-1 p-4 overflow-x-auto"><div class="flex gap-0"><div class="font-mono text-xs leading-relaxed select-none border-r pr-0 mr-3" style="border-color:${isDark ? '#1f2937' : '#d1d5db'}">${lineNums}</div><code class="block text-xs font-mono leading-relaxed whitespace-pre-wrap" style="color:${isDark ? '#e5e7eb' : '#1f2937'};word-break:break-word">${codeLines}</code></div></div>${isWalk ? `<div class="code-annotation w-full md:w-64 border-l" style="border-color:${isDark ? '#374151' : '#000'};background:${isDark ? '#0f0f14' : '#f1f5f9'}">${noteHTML}</div>` : ''}</div></div>`;
}

// ============================================================
// PROJECT ORDERING & DISPLAY
// ============================================================

function getOrderedProjects() {
    return ratingsManager.getOrderedProjects(state.currentCompany);
}

// ============================================================
// BUILD FUNCTIONS
// ============================================================

function buildPage() {
    const d = state.dark;
    const bg = d ? '#0c0a09' : '#FAF9F6',
        fg = d ? '#e7e5e4' : '#1c1917',
        sub = d ? '#a8a29e' : '#57534e';
    const border = d ? '#292524' : '#d6d3d1',
        boxBg = d ? '#1c1917' : '#f5f5f4',
        headerBg = d ? '#1c1917' : '#e7e5e4';
    const accent = d ? '#d97706' : '#b45309',
        accentBg = d ? 'rgba(217,119,6,.1)' : 'rgba(180,83,9,.08)';

    document.documentElement.style.backgroundColor = bg;
    document.documentElement.style.color = fg;
    document.body.style.backgroundColor = bg;

    let h = '';

    // HEADER
    h += `<header class="max-w-6xl mx-auto px-6 md:px-8 pt-14 pb-8" style="border-bottom:2px solid ${border}">
        <div class="flex justify-between items-start mb-6">
            <div class="flex-1">
                <div class="flex items-center gap-3 mb-2"><span class="inline-block w-3 h-3 rounded-full arch-pulse" style="background:${accent};box-shadow:0 0 12px ${accent}"></span><span class="text-xs font-bold uppercase tracking-[.2em]" style="color:${accent}">Systems Engineering Portfolio</span></div>
                <h1 class="text-3xl md:text-5xl font-bold tracking-tight leading-none" style="color:${fg}">${PROFILE.name}</h1>
                <p class="text-lg md:text-xl mt-2 font-medium" style="color:${sub}">${PROFILE.tagline}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="showRatingsCMS()" class="p-2.5 border flex-shrink-0 shadow-sm flex items-center justify-center transition-all hover:opacity-70" style="border-color:${border};background:${boxBg};color:${fg}" title="Open internal ratings screen" aria-label="Open internal ratings screen">${icon('arrowRight', 20)}</button>
                <button onclick="toggleTheme()" class="p-2.5 border flex-shrink-0 shadow-sm flex items-center justify-center transition-all hover:opacity-70" style="border-color:${border};background:${boxBg};color:${fg}" aria-label="Toggle Theme">${d ? icon('sun', 20) : icon('moon', 20)}</button>
            </div>
        </div>
        <div class="grid md:grid-cols-3 gap-6 mt-6 text-sm" style="color:${sub}">
            <div><p class="font-semibold" style="color:${fg}">${PROFILE.dept}</p><p>${PROFILE.inst}</p><p>${PROFILE.year} | ${PROFILE.loc}</p></div>
            <div><p>PRN: ${PROFILE.prn}</p><p><a href="mailto:${PROFILE.email1}" class="hover:underline" style="color:${accent}">${PROFILE.email1}</a></p><p><a href="mailto:${PROFILE.email2}" class="hover:underline" style="color:${accent}">${PROFILE.email2}</a></p><p>${PROFILE.phone}</p></div>
            <div><p><a href="https://${PROFILE.linkedin}" target="_blank" class="hover:underline" style="color:${accent}">${PROFILE.linkedin}</a></p><p><a href="https://${PROFILE.github}" target="_blank" class="hover:underline" style="color:${accent}">${PROFILE.github}</a></p><p class="mt-2 text-xs font-bold uppercase tracking-wide" style="color:${accent}">Domain Focus:</p><p class="text-xs">${PROFILE.domain}</p></div>
        </div>
        <div class="p-6 mt-8 shadow-sm glow-border" style="background:${boxBg};border:1px solid ${border}">
            <h2 class="text-lg font-bold uppercase mb-2 flex items-center gap-2" style="color:${fg}">${icon('target', 20)} Mission Statement</h2>
            <p class="text-sm text-justify leading-relaxed" style="color:${sub}">${PROFILE.mission}</p>
        </div>
    </header>`;

    // MAIN
    h += `<main class="max-w-6xl mx-auto px-6 md:px-8 py-12">`;

    // ALIGNMENT
    h += `<section class="reveal mb-16"><h2 class="text-2xl font-bold uppercase mb-6 pl-3" style="border-left:4px solid ${accent};color:${fg}">CopperCloud Alignment Matrix</h2>
        <div class="overflow-x-auto"><table class="w-full text-sm border-collapse" style="border:1px solid ${border}"><thead><tr style="background:${headerBg}"><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">CopperCloud Need</th><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">Verified Capability</th><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">Evidence</th></tr></thead><tbody>${ALIGNMENT.map(r => `<tr onmouseenter="this.style.background='${accentBg}'" onmouseleave="this.style.background='transparent'"><td class="p-3 align-top font-semibold" style="border:1px solid ${border};color:${fg}">${r.need}</td><td class="p-3 align-top" style="border:1px solid ${border};color:${sub}">${r.cap}</td><td class="p-3 align-top font-mono text-xs" style="border:1px solid ${border};color:${sub}">${r.ev}</td></tr>`).join('')}</tbody></table></div></section>`;

    // PROJECTS (ORDERED WITH COLLAPSE)
    h += `<section class="mb-16"><h2 class="text-2xl font-bold uppercase mb-8 pl-3" style="border-left:4px solid ${accent};color:${fg}">Project Implementations</h2><p class="text-sm mb-6" style="color:${sub}">Projects stay in their default chronology unless you set an internal ranking for CopperCloud on the ratings screen.</p><div class="space-y-6">`;
    const orderedProjects = getOrderedProjects();
    orderedProjects.forEach((p, i) => {
        h += buildProject(p, i, {d, fg, sub, border, boxBg, headerBg, accent, accentBg});
    });
    h += `</div></section>`;

    // MATH THEMES
    h += `<section class="reveal mb-16 pt-12" style="border-top:1px solid ${border}">
        <h2 class="text-2xl font-bold uppercase mb-8 pl-3" style="border-left:4px solid ${accent};color:${fg}">${icon('sigma', 20)} Mathematical Foundations</h2>
        <div class="grid md:grid-cols-2 gap-4">${MATH_THEMES.map(m => `
            <div class="p-4" style="border:1px solid ${border};background:${boxBg}">
                <h4 class="text-sm font-bold mb-2" style="color:${accent}">${m.theme}</h4>
                <div class="font-mono text-xs mb-2 p-2" style="background:${d ? '#0c0a09' : '#fff'};border:1px solid ${border};color:${fg}">${m.formula}</div>
                <p class="text-xs leading-relaxed" style="color:${sub}">${m.desc}</p>
            </div>`).join('')}</div>
    </section>`;

    // TECH MATRIX
    h += buildMatrix({d, fg, sub, border, boxBg, headerBg, accent, accentBg});

    // TIMELINE
    h += buildTimeline({d, fg, sub, border, boxBg, accent});

    // WHY COPPERCLOUD
    h += `<section class="reveal mb-16"><h2 class="text-2xl font-bold uppercase mb-6 pl-3" style="border-left:4px solid ${accent};color:${fg}">Why CopperCloud</h2><div class="p-6 shadow-sm relative overflow-hidden" style="border:1px solid ${border};background:${accentBg}"><div class="absolute top-0 right-0 opacity-5" style="transform:translate(30%,-30%)">${icon('zap', 200)}</div><p class="text-sm text-justify leading-relaxed relative z-10" style="color:${sub}">${PROFILE.whyCopper}</p></div></section>`;

    // SKILL GAPS + DEMOS
    h += `<div class="grid md:grid-cols-2 gap-8 mb-16">`;
    h += `<section class="reveal"><h2 class="text-xl font-bold uppercase mb-4 pl-3" style="border-left:4px solid ${accent};color:${fg}">Skill Gaps to Close</h2><div class="space-y-3">${SKILL_GAPS.map(sg => `<div class="p-4" style="border:1px solid ${border};border-left:3px solid ${accent};background:${boxBg}"><h4 class="text-sm font-bold mb-1" style="color:${fg}">${sg.gap}</h4><p class="text-xs" style="color:${sub}">${sg.plan}</p></div>`).join('')}</div></section>`;
    h += `<section class="reveal"><h2 class="text-xl font-bold uppercase mb-4 pl-3" style="border-left:4px solid ${accent};color:${fg}">Demo Inventory — 21 May</h2><div class="space-y-3">${DEMOS.map(dm => `<div class="p-4" style="border:1px solid ${border};border-left:3px solid ${d ? '#78716c' : '#a8a29e'};background:${boxBg}"><div class="flex justify-between items-start mb-1"><h4 class="text-sm font-bold" style="color:${fg}">${dm.name}</h4><span class="text-xs font-mono px-2 py-0.5" style="background:${accentBg};color:${accent};border:1px solid ${accent}">${dm.time}</span></div><p class="text-xs mb-1" style="color:${sub}"><strong>HW:</strong> ${dm.hw}</p><p class="text-xs" style="color:${sub}">${dm.shows}</p></div>`).join('')}</div></section>`;
    h += `</div></main>`;

    // FOOTER
    h += `<footer class="max-w-6xl mx-auto px-8 py-6 text-xs text-center uppercase tracking-widest" style="border-top:1px solid ${border};color:${sub}">Document Ref: IIOT-PORTFOLIO-002 | Target: CopperCloud IOTech MITeam | END OF DOCUMENT</footer>`;

    document.getElementById('app').innerHTML = h;
    setupReveal();
}

// ============================================================
// GALLERY RENDERING FUNCTIONS
// ============================================================

function buildCarouselGallery(images, projId, t) {
    const {d, accent} = t;
    if (!images || images.length === 0) {
        return `<div class="gallery-empty" style="color:${d ? '#a8a29e' : '#78716c'}">No images added yet</div>`;
    }

    const carouselId = `carousel-${projId}`;
    let h = `<div class="gallery-carousel" data-carousel="${carouselId}">`;
    
    images.forEach((img, i) => {
        h += `<div class="carousel-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">
            <img src="${esc(img.url)}" alt="${esc(img.caption || `Slide ${i + 1}`)}" />
        </div>`;
    });
    
    if (images.length > 1) {
        h += `<button class="carousel-nav prev" onclick="carouselPrev('${carouselId}')">❮</button>
            <button class="carousel-nav next" onclick="carouselNext('${carouselId}')">❯</button>
            <div class="carousel-controls">`;
        images.forEach((_, i) => {
            h += `<div class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="carouselGoto('${carouselId}', ${i})" data-dot="${i}"></div>`;
        });
        h += `</div>`;
    }
    
    if (images[0] && images[0].caption) {
        h += `<div class="carousel-caption">${esc(images[0].caption)}</div>`;
    }
    
    h += `</div>`;
    return h;
}

function buildGridGallery(images, t) {
    const {d} = t;
    if (!images || images.length === 0) {
        return `<div class="gallery-empty" style="color:${d ? '#a8a29e' : '#78716c'}">No images added yet</div>`;
    }

    let h = `<div class="gallery-grid">`;
    images.forEach((img, i) => {
        h += `<div class="grid-item">
            <img src="${esc(img.url)}" alt="${esc(img.caption || `Image ${i + 1}`)}" />
            ${img.caption ? `<div class="grid-caption">${esc(img.caption)}</div>` : ''}
        </div>`;
    });
    h += `</div>`;
    return h;
}

function buildCollageGallery(images, t) {
    const {d} = t;
    if (!images || images.length === 0) {
        return `<div class="gallery-empty" style="color:${d ? '#a8a29e' : '#78716c'}">No images added yet</div>`;
    }

    let h = `<div class="gallery-collage">`;
    images.forEach((img, i) => {
        h += `<div class="collage-item">
            <img src="${esc(img.url)}" alt="${esc(img.caption || `Image ${i + 1}`)}" />
            ${img.caption ? `<div class="collage-caption">${esc(img.caption)}</div>` : ''}
        </div>`;
    });
    h += `</div>`;
    return h;
}

function buildVerticalGallery(images, t) {
    const {d} = t;
    if (!images || images.length === 0) {
        return `<div class="gallery-empty" style="color:${d ? '#a8a29e' : '#78716c'}">No images added yet</div>`;
    }

    let h = `<div class="gallery-vertical">`;
    images.forEach((img, i) => {
        h += `<div class="vertical-item">
            <img src="${esc(img.url)}" alt="${esc(img.caption || `Image ${i + 1}`)}" />
            ${img.caption ? `<div class="vertical-caption">${esc(img.caption)}</div>` : ''}
        </div>`;
    });
    h += `</div>`;
    return h;
}

function carouselPrev(carouselId) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;
    const slides = carousel.querySelectorAll('.carousel-slide');
    const current = carousel.querySelector('.carousel-slide.active');
    const currentIndex = Array.from(slides).indexOf(current);
    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
    carouselGoto(carouselId, prevIndex);
}

function carouselNext(carouselId) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;
    const slides = carousel.querySelectorAll('.carousel-slide');
    const current = carousel.querySelector('.carousel-slide.active');
    const currentIndex = Array.from(slides).indexOf(current);
    const nextIndex = (currentIndex + 1) % slides.length;
    carouselGoto(carouselId, nextIndex);
}

function carouselGoto(carouselId, index) {
    const carousel = document.querySelector(`[data-carousel="${carouselId}"]`);
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const caption = carousel.querySelector('.carousel-caption');
    
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    if (slides[index]) {
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        
        // Update caption
        if (caption) {
            const img = slides[index].querySelector('img');
            const alt = img ? img.getAttribute('alt') : '';
            caption.textContent = alt;
        }
    }
}

function buildProjectGallery(proj, t) {
    if (!proj.images || proj.images.length === 0) {
        return ''; // Don't show gallery section if no images
    }
    
    const mode = proj.galleryMode || 'carousel';
    let gallery = '';
    
    if (mode === 'carousel') {
        gallery = buildCarouselGallery(proj.images, proj.id, t);
    } else if (mode === 'grid') {
        gallery = buildGridGallery(proj.images, t);
    } else if (mode === 'collage') {
        gallery = buildCollageGallery(proj.images, t);
    } else if (mode === 'vertical') {
        gallery = buildVerticalGallery(proj.images, t);
    }

    const widthValue = Number(proj.galleryWidth);
    const widthStyle = Number.isFinite(widthValue) ? `width:${widthValue}%;` : 'width:100%;';

    return `<div class="gallery-container" style="border-color:${t.border};${widthStyle}max-width:100%;margin-left:auto;margin-right:auto;">${gallery}</div>`;
}

function buildProject(proj, idx, t) {
    const {d, fg, sub, border, boxBg, headerBg, accent, accentBg} = t;
    const isCollapsed = state.collapsedProjects[proj.id];
    
    let h = `<div class="reveal" style="border-bottom:1px solid ${border};padding-bottom:24px">`;

    // Project Title with Collapse Toggle
    h += `<div class="project-header" onclick="toggleProjectCollapse('${proj.id}')" style="cursor:pointer">
        <div class="flex items-center gap-3 flex-1">
            <span class="project-collapse-toggle ${isCollapsed ? 'collapsed' : ''}" style="color:${accent}">${icon('chevDown', 20)}</span>
            <div>
                <h3 class="text-xl md:text-2xl font-bold uppercase" style="color:${fg}"><span style="color:${accent}">${idx + 1}.</span> ${proj.title}</h3>
            </div>
        </div>
        <div class="flex gap-2 flex-wrap">
            <span class="text-xs font-mono px-2 py-1" style="border:1px solid ${border};background:${boxBg};color:${sub}">${proj.status}</span>
        </div>
    </div>`;

    // Project Content (Collapsible)
    h += `<div class="project-content ${isCollapsed ? 'collapsed' : ''}" style="padding-top:16px">`;
    h += `<p class="text-sm italic mb-6" style="color:${sub}">${proj.statusLabel}</p>`;

    if (proj.id === 'wifi-optimizer') {
        h += buildWifiOptimizer(proj, {d, fg, sub, border, boxBg, accent, accentBg});
    } else if (proj.layers) {
        h += buildMultiLayerProject(proj, {d, fg, sub, border, boxBg, headerBg, accent, accentBg});
    } else {
        h += buildSingleLayerProject(proj, {d, fg, sub, border, boxBg, headerBg, accent, accentBg});
    }

    // Add Gallery if images exist
    if (proj.images && proj.images.length > 0) {
        h += `<div class="mt-8 pt-6" style="border-top:1px solid ${border}">
            <h4 class="text-xs font-bold uppercase mb-4 flex items-center gap-2" style="color:${accent}">${icon('image', 14)} Gallery</h4>
            ${buildProjectGallery(proj, {d, fg, sub, border, boxBg, accent, accentBg})}
        </div>`;
    }

    h += `</div></div>`;
    return h;
}

function buildWifiOptimizer(proj, t) {
    const {d, fg, sub, border, boxBg, accent, accentBg} = t;
    let h = `<p class="text-sm mb-6 leading-relaxed" style="color:${sub}">${proj.tagline}</p>`;
    h += `<div class="mb-6">
        <h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('network', 14)} Wi-Fi Optimiser Flow</h4>
        <div class="flex flex-col md:flex-row items-stretch justify-between gap-2">
            ${proj.arch.map((step, si) => {
                const isActive = state.wifiDetailIndex === si;
                const card = `<button type="button" onclick="setWifiDetail(${si})" class="flex-1 text-center px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5" style="cursor:pointer;border:1px solid ${isActive ? accent : border};background:${isActive ? accentBg : (d ? '#0c0a09' : '#fff')}"><div class="text-xs font-bold uppercase mb-0.5" style="color:${fg}">${step.step}</div><div class="text-[10px] leading-tight" style="color:${sub}">${step.desc}</div></button>`;
                const arrow = si < proj.arch.length - 1 ? `<div class="hidden md:flex items-center arch-pulse" style="color:${accent}">${icon('arrowRight', 16)}</div><div class="block md:hidden flex justify-center arch-pulse" style="color:${accent}">${icon('arrowDown', 16)}</div>` : '';
                return card + arrow;
            }).join('')}
        </div>
    </div>`;

    const selectedStep = proj.flowDetails?.[state.wifiDetailIndex] || proj.flowDetails?.[0];
    if (selectedStep) {
        h += `<div class="mb-6 p-4 md:p-5" style="border:1px solid ${border};background:${boxBg}">
            <div class="flex items-start justify-between gap-4 mb-3">
                <div>
                    <p class="text-xs font-bold uppercase tracking-wider mb-1" style="color:${accent}">What this block does</p>
                    <h4 class="text-base md:text-lg font-bold" style="color:${fg}">${selectedStep.title}</h4>
                </div>
                <span class="text-[10px] font-mono px-2 py-1" style="border:1px solid ${border};color:${sub}">Click another block to switch</span>
            </div>
            <ul class="space-y-2 text-sm" style="color:${sub}">
                ${selectedStep.points.map(point => `<li class="flex gap-2"><span style="color:${accent};font-weight:700">•</span><span>${point}</span></li>`).join('')}
            </ul>
        </div>`;
    }

    const layerId = `${proj.id}-code`;
    if (!(layerId in state.codeMode)) {
        state.codeMode[layerId] = 'raw';
        state.codeStep[layerId] = 0;
    }
    if (proj.code) {
        h += `<div class="mb-6"><h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('code', 14)} Implementation</h4><div id="code-block-${layerId}">${renderCodeHTML(proj.code, proj.walk, layerId)}</div></div>`;
    }

    return h;
}

function buildMultiLayerProject(proj, t) {
    const {d, fg, sub, border, boxBg, headerBg, accent, accentBg} = t;
    let h = `<p class="text-sm mb-6 leading-relaxed" style="color:${sub}">${proj.tagline}</p>`;
    h += `<p class="text-sm mb-5 leading-relaxed" style="color:${sub}">This project is about a model that can keep learning after it has already been trained. Instead of starting over every time new information arrives, it tries to remember earlier knowledge, adapt to new situations, and stay practical on a small device. The goal is to make the system useful when conditions change without making it too heavy or slow.</p>`;
    h += `<div class="mb-5 p-4" style="border:1px solid ${border};background:${boxBg}">
        <h4 class="text-xs font-bold uppercase mb-3" style="color:${accent}">Use Cases</h4>
        <div class="space-y-2 text-sm leading-relaxed" style="color:${sub}">
            <p><strong style="color:${fg}">Project use case:</strong> keep an already-trained system useful when fresh information appears, so it can continue working without being rebuilt from scratch.</p>
            <p><strong style="color:${fg}">Model use case:</strong> adapt to new patterns while protecting old knowledge, which matters when the same model must run for a long time on limited hardware.</p>
            <p><strong style="color:${fg}">Real-world benefit:</strong> reduce retraining effort, keep the system responsive, and make updates easier to manage on edge devices.</p>
        </div>
    </div>`;
    h += `<div class="mb-6 p-5 md:p-6 shadow-sm" style="border:1px solid ${border};background:linear-gradient(135deg, ${d ? 'rgba(28,25,23,.96)' : 'rgba(255,255,255,.96)'} 0%, ${accentBg} 100%)">
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="max-w-2xl">
                <div class="flex items-center gap-2 mb-3"><span class="inline-flex items-center justify-center w-8 h-8 rounded-full" style="background:${accentBg};color:${accent}">${icon('cpu', 16)}</span><p class="text-xs font-bold uppercase tracking-[.18em]" style="color:${accent}">Project Snapshot</p></div>
                <h4 class="text-lg md:text-xl font-bold mb-3" style="color:${fg}">An edge system that keeps improving without losing what it already learned.</h4>
                <p class="text-sm leading-relaxed" style="color:${sub}">The core idea is simple: the model should handle change gracefully. It keeps old knowledge, learns from new situations, and stays lightweight enough to run close to the device where the data appears.</p>
            </div>
            <div class="grid grid-cols-3 md:grid-cols-1 gap-2 md:min-w-[190px]">
                <div class="px-3 py-2 rounded" style="border:1px solid ${border};background:${d ? '#0c0a09' : '#fff'}"><div class="text-[10px] uppercase font-bold tracking-wide" style="color:${accent}">Focus</div><div class="text-sm font-semibold" style="color:${fg}">Keep learning</div></div>
                <div class="px-3 py-2 rounded" style="border:1px solid ${border};background:${d ? '#0c0a09' : '#fff'}"><div class="text-[10px] uppercase font-bold tracking-wide" style="color:${accent}">Constraint</div><div class="text-sm font-semibold" style="color:${fg}">Stay lightweight</div></div>
                <div class="px-3 py-2 rounded" style="border:1px solid ${border};background:${d ? '#0c0a09' : '#fff'}"><div class="text-[10px] uppercase font-bold tracking-wide" style="color:${accent}">Result</div><div class="text-sm font-semibold" style="color:${fg}">No full retrain</div></div>
            </div>
        </div>
    </div>`;
    h += `<div class="mb-4"><button onclick="showCLDialog()" class="px-3 py-2 text-xs font-bold shadow-sm" style="border:1px solid ${border};background:${boxBg};color:${accent};cursor:pointer">Learn more — Continual Learning</button></div>`;

    h += `<div class="flex flex-wrap gap-1 mb-6" style="border-bottom:2px solid ${border}">`;
    proj.layers.forEach((layer, li) => {
        const isActive = state.activeLayer[proj.id] === li;
        h += `<button onclick="setLayer('${proj.id}',${li})" class="layer-tab text-xs font-bold uppercase px-4 py-2.5 flex items-center gap-1.5 ${isActive ? 'active' : ''}" style="color:${isActive ? accent : sub};border-bottom:2px solid ${isActive ? accent : 'transparent'};margin-bottom:-2px;background:transparent;border:none;cursor:pointer;transition:all 0.15s ease">${icon(layer.icon, 14)} ${layer.name}</button>`;
    });
    h += `</div>`;

    const activeIdx = state.activeLayer[proj.id] || 0;
    const layer = proj.layers[activeIdx];

    h += `<div class="layer-content active">`;
    h += `<p class="text-sm mb-4 leading-relaxed" style="color:${sub}">${layer.desc}</p>`;

    h += `<div class="mb-6"><h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('network', 14)} ${layer.name} Architecture</h4>
        <div class="flex flex-col md:flex-row items-stretch justify-between gap-2">
                    ${layer.arch.map((step, si) => {
                        const searchText = (step.step + ' ' + (step.desc || '')).toLowerCase();
                        let defKey = Object.keys(DEFINITIONS).find(k => searchText.indexOf(k.toLowerCase()) !== -1);
                        if (!defKey && /\bks\b/i.test(searchText)) defKey = 'KS Test';
                        if (!defKey && /page-?hinkley/i.test(searchText)) defKey = 'Page-Hinkley';
                        const inner = `<div class="flex-1 text-center px-3 py-3 shadow-sm" style="border:1px solid ${border};background:${d ? '#0c0a09' : '#fff'};cursor:pointer"><div class="text-xs font-bold uppercase mb-0.5" style="color:${fg}">${step.step}</div><div class="text-[10px] leading-tight" style="color:${sub}">${step.desc}</div></div>`;
                        const sHTML = defKey ? `<a href="#" onclick="showTermModal('${defKey.replace(/'/g, '\\\'')}'.toUpperCase());return false;" style="text-decoration:none">${inner}</a>` : inner;
                        const arrow = si < layer.arch.length - 1 ? `<div class="hidden md:flex items-center arch-pulse" style="color:${accent}">${icon('arrowRight', 16)}</div><div class="block md:hidden flex justify-center arch-pulse" style="color:${accent}">${icon('arrowDown', 16)}</div>` : '';
                        return sHTML + arrow;
                    }).join('')}
        </div>
    </div>`;

    h += `<div class="mb-6"><h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('target', 14)} ${layer.name} Metrics</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            ${layer.metrics.map(m => `<div class="p-3" style="border:1px solid ${border};background:${boxBg}"><div class="text-[10px] uppercase font-bold tracking-wide mb-1" style="color:${sub}">${m.label}</div><div class="text-sm font-bold font-mono" style="color:${fg}">${m.val}</div></div>`).join('')}
        </div>
    </div>`;

    h += `<div class="mb-6"><div class="flex flex-wrap gap-1.5">${layer.tags.map(tag => {
        const defKey = Object.keys(DEFINITIONS).find(k => k.toLowerCase() === tag.toLowerCase());
        if (defKey) {
            return `<a href="#" onclick="showTermModal('${defKey.replace(/'/g, '\\\'')}'.toUpperCase());return false;" class="px-2 py-1 text-[11px] font-mono" style="border:1px solid ${border};background:${boxBg};color:${sub};text-decoration:none;cursor:pointer">${tag}</a>`;
        }
        return `<span class="px-2 py-1 text-[11px] font-mono" style="border:1px solid ${border};background:${boxBg};color:${sub}">${tag}</span>`;
    }).join('')}</div></div>`;

    if (layer.code) {
        const layerId = `${proj.id}-${layer.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
        if (!(layerId in state.codeMode)) {
            state.codeMode[layerId] = 'raw';
            state.codeStep[layerId] = 0;
        }
        h += `<div class="mb-6"><h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('code', 14)} ${layer.name} Implementation</h4><div id="code-block-${layerId}">${renderCodeHTML(layer.code, layer.walk, layerId)}</div></div>`;
    }

    h += `</div>`;

    return h;
}

function buildSingleLayerProject(proj, t) {
    const {d, fg, sub, border, boxBg, headerBg, accent, accentBg} = t;
    let h = '';

    h += `<div class="mb-6"><h4 class="text-sm font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('network', 16)} System Architecture</h4>
        <div class="flex flex-col md:flex-row items-stretch justify-between gap-2">
            ${proj.arch.map((step, si) => {
                const searchText = (step.step + ' ' + (step.desc || '')).toLowerCase();
                let defKey = Object.keys(DEFINITIONS).find(k => searchText.indexOf(k.toLowerCase()) !== -1);
                if (!defKey && /\bks\b/i.test(searchText)) defKey = 'KS Test';
                if (!defKey && /page-?hinkley/i.test(searchText)) defKey = 'Page-Hinkley';
                const inner = `<div class="flex-1 text-center px-3 py-3 shadow-sm" style="border:1px solid ${border};background:${d ? '#0c0a09' : '#fff'};cursor:pointer"><div class="text-xs font-bold uppercase mb-0.5" style="color:${fg}">${step.step}</div><div class="text-[10px] leading-tight" style="color:${sub}">${step.desc}</div></div>`;
                const sHTML = defKey ? `<a href="#" onclick="showTermModal('${defKey.replace(/'/g, '\\\'')}'.toUpperCase());return false;" style="text-decoration:none">${inner}</a>` : inner;
                const arrow = si < proj.arch.length - 1 ? `<div class="hidden md:flex items-center arch-pulse" style="color:${accent}">${icon('arrowRight', 16)}</div><div class="block md:hidden flex justify-center arch-pulse" style="color:${accent}">${icon('arrowDown', 16)}</div>` : '';
                return sHTML + arrow;
            }).join('')}
        </div>
    </div>`;

    h += `<div class="mb-6"><h4 class="text-sm font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('target', 16)} Key Metrics</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            ${proj.metrics.map(m => `<div class="p-3" style="border:1px solid ${border};background:${boxBg}"><div class="text-[10px] uppercase font-bold tracking-wide mb-1" style="color:${sub}">${m.label}</div><div class="text-sm font-bold font-mono" style="color:${fg}">${m.val}</div></div>`).join('')}
        </div>
    </div>`;

    h += `<div class="mb-6"><div class="flex flex-wrap gap-1.5">${proj.tags.map(tag => {
        const defKey = Object.keys(DEFINITIONS).find(k => k.toLowerCase() === tag.toLowerCase());
        if (defKey) {
            return `<a href="#" onclick="showTermModal('${defKey.replace(/'/g, '\\\'')}'.toUpperCase());return false;" class="px-2 py-1 text-[11px] font-mono" style="border:1px solid ${border};background:${boxBg};color:${sub};text-decoration:none;cursor:pointer">${tag}</a>`;
        }
        return `<span class="px-2 py-1 text-[11px] font-mono" style="border:1px solid ${border};background:${boxBg};color:${sub}">${tag}</span>`;
    }).join('')}</div></div>`;

    if (proj.code) {
        h += `<div class="mb-6"><h4 class="text-xs font-bold uppercase mb-3 flex items-center gap-2" style="color:${accent}">${icon('code', 16)} Implementation</h4><div id="code-block-${proj.id}">${renderCodeHTML(proj.code, proj.walk, proj.id)}</div></div>`;
    }

    return h;
}

function buildMatrix(t) {
    const {d, fg, sub, border, boxBg, accent, accentBg} = t;
    let h = `<section class="reveal mb-16 pt-12" style="border-top:1px solid ${border}">
        <h2 class="text-2xl font-bold uppercase mb-8 pl-3" style="border-left:4px solid ${accent};color:${fg}">Technology Traceability Matrix</h2>
        <div class="grid md:grid-cols-3 gap-4">`;
    TECHS.forEach(cat => {
        h += `<div class="p-4" style="border:1px solid ${border};background:${boxBg}">
            <h3 class="text-xs font-bold uppercase mb-3 tracking-wider" style="color:${accent}">${cat.cat}</h3>
            <div class="space-y-1">${cat.items.map((item, i) => `<div class="flex justify-between items-center text-xs py-1" style="border-bottom:1px dotted ${border}"><span style="color:${fg}">${item}</span><span class="font-mono text-[10px]">${cat.status[i]}</span></div>`).join('')}</div>
        </div>`;
    });
    h += `</div>`;

    h += `<h3 class="text-lg font-bold uppercase mt-10 mb-4 flex items-center gap-2" style="color:${fg}">${icon('merge', 18)} Technologies In Progress</h3>
    <div class="overflow-x-auto"><table class="w-full text-sm border-collapse" style="border:1px solid ${border}"><thead><tr style="background:${d ? '#1c1917' : '#e7e5e4'}"><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">Technology</th><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">Status</th><th class="p-3 text-left uppercase text-xs font-bold" style="border:1px solid ${border};color:${accent}">Context</th></tr></thead><tbody>${LEARNING.map(r => `<tr onmouseenter="this.style.background='${accentBg}'" onmouseleave="this.style.background='transparent'"><td class="p-3 font-semibold" style="border:1px solid ${border};color:${fg}">${r.tech}</td><td class="p-3 font-mono text-xs" style="border:1px solid ${border};color:${sub}">${r.status}</td><td class="p-3 text-xs" style="border:1px solid ${border};color:${sub}">${r.ctx}</td></tr>`).join('')}</tbody></table></div></section>`;
    return h;
}

function buildTimeline(t) {
    const {d, fg, sub, border, boxBg, accent} = t;
    return `<section class="reveal mb-16 pt-12" style="border-top:1px solid ${border}">
        <h2 class="text-2xl font-bold uppercase mb-8 pl-3" style="border-left:4px solid ${accent};color:${fg}">Experience & Achievements</h2>
        <div class="relative pl-8" style="border-left:2px solid ${border}">
            ${TIMELINE.map(ev => `<div class="timeline-item relative mb-8"><div class="flex flex-col md:flex-row md:items-start gap-4"><div class="md:w-40 flex-shrink-0"><span class="text-xs font-bold font-mono uppercase tracking-wider" style="color:${accent}">${ev.date}</span><p class="text-xs mt-0.5" style="color:${sub}">${ev.org}</p></div><div class="flex-1 p-4" style="border:1px solid ${border};background:${boxBg}"><h4 class="text-sm font-bold mb-1" style="color:${fg}">${ev.event}</h4><p class="text-xs leading-relaxed" style="color:${sub}">${ev.detail}</p></div></div></div>`).join('')}
        </div>
    </section>`;
}

// ============================================================
// MODAL & DIALOG FUNCTIONS
// ============================================================

function showModal(title, htmlContent) {
    const existing = document.getElementById('modal-root');
    if (existing) existing.remove();
    const root = document.createElement('div');
    root.id = 'modal-root';
    root.innerHTML = `
        <div class="modal-overlay fixed inset-0 bg-black/40 flex items-center justify-center" style="z-index:99999">
            <div class="modal-card max-w-3xl w-[94%] p-4 md:p-6 rounded shadow-lg" style="background:var(--card-bg,#fff);border-radius:8px;max-height:70vh;overflow:auto">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
                    <div style="font-weight:700;color:var(--fg,#111)">${esc(title)}</div>
                    <button onclick="closeModal()" aria-label="Close" style="border:none;background:transparent;font-weight:700;cursor:pointer">${icon('x', 18)}</button>
                </div>
                <div style="padding-top:6px">${htmlContent}</div>
            </div>
        </div>
    `;
    document.body.appendChild(root);
    document.documentElement.style.setProperty('--card-bg', state.dark ? '#0b0b0d' : '#ffffff');
    document.documentElement.style.setProperty('--fg', state.dark ? '#e7e5e4' : '#1c1917');
    const overlay = root.querySelector('.modal-overlay');
    overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
    };
}

function closeModal() {
    const el = document.getElementById('modal-root');
    if (el) el.remove();
}

function showCLDialog() {
    const intro = `<div style="padding:12px 14px;border:1px solid rgba(0,0,0,0.08);border-radius:8px;background:rgba(180,83,9,0.06);font-size:13px;line-height:1.6;color:#374151">Continual learning is a way of teaching a model new things without forcing it to forget what it already knows. In practice, that means the system keeps improving over time, reacts to new data, and stays useful when the environment changes. The project below uses that idea to keep a small edge model adaptable, efficient, and safe enough to keep running in the real world.</div>`;
    let defs = '<div class="space-y-3" style="color:var(--fg,#111);margin-top:12px">';
    Object.keys(DEFINITIONS).forEach(k => {
        defs += `<div style="border-bottom:1px solid rgba(0,0,0,0.06);padding:8px 0"><div style="font-weight:700;color:#b45309;margin-bottom:6px">${k}</div><div style="font-size:13px;color:#374151">${DEFINITIONS[k]}</div></div>`;
    });
    defs += '</div>';

    const content = `<div style="display:flex;flex-direction:column;gap:12px">${intro}${defs}</div>`;
    showModal('Continual Learning — Definitions', content);
}

function showTermModal(term) {
    const def = DEFINITIONS[term] || '<strong>' + term + '</strong>: definition not available.';
    const walk = TERM_WALKS[term] || [];
    let stepsHTML = '';
    if (walk.length) {
        stepsHTML += `<div style="margin-top:10px"><div style="font-weight:700;color:#b45309;margin-bottom:6px">Walkthrough</div>`;
        walk.forEach((s, i) => {
            stepsHTML += `<div style="padding:8px 0;border-top:1px solid rgba(0,0,0,0.04)"><div style="font-weight:700;font-size:13px">${i + 1}. ${esc(s.step)}</div><div style="font-size:13px;color:#374151;margin-top:4px">${esc(s.note)}</div></div>`;
        });
        stepsHTML += `</div>`;
    }
    const content = `<div style="display:flex;flex-direction:column;gap:10px"><div style="font-size:14px;color:#374151">${def}</div>${stepsHTML}</div>`;
    showModal(term + ' — Definition', content);
}

function showRatingsCMS() {
    window.location.href = 'ratings-cms.html';
}

// ============================================================
// EVENT HANDLERS
// ============================================================

function toggleTheme() {
    state.dark = !state.dark;
    buildPage();
}

function toggleProjectCollapse(projId) {
    state.collapsedProjects[projId] = !state.collapsedProjects[projId];
    saveCollapsedState();
    buildPage();
}

function setLayer(projId, layerIdx) {
    state.activeLayer[projId] = layerIdx;
    buildPage();
}

function setWifiDetail(stepIdx) {
    state.wifiDetailIndex = stepIdx;
    buildPage();
}

function setCodeMode(id, mode) {
    state.codeMode[id] = mode;
    state.codeStep[id] = 0;
    const el = document.getElementById(`code-block-${id}`);
    if (el) {
        let code = null, walk = null;
        for (const p of PROJECTS) {
            if (p.layers) {
                for (const l of p.layers) {
                    if (`${p.id}-${l.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` === id) {
                        code = l.code;
                        walk = l.walk;
                        break;
                    }
                }
            }
            if (p.id === id) {
                code = p.code;
                walk = p.walk;
                break;
            }
        }
        if (code) el.innerHTML = renderCodeHTML(code, walk, id);
    }
}

function codeStepPrev(id) {
    state.codeStep[id] = Math.max(0, state.codeStep[id] - 1);
    const el = document.getElementById(`code-block-${id}`);
    if (el) {
        let code = null, walk = null;
        for (const p of PROJECTS) {
            if (p.layers) {
                for (const l of p.layers) {
                    if (`${p.id}-${l.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` === id) {
                        code = l.code;
                        walk = l.walk;
                        break;
                    }
                }
            }
            if (p.id === id) {
                code = p.code;
                walk = p.walk;
                break;
            }
        }
        if (code) el.innerHTML = renderCodeHTML(code, walk, id);
    }
}

function codeStepNext(id) {
    let walk = null;
    for (const p of PROJECTS) {
        if (p.layers) {
            for (const l of p.layers) {
                if (`${p.id}-${l.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` === id) {
                    walk = l.walk;
                    break;
                }
            }
        }
        if (p.id === id) {
            walk = p.walk;
            break;
        }
    }
    if (walk) state.codeStep[id] = Math.min(walk.length - 1, state.codeStep[id] + 1);
    const el = document.getElementById(`code-block-${id}`);
    if (el) {
        let code = null;
        for (const p of PROJECTS) {
            if (p.layers) {
                for (const l of p.layers) {
                    if (`${p.id}-${l.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}` === id) {
                        code = l.code;
                        break;
                    }
                }
            }
            if (p.id === id) {
                code = p.code;
                break;
            }
        }
        if (code) el.innerHTML = renderCodeHTML(code, walk, id);
    }
}

function setupReveal() {
    if (window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        return;
    }
    const obs = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        },
        { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function updateProjectRating(projectId, company, rating) {
    if (rating) {
        ratingsManager.setRating(projectId, company, parseInt(rating));
        buildPage(); // Refresh to show new order
    }
}

// Initialize after all assets load to reduce FOUC warnings
window.addEventListener('load', () => {
    try {
        loadCollapsedState();
        buildPage();
    } catch (err) {
        console.error('Portfolio render error', err);
        const root = document.getElementById('app') || document.body;
        if (root) root.innerHTML = `<div style="padding:24px;color:#b45309;background:#fff3ed;border:1px solid #f5c6aa"><h2>Rendering error</h2><pre style="white-space:pre-wrap;color:#7c2d12">${err && err.stack ? esc(err.stack) : esc(String(err))}</pre></div>`;
    }
});

// Global error handler to show runtime errors in-page for easier debugging
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error', message, source, lineno, colno, error);
    const root = document.getElementById('app') || document.body;
    if (root) {
        root.innerHTML = `<div style="padding:24px;color:#b45309;background:#fff3ed;border:1px solid #f5c6aa"><h2>Runtime error</h2><div style="font-size:13px;color:#7c2d12">${esc(message)} at ${esc(source||'')}:${lineno}:${colno}</div><pre style="white-space:pre-wrap;color:#7c2d12">${error && error.stack ? esc(error.stack) : ''}</pre></div>`;
    }
    return false;
};
