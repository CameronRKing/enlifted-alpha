import { j as d } from './p-f4d641a6.js';
import { createGesture as s } from './p-a013b234.js';
import './p-0d9cab2d.js';

const r=(r,e,s$1,a,n)=>{const p=r.ownerDocument.defaultView;return s({el:r,gestureName:"goback-swipe",gesturePriority:40,threshold:10,canStart:t=>t.startX<=50&&e(),onStart:s$1,onMove:t=>{a(t.deltaX/p.innerWidth);},onEnd:o=>{const r=p.innerWidth,e=o.deltaX/r,s=o.velocityX,a=s>=0&&(s>.2||o.deltaX>r/2),c=(a?1-e:e)*r;let i=0;if(c>5){const t=c/Math.abs(s);i=Math.min(t,540);}n(a,e<=0?.01:d(0,e,.9999),i);}})};

export { r as createSwipeBackGesture };
//# sourceMappingURL=p-e5f17738.js.map
