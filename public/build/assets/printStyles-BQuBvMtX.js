import{c as e,o as t,t as n}from"./app-4aPZa0_r.js";var r=e(t(),1),i=n();function a({children:e}){let t=(0,r.useRef)(null),n=(0,r.useRef)(null);return(0,r.useLayoutEffect)(()=>{let e=()=>{let e=t.current,r=n.current;if(!e||!r)return;r.style.transform=`none`,r.style.width=`100%`,r.style.maxWidth=`100%`;let i=e.clientHeight,a=r.scrollHeight;if(a<=i||i<=0)return;let o=Math.max(.58,i/a);r.style.transformOrigin=`top center`,r.style.transform=`scale(${o})`,r.style.width=`100%`};e();let r=requestAnimationFrame(e),i=setTimeout(e,50);return window.addEventListener(`resize`,e),()=>{cancelAnimationFrame(r),clearTimeout(i),window.removeEventListener(`resize`,e)}},[e]),(0,i.jsx)(`div`,{className:`spk-fit-host`,ref:t,children:(0,i.jsx)(`div`,{className:`spk-slip`,ref:n,children:e})})}var o=`
:root { color-scheme: light; }

* {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
}

body {
    margin: 0;
    background: #1b2330;
    font-family: Manrope, ui-sans-serif, system-ui, sans-serif;
    color: #0a0a0a;
}

.spk-print-root { min-height: 100vh; }

.spk-toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: #141a22;
    color: #f3efe6;
    border-bottom: 1px solid rgba(196,165,116,.35);
}
.spk-toolbar-title { margin: 0; font-size: 16px; font-weight: 600; }
.spk-toolbar-sub { margin: 4px 0 0; font-size: 12px; color: #8b95a5; max-width: 560px; }
.spk-toolbar-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.spk-toolbar-actions a,
.spk-toolbar-actions button {
    border: 1px solid rgba(196,165,116,.55);
    background: transparent;
    color: #dbbf8f;
    border-radius: 2px;
    padding: 8px 12px;
    font-size: 12px;
    text-decoration: none;
    cursor: pointer;
}
.spk-toolbar-actions button.active {
    background: #c4a574;
    color: #0b0f14;
    border-color: #c4a574;
}

.spk-sheet {
    width: 210mm;
    min-height: 297mm;
    margin: 20px auto;
    background: #fffdf8;
    color: #0a0a0a;
    box-shadow: 0 10px 40px rgba(0,0,0,.35);
}

.spk-half {
    height: 148.5mm;
    padding: 4mm 6mm;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
}

.spk-cut {
    height: 0;
    border-top: 1.5px dashed #8a6a3a;
    position: relative;
}
.spk-cut span {
    position: absolute;
    left: 50%;
    top: -8px;
    transform: translateX(-50%);
    background: #fffdf8;
    color: #6b5228;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 0 8px;
}

.spk-placeholder {
    height: 100%;
    border: 1.5px dashed #b08950;
    background: repeating-linear-gradient(
        -45deg,
        #f7f1e6,
        #f7f1e6 8px,
        #fffdf8 8px,
        #fffdf8 16px
    );
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #6b5228;
    font-size: 12px;
    font-weight: 600;
    gap: 6px;
    text-align: center;
}

.spk-fit-host {
    height: 100%;
    width: 100%;
    overflow: hidden;
}

.spk-slip {
    display: flex;
    flex-direction: column;
    gap: 1.6mm;
    width: 100%;
    transform-origin: top left;
}

/* —— Compact top block —— */
.spk-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #0f1520 0%, #1c2738 100%);
    color: #fffdf8;
    padding: 1.8mm 2.5mm;
    border: 1.5px solid #9a7d4f;
    border-left: 3.5px solid #c4a574;
    flex-shrink: 0;
}
.spk-brand {
    margin: 0;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: .02em;
    color: #f3efe6;
    line-height: 1.1;
}
.spk-tagline {
    margin: 0;
    font-size: 8px;
    font-weight: 600;
    color: #dbbf8f;
    line-height: 1.2;
}
.spk-header-right { text-align: right; }
.spk-doc-title {
    margin: 0;
    font-size: 8.5px;
    font-weight: 800;
    letter-spacing: .1em;
    color: #c4a574;
    line-height: 1.2;
}
.spk-number {
    margin: 0;
    font-size: 12px;
    font-weight: 800;
    color: #fffdf8;
    line-height: 1.2;
}
.trx-paid-badge {
    display: inline-block;
    margin-top: 1px;
    padding: 0 6px;
    background: #1f6b45;
    border: 1px solid #0f3d28;
    color: #e8fff2;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: .12em;
    line-height: 1.4;
}

.spk-top-compact {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 1.5mm;
    flex-shrink: 0;
}

.spk-meta-inline {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0;
    background: #f0e6d4;
    border: 1.5px solid #9a7d4f;
    padding: 1.4mm 2mm;
}
.spk-meta-inline .row {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    font-size: 9px;
    line-height: 1.35;
    border-bottom: 1px solid #d4bf95;
    padding: 0.6mm 0;
}
.spk-meta-inline .row:last-child { border-bottom: 0; }
.spk-meta-inline .row span {
    color: #6b5228;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .04em;
    font-size: 7.5px;
    flex-shrink: 0;
}
.spk-meta-inline .row strong {
    color: #0a0a0a;
    font-weight: 800;
    text-align: right;
}

.spk-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2mm;
}
.spk-box {
    border: 1.5px solid #8a6a3a;
    background: #fff8ec;
    padding: 1.2mm 1.6mm;
}
.spk-label {
    margin: 0;
    font-size: 7px;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: #6b5228;
    font-weight: 800;
    line-height: 1.2;
}
.spk-value {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    color: #0a0a0a;
    line-height: 1.2;
}
.spk-sub {
    margin: 0;
    font-size: 8px;
    font-weight: 600;
    color: #2c2418;
    line-height: 1.2;
}

.spk-desc-inline {
    border: 1.5px solid #8a6a3a;
    background: #fff;
    padding: 1.2mm 1.8mm;
    flex-shrink: 0;
    font-size: 9px;
    line-height: 1.25;
}
.spk-desc-inline .spk-label {
    display: inline;
    margin-right: 4px;
}
.spk-desc-inline .spk-body {
    display: inline;
    margin: 0;
    font-size: 9px;
    font-weight: 600;
    color: #121212;
    white-space: normal;
    max-height: none;
    overflow: visible;
}

.spk-section {
    border: 1.5px solid #8a6a3a;
    background: #fff;
    padding: 1.4mm 1.8mm;
    flex: 1 1 auto;
    min-height: 0;
}

.spk-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    table-layout: fixed;
    margin-top: 1mm;
    font-size: 9px;
}
.spk-table th,
.spk-table td {
    border-bottom: 1px solid #d4bf95;
    text-align: left;
    padding: 1.5px 2.5px;
    color: #0a0a0a;
    font-weight: 600;
    vertical-align: top;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
}
.spk-table th {
    color: #6b5228;
    font-weight: 800;
    font-size: 7px;
    text-transform: uppercase;
    border-bottom-color: #9a7d4f;
    letter-spacing: .02em;
}
.spk-table col.col-num { width: 6%; }
.spk-table col.col-item { width: 34%; }
.spk-table col.col-type { width: 16%; }
.spk-table col.col-qty { width: 8%; }
.spk-table col.col-price { width: 18%; }
.spk-table col.col-sub { width: 18%; }
.spk-table col.col-num-spk { width: 7%; }
.spk-table col.col-item-spk { width: 48%; }
.spk-table col.col-type-spk { width: 30%; }
.spk-table col.col-qty-spk { width: 15%; }

.spk-table th.col-right,
.spk-table td.col-right {
    text-align: right;
    white-space: nowrap;
    padding-left: 4px;
    padding-right: 2px;
    font-variant-numeric: tabular-nums;
}

.trx-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 2.5mm;
    padding: 1.6mm 2.2mm;
    background: #0f1520;
    color: #f3efe6;
    border: 1.5px solid #9a7d4f;
    font-size: 11px;
    font-weight: 800;
    flex-shrink: 0;
}
.trx-total-row span { color: #dbbf8f; letter-spacing: .08em; text-transform: uppercase; font-size: 8px; }
.trx-total-row strong { color: #fffdf8; font-size: 12px; }

.spk-signs {
    margin-top: 4mm;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    text-align: center;
    font-size: 8px;
    font-weight: 700;
    color: #0a0a0a;
    flex-shrink: 0;
    padding-top: 2mm;
}
.spk-sign-line {
    height: 9mm;
    border-bottom: 1.5px solid #1a1a1a;
    margin: 2mm 3mm 0;
}
.spk-sign-name {
    margin: 1.5mm 0 0;
    font-size: 7.5px;
    font-weight: 700;
    color: #2c2418;
}

@media print {
    @page {
        size: A4 portrait;
        margin: 0;
    }
    body { background: #fff !important; }
    .no-print { display: none !important; }
    .spk-sheet {
        margin: 0;
        box-shadow: none;
        width: 210mm;
        height: 297mm;
        background: #fffdf8 !important;
    }
    .spk-placeholder {
        border-color: transparent !important;
        background: transparent !important;
        color: transparent !important;
    }
    .spk-cut span { color: #6b5228; }
}
`;export{a as n,o as t};