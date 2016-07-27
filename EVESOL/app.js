'use strict';
var EVENTSOL;
(function (EVENTSOL) {
    var TesterEVESOL = (function () {
        function TesterEVESOL(element) {
            // this.testing_Every_EveryFor_EveryWhile_WhenCondition_ReferenceEvents_TurnOnOffs_OneGroup();
            // this.testing_After_Recursive_Self_TurnOn();
            this.testing_When_Every();
        }
        TesterEVESOL.prototype.testing_Every_EveryFor_EveryWhile_WhenCondition_ReferenceEvents_TurnOnOffs_OneGroup = function () {
            var counter = 1;
            var sprayingCounter = 0;
            var SmartGarden = { detectDisease: false };
            EVENTSOL.EnvEventSys.CreateGroup('MyHomeEnvironment', true);
            EVENTSOL.EnvEventSys.CreateEventEvery('Watering', 'MyHomeEnvironment', true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden watering.";
                ++counter;
                // source code for testing
                if (counter > 10 && counter < 20 && SmartGarden.detectDisease === false) {
                    SmartGarden.detectDisease = true;
                    el.innerHTML = el.innerHTML + "<br/>" + "Smart garden changed value in detectDisease == true.";
                }
                else if (counter > 30 && counter < 40 && SmartGarden.detectDisease === false) {
                    SmartGarden.detectDisease = true;
                    el.innerHTML = el.innerHTML + "<br/>" + "Smart garden changed value in detectDisease == true.";
                }
            }, EVENTSOL.Time.seconds(2));
            EVENTSOL.EnvEventSys.CreateEventEvery('Fertilization', 'MyHomeEnvironment', true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden fertilization.";
                ++counter;
            }, EVENTSOL.Time.seconds(6));
            EVENTSOL.EnvEventSys.CreateEventWhenReferenceHappens('3TimesFertilization5Watering', 'MyHomeEnvironment', true, EVENTSOL.EnvEventSys.CreateReferencesTotalHappens([
                EVENTSOL.EnvEventSys.CreateReferenceSimple('Watering', 5, EVENTSOL.OperatorTypeTimes.GreaterOrEqual),
                EVENTSOL.EnvEventSys.CreateReferenceSimple('Fertilization', 3, EVENTSOL.OperatorTypeTimes.GreaterOrEqual),
            ]), function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: DETECTS 3 TIMES FERTILIZATION 5 WATERING.";
            }, 2);
            EVENTSOL.EnvEventSys.CreateEventWhen('DetectPlantDisease', 'MyHomeEnvironment', true, function () {
                return SmartGarden.detectDisease === true;
            }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Garden disease detected!";
                ++counter;
            }, EVENTSOL.Time.seconds(4));
            EVENTSOL.EnvEventSys.CreateEventWhen('DetectPlantTreated', 'MyHomeEnvironment', false, function () {
                return sprayingCounter >= 3;
            }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Garden disease treated!!!!";
                ++counter;
                sprayingCounter = 0;
                SmartGarden.detectDisease = false;
            }, EVENTSOL.Time.seconds(2));
            /*            EVENTSOL.EnvEventSys.CreateEventEveryWhile(
                            'PlantSpraying',
                            'MyHomeEnvironment',
                            false,
                            function () {
                                var el = document.getElementById('content');
                                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden plant spraying.";
                                ++counter;
                            },
                            new EVENTSOL.Time(5000),
                            function (): boolean {
                                return SmartGarden.detectDisease === true;
                            }
                        );*/
            EVENTSOL.EnvEventSys.CreateEventEveryFor('PlantSpraying', 'MyHomeEnvironment', false, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden plant spraying.";
                ++sprayingCounter;
                ++counter;
            }, EVENTSOL.Time.seconds(2), EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent('DetectPlantDisease', 'MyHomeEnvironment', ['PlantSpraying', 'DetectPlantTreated']);
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent('DetectPlantDisease', 'MyHomeEnvironment', ['Fertilization']);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent('DetectPlantTreated', 'MyHomeEnvironment', ['DetectPlantDisease']);
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent('DetectPlantTreated', 'MyHomeEnvironment', ['PlantSpraying']);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent('PlantSpraying', 'MyHomeEnvironment', ['Fertilization']);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent('3TimesFertilization5Watering', 'MyHomeEnvironment', ['3TimesFertilization5Watering']);
        };
        TesterEVESOL.prototype.testing_After_Recursive_Self_TurnOn = function () {
            var group = 'MyProgram';
            var SpecificDay = 'SpecificTime';
            EVENTSOL.EnvEventSys.CreateGroup(group);
            EVENTSOL.EnvEventSys.CreateEventAfter(SpecificDay, group, true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Specific Time.";
            }, EVENTSOL.Time.seconds(5));
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SpecificDay, group, [SpecificDay]);
        };
        TesterEVESOL.prototype.testing_When_Every = function () {
            var group = 'GardenCare';
            var evtWhenStopRains = 'whenStopRainsWatering';
            var evtHelperSO1 = 'helperSO1';
            var evtHelperSO2 = 'helperSO2';
            var evtHelperSO3 = 'helperSO3';
            // virtual smart object garden
            var SmartGarden = { stopRains: false };
            EVENTSOL.EnvEventSys.CreateGroup(group);
            EVENTSOL.EnvEventSys.CreateEventWhenEveryWhile(evtWhenStopRains, group, true, function () { return SmartGarden.stopRains === true; }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Watering...";
            }, EVENTSOL.Time.seconds(2), function () { return SmartGarden.stopRains === true; });
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO1, group, true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " --> SmartGarden detects that stoped rain";
                SmartGarden.stopRains = true;
            }, EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO2, group, false, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " ------> SmartGarden detects that rains again";
                SmartGarden.stopRains = false;
            }, EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO3, group, false, function () {
                /* DO NOTHING: in the end of execution activate watering event */
            }, EVENTSOL.Time.seconds(1));
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO2]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO2, group, [evtHelperSO3]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO3, group, [evtHelperSO1, evtWhenStopRains]);
        };
        TesterEVESOL.prototype.start = function () {
            EVENTSOL.EnvEventSys.start();
        };
        return TesterEVESOL;
    }());
    window.onload = function () {
        var el = document.getElementById('content');
        var tester = new TesterEVESOL(el);
        tester.start();
    };
})(EVENTSOL || (EVENTSOL = {}));
//# sourceMappingURL=app.js.map