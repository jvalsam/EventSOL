var EVENTSOL;
(function (EVENTSOL) {
    var EnvEventSys = (function () {
        function EnvEventSys() {
            if (EnvEventSys._inst) {
                throw new RangeError("Error: Instantiation failed: Use EnvEventSys.getInstance() instead of new.");
            }
            this._groupsOfEnvEvents = {};
            this._status = EVENTSOL.EnvironmentStatus.ENV_NOACTIVE;
            EnvEventSys._inst = this;
            return EnvEventSys._inst;
        }
        EnvEventSys.getInstance = function () {
            return EnvEventSys._inst;
        };
        EnvEventSys.prototype.getGroupEnvironmentEvts = function (groupName) {
            if (!(groupName in this._groupsOfEnvEvents)) {
                return null;
            }
            return this._groupsOfEnvEvents[groupName];
        };
        EnvEventSys.prototype.getEnvironmentEvt = function (groupName, evtName) {
            var group = this.getGroupEnvironmentEvts(groupName);
            if (group === null) {
                console.warn("Warning: Try to access the Environment Event called " + evtName +
                    " for not defined environment group called " + groupName + " in the system.");
                return null;
            }
            return group.getEnvironmentEvt(evtName);
        };
        EnvEventSys.prototype.containsGroupEnvironmentEvts = function (groupName) {
            return (groupName in this._groupsOfEnvEvents);
        };
        EnvEventSys.prototype.containsEnvironmentEvt = function (groupName, evtName, sysUse) {
            if (sysUse === void 0) { sysUse = true; }
            var group = this.getGroupEnvironmentEvts(groupName);
            if (group === null) {
                if (sysUse) {
                    console.warn("Warning: try to check existence of the Environment Event called " + evtName +
                        " for not defined environment group called " + groupName + " in the system.");
                }
                return null;
            }
            return group.containsEnvironmentEvt(evtName);
        };
        EnvEventSys.prototype.removeGroupEnvEvents = function (name) {
            if (name in this._groupsOfEnvEvents) {
                delete this._groupsOfEnvEvents[name];
                return true;
            }
            return false;
        };
        EnvEventSys.prototype.checkValidRefsOFEnvironmentEvts = function () {
        };
        EnvEventSys.prototype.addEnvironmentEvt = function (envEvt) {
            var containsEnvEvt = this.containsEnvironmentEvt(envEvt.groupName, envEvt.name, false);
            if (containsEnvEvt === true) {
                console.warn("Warning: Already defined Environment Evt with name " + envEvt.name + " in group " + envEvt.groupName);
                return;
            }
            if (containsEnvEvt === null) {
                console.error("Error: try to insert Environment Event with name " + envEvt.name +
                    " in not existing events group called " + envEvt.groupName + ".");
            }
            this._groupsOfEnvEvents[envEvt.groupName].addEvent(envEvt);
        };
        EnvEventSys.prototype.addEnvironmentGroup = function (group) {
            if (group.name in this._groupsOfEnvEvents) {
                console.warn("Warning: Group with name " + group.name + " is already defined in the Event System.");
                return;
            }
            this._groupsOfEnvEvents[group.name] = group;
        };
        /**
         *  Start Event System Clock based on the initial values of the environment evts
         */
        EnvEventSys.start = function () {
            if (EnvEventSys.getInstance()._status !== EVENTSOL.EnvironmentStatus.ENV_NOACTIVE) {
                console.warn("Warning: Event System has not been deactivated to start it.");
                return;
            }
            EnvEventSys.getInstance()._status = EVENTSOL.EnvironmentStatus.ENV_ACTIVE;
            for (var key in EnvEventSys.getInstance()._groupsOfEnvEvents) {
                if (EnvEventSys.getInstance()._groupsOfEnvEvents[key].initialStatus === EVENTSOL.EnvironmentStatus.ENV_ACTIVE) {
                    EnvEventSys.getInstance()._groupsOfEnvEvents[key].registerEventsSys();
                }
            }
            EVENTSOL.TimerSys.getInstance().start();
        };
        /**
         *  Stops Event System Clock and reset all status based on the initial status of the defined Environment
         */
        EnvEventSys.prototype.stop = function () {
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_ACTIVE) {
                console.warn("Warning: Event System is not active to stop it.");
                return;
            }
            this._status = EVENTSOL.EnvironmentStatus.ENV_NOACTIVE;
            for (var key in this._groupsOfEnvEvents) {
                this._groupsOfEnvEvents[key].unregisterEventsSys();
            }
            // only turns off timer flag, above unregistration has clear all registered action in TimerSys
            EVENTSOL.TimerSys.getInstance().stop();
        };
        /**
         *  Stop only event system clock, can be used in order to set extra groups (active), environment evts (active)
         *  or alternatively add groups and environment evts. This help TimerSys do better grouping of them and system
         *  runs more effectively.
         *  In addition, it could be useful to do other actions the system programmers develop.
         */
        EnvEventSys.prototype.pause = function () {
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_ACTIVE) {
                console.warn("Warning: Event System is not active to pause it.");
                return;
            }
            this._status = EVENTSOL.EnvironmentStatus.ENV_PAUSE;
            EVENTSOL.TimerSys.getInstance().stop();
        };
        /**
         *  Continue Event System Clock
         */
        EnvEventSys.prototype.continue = function () {
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_PAUSE) {
                console.warn("Warning: Event System can not continue, it is not in pause state.");
            }
            this._status = EVENTSOL.EnvironmentStatus.ENV_ACTIVE;
            EVENTSOL.TimerSys.getInstance().start();
        };
        ////  Functions to handle groups of environment events
        // starts groups of evts (in case are not already started)
        // 1. stops TimerSys (in case it runs)
        // 2. loads extra actions of the evtGroups
        // 3. starts TimerSys
        EnvEventSys.prototype.assertEnvGroupExistence = function (groupName) {
            if (!(groupName in this._groupsOfEnvEvents)) {
                throw new RangeError("Error: try to start events GroupEnvironmentEvts called " + groupName + " does not exist.");
            }
        };
        EnvEventSys.prototype.startEvtGroups = function (evtGroups) {
            EVENTSOL.TimerSys.getInstance().stop();
            for (var groupName in evtGroups) {
                this.assertEnvGroupExistence(groupName);
                if (!this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOn();
                }
            }
            EVENTSOL.TimerSys.getInstance().start();
        };
        // Could be replaced by call function startEvtGroups, however this costs assertion check...
        EnvEventSys.prototype.startTotalEvtGroups = function () {
            EVENTSOL.TimerSys.getInstance().stop();
            for (var evtGroupName in this._groupsOfEnvEvents) {
                if (!this._groupsOfEnvEvents[evtGroupName].isActive()) {
                    this._groupsOfEnvEvents[evtGroupName].turnGroupOn();
                }
            }
            EVENTSOL.TimerSys.getInstance().start();
        };
        EnvEventSys.prototype.stopEvtGroups = function (evtGroups) {
            for (var groupName in evtGroups) {
                this.assertEnvGroupExistence(groupName);
                if (this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOff();
                }
            }
        };
        // Could be replaced by call function stopEvtGroups, however this costs assertion check...
        EnvEventSys.prototype.stopTotalEvtGroups = function () {
            for (var groupName in this._groupsOfEnvEvents) {
                if (this._groupsOfEnvEvents[groupName].isActive()) {
                    this._groupsOfEnvEvents[groupName].turnGroupOff();
                }
            }
        };
        /**
         *
         * static functions exported used for EnvironmentEvts and groups
         *
         **/
        EnvEventSys.CreateGroup = function (name, active) {
            if (active === void 0) { active = true; }
            var group = new EVENTSOL.GroupEnvironmentEvts(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE);
            EnvEventSys.getInstance().addEnvironmentGroup(group);
        };
        EnvEventSys.CreateGroups = function (groups) {
            for (var groupName in groups) {
                EnvEventSys.CreateGroup(groupName, groups[groupName]);
            }
        };
        /**
         *  Environment Events (Repeatable): EVERY, EVERY_FOR and EVERY_WHILE
         */
        EnvEventSys.CreateEventEvery = function (name, groupName, active, callback, freqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.TimerAction(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, true));
            var timerEvt = new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.EVERY, true, callback, evtActions, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        };
        EnvEventSys.CreateEventEveryFor = function (name, groupName, active, callback, freqTime, time) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.TimerActionExpiresSpecificTime(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, typeof time === 'number' ? new EVENTSOL.Time(time) : time));
            var timerEvt = new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.EVERY_FOR, true, callback, evtActions, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        };
        EnvEventSys.CreateEventEveryWhile = function (name, groupName, active, callback, freqTime, condition) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.TimerActionCondition(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, condition));
            var timerEvt = new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.EVERY_WHILE, true, callback, evtActions, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        };
        /**
         *  Environment Events (Not repeatable): ON, AFTER
         */
        EnvEventSys.CreateEventOn = function (name, groupName, active, callback, time) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.TimerActionSpecificTime(typeof time === 'number' ? new EVENTSOL.Time(time) : time));
            var timerEvt = new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.ΟΝ, false, callback, evtActions, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        };
        EnvEventSys.CreateEventAfter = function (name, groupName, active, callback, time) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.TimerAction(typeof time === 'number' ? new EVENTSOL.Time(time) : time, false));
            var timerEvt = new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.AFTER, false, callback, evtActions, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(timerEvt);
        };
        /**
         *  Environment Events (When_Condition):
         *      WHEN_CONDITION, WHEN_CONDITION_FOR, WHEN_CONDITION_HAPPENS, WHEN_CONDITION_EVERY,
         *      WHEN_CONDITION_EVERY_FOR, WHEN_CONDITION_EVERY_WHILE, WHEN_CONDITION_WAIT,
         *      WHEN_CONDITION_WAIT_EVERY, WHEN_CONDITION_WAIT_EVERY_FOR, WHEN_CONDITION_WAIT_EVERY_WHILE
         */
        EnvEventSys.CreateNewEventWhenCondition = function (name, groupName, active, condition, callback, freqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, condition));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION, false, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhen = function (name, groupName, active, condition, callback, freqTime) {
            if (freqTime === void 0) { freqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenCondition(name, groupName, active, condition, callback, freqTime));
        };
        EnvEventSys.CreateNewEventWhenConditionHappensFor = function (name, groupName, active, condition, callback, time, freqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtConditionTimer(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, condition, typeof time === 'number' ? new EVENTSOL.Time(time) : time));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_FOR, false, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenConditionHappensFor = function (name, groupName, active, condition, callback, time, freqTime) {
            if (freqTime === void 0) { freqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenConditionHappensFor(name, groupName, active, condition, callback, time, freqTime));
        };
        EnvEventSys.CreateNewEventWhenConditionHappensTimes = function (name, groupName, active, condition, callback, times, freqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtConditionTimesHappens(typeof freqTime === 'number' ? new EVENTSOL.Time(freqTime) : freqTime, condition, times));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_HAPPENS, false, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenConditionHappensTimes = function (name, groupName, active, condition, callback, times, freqTime) {
            if (freqTime === void 0) { freqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenConditionHappensTimes(name, groupName, active, condition, callback, times, freqTime));
        };
        EnvEventSys.CreateNewEventWhenConditionEvery = function (name, groupName, active, condition, callback, everyTime, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerAction(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, true));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_EVERY, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenEvery = function (name, groupName, active, condition, callback, everyTime, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenConditionEvery(name, groupName, active, condition, callback, everyTime, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenEveryFor = function (name, groupName, active, condition, callback, everyTime, specificTime, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerActionExpiresSpecificTime(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, typeof specificTime === 'number' ? new EVENTSOL.Time(specificTime) : specificTime));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_EVERY_FOR, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenEveryFor = function (name, groupName, active, condition, callback, everyTime, specificTime, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenEveryFor(name, groupName, active, condition, callback, everyTime, specificTime, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenEveryWhile = function (name, groupName, active, condition, callback, everyTime, everyCondition, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerActionCondition(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, everyCondition));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_EVERY_WHILE, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenEveryWhile = function (name, groupName, active, condition, callback, everyTime, everyCondition, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenEveryWhile(name, groupName, active, condition, callback, everyTime, everyCondition, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenWait = function (name, groupName, active, condition, callback, waitTime, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerAction(typeof waitTime === 'number' ? new EVENTSOL.Time(waitTime) : waitTime, false));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_WAIT, false, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenWait = function (name, groupName, active, condition, callback, waitTime, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenWait(name, groupName, active, condition, callback, waitTime, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenWaitEvery = function (name, groupName, active, condition, callback, waitTime, everyTime, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerAction(typeof waitTime === 'number' ? new EVENTSOL.Time(waitTime) : waitTime, false));
            evtActions.push(new EVENTSOL.TimerAction(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, true));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenWaitEvery = function (name, groupName, active, condition, callback, waitTime, everyTime, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenWaitEvery(name, groupName, active, condition, callback, waitTime, everyTime, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenWaitEveryFor = function (name, groupName, active, condition, callback, waitTime, everyTime, everySpecificTime, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerAction(typeof waitTime === 'number' ? new EVENTSOL.Time(waitTime) : waitTime, false));
            evtActions.push(new EVENTSOL.TimerActionExpiresSpecificTime(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, typeof everySpecificTime === 'number' ? new EVENTSOL.Time(everySpecificTime) : everySpecificTime));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_FOR, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenWaitEveryFor = function (name, groupName, active, condition, callback, waitTime, everyTime, everySpecificTime, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenWaitEveryFor(name, groupName, active, condition, callback, waitTime, everyTime, everySpecificTime, condfreqTime));
        };
        EnvEventSys.CreateNewEventWhenWaitEveryWhile = function (name, groupName, active, condition, callback, waitTime, everyTime, everyCondition, condfreqTime) {
            var evtActions = new Array();
            evtActions.push(new EVENTSOL.EvtCondition(typeof condfreqTime === 'number' ? new EVENTSOL.Time(condfreqTime) : condfreqTime, condition));
            evtActions.push(new EVENTSOL.TimerAction(typeof waitTime === 'number' ? new EVENTSOL.Time(waitTime) : waitTime, false));
            evtActions.push(new EVENTSOL.TimerActionCondition(typeof everyTime === 'number' ? new EVENTSOL.Time(everyTime) : everyTime, everyCondition));
            return new EVENTSOL.TimerEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_CONDITION_WAIT_EVERY_WHILE, true, callback, evtActions, groupName);
        };
        EnvEventSys.CreateEventWhenWaitEveryWhile = function (name, groupName, active, condition, callback, waitTime, everyTime, everyCondition, condfreqTime) {
            if (condfreqTime === void 0) { condfreqTime = EVENTSOL.Time.DefaultCondTime; }
            EnvEventSys.getInstance().addEnvironmentEvt(EnvEventSys.CreateNewEventWhenWaitEveryWhile(name, groupName, active, condition, callback, waitTime, everyTime, everyCondition, condfreqTime));
        };
        /**
         * Create references for EnvironmentEvents:
         *      IReferenceSimple, IReferencesTotalHappens, IReferencesOneOrMoreHappens
         */
        EnvEventSys.CreateReferenceSimple = function (evtName, times) {
            if (times <= 0) {
                console.error("Error: Negative defined value of times to happens referenced event with name " + evtName + ".");
                return null;
            }
            return {
                'type': EVENTSOL.ReferenceType.Simple,
                'eventName': evtName,
                'timesHappens': times
            };
        };
        EnvEventSys.CreateReferencesTotalHappens = function (references) {
            return {
                'type': EVENTSOL.ReferenceType.TotalHappens,
                'references': references
            };
        };
        EnvEventSys.CreateReferencesOneOrMoreHappens = function (references) {
            return {
                'type': EVENTSOL.ReferenceType.OneOrMoreHappens,
                'references': references
            };
        };
        /**
         *  Environment Events (Referenced Events):
         *      WHEN_REFERENCE, WHEN_REFERENCE_HAPPENS
         */
        EnvEventSys.CreateEventWhenReference = function (name, groupName, active, reference, callback) {
            var referencedEvt = new EVENTSOL.ReferencedEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_REFERENCE, false, callback, reference, groupName);
            EnvEventSys.getInstance().addEnvironmentEvt(referencedEvt);
        };
        EnvEventSys.CreateEventWhenReferenceHappens = function (name, groupName, active, reference, callback, times) {
            var referencedEvt = new EVENTSOL.ReferencedEvt(name, active ? EVENTSOL.EnvironmentStatus.ENV_ACTIVE : EVENTSOL.EnvironmentStatus.ENV_NOACTIVE, EVENTSOL.EnvironmentEvtType.WHEN_REFERENCE_HAPPENS, false, callback, reference, groupName, times);
            EnvEventSys.getInstance().addEnvironmentEvt(referencedEvt);
        };
        /**
         *  Start: Helper methods for insertion of the turn ON/OFF events / groups in the end of fired event source code execution
         */
        EnvEventSys.addValidEventsForNotSelfReference = function (envEvt, events, turnType) {
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
        };
        EnvEventSys.addValidEventsForSelfReference = function (envEvt, events, turnType) {
            events.forEach(function (evtName) {
                if (!EnvEventSys.getInstance().containsEnvironmentEvt(envEvt.groupName, evtName)) {
                    console.warn("Warning: EnvironmentEvt " + evtName + " is not defined in group " + envEvt.groupName + ".");
                }
                else {
                    envEvt['insertEnvEvt' + turnType](evtName);
                }
            });
        };
        EnvEventSys.addValidGroupsForNotSelfReference = function (envEvt, groups, turnType) {
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
        };
        EnvEventSys.addValidGroupsForSelfReference = function (envEvt, groups, turnType) {
            groups.forEach(function (groupName) {
                if (!EnvEventSys.getInstance().containsEnvironmentEvt(envEvt.groupName, groupName)) {
                    console.warn("Warning: EnvironmentGroup " + groupName + " is not defined in the event system.");
                }
                else {
                    envEvt['insertEnvGroup' + turnType](groupName);
                }
            });
        };
        /**
         *  Functions are provided to the user in order to add the Turn ON/OFF environments events/groups in the end of the fired source code execution
         */
        EnvEventSys.SetEventsTurnOnFromEnvironmentEvent = function (evtName, groupName, events) {
            var envEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            if (envEvt !== null) {
                if (envEvt.isRepeatable) {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOn');
                }
                else {
                    EnvEventSys.addValidEventsForSelfReference(envEvt, events, 'TurnOn');
                }
            }
        };
        EnvEventSys.SetEventsTurnOffFromEnvironmentEvent = function (evtName, groupName, events) {
            var envEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            if (envEvt !== null) {
                if (envEvt.isRepeatable) {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOff');
                }
                else {
                    EnvEventSys.addValidEventsForNotSelfReference(envEvt, events, 'TurnOff');
                }
            }
        };
        EnvEventSys.SetGroupsTurnOnFromEnvironmentEvent = function (evtName, groupName, groups) {
            var envEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            if (envEvt !== null) {
                // already active ==> event of the group fired
                EnvEventSys.addValidGroupsForNotSelfReference(envEvt, groups, 'TurnOn');
            }
        };
        EnvEventSys.SetGroupsTurnOffFromEnvironmentEvent = function (evtName, groupName, groups) {
            var envEvt = EnvEventSys.getInstance().getEnvironmentEvt(groupName, evtName);
            if (envEvt !== null) {
                // event can deactivate total group of the events
                EnvEventSys.addValidGroupsForSelfReference(envEvt, groups, 'TurnOff');
            }
        };
        EnvEventSys._inst = new EnvEventSys();
        return EnvEventSys;
    }());
    EVENTSOL.EnvEventSys = EnvEventSys;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=EnvEventSys.js.map