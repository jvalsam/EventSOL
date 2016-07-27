declare module EVENTSOL {
    enum ReferenceType {
        Leaf = 0,
        TotalHappens = 1,
        OneOrMoreHappens = 2,
    }
    enum OperatorTypeTimes {
        Equal = 0,
        NotEqual = 1,
        Greater = 2,
        GreaterOrEqual = 3,
        Less = 4,
        LessOrEqual = 5,
    }
    interface IReference {
        type: ReferenceType;
    }
    interface IReferenceLeaf extends IReference {
        eventName: string;
        timesHappens: number;
        leafType: OperatorTypeTimes;
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
    abstract class LeafRef extends Reference {
        protected _eventName: string;
        protected _times2Fire: number;
        protected _times: number;
        constructor(data: IReferenceLeaf);
        getInvolvedEventsName(): Array<string>;
        markEvtReferenceFired(name: string): boolean;
        reset(): void;
    }
    class EqualRef extends LeafRef {
        actionsCheck(): boolean;
    }
    class NotEqualRef extends LeafRef {
        actionsCheck(): boolean;
    }
    class GreaterRef extends LeafRef {
        actionsCheck(): boolean;
    }
    class GreaterOrEqualRef extends LeafRef {
        actionsCheck(): boolean;
    }
    class LessRef extends LeafRef {
        actionsCheck(): boolean;
    }
    class LessOrEqualRef extends LeafRef {
        actionsCheck(): boolean;
    }
}
