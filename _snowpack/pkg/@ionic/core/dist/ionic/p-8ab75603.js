import { c as De } from './p-3df3e749.js';
import { h as o, a as i, b as n } from './p-a96dd2bf.js';
import { createGesture as s } from './p-a013b234.js';
import './p-0d9cab2d.js';

const a=(a,s$1)=>{let d,i$1;const c=(t,o,e)=>{if("undefined"==typeof document)return;const n=document.elementFromPoint(t,o);n&&s$1(n)?n!==d&&(m(),f(n,e)):m();},f=(o,e)=>{d=o,i$1||(i$1=d);const n=d;De((()=>n.classList.add("ion-activated"))),e();},m=(o=!1)=>{if(!d)return;const e=d;De((()=>e.classList.remove("ion-activated"))),o&&i$1!==d&&d.click(),d=void 0;};return s({el:a,gestureName:"buttonActiveDrag",threshold:0,onStart:t=>c(t.currentX,t.currentY,i),onMove:t=>c(t.currentX,t.currentY,n),onEnd:()=>{m(!0),o(),i$1=void 0;}})};

export { a as c };
//# sourceMappingURL=p-8ab75603.js.map
