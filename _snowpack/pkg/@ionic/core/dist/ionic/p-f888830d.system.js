System.register(["./p-ce1ea776.system.js","./p-42fd7ecf.system.js","./p-ff3c9f7a.system.js","./p-4a14b061.system.js"],(function(e){var n,t;return {setters:[function(e){n=e.c;},function(e){t=e.g;},function(){},function(){}],execute:function(){var i=e("mdTransitionAnimation",(function(e,i){var a="40px";var r="0px";var o=i.direction==="back";var s=i.enteringEl;var c=i.leavingEl;var f=t(s);var l=f.querySelector("ion-toolbar");var u=n();u.addElement(f).fill("both").beforeRemoveClass("ion-page-invisible");if(o){u.duration(i.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)");}else {u.duration(i.duration||280).easing("cubic-bezier(0.36,0.66,0.04,1)").fromTo("transform","translateY("+a+")","translateY("+r+")").fromTo("opacity",.01,1);}if(l){var m=n();m.addElement(l);u.addAnimation(m);}if(c&&o){u.duration(i.duration||200).easing("cubic-bezier(0.47,0,0.745,0.715)");var d=n();d.addElement(t(c)).onFinish((function(e){if(e===1&&d.elements.length>0){d.elements[0].style.setProperty("display","none");}})).fromTo("transform","translateY("+r+")","translateY("+a+")").fromTo("opacity",1,0);u.addAnimation(d);}return u}));}}}));
//# sourceMappingURL=p-f888830d.system.js.map