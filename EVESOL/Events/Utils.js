var EVENTSOL;
(function (EVENTSOL) {
    var Time = (function () {
        function Time(timeVal) {
            this._value = timeVal ? timeVal : 0;
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
        Time.DefaultCondTime = new Time(500);
        return Time;
    }());
    EVENTSOL.Time = Time;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=Utils.js.map