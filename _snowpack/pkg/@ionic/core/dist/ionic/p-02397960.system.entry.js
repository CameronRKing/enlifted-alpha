var __awaiter=undefined&&undefined.__awaiter||function(t,e,r,n){function i(t){return t instanceof r?t:new r((function(e){e(t);}))}return new(r||(r=Promise))((function(r,o){function a(t){try{s(n.next(t));}catch(e){o(e);}}function u(t){try{s(n["throw"](t));}catch(e){o(e);}}function s(t){t.done?r(t.value):i(t.value).then(a,u);}s((n=n.apply(t,e||[])).next());}))};var __generator=undefined&&undefined.__generator||function(t,e){var r={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},n,i,o,a;return a={next:u(0),throw:u(1),return:u(2)},typeof Symbol==="function"&&(a[Symbol.iterator]=function(){return this}),a;function u(t){return function(e){return s([t,e])}}function s(a){if(n)throw new TypeError("Generator is already executing.");while(r)try{if(n=1,i&&(o=a[0]&2?i["return"]:a[0]?i["throw"]||((o=i["return"])&&o.call(i),0):i.next)&&!(o=o.call(i,a[1])).done)return o;if(i=0,o)a=[a[0]&2,o.value];switch(a[0]){case 0:case 1:o=a;break;case 4:r.label++;return {value:a[1],done:false};case 5:r.label++;i=a[1];a=[0];continue;case 7:a=r.ops.pop();r.trys.pop();continue;default:if(!(o=r.trys,o=o.length>0&&o[o.length-1])&&(a[0]===6||a[0]===2)){r=0;continue}if(a[0]===3&&(!o||a[1]>o[0]&&a[1]<o[3])){r.label=a[1];break}if(a[0]===6&&r.label<o[1]){r.label=o[1];o=a;break}if(o&&r.label<o[2]){r.label=o[2];r.ops.push(a);break}if(o[2])r.ops.pop();r.trys.pop();continue}a=e.call(t,r);}catch(u){a=[6,u];i=0;}finally{n=o=0;}if(a[0]&5)throw a[1];return {value:a[0]?a[1]:void 0,done:true}}};var __spreadArray=undefined&&undefined.__spreadArray||function(t,e){for(var r=0,n=e.length,i=t.length;r<n;r++,i++)t[i]=e[r];return t};System.register(["./p-4a14b061.system.js","./p-ff3c9f7a.system.js","./p-43078e70.system.js","./p-af7d7be2.system.js"],(function(t){var e,r,n,i,o,a,u,s,f,c;return {setters:[function(t){e=t.r;r=t.e;n=t.i;i=t.h;o=t.H;},function(t){a=t.c;u=t.n;},function(t){s=t.b;},function(t){f=t.o;c=t.c;}],execute:function(){var h=this;var l=t("ion_route",function(){function t(t){e(this,t);this.ionRouteDataChanged=r(this,"ionRouteDataChanged",7);this.url="";}t.prototype.onUpdate=function(t){this.ionRouteDataChanged.emit(t);};t.prototype.onComponentProps=function(t,e){if(t===e){return}var r=t?Object.keys(t):[];var n=e?Object.keys(e):[];if(r.length!==n.length){this.onUpdate(t);return}for(var i=0,o=r;i<o.length;i++){var a=o[i];if(t[a]!==e[a]){this.onUpdate(t);return}}};t.prototype.connectedCallback=function(){this.ionRouteDataChanged.emit();};Object.defineProperty(t,"watchers",{get:function(){return {url:["onUpdate"],component:["onUpdate"],componentProps:["onComponentProps"]}},enumerable:false,configurable:true});return t}());var v=t("ion_route_redirect",function(){function t(t){e(this,t);this.ionRouteRedirectChanged=r(this,"ionRouteRedirectChanged",7);}t.prototype.propDidChange=function(){this.ionRouteRedirectChanged.emit();};t.prototype.connectedCallback=function(){this.ionRouteRedirectChanged.emit();};Object.defineProperty(t,"watchers",{get:function(){return {from:["propDidChange"],to:["propDidChange"]}},enumerable:false,configurable:true});return t}());var d="root";var p="forward";var g="back";var b=function(t){var e=t.filter((function(t){return t.length>0})).join("/");return "/"+e};var m=function(t,e,r){var n=b(t);if(e){n="#"+n;}if(r!==undefined){n+="?"+r;}return n};var y=function(t,e,r,n,i,o,a){var u=m(__spreadArray(__spreadArray([],C(e).segments),n),r,a);if(i===p){t.pushState(o,"",u);}else {t.replaceState(o,"",u);}};var w=function(t){var e=[];for(var r=0,n=t;r<n.length;r++){var i=n[r];for(var o=0,a=i.path;o<a.length;o++){var u=a[o];if(u[0]===":"){var s=i.params&&i.params[u.slice(1)];if(!s){return null}e.push(s);}else if(u!==""){e.push(u);}}}return e};var _=function(t,e){if(t.length>e.length){return null}if(t.length<=1&&t[0]===""){return e}for(var r=0;r<t.length;r++){if(t[r]!==e[r]){return null}}if(e.length===t.length){return [""]}return e.slice(t.length)};var R=function(t,e,r){var n=C(e).segments;var i=r?t.hash.slice(1):t.pathname;var o=C(i).segments;return _(n,o)};var C=function(t){var e=[""];var r;if(t!=null){var n=t.indexOf("?");if(n>-1){r=t.substr(n+1);t=t.substr(0,n);}e=t.split("/").map((function(t){return t.trim()})).filter((function(t){return t.length>0}));if(e.length===0){e=[""];}}return {segments:e,queryString:r}};var P=function(t){console.group("[ion-core] ROUTES["+t.length+"]");var e=function(t){var e=[];t.forEach((function(t){return e.push.apply(e,t.path)}));var r=t.map((function(t){return t.id}));console.debug("%c "+b(e),"font-weight: bold; padding-left: 20px","=>\t","("+r.join(", ")+")");};for(var r=0,n=t;r<n.length;r++){var i=n[r];e(i);}console.groupEnd();};var S=function(t){console.group("[ion-core] REDIRECTS["+t.length+"]");for(var e=0,r=t;e<r.length;e++){var n=r[e];if(n.to){console.debug("FROM: ","$c "+b(n.from),"font-weight: bold"," TO: ","$c "+b(n.to.segments),"font-weight: bold");}}console.groupEnd();};var k=function(t,e,r,n,i,o){if(i===void 0){i=false;}return __awaiter(h,void 0,void 0,(function(){var u,s,f,c;return __generator(this,(function(h){switch(h.label){case 0:h.trys.push([0,6,,7]);u=L(t);if(n>=e.length||!u){return [2,i]}return [4,new Promise((function(t){return a(u,t)}))];case 1:h.sent();s=e[n];return [4,u.setRouteId(s.id,s.params,r,o)];case 2:f=h.sent();if(f.changed){r=d;i=true;}return [4,k(f.element,e,r,n+1,i,o)];case 3:i=h.sent();if(!f.markVisible)return [3,5];return [4,f.markVisible()];case 4:h.sent();h.label=5;case 5:return [2,i];case 6:c=h.sent();console.error(c);return [2,false];case 7:return [2]}}))}))};var E=function(t){return __awaiter(h,void 0,void 0,(function(){var e,r,n,i;return __generator(this,(function(o){switch(o.label){case 0:e=[];n=t;o.label=1;case 1:r=L(n);if(!r)return [3,3];return [4,r.getRouteId()];case 2:i=o.sent();if(i){n=i.element;i.element=undefined;e.push(i);}else {return [3,5]}return [3,4];case 3:return [3,5];case 4:return [3,1];case 5:return [2,{ids:e,outlet:r}]}}))}))};var j=function(){if(L(document.body)){return Promise.resolve()}return new Promise((function(t){window.addEventListener("ionNavWillLoad",t,{once:true});}))};var D=":not([no-router]) ion-nav, :not([no-router]) ion-tabs, :not([no-router]) ion-router-outlet";var L=function(t){if(!t){return undefined}if(t.matches(D)){return t}var e=t.querySelector(D);return e!==null&&e!==void 0?e:undefined};var x=function(t,e){var r=e.from,n=e.to;if(n===undefined){return false}if(r.length>t.length){return false}for(var i=0;i<r.length;i++){var o=r[i];if(o==="*"){return true}if(o!==t[i]){return false}}return r.length===t.length};var N=function(t,e){return e.find((function(e){return x(t,e)}))};var O=function(t,e){var r=Math.min(t.length,e.length);var n=0;for(;n<r;n++){if(t[n].toLowerCase()!==e[n].id){break}}return n};var U=function(t,e){var r=new G(t);var n=false;var i;for(var o=0;o<e.length;o++){var a=e[o].path;if(a[0]===""){n=true;}else {for(var u=0,s=a;u<s.length;u++){var f=s[u];var c=r.next();if(f[0]===":"){if(c===""){return null}i=i||[];var h=i[o]||(i[o]={});h[f.slice(1)]=c;}else if(c!==f){return null}}n=false;}}var l=n?n===(r.next()===""):true;if(!l){return null}if(i){return e.map((function(t,e){return {id:t.id,path:t.path,params:A(t.params,i[e]),beforeEnter:t.beforeEnter,beforeLeave:t.beforeLeave}}))}return e};var A=function(t,e){return t||e?Object.assign(Object.assign({},t),e):undefined};var W=function(t,e){var r=null;var n=0;var i=t.map((function(t){return t.id}));for(var o=0,a=e;o<a.length;o++){var u=a[o];var s=O(i,u);if(s>n){r=u;n=s;}}if(r){return r.map((function(e,r){return {id:e.id,path:e.path,params:A(e.params,t[r]&&t[r].params)}}))}return null};var T=function(t,e){var r=null;var n=0;for(var i=0,o=e;i<o.length;i++){var a=o[i];var u=U(t,a);if(u!==null){var s=q(u);if(s>n){n=s;r=u;}}}return r};var q=function(t){var e=1;var r=1;for(var n=0,i=t;n<i.length;n++){var o=i[n];for(var a=0,u=o.path;a<u.length;a++){var s=u[a];if(s[0]===":"){e+=Math.pow(1,r);}else if(s!==""){e+=Math.pow(2,r);}r++;}}return e};var G=function(){function t(t){this.path=t.slice();}t.prototype.next=function(){if(this.path.length>0){return this.path.shift()}return ""};return t}();var I=function(t,e){if(e in t){return t[e]}if(t.hasAttribute(e)){return t.getAttribute(e)}return null};var H=function(t){return Array.from(t.children).filter((function(t){return t.tagName==="ION-ROUTE-REDIRECT"})).map((function(t){var e=I(t,"to");return {from:C(I(t,"from")).segments,to:e==null?undefined:C(e)}}))};var M=function(t){return F(B(t))};var B=function(t){return Array.from(t.children).filter((function(t){return t.tagName==="ION-ROUTE"&&t.component})).map((function(t){var e=I(t,"component");return {path:C(I(t,"url")).segments,id:e.toLowerCase(),params:t.componentProps,beforeLeave:t.beforeLeave,beforeEnter:t.beforeEnter,children:B(t)}}))};var F=function(t){var e=[];for(var r=0,n=t;r<n.length;r++){var i=n[r];V([],e,i);}return e};var V=function(t,e,r){t=t.slice();t.push({id:r.id,path:r.path,params:r.params,beforeLeave:r.beforeLeave,beforeEnter:r.beforeEnter});if(r.children.length===0){e.push(t);return}for(var n=0,i=r.children;n<i.length;n++){var o=i[n];V(t,e,o);}};var $=t("ion_router",function(){function t(t){e(this,t);this.ionRouteWillChange=r(this,"ionRouteWillChange",7);this.ionRouteDidChange=r(this,"ionRouteDidChange",7);this.previousPath=null;this.busy=false;this.state=0;this.lastState=0;this.root="/";this.useHash=true;}t.prototype.componentWillLoad=function(){return __awaiter(this,void 0,void 0,(function(){var t,e,r;return __generator(this,(function(n){switch(n.label){case 0:return [4,j()];case 1:n.sent();return [4,this.runGuards(this.getPath())];case 2:t=n.sent();if(!(t!==true))return [3,5];if(!(typeof t==="object"))return [3,4];e=t.redirect;r=C(e);this.setPath(r.segments,d,r.queryString);return [4,this.writeNavStateRoot(r.segments,d)];case 3:n.sent();n.label=4;case 4:return [3,7];case 5:return [4,this.onRoutesChanged()];case 6:n.sent();n.label=7;case 7:return [2]}}))}))};t.prototype.componentDidLoad=function(){window.addEventListener("ionRouteRedirectChanged",u(this.onRedirectChanged.bind(this),10));window.addEventListener("ionRouteDataChanged",u(this.onRoutesChanged.bind(this),100));};t.prototype.onPopState=function(){return __awaiter(this,void 0,void 0,(function(){var t,e,r;return __generator(this,(function(n){switch(n.label){case 0:t=this.historyDirection();e=this.getPath();return [4,this.runGuards(e)];case 1:r=n.sent();if(r!==true){if(typeof r==="object"){e=C(r.redirect).segments;}else {return [2,false]}}return [2,this.writeNavStateRoot(e,t)]}}))}))};t.prototype.onBackButton=function(t){var e=this;t.detail.register(0,(function(t){e.back();t();}));};t.prototype.canTransition=function(){return __awaiter(this,void 0,void 0,(function(){var t;return __generator(this,(function(e){switch(e.label){case 0:return [4,this.runGuards()];case 1:t=e.sent();if(t!==true){if(typeof t==="object"){return [2,t.redirect]}else {return [2,false]}}return [2,true]}}))}))};t.prototype.push=function(t,e,r){if(e===void 0){e="forward";}return __awaiter(this,void 0,void 0,(function(){var n,i;return __generator(this,(function(o){switch(o.label){case 0:if(t.startsWith(".")){t=new URL(t,window.location.href).pathname;}n=C(t);return [4,this.runGuards(n.segments)];case 1:i=o.sent();if(i!==true){if(typeof i==="object"){n=C(i.redirect);}else {return [2,false]}}this.setPath(n.segments,e,n.queryString);return [2,this.writeNavStateRoot(n.segments,e,r)]}}))}))};t.prototype.back=function(){window.history.back();return Promise.resolve(this.waitPromise)};t.prototype.printDebug=function(){return __awaiter(this,void 0,void 0,(function(){return __generator(this,(function(t){P(M(this.el));S(H(this.el));return [2]}))}))};t.prototype.navChanged=function(t){return __awaiter(this,void 0,void 0,(function(){var e,r,n,i,o,a;return __generator(this,(function(u){switch(u.label){case 0:if(this.busy){console.warn("[ion-router] router is busy, navChanged was cancelled");return [2,false]}return [4,E(window.document.body)];case 1:e=u.sent(),r=e.ids,n=e.outlet;i=M(this.el);o=W(r,i);if(!o){console.warn("[ion-router] no matching URL for ",r.map((function(t){return t.id})));return [2,false]}a=w(o);if(!a){console.warn("[ion-router] router could not match path because some required param is missing");return [2,false]}this.setPath(a,t);return [4,this.safeWriteNavState(n,o,d,a,null,r.length)];case 2:u.sent();return [2,true]}}))}))};t.prototype.onRedirectChanged=function(){var t=this.getPath();if(t&&N(t,H(this.el))){this.writeNavStateRoot(t,d);}};t.prototype.onRoutesChanged=function(){return this.writeNavStateRoot(this.getPath(),d)};t.prototype.historyDirection=function(){var t;var e=window;if(e.history.state===null){this.state++;e.history.replaceState(this.state,e.document.title,(t=e.document.location)===null||t===void 0?void 0:t.href);}var r=e.history.state;var n=this.lastState;this.lastState=r;if(r>n||r>=n&&n>0){return p}if(r<n){return g}return d};t.prototype.writeNavStateRoot=function(t,e,r){return __awaiter(this,void 0,void 0,(function(){var n,i,o,a,u,s,f,c;return __generator(this,(function(h){if(!t){console.error("[ion-router] URL is not part of the routing set");return [2,false]}n=H(this.el);i=N(t,n);o=null;if(i){a=i.to,u=a.segments,s=a.queryString;this.setPath(u,e,s);o=i.from;t=u;}f=M(this.el);c=T(t,f);if(!c){console.error("[ion-router] the path does not match any route");return [2,false]}return [2,this.safeWriteNavState(document.body,c,e,t,o,0,r)]}))}))};t.prototype.safeWriteNavState=function(t,e,r,n,i,o,a){if(o===void 0){o=0;}return __awaiter(this,void 0,void 0,(function(){var u,s,f;return __generator(this,(function(c){switch(c.label){case 0:return [4,this.lock()];case 1:u=c.sent();s=false;c.label=2;case 2:c.trys.push([2,4,,5]);return [4,this.writeNavState(t,e,r,n,i,o,a)];case 3:s=c.sent();return [3,5];case 4:f=c.sent();console.error(f);return [3,5];case 5:u();return [2,s]}}))}))};t.prototype.lock=function(){return __awaiter(this,void 0,void 0,(function(){var t,e;return __generator(this,(function(r){switch(r.label){case 0:t=this.waitPromise;this.waitPromise=new Promise((function(t){return e=t}));if(!(t!==undefined))return [3,2];return [4,t];case 1:r.sent();r.label=2;case 2:return [2,e]}}))}))};t.prototype.runGuards=function(t,e){if(t===void 0){t=this.getPath();}return __awaiter(this,void 0,void 0,(function(){var r,n,i,o,a,u,s;return __generator(this,(function(f){switch(f.label){case 0:if(e===undefined){e=C(this.previousPath).segments;}if(!t||!e){return [2,true]}r=M(this.el);n=T(e,r);i=n&&n[n.length-1].beforeLeave;if(!i)return [3,2];return [4,i()];case 1:a=f.sent();return [3,3];case 2:a=true;f.label=3;case 3:o=a;if(o===false||typeof o==="object"){return [2,o]}u=T(t,r);s=u&&u[u.length-1].beforeEnter;return [2,s?s():true]}}))}))};t.prototype.writeNavState=function(t,e,r,n,i,o,a){if(o===void 0){o=0;}return __awaiter(this,void 0,void 0,(function(){var u,s;return __generator(this,(function(f){switch(f.label){case 0:if(this.busy){console.warn("[ion-router] router is busy, transition was cancelled");return [2,false]}this.busy=true;u=this.routeChangeEvent(n,i);if(u){this.ionRouteWillChange.emit(u);}return [4,k(t,e,r,o,false,a)];case 1:s=f.sent();this.busy=false;if(u){this.ionRouteDidChange.emit(u);}return [2,s]}}))}))};t.prototype.setPath=function(t,e,r){this.state++;y(window.history,this.root,this.useHash,t,e,this.state,r);};t.prototype.getPath=function(){return R(window.location,this.root,this.useHash)};t.prototype.routeChangeEvent=function(t,e){var r=this.previousPath;var n=b(t);this.previousPath=n;if(n===r){return null}var i=e?b(e):null;return {from:r,redirectedFrom:i,to:n}};Object.defineProperty(t.prototype,"el",{get:function(){return n(this)},enumerable:false,configurable:true});return t}());var z=":host{--background:transparent;--color:var(--ion-color-primary, #3880ff);background:var(--background);color:var(--color)}:host(.ion-color){color:var(--ion-color-base)}a{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit}";var J=t("ion_router_link",function(){function t(t){var r=this;e(this,t);this.routerDirection="forward";this.onClick=function(t){f(r.href,t,r.routerDirection,r.routerAnimation);};}t.prototype.render=function(){var t;var e=s(this);var r={href:this.href,rel:this.rel,target:this.target};return i(o,{onClick:this.onClick,class:c(this.color,(t={},t[e]=true,t["ion-activatable"]=true,t))},i("a",Object.assign({},r),i("slot",null)))};return t}());J.style=z;}}}));
//# sourceMappingURL=p-02397960.system.entry.js.map
