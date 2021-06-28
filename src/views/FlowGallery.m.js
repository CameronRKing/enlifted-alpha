import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Pill from '../atoms/Pill.m.js';

const FlowGallery = {
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        this.ctx.bgColor('white');
        this.ctx.bottomNavBgColor('white');
        this.imgs = ['https://s3-alpha-sig.figma.com/img/0b19/db97/87f8ec9dc75069b1fce6b2be3c1107fb?Expires=1624838400&Signature=Db7MMgOqdEhSAb36529L5lXPu~Zc22aIbHFQlYPtmuL2TTZeyTqQUVy0bHfjT06S86AAVqSAQSxjCuPD0PqRpFo7osPafJ6xlUrIV9DFMacYXajn3Frv6A7cxp-sGbPHklEQ3rg9FH3AssZSNxMhbtVo8OzEtNU0GJKcZ4BZPFaf8LOKQmPyiFTuF1qh5Yg00G3DntdrokCFipqPCZhZ2FEnv2ZWIL-rR0HEA3Z0E3JT4hDZyJ-eh~rfosv2SP9~Fg92RzM4~RG00uCWg6R79cGdheE4Bmadh0n4lvaf2~-hQVRxagT0Mlf4sJu5xIQaBhwwNrY7yurxy7PzrAZ0BA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA', 'https://s3-alpha-sig.figma.com/img/33a2/bbab/3b0d066239a138e0425e3d057e48a172?Expires=1624838400&Signature=YYyiyAL~GyPOol8DNaxTqfalm4ILBPa1NaYupUEwe7a55TWNNAcjCvyo~jHcd3wB4GfLXjcHgioMk~lDnVD3mbBegqHrP3dUsHooaOGz69JBFRdOQxZDlKzkjDFL9qRzkESa254i7TBeGB0egV7NKcsrLxIxbD1Opy8FFl6yGycfI8GvblWJp9KbksUOfeMlyZXSkvDAJU8T-J1Os0aG7qN9LA6trzGTSyCj7E1uxpsj95A-ah4RkDSgsIp5xW74SviFRP-BdgEMZu6sN2FlwgEuf0OuZzhjhrxdDkJtPw-~dZA2z7QTNohFhQj8fTGAYP6KJm12ClyZZ5yJYWVgqA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA'];
    },
    imgStyle(idx) {
        return {
            width: '270px',
            background: `linear-gradient(0deg, rgba(58, 59, 61, 0.76), rgba(58, 59, 61, 0.76)), url(${this.imgs[idx]})`
        };
    },
    view: function FlowGallery(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div", {}, [m("div", {
            "class": "pa wf wf t0 l0 df jc ais tc-black",
            "style": "height: calc(100% - 94px); z-index: 1; background: linear-gradient(0.09deg, #F7F7F7 9.22%, rgba(196, 196, 196, 0) 99.9%);"
        }, [m("div", {
            "style": "margin-top: 264px;"
        }, [`Coming soon!`])]), m("div", {
            "class": "title body-font bold tc-black"
        }, [`Flow Gallery`]), m("div", {
            "class": "sm-body tc-gray-forty mt1"
        }, [`Featured`]), m("div", {
            "class": "bsh4 br2"
        }, [m("div", {
            "class": "h45 bg-secondary-medium",
            "style": "border-radius: 8px 8px 0 0;"
        }, [m(Pill, {
            ctx: this.ctx,
            "style": "dib m4 tc-black bg-semi-transparent brw0"
        }, [`Essentials`])]), m("div", {
            "class": "h27 bg-gray-ninety p4",
            "style": "border-radius: 0 0 8px 8px;"
        }, [m("div", {
            "class": "lg-body bold tc-white"
        }, [`Enlifted Essentials`]), m("div", {
            "class": "sm-body tc-white"
        }, [`by Enlifted Team`]), m("div", {
            "class": "mt2 df js"
        }, [m("div", {
            "class": "mr2 w3 h3 bg-white br2"
        }), m("div", {
            "class": "mr2 w3 h3 bg-white br2"
        }), m("div", {
            "class": "mr2 w3 h3 bg-white br2"
        }), m("div", {
            "class": "mr2 w3 h3 bg-white br2"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        })])])]), m("div", {
            "class": "mt7 mb1 sm-body bold tc-black"
        }, [`Essentials`]), m("div", {
            "class": "pr h27"
        }, [m("div", {
            "style": "width: calc(100% - 20px);",
            "class": "pf pr3 pb1 nowrap ovxa noscrollbar"
        }, [m("div", {
            "class": "dib br2 bsh4 p4 mr2",
            "style": this.imgStyle.bind(this)(0)
        }, [m("div", {
            "class": "lg-body bold tc-white"
        }, [`Should Detox`]), m("div", {
            "class": "sm-body tc-white"
        }, [`by Enlifted Team`]), m("div", {
            "class": "mt2 df js"
        }, [m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        })])]), m("div", {
            "class": "dib br2 bsh4 p4 mr2",
            "style": this.imgStyle.bind(this)(1)
        }, [m("div", {
            "class": "lg-body bold tc-white"
        }, [`Negations`]), m("div", {
            "class": "sm-body tc-white"
        }, [`by Enlifted Team`]), m("div", {
            "class": "mt2 df js"
        }, [m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        }), m("div", {
            "class": "mr2 w3 h3 br2 brss brw2 br-white"
        })])])])])]);
    }
};

export default FlowGallery;

export const states = {
    base: { view: function (vnode) { return m(FlowGallery); } }
};

export const tests = (o, mq) => {
    o.spec('FlowGallery', () => {
        o('Does stuff', () => {
            o(true).equals(false, 'Message displays on assertion failure');
        });
    });
};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(FlowGallery, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === FlowGallery).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}