import { c as e$1 } from './p-f4d641a6.js';

const e=async(e,t,n,s,i)=>{if(e)return e.attachViewToDom(t,n,i,s);if("string"!=typeof n&&!(n instanceof HTMLElement))throw new Error("framework delegate is missing");const o="string"==typeof n?t.ownerDocument&&t.ownerDocument.createElement(n):n;return s&&s.forEach((r=>o.classList.add(r))),i&&Object.assign(o,i),t.appendChild(o),await new Promise((e=>e$1(o,e))),o},t=(r,e)=>{if(e){if(r)return r.removeViewFromDom(e.parentElement,e);e.remove();}return Promise.resolve()};

export { e as a, t as d };
//# sourceMappingURL=p-8a0d5290.js.map
