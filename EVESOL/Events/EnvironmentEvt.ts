module EVENTSOL {

    export var totalDefinedEvts = 0;

    export enum EnvironmentStatus {
        ENV_ACTIVE,
        ENV_NOACTIVE,

        ENV_PAUSE
    }

    export enum EnvironmentEvtType {
        EVERY,
        EVERY_FOR,
        EVERY_WHILE,
        //
        ΟΝ,
        AFTER,
        //
        WHEN_CONDITION,
        WHEN_CONDITION_FOR,
        WHEN_CONDITION_HAPPENS,
        WHEN_CONDITION_EVERY,
        WHEN_CONDITION_EVERY_FOR,
        WHEN_CONDITION_EVERY_WHILE,
        WHEN_CONDITION_WAIT,
        WHEN_CONDITION_WAIT_EVERY,
        WHEN_CONDITION_WAIT_EVERY_FOR,
        WHEN_CONDITION_WAIT_EVERY_WHILE,
        //
        WHEN_REFERENCE,
        WHEN_REFERENCE_HAPPENS,
        WHEN_REFERENCE_FOR
    }

    var EnvironmentEvtMap = {};
    //
    EnvironmentEvtMap[EnvironmentEvtType.EVERY] = 'EVERY';
    EnvironmentEvtMap[EnvironmentEvtType.EVERY_FOR] = 'EVERY_FOR';
    EnvironmentEvtMap[EnvironmentEvtType.EVERY_WHILE] = 'EVERY_WHILE';
    //
    EnvironmentEvtMap[EnvironmentEvtType.ΟΝ] = 'ΟΝ';
    EnvironmentEvtMap[EnvironmentEvtType.AFTER] = 'AFTER';
    //
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION] = 'WHEN_CONDITION';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_FOR] = 'WHEN_CONDITION_FOR';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_HAPPENS] = 'WHEN_CONDITION_HAPPENS';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_EVERY] = 'WHEN_CONDITION_EVERY';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_EVERY_FOR] = 'WHEN_CONDITION_EVERY_FOR';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_EVERY_WHILE] = 'WHEN_CONDITION_EVERY_WHILE';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_WAIT] = 'WHEN_CONDITION_WAIT';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY] = 'WHEN_CONDITION_WAIT_EVERY';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_FOR] = 'WHEN_CONDITION_WAIT_EVERY_FOR';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_WHILE] = 'WHEN_CONDITION_WAIT_EVERY_WHILE';
    //
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_REFERENCE] = 'WHEN_REFERENCE';
    EnvironmentEvtMap[EnvironmentEvtType.WHEN_REFERENCE_HAPPENS] = 'WHEN_REFERENCE_HAPPENS';

    
    /**
     *  All event names are valid to be defined by the lib user, except all starts with $.
     *  Event name starts with & are defined by the system in case of combined event with reference and timer
     */
    export abstract class EnvironmentEvt {
        protected _name: string;
        protected _id: number;
        protected _groupName: string;
        protected _type: EnvironmentEvtType;
        protected _isRepeatable: boolean;

        protected _initialStatus: EnvironmentStatus;
        protected _status: EnvironmentStatus;
        
        protected _totalFireEvt: number;

        protected _lastExecution: Time;

        protected _callbackFunc: Function;

        protected _citedBy: { [evtName: string]: ReferencedEvt };

        // exec in the end of callback source code execution
        protected _evtsTurnOn: Array<string>;
        protected _groupsTurnOn: Array<string>;
        protected _evtsTurnOff: Array<string>;
        protected _groupsTurnOff: Array<string>;

        constructor(
            name: string,
            status: EnvironmentStatus,
            type: EnvironmentEvtType,
            repeatable: boolean,
            callback: Function,
            groupName: string,
            evtsTurnOn: Array<string>,
            groupsTurnOn: Array<string>,
            evtsTurnOff: Array<string>,
            groupsTurnOff: Array<string>
        ) {
            this._name = name;
            this._id = ++totalDefinedEvts;
            this.groupName = groupName;

            this._initialStatus = status;
            this._status = status;

            this.type = type;
            this._isRepeatable = repeatable;

            this._callbackFunc = callback;
            
            this._totalFireEvt = 0;
            this._lastExecution = null;

            this._citedBy = {}; // loads values on the definition of reference events
            
            this._evtsTurnOn = evtsTurnOn ? evtsTurnOn : new Array<string>();
            this._groupsTurnOn = groupsTurnOn ? groupsTurnOn : new Array<string>();
            this._evtsTurnOff = evtsTurnOff ? evtsTurnOff : new Array<string>();
            this._groupsTurnOff = groupsTurnOff ? groupsTurnOff : new Array<string>();
        }

        get name(): string { return this._name; }
        set name(name: string) { this._name = name; }

        get id(): number { return this._id; }
        set id(id: number) { this._id = id; }

        get groupName(): string { return this._groupName; }
        set groupName(groupName: string) { this._groupName = groupName; }

        get type(): EnvironmentEvtType { return this._type; }
        set type(type: EnvironmentEvtType) { this._type = type; }

        get isRepeatable(): boolean { return this._isRepeatable; }
        set isRepeatable(isRepeatable: boolean) { this._isRepeatable = isRepeatable; }

        typeToStr(): string { return EnvironmentEvtMap[this._type]; }

        get initialStatus(): EnvironmentStatus { return this._initialStatus; }
        set initialStatus(status: EnvironmentStatus) { this._initialStatus = status; }
        get status(): EnvironmentStatus { return this._status; }
        set status(status: EnvironmentStatus) { this._status = status; }
        
        get totalFireEvt(): number { return this._totalFireEvt; }
        set totalFireEvt(te: number) { this._totalFireEvt = te; }

        get lastExecution(): Time { return this._lastExecution; }
        set lastExecution(le: Time) { this._lastExecution = le; }

        get evtsTurnOn(): Array<string> { return this._evtsTurnOn; }
        set evtsTurnOn(evts: Array<string>) { this._evtsTurnOn = evts; }

        get groupsTurnOn(): Array<string> { return this._groupsTurnOn; }
        set groupsTurnOn(groups: Array<string>) { this._groupsTurnOn = groups; }

        get evtsTurnOff(): Array<string> { return this._evtsTurnOff; }
        set evtsTurnOff(evts: Array<string>) { this._evtsTurnOff = evts; }

        get groupsTurnOff(): Array<string> { return this._groupsTurnOff; }
        set groupsTurnOff(groups: Array<string>) { this._groupsTurnOff = groups; }

        get callback(): Function { return this._callbackFunc; }
        
        execution(): void {
            // exec the defined callback source code 
            this._callbackFunc();

            // keep data for exec
            ++this._totalFireEvt;
            this._lastExecution = new Time(Time.now());

            // notify reference events of this event that it is fired
            for (let evtName in this._citedBy) {
                this._citedBy[evtName].evtReferenceFired(this);
            }
            
        }

        /**
         * Care for activations/deactivations events and groups
         */
        protected actionsAfterExecution() {
            var group = EnvEventSys.getInstance().getGroupEnvironmentEvts(this.groupName);
            this._evtsTurnOn.forEach(function (evtName) {
                group.getEnvironmentEvt(evtName).turnEvtON();
            });
            this._evtsTurnOff.forEach(function (evtName) {
                group.getEnvironmentEvt(evtName).turnEvtOFF();
            });

            this._groupsTurnOn.forEach(function (groupName) {
                EnvEventSys.getInstance().getGroupEnvironmentEvts(groupName).turnGroupOn();
            });
            this._groupsTurnOff.forEach(function (groupName) {
                EnvEventSys.getInstance().getGroupEnvironmentEvts(groupName).turnGroupOff();
            });
        }

        protected checkStatusForRegistration() {
            if (this._status === EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError(
                    "Error: try to register EnvironmentEvt: " + this._name + " in group " + this._groupName +
                    ". EnvironmentEvts have to be active before registration in the event based system."
                );
            }
        }

        abstract registerEvtSys(): void;
        abstract unregisterEvtSys(): void;
        
        insertCitation(refEvt: ReferencedEvt) {
            this._citedBy[refEvt.name] = refEvt;
        }

        removeCitation(refEvt: ReferencedEvt) {
            var refEvtName = refEvt.name;
            if (!(refEvtName in this._citedBy)) {
                throw new RangeError(
                    "Error: try to remove citation with name: " + refEvtName +
                    " of event which not exists in the citation list of environment event " +
                    this.name
                );
            }

            delete this._citedBy[refEvtName];
        }
        
        private assertEnvEvtExistence(evtName: string, msgInfo: string) {
            if (!EnvEventSys.getInstance().containsEnvironmentEvt(this.groupName, evtName)) {
                throw new RangeError(
                    "Error: try to " + msgInfo + " not defined  event in the system, in environement group: " +
                    this.groupName + "called " + evtName + "."
                );
            }
        }
        private insertEnvEvtTurnHelper(index: string, evtName: string) {
            this.assertEnvEvtExistence(evtName, "insert for " + index);
            
            this[index].push(evtName);
        }
        insertEnvEvtTurnOn(evtName: string) { this.insertEnvEvtTurnHelper('_evtsTurnOn', evtName); }
        insertEnvEvtTurnOff(evtName: string) { this.insertEnvEvtTurnHelper('_evtsTurnOff', evtName); }

        private assertEnvGroupExistence(groupName: string, msgInfo: string) {
            if (!EnvEventSys.getInstance().containsGroupEnvironmentEvts(name)) {
                throw new RangeError("Error: try to " + msgInfo + " not defined group called " + groupName + " in the system.");
            }
        }
        private insertEnvGroupTurnHelper(index: string, groupName) {
            this.assertEnvGroupExistence(groupName, "insert for " + index);

            this[index].push(groupName);
        }
        insertEnvGroupTurnOn(groupName: string) { this.insertEnvGroupTurnHelper('_groupsTurnOn', groupName); }
        insertEnvGroupTurnOff(groupName: string) { this.insertEnvGroupTurnHelper('_groupsTurnOff', groupName); }

        private removeEnvEvtTurnHelper(index: string, evtName: string) {
            this.assertEnvEvtExistence(evtName, "remove for " + index);
            
            this[index].splice(this[index].indexOf(evtName), 1);
        }
        removeEnvEvtTurnOn(evtName: string) { this.removeEnvEvtTurnHelper('_evtsTurnOn', evtName); }
        removeEnvEvtTurnOff(evtName: string) { this.removeEnvEvtTurnHelper('_evtsTurnOff', evtName); }

        private removeEnvGroupTurnHelper(index: string, groupName: string) {
            this.assertEnvGroupExistence(groupName, "remove for " + index);
            
            this[index].splice(this[index].indexOf(groupName), 1);
        }
        removeEnvGroupTurnOn(groupName: string) { this.removeEnvEvtTurnHelper('_groupsTurnOn', groupName); }
        removeEnvGroupTurnOff(groupName: string) { this.removeEnvEvtTurnHelper('_groupsTurnOff', groupName); }
        
        // actions user can choose during runtime and/or in definition
        turnEvtON(): void {
            this._status = EnvironmentStatus.ENV_ACTIVE;
        }

        turnEvtOFF(): void {
            this._status = EnvironmentStatus.ENV_NOACTIVE;
        }
    }

    export class GroupEnvironmentEvts {
        private _name: string;
        private _events: { [eventName: string]: EnvironmentEvt };
        
        private _initialStatus: EnvironmentStatus;
        private _status: EnvironmentStatus;

        constructor(
            name: string,
            status: EnvironmentStatus = EnvironmentStatus.ENV_NOACTIVE
        ) {
            this._name = name;
            this._events = {};
            
            this._initialStatus = status;
            this._status = status;
        }

        get name(): string { return this._name; }
        set name(name: string) { this._name = name; }

        get initialStatus(): EnvironmentStatus { return this._initialStatus; }
        set initialStatus(status: EnvironmentStatus) { this._initialStatus = status; }

        get status(): EnvironmentStatus { return this._status; }
        set status(status: EnvironmentStatus) { this._status = status; }

        isActive(): boolean { return this._status === EnvironmentStatus.ENV_ACTIVE; }

        getEnvironmentEvt(name: string): EnvironmentEvt {
            if (!this.containsEnvironmentEvt(name)) {
                console.warn(
                    "Warning: try to access the Environment Event called " + name +
                    " which is not defined in the system."
                );
                return null;
            }
            return this._events[name];
        }

        containsEnvironmentEvt(name: string): boolean {
            return (name in this._events);
        }

        private checkStatusForRegistration() {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                throw new RangeError("Error: try for registration group " + this._name + " which is not active.");
            }
        }
        registerEventsSys() {
            this.checkStatusForRegistration();

            for (var eventName in this._events) {
                let envEvt: EnvironmentEvt = this._events[eventName];
                if (envEvt.initialStatus === EnvironmentStatus.ENV_ACTIVE) {
                    envEvt.registerEvtSys();
                }
            }
        }

        unregisterEventsSys() {
            for (var eventName in this._events) {
                    this._events[eventName].unregisterEvtSys();
            }

            this._status = this._initialStatus;
        }

        addEvent(evt: EnvironmentEvt) {
            this._events[evt.name] = evt;
        }

        addEvents(evts: Array<EnvironmentEvt>) {
            evts.forEach(function (evt: EnvironmentEvt) {
                this._events[evt.name] = evt;
            }, this);
        }

        removeEvent(evt: EnvironmentEvt) {
            if (this.containsEnvironmentEvt(name)) {
                throw new RangeError("Error: try to remove not existing environment evt from group events.");
            }
            
            delete this._events[evt.name];
        }

        removeEvents(evts: Array<EnvironmentEvt>) {
            evts.forEach(function (evt: EnvironmentEvt) {
                this.removeEvent(evt);
            }, this);
        }

        turnGroupOn(): void {
            this._status = EnvironmentStatus.ENV_ACTIVE;

            for (var eventName in this._events) {
                let envEvt: EnvironmentEvt = this._events[eventName];
                if (envEvt.initialStatus === EnvironmentStatus.ENV_ACTIVE) {
                    envEvt.turnEvtON();
                }
            }
        }

        turnGroupOff(): void {
            this._status = EnvironmentStatus.ENV_NOACTIVE;

            for (var eventName in this._events) {
                let envEvt: EnvironmentEvt = this._events[eventName];
                envEvt.turnEvtOFF();
            }
        }
    }
    
}
