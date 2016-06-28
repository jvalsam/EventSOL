module EVENTSOL {

    abstract class CalendarEvt extends EnvironmentEvt {
        protected _activationTime: Time;
        protected _timeoutID: number;

        constructor(name: string, status: EnvironmentEvtStatus, callbackFunc: Function, time: Time, jnaCallbackFunc: Function) {
            super(name, status, callbackFunc, jnaCallbackFunc);
            this._activationTime = time;
        }

        get activationTime(): Time { return this._activationTime; }
        set activationTime(time: Time) { this._activationTime = time; }

        protected get timeoutID(): number { return this._timeoutID; }
        protected set timeoutID(timeoutID: number) { this._timeoutID = timeoutID; }

        abstract initializeEventActivation(): void;
    }

    export class EveryEvt extends CalendarEvt {

        constructor(name: string, status: EnvironmentEvtStatus, callbackFunc: Function, time: Time, jna_callbackFunc:Function = null) {
            super(name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }
        
        initializeEventActivation(): void {
            switch (this.status) {
                case EnvironmentEvtStatus.EVT_ACTIVE:
                    this._timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EnvironmentEvtStatus.EVT_NOACTIVE:
                    break;
                case EnvironmentEvtStatus.EVT_JNOACTIVE:
                    break;
            }
        }

        turnEvtON(): void {
            switch (this.status) {
                case EnvironmentEvtStatus.EVT_NOACTIVE:
                    this.timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EnvironmentEvtStatus.EVT_JNOACTIVE:
                    clearTimeout(this.timeoutID);
                    this.timeoutID = setInterval(this.execution, this.activationTime.value);
                    break;
                case EnvironmentEvtStatus.EVT_ACTIVE:
                    // ignore already active
                    break;
            }
        }

        turnEvtOFF(): void {
            switch (this.status) {
                case EnvironmentEvtStatus.EVT_ACTIVE:
                    this.status = EnvironmentEvtStatus.EVT_NOACTIVE;
                    clearTimeout(this._timeoutID);
                    this._timeoutID = setTimeout(this.executionOnJNoActive, this.activationTime.value);
                    break;
                case EnvironmentEvtStatus.EVT_JNOACTIVE:
                    clearTimeout(this._timeoutID);
                    this.timeoutID = null;
                    this.status = EnvironmentEvtStatus.EVT_NOACTIVE;
                    break;
                case EnvironmentEvtStatus.EVT_NOACTIVE:
                    // Ignore
                    break;
            }
        }

        execution() {
            super.execution();

        }

        executionOnJNoActive() {
            super.execution()
        }
    }

    abstract class TimerEvt extends CalendarEvt {
        
    }

    export class AfterEvt extends TimerEvt {
        
        constructor(name: string, status: EnvironmentEvtStatus, callbackFunc: Function, time: Time, jna_callbackFunc: Function = null) {
            super(name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }
        
        initializeEventActivation(): void {
            switch (this.status) {
                case EnvironmentEvtStatus.EVT_ACTIVE:
                    this._timeoutID = setTimeout(this.execution, this.activationTime.value);
                    break;
                case EnvironmentEvtStatus.EVT_NOACTIVE:
                    break;
                case EnvironmentEvtStatus.EVT_JNOACTIVE:
                    throw new RangeError("Unexpected event status value is ");
            }
        }

        turnEvtON(): void {
            if (this.status !== EnvironmentEvtStatus.EVT_ACTIVE) {
                this._timeoutID = setInterval(this.execution, this.activationTime.value);
            }
        }

        turnEvtOFF(): void {
            // TODO
        }

        execution() {
            super.execution();

        }

        executionOnJNoActive() {
            super.execution()
        }
    }

    export class OnTimeDateEvt extends CalendarEvt {
        
        constructor(name: string, status: EnvironmentEvtStatus, callbackFunc: Function, time: Time, jna_callbackFunc: Function = null) {
            super(name, status, callbackFunc, time, jna_callbackFunc);
            this.initializeEventActivation();
        }

        initializeEventActivation():void {
            
        }

        turnEvtON(): void {
            if (this.status !== EnvironmentEvtStatus.EVT_ACTIVE) {
                this._timeoutID = setInterval(this.execution, this.activationTime.value);
            }
        }

        turnEvtOFF(): void {
            // TODO
        }

        execution() {
            super.execution();

        }

        executionOnJNoActive() {
            super.execution()
        }
    }
}