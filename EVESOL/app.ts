'use strict';

module EVENTSOL {
    function print(txt: string): void {
        var el = document.getElementById('content');
        el.innerHTML = el.innerHTML + "<br/>" + txt;
    }
    
    /**
     * Assuming that Smart Objects handled by appropriate middleware...
     * In programs, Smart Objects are used as JS Objects
     */
    module SmartObjects {
        var days = ['MONDAY', 'TUESDAY', 'WEDSDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        
        export class Calendar {
            private static _dayIndex = 0;

            public static getDay() { return days[Calendar._dayIndex]; }
            public static next() {
                Calendar._dayIndex++;
                if (Calendar._dayIndex == 7) {
                    Calendar._dayIndex = 0;
                }
            }
        }
        export class CoffeeMachine {
            private static _name = "Coffee Machine";
            private static _jugOut: boolean = false;
            private static _cups: number;
            private static _coffeeReady: boolean;
            
            public static isCoffeeJugOut(): boolean { return CoffeeMachine._jugOut; }
            public static prepareCoffee(cups: number) {
                CoffeeMachine._coffeeReady = false;
                CoffeeMachine._cups = cups;
                print(CoffeeMachine._name + ": Starts prepare coffee for " + cups + ". Estimated time: " + cups * 3 + " seconds.");

                // callback from smart coffee machine request for coffee
                setTimeout(function () {
                        CoffeeMachine._coffeeReady = true;
                        print(CoffeeMachine._name+": Coffee is ready.");
                    },
                    Time.seconds(cups * 3).value
                );
            }
            public static setJug(state: boolean) {
                CoffeeMachine._jugOut = state;
            }
            public static isCoffeePrepared(): boolean { return CoffeeMachine._coffeeReady; }
        }

        export class SmartBed {
            private static _name = "Smart Bed";
            private static _makeBed: boolean = false;
            public static makeItself() {
                print(SmartBed._name + ": Starts make bed itself...");
                setTimeout(
                    function () {
                        SmartBed._makeBed = true;
                        print(SmartBed._name + ": Make bed is completed.");
                    },
                    Time.seconds(3).value
                );
            }
        }

        export class SmartHeater {
            private static _name = "Smart Heater";
            private static _preparedWater: boolean;
            private static _heatWaterPersons: number;

            public static prepareWater(persons: number) {
                SmartHeater._preparedWater = false;
                SmartHeater._heatWaterPersons = persons;
                print(SmartHeater._name + ": Starts heating water...");

                setTimeout(
                    function () {
                        SmartHeater._preparedWater = true;
                        print(SmartHeater._name + ": Water for bath is ready.");
                    },
                    Time.seconds(persons * 7).value
                );
            }

            public static isPrepared(): boolean { return SmartHeater._preparedWater; }
        }

        export class AirCondition {
            private static _name = "Air Condition";
            private static _turn: boolean = false;
            private static _temperature: number = 20;

            public static TurnOn(temperature: number) {
                AirCondition._turn = true;
                AirCondition._temperature = temperature;
                print(AirCondition._name + " is turnt ON in temperature " + AirCondition._temperature + ".");
            }

            public static TurnOff() {
                AirCondition._turn = false;
                print(AirCondition._name + " is turnt OFF.");
            }
        }

        export class Thermometer {
            private static _name= "Thermometer";
            private static _temperature: number = 16;

            public static getTemperature() {
                print(Thermometer._name + ": temperature == " + Thermometer._temperature);
                return Thermometer._temperature;
            }
        }

        export class TV {
            private static _name= "TV";
            private static _status: boolean = false;
            private static _channel: string = null;

            public static TurnOn() {
                print(TV._name + ": Turn ON.");
                TV._status = true;
            }

            public static watchChannel(channelName: string) {
                print(TV._name + ": Start view channel: " + channelName + ".");
                TV._channel = channelName;
            }

            public static TurnOff() {
                print(TV._name + ": Turn OFF.");
                TV._status = false;
            }
        }

        export class HiFi {
            private static _name = "HI-FI";
            private static _status: boolean = false;
            private static _music: string;

            public static TurnOn() {
                print(HiFi._name + ": Turn ON.");
                HiFi._status = true;
            }

            public static playMusic(music: string) {
                print(HiFi._name + ": Start play music: " + music + ".");
                HiFi._music = music;
            }

            public static TurnOff() {
                print(HiFi._name + ": Turn OFF.");
                HiFi._status = false;
            }
        }

        export class WindowBlinds {
            private static _name = "Window Blinds";
            private static _blinds: boolean = false;

            public static open() {
                print(WindowBlinds._name + ": Open.");
                WindowBlinds._blinds = true;
            }
            public static close() {
                print(WindowBlinds._name + ": Close.");
                WindowBlinds._blinds = false;
            }
            public static isOpen() { return WindowBlinds._blinds; }
        }

        export class WindowDoor {
            private static _name= "Window Door";
            private static _isOpen: boolean = false;

            public static open() {
                print(WindowDoor._name + ": Open.");
                WindowDoor._isOpen = true;
            }
            public static close() {
                print(WindowDoor._name + ": Close.");
                WindowDoor._isOpen = false;
            }
            public static isOpen() { return WindowDoor._isOpen; }
        }

        export class WeatherForecast {
            private static _name = "WeatherForecast";
            private static _rains: boolean = false;

            public static setRains(rains: boolean) {
                print(WeatherForecast._name + ": rain status changed -> " + (rains ? "rains" : "not rains"));
                WeatherForecast._rains = rains;
            }

            public static detectsRains() {
                print(WeatherForecast._name + ": check rains == " + (WeatherForecast._rains ? "true" : "false") + ".");
                return WeatherForecast._rains;
            }
        }

        export class AlarmClock {
            private static _name = "AlarmClock";
            private static _alarms: boolean= false;
            
            public static alarms(): boolean {
                //print(AlarmClock._name + ": check if alarmclock == " + (AlarmClock._alarms ? "true" : "false") + ".");
                return AlarmClock._alarms;
            }

            public static rings(): void {
                print(AlarmClock._name + ": Start Alarms....");
                AlarmClock._alarms = true;
            }

            public static stop(): void {
                print(AlarmClock._name + ": Stoped By User");
                AlarmClock._alarms = false;
            }

            public static ringsMsg(msg: string) {
                /* playMsgRequest(); */
                print(AlarmClock._name + ": rings message ->" + msg + ".");
            }

            public static setAlarmLater(time: number) {
                /* changes time for one day later */
                print(AlarmClock._name + ": rings alarm later (Weekend) " + time + ".");
            }
        }
        
        export class DoorBell {
            public static Rings: boolean = false;
        }

        export class SmartPhone {
            public static ViewMsg: boolean = false;
            public static ReceivedMsg: string = null;
        }

        export class SmartDoor {
            private static _name = "Smart Door";
            public static isOpen: boolean = false;

            public static open(): boolean {
                print(SmartDoor._name + ": Open.");
                SmartDoor.isOpen = true;
                return true;
            }

            public static close(): boolean {
                print(SmartDoor._name + ": Open.");
                SmartDoor.isOpen = false;
                return true;
            }
        }

        export class SmartBathroomDoor {
            private static _name = "Smart Bathroom Door";
            public static isOpen: boolean = false;

            public static open(): boolean {
                print(SmartBathroomDoor._name + ": Open.");
                SmartBathroomDoor.isOpen = true;
                return true;
            }

            public static close(): boolean {
                print(SmartBathroomDoor._name + ": Close.");
                SmartBathroomDoor.isOpen = false;
                return true;
            }
        }
    }

