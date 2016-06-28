var EVENTSOL;
(function (EVENTSOL) {
    var EnvironmentEvt = (function () {
        function EnvironmentEvt(name, status, callback, jnaCallback) {
            this._name = name;
            this._status = status;
            this._callbackFunc = callback;
            this._jnaCallbackFunc = jnaCallback;
            this._id = ++EVENTSOL.totalDefinedEvts;
            this._totalExecutions = 0;
            this._totalFireEvt = 0;
            this._lastExecution = new EVENTSOL.Time();
        }
        Object.defineProperty(EnvironmentEvt.prototype, "name", {
            get: function () { return this._name; },
            set: function (name) { this._name = name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "id", {
            get: function () { return this._id; },
            set: function (id) { this._id = id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "status", {
            get: function () { return this._status; },
            set: function (status) { this._status = status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "totalExecutions", {
            get: function () { return this._totalExecutions; },
            set: function (te) { this._totalExecutions = te; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "totalFireEvt", {
            get: function () { return this._totalFireEvt; },
            set: function (te) { this._totalFireEvt = te; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "lastExecution", {
            get: function () { return this._lastExecution; },
            set: function (le) { this._lastExecution = le; },
            enumerable: true,
            configurable: true
        });
        EnvironmentEvt.prototype.execution = function () {
            ++this._totalExecutions;
            ++this._totalFireEvt;
            // TODO: check if this event is refered by referevts
        };
        EnvironmentEvt.prototype.executionOnJNoActive = function () {
            ++this._totalFireEvt;
        };
        return EnvironmentEvt;
    }());
    EVENTSOL.EnvironmentEvt = EnvironmentEvt;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=EnvironmentEvt.js.map