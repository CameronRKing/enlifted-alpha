import { r as je, e as ee, h as R, H as L, i as Z } from './p-3df3e749.js';
import { b as g } from './p-125156f2.js';

const h=class{constructor(s){je(this,s),this.ionImgWillLoad=ee(this,"ionImgWillLoad",7),this.ionImgDidLoad=ee(this,"ionImgDidLoad",7),this.ionError=ee(this,"ionError",7),this.onLoad=()=>{this.ionImgDidLoad.emit();},this.onError=()=>{this.ionError.emit();};}srcChanged(){this.addIO();}componentDidLoad(){this.addIO();}addIO(){void 0!==this.src&&("undefined"!=typeof window&&"IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"isIntersecting"in window.IntersectionObserverEntry.prototype?(this.removeIO(),this.io=new IntersectionObserver((i=>{i[0].isIntersecting&&(this.load(),this.removeIO());})),this.io.observe(this.el)):setTimeout((()=>this.load()),200));}load(){this.loadError=this.onError,this.loadSrc=this.src,this.ionImgWillLoad.emit();}removeIO(){this.io&&(this.io.disconnect(),this.io=void 0);}render(){return R(L,{class:g(this)},R("img",{decoding:"async",src:this.loadSrc,alt:this.alt,onLoad:this.onLoad,onError:this.loadError,part:"image"}))}get el(){return Z(this)}static get watchers(){return {src:["srcChanged"]}}};h.style=":host{display:block;-o-object-fit:contain;object-fit:contain}img{display:block;width:100%;height:100%;-o-object-fit:inherit;object-fit:inherit;-o-object-position:inherit;object-position:inherit}";

export { h as ion_img };
//# sourceMappingURL=p-2d5aae94.entry.js.map
