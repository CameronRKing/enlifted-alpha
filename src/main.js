import './boot/firestoreDb.js';
import './boot/init.js';

import m from '../_snowpack/pkg/mithril.js';
import AppShell from './atoms/nav/AppShell.m.js';
import Initial from './views/Initial.m.js';
import { DateTime, Duration } from '../_snowpack/pkg/luxon.js';
window.Dur = Duration;
window.DT = DateTime;
m.mount(document.body, {
    view(vnode) {
        return m(AppShell, { cmp: Initial });
    }
});