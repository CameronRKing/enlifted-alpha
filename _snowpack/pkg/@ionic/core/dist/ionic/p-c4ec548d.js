import { a as n, c as e, b as r$1, p as m, r as i } from './p-f4d641a6.js';

const r=new WeakMap,a=(o,t,n,i=0)=>{r.has(o)!==n&&(n?s(o,t,i):u(o,t));},c=o=>o===o.getRootNode().activeElement,s=(o,t,n)=>{const i=t.parentNode,e=t.cloneNode(!1);e.classList.add("cloned-input"),e.tabIndex=-1,i.appendChild(e),r.set(o,e);const a="rtl"===o.ownerDocument.dir?9999:-9999;o.style.pointerEvents="none",t.style.transform=`translate3d(${a}px,${n}px,0) scale(0)`;},u=(o,t)=>{const n=r.get(o);n&&(r.delete(o),n.remove()),o.style.pointerEvents="",t.style.transform="";},d="input, textarea, [no-blur], [contenteditable]",l=async(o,t,i$1,e,r)=>{if(!i$1&&!e)return;const c=((o,t,n)=>((o,t,n,i)=>{const e=o.top,r=o.bottom,a=t.top,c=a+15,s=.75*Math.min(t.bottom,i-n)-r,u=c-e,d=Math.round(s<0?-s:u>0?-u:0),l=Math.min(d,e-a),f=Math.abs(l);return {scrollAmount:l,scrollDuration:Math.min(400,Math.max(150,f/.3)),scrollPadding:n,inputSafeY:4-(e-c)}})((o.closest("ion-item,[ion-item]")||o).getBoundingClientRect(),t.getBoundingClientRect(),n,o.ownerDocument.defaultView.innerHeight))(o,i$1||e,r);if(i$1&&Math.abs(c.scrollAmount)<4)t.focus();else if(a(o,t,!0,c.inputSafeY),t.focus(),i((()=>o.click())),"undefined"!=typeof window){let n;const e=async()=>{void 0!==n&&clearTimeout(n),window.removeEventListener("ionKeyboardDidShow",r),window.removeEventListener("ionKeyboardDidShow",e),i$1&&await i$1.scrollByPoint(0,c.scrollAmount,c.scrollDuration),a(o,t,!1,c.inputSafeY),t.focus();},r=()=>{window.removeEventListener("ionKeyboardDidShow",r),window.addEventListener("ionKeyboardDidShow",e);};if(i$1){const o=await i$1.getScrollElement();if(c.scrollAmount>o.scrollHeight-o.clientHeight-o.scrollTop)return "password"===t.type?(c.scrollAmount+=50,window.addEventListener("ionKeyboardDidShow",r)):window.addEventListener("ionKeyboardDidShow",e),void(n=setTimeout(e,1e3))}e();}},f=(o,t)=>{if("INPUT"!==o.tagName)return;if(o.parentElement&&"ION-INPUT"===o.parentElement.tagName)return;if(o.parentElement&&o.parentElement.parentElement&&"ION-SEARCHBAR"===o.parentElement.parentElement.tagName)return;const n=o.closest("ion-content");if(null===n)return;const i=n.$ionPaddingTimer;i&&clearTimeout(i),t>0?n.style.setProperty("--keyboard-offset",`${t}px`):n.$ionPaddingTimer=setTimeout((()=>{n.style.setProperty("--keyboard-offset","0px");}),120);},w=n$1=>{const r=document,s=n$1.getNumber("keyboardHeight",290),u=n$1.getBoolean("scrollAssist",!0),w=n$1.getBoolean("hideCaretOnScroll",!0),p=n$1.getBoolean("inputBlurring",!0),h=n$1.getBoolean("scrollPadding",!0),S=Array.from(r.querySelectorAll("ion-input, ion-textarea")),m$1=new WeakMap,y=new WeakMap,b=async n$1=>{await new Promise((o=>e(n$1,o)));const r=n$1.shadowRoot||n$1,d=r.querySelector("input")||r.querySelector("textarea"),f=n$1.closest("ion-content"),p=f?null:n$1.closest("ion-footer");if(d){if(f&&w&&!m$1.has(n$1)){const i=((n$1,i,e)=>{if(!e||!i)return ()=>{};const r=o=>{c(i)&&a(n$1,i,o);},s=()=>a(n$1,i,!1),u=()=>r(!0),d=()=>r(!1);return n(e,"ionScrollStart",u),n(e,"ionScrollEnd",d),i.addEventListener("blur",s),()=>{r$1(e,"ionScrollStart",u),r$1(e,"ionScrollEnd",d),i.addEventListener("ionBlur",s);}})(n$1,d,f);m$1.set(n$1,i);}if((f||p)&&u&&!y.has(n$1)){const o=((o,t,n,e,r)=>{let a;const s=o=>{a=m(o);},u=s=>{if(!a)return;const u=m(s);((o,t,n)=>{if(t&&n){const i=t.x-n.x,e=t.y-n.y;return i*i+e*e>o*o}return !1})(6,a,u)||c(t)||(s.stopPropagation(),l(o,t,n,e,r));};return o.addEventListener("touchstart",s,!0),o.addEventListener("touchend",u,!0),()=>{o.removeEventListener("touchstart",s,!0),o.removeEventListener("touchend",u,!0);}})(n$1,d,f,p,s);y.set(n$1,o);}}};p&&(()=>{let t=!0,n$1=!1;const i=document;n(i,"ionScrollStart",(()=>{n$1=!0;})),i.addEventListener("focusin",(()=>{t=!0;}),!0),i.addEventListener("touchend",(o=>{if(n$1)return void(n$1=!1);const e=i.activeElement;if(!e)return;if(e.matches(d))return;const r=o.target;r!==e&&(r.matches(d)||r.closest(d)||(t=!1,setTimeout((()=>{t||e.blur();}),50)));}),!1);})(),h&&(o=>{const t=document;t.addEventListener("focusin",(t=>{f(t.target,o);})),t.addEventListener("focusout",(o=>{f(o.target,0);}));})(s);for(const o of S)b(o);r.addEventListener("ionInputDidLoad",(o=>{b(o.detail);})),r.addEventListener("ionInputDidUnload",(o=>{(o=>{if(w){const t=m$1.get(o);t&&t(),m$1.delete(o);}if(u){const t=y.get(o);t&&t(),y.delete(o);}})(o.detail);}));};

export { w as startInputShims };
//# sourceMappingURL=p-c4ec548d.js.map
