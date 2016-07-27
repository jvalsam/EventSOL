var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EVENTSOL;
(function (EVENTSOL) {
    (function (ReferenceType) {
        ReferenceType[ReferenceType["Simple"] = 0] = "Simple";
        ReferenceType[ReferenceType["TotalHappens"] = 1] = "TotalHappens";
        ReferenceType[ReferenceType["OneOrMoreHappens"] = 2] = "OneOrMoreHappens";
    })(EVENTSOL.ReferenceType || (EVENTSOL.ReferenceType = {}));
    var ReferenceType = EVENTSOL.ReferenceType;
    ////////////////////////////////////////////////////
    var ReferencedEvt = (function (_super) {
        __extends(ReferencedEvt, _super);
        function ReferencedEvt(name, status, type, isRepeatable, callback, reference, groupName, times, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff) {
            if (groupName === void 0) { groupName = null; }
            if (times === void 0) { times = 1; }
            if (evtsTurnOn === void 0) { evtsTurnOn = new Array(); }
            if (groupsTurnOn === void 0) { groupsTurnOn = new Array(); }
            if (evtsTurnOff === void 0) { evtsTurnOff = new Array(); }
            if (groupsTurnOff === void 0) { groupsTurnOff = new Array(); }
            _super.call(this, name, status, type, isRepeatable, callback, groupName, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff);
            switch (reference.type) {
                case ReferenceType.Simple:
                    this._references = new SimpleRef(reference);
                    break;
                case ReferenceType.TotalHappens:
                    this._references = new AndRef(reference);
                    break;
                case ReferenceType.OneOrMoreHappens:
                    this._references = new OrRef(reference);
                    break;
            }
            this._times = times;
            this._totalTimes = 0;
        }
        ReferencedEvt.prototype.execution = function () {
            this._callbackFunc();
            _super.prototype.execution.call(this);
        };
        ReferencedEvt.prototype.registrationEvtSys = function (action) {
            // populate citation in the respective events
            var group = EVENTSOL.EnvEventSys.getInstance().getGroupEnvironmentEvts(this.groupName);
            this._references.getInvolvedEventsName().forEach(function (evtName) {
                var evt = group.getEnvironmentEvt(evtName);
                if (evt === null) {
                    throw new RangeError("Error: try to create ReferencedEvt called " + this.name +
                        " which includes reference in environment");
                }
                evt[action](this);
            }, this);
        };
        ReferencedEvt.prototype.registerEvtSys = function () {
            this.checkStatusForRegistration();
            this.registrationEvtSys("insertCitation");
        };
        ReferencedEvt.prototype.unregisterEvtSys = function () {
            this.registrationEvtSys("removeCitation");
        };
        ReferencedEvt.prototype.evtReferenceFired = function (evt) {
            if (this.status === EVENTSOL.EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError("Error: EnvironmentEvt called " + evt.name +
                    " try to call evtReferencedFired of RefEvt called " + this.name);
            }
            this._references.markEvtReferenceFired(evt.name);
            // check if referenced event fired due to the evt
            if (this._references.actionsCheck()) {
                ++this._totalTimes;
                if (this._totalTimes === this._times) {
                    this.execution();
                    // executed once by default and then turns off
                    this.turnEvtOFF();
                }
            }
        };
        ReferencedEvt.prototype.turnEvtHelper = function (turnFunc) {
            var evtNames = this._references.getInvolvedEventsName();
            var evtsGroup = EVENTSOL.EnvEventSys.getInstance().getGroupEnvironmentEvts(this.groupName);
            evtNames.forEach(function (evtName) {
                var envEvt = evtsGroup.getEnvironmentEvt(evtName);
                if (envEvt == null || typeof envEvt === 'undefined') {
                    throw new RangeError("Error: try to get citation called " + evtName +
                        " for reference evt called " + this.name);
                }
                envEvt[turnFunc](this);
            }, this);
        };
        // populate event to the respective events
        ReferencedEvt.prototype.turnEvtON = function () {
            _super.prototype.turnEvtON.call(this);
            this.turnEvtHelper('insertCitation');
        };
        // remove event data from the respective events
        ReferencedEvt.prototype.turnEvtOFF = function () {
            _super.prototype.turnEvtOFF.call(this);
            this.turnEvtHelper('removeCitation');
            this._totalTimes = 0;
            this._references.reset();
        };
        return ReferencedEvt;
    }(EVENTSOL.EnvironmentEvt));
    EVENTSOL.ReferencedEvt = ReferencedEvt;
    // Tree of References
    // -> Simple Ref (Tree leafs), Aggregate Ref (And Ref, Or Ref)
    var Reference = (function () {
        function Reference() {
        }
        return Reference;
    }());
    var AggregateRef = (function (_super) {
        __extends(AggregateRef, _super);
        function AggregateRef(references) {
            _super.call(this);
            references.forEach(function (ref) {
                switch (ref.type) {
                    case ReferenceType.Simple:
                        this._values.push(new SimpleRef(ref));
                        break;
                    case ReferenceType.TotalHappens:
                        this._values.push(new AndRef(ref));
                        break;
                    case ReferenceType.OneOrMoreHappens:
                        this._values.push(new OrRef(ref));
                        break;
                }
            }, this);
        }
        AggregateRef.prototype.getInvolvedEventsName = function () {
            var eventsName = new Array();
            this._values.forEach(function (ref) {
                eventsName.concat(ref.getInvolvedEventsName());
            });
            return eventsName;
        };
        AggregateRef.prototype.reset = function () {
            for (var i = 0; i < this._values.length; i++) {
                this._values[i].reset();
            }
        };
        return AggregateRef;
    }(Reference));
    var AndRef = (function (_super) {
        __extends(AndRef, _super);
        function AndRef(data) {
            _super.call(this, data.references);
        }
        AndRef.prototype.actionsCheck = function () {
            for (var i = 0; i < this._values.length; i++) {
                if (!this._values[i].actionsCheck()) {
                    return false;
                }
            }
            return true;
        };
        AndRef.prototype.markEvtReferenceFired = function (name) {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].markEvtReferenceFired(name)) {
                    return true;
                }
            }
            return false;
        };
        return AndRef;
    }(AggregateRef));
    EVENTSOL.AndRef = AndRef;
    var OrRef = (function (_super) {
        __extends(OrRef, _super);
        function OrRef(data) {
            _super.call(this, data.references);
        }
        OrRef.prototype.actionsCheck = function () {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].actionsCheck()) {
                    return true;
                }
            }
            return false;
        };
        OrRef.prototype.markEvtReferenceFired = function (name) {
            for (var i = 0; i < this._values.length; i++) {
                if (this._values[i].markEvtReferenceFired(name)) {
                    return true;
                }
            }
            return false;
        };
        return OrRef;
    }(AggregateRef));
    EVENTSOL.OrRef = OrRef;
    var SimpleRef = (function (_super) {
        __extends(SimpleRef, _super);
        function SimpleRef(data) {
            _super.call(this);
            this._eventName = data.eventName;
            this._times2Fire = data.timesHappens;
            this._times = 0;
        }
        SimpleRef.prototype.getInvolvedEventsName = function () {
            var array = new Array();
            array.push(this._eventName);
            return array;
        };
        SimpleRef.prototype.actionsCheck = function () {
            return this._times === this._times2Fire;
        };
        SimpleRef.prototype.markEvtReferenceFired = function (name) {
            if (this._eventName === name) {
                ++this._times;
                return true;
            }
            return false;
        };
        SimpleRef.prototype.reset = function () {
            this._times = 0;
        };
        return SimpleRef;
    }(Reference));
    EVENTSOL.SimpleRef = SimpleRef;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=ReferencedEvt.js.map