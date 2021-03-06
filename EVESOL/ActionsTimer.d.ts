declare module EVENTSOL {
    class TimerSys {
        private static _inst;
        private _status;
        private _timesMap;
        private _runtimeIntervalsMap;
        constructor();
        static getInstance(): TimerSys;
        insertAction(action: EvtAction, registration: boolean): void;
        removeAction(action: EvtAction): boolean;
        start(): void;
        stop(): void;
        private actionsCheck(keyTime);
        private runtimeActionCheck(actionId);
        private setInterval(callback, keyTime, actionId?);
    }
}
