import m from '../../_snowpack/pkg/mithril.js';
import EntryDetail from '../views/EntryDetail.m.js';
import Home from '../views/Home.m.js';

export default {
    '/': Home,
    '/entries/:id': EntryDetail
};