import './boot/browserDb.js';
import './boot/init.js';

import m from '../_snowpack/pkg/mithril.js';
import AppShell from './atoms/nav/AppShell.m.js';
import Initial from './views/Initial.m.js';

m.mount(document.body, {
    view(vnode) {
        return m(AppShell, { cmp: Initial });
    }
});