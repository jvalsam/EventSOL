module EVENTSOL {

    ////////////////////////////////////////////

    class TimeActions {
        private _timeoutID: number;
        private _actionsMap: {[actionId: number]: EvtSysAction};
        
        constructor() {
            this._timeoutID = 0;
            this._actionsMap = {};
        }

        get timeoutID(): number { return this._timeoutID; }
        set timeoutID(timeoutID: number) { this._timeoutID = timeoutID; }
        get actionsMap(): { [actionId: number]: EvtSysAction } { return this._actionsMap; }
        set actionsMap(map: { [actionId: number]: EvtSysAction }) { this._actionsMap = map; }

        // functions handle data of the map...
        // insert actions remove actions
        // check if map is empty ,  etc

        insert(action: EvtSysAction) {
            if (typeof this._actionsMap === 'undefined') {
                this._actionsMap = {};
            }
            this._actionsMap[action.id] = action;
        }

        remove(actionId: number): boolean {
            if (!this._actionsMap[actionId])
                return false;
            
            delete this._actionsMap[actionId];
            return true;
        }

        isEmpty(): boolean {
            return Object.keys(this._actionsMap).length === 0;
        }
    }

    // Use for runtime
    class TimeAction {
        private _timeoutID: number;
        private _action: EvtSysAction;

        constructor(action: EvtSysAction) {
            this._timeoutID = 0;
            this._action = action;
        }

        get action(): EvtSysAction { return this._action; }

        get timeoutID(): number { return this._timeoutID; }
        set timeoutID(timeoutID: number) { this._timeoutID = timeoutID; }
    }

    enum TimerStatusSys { ON, OFF }

    export class TimerSys {
        private static _inst: TimerSys = new TimerSys();

        private _status: TimerStatusSys;
        private _timesMap: { [time: number]: TimeActions };
        private _runtimeIntervalsMap: { [actionId: number]: TimeAction };
        
        constructor() {
            if (TimerSys._inst) {
                throw new RangeError("Error: Instantiation failed: Use TimerSys.getInstance() instead of new.");
            }

            this._status = TimerStatusSys.OFF;
            this._timesMap = {};
            this._runtimeIntervalsMap = {};

            TimerSys._inst = this;
            return TimerSys._inst;
        }

        public static getInstance(): TimerSys {
            return TimerSys._inst;
        }
        
        insertAction(action: EvtSysAction, registration: boolean) {
            var actionTime = action.time.value;

            if (registration) {
                if (!this._timesMap[actionTime]) { // new time element in timer system
                    this._timesMap[actionTime] = new TimeActions();
                    this._timesMap[actionTime].insert(action);

                    if (this._status === TimerStatusSys.ON) {
                        this._timesMap[actionTime].timeoutID =this.setInterval(this.actionsCheck, actionTime);
                    }
                }
                else {
                    this._timesMap[actionTime].insert(action);
                }
            }
            else {
                var runtimeAction: TimeAction = new TimeAction(action);
                runtimeAction.timeoutID = this.setInterval(this.runtimeActionCheck, actionTime, action.id);
                this._runtimeIntervalsMap[action.id] = runtimeAction;
            }
        }

        removeAction(action: EvtSysAction): boolean {
            // actions that have been added runtime
            if (action.id in this._runtimeIntervalsMap) {
                clearInterval(this._runtimeIntervalsMap[action.id].timeoutID);
                delete this._runtimeIntervalsMap[action.id];
                return true;
            }

            var keyTime = action.time.value;
            
            if (!this._timesMap[keyTime]) {
                throw new RangeError("Error: try to remove action includes time: " + keyTime + " not exists in the TimerSystem.");
            }

            var actionRemoved = this._timesMap[keyTime].remove(action.id);

            if (actionRemoved && this._timesMap[keyTime].isEmpty()) {
                clearInterval(this._timesMap[keyTime].timeoutID);
                delete this._timesMap[keyTime];
            }

            return actionRemoved;
        }

        // starts timer for the actions
        start(): void {
            this._status = TimerStatusSys.ON;
            // initialize intervals base on time keys
            for (var keyTime in this._timesMap) {
                this._timesMap[keyTime].timeoutID = this.setInterval(this.actionsCheck, keyTime);
            }
        }

        // stop timer of actions check
        stop(): void {
            if (this._status === TimerStatusSys.ON) {
                this._status = TimerStatusSys.OFF;

                for (var keyTime in this._timesMap) {
                    clearInterval(this._timesMap[keyTime].timeoutID);
                }
                // clear runtime inserted actions, and remove them from runtime and register them in _timesMap
                for (var actionId in this._runtimeIntervalsMap) {
                    let action: EvtSysAction = this._runtimeIntervalsMap[actionId].action;
                    // move action from runtime to registration time
                    this.removeAction(action);
                    this.insertAction(this._runtimeIntervalsMap[actionId].action, true);
                }
            }
        }
        
        // callback for each of the intervals of timer
        private actionsCheck(keyTime: number): void {
            for (var actionId in this._timesMap[keyTime].actionsMap) {
                this._timesMap[keyTime].actionsMap[actionId].fireAction();
            }
        }

        private runtimeActionCheck(actionId: number): void {
            this._runtimeIntervalsMap[actionId].action.fireAction();
        }

        private setInterval(callback: Function, keyTime, actionId?: number): number {
            return setInterval(callback.bind(this, actionId ? actionId : keyTime), keyTime);
        }
    }
    
}