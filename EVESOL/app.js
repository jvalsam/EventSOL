'use strict';
var EVENTSOL;
(function (EVENTSOL) {
    var TesterEVESOL = (function () {
        function TesterEVESOL(element) {
            this.testing_Every_EveryFor_EveryWhile_WhenCondition_TurnOnOffs_OneGroup();
            //this.testing_After_Recursive_Self_TurnOn();
        }
        TesterEVESOL.prototype.testing_Every_EveryFor_EveryWhile_WhenCondition_TurnOnOffs_OneGroup = function () {
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