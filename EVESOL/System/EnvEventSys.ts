module EVENTSOL {

    export class EnvEventSys {
        private static _inst: EnvEventSys = new EnvEventSys();

        private _status: EnvironmentStatus;
        private _groupsOfEnvEvents: { [eventsName: string]: GroupEnvironmentEvts };

        constructor() {
            if (EnvEventSys._inst) {
                throw new RangeError("Error: Instantiation failed: Use EnvEventSys.getInstance() instead of new.");
            }

            this._groupsOfEnvEvents = {};
            this._status = EnvironmentStatus.ENV_NOACTIVE;

            EnvEventSys._inst = this;
            return EnvEventSys._inst;
        }

        public static getInstance(): EnvEventSys {
            return EnvEventSys._inst;
        }

        getGroupEnvironmentEvts(groupName: string): GroupEnvironmentEvts {
            if (!(groupName in this._groupsOfEnvEvents)) {
                return null;
            }
            return this._groupsOfEnvEvents[groupName];
        }

        getEnvironmentEvt(groupName: string, evtName: string): EnvironmentEvt {
            var group: GroupEnvironmentEvts = this.getGroupEnvironmentEvts(groupName);
            if (group === null) {
                console.warn(
                    "Warning: Try to access the Environment Event called " + evtName +
                    " for not defined environment group called " + groupName + " in the system."
                );
                return null;
            }

            return group.getEnvironmentEvt(evtName);
        }

        containsGroupEnvironmentEvts(groupName: string) {
            return (groupName in this._groupsOfEnvEvents);
        }

        containsEnvironmentEvt(groupName: string, evtName: string, sysUse: boolean =true): boolean {
            var group: GroupEnvironmentEvts = this.getGroupEnvironmentEvts(groupName);
            if (group === null) {
                if (sysUse) {
                    console.warn(
                        "Warning: try to check existence of the Environment Event called " + evtName +
                        " for not defined environment group called " + groupName + " in the system."
                    );
                }
                return null;
            }
            
            return group.containsEnvironmentEvt(evtName);
        }


        
        private removeGroupEnvEvents(name): boolean {
            if (name in this._groupsOfEnvEvents) {
                delete this._groupsOfEnvEvents[name];
                return true;
            }

            return false;
        }

        private checkValidRefsOFEnvironmentEvts() {
            
        }
        private addEnvironmentEvt(envEvt: EnvironmentEvt) {
            var containsEnvEvt = this.containsEnvironmentEvt(envEvt.groupName, envEvt.name, false);
            if (containsEnvEvt === true) {
                console.warn("Warning: Already defined Environment Evt with name " + envEvt.name + " in group " + envEvt.groupName);
                return;
            }
            if (containsEnvEvt === null) {
                console.error(
                    "Error: try to insert Environment Event with name " + envEvt.name +
                    " in not existing events group called " + envEvt.groupName + "."
                );
            }
            
            this._groupsOfEnvEvents[envEvt.groupName].addEvent(envEvt);
        }

        private addEnvironmentGroup(group: GroupEnvironmentEvts) {
            if (group.name in this._groupsOfEnvEvents) {
                console.warn("Warning: Group with name " + group.name + " is already defined in the Event System.");
                return;
            }

            this._groupsOfEnvEvents[group.name] = group;
        }

        /**
         *  Start Event System Clock based on the initial values of the environment evts
         */
        public static start(): void {
            if (EnvEventSys.getInstance()._status !== EnvironmentStatus.ENV_NOACTIVE) {
                console.warn("Warning: Event System has not been deactivated to start it.");
                return;
            }

            EnvEventSys.getInstance()._status = EnvironmentStatus.ENV_ACTIVE;
            for (var key in EnvEventSys.getInstance()._groupsOfEnvEvents) {
                if (EnvEventSys.getInstance()._groupsOfEnvEvents[key].initialStatus === EnvironmentStatus.ENV_ACTIVE) {
                    EnvEventSys.getInstance()._groupsOfEnvEvents[key].registerEventsSys();
                }
            }
            TimerSys.getInstance().start();
        }

        /**
         *  Stops Event System Clock and reset all status based on the initial status of the defined Environment
         */
        stop(): void {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                console.warn("Warning: Event System is not active to stop it.");
                return;
            }
            
            this._status = EnvironmentStatus.ENV_NOACTIVE;
            for (var key in this._groupsOfEnvEvents) {
                this._groupsOfEnvEvents[key].unregisterEventsSys();
            }

            // only turns off timer flag, above unregistration has clear all registered action in TimerSys
            TimerSys.getInstance().stop();
        }

        /**
         *  Stop only event system clock, can be used in order to set extra groups (active), environment evts (active)
         *  or alternatively add groups and environment evts. This help TimerSys do better grouping of them and system
         *  runs more effectively.
         *  In addition, it could be useful to do other actions the system programmers develop.
         */
        pause(): void {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                console.warn("Warning: Event System is not active to pause it.");
                return;
            }
            
            this._status = EnvironmentStatus.ENV_PAUSE;
            TimerSys.getInstance().stop();
        }

        /**
         *  Continue Event System Clock
         */
        continue(): void {
            if (this._status !== EnvironmentStatus.ENV_PAUSE) {
                console.warn("Warning: Event System can not continue, it is not in pause state.");
            }

            this._status = EnvironmentStatus.ENV_ACTIVE;
            TimerSys.getInstance().start();
        }

        ////  Functions to handle groups of environment events
        
        // starts groups of evts (in case are not already started)
        // 1. stops TimerSys (in case it runs)
        // 2. loads extra actions of the evtGroups
        // 3. starts TimerSys

        private assertEnvGroupExistence(groupName: string) {
            if (!(groupName in this._groupsOfEnvEvents)) {
                throw new RangeError("Error: try to start events GroupEnvironmentEvts called " + groupName + " does not exist.");
            }
        }

        startEvtGroups(evtGroups: Array<string>) {
            TimerSys.getInstance().stop();

            for (var groupName in evtGroups) {
                this.assertEnvGroupExistence(groupName);

                if (!this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOn();
                }
            }
            
            TimerSys.getInstance().start();
        }

        // Could be replaced by call function startEvtGroups, however this costs assertion check...
        startTotalEvtGroups() {
            TimerSys.getInstance().stop();
            
            for (var evtGroupName in this._groupsOfEnvEvents) {
                if (!this._groupsOfEnvEvents[evtGroupName].isActive()) {
                    this._groupsOfEnvEvents[evtGroupName].turnGroupOn();
                }
            }
            
            TimerSys.getInstance().start();
        }

        stopEvtGroups(evtGroups: Array<string>) {
            for (var groupName in evtGroups) {
                this.assertEnvGroupExistence(groupName);

                if (this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOff();
                }
            }
        }

        // Could be replaced by call function stopEvtGroups, however this costs assertion check...
        stopTotalEvtGroups() {
            for (var groupName in this._groupsOfEnvEvents) {
                if (this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOff();
                }
            }
        }

        /**
         *
         * static functions exported used for EnvironmentEvts and groups
         *
         **/

        public static CreateGroup(name: string, active: boolean=true) {
            var group: GroupEnvironmentEvts = new GroupEnvironmentEvts(name, active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE);
            EnvEventSys.getInstance().addEnvironmentGroup(group);
        }

        public static CreateGroups(groups: {[name:string]: boolean}) {
            for (var groupName in groups) {
                EnvEventSys.CreateGroup(groupName, groups[groupName]);
            }
        }

        /**
         *  Environment Events (Repeatable): EVERY, EVERY_FOR and EVERY_WHILE
         */

        public static CreateEventEvery(
            name: string,
            groupName: string,
            active: boolean,
            callback: Function,
            freqTime: number | Time
        ) {
            var evtActions = new Array();
            evtActions.push(new TimerAction(typeof freqTime === 'number' ? new Time(freqTime) : freqTime, true));
            
            var timerEvt: TimerEvt = new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.EVERY,
                true,
                callback,
                evtActions,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        }

        public static CreateEventEveryFor(
            name: string,
            groupName: string,
            active: boolean,
            callback: Function,
            freqTime: number | Time,
            time: number | Time
        ) {
            var evtActions = new Array();
            evtActions.push(
                new TimerActionExpiresSpecificTime(
                    typeof freqTime === 'number' ? new Time(freqTime) : freqTime,
                    typeof time === 'number' ? new Time(time) : time
                )
            );

            var timerEvt: TimerEvt = new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.EVERY_FOR,
                true,
                callback,
                evtActions,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        }

        public static CreateEventEveryWhile(
            name: string,
            groupName: string,
            active: boolean,
            callback: Function,
            freqTime: number | Time,
            condition: Function
        ) {
            var evtActions = new Array();
            evtActions.push(new TimerActionCondition(typeof freqTime === 'number' ? new Time(freqTime) : freqTime, condition));

            var timerEvt: TimerEvt = new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.EVERY_WHILE,
                true,
                callback,
                evtActions,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        }

        /**
         *  Environment Events (Not repeatable): ON, AFTER
         */
        
        public static CreateEventOn(
            name: string,
            groupName: string,
            active: boolean,
            callback: Function,
            time: number | Time
        ) {
            var evtActions = new Array();
            evtActions.push(new TimerActionSpecificTime(typeof time === 'number' ? new Time(time) : time));

            var timerEvt: TimerEvt = new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.ΟΝ,
                false,
                callback,
                evtActions,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        }

        public static CreateEventAfter(
            name: string,
            groupName: string,
            active: boolean,
            callback: Function,
            time: number | Time
        ) {
            var evtActions = new Array();
            evtActions.push(new TimerAction(typeof time === 'number' ? new Time(time) : time, false));

            var timerEvt: TimerEvt = new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.AFTER,
                false,
                callback,
                evtActions,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        }

        /**
         *  Environment Events (When_Condition):
         *      WHEN_CONDITION, WHEN_CONDITION_FOR, WHEN_CONDITION_HAPPENS, WHEN_CONDITION_EVERY,
         *      WHEN_CONDITION_EVERY_FOR, WHEN_CONDITION_EVERY_WHILE, WHEN_CONDITION_WAIT,
         *      WHEN_CONDITION_WAIT_EVERY, WHEN_CONDITION_WAIT_EVERY_FOR, WHEN_CONDITION_WAIT_EVERY_WHILE
         */

        private static CreateNewEventWhenCondition(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            freqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(new EvtCondition(typeof freqTime === 'number' ? new Time(freqTime) : freqTime, condition));

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION,
                false,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhen(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            freqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenCondition(name, groupName, active, condition, callback, freqTime)
            );
        }

        private static CreateNewEventWhenConditionHappensFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            time: number | Time,
            freqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtConditionTimer(
                    typeof freqTime === 'number' ? new Time(freqTime) : freqTime,
                    condition,
                    typeof time === 'number' ? new Time(time) : time
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_FOR,
                false,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenConditionHappensFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            time: number | Time,
            freqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenConditionHappensFor(name, groupName, active, condition, callback, time, freqTime)
            );
        }

        private static CreateNewEventWhenConditionHappensTimes(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            times: number,
            freqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtConditionTimesHappens(
                    typeof freqTime === 'number' ? new Time(freqTime) : freqTime,
                    condition,
                    times
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_HAPPENS,
                false,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenConditionHappensTimes(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            times: number,
            freqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenConditionHappensTimes(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    times,
                    freqTime
                )
            );
        }

        private static CreateNewEventWhenConditionEvery(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    true
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_EVERY,
                true,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenEvery(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenConditionEvery(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    everyTime,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenEveryFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            specificTime: number | Time,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerActionExpiresSpecificTime(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    typeof specificTime === 'number' ? new Time(specificTime) : specificTime
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_EVERY_FOR,
                true,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenEveryFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            specificTime: number | Time,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenEveryFor(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    everyTime,
                    specificTime,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenEveryWhile(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            everyCondition: Function,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerActionCondition(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    everyCondition
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_EVERY_WHILE,
                true,
                callback,
                evtActions,
                groupName
            );
        }
        
        public static CreateEventWhenEveryWhile(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            everyTime: number | Time,
            everyCondition: Function,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenEveryWhile(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    everyTime,
                    everyCondition,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenWait(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof waitTime === 'number' ? new Time(waitTime) : waitTime,
                    false
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_WAIT,
                false,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenWait(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenWait(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    waitTime,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenWaitEvery(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof waitTime === 'number' ? new Time(waitTime) : waitTime,
                    false
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    true
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY,
                true,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenWaitEvery(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenWaitEvery(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    waitTime,
                    everyTime,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenWaitEveryFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            everySpecificTime: number | Time,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof waitTime === 'number' ? new Time(waitTime) : waitTime,
                    false
                )
            );
            evtActions.push(
                new TimerActionExpiresSpecificTime(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    typeof everySpecificTime === 'number' ? new Time(everySpecificTime) : everySpecificTime
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_FOR,
                true,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenWaitEveryFor(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            everySpecificTime: number | Time,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenWaitEveryFor(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    waitTime,
                    everyTime,
                    everySpecificTime,
                    condfreqTime
                )
            );
        }

        private static CreateNewEventWhenWaitEveryWhile(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            everyCondition: Function,
            condfreqTime: number | Time
        ): TimerEvt {
            var evtActions = new Array();
            evtActions.push(
                new EvtCondition(
                    typeof condfreqTime === 'number' ? new Time(condfreqTime) : condfreqTime,
                    condition
                )
            );
            evtActions.push(
                new TimerAction(
                    typeof waitTime === 'number' ? new Time(waitTime) : waitTime,
                    false
                )
            );
            evtActions.push(
                new TimerActionCondition(
                    typeof everyTime === 'number' ? new Time(everyTime) : everyTime,
                    everyCondition
                )
            );

            return new TimerEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_WHILE,
                true,
                callback,
                evtActions,
                groupName
            );
        }

        public static CreateEventWhenWaitEveryWhile(
            name: string,
            groupName: string,
            active: boolean,
            condition: Function,
            callback: Function,
            waitTime: number | Time,
            everyTime: number | Time,
            everyCondition: Function,
            condfreqTime: number | Time = Time.DefaultCondTime
        ) {
            EnvEventSys.getInstance().addEnvironmentEvt(
                EnvEventSys.CreateNewEventWhenWaitEveryWhile(
                    name,
                    groupName,
                    active,
                    condition,
                    callback,
                    waitTime,
                    everyTime,
                    everyCondition,
                    condfreqTime
                )
            );
        }

        /**
         * Create references for EnvironmentEvents:
         *      IReferenceSimple, IReferencesTotalHappens, IReferencesOneOrMoreHappens
         */

        public static CreateReferenceSimple(evtName: string, times: number, operator: OperatorTypeTimes): IReferenceLeaf {
            if (times <= 0) {
                console.error("Error: Negative defined value of times to happens referenced event with name " + evtName + ".");
                return null;
            }

            return {
                'type': ReferenceType.Leaf,
                'eventName': evtName,
                'timesHappens': times,
                'leafType': operator
            };
        }

        public static CreateReferencesTotalHappens(references: Array<IReference>): IReferencesTotalHappens {
            return {
                'type': ReferenceType.TotalHappens,
                'references': references
            };
        }

        public static CreateReferencesOneOrMoreHappens(references: Array<IReference>): IReferencesOneOrMoreHappens {
            return {
                'type': ReferenceType.OneOrMoreHappens,
                'references': references
            };
        }

        /**
         *  Environment Events (Referenced Events):
         *      WHEN_REFERENCE, WHEN_REFERENCE_HAPPENS
         */
         
        public static CreateEventWhenReference(
            name: string,
            groupName: string,
            active: boolean,
            reference: IReference,
            callback: Function
        ) {
            var referencedEvt: ReferencedEvt = new ReferencedEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_REFERENCE,
                false,
                callback,
                reference,
                groupName
            );

            EnvEventSys.getInstance().addEnvironmentEvt(referencedEvt);
        }

        public static CreateEventWhenReferenceHappens(
            name: string,
            groupName: string,
            active: boolean,
            reference: IReference,
            callback: Function,
            times: number
        ) {
            var referencedEvt: ReferencedEvt = new ReferencedEvt(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_REFERENCE_HAPPENS,
                false,
                callback,
                reference,
                groupName,
                times
            );

            EnvEventSys.getInstance().addEnvironmentEvt(referencedEvt);
        }

        public static CreateEventWhenReferenceFor(
            name: string,
            groupName: string,
            active: boolean,
            reference: IReference,
            callback: Function,
            periodConditionIsTrue: Time
        ) {
            var referencedEvt: ReferencedEvt = new ReferencedEvtTimer(
                name,
                active ? EnvironmentStatus.ENV_ACTIVE : EnvironmentStatus.ENV_NOACTIVE,
                EnvironmentEvtType.WHEN_REFERENCE_FOR,
                false,
                callback,
                reference,
                groupName,
                periodConditionIsTrue
            );

            EnvEventSys.getInstance().addEnvironmentEvt(referencedEvt);
        }

        /**
         *  Start: Helper methods for insertion of the turn ON/OFF events / groups in the end of fired event source code execution  
         */
        
        private static addValidEventsForNotSelfReference(envEvt: EnvironmentEvt, events: Array<string>, turnType: string) {
            events.forEach(function (evtName) {
                if (!EnvEventSys.getInstance().containsEnvironmentEvt(envEvt.groupName, evtName)) {
                    console.warn("Warning: EnvironmentEvt " + evtName + " is not defined in group " + envEvt.groupName + ".");
                }
                else if (evtName === envEvt.name) {
                    console.warn("Warning: Cannot Self " + turnType + " of " + envEvt.typeToStr() + "called " + evtName + ".");
                }
                else {
                    envEvt['insertEnvEvt' + turnType](evtName);
                }
            });
        }

        private static addValidEventsForSelfReference(envEvt: EnvironmentEvt, events: Array<string>, turnType: string) {
            events.forEach(function (evtName) {
                if (!EnvEventSys.getInstance().containsEnvironmentEvt(envEvt.groupName, evtName)) {
                    console.warn("Warning: EnvironmentEvt " + evtName + " is not defined in group " + envEvt.groupName + ".");
                }
                else {
                    envEvt['insertEnvEvt' + turnType](evtName);
                }
            });
        }
        
        private static addValidGroupsForNotSelfReference(envEvt: EnvironmentEvt, groups: Array<string>, turnType: string) {
            groups.forEach(function (groupName) {
                if (!EnvEventSys.getInstance().containsGroupEnvironmentEvts(groupName)) {
                    console.warn("Warning: EnvironmentGroup " + groupName + " is not defined in the event system.");
                }
                else if (groupName === envEvt.groupName) {
                    console.warn("Warning: Cannot Self " + turnType + " group called " + groupName + ".");
                }
                else {
                    envEvt['insertEnvGroup' + turnType](groupName);
                }
            });
        }

        private static addValidGroupsForSelfReference(envEvt: EnvironmentEvt, groups: Array<string>, turnType: string) {
            groups.forEach(function (groupName) {
                if (!EnvEventSys.getInstance().containsEnvironmentEvt(envEvt.groupName, groupName)) {
                    console.warn("Warning: EnvironmentGroup " + groupName + " is not defined in the event system.");
                }
                else {
                    envEvt['insertEnvGroup' + turnType](groupName);
                }
            });
        }


        /**
         *  Functions are provided to the user in order to add the Turn ON/OFF environments events/groups in the end of the fired source code execution
         */
        
        public static SetEventsTurnOnFromEnvironmentEvent(evtName: string, groupName, events: Array<string>) {
            var envEvt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);

            if (envEvt !== null) {
                if (envEvt.isRepeatable) {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOn');
                }
                else {
                    EnvEventSys.addValidEventsForSelfReference(envEvt, events, 'TurnOn');
                }
            }
        }

        public static SetEventsTurnOffFromEnvironmentEvent(evtName: string, groupName, events: Array<string>) {
            var envEvt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);

            if (envEvt !== null) {
                if (envEvt.isRepeatable) {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOff');
                }
                else {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOff');
                }
            }
        }

        public static SetGroupsTurnOnFromEnvironmentEvent(evtName: string, groupName, groups: Array<string>) {
            var envEvt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);

            if (envEvt !== null) {
                // already active ==> event of the group fired
                EnvEventSys.addValidGroupsForNotSelfReference(envEvt, groups, 'TurnOn');
            }
        }

        public static SetGroupsTurnOffFromEnvironmentEvent(evtName: string, groupName, groups: Array<string>) {
            var envEvt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);

            if (envEvt !== null) {
                // event can deactivate total group of the events
                EnvEventSys.addValidGroupsForSelfReference(envEvt, groups, 'TurnOff');
            }
        }

        public static TurnOnEvent(evtName: string, groupName: string) {
            var evt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            evt.turnEvtON();
        }

        public static TurnOffEvent(evtName: string, groupName: string) {
            var evt: EnvironmentEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            evt.turnEvtOFF();
        }
        
        public static TurnOnGroup(groupName: string) {
            var group: GroupEnvironmentEvts = EnvEventSys.getInstance().getGroupEnvironmentEvts(groupName);
            group.turnGroupOn();
        }

        public static TurnOffGroup(groupName: string) {
            var group: GroupEnvironmentEvts = EnvEventSys.getInstance().getGroupEnvironmentEvts(groupName);
            group.turnGroupOff();
        }
        
    }

}
