const o=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp"],t=()=>{let t=[],c=!0;const e=document,n=o=>{t.forEach((o=>o.classList.remove("ion-focused"))),o.forEach((o=>o.classList.add("ion-focused"))),t=o;},r=()=>{c=!1,n([]);};e.addEventListener("keydown",(t=>{c=o.includes(t.key),c||n([]);})),e.addEventListener("focusin",(o=>{if(c&&o.composedPath){const t=o.composedPath().filter((o=>!!o.classList&&o.classList.contains("ion-focusable")));n(t);}})),e.addEventListener("focusout",(()=>{e.activeElement===e.body&&n([]);})),e.addEventListener("touchstart",r),e.addEventListener("mousedown",r);};

export { t as startFocusVisible };
//# sourceMappingURL=p-379187ad.js.map
