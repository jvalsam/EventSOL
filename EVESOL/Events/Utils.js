var EVENTSOL;
(function (EVENTSOL) {
    EVENTSOL.totalDefinedEvts = 0;
    (function (EnvironmentEvtStatus) {
        EnvironmentEvtStatus[EnvironmentEvtStatus["EVT_ACTIVE"] = 0] = "EVT_ACTIVE";
        EnvironmentEvtStatus[EnvironmentEvtStatus["EVT_JNOACTIVE"] = 1] = "EVT_JNOACTIVE";
        EnvironmentEvtStatus[EnvironmentEvtStatus["EVT_NOACTIVE"] = 2] = "EVT_NOACTIVE";
    })(EVENTSOL.EnvironmentEvtStatus || (EVENTSOL.EnvironmentEvtStatus = {}));
    var EnvironmentEvtStatus = EVENTSOL.EnvironmentEvtStatus;
    var Time = (function () {
        function Time() {
            this._value = 0;
        }
        Object.defineProperty(Time.prototype, "value", {
            get: function () { return this._value; },
            set: function (value) { this._value = value; },
            enumerable: true,
            configurable: true
        });
        Time.now = function () {
            if (!Date.now) {
                Date.now = function now() {
                    return new Date().getTime();
                };
            }
            return Date.now();
        };
        return Time;
    }());
    EVENTSOL.Time = Time;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=Utils.js.map