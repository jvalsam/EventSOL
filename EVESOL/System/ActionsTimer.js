var EVENTSOL;
(function (EVENTSOL) {
    ////////////////////////////////////////////
    var TimeActions = (function () {
        function TimeActions() {
            this._timeoutID = 0;
            this._actionsMap = {};
        }
        Object.defineProperty(TimeActions.prototype, "timeoutID", {
            get: function () { return this._timeoutID; },
            set: function (timeoutID) { this._timeoutID = timeoutID; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeActions.prototype, "actionsMap", {
            get: function () { return this._actionsMap; },
            set: function (map) { this._actionsMap = map; },
            enumerable: true,
            configurable: true
        });
        // functions handle data of the map...
        // insert actions remove actions
        // check if map is empty ,  etc
        TimeActions.prototype.insert = function (action) {
            this._actionsMap[action.id] = action.fireAction;
        };
        TimeActions.prototype.remove = function (actionId) {
            if (!this._actionsMap[actionId])
                return false;
            delete this._actionsMap[actionId];
            return true;
        };
        TimeActions.prototype.isEmpty = function () {
            return Object.keys(this._actionsMap).length === 0;
        };
        return TimeActions;
    }());
    // Use for runtime
    var TimeAction = (function () {
        function TimeAction(fireAction) {
            this._timeoutID = 0;
            this._fireAction = fireAction;
        }
        Object.defineProperty(TimeAction.prototype, "fireAction", {
            get: function () { return this._fireAction; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TimeAction.prototype, "timeoutID", {
            get: function () { return this._timeoutID; },
            set: function (timeoutID) { this._timeoutID = timeoutID; },
            enumerable: true,
            configurable: true
        });
        return TimeAction;
    }());
    var TimerStatusSys;
    (function (TimerStatusSys) {
        TimerStatusSys[TimerStatusSys["ON"] = 0] = "ON";
        TimerStatusSys[TimerStatusSys["OFF"] = 1] = "OFF";
    })(TimerStatusSys || (TimerStatusSys = {}));
    var TimerSys = (function () {
        function TimerSys() {
            if (TimerSys._inst) {
                throw new RangeError("Error: Instantiation failed: Use TimerSys.getInstance() instead of new.");
            }
            this._status = TimerStatusSys.OFF;
            this._timesMap = {};
            this._runtimeIntervalsMap = {};
            TimerSys._inst = this;
            return TimerSys._inst;
        }
        TimerSys.getInstance = function () {
            return TimerSys._inst;
        };
        TimerSys.prototype.insertAction = function (action, registration) {
            var actionTime = action.time.value;
            if (registration) {
                if (!this._timesMap[actionTime]) {
                    this._timesMap[actionTime] = new TimeActions();
                    this._timesMap[actionTime].insert(action);
                    if (this._status === TimerStatusSys.ON) {
                        this.setInterval(action.fireAction, actionTime);
                    }
                }
                else {
                    this._timesMap[actionTime].insert(action);
                }
            }
            else {
                var runtimeAction = new TimeAction(action.fireAction);
                runtimeAction.timeoutID = this.setInterval(action.fireAction, actionTime);
                this._runtimeIntervalsMap[action.id] = runtimeAction;
            }
        };
        TimerSys.prototype.removeAction = function (action) {
            // actions that have been added runtime
            if (action.id in this._runtimeIntervalsMap) {
                clearTimeout(this._runtimeIntervalsMap[action.id].timeoutID);
                delete this._runtimeIntervalsMap[action.id];
                return true;
            }
            var keyTime = action.time.value;
            if (!this._timesMap[keyTime]) {
                throw new RangeError("Error: try to remove action includes time: " + keyTime + " not exists in the TimerSystem.");
            }
            var actionRemoved = this._timesMap[keyTime].remove(action.id);
            if (actionRemoved && this._timesMap[keyTime].isEmpty()) {
                clearTimeout(this._timesMap[keyTime].timeoutID);
                delete this._timesMap[keyTime];
            }
            return actionRemoved;
        };
        // starts timer for the actions
        TimerSys.prototype.start = function () {
            this._status = TimerStatusSys.ON;
            // initialize intervals base on time keys
            for (var keyTime in this._timesMap) {
                this._timesMap[keyTime].timeoutID = this.setInterval(this.actionsCheck, keyTime);
            }
        };
        // stop timer of actions check
        TimerSys.prototype.stop = function () {
            if (this._status === TimerStatusSys.ON) {
                this._status = TimerStatusSys.OFF;
                for (var keyTime in this._timesMap) {
                    clearTimeout(this._timesMap[keyTime].timeoutID);
                }
            }
        };
        // callback for each of the intervals of timer
        TimerSys.prototype.actionsCheck = function (keyTime) {
            for (var actionId in this._timesMap[keyTime].actionsMap) {
                this._timesMap[keyTime].actionsMap[actionId]();
            }
        };
        TimerSys.prototype.setInterval = function (callback, keyTime) {
            return setInterval(callback.bind(this, keyTime), keyTime);
        };
        TimerSys._inst = new TimerSys();
        return TimerSys;
    }());
    EVENTSOL.TimerSys = TimerSys;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=ActionsTimer.js.map