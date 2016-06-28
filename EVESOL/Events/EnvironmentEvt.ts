module EVENTSOL {

    export abstract class EnvironmentEvt {
        protected _name: string;
        protected _id: number;
        protected _status: EnvironmentEvtStatus;

        protected _totalExecutions: number;
        protected _totalFireEvt: number;

        protected _lastExecution: Time;

        protected _callbackFunc: Function;
        protected _jnaCallbackFunc: Function;

        constructor(name: string, status: EnvironmentEvtStatus, callback: Function, jnaCallback:Function) {
            this._name = name;
            this._status = status;
            this._callbackFunc = callback;
            this._jnaCallbackFunc = jnaCallback;

            this._id = ++totalDefinedEvts;

            this._totalExecutions = 0;
            this._totalFireEvt = 0;
            this._lastExecution = new Time();
        }

        get name(): string { return this._name; }
        set name(name: string) { this._name = name; }
        get id(): number { return this._id; }
        set id(id: number) { this._id = id; }
        get status(): EnvironmentEvtStatus { return this._status; }
        set status(status: EnvironmentEvtStatus) { this._status = status; }

        get totalExecutions(): number { return this._totalExecutions; }
        set totalExecutions(te: number) { this._totalExecutions = te; }
        get totalFireEvt(): number { return this._totalFireEvt; }
        set totalFireEvt(te: number) { this._totalFireEvt = te; }

        get lastExecution(): Time { return this._lastExecution; }
        set lastExecution(le: Time) { this._lastExecution = le; }

        execution(): void {
            ++this._totalExecutions;
            ++this._totalFireEvt;
            // TODO: check if this event is refered by referevts
        }

        executionOnJNoActive (): void {
            ++this._totalFireEvt;
            
        }

        // actions user can choose during runtime
        abstract turnEvtON(): void;
        abstract turnEvtOFF(): void;
    }

}