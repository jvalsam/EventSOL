declare module EVENTSOL {
    var totalDefinedEvts: number;
    enum EnvironmentStatus {
        ENV_ACTIVE = 0,
        ENV_NOACTIVE = 1,
        ENV_PAUSE = 2,
    }
    enum EnvironmentEvtType {
        EVERY = 0,
        EVERY_FOR = 1,
        EVERY_WHILE = 2,
        ΟΝ = 3,
        AFTER = 4,
        WHEN_CONDITION = 5,
        WHEN_CONDITION_FOR = 6,
        WHEN_CONDITION_HAPPENS = 7,
        WHEN_CONDITION_EVERY = 8,
        WHEN_CONDITION_EVERY_FOR = 9,
        WHEN_CONDITION_EVERY_WHILE = 10,
        WHEN_CONDITION_WAIT = 11,
        WHEN_CONDITION_WAIT_EVERY = 12,
        WHEN_CONDITION_WAIT_EVERY_FOR = 13,
        WHEN_CONDITION_WAIT_EVERY_WHILE = 14,
        WHEN_REFERENCE = 15,
        WHEN_REFERENCE_HAPPENS = 16,
        WHEN_REFERENCE_FOR = 17,
    }
    /**
     *  All event names are valid to be defined by the lib user, except all starts with $.
     *  Event name starts with & are defined by the system in case of combined event with reference and timer
     */
    abstract class EnvironmentEvt {
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
        protected _citedBy: {
            [evtName: string]: ReferencedEvt;
        };
        protected _evtsTurnOn: Array<string>;
        protected _groupsTurnOn: Array<string>;
        protected _evtsTurnOff: Array<string>;
        protected _groupsTurnOff: Array<string>;
        constructor(name: string, status: EnvironmentStatus, type: EnvironmentEvtType, repeatable: boolean, callback: Function, groupName: string, evtsTurnOn: Array<string>, groupsTurnOn: Array<string>, evtsTurnOff: Array<string>, groupsTurnOff: Array<string>);
        name: string;
        id: number;
        groupName: string;
        type: EnvironmentEvtType;
        isRepeatable: boolean;
        typeToStr(): string;
        initialStatus: EnvironmentStatus;
        status: EnvironmentStatus;
        totalFireEvt: number;
        lastExecution: Time;
        evtsTurnOn: Array<string>;
        groupsTurnOn: Array<string>;
        evtsTurnOff: Array<string>;
        groupsTurnOff: Array<string>;
        callback: Function;
        execution(): void;
        /**
         * Care for activations/deactivations events and groups
         */
        protected actionsAfterExecution(): void;
        protected checkStatusForRegistration(): void;
        abstract registerEvtSys(): void;
        abstract unregisterEvtSys(): void;
        insertCitation(refEvt: ReferencedEvt): void;
        removeCitation(refEvt: ReferencedEvt): void;
        private assertEnvEvtExistence(evtName, msgInfo);
        private insertEnvEvtTurnHelper(index, evtName);
        insertEnvEvtTurnOn(evtName: string): void;
        insertEnvEvtTurnOff(evtName: string): void;
        private assertEnvGroupExistence(groupName, msgInfo);
        private insertEnvGroupTurnHelper(index, groupName);
        insertEnvGroupTurnOn(groupName: string): void;
        insertEnvGroupTurnOff(groupName: string): void;
        private removeEnvEvtTurnHelper(index, evtName);
        removeEnvEvtTurnOn(evtName: string): void;
        removeEnvEvtTurnOff(evtName: string): void;
        private removeEnvGroupTurnHelper(index, groupName);
        removeEnvGroupTurnOn(groupName: string): void;
        removeEnvGroupTurnOff(groupName: string): void;
        turnEvtON(): void;
        turnEvtOFF(): void;
    }
    class GroupEnvironmentEvts {
        private _name;
        private _events;
        private _initialStatus;
        private _status;
        constructor(name: string, status?: EnvironmentStatus);
        name: string;
        initialStatus: EnvironmentStatus;
        status: EnvironmentStatus;
        isActive(): boolean;
        getEnvironmentEvt(name: string): EnvironmentEvt;
        containsEnvironmentEvt(name: string): boolean;
        private checkStatusForRegistration();
        registerEventsSys(): void;
        unregisterEventsSys(): void;
        addEvent(evt: EnvironmentEvt): void;
        addEvents(evts: Array<EnvironmentEvt>): void;
        removeEvent(evt: EnvironmentEvt): void;
        removeEvents(evts: Array<EnvironmentEvt>): void;
        turnGroupOn(): void;
        turnGroupOff(): void;
    }
}
