import { r as je, e as ee, h as R, H as L } from './p-3df3e749.js';
import { b as g } from './p-125156f2.js';
import { G as i } from './p-0d9cab2d.js';

const n=class{constructor(a){je(this,a),this.ionBackdropTap=ee(this,"ionBackdropTap",7),this.blocker=i.createBlocker({disableScroll:!0}),this.visible=!0,this.tappable=!0,this.stopPropagation=!0;}connectedCallback(){this.stopPropagation&&this.blocker.block();}disconnectedCallback(){this.blocker.unblock();}onMouseDown(o){this.emitTap(o);}emitTap(o){this.stopPropagation&&(o.preventDefault(),o.stopPropagation()),this.tappable&&this.ionBackdropTap.emit();}render(){const o=g(this);return R(L,{tabindex:"-1","aria-hidden":"true",class:{[o]:!0,"backdrop-hide":!this.visible,"backdrop-no-tappable":!this.tappable}})}};n.style={ios:":host{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:0.01;-ms-touch-action:none;touch-action:none;z-index:2}:host(.backdrop-hide){background:transparent}:host(.backdrop-no-tappable){cursor:auto}:host{background-color:var(--ion-backdrop-color, #000)}",md:":host{left:0;right:0;top:0;bottom:0;display:block;position:absolute;-webkit-transform:translateZ(0);transform:translateZ(0);contain:strict;cursor:pointer;opacity:0.01;-ms-touch-action:none;touch-action:none;z-index:2}:host(.backdrop-hide){background:transparent}:host(.backdrop-no-tappable){cursor:auto}:host{background-color:var(--ion-backdrop-color, #000)}"};

export { n as ion_backdrop };
//# sourceMappingURL=p-1e489c33.entry.js.map
