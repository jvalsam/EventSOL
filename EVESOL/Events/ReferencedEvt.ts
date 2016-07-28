module EVENTSOL {

    export enum ReferenceType {
        Leaf,
        TotalHappens,
        OneOrMoreHappens
    }

    export enum OperatorTypeTimes {
        Equal,
        NotEqual,
        Greater,
        GreaterOrEqual,
        Less,
        LessOrEqual
    }

    export interface IReference {
        type: ReferenceType
    }

    export interface IReferenceLeaf extends IReference {
        eventName: string,
        timesHappens: number,
        leafType: OperatorTypeTimes
    }

    export interface IReferencesTotalHappens extends IReference {
        references: Array<IReference>;
    }

    export interface IReferencesOneOrMoreHappens extends IReference {
        references: Array<IReference>;
    }
    
    ////////////////////////////////////////////////////
    
    export class ReferencedEvt extends EnvironmentEvt {
        protected _references: Reference;
        protected _times: number;
        protected _totalTimes: number;

        constructor(
            name: string,
            status: EnvironmentStatus,
            type: EnvironmentEvtType,
            isRepeatable: boolean,
            callback: Function,
            reference: IReference,
            groupName: string = null,
            times: number = 1,
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

            switch (reference.type) {
                case ReferenceType.Leaf:
                    switch ((<IReferenceLeaf>reference).leafType) {
                        case OperatorTypeTimes.Equal:
                            this._references = new EqualRef(<IReferenceLeaf>reference);
                            break;
                        case OperatorTypeTimes.NotEqual:
                            this._references = new NotEqualRef(<IReferenceLeaf>reference);
                            break;
                        case OperatorTypeTimes.Greater:
                            this._references = new GreaterRef(<IReferenceLeaf>reference);
                            break;
                        case OperatorTypeTimes.GreaterOrEqual:
                            this._references = new GreaterOrEqualRef(<IReferenceLeaf>reference);
                            break;
                        case OperatorTypeTimes.Less:
                            this._references = new LessRef(<IReferenceLeaf>reference);
                            break;
                        case OperatorTypeTimes.LessOrEqual:
                            this._references = new LessOrEqualRef(<IReferenceLeaf>reference);
                            break;
                    }
                    break;
                case ReferenceType.TotalHappens:
                    this._references = new AndRef(<IReferencesTotalHappens>reference);
                    break;
                case ReferenceType.OneOrMoreHappens:
                    this._references = new OrRef(<IReferencesOneOrMoreHappens>reference);
                    break;
            }

            this._times = times;
            this._totalTimes = 0;
        }
        
        private registrationEvtSys(action:string): void {
            // populate citation in the respective events
            var group = EnvEventSys.getInstance().getGroupEnvironmentEvts(this.groupName);
            this._references.getInvolvedEventsName().forEach(function (evtName: string) {
                let evt: EnvironmentEvt = group.getEnvironmentEvt(evtName);
                if (evt === null) {
                    throw new RangeError(
                        "Error: try to create ReferencedEvt called " + this.name +
                        " which includes reference in environment"
                    );
                }
                evt[action](this);
            }, this);
        }
        
        registerEvtSys(): void {
            this.checkStatusForRegistration();

            this.registrationEvtSys("insertCitation");
        }

        unregisterEvtSys(): void {
            this.registrationEvtSys("removeCitation");
        }

        evtReferenceFired(evt: EnvironmentEvt) {
            if (this.status === EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError(
                    "Error: EnvironmentEvt called " + evt.name +
                    " try to call evtReferencedFired of RefEvt called " + this.name
                );
            }

            this._references.markEvtReferenceFired(evt.name);
            
            // check if referenced event fired due to the evt
            if (this._references.actionsCheck()) {
                ++this._totalTimes;

                if (this._totalTimes === this._times) {
                    this.execution();
                    // executed once by default and then turns off
                    this.turnEvtOFF();

                    this.actionsAfterExecution();
                }

                // reset reference which is true in order to count next creation of true ref
                this._references.reset();
            }
        }

        private turnEvtHelper(turnFunc: string) {
            var evtNames = this._references.getInvolvedEventsName();
            var evtsGroup = EnvEventSys.getInstance().getGroupEnvironmentEvts(this.groupName);

            evtNames.forEach(function (evtName) {
                let envEvt: EnvironmentEvt = evtsGroup.getEnvironmentEvt(evtName);
                if (envEvt == null || typeof envEvt === 'undefined') {
                    throw new RangeError(
                        "Error: try to get citation called " + evtName +
                        " for reference evt called " + this.name
                    );
                }
                envEvt[turnFunc](this);
            }, this);
        }

        // populate event to the respective events
        turnEvtON(): void {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                super.turnEvtON();
                this.turnEvtHelper('insertCitation');
            }
        }

        // remove event data from the respective events
        turnEvtOFF(): void {
            super.turnEvtOFF();
            this.turnEvtHelper('removeCitation');
            this._totalTimes = 0;
            this._references.reset();
        }
    }

    export class ReferencedEvtTimer extends ReferencedEvt {
        private _actionReferenceCondTimer: EvtReferenceTimer;

        constructor(
            name: string,
            status: EnvironmentStatus,
            type: EnvironmentEvtType,
            isRepeatable: boolean,
            callback: Function,
            reference: IReference,
            groupName: string = null,
            time: Time,
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
                reference,
                groupName,
                1,
                evtsTurnOn,
                groupsTurnOn,
                evtsTurnOff,
                groupsTurnOff
            );

            var references: Reference = this._references;

            this._actionReferenceCondTimer = new EvtReferenceTimer(
                this,
                function () { return references.actionsCheck(); },
                Time.DefaultCondTime,
                time
            );
            this._actionReferenceCondTimer.parent = this;
        }

        evtReferenceFired(evt: EnvironmentEvt) {
            if (this.status === EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError(
                    "Error: EnvironmentEvt called " + evt.name +
                    " try to call evtReferencedFired of RefEvt called " + this.name
                );
            }

            this._references.markEvtReferenceFired(evt.name);

            // check if referenced event fired due to the evt
            if (this._totalTimes === 0 && this._references.actionsCheck()) {
                ++this._totalTimes;
                this._actionReferenceCondTimer.start(true);
            }
        }

        actionFired(result: boolean) {
            if (result === true) {
                this.execution();
                // executed once by default and then turns off
                this.turnEvtOFF();
                this.actionsAfterExecution();
            }
            else {
                this._totalTimes = 0;
                this._actionReferenceCondTimer.stop();
            }
        }

        turnEvtOFF(): void {
            super.turnEvtOFF();
            this._actionReferenceCondTimer.stop();
        }
    }
    
    // Tree of References
    // -> Simple Ref (Tree leafs), Aggregate Ref (And Ref, Or Ref)

    export abstract class Reference {
        abstract getInvolvedEventsName(): Array<string>;
        abstract actionsCheck(): boolean;
        abstract markEvtReferenceFired(name: string): boolean;
        abstract reset(): void;
    }

    export abstract class AggregateRef extends Reference {
        protected _values: Reference[];

        constructor(references: Array<IReference>) {
            super();
            this._values = new Array<Reference>();
            references.forEach(function (ref: IReference) {
                switch (ref.type) {
                    case ReferenceType.Leaf:
                        switch ((<IReferenceLeaf>ref).leafType) {
                            case OperatorTypeTimes.Equal:
                                this._values.push(new EqualRef(<IReferenceLeaf>ref));
                                break;
                            case OperatorTypeTimes.NotEqual:
                                this._values.push(new NotEqualRef(<IReferenceLeaf>ref));
                                break;
                            case OperatorTypeTimes.Greater:
                                this._values.push(new GreaterRef(<IReferenceLeaf>ref));
                                break;
                            case OperatorTypeTimes.GreaterOrEqual:
                                this._values.push(new GreaterOrEqualRef(<IReferenceLeaf>ref));
                                break;
                            case OperatorTypeTimes.Less:
                                this._values.push(new LessRef(<IReferenceLeaf>ref));
                                break;
                            case OperatorTypeTimes.LessOrEqual:
                                this._values.push(new LessOrEqualRef(<IReferenceLeaf>ref));
                                break;
                        }
                        break;
                    case ReferenceType.TotalHappens:
                        this._values.push(new AndRef(<IReferencesTotalHappens>ref));
                        break;
                    case ReferenceType.OneOrMoreHappens:
                        this._values.push(new OrRef(<IReferencesOneOrMoreHappens>ref));
                        break;
                }
            }, this);
        }

        getInvolvedEventsName(): Array<string> {
            var eventsName: Array<string> = new Array<string>();
            this._values.forEach(function (ref: Reference) {
                eventsName.push.apply(eventsName, ref.getInvolvedEventsName());
            });
            return eventsName;
        }
        
        reset(): void {
            for (var i = 0; i < this._values.length; i++) {
                this._values[i].reset();
            }
        }
    }

    export class AndRef extends AggregateRef {

        constructor(data: IReferencesTotalHappens) {
            super(data.references);
        }

        actionsCheck(): boolean {
            for (var i = 0; i < this._values.length; i++) {
                if (!this._values[i].actionsCheck()) {
                    return false;
                }
            }
            return true;
        }

        markEvtReferenceFired(name: string): boolean {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].markEvtReferenceFired(name)) {
                    return true;
                }
            }
            return false;
        }

    }

    export class OrRef extends AggregateRef {

        constructor(data: IReferencesOneOrMoreHappens) {
            super(data.references);
        }

        actionsCheck(): boolean {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].actionsCheck()) {
                    return true;
                }
            }
            return false;
        }

        markEvtReferenceFired(name: string): boolean {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].markEvtReferenceFired(name)) {
                    return true;
                }
            }
            return false;
        }
    }

    export abstract class LeafRef extends Reference {
        protected _eventName: string;
        protected _times2Fire: number;
        protected _times: number;

        constructor(data: IReferenceLeaf) {
            super();
            this._eventName = data.eventName;
            this._times2Fire = data.timesHappens;
            this._times = 0;
        }

        getInvolvedEventsName(): Array<string> {
            var array: Array<string> = new Array<string>();
            array.push(this._eventName);
            return array;
        }

        

        markEvtReferenceFired(name: string): boolean {
            if (this._eventName === name) {
                ++this._times;
                return true;
            }
            return false;
        }

        reset(): void {
            this._times = 0;
        }
    }

    export class EqualRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times === this._times2Fire;
        }
    }

    export class NotEqualRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times !== this._times2Fire;
        }
    }

    export class GreaterRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times > this._times2Fire;
        }
    }

    export class GreaterOrEqualRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times >= this._times2Fire;
        }
    }

    export class LessRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times < this._times2Fire;
        }
    }

    export class LessOrEqualRef extends LeafRef {
        actionsCheck(): boolean {
            return this._times <= this._times2Fire;
        }
    }
}