    /**
     * Envinronment Events for Smart Day
     */
    class SmartDay {
        public static get GROUP_GOOD_MORNING(): string { return 'groupGoodMorning'; }
        public static get EVENT_ALARMCLOCK_DAILY(): string { return 'eventAlarmClockDaily'; }
        public static get EVENT_ALARM_RINGS_LATER_ON_WEEKEND(): string { return 'eventAlarmRingsLaterOnWeekend'; }
        public static get EVENT_ALARMCLOCK_WEEKEND(): string { return 'eventAlarmClockWeekend'; }
        public static get EVENT_ALARMCLOCK_ALARMS(): string { return 'eventAlarmClockAlarms'; }
        public static get EVENT_WHEN_COFFEE_ISPREPARED(): string { return 'eventCoffeeIsPrepared'; }
        public static get EVENT_WHEN_COFFEE_JUG_OUT(): string { return 'eventCoffeeJugOut'; }
        public static get EVENT_CLOSE_WINDOW_DOOR(): string { return 'eventCloseWindowDoor'; }
        public static get EVENT_OPENS_BATHROOM_DOOR(): string { return 'eventOpenBathroomDoor'; }
        public static get EVENT_CLOSE_SECOND_BATHROOM_DOOR(): string { return 'eventClose2ndBathroomDoor'; }
        public static get EVENT_WHEN_WATER_ISPREPARED(): string { return 'eventWaterIsPrepared'; }
        
