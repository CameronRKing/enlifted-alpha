const t=()=>{document.addEventListener("backbutton",(()=>{}));},n=()=>{const t=document;let n=!1;t.addEventListener("backbutton",(()=>{if(n)return;let e=0,o=[];const c=new CustomEvent("ionBackButton",{bubbles:!1,detail:{register(t,n){o.push({priority:t,handler:n,id:e++});}}});t.dispatchEvent(c);const i=()=>{if(o.length>0){let t={priority:Number.MIN_SAFE_INTEGER,handler:()=>{},id:-1};o.forEach((n=>{n.priority>=t.priority&&(t=n);})),n=!0,o=o.filter((n=>n.id!==t.id)),(async t=>{try{if(t&&t.handler){const n=t.handler(i);null!=n&&await n;}}catch(n){console.error(n);}})(t).then((()=>n=!1));}};i();}));},e=100,o=99;

export { o as MENU_BACK_BUTTON_PRIORITY, e as OVERLAY_BACK_BUTTON_PRIORITY, t as blockHardwareBackButton, n as startHardwareBackButton };
//# sourceMappingURL=p-94c70170.js.map
