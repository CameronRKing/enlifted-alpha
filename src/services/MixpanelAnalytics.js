import mixpanel from '../../_snowpack/pkg/mixpanel-browser.js';
// this is the dev token
// this one can be public, I believe
mixpanel.init('6b7b7f10da78d37779b2e3797222bf30');
class MixpanelAnalytics {
    emit(eventName, payload) {
        // for QA purposes--faster than checking the mixpanel dashboard
        // console.log('emitting', eventName, payload);
        return mixpanel.track(eventName, payload);
    }
    setSuperProps(props) {
        return mixpanel.register(props);
    }
    alias(uid) {
        return mixpanel.alias(uid);
    }
    identifyUser(uid) {
        return mixpanel.identify(uid);
    }
    setUserProps(props) {
        return mixpanel.people.set(props);
    }
    // can be of form 'string' (key to increment} or { [key]: amountToIncrement }
    incrementUserProp(props) {
        return mixpanel.people.increment(props);
    }
}
export default new MixpanelAnalytics();
//# sourceMappingURL=MixpanelAnalytics.js.map