        /**
         *  Group of Environment Events for a Smart GoodMorning
         */
        public static groupGoodMorningEvents() {
            EVENTSOL.EnvEventSys.CreateGroup(SmartDay.GROUP_GOOD_MORNING);

            EVENTSOL.EnvEventSys.CreateEventEvery(
                SmartDay.EVENT_ALARMCLOCK_DAILY,
                SmartDay.GROUP_GOOD_MORNING,
                true,
                function () {
                    print("------------------------------------------------------------------------------------------");
                    print("> Day " + SmartObjects.Calendar.getDay() + ":");
                    
                    if (SmartObjects.Calendar.getDay() == 'SATURDAY' || SmartObjects.Calendar.getDay() == 'SUNDAY') {
                        SmartObjects.AlarmClock.setAlarmLater(2);
                        EVENTSOL.EnvEventSys.TurnOnEvent(SmartDay.EVENT_ALARM_RINGS_LATER_ON_WEEKEND, SmartDay.GROUP_GOOD_MORNING);
                    }
                    else {
                        SmartObjects.AlarmClock.rings();
                    }
                    
                    SmartObjects.Calendar.next();
                },
                Time.seconds(30)
            );
            
            EVENTSOL.EnvEventSys.CreateEventAfter(
                SmartDay.EVENT_ALARM_RINGS_LATER_ON_WEEKEND,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () {
                    print("Late Wake Up is fired: Weekend days.");
                    SmartObjects.AlarmClock.rings();
                },
                Time.seconds(2)
            );

            // When AlarmClock alarms...

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_ALARMCLOCK_ALARMS,
                SmartDay.GROUP_GOOD_MORNING,
                true, // Event is defined to start as active
                function () { return SmartObjects.AlarmClock.alarms(); },
                function () {
                    SmartObjects.AlarmClock.stop();
                    SmartObjects.CoffeeMachine.prepareCoffee(3);
                    SmartObjects.SmartHeater.prepareWater(2);
                    print("Check if Temperature is less than 19 degrees...");
                    if (SmartObjects.Thermometer.getTemperature() < 19) {
                        SmartObjects.AirCondition.TurnOn(27);
                    }
                }
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                SmartDay.EVENT_ALARMCLOCK_DAILY,
                SmartDay.GROUP_GOOD_MORNING,
                [SmartDay.EVENT_ALARMCLOCK_ALARMS]
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_WHEN_COFFEE_ISPREPARED,
                SmartDay.GROUP_GOOD_MORNING,
                false, // Event is defined to start as NO active
                function () { return SmartObjects.CoffeeMachine.isCoffeePrepared(); },
                function () {
                    SmartObjects.WindowBlinds.open();
                    SmartObjects.AlarmClock.ringsMsg('Your coffee is prepared.');
                }
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_WHEN_WATER_ISPREPARED,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () { return SmartObjects.SmartHeater.isPrepared(); },
                function () {
                    print("Preparation of water heating completed.");
                    setTimeout(
                        function () {
                            print("Bathroom door is open!");
                            SmartObjects.SmartBathroomDoor.open();
                        },
                        Time.seconds(3).value
                    );
                    setTimeout(
                        function () {
                            print("Bathroom door is close!");
                            SmartObjects.SmartBathroomDoor.close();
                        },
                        Time.seconds(5).value
                    );
                    setTimeout(
                        function () {
                            print("Bathroom door is open!");
                            SmartObjects.SmartBathroomDoor.open();
                        },
                        Time.seconds(15).value
                    );
                    setTimeout(
                        function () {
                            print("Bathroom door is close 2nd time!");
                            SmartObjects.SmartBathroomDoor.close();
                        },
                        Time.seconds(17).value
                    );
                    setTimeout(
                        function () {
                            print("Coffee machine jug is out!");
                            SmartObjects.CoffeeMachine.setJug(true);
                        },
                        Time.seconds(20).value
                    );
                    SmartObjects.HiFi.TurnOn();
                    SmartObjects.AlarmClock.ringsMsg("Water is ready for your bath.");
                },
                Time.seconds(1)
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_OPENS_BATHROOM_DOOR,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () { return SmartObjects.SmartBathroomDoor.isOpen; },
                function () {
                    SmartObjects.HiFi.playMusic("Bath Music");
                }
            );

            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensTimes(
                SmartDay.EVENT_CLOSE_SECOND_BATHROOM_DOOR,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () { return SmartObjects.SmartBathroomDoor.isOpen; },
                function () {
                    print("Bath finished, close back the bath door event activated...");
                    SmartObjects.HiFi.TurnOff();
                    SmartObjects.TV.TurnOn();
                    SmartObjects.TV.watchChannel("News");
                },
                2
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                SmartDay.EVENT_CLOSE_WINDOW_DOOR,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () {
                    SmartObjects.WindowDoor.close();
                },
                Time.seconds(10)
            );

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_WHEN_COFFEE_JUG_OUT,
                SmartDay.GROUP_GOOD_MORNING,
                false,
                function () { return SmartObjects.CoffeeMachine.isCoffeeJugOut(); },
                function () {
                    SmartObjects.SmartBed.makeItself();

                    if (SmartObjects.WeatherForecast.detectsRains() == false) {
                        SmartObjects.WindowDoor.open();
                        // 
                        EVENTSOL.EnvEventSys.TurnOnEvent(SmartDay.EVENT_CLOSE_WINDOW_DOOR, SmartDay.GROUP_GOOD_MORNING);
                    }
                }
            );
            
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                SmartDay.EVENT_ALARMCLOCK_ALARMS,
                SmartDay.GROUP_GOOD_MORNING,
                [SmartDay.EVENT_WHEN_COFFEE_ISPREPARED, SmartDay.EVENT_WHEN_WATER_ISPREPARED]
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                SmartDay.EVENT_WHEN_WATER_ISPREPARED,
                SmartDay.GROUP_GOOD_MORNING,
                [SmartDay.EVENT_OPENS_BATHROOM_DOOR]
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                SmartDay.EVENT_OPENS_BATHROOM_DOOR,
                SmartDay.GROUP_GOOD_MORNING,
                [SmartDay.EVENT_CLOSE_SECOND_BATHROOM_DOOR]
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                SmartDay.EVENT_WHEN_COFFEE_ISPREPARED,
                SmartDay.GROUP_GOOD_MORNING,
                [SmartDay.EVENT_WHEN_COFFEE_JUG_OUT]
            );


            
            
        }
        
        public static get GROUP_VISITOR_HOME_ALONE(): string { return 'groupVisitorHomeAlone'; }
        public static get EVENT_DOOR_BELLS(): string { return 'eventDoorBells'; }
        
        /**
         *  Group of Environment Events for Smart Welcome of Visitors When I am not at home
         */
        groupWelcomeVisitorHomeAlone() {
            EVENTSOL.EnvEventSys.CreateGroup(SmartDay.GROUP_VISITOR_HOME_ALONE);

            EVENTSOL.EnvEventSys.CreateEventWhen(
                SmartDay.EVENT_DOOR_BELLS,
                SmartDay.GROUP_VISITOR_HOME_ALONE,
                true,
                function () { return SmartObjects.DoorBell.Rings; },
                function () {
                    
                }
            );
        }
    }

    class TesterEVESOL {
        element: HTMLElement;
        span: HTMLElement;
        timerToken: number;

        testing_Every_EveryFor_EveryWhile_WhenCondition_ReferenceEvents_TurnOnOffs_OneGroup() {
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
                EVENTSOL.Time.seconds(2)
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
                EVENTSOL.Time.seconds(6)
            );

            EVENTSOL.EnvEventSys.CreateEventWhenReferenceHappens(
                '3TimesFertilization5Watering',
                'MyHomeEnvironment',
                true,
                EVENTSOL.EnvEventSys.CreateReferencesTotalHappens([
                    EVENTSOL.EnvEventSys.CreateReferenceSimple('Watering', 5, EVENTSOL.OperatorTypeTimes.GreaterOrEqual),
                    EVENTSOL.EnvEventSys.CreateReferenceSimple('Fertilization', 3, EVENTSOL.OperatorTypeTimes.GreaterOrEqual),
                ]),
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "Time of Exec: " + counter + " Process: DETECTS 3 TIMES FERTILIZATION 5 WATERING.";
                },
                2
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
                EVENTSOL.Time.seconds(4)
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
                EVENTSOL.Time.seconds(2)
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
                EVENTSOL.Time.seconds(2),
                EVENTSOL.Time.seconds(10)
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

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(
                '3TimesFertilization5Watering',
                'MyHomeEnvironment',
                ['3TimesFertilization5Watering']
            );
        }

        testing_After_Recursive_Self_TurnOn() {
            var group = 'MyProgram';
            var SpecificDay = 'SpecificTime';

            EVENTSOL.EnvEventSys.CreateGroup(group);

            EVENTSOL.EnvEventSys.CreateEventAfter(
                SpecificDay,
                group,
                true,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " Process: Specific Time.";
                },
                EVENTSOL.Time.seconds(5)
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SpecificDay, group, [SpecificDay]);
        }

        testing_When_Every() {
            var group = 'GardenCare';
            var evtWhenStopRains = 'whenStopRainsWatering';
            var evtHelperSO1 = 'helperSO1';
            var evtHelperSO2 = 'helperSO2';
            var evtHelperSO3 = 'helperSO3';

            // virtual smart object garden
            var SmartGarden = { stopRains: false };

            EVENTSOL.EnvEventSys.CreateGroup(group);

            EVENTSOL.EnvEventSys.CreateEventWhenEveryFor(
                evtWhenStopRains,
                group,
                true,
                function () { return SmartGarden.stopRains === true; },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " Process: Watering...";
                },
                EVENTSOL.Time.seconds(2),
                EVENTSOL.Time.seconds(10)
                //function () { return SmartGarden.stopRains === true; }
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO1,
                group,
                true,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " --> SmartGarden detects that rain stopped";
                    SmartGarden.stopRains = true;
                },
                EVENTSOL.Time.seconds(10)
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO2,
                group,
                false,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " ------> SmartGarden detects that rains again";
                    SmartGarden.stopRains = false;
                },
                EVENTSOL.Time.seconds(10)
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO3,
                group,
                false,
                function () {
                    /* DO NOTHING: in the end of execution activate watering event */
                },
                EVENTSOL.Time.seconds(1)
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO2]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO2, group, [evtHelperSO3]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO3, group, [evtHelperSO1, evtWhenStopRains]);

        }

        testing_When_Happens() {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRains3Times';
            var evtHelperSO = 'eventHelper';

            var SmartWeatherForecast = { detectsRains: false };

            EVENTSOL.EnvEventSys.CreateGroup(group);

            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensTimes(
                evtWhenRains3Times,
                group,
                true,
                function () { return SmartWeatherForecast.detectsRains; },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains 3 times. Fertilization Process Starts...";
                },
                3
            );

            EVENTSOL.EnvEventSys.CreateEventEvery(
                evtHelperSO,
                group,
                true,
                function () {
                    SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain, status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
                },
                EVENTSOL.Time.seconds(5)
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtWhenRains3Times, group, [evtWhenRains3Times]);
        }

        testing_When_For() {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRainsFor3Seconds';
            var evtHelperSO = 'eventHelper';
            var evtHelperSO1 = 'eventHelper1';
            var evtHelperSO2 = 'eventHelper2';
            var counter = 1;

            var SmartWeatherForecast = { detectsRains: false };

            EVENTSOL.EnvEventSys.CreateGroup(group);

            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensFor(
                evtWhenRains3Times,
                group,
                true,
                function () { return SmartWeatherForecast.detectsRains; },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains 3 times. Fertilization Process Starts...";
                },
                EVENTSOL.Time.seconds(3)
            );

            EVENTSOL.EnvEventSys.CreateEventEvery(
                evtHelperSO,
                group,
                true,
                function () {
                    SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain (every 1 second), status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
                },
                EVENTSOL.Time.seconds(1)
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO1,
                group,
                true,
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status events switch to (every 4 second)";
                },
                EVENTSOL.Time.seconds(10)
            );

            EVENTSOL.EnvEventSys.CreateEventEvery(
                evtHelperSO2,
                group,
                false,
                function () {
                    SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain (every 4 second), status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
                },
                EVENTSOL.Time.seconds(4)
            );

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtWhenRains3Times, group, [evtWhenRains3Times, evtHelperSO, evtHelperSO1]);
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtWhenRains3Times, group, [evtHelperSO2]);

            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO2]);
        }

        testing_When_Wait() {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRainsFor3Seconds';
            var evtHelperSO = 'eventHelper';
            var evtHelperSO1 = 'eventHelper1';
            var evtHelperSO2 = 'eventHelper2';
            
            var SmartWeatherForecast = { detectsRains: false };

            EVENTSOL.EnvEventSys.CreateGroup(group);

            EVENTSOL.EnvEventSys.CreateEventWhenWaitEvery(
                evtWhenRains3Times,
                group,
                true,
                function () { return SmartWeatherForecast.detectsRains; },
                function () {
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains, wait for 3 seconds. Fertilization Process Starts...";
                },
                EVENTSOL.Time.seconds(3),
                EVENTSOL.Time.seconds(2)
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO,
                group,
                true,
                function () {
                    SmartWeatherForecast.detectsRains = true;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Deactivate";
                },
                EVENTSOL.Time.seconds(30)
            );

            EVENTSOL.EnvEventSys.CreateEventEvery(
                evtHelperSO1,
                group,
                true,
                function () {
                    SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status.";
                },
                EVENTSOL.Time.seconds(10)
            );

            EVENTSOL.EnvEventSys.CreateEventAfter(
                evtHelperSO2,
                group,
                true,
                function () {
                    SmartWeatherForecast.detectsRains = false;
                    var el = document.getElementById('content');
                    el.innerHTML = el.innerHTML + "<br/>" + "--> Activate";
                },
                EVENTSOL.Time.seconds(50)
            );
            
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtHelperSO, group, [evtWhenRains3Times]);

            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO2, group, [evtWhenRains3Times]);
        }



        constructor(element: HTMLElement) {
            //this.testing_Every_EveryFor_EveryWhile_WhenCondition_ReferenceEvents_TurnOnOffs_OneGroup();
            // this.testing_After_Recursive_Self_TurnOn();
            // this.testing_When_Every();
            // this.testing_When_Happens();
            // this.testing_When_For();
            // this.testing_When_Wait();
            SmartDay.groupGoodMorningEvents();
        }

        start() {
            EVENTSOL.EnvEventSys.start();
        }

    }

    window.onload = () => {
        var el = document.getElementById('content');
        var tester = new TesterEVESOL(el);
        tester.start();
    };


}