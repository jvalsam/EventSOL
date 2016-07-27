var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EVENTSOL;
(function (EVENTSOL) {
    var totalEvtActions = 0;
    var EvtAction = (function () {
        function EvtAction(time) {
            this._id = ++totalEvtActions;
            this._activationTime = time;
            this._parent = null; // parent populates itself on construction
        }
        EvtAction.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            EVENTSOL.TimerSys.getInstance().insertAction(this, forRegistration);
        };
        EvtAction.prototype.stop = function () {
            EVENTSOL.TimerSys.getInstance().removeAction(this);
        };
        Object.defineProperty(EvtAction.prototype, "parent", {
            get: function () { return this._parent; },
            set: function (ee) { this._parent = ee; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvtAction.prototype, "id", {
            get: function () { return this._id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EvtAction.prototype, "time", {
            get: function () { return this._activationTime; },
            enumerable: true,
            configurable: true
        });
        return EvtAction;
    }());
    EVENTSOL.EvtAction = EvtAction;
    /**
     * Creates expressions that include Every, OnTime, Wait
     */
    var TimerAction = (function (_super) {
        __extends(TimerAction, _super);
        function TimerAction(time, repeatable) {
            _super.call(this, time);
            this._repeatable = repeatable;
        }
        Object.defineProperty(TimerAction.prototype, "activationTime", {
            get: function () { return this._activationTime; },
            set: function (time) { this._activationTime = time; },
            enumerable: true,
            configurable: true
        });
        TimerAction.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            _super.prototype.start.call(this, forRegistration);
        };
        TimerAction.prototype.fireAction = function () {
            // notify parent that evtaction fired
            this._parent.actionFired(this._id, !this._repeatable);
        };
        return TimerAction;
    }(EvtAction));
    EVENTSOL.TimerAction = TimerAction;
    /**
     *
     */
    var TimerActionSpecificTime = (function (_super) {
        __extends(TimerActionSpecificTime, _super);
        function TimerActionSpecificTime(time) {
            _super.call(this, time, false);
        }
        // has to fix time to be specific
        TimerActionSpecificTime.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            // TODO: fix current date time
            var currentdate = new Date();
            // has to sub it from the SpecTime in order to find out when is the correct time for the event
            _super.prototype.start.call(this, forRegistration);
        };
        return TimerActionSpecificTime;
    }(TimerAction));
    EVENTSOL.TimerActionSpecificTime = TimerActionSpecificTime;
    /**
     * Creates expressions that include When Condition
     */
    var EvtCondition = (function (_super) {
        __extends(EvtCondition, _super);
        function EvtCondition(time, condition) {
            _super.call(this, time);
            this._condition = condition;
        }
        EvtCondition.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            _super.prototype.start.call(this, true); // All condition could be in registration of map
            // No matter if 1st fireAction of check condition will be sooner
            // Have to be accurate with TimerAction
        };
        EvtCondition.prototype.fireAction = function () {
            var conditionResult = this._condition();
            if (conditionResult) {
                this._parent.actionFired(this._id, true);
            }
        };
        return EvtCondition;
    }(EvtAction));
    EVENTSOL.EvtCondition = EvtCondition;
    var EvtConditionTimer = (function (_super) {
        __extends(EvtConditionTimer, _super);
        function EvtConditionTimer(time, condition, conditionTime) {
            _super.call(this, time, condition);
            this._conditionTime = conditionTime;
        }
        EvtConditionTimer.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            _super.prototype.start.call(this, forRegistration);
            this._timer = new EVENTSOL.Time();
        };
        EvtConditionTimer.prototype.fireAction = function () {
            var conditionResult = this._condition();
            var currentTime = EVENTSOL.Time.now();
            if (conditionResult === true) {
                // first condition true, timer is 0
                if (this._timer.value === 0) {
                    this._timer.value = currentTime;
                }
                else if (currentTime - this._timer.value >= this._conditionTime.value) {
                    this._parent.actionFired(this._id, true);
                }
            }
            else {
                // condition is not true -> reset timer which counts the time beginning condition be true
                this._timer.value = 0;
            }
        };
        return EvtConditionTimer;
    }(EvtCondition));
    EVENTSOL.EvtConditionTimer = EvtConditionTimer;
    var EvtConditionTimesHappens = (function (_super) {
        __extends(EvtConditionTimesHappens, _super);
        function EvtConditionTimesHappens(time, condition, times) {
            _super.call(this, time, condition);
            if (times <= 0) {
                console.warn("Warning: In EnvironmentEvt type: When_Condition_HappensSpecificNumberOfTimes, times cannot be " + times +
                    ". Default number of times (value == 1) has been setted.");
                this._times = 1;
            }
            else {
                this._times = times;
            }
            this._timesCounter = 0;
            this._prvCondResult = false;
        }
        EvtConditionTimesHappens.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            _super.prototype.start.call(this, forRegistration);
            this._prvCondResult = false;
        };
        EvtConditionTimesHappens.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this._prvCondResult = false;
        };
        EvtConditionTimesHappens.prototype.fireAction = function () {
            var conditionResult = this._condition();
            if (this._prvCondResult === false && conditionResult === true) {
                ++this._timesCounter;
                if (this._timesCounter === this._times) {
                    // event fired
                    this._parent.actionFired(this._id, true);
                    return;
                }
            }
            this._prvCondResult = conditionResult;
        };
        return EvtConditionTimesHappens;
    }(EvtCondition));
    EVENTSOL.EvtConditionTimesHappens = EvtConditionTimesHappens;
    var TimerActionCondition = (function (_super) {
        __extends(TimerActionCondition, _super);
        function TimerActionCondition(time, condition) {
            _super.call(this, time, true);
            this._condition = condition;
        }
        TimerActionCondition.prototype.fireAction = function () {
            var conditionResult = this._condition();
            if (conditionResult === true) {
                this._parent.actionFired(this._id, false);
            }
            else {
                this._parent.actionFired(this._id, true /*unused*/, true);
            }
        };
        return TimerActionCondition;
    }(TimerAction));
    EVENTSOL.TimerActionCondition = TimerActionCondition;
    var TimerActionExpiresSpecificTime = (function (_super) {
        __extends(TimerActionExpiresSpecificTime, _super);
        function TimerActionExpiresSpecificTime(time, specificTime) {
            _super.call(this, time, true);
            this._specificTime = specificTime;
        }
        TimerActionExpiresSpecificTime.prototype.start = function (forRegistration) {
            if (forRegistration === void 0) { forRegistration = false; }
            _super.prototype.start.call(this, forRegistration);
            this._timer = new EVENTSOL.Time(EVENTSOL.Time.now());
        };
        TimerActionExpiresSpecificTime.prototype.fireAction = function () {
            if (EVENTSOL.Time.now() - this._timer.value <= this._specificTime.value) {
                this._parent.actionFired(this._id, false);
            }
            else {
                this._parent.actionFired(this._id, true /*unused*/, true);
            }
        };
        return TimerActionExpiresSpecificTime;
    }(TimerAction));
    EVENTSOL.TimerActionExpiresSpecificTime = TimerActionExpiresSpecificTime;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=EvtActions.js.map