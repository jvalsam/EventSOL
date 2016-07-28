module EVENTSOL {

    var totalEvtActions = 0;

    export abstract class EvtSysAction {
        protected _id: number;

        protected _activationTime: Time;

        constructor(time: Time) {
            this._id = ++totalEvtActions;
            this._activationTime = time;
        }

        start(forRegistration: boolean = false): void {
            TimerSys.getInstance().insertAction(this, forRegistration);
        }

        stop(): void {
            TimerSys.getInstance().removeAction(this);
        }

        // Checks if event action is fired, in case call function execution of the environment event
        abstract fireAction(): void;

        get id(): number { return this._id; }
        get time(): Time { return this._activationTime; }
    }

    export abstract class EvtAction extends EvtSysAction {
        protected _parent: TimerEvt;

        constructor(time: Time) {
            super(time);
            this._parent = null; // parent populates itself on construction
        }
        
        get parent(): TimerEvt { return this._parent; }
        set parent(ee: TimerEvt) { this._parent = ee; }
        
    }

    /**
     * Creates expressions that include Every, OnTime, Wait
     */
    export class TimerAction extends EvtAction {
        protected _repeatable: boolean;
        
        constructor(time: Time, repeatable: boolean) {
            super(time);
            this._repeatable = repeatable;
        }

        get activationTime(): Time { return this._activationTime; }
        set activationTime(time: Time) { this._activationTime = time; }

        start(forRegistration: boolean =false): void {
            super.start(forRegistration);
        }

        fireAction(): void {
            // notify parent that evtaction fired
            this._parent.actionFired(this._id, !this._repeatable);
        }
    }

    /**
     * 
     */
    export class TimerActionSpecificTime extends TimerAction {

        constructor(time) {
            super(time, false);
        }

        // has to fix time to be specific
        start(forRegistration: boolean = false): void {
            // TODO: fix current date time
            var currentdate = new Date();
            // has to sub it from the SpecTime in order to find out when is the correct time for the event
            
            super.start(forRegistration);
        }


    }
    
    /**
     * Creates expressions that include When Condition
     */
    export class EvtCondition extends EvtAction {
        protected _condition: Function; // could be replaced by source code in string

        constructor(time: Time, condition: Function) {
            super(time);
            this._condition = condition;
        }

        start(forRegistration: boolean =false): void {
            super.start(true);  // All condition could be in registration of map
                                // No matter if 1st fireAction of check condition will be sooner
                                // Have to be accurate with TimerAction
        }

        fireAction(): void {
            var conditionResult: boolean = this._condition();
            if (conditionResult) {
                this._parent.actionFired(this._id, true);
            }
        }
    }

    export class EvtConditionTimer extends EvtCondition {
        private _conditionTime: Time;
        private _timer: Time;

        constructor(time: Time, condition: Function, conditionTime: Time) {
            super(time, condition);
            this._conditionTime = conditionTime;
        }

        start(forRegistration: boolean =false): void {
            super.start(forRegistration);
            this._timer = new Time();
        }

        fireAction(): void {
            var conditionResult: boolean = this._condition();
            var currentTime: number = Time.now();

            if (conditionResult === true) {
                // first condition true, timer is 0
                if (this._timer.value === 0) {
                    this._timer.value = currentTime;
                }
                // time that condition happens is completed -> event fire
                else if (currentTime - this._timer.value >= this._conditionTime.value) {
                    this._parent.actionFired(this._id, true);
                }
            }
            else {
                // condition is not true -> reset timer which counts the time beginning condition be true
                this._timer.value = 0;
            }
        }
    }

    export class EvtConditionTimesHappens extends EvtCondition {
        private _times: number;
        private _timesCounter: number;
        private _prvCondResult: boolean;

        constructor(time: Time, condition: Function, times: number) {
            super(time, condition);
            if (times <= 0) {
                console.warn(
                    "Warning: In EnvironmentEvt type: When_Condition_HappensSpecificNumberOfTimes, times cannot be " + times +
                    ". Default number of times (value == 1) has been setted."
                );
                this._times = 1;
            }
            else {
                this._times = times;
            }
            this._timesCounter = 0;
            this._prvCondResult = false;
        }

        start(forRegistration: boolean =false): void {
            super.start(forRegistration);
            this._prvCondResult = false;
        }

        stop(): void {
            super.stop();
            this._prvCondResult = false;
        }

        fireAction(): void {
            var conditionResult: boolean = this._condition();

            if (this._prvCondResult === false && conditionResult === true) {
                ++this._timesCounter;
                if (this._timesCounter === this._times) {
                    // event fired
                    this._parent.actionFired(this._id, true);
                    return;
                }
            }

            this._prvCondResult = conditionResult;
        }
    }

    export class TimerActionCondition extends TimerAction {
        private _condition: Function;

        constructor(time: Time, condition: Function) {
            super(time, true);

            this._condition = condition;
        }

        fireAction(): void {
            var conditionResult: boolean = this._condition();

            if (conditionResult === true) {
                this._parent.actionFired(this._id, false);
            }
            else {
                this._parent.actionFired(this._id, true/*unused*/, true);
            }
        }
    }

    export class TimerActionExpiresSpecificTime extends TimerAction {
        private _specificTime: Time;
        private _timer: Time;

        constructor(time: Time, specificTime: Time) {
            super(time, true);
            this._specificTime = specificTime;
        }

        start(forRegistration: boolean =false): void {
            super.start(forRegistration);
            this._timer = new Time(Time.now());
        }

        fireAction(): void {
            if (Time.now() - this._timer.value <= this._specificTime.value) {
                this._parent.actionFired(this._id, false);
            }
            else {
                this._parent.actionFired(this._id, true/*unused*/, true);
            }
        }
    }

    /**
     *  Timer Action for Referenced Event
     */

    export class EvtReferenceTimer extends EvtSysAction {
        private _parent: ReferencedEvtTimer;

        private _condition: Function;
        private _conditionTime: Time;
        private _timer: Time;

        constructor(
            parent: ReferencedEvtTimer,
            condition: Function,
            conditionTime: Time,
            freqTime: Time = Time.DefaultCondTime
        ) {
            super(freqTime);

            this._parent = parent;
            this._condition = condition;
            this._conditionTime = conditionTime;
        }

        start(forRegistration: boolean = false): void {
            super.start(true);
            this._timer = new Time();
        }

        fireAction(): void {
            var conditionResult: boolean = this._condition();
            var currentTime: number = Time.now();

            if (conditionResult === true) {
                // first condition true, timer is 0
                if (this._timer.value === 0) {
                    this._timer.value = currentTime;
                }
                // time that condition happens is completed -> event fire
                else if (currentTime - this._timer.value >= this._conditionTime.value) {
                    this._parent.actionFired(true);
                }
            }
            else {
                this._parent.actionFired(false);
            }
        }

        get parent(): ReferencedEvtTimer { return this._parent; }
        set parent(parent: ReferencedEvtTimer) { this._parent = parent; }
    }
}