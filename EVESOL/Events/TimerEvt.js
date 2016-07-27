var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EVENTSOL;
(function (EVENTSOL) {
    /**
     *  Events that are based on System Clock, includes one or more time values -> evtActions
     */
    var TimerEvt = (function (_super) {
        __extends(TimerEvt, _super);
        function TimerEvt(name, status, type, isRepeatable, callback, evtActions, groupName, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff) {
            if (groupName === void 0) { groupName = null; }
            if (evtsTurnOn === void 0) { evtsTurnOn = new Array(); }
            if (groupsTurnOn === void 0) { groupsTurnOn = new Array(); }
            if (evtsTurnOff === void 0) { evtsTurnOff = new Array(); }
            if (groupsTurnOff === void 0) { groupsTurnOff = new Array(); }
            _super.call(this, name, status, type, isRepeatable, callback, groupName, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff);
            this._index = 0;
            this._evtActions = evtActions;
            if (this._evtActions.length === 0) {
                throw new RangeError("Error: try to create Environment Event with empty EvtActions list.");
            }
            // populate environment event to the included event actions
            for (var _i = 0, _a = this._evtActions; _i < _a.length; _i++) {
                var evtAction = _a[_i];
                evtAction.parent = this;
            }
        }
        TimerEvt.prototype.checkStatusForRegistration = function () {
            _super.prototype.checkStatusForRegistration.call(this);
            if (this._index != 0) {
                throw new RangeError("Error: try to load action of Environment Event called " + this._name +
                    " which is not unloaded correctly.");
            }
        };
        TimerEvt.prototype.registerEvtSys = function () {
            this.checkStatusForRegistration();
            // First action only load -> State machine of event actions
            // It will may change for special case
            this._evtActions[this._index].start(true);
        };
        // Unload action in the index -> Environment event restarts. This means restart index etc
        TimerEvt.prototype.unregisterEvtSys = function () {
            this._evtActions[this._index].stop();
            // reset
            this._index = 0;
            this._status = this._initialStatus;
        };
        TimerEvt.prototype.turnEvtON = function () {
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_ACTIVE) {
                _super.prototype.turnEvtON.call(this);
                this.checkStatusForRegistration();
                this._evtActions[this._index].start();
            }
        };
        TimerEvt.prototype.turnEvtOFF = function () {
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_NOACTIVE) {
                _super.prototype.turnEvtOFF.call(this);
                this._evtActions[this._index].stop();
                // reset
                this._index = 0;
            }
        };
        TimerEvt.prototype.actionFired = function (actionId, lastFired, actionExpired) {
            if (actionExpired === void 0) { actionExpired = false; }
            var currAction = this._evtActions[this._index];
            if (currAction.id !== actionId) {
                throw new RangeError("Error: EvtAction with id: " + actionId + " fired for the TimerEvt called " + this._name +
                    ". EvtAction with id: " + currAction.id + "was expected.");
            }
            if (actionExpired === true) {
                // This type of action has to be defined in the last index
                if (this._evtActions.length - 1 !== this._index) {
                    throw new RangeError("Error: Invalid defined index of EvtAction: EVERY-WHILE with action ID: " + actionId +
                        " in the EnvironmentEvt called " + this.name + "in group " + this.groupName + ".");
                }
                this.turnEvtOFF();
            }
            else if (this._evtActions.length - 1 !== this._index) {
                // check current action SHOULD NOT BE REAPEATABLE it is not repeatable
                if (!lastFired) {
                    throw new RangeError("Error: Repeatable EvtAction with id: " + actionId +
                        "found as not last EvtAction in the EnvironmentEvt called " + this._name + ".");
                }
                // Implementation only for sequential actions, needs extra for parallel actions happens
                currAction.stop();
                // add next action in TimerSys
                ++this._index;
                var evtAction = this._evtActions[this._index];
                evtAction.start();
            }
            else {
                if (this.status === EVENTSOL.EnvironmentStatus.ENV_NOACTIVE) {
                    throw new RangeError("Error: try to fire TimerEvt called " + this._name + " which is NOACTIVE");
                }
                // remove action from the TimerSys while source code of execution runs
                // TODO: check if it is required, if not remove
                // TimerSys.getInstance().removeAction(currAction);
                this.execution();
                // insert back the action to the TimerSys while source code of execution runs
                // TODO: check if it is required, if not remove
                // TimerSys.getInstance().insertAction(currAction, false);
                // deactivate environment event (and reset it) in case it is not repeatable action
                if (lastFired) {
                    this.turnEvtOFF();
                }
                this.actionsAfterExecution();
            }
        };
        return TimerEvt;
    }(EVENTSOL.EnvironmentEvt));
    EVENTSOL.TimerEvt = TimerEvt;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=TimerEvt.js.map