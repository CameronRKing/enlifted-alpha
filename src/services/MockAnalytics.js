class MockAnalytics {
    emit(eventName, payload) { }
    setSuperProps(props) { }
    alias(uid) { }
    identifyUser(uid) { }
    setUserProps(props) { }
    // can be of form 'string' (key to increment} or { [key]: amountToIncrement }
    incrementUserProp(props) { }
}
export default new MockAnalytics();
//# sourceMappingURL=MockAnalytics.js.map