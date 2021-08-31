import { c as s } from './p-613c0939.js';
import { g as L } from './p-d3682733.js';
import './p-3df3e749.js';
import './p-f4d641a6.js';

const r=(r,i)=>{const a="back"===i.direction,s$1=i.leavingEl,p=L(i.enteringEl),e=p.querySelector("ion-toolbar"),n=s();if(n.addElement(p).fill("both").beforeRemoveClass("ion-page-invisible"),a?n.duration(i.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)"):n.duration(i.duration||280).easing("cubic-bezier(0.36,0.66,0.04,1)").fromTo("transform","translateY(40px)","translateY(0px)").fromTo("opacity",.01,1),e){const o=s();o.addElement(e),n.addAnimation(o);}if(s$1&&a){n.duration(i.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)");const r=s();r.addElement(L(s$1)).onFinish((t=>{1===t&&r.elements.length>0&&r.elements[0].style.setProperty("display","none");})).fromTo("transform","translateY(0px)","translateY(40px)").fromTo("opacity",1,0),n.addAnimation(r);}return n};

export { r as mdTransitionAnimation };
//# sourceMappingURL=p-0c976852.js.map
