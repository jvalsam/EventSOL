var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EVENTSOL;
(function (EVENTSOL) {
    var CalendarEvt = (function (_super) {
        __extends(CalendarEvt, _super);
        function CalendarEvt(name, status, callbackFunc, time, jnaCallbackFunc) {
            _super.call(this, name, status, callbackFunc, jnaCallbackFunc);
            this._activationTime = time;
        }
        Object.defineProperty(CalendarEvt.prototype, "activationTime", {
            get: function () { return this._activationTime; },
            set: function (time) { this._activationTime = time; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CalendarEvt.prototype, "timeoutID", {
            get: function () { return this._timeoutID; },
            set: function (timeoutID) { this._timeoutID = timeoutID; },
            enumerable: true,
            configurable: true
        });
        return CalendarEvt;
    }(EVENTSOL.EnvironmentEvt));
    var EveryEvt = (function (_super) {
        __extends(EveryEvt, _super);
        function EveryEvt(name, status, callbackFunc, time, jna_callbackFunc) {
            if (jna_callbackFunc === void 0) { jna_callbackFunc = null; }
            _super.call(this, name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }
        EveryEvt.prototype.initializeEventActivation = function () {
            switch (this.status) {
                case EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE:
                    this._timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE:
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_JNOACTIVE:
                    break;
            }
        };
        EveryEvt.prototype.turnEvtON = function () {
            switch (this.status) {
                case EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE:
                    this.timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_JNOACTIVE:
                    clearTimeout(this.timeoutID);
                    this.timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE:
                    // ignore already active
                    break;
            }
        };
        EveryEvt.prototype.turnEvtOFF = function () {
            switch (this.status) {
                case EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE:
                    this.status = EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE;
                    clearTimeout(this._timeoutID);
                    this._timeoutID = setTimeout(this.executionOnJNoActive, this.activationTime.value);
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_JNOACTIVE:
                    clearTimeout(this._timeoutID);
                    this.timeoutID = null;
                    this.status = EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE;
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE:
                    // Ignore
                    break;
            }
        };
        EveryEvt.prototype.execution = function () {
            _super.prototype.execution.call(this);
        };
        EveryEvt.prototype.executionOnJNoActive = function () {
            _super.prototype.execution.call(this);
        };
        return EveryEvt;
    }(CalendarEvt));
    EVENTSOL.EveryEvt = EveryEvt;
    var TimerEvt = (function (_super) {
        __extends(TimerEvt, _super);
        function TimerEvt() {
            _super.apply(this, arguments);
        }
        return TimerEvt;
    }(CalendarEvt));
    var AfterEvt = (function (_super) {
        __extends(AfterEvt, _super);
        function AfterEvt(name, status, callbackFunc, time, jna_callbackFunc) {
            if (jna_callbackFunc === void 0) { jna_callbackFunc = null; }
            _super.call(this, name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }
        AfterEvt.prototype.initializeEventActivation = function () {
            switch (this.status) {
                case EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE:
                    this._timeoutID = setTimeout(this.execution, this.activationTime.value);
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_NOACTIVE:
                    break;
                case EVENTSOL.EnvironmentEvtStatus.EVT_JNOACTIVE:
                    throw new RangeError("Unexpected event status value is ");
            }
        };
        AfterEvt.prototype.turnEvtON = function () {
            if (this.status !== EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE) {
                this._timeoutID = setInterval(this.execution, this.activationTime.value);
            }
        };
        AfterEvt.prototype.turnEvtOFF = function () {
            // TODO
        };
        AfterEvt.prototype.execution = function () {
            _super.prototype.execution.call(this);
        };
        AfterEvt.prototype.executionOnJNoActive = function () {
            _super.prototype.execution.call(this);
        };
        return AfterEvt;
    }(TimerEvt));
    EVENTSOL.AfterEvt = AfterEvt;
    var OnTimeDateEvt = (function (_super) {
        __extends(OnTimeDateEvt, _super);
        function OnTimeDateEvt(name, status, callbackFunc, time, jna_callbackFunc) {
            if (jna_callbackFunc === void 0) { jna_callbackFunc = null; }
            _super.call(this, name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }
        OnTimeDateEvt.prototype.initializeEventActivation = function () {
        };
        OnTimeDateEvt.prototype.turnEvtON = function () {
            if (this.status !== EVENTSOL.EnvironmentEvtStatus.EVT_ACTIVE) {
                this._timeoutID = setInterval(this.execution, this.activationTime.value);
            }
        };
        OnTimeDateEvt.prototype.turnEvtOFF = function () {
            // TODO
        };
        OnTimeDateEvt.prototype.execution = function () {
            _super.prototype.execution.call(this);
        };
        OnTimeDateEvt.prototype.executionOnJNoActive = function () {
            _super.prototype.execution.call(this);
        };
        return OnTimeDateEvt;
    }(CalendarEvt));
    EVENTSOL.OnTimeDateEvt = OnTimeDateEvt;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=CalendarEvt.js.map