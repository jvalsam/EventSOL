declare namespace EVENTSOL {
    /**
     *  Events that are based on System Clock, includes one or more time values -> evtActions
     */
    class TimerEvt extends EnvironmentEvt {
        private _index;
        private _evtActions;
        constructor(name: string, status: EnvironmentStatus, type: EnvironmentEvtType, isRepeatable: boolean, callback: Function, evtActions: Array<EvtAction>, groupName?: string, evtsTurnOn?: Array<string>, groupsTurnOn?: Array<string>, evtsTurnOff?: Array<string>, groupsTurnOff?: Array<string>);
        protected checkStatusForRegistration(): void;
        registerEvtSys(): void;
        unregisterEvtSys(): void;
        turnEvtON(): void;
        turnEvtOFF(): void;
        actionFired(actionId: number, lastFired?: boolean, actionExpired?: boolean): void;
    }
}
