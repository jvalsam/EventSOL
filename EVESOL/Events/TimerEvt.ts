namespace EVENTSOL {

    /**
     *  Events that are based on System Clock, includes one or more time values -> evtActions
     */
    export class TimerEvt extends EnvironmentEvt {
        private _index: number;
        private _evtActions: Array<EvtAction>;

        constructor(
            name: string,
            status: EnvironmentStatus,
            type: EnvironmentEvtType,
            isRepeatable: boolean,
            callback: Function,
            evtActions: Array<EvtAction>,
            groupName: string = null,
            evtsTurnOn: Array<string> = new Array<string>(),
            groupsTurnOn: Array<string> = new Array<string>(),
            evtsTurnOff: Array<string> = new Array<string>(),
            groupsTurnOff: Array<string> = new Array<string>()
        ) {
            super(
                name,
                status,
                type,
                isRepeatable,
                callback,
                groupName,
                evtsTurnOn,
                groupsTurnOn,
                evtsTurnOff,
                groupsTurnOff
            );
            
            this._index = 0;
            this._evtActions = evtActions;

            if (this._evtActions.length === 0) {
                throw new RangeError("Error: try to create Environment Event with empty EvtActions list.");
            }

            // populate environment event to the included event actions
            for (var evtAction of this._evtActions) {
                evtAction.parent = this;
            }
        }
        
        protected checkStatusForRegistration() {
            super.checkStatusForRegistration();

            if (this._index != 0) {
                throw new RangeError(
                    "Error: try to load action of Environment Event called " + this._name +
                    " which is not unloaded correctly."
                );
            }
        }

        registerEvtSys(): void {
            this.checkStatusForRegistration();

            // First action only load -> State machine of event actions
            // It will may change for special case
            this._evtActions[this._index].start(true);
        }
        
        // Unload action in the index -> Environment event restarts. This means restart index etc
        unregisterEvtSys(): void {
            this._evtActions[this._index].stop();

            // reset
            this._index = 0;
            this._status = this._initialStatus;
        }

        turnEvtON(): void {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                super.turnEvtON();

                this.checkStatusForRegistration();
                this._evtActions[this._index].start();
            }
        }

        turnEvtOFF(): void {
            if (this._status !== EnvironmentStatus.ENV_NOACTIVE) {
                super.turnEvtOFF();

                this._evtActions[this._index].stop();
                // reset
                this._index = 0;
            }
        }

        actionFired(actionId: number, lastFired?: boolean, actionExpired: boolean =false) {
            var currAction: EvtAction = this._evtActions[this._index];
            if (currAction.id !== actionId) {
                throw new RangeError(
                    "Error: EvtAction with id: " + actionId + " fired for the TimerEvt called " + this._name +
                    ". EvtAction with id: " + currAction.id + "was expected."
                );
            }
            
            if (actionExpired === true) { // EVERY Time (WHILE Condition | FOR Time)
                // This type of action has to be defined in the last index
                if (this._evtActions.length - 1 !== this._index) {
                    throw new RangeError(
                        "Error: Invalid defined index of EvtAction: EVERY-WHILE with action ID: " + actionId +
                        " in the EnvironmentEvt called " + this.name + "in group " + this.groupName + "."
                    );
                }

                this.turnEvtOFF();
            }
            else if (this._evtActions.length - 1 !== this._index) {
                // check current action SHOULD NOT BE REAPEATABLE it is not repeatable
                if (!lastFired) {
                    throw new RangeError(
                        "Error: Repeatable EvtAction with id: " + actionId +
                        "found as not last EvtAction in the EnvironmentEvt called " + this._name + "."
                    );
                }
                // Implementation only for sequential actions, needs extra for parallel actions happens
                currAction.stop();
                // add next action in TimerSys
                ++this._index;
                let evtAction: EvtAction = this._evtActions[this._index];
                evtAction.start();
            }
            // Check if EnvironmentEvt will fire === last EvtAction
            else {
                if (this.status === EnvironmentStatus.ENV_NOACTIVE) {
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
        }
    }
}