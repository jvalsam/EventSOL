var EVENTSOL;
(function (EVENTSOL) {
    EVENTSOL.totalDefinedEvts = 0;
    (function (EnvironmentStatus) {
        EnvironmentStatus[EnvironmentStatus["ENV_ACTIVE"] = 0] = "ENV_ACTIVE";
        EnvironmentStatus[EnvironmentStatus["ENV_NOACTIVE"] = 1] = "ENV_NOACTIVE";
        EnvironmentStatus[EnvironmentStatus["ENV_PAUSE"] = 2] = "ENV_PAUSE";
    })(EVENTSOL.EnvironmentStatus || (EVENTSOL.EnvironmentStatus = {}));
    var EnvironmentStatus = EVENTSOL.EnvironmentStatus;
    (function (EnvironmentEvtType) {
        EnvironmentEvtType[EnvironmentEvtType["EVERY"] = 0] = "EVERY";
        EnvironmentEvtType[EnvironmentEvtType["EVERY_FOR"] = 1] = "EVERY_FOR";
        EnvironmentEvtType[EnvironmentEvtType["EVERY_WHILE"] = 2] = "EVERY_WHILE";
        //
        EnvironmentEvtType[EnvironmentEvtType["ΟΝ"] = 3] = "ΟΝ";
        EnvironmentEvtType[EnvironmentEvtType["AFTER"] = 4] = "AFTER";
        //
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION"] = 5] = "WHEN_CONDITION";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_FOR"] = 6] = "WHEN_CONDITION_FOR";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_HAPPENS"] = 7] = "WHEN_CONDITION_HAPPENS";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_EVERY"] = 8] = "WHEN_CONDITION_EVERY";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_EVERY_FOR"] = 9] = "WHEN_CONDITION_EVERY_FOR";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_EVERY_WHILE"] = 10] = "WHEN_CONDITION_EVERY_WHILE";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_WAIT"] = 11] = "WHEN_CONDITION_WAIT";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_WAIT_EVERY"] = 12] = "WHEN_CONDITION_WAIT_EVERY";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_WAIT_EVERY_FOR"] = 13] = "WHEN_CONDITION_WAIT_EVERY_FOR";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_CONDITION_WAIT_EVERY_WHILE"] = 14] = "WHEN_CONDITION_WAIT_EVERY_WHILE";
        //
        EnvironmentEvtType[EnvironmentEvtType["WHEN_REFERENCE"] = 15] = "WHEN_REFERENCE";
        EnvironmentEvtType[EnvironmentEvtType["WHEN_REFERENCE_HAPPENS"] = 16] = "WHEN_REFERENCE_HAPPENS"; /*,
        WHEN_REFERENCE_EVERY,
        WHEN_REFERENCE_EVERY_FOR,
        WHEN_REFERENCE_EVERY_WHILE,
        WHEN_REFERENCE_WAIT,
        WHEN_REFERENCE_WAIT_EVERY,
        WHEN_REFERENCE_WAIT_EVERY_FOR,
        WHEN_REFERENCE_WAIT_EVERY_WHILE*/
    })(EVENTSOL.EnvironmentEvtType || (EVENTSOL.EnvironmentEvtType = {}));
    var EnvironmentEvtType = EVENTSOL.EnvironmentEvtType;
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
    var EnvironmentEvt = (function () {
        function EnvironmentEvt(name, status, type, repeatable, callback, groupName, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff) {
            this._name = name;
            this._id = ++EVENTSOL.totalDefinedEvts;
            this._initialStatus = status;
            this._status = status;
            this.type = type;
            this._isRepeatable = repeatable;
            this._callbackFunc = callback;
            this._totalFireEvt = 0;
            this._lastExecution = null;
            this._citedBy = {}; // loads values on the definition of reference events
            this._evtsTurnOn = evtsTurnOn ? evtsTurnOn : new Array();
            this._groupsTurnOn = groupsTurnOn ? groupsTurnOn : new Array();
            this._evtsTurnOff = evtsTurnOff ? evtsTurnOff : new Array();
            this._groupsTurnOff = groupsTurnOff ? groupsTurnOff : new Array();
        }
        Object.defineProperty(EnvironmentEvt.prototype, "name", {
            get: function () { return this._name; },
            set: function (name) { this._name = name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "id", {
            get: function () { return this._id; },
            set: function (id) { this._id = id; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "groupName", {
            get: function () { return this._groupName; },
            set: function (groupName) { this._groupName = groupName; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "type", {
            get: function () { return this._type; },
            set: function (type) { this._type = type; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "isRepeatable", {
            get: function () { return this._isRepeatable; },
            set: function (isRepeatable) { this._isRepeatable = isRepeatable; },
            enumerable: true,
            configurable: true
        });
        EnvironmentEvt.prototype.typeToStr = function () { return EnvironmentEvtMap[this._type]; };
        Object.defineProperty(EnvironmentEvt.prototype, "initialStatus", {
            get: function () { return this._initialStatus; },
            set: function (status) { this._initialStatus = status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "status", {
            get: function () { return this._status; },
            set: function (status) { this._status = status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "totalFireEvt", {
            get: function () { return this._totalFireEvt; },
            set: function (te) { this._totalFireEvt = te; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "lastExecution", {
            get: function () { return this._lastExecution; },
            set: function (le) { this._lastExecution = le; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "evtsTurnOn", {
            get: function () { return this._evtsTurnOn; },
            set: function (evts) { this._evtsTurnOn = evts; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "groupsTurnOn", {
            get: function () { return this._groupsTurnOn; },
            set: function (groups) { this._groupsTurnOn = groups; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "evtsTurnOff", {
            get: function () { return this._evtsTurnOff; },
            set: function (evts) { this._evtsTurnOff = evts; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EnvironmentEvt.prototype, "groupsTurnOff", {
            get: function () { return this._groupsTurnOff; },
            set: function (groups) { this._groupsTurnOff = groups; },
            enumerable: true,
            configurable: true
        });
        EnvironmentEvt.prototype.execution = function () {
            // exec the defined callback source code 
            this._callbackFunc();
            // keep data for exec
            ++this._totalFireEvt;
            this._lastExecution = new EVENTSOL.Time();
            // notify reference events of this event that it is fired
            for (var evtName in this._citedBy) {
                this._citedBy[evtName].evtReferenceFired(this);
            }
        };
        EnvironmentEvt.prototype.checkStatusForRegistration = function () {
            if (this._status === EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError("Error: try to register EnvironmentEvt: " + this._name + " in group " + this._groupName +
                    ". EnvironmentEvts have to be active before registration in the event based system.");
            }
        };
        EnvironmentEvt.prototype.insertCitation = function (refEvt) {
            this._citedBy[refEvt.name] = refEvt;
        };
        EnvironmentEvt.prototype.removeCitation = function (refEvt) {
            var refEvtName = refEvt.name;
            if (!(refEvtName in this._citedBy)) {
                throw new RangeError("Error: try to remove citation with name: " + refEvtName +
                    " of event which not exists in the citation list of environment event " +
                    this.name);
            }
            delete this._citedBy[refEvtName];
        };
        EnvironmentEvt.prototype.assertEnvEvtExistence = function (evtName, msgInfo) {
            if (!EVENTSOL.EnvEventSys.getInstance().containsEnvironmentEvt(this.groupName, evtName)) {
                throw new RangeError("Error: try to " + msgInfo + " not defined  event in the system, in environement group: " +
                    this.groupName + "called " + evtName + ".");
            }
        };
        EnvironmentEvt.prototype.insertEnvEvtTurnHelper = function (index, evtName) {
            this.assertEnvEvtExistence(evtName, "insert for " + index);
            this[index].push(evtName);
        };
        EnvironmentEvt.prototype.insertEnvEvtTurnOn = function (evtName) { this.insertEnvEvtTurnHelper('_evtsTurnOnEvts', evtName); };
        EnvironmentEvt.prototype.insertEnvEvtTurnOff = function (evtName) { this.insertEnvEvtTurnHelper('_evtsTurnOffEvts', evtName); };
        EnvironmentEvt.prototype.assertEnvGroupExistence = function (groupName, msgInfo) {
            if (!EVENTSOL.EnvEventSys.getInstance().containsGroupEnvironmentEvts(name)) {
                throw new RangeError("Error: try to " + msgInfo + " not defined group called " + groupName + " in the system.");
            }
        };
        EnvironmentEvt.prototype.insertEnvGroupTurnHelper = function (index, groupName) {
            this.assertEnvGroupExistence(groupName, "insert for " + index);
            this[index].push(groupName);
        };
        EnvironmentEvt.prototype.insertEnvGroupTurnOn = function (groupName) { this.insertEnvGroupTurnHelper('_evtsTurnOnGroups', groupName); };
        EnvironmentEvt.prototype.insertEnvGroupTurnOff = function (groupName) { this.insertEnvGroupTurnHelper('_evtsTurnOffGroups', groupName); };
        EnvironmentEvt.prototype.removeEnvEvtTurnHelper = function (index, evtName) {
            this.assertEnvEvtExistence(evtName, "remove for " + index);
            this[index].splice(this[index].indexOf(evtName), 1);
        };
        EnvironmentEvt.prototype.removeEnvEvtTurnOn = function (evtName) { this.removeEnvEvtTurnHelper('_evtsTurnOnEvts', evtName); };
        EnvironmentEvt.prototype.removeEnvEvtTurnOff = function (evtName) { this.removeEnvEvtTurnHelper('_evtsTurnOffEvts', evtName); };
        EnvironmentEvt.prototype.removeEnvGroupTurnHelper = function (index, groupName) {
            this.assertEnvGroupExistence(groupName, "remove for " + index);
            this[index].splice(this[index].indexOf(groupName), 1);
        };
        EnvironmentEvt.prototype.removeEnvGroupTurnOn = function (groupName) { this.removeEnvEvtTurnHelper('_evtsTurnOnGroups', groupName); };
        EnvironmentEvt.prototype.removeEnvGroupTurnOff = function (groupName) { this.removeEnvEvtTurnHelper('_evtsTurnOffGroups', groupName); };
        // actions user can choose during runtime and/or in definition
        EnvironmentEvt.prototype.turnEvtON = function () {
            this._status = EnvironmentStatus.ENV_ACTIVE;
        };
        EnvironmentEvt.prototype.turnEvtOFF = function () {
            this._status = EnvironmentStatus.ENV_NOACTIVE;
        };
        return EnvironmentEvt;
    }());
    EVENTSOL.EnvironmentEvt = EnvironmentEvt;
    var GroupEnvironmentEvts = (function () {
        function GroupEnvironmentEvts(name, status) {
            if (status === void 0) { status = EnvironmentStatus.ENV_NOACTIVE; }
            this._name = name;
            this._events = {};
            this._initialStatus = status;
            this._status = status;
        }
        Object.defineProperty(GroupEnvironmentEvts.prototype, "name", {
            get: function () { return this._name; },
            set: function (name) { this._name = name; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroupEnvironmentEvts.prototype, "initialStatus", {
            get: function () { return this._initialStatus; },
            set: function (status) { this._initialStatus = status; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GroupEnvironmentEvts.prototype, "status", {
            get: function () { return this._status; },
            set: function (status) { this._status = status; },
            enumerable: true,
            configurable: true
        });
        GroupEnvironmentEvts.prototype.isActive = function () { return this._status === EnvironmentStatus.ENV_ACTIVE; };
        GroupEnvironmentEvts.prototype.getEnvironmentEvt = function (name) {
            if (!this.containsEnvironmentEvt(name)) {
                console.warn("Warning: try to access the Environment Event called " + name +
                    " which is not defined in the system.");
                return null;
            }
            return this._events[name];
        };
        GroupEnvironmentEvts.prototype.containsEnvironmentEvt = function (name) {
            return (name in this._events);
        };
        GroupEnvironmentEvts.prototype.checkStatusForRegistration = function () {
            if (this._status !== EnvironmentStatus.ENV_ACTIVE) {
                throw new RangeError("Error: try for registration group " + this._name + " which is not active.");
            }
        };
        GroupEnvironmentEvts.prototype.registerEventsSys = function () {
            this.checkStatusForRegistration();
            for (var eventName in this._events) {
                var envEvt = this._events[eventName];
                if (envEvt.initialStatus === EnvironmentStatus.ENV_ACTIVE) {
                    envEvt.registerEvtSys();
                }
            }
        };
        GroupEnvironmentEvts.prototype.unregisterEventsSys = function () {
            for (var eventName in this._events) {
                this._events[eventName].unregisterEvtSys();
            }
            this._status = this._initialStatus;
        };
        GroupEnvironmentEvts.prototype.addEvent = function (evt) {
            this._events[evt.name] = evt;
        };
        GroupEnvironmentEvts.prototype.addEvents = function (evts) {
            evts.forEach(function (evt) {
                this._events[evt.name] = evt;
            }, this);
        };
        GroupEnvironmentEvts.prototype.removeEvent = function (evt) {
            if (this.containsEnvironmentEvt(name)) {
                throw new RangeError("Error: try to remove not existing environment evt from group events.");
            }
            delete this._events[evt.name];
        };
        GroupEnvironmentEvts.prototype.removeEvents = function (evts) {
            evts.forEach(function (evt) {
                this.removeEvent(evt);
            }, this);
        };
        GroupEnvironmentEvts.prototype.turnGroupOn = function () {
            this._status = EnvironmentStatus.ENV_ACTIVE;
            this.registerEventsSys();
        };
        GroupEnvironmentEvts.prototype.turnGroupOff = function () {
            this._status = EnvironmentStatus.ENV_NOACTIVE;
            this.unregisterEventsSys();
        };
        return GroupEnvironmentEvts;
    }());
    EVENTSOL.GroupEnvironmentEvts = GroupEnvironmentEvts;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=EnvironmentEvt.js.map