declare module EVENTSOL {
    class EnvEventSys {
        private static _inst;
        private _status;
        private _groupsOfEnvEvents;
        constructor();
        static getInstance(): EnvEventSys;
        getGroupEnvironmentEvts(groupName: string): GroupEnvironmentEvts;
        getEnvironmentEvt(groupName: string, evtName: string): EnvironmentEvt;
        containsGroupEnvironmentEvts(groupName: string): boolean;
        containsEnvironmentEvt(groupName: string, evtName: string, sysUse?: boolean): boolean;
        private removeGroupEnvEvents(name);
        private checkValidRefsOFEnvironmentEvts();
        private addEnvironmentEvt(envEvt);
        private addEnvironmentGroup(group);
        /**
         *  Start Event System Clock based on the initial values of the environment evts
         */
        static start(): void;
        /**
         *  Stops Event System Clock and reset all status based on the initial status of the defined Environment
         */
        stop(): void;
        /**
         *  Stop only event system clock, can be used in order to set extra groups (active), environment evts (active)
         *  or alternatively add groups and environment evts. This help TimerSys do better grouping of them and system
         *  runs more effectively.
         *  In addition, it could be useful to do other actions the system programmers develop.
         */
        pause(): void;
        /**
         *  Continue Event System Clock
         */
        continue(): void;
        private assertEnvGroupExistence(groupName);
        startEvtGroups(evtGroups: Array<string>): void;
        startTotalEvtGroups(): void;
        stopEvtGroups(evtGroups: Array<string>): void;
        stopTotalEvtGroups(): void;
        /**
         *
         * static functions exported used for EnvironmentEvts and groups
         *
         **/
        static CreateGroup(name: string, active?: boolean): void;
        static CreateGroups(groups: {
            [name: string]: boolean;
        }): void;
        /**
         *  Environment Events (Repeatable): EVERY, EVERY_FOR and EVERY_WHILE
         */
        static CreateEventEvery(name: string, groupName: string, active: boolean, callback: Function, freqTime: number | Time): void;
        static CreateEventEveryFor(name: string, groupName: string, active: boolean, callback: Function, freqTime: number | Time, time: number | Time): void;
        static CreateEventEveryWhile(name: string, groupName: string, active: boolean, callback: Function, freqTime: number | Time, condition: Function): void;
        /**
         *  Environment Events (Not repeatable): ON, AFTER
         */
        static CreateEventOn(name: string, groupName: string, active: boolean, callback: Function, time: number | Time): void;
        static CreateEventAfter(name: string, groupName: string, active: boolean, callback: Function, time: number | Time): void;
        /**
         *  Environment Events (When_Condition):
         *      WHEN_CONDITION, WHEN_CONDITION_FOR, WHEN_CONDITION_HAPPENS, WHEN_CONDITION_EVERY,
         *      WHEN_CONDITION_EVERY_FOR, WHEN_CONDITION_EVERY_WHILE, WHEN_CONDITION_WAIT,
         *      WHEN_CONDITION_WAIT_EVERY, WHEN_CONDITION_WAIT_EVERY_FOR, WHEN_CONDITION_WAIT_EVERY_WHILE
         */
        private static CreateNewEventWhenCondition(name, groupName, active, condition, callback, freqTime);
        static CreateEventWhen(name: string, groupName: string, active: boolean, condition: Function, callback: Function, freqTime?: number | Time): void;
        private static CreateNewEventWhenConditionHappensFor(name, groupName, active, condition, callback, time, freqTime);
        static CreateEventWhenConditionHappensFor(name: string, groupName: string, active: boolean, condition: Function, callback: Function, time: number | Time, freqTime?: number | Time): void;
        private static CreateNewEventWhenConditionHappensTimes(name, groupName, active, condition, callback, times, freqTime);
        static CreateEventWhenConditionHappensTimes(name: string, groupName: string, active: boolean, condition: Function, callback: Function, times: number, freqTime?: number | Time): void;
        private static CreateNewEventWhenConditionEvery(name, groupName, active, condition, callback, everyTime, condfreqTime);
        static CreateEventWhenEvery(name: string, groupName: string, active: boolean, condition: Function, callback: Function, everyTime: number | Time, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenEveryFor(name, groupName, active, condition, callback, everyTime, specificTime, condfreqTime);
        static CreateEventWhenEveryFor(name: string, groupName: string, active: boolean, condition: Function, callback: Function, everyTime: number | Time, specificTime: number | Time, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenEveryWhile(name, groupName, active, condition, callback, everyTime, everyCondition, condfreqTime);
        static CreateEventWhenEveryWhile(name: string, groupName: string, active: boolean, condition: Function, callback: Function, everyTime: number | Time, everyCondition: Function, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenWait(name, groupName, active, condition, callback, waitTime, condfreqTime);
        static CreateEventWhenWait(name: string, groupName: string, active: boolean, condition: Function, callback: Function, waitTime: number | Time, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenWaitEvery(name, groupName, active, condition, callback, waitTime, everyTime, condfreqTime);
        static CreateEventWhenWaitEvery(name: string, groupName: string, active: boolean, condition: Function, callback: Function, waitTime: number | Time, everyTime: number | Time, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenWaitEveryFor(name, groupName, active, condition, callback, waitTime, everyTime, everySpecificTime, condfreqTime);
        static CreateEventWhenWaitEveryFor(name: string, groupName: string, active: boolean, condition: Function, callback: Function, waitTime: number | Time, everyTime: number | Time, everySpecificTime: number | Time, condfreqTime?: number | Time): void;
        private static CreateNewEventWhenWaitEveryWhile(name, groupName, active, condition, callback, waitTime, everyTime, everyCondition, condfreqTime);
        static CreateEventWhenWaitEveryWhile(name: string, groupName: string, active: boolean, condition: Function, callback: Function, waitTime: number | Time, everyTime: number | Time, everyCondition: Function, condfreqTime?: number | Time): void;
        /**
         * Create references for EnvironmentEvents:
         *      IReferenceSimple, IReferencesTotalHappens, IReferencesOneOrMoreHappens
         */
        static CreateReferenceSimple(evtName: string, times: number, operator: OperatorTypeTimes): IReferenceLeaf;
        static CreateReferencesTotalHappens(references: Array<IReference>): IReferencesTotalHappens;
        static CreateReferencesOneOrMoreHappens(references: Array<IReference>): IReferencesOneOrMoreHappens;
        /**
         *  Environment Events (Referenced Events):
         *      WHEN_REFERENCE, WHEN_REFERENCE_HAPPENS
         */
        static CreateEventWhenReference(name: string, groupName: string, active: boolean, reference: IReference, callback: Function): void;
        static CreateEventWhenReferenceHappens(name: string, groupName: string, active: boolean, reference: IReference, callback: Function, times: number): void;
        static CreateEventWhenReferenceFor(name: string, groupName: string, active: boolean, reference: IReference, callback: Function, periodConditionIsTrue: Time): void;
        /**
         *  Start: Helper methods for insertion of the turn ON/OFF events / groups in the end of fired event source code execution
         */
        private static addValidEventsForNotSelfReference(envEvt, events, turnType);
        private static addValidEventsForSelfReference(envEvt, events, turnType);
        private static addValidGroupsForNotSelfReference(envEvt, groups, turnType);
        private static addValidGroupsForSelfReference(envEvt, groups, turnType);
        /**
         *  Functions are provided to the user in order to add the Turn ON/OFF environments events/groups in the end of the fired source code execution
         */
        static SetEventsTurnOnFromEnvironmentEvent(evtName: string, groupName: any, events: Array<string>): void;
        static SetEventsTurnOffFromEnvironmentEvent(evtName: string, groupName: any, events: Array<string>): void;
        static SetGroupsTurnOnFromEnvironmentEvent(evtName: string, groupName: any, groups: Array<string>): void;
        static SetGroupsTurnOffFromEnvironmentEvent(evtName: string, groupName: any, groups: Array<string>): void;
        static TurnOnEvent(evtName: string, groupName: string): void;
        static TurnOffEvent(evtName: string, groupName: string): void;
        static TurnOnGroup(groupName: string): void;
        static TurnOffGroup(groupName: string): void;
    }
}
