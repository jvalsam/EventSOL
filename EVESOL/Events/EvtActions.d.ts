declare module EVENTSOL {
    abstract class EvtAction {
        protected _parent: TimerEvt;
        protected _id: number;
        protected _activationTime: Time;
        constructor(time: Time);
        start(forRegistration?: boolean): void;
        stop(): void;
        abstract fireAction(): void;
        parent: TimerEvt;
        id: number;
        time: Time;
    }
    /**
     * Creates expressions that include Every, OnTime, Wait
     */
    class TimerAction extends EvtAction {
        protected _repeatable: boolean;
        constructor(time: Time, repeatable: boolean);
        activationTime: Time;
        start(forRegistration?: boolean): void;
        fireAction(): void;
    }
    /**
     *
     */
    class TimerActionSpecificTime extends TimerAction {
        constructor(time: any);
        start(forRegistration?: boolean): void;
    }
    /**
     * Creates expressions that include When Condition
     */
    class EvtCondition extends EvtAction {
        protected _condition: Function;
        constructor(time: Time, condition: Function);
        start(forRegistration?: boolean): void;
        fireAction(): void;
    }
    class EvtConditionTimer extends EvtCondition {
        private _conditionTime;
        private _timer;
        constructor(time: Time, condition: Function, conditionTime: Time);
        start(forRegistration?: boolean): void;
        fireAction(): void;
    }
    class EvtConditionTimesHappens extends EvtCondition {
        private _times;
        private _timesCounter;
        private _prvCondResult;
        constructor(time: Time, condition: Function, times: number);
        start(forRegistration?: boolean): void;
        stop(): void;
        fireAction(): void;
    }
    class TimerActionCondition extends TimerAction {
        private _condition;
        constructor(time: Time, condition: Function);
        fireAction(): void;
    }
    class TimerActionExpiresSpecificTime extends TimerAction {
        private _specificTime;
        private _timer;
        constructor(time: Time, specificTime: Time);
        start(forRegistration?: boolean): void;
        fireAction(): void;
    }
}
