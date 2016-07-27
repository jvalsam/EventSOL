declare module EVENTSOL {
    enum ReferenceType {
        Simple = 0,
        TotalHappens = 1,
        OneOrMoreHappens = 2,
    }
    interface IReference {
        type: ReferenceType;
    }
    interface IReferenceSimple extends IReference {
        eventName: string;
        timesHappens: number;
    }
    interface IReferencesTotalHappens extends IReference {
        references: Array<IReference>;
    }
    interface IReferencesOneOrMoreHappens extends IReference {
        references: Array<IReference>;
    }
    class ReferencedEvt extends EnvironmentEvt {
        private _references;
        private _times;
        private _totalTimes;
        constructor(name: string, status: EnvironmentStatus, type: EnvironmentEvtType, isRepeatable: boolean, callback: Function, reference: IReference, groupName?: string, times?: number, evtsTurnOn?: Array<string>, groupsTurnOn?: Array<string>, evtsTurnOff?: Array<string>, groupsTurnOff?: Array<string>);
        private registrationEvtSys(action);
        registerEvtSys(): void;
        unregisterEvtSys(): void;
        evtReferenceFired(evt: EnvironmentEvt): void;
        private turnEvtHelper(turnFunc);
        turnEvtON(): void;
        turnEvtOFF(): void;
    }
    abstract class Reference {
        abstract getInvolvedEventsName(): Array<string>;
        abstract actionsCheck(): boolean;
        abstract markEvtReferenceFired(name: string): boolean;
        abstract reset(): void;
    }
    abstract class AggregateRef extends Reference {
        protected _values: Reference[];
        constructor(references: Array<IReference>);
        getInvolvedEventsName(): Array<string>;
        reset(): void;
    }
    class AndRef extends AggregateRef {
        constructor(data: IReferencesTotalHappens);
        actionsCheck(): boolean;
        markEvtReferenceFired(name: string): boolean;
    }
    class OrRef extends AggregateRef {
        constructor(data: IReferencesOneOrMoreHappens);
        actionsCheck(): boolean;
        markEvtReferenceFired(name: string): boolean;
    }
    class SimpleRef extends Reference {
        private _eventName;
        private _times2Fire;
        private _times;
        constructor(data: IReferenceSimple);
        getInvolvedEventsName(): Array<string>;
        actionsCheck(): boolean;
        markEvtReferenceFired(name: string): boolean;
        reset(): void;
    }
}
