'use strict';

module EVENTSOL {

    class TesterEVESOL {
        element: HTMLElement;
        span: HTMLElement;
        timerToken: number;

        testing_Every_EveryFor_EveryWhile_WhenCondition_TurnOnOffs_OneGroup() {
            var counter = 1;
            var sprayingCounter = 0;
            var SmartGarden = { detectDisease: false };

            EVENTSOL.EnvEventSys.CreateGroup('MyHomeEnvironment', true);
            EVENTSOL.EnvEventSys.CreateEventEvery(
                'Watering',
                'MyHomeEnvironment',
                true,
                function () {
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
                },
                new EVENTSOL.Time(2000)
            );

            EVENTSOL.EnvEventSys.CreateEventEvery(
                'Fertilization',
                'MyHomeEnvironment',
                true,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden fertilization.";
                    ++counter;
                },
                new EVENTSOL.Time(6000)
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                'DetectPlantDisease',
                'MyHomeEnvironment',
                true,
                function (): boolean {
                    return SmartGarden.detectDisease === true;
                },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Garden disease detected!";
                    ++counter;
                },
                new EVENTSOL.Time(4000)
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                'DetectPlantTreated',
                'MyHomeEnvironment',
                false,
                function (): boolean {
                    return sprayingCounter >= 3;
                },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Garden disease treated!!!!";
                    ++counter;
                    sprayingCounter = 0;
                    SmartGarden.detectDisease = false;
                },
                new EVENTSOL.Time(2000)
            );

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
            
            EVENTSOL.EnvEventSys.CreateEventEveryFor(
                'PlantSpraying',
                'MyHomeEnvironment',
                false,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: garden plant spraying.";
                    ++sprayingCounter;
                    ++counter;
                },
                new EVENTSOL.Time(2000),
                new EVENTSOL.Time(100000)
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                'DetectPlantDisease',
                'MyHomeEnvironment',
                ['PlantSpraying', 'DetectPlantTreated']
            );
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(
                'DetectPlantDisease',
                'MyHomeEnvironment',
                ['Fertilization']
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                'DetectPlantTreated',
                'MyHomeEnvironment',
                ['DetectPlantDisease']
            );
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(
                'DetectPlantTreated',
                'MyHomeEnvironment',
                ['PlantSpraying']
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                'PlantSpraying',
                'MyHomeEnvironment',
                ['Fertilization']
            );
        }


        constructor(element: HTMLElement) {
            this.testing_Every_EveryFor_EveryWhile_WhenCondition_TurnOnOffs_OneGroup();
        }

        start() {
            EVENTSOL.EnvEventSys.start();
        }

        stop() {
            clearTimeout(this.timerToken);
        }

    }

    window.onload = () => {
        var el = document.getElementById('content');
        var greeter = new TesterEVESOL(el);
        greeter.start();
    };


}