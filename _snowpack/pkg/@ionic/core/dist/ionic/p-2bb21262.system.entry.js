var __awaiter=undefined&&undefined.__awaiter||function(i,n,t,e){function r(i){return i instanceof t?i:new t((function(n){n(i);}))}return new(t||(t=Promise))((function(t,o){function s(i){try{a(e.next(i));}catch(n){o(n);}}function l(i){try{a(e["throw"](i));}catch(n){o(n);}}function a(i){i.done?t(i.value):r(i.value).then(s,l);}a((e=e.apply(i,n||[])).next());}))};var __generator=undefined&&undefined.__generator||function(i,n){var t={label:0,sent:function(){if(o[0]&1)throw o[1];return o[1]},trys:[],ops:[]},e,r,o,s;return s={next:l(0),throw:l(1),return:l(2)},typeof Symbol==="function"&&(s[Symbol.iterator]=function(){return this}),s;function l(i){return function(n){return a([i,n])}}function a(s){if(e)throw new TypeError("Generator is already executing.");while(t)try{if(e=1,r&&(o=s[0]&2?r["return"]:s[0]?r["throw"]||((o=r["return"])&&o.call(r),0):r.next)&&!(o=o.call(r,s[1])).done)return o;if(r=0,o)s=[s[0]&2,o.value];switch(s[0]){case 0:case 1:o=s;break;case 4:t.label++;return {value:s[1],done:false};case 5:t.label++;r=s[1];s=[0];continue;case 7:s=t.ops.pop();t.trys.pop();continue;default:if(!(o=t.trys,o=o.length>0&&o[o.length-1])&&(s[0]===6||s[0]===2)){t=0;continue}if(s[0]===3&&(!o||s[1]>o[0]&&s[1]<o[3])){t.label=s[1];break}if(s[0]===6&&t.label<o[1]){t.label=o[1];o=s;break}if(o&&t.label<o[2]){t.label=o[2];t.ops.push(s);break}if(o[2])t.ops.pop();t.trys.pop();continue}s=n.call(i,t);}catch(l){s=[6,l];r=0;}finally{e=o=0;}if(s[0]&5)throw s[1];return {value:s[0]?s[1]:void 0,done:true}}};System.register(["./p-4a14b061.system.js","./p-43078e70.system.js","./p-1c52a3ad.system.js"],(function(i){var n,t,e,r,o,s,l,a,c,f;return {setters:[function(i){n=i.r;t=i.e;e=i.c;r=i.f;o=i.h;s=i.i;l=i.H;},function(i){a=i.b;c=i.c;},function(i){f=i.s;}],execute:function(){var d="ion-infinite-scroll{display:none;width:100%}.infinite-scroll-enabled{display:block}";var u=i("ion_infinite_scroll",function(){function i(i){var e=this;n(this,i);this.ionInfinite=t(this,"ionInfinite",7);this.thrPx=0;this.thrPc=0;this.didFire=false;this.isBusy=false;this.isLoading=false;this.threshold="15%";this.disabled=false;this.position="bottom";this.onScroll=function(){var i=e.scrollEl;if(!i||!e.canStart()){return 1}var n=e.el.offsetHeight;if(n===0){return 2}var t=i.scrollTop;var r=i.scrollHeight;var o=i.offsetHeight;var s=e.thrPc!==0?o*e.thrPc:e.thrPx;var l=e.position==="bottom"?r-n-t-s-o:t-n-s;if(l<0){if(!e.didFire){e.isLoading=true;e.didFire=true;e.ionInfinite.emit();return 3}}else {e.didFire=false;}return 4};}i.prototype.thresholdChanged=function(){var i=this.threshold;if(i.lastIndexOf("%")>-1){this.thrPx=0;this.thrPc=parseFloat(i)/100;}else {this.thrPx=parseFloat(i);this.thrPc=0;}};i.prototype.disabledChanged=function(){var i=this.disabled;if(i){this.isLoading=false;this.isBusy=false;}this.enableScrollEvents(!i);};i.prototype.connectedCallback=function(){return __awaiter(this,void 0,void 0,(function(){var i,n;var t=this;return __generator(this,(function(r){switch(r.label){case 0:i=this.el.closest("ion-content");if(!i){console.error("<ion-infinite-scroll> must be used inside an <ion-content>");return [2]}n=this;return [4,i.getScrollElement()];case 1:n.scrollEl=r.sent();this.thresholdChanged();this.disabledChanged();if(this.position==="top"){e((function(){if(t.scrollEl){t.scrollEl.scrollTop=t.scrollEl.scrollHeight-t.scrollEl.clientHeight;}}));}return [2]}}))}))};i.prototype.disconnectedCallback=function(){this.enableScrollEvents(false);this.scrollEl=undefined;};i.prototype.complete=function(){return __awaiter(this,void 0,void 0,(function(){var i,n;var t=this;return __generator(this,(function(o){i=this.scrollEl;if(!this.isLoading||!i){return [2]}this.isLoading=false;if(this.position==="top"){this.isBusy=true;n=i.scrollHeight-i.scrollTop;requestAnimationFrame((function(){r((function(){var r=i.scrollHeight;var o=r-n;requestAnimationFrame((function(){e((function(){i.scrollTop=o;t.isBusy=false;}));}));}));}));}return [2]}))}))};i.prototype.canStart=function(){return !this.disabled&&!this.isBusy&&!!this.scrollEl&&!this.isLoading};i.prototype.enableScrollEvents=function(i){if(this.scrollEl){if(i){this.scrollEl.addEventListener("scroll",this.onScroll);}else {this.scrollEl.removeEventListener("scroll",this.onScroll);}}};i.prototype.render=function(){var i;var n=a(this);var t=this.disabled;return o(l,{class:(i={},i[n]=true,i["infinite-scroll-loading"]=this.isLoading,i["infinite-scroll-enabled"]=!t,i)})};Object.defineProperty(i.prototype,"el",{get:function(){return s(this)},enumerable:false,configurable:true});Object.defineProperty(i,"watchers",{get:function(){return {threshold:["thresholdChanged"],disabled:["disabledChanged"]}},enumerable:false,configurable:true});return i}());u.style=d;var p="ion-infinite-scroll-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;min-height:84px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-loading{margin-left:0;margin-right:0;margin-top:0;margin-bottom:32px;display:none;width:100%}.infinite-loading-text{margin-left:32px;margin-right:32px;margin-top:4px;margin-bottom:0}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.infinite-loading-text{margin-left:unset;margin-right:unset;-webkit-margin-start:32px;margin-inline-start:32px;-webkit-margin-end:32px;margin-inline-end:32px}}.infinite-scroll-loading ion-infinite-scroll-content>.infinite-loading{display:block}.infinite-scroll-content-ios .infinite-loading-text{color:var(--ion-color-step-600, #666666)}.infinite-scroll-content-ios .infinite-loading-spinner .spinner-lines-ios line,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-lines-small-ios line,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-crescent circle{stroke:var(--ion-color-step-600, #666666)}.infinite-scroll-content-ios .infinite-loading-spinner .spinner-bubbles circle,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-circles circle,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-dots circle{fill:var(--ion-color-step-600, #666666)}";var h="ion-infinite-scroll-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;min-height:84px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-loading{margin-left:0;margin-right:0;margin-top:0;margin-bottom:32px;display:none;width:100%}.infinite-loading-text{margin-left:32px;margin-right:32px;margin-top:4px;margin-bottom:0}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.infinite-loading-text{margin-left:unset;margin-right:unset;-webkit-margin-start:32px;margin-inline-start:32px;-webkit-margin-end:32px;margin-inline-end:32px}}.infinite-scroll-loading ion-infinite-scroll-content>.infinite-loading{display:block}.infinite-scroll-content-md .infinite-loading-text{color:var(--ion-color-step-600, #666666)}.infinite-scroll-content-md .infinite-loading-spinner .spinner-lines-md line,.infinite-scroll-content-md .infinite-loading-spinner .spinner-lines-small-md line,.infinite-scroll-content-md .infinite-loading-spinner .spinner-crescent circle{stroke:var(--ion-color-step-600, #666666)}.infinite-scroll-content-md .infinite-loading-spinner .spinner-bubbles circle,.infinite-scroll-content-md .infinite-loading-spinner .spinner-circles circle,.infinite-scroll-content-md .infinite-loading-spinner .spinner-dots circle{fill:var(--ion-color-step-600, #666666)}";var g=i("ion_infinite_scroll_content",function(){function i(i){n(this,i);}i.prototype.componentDidLoad=function(){if(this.loadingSpinner===undefined){var i=a(this);this.loadingSpinner=c.get("infiniteLoadingSpinner",c.get("spinner",i==="ios"?"lines":"crescent"));}};i.prototype.render=function(){var i;var n=a(this);return o(l,{class:(i={},i[n]=true,i["infinite-scroll-content-"+n]=true,i)},o("div",{class:"infinite-loading"},this.loadingSpinner&&o("div",{class:"infinite-loading-spinner"},o("ion-spinner",{name:this.loadingSpinner})),this.loadingText&&o("div",{class:"infinite-loading-text",innerHTML:f(this.loadingText)})))};return i}());g.style={ios:p,md:h};}}}));
//# sourceMappingURL=p-2bb21262.system.entry.js.map
