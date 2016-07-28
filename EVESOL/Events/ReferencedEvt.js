var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EVENTSOL;
(function (EVENTSOL) {
    (function (ReferenceType) {
        ReferenceType[ReferenceType["Leaf"] = 0] = "Leaf";
        ReferenceType[ReferenceType["TotalHappens"] = 1] = "TotalHappens";
        ReferenceType[ReferenceType["OneOrMoreHappens"] = 2] = "OneOrMoreHappens";
    })(EVENTSOL.ReferenceType || (EVENTSOL.ReferenceType = {}));
    var ReferenceType = EVENTSOL.ReferenceType;
    (function (OperatorTypeTimes) {
        OperatorTypeTimes[OperatorTypeTimes["Equal"] = 0] = "Equal";
        OperatorTypeTimes[OperatorTypeTimes["NotEqual"] = 1] = "NotEqual";
        OperatorTypeTimes[OperatorTypeTimes["Greater"] = 2] = "Greater";
        OperatorTypeTimes[OperatorTypeTimes["GreaterOrEqual"] = 3] = "GreaterOrEqual";
        OperatorTypeTimes[OperatorTypeTimes["Less"] = 4] = "Less";
        OperatorTypeTimes[OperatorTypeTimes["LessOrEqual"] = 5] = "LessOrEqual";
    })(EVENTSOL.OperatorTypeTimes || (EVENTSOL.OperatorTypeTimes = {}));
    var OperatorTypeTimes = EVENTSOL.OperatorTypeTimes;
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
                case ReferenceType.Leaf:
                    switch (reference.leafType) {
                        case OperatorTypeTimes.Equal:
                            this._references = new EqualRef(reference);
                            break;
                        case OperatorTypeTimes.NotEqual:
                            this._references = new NotEqualRef(reference);
                            break;
                        case OperatorTypeTimes.Greater:
                            this._references = new GreaterRef(reference);
                            break;
                        case OperatorTypeTimes.GreaterOrEqual:
                            this._references = new GreaterOrEqualRef(reference);
                            break;
                        case OperatorTypeTimes.Less:
                            this._references = new LessRef(reference);
                            break;
                        case OperatorTypeTimes.LessOrEqual:
                            this._references = new LessOrEqualRef(reference);
                            break;
                    }
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
                    this.actionsAfterExecution();
                }
                // reset reference which is true in order to count next creation of true ref
                this._references.reset();
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
            if (this._status !== EVENTSOL.EnvironmentStatus.ENV_ACTIVE) {
                _super.prototype.turnEvtON.call(this);
                this.turnEvtHelper('insertCitation');
            }
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
    var ReferencedEvtTimer = (function (_super) {
        __extends(ReferencedEvtTimer, _super);
        function ReferencedEvtTimer(name, status, type, isRepeatable, callback, reference, groupName, time, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff) {
            if (groupName === void 0) { groupName = null; }
            if (evtsTurnOn === void 0) { evtsTurnOn = new Array(); }
            if (groupsTurnOn === void 0) { groupsTurnOn = new Array(); }
            if (evtsTurnOff === void 0) { evtsTurnOff = new Array(); }
            if (groupsTurnOff === void 0) { groupsTurnOff = new Array(); }
            _super.call(this, name, status, type, isRepeatable, callback, reference, groupName, 1, evtsTurnOn, groupsTurnOn, evtsTurnOff, groupsTurnOff);
            var references = this._references;
            this._actionReferenceCondTimer = new EVENTSOL.EvtReferenceTimer(this, function () { return references.actionsCheck(); }, EVENTSOL.Time.DefaultCondTime, time);
            this._actionReferenceCondTimer.parent = this;
        }
        ReferencedEvtTimer.prototype.evtReferenceFired = function (evt) {
            if (this.status === EVENTSOL.EnvironmentStatus.ENV_NOACTIVE) {
                throw new RangeError("Error: EnvironmentEvt called " + evt.name +
                    " try to call evtReferencedFired of RefEvt called " + this.name);
            }
            this._references.markEvtReferenceFired(evt.name);
            // check if referenced event fired due to the evt
            if (this._totalTimes === 0 && this._references.actionsCheck()) {
                ++this._totalTimes;
                this._actionReferenceCondTimer.start(true);
            }
        };
        ReferencedEvtTimer.prototype.actionFired = function (result) {
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
        };
        ReferencedEvtTimer.prototype.turnEvtOFF = function () {
            _super.prototype.turnEvtOFF.call(this);
            this._actionReferenceCondTimer.stop();
        };
        return ReferencedEvtTimer;
    }(ReferencedEvt));
    EVENTSOL.ReferencedEvtTimer = ReferencedEvtTimer;
    // Tree of References
    // -> Simple Ref (Tree leafs), Aggregate Ref (And Ref, Or Ref)
    var Reference = (function () {
        function Reference() {
        }
        return Reference;
    }());
    EVENTSOL.Reference = Reference;
    var AggregateRef = (function (_super) {
        __extends(AggregateRef, _super);
        function AggregateRef(references) {
            _super.call(this);
            this._values = new Array();
            references.forEach(function (ref) {
                switch (ref.type) {
                    case ReferenceType.Leaf:
                        switch (ref.leafType) {
                            case OperatorTypeTimes.Equal:
                                this._values.push(new EqualRef(ref));
                                break;
                            case OperatorTypeTimes.NotEqual:
                                this._values.push(new NotEqualRef(ref));
                                break;
                            case OperatorTypeTimes.Greater:
                                this._values.push(new GreaterRef(ref));
                                break;
                            case OperatorTypeTimes.GreaterOrEqual:
                                this._values.push(new GreaterOrEqualRef(ref));
                                break;
                            case OperatorTypeTimes.Less:
                                this._values.push(new LessRef(ref));
                                break;
                            case OperatorTypeTimes.LessOrEqual:
                                this._values.push(new LessOrEqualRef(ref));
                                break;
                        }
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
                eventsName.push.apply(eventsName, ref.getInvolvedEventsName());
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
    EVENTSOL.AggregateRef = AggregateRef;
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
    var LeafRef = (function (_super) {
        __extends(LeafRef, _super);
        function LeafRef(data) {
            _super.call(this);
            this._eventName = data.eventName;
            this._times2Fire = data.timesHappens;
            this._times = 0;
        }
        LeafRef.prototype.getInvolvedEventsName = function () {
            var array = new Array();
            array.push(this._eventName);
            return array;
        };
        LeafRef.prototype.markEvtReferenceFired = function (name) {
            if (this._eventName === name) {
                ++this._times;
                return true;
            }
            return false;
        };
        LeafRef.prototype.reset = function () {
            this._times = 0;
        };
        return LeafRef;
    }(Reference));
    EVENTSOL.LeafRef = LeafRef;
    var EqualRef = (function (_super) {
        __extends(EqualRef, _super);
        function EqualRef() {
            _super.apply(this, arguments);
        }
        EqualRef.prototype.actionsCheck = function () {
            return this._times === this._times2Fire;
        };
        return EqualRef;
    }(LeafRef));
    EVENTSOL.EqualRef = EqualRef;
    var NotEqualRef = (function (_super) {
        __extends(NotEqualRef, _super);
        function NotEqualRef() {
            _super.apply(this, arguments);
        }
        NotEqualRef.prototype.actionsCheck = function () {
            return this._times !== this._times2Fire;
        };
        return NotEqualRef;
    }(LeafRef));
    EVENTSOL.NotEqualRef = NotEqualRef;
    var GreaterRef = (function (_super) {
        __extends(GreaterRef, _super);
        function GreaterRef() {
            _super.apply(this, arguments);
        }
        GreaterRef.prototype.actionsCheck = function () {
            return this._times > this._times2Fire;
        };
        return GreaterRef;
    }(LeafRef));
    EVENTSOL.GreaterRef = GreaterRef;
    var GreaterOrEqualRef = (function (_super) {
        __extends(GreaterOrEqualRef, _super);
        function GreaterOrEqualRef() {
            _super.apply(this, arguments);
        }
        GreaterOrEqualRef.prototype.actionsCheck = function () {
            return this._times >= this._times2Fire;
        };
        return GreaterOrEqualRef;
    }(LeafRef));
    EVENTSOL.GreaterOrEqualRef = GreaterOrEqualRef;
    var LessRef = (function (_super) {
        __extends(LessRef, _super);
        function LessRef() {
            _super.apply(this, arguments);
        }
        LessRef.prototype.actionsCheck = function () {
            return this._times < this._times2Fire;
        };
        return LessRef;
    }(LeafRef));
    EVENTSOL.LessRef = LessRef;
    var LessOrEqualRef = (function (_super) {
        __extends(LessOrEqualRef, _super);
        function LessOrEqualRef() {
            _super.apply(this, arguments);
        }
        LessOrEqualRef.prototype.actionsCheck = function () {
            return this._times <= this._times2Fire;
        };
        return LessOrEqualRef;
    }(LeafRef));
    EVENTSOL.LessOrEqualRef = LessOrEqualRef;
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=ReferencedEvt.js.map