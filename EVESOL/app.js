'use strict';
var EVENTSOL;
(function (EVENTSOL) {
    function print(txt) {
        var el = document.getElementById('content');
        el.innerHTML = el.innerHTML + "<br/>" + txt;
    }
    /**
     * Assuming that Smart Objects handled by appropriate middleware...
     * In programs, Smart Objects are used as JS Objects
     */
    var SmartObjects;
    (function (SmartObjects) {
        var days = ['MONDAY', 'TUESDAY', 'WEDSDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
        var Calendar = (function () {
            function Calendar() {
            }
            Calendar.getDay = function () { return days[Calendar._dayIndex]; };
            Calendar.next = function () {
                Calendar._dayIndex++;
                if (Calendar._dayIndex == 7) {
                    Calendar._dayIndex = 0;
                }
            };
            Calendar._dayIndex = 0;
            return Calendar;
        }());
        SmartObjects.Calendar = Calendar;
        var CoffeeMachine = (function () {
            function CoffeeMachine() {
            }
            CoffeeMachine.isCoffeeJugOut = function () { return CoffeeMachine._jugOut; };
            CoffeeMachine.prepareCoffee = function (cups) {
                CoffeeMachine._coffeeReady = false;
                CoffeeMachine._cups = cups;
                print(CoffeeMachine._name + ": Starts prepare coffee for " + cups + ". Estimated time: " + cups * 3 + " seconds.");
                // callback from smart coffee machine request for coffee
                setTimeout(function () {
                    CoffeeMachine._coffeeReady = true;
                    print(CoffeeMachine._name + ": Coffee is ready.");
                }, EVENTSOL.Time.seconds(cups * 3).value);
            };
            CoffeeMachine.setJug = function (state) {
                CoffeeMachine._jugOut = state;
            };
            CoffeeMachine.isCoffeePrepared = function () { return CoffeeMachine._coffeeReady; };
            CoffeeMachine._name = "Coffee Machine";
            CoffeeMachine._jugOut = false;
            return CoffeeMachine;
        }());
        SmartObjects.CoffeeMachine = CoffeeMachine;
        var SmartBed = (function () {
            function SmartBed() {
            }
            SmartBed.makeItself = function () {
                print(SmartBed._name + ": Starts make bed itself...");
                setTimeout(function () {
                    SmartBed._makeBed = true;
                    print(SmartBed._name + ": Make bed is completed.");
                }, EVENTSOL.Time.seconds(3).value);
            };
            SmartBed._name = "Smart Bed";
            SmartBed._makeBed = false;
            return SmartBed;
        }());
        SmartObjects.SmartBed = SmartBed;
        var SmartHeater = (function () {
            function SmartHeater() {
            }
            SmartHeater.prepareWater = function (persons) {
                SmartHeater._preparedWater = false;
                SmartHeater._heatWaterPersons = persons;
                print(SmartHeater._name + ": Starts heating water...");
                setTimeout(function () {
                    SmartHeater._preparedWater = true;
                    print(SmartHeater._name + ": Water for bath is ready.");
                }, EVENTSOL.Time.seconds(persons * 7).value);
            };
            SmartHeater.isPrepared = function () { return SmartHeater._preparedWater; };
            SmartHeater._name = "Smart Heater";
            return SmartHeater;
        }());
        SmartObjects.SmartHeater = SmartHeater;
        var AirCondition = (function () {
            function AirCondition() {
            }
            AirCondition.TurnOn = function (temperature) {
                AirCondition._turn = true;
                AirCondition._temperature = temperature;
                print(AirCondition._name + " is turnt ON in temperature " + AirCondition._temperature + ".");
            };
            AirCondition.TurnOff = function () {
                AirCondition._turn = false;
                print(AirCondition._name + " is turnt OFF.");
            };
            AirCondition._name = "Air Condition";
            AirCondition._turn = false;
            AirCondition._temperature = 20;
            return AirCondition;
        }());
        SmartObjects.AirCondition = AirCondition;
        var Thermometer = (function () {
            function Thermometer() {
            }
            Thermometer.getTemperature = function () {
                print(Thermometer._name + ": temperature == " + Thermometer._temperature);
                return Thermometer._temperature;
            };
            Thermometer._name = "Thermometer";
            Thermometer._temperature = 16;
            return Thermometer;
        }());
        SmartObjects.Thermometer = Thermometer;
        var TV = (function () {
            function TV() {
            }
            TV.TurnOn = function () {
                print(TV._name + ": Turn ON.");
                TV._status = true;
            };
            TV.watchChannel = function (channelName) {
                print(TV._name + ": Start view channel: " + channelName + ".");
                TV._channel = channelName;
            };
            TV.TurnOff = function () {
                print(TV._name + ": Turn OFF.");
                TV._status = false;
            };
            TV._name = "TV";
            TV._status = false;
            TV._channel = null;
            return TV;
        }());
        SmartObjects.TV = TV;
        var HiFi = (function () {
            function HiFi() {
            }
            HiFi.TurnOn = function () {
                print(HiFi._name + ": Turn ON.");
                HiFi._status = true;
            };
            HiFi.playMusic = function (music) {
                print(HiFi._name + ": Start play music: " + music + ".");
                HiFi._music = music;
            };
            HiFi.TurnOff = function () {
                print(HiFi._name + ": Turn OFF.");
                HiFi._status = false;
            };
            HiFi._name = "HI-FI";
            HiFi._status = false;
            return HiFi;
        }());
        SmartObjects.HiFi = HiFi;
        var WindowBlinds = (function () {
            function WindowBlinds() {
            }
            WindowBlinds.open = function () {
                print(WindowBlinds._name + ": Open.");
                WindowBlinds._blinds = true;
            };
            WindowBlinds.close = function () {
                print(WindowBlinds._name + ": Close.");
                WindowBlinds._blinds = false;
            };
            WindowBlinds.isOpen = function () { return WindowBlinds._blinds; };
            WindowBlinds._name = "Window Blinds";
            WindowBlinds._blinds = false;
            return WindowBlinds;
        }());
        SmartObjects.WindowBlinds = WindowBlinds;
        var WindowDoor = (function () {
            function WindowDoor() {
            }
            WindowDoor.open = function () {
                print(WindowDoor._name + ": Open.");
                WindowDoor._isOpen = true;
            };
            WindowDoor.close = function () {
                print(WindowDoor._name + ": Close.");
                WindowDoor._isOpen = false;
            };
            WindowDoor.isOpen = function () { return WindowDoor._isOpen; };
            WindowDoor._name = "Window Door";
            WindowDoor._isOpen = false;
            return WindowDoor;
        }());
        SmartObjects.WindowDoor = WindowDoor;
        var WeatherForecast = (function () {
            function WeatherForecast() {
            }
            WeatherForecast.setRains = function (rains) {
                print(WeatherForecast._name + ": rain status changed -> " + (rains ? "rains" : "not rains"));
                WeatherForecast._rains = rains;
            };
            WeatherForecast.detectsRains = function () {
                print(WeatherForecast._name + ": check rains == " + (WeatherForecast._rains ? "true" : "false") + ".");
                return WeatherForecast._rains;
            };
            WeatherForecast._name = "WeatherForecast";
            WeatherForecast._rains = false;
            return WeatherForecast;
        }());
        SmartObjects.WeatherForecast = WeatherForecast;
        var AlarmClock = (function () {
            function AlarmClock() {
            }
            AlarmClock.alarms = function () {
                //print(AlarmClock._name + ": check if alarmclock == " + (AlarmClock._alarms ? "true" : "false") + ".");
                return AlarmClock._alarms;
            };
            AlarmClock.rings = function () {
                print(AlarmClock._name + ": Start Alarms....");
                AlarmClock._alarms = true;
            };
            AlarmClock.stop = function () {
                print(AlarmClock._name + ": Stoped By User");
                AlarmClock._alarms = false;
            };
            AlarmClock.ringsMsg = function (msg) {
                /* playMsgRequest(); */
                print(AlarmClock._name + ": rings message ->" + msg + ".");
            };
            AlarmClock.setAlarmLater = function (time) {
                /* changes time for one day later */
                print(AlarmClock._name + ": rings alarm later (Weekend) " + time + ".");
            };
            AlarmClock._name = "AlarmClock";
            AlarmClock._alarms = false;
            return AlarmClock;
        }());
        SmartObjects.AlarmClock = AlarmClock;
        var DoorBell = (function () {
            function DoorBell() {
            }
            DoorBell.Rings = false;
            return DoorBell;
        }());
        SmartObjects.DoorBell = DoorBell;
        var SmartPhone = (function () {
            function SmartPhone() {
            }
            SmartPhone.ViewMsg = false;
            SmartPhone.ReceivedMsg = null;
            return SmartPhone;
        }());
        SmartObjects.SmartPhone = SmartPhone;
        var SmartDoor = (function () {
            function SmartDoor() {
            }
            SmartDoor.open = function () {
                print(SmartDoor._name + ": Open.");
                SmartDoor.isOpen = true;
                return true;
            };
            SmartDoor.close = function () {
                print(SmartDoor._name + ": Open.");
                SmartDoor.isOpen = false;
                return true;
            };
            SmartDoor._name = "Smart Door";
            SmartDoor.isOpen = false;
            return SmartDoor;
        }());
        SmartObjects.SmartDoor = SmartDoor;
        var SmartBathroomDoor = (function () {
            function SmartBathroomDoor() {
            }
            SmartBathroomDoor.open = function () {
                print(SmartBathroomDoor._name + ": Open.");
                SmartBathroomDoor.isOpen = true;
                return true;
            };
            SmartBathroomDoor.close = function () {
                print(SmartBathroomDoor._name + ": Close.");
                SmartBathroomDoor.isOpen = false;
                return true;
            };
            SmartBathroomDoor._name = "Smart Bathroom Door";
            SmartBathroomDoor.isOpen = false;
            return SmartBathroomDoor;
        }());
        SmartObjects.SmartBathroomDoor = SmartBathroomDoor;
    })(SmartObjects || (SmartObjects = {}));
    /**
     * Envinronment Events for Smart Day
     */
    var SmartDay = (function () {
        function SmartDay() {
        }
        Object.defineProperty(SmartDay, "GROUP_GOOD_MORNING", {
            get: function () { return 'groupGoodMorning'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_ALARMCLOCK_DAILY", {
            get: function () { return 'eventAlarmClockDaily'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_ALARM_RINGS_LATER_ON_WEEKEND", {
            get: function () { return 'eventAlarmRingsLaterOnWeekend'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_ALARMCLOCK_WEEKEND", {
            get: function () { return 'eventAlarmClockWeekend'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_ALARMCLOCK_ALARMS", {
            get: function () { return 'eventAlarmClockAlarms'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_WHEN_COFFEE_ISPREPARED", {
            get: function () { return 'eventCoffeeIsPrepared'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_WHEN_COFFEE_JUG_OUT", {
            get: function () { return 'eventCoffeeJugOut'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_CLOSE_WINDOW_DOOR", {
            get: function () { return 'eventCloseWindowDoor'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_OPENS_BATHROOM_DOOR", {
            get: function () { return 'eventOpenBathroomDoor'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_CLOSE_SECOND_BATHROOM_DOOR", {
            get: function () { return 'eventClose2ndBathroomDoor'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_WHEN_WATER_ISPREPARED", {
            get: function () { return 'eventWaterIsPrepared'; },
            enumerable: true,
            configurable: true
        });
        /**
         *  Group of Environment Events for a Smart GoodMorning
         */
        SmartDay.groupGoodMorningEvents = function () {
            EVENTSOL.EnvEventSys.CreateGroup(SmartDay.GROUP_GOOD_MORNING);
            EVENTSOL.EnvEventSys.CreateEventEvery(SmartDay.EVENT_ALARMCLOCK_DAILY, SmartDay.GROUP_GOOD_MORNING, true, function () {
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
            }, EVENTSOL.Time.seconds(30));
            EVENTSOL.EnvEventSys.CreateEventAfter(SmartDay.EVENT_ALARM_RINGS_LATER_ON_WEEKEND, SmartDay.GROUP_GOOD_MORNING, false, function () {
                print("Late Wake Up is fired: Weekend days.");
                SmartObjects.AlarmClock.rings();
            }, EVENTSOL.Time.seconds(2));
            // When AlarmClock alarms...
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_ALARMCLOCK_ALARMS, SmartDay.GROUP_GOOD_MORNING, true, // Event is defined to start as active
            function () { return SmartObjects.AlarmClock.alarms(); }, function () {
                SmartObjects.AlarmClock.stop();
                SmartObjects.CoffeeMachine.prepareCoffee(3);
                SmartObjects.SmartHeater.prepareWater(2);
                print("Check if Temperature is less than 19 degrees...");
                if (SmartObjects.Thermometer.getTemperature() < 19) {
                    SmartObjects.AirCondition.TurnOn(27);
                }
            });
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SmartDay.EVENT_ALARMCLOCK_DAILY, SmartDay.GROUP_GOOD_MORNING, [SmartDay.EVENT_ALARMCLOCK_ALARMS]);
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_WHEN_COFFEE_ISPREPARED, SmartDay.GROUP_GOOD_MORNING, false, // Event is defined to start as NO active
            function () { return SmartObjects.CoffeeMachine.isCoffeePrepared(); }, function () {
                SmartObjects.WindowBlinds.open();
                SmartObjects.AlarmClock.ringsMsg('Your coffee is prepared.');
            });
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_WHEN_WATER_ISPREPARED, SmartDay.GROUP_GOOD_MORNING, false, function () { return SmartObjects.SmartHeater.isPrepared(); }, function () {
                print("Preparation of water heating completed.");
                setTimeout(function () {
                    print("Bathroom door is open!");
                    SmartObjects.SmartBathroomDoor.open();
                }, EVENTSOL.Time.seconds(3).value);
                setTimeout(function () {
                    print("Bathroom door is close!");
                    SmartObjects.SmartBathroomDoor.close();
                }, EVENTSOL.Time.seconds(5).value);
                setTimeout(function () {
                    print("Bathroom door is open!");
                    SmartObjects.SmartBathroomDoor.open();
                }, EVENTSOL.Time.seconds(15).value);
                setTimeout(function () {
                    print("Bathroom door is close 2nd time!");
                    SmartObjects.SmartBathroomDoor.close();
                }, EVENTSOL.Time.seconds(17).value);
                setTimeout(function () {
                    print("Coffee machine jug is out!");
                    SmartObjects.CoffeeMachine.setJug(true);
                }, EVENTSOL.Time.seconds(20).value);
                SmartObjects.HiFi.TurnOn();
                SmartObjects.AlarmClock.ringsMsg("Water is ready for your bath.");
            }, EVENTSOL.Time.seconds(1));
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_OPENS_BATHROOM_DOOR, SmartDay.GROUP_GOOD_MORNING, false, function () { return SmartObjects.SmartBathroomDoor.isOpen; }, function () {
                SmartObjects.HiFi.playMusic("Bath Music");
            });
            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensTimes(SmartDay.EVENT_CLOSE_SECOND_BATHROOM_DOOR, SmartDay.GROUP_GOOD_MORNING, false, function () { return SmartObjects.SmartBathroomDoor.isOpen; }, function () {
                print("Bath finished, close back the bath door event activated...");
                SmartObjects.HiFi.TurnOff();
                SmartObjects.TV.TurnOn();
                SmartObjects.TV.watchChannel("News");
            }, 2);
            EVENTSOL.EnvEventSys.CreateEventAfter(SmartDay.EVENT_CLOSE_WINDOW_DOOR, SmartDay.GROUP_GOOD_MORNING, false, function () {
                SmartObjects.WindowDoor.close();
            }, EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_WHEN_COFFEE_JUG_OUT, SmartDay.GROUP_GOOD_MORNING, false, function () { return SmartObjects.CoffeeMachine.isCoffeeJugOut(); }, function () {
                SmartObjects.SmartBed.makeItself();
                if (SmartObjects.WeatherForecast.detectsRains() == false) {
                    SmartObjects.WindowDoor.open();
                    // 
                    EVENTSOL.EnvEventSys.TurnOnEvent(SmartDay.EVENT_CLOSE_WINDOW_DOOR, SmartDay.GROUP_GOOD_MORNING);
                }
            });
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SmartDay.EVENT_ALARMCLOCK_ALARMS, SmartDay.GROUP_GOOD_MORNING, [SmartDay.EVENT_WHEN_COFFEE_ISPREPARED, SmartDay.EVENT_WHEN_WATER_ISPREPARED]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SmartDay.EVENT_WHEN_WATER_ISPREPARED, SmartDay.GROUP_GOOD_MORNING, [SmartDay.EVENT_OPENS_BATHROOM_DOOR]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SmartDay.EVENT_OPENS_BATHROOM_DOOR, SmartDay.GROUP_GOOD_MORNING, [SmartDay.EVENT_CLOSE_SECOND_BATHROOM_DOOR]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(SmartDay.EVENT_WHEN_COFFEE_ISPREPARED, SmartDay.GROUP_GOOD_MORNING, [SmartDay.EVENT_WHEN_COFFEE_JUG_OUT]);
        };
        Object.defineProperty(SmartDay, "GROUP_VISITOR_HOME_ALONE", {
            get: function () { return 'groupVisitorHomeAlone'; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartDay, "EVENT_DOOR_BELLS", {
            get: function () { return 'eventDoorBells'; },
            enumerable: true,
            configurable: true
        });
        /**
         *  Group of Environment Events for Smart Welcome of Visitors When I am not at home
         */
        SmartDay.prototype.groupWelcomeVisitorHomeAlone = function () {
            EVENTSOL.EnvEventSys.CreateGroup(SmartDay.GROUP_VISITOR_HOME_ALONE);
            EVENTSOL.EnvEventSys.CreateEventWhen(SmartDay.EVENT_DOOR_BELLS, SmartDay.GROUP_VISITOR_HOME_ALONE, true, function () { return SmartObjects.DoorBell.Rings; }, function () {
            });
        };
        return SmartDay;
    }());
    var TesterEVESOL = (function () {
        function TesterEVESOL(element) {
            //this.testing_Every_EveryFor_EveryWhile_WhenCondition_ReferenceEvents_TurnOnOffs_OneGroup();
            // this.testing_After_Recursive_Self_TurnOn();
            // this.testing_When_Every();
            // this.testing_When_Happens();
            // this.testing_When_For();
            // this.testing_When_Wait();
            SmartDay.groupGoodMorningEvents();
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
            EVENTSOL.EnvEventSys.CreateEventWhenEveryFor(evtWhenStopRains, group, true, function () { return SmartGarden.stopRains === true; }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Watering...";
            }, EVENTSOL.Time.seconds(2), EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO1, group, true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " --> SmartGarden detects that rain stopped";
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
        TesterEVESOL.prototype.testing_When_Happens = function () {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRains3Times';
            var evtHelperSO = 'eventHelper';
            var SmartWeatherForecast = { detectsRains: false };
            EVENTSOL.EnvEventSys.CreateGroup(group);
            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensTimes(evtWhenRains3Times, group, true, function () { return SmartWeatherForecast.detectsRains; }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains 3 times. Fertilization Process Starts...";
            }, 3);
            EVENTSOL.EnvEventSys.CreateEventEvery(evtHelperSO, group, true, function () {
                SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain, status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
            }, EVENTSOL.Time.seconds(5));
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtWhenRains3Times, group, [evtWhenRains3Times]);
        };
        TesterEVESOL.prototype.testing_When_For = function () {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRainsFor3Seconds';
            var evtHelperSO = 'eventHelper';
            var evtHelperSO1 = 'eventHelper1';
            var evtHelperSO2 = 'eventHelper2';
            var counter = 1;
            var SmartWeatherForecast = { detectsRains: false };
            EVENTSOL.EnvEventSys.CreateGroup(group);
            EVENTSOL.EnvEventSys.CreateEventWhenConditionHappensFor(evtWhenRains3Times, group, true, function () { return SmartWeatherForecast.detectsRains; }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains 3 times. Fertilization Process Starts...";
            }, EVENTSOL.Time.seconds(3));
            EVENTSOL.EnvEventSys.CreateEventEvery(evtHelperSO, group, true, function () {
                SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain (every 1 second), status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
            }, EVENTSOL.Time.seconds(1));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO1, group, true, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status events switch to (every 4 second)";
            }, EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventEvery(evtHelperSO2, group, false, function () {
                SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status of rain (every 4 second), status == " + (SmartWeatherForecast.detectsRains ? 'rains' : 'not rains');
            }, EVENTSOL.Time.seconds(4));
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtWhenRains3Times, group, [evtWhenRains3Times, evtHelperSO, evtHelperSO1]);
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtWhenRains3Times, group, [evtHelperSO2]);
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO1, group, [evtHelperSO2]);
        };
        TesterEVESOL.prototype.testing_When_Wait = function () {
            var group = 'gardenCare';
            var evtWhenRains3Times = 'WhenRainsFor3Seconds';
            var evtHelperSO = 'eventHelper';
            var evtHelperSO1 = 'eventHelper1';
            var evtHelperSO2 = 'eventHelper2';
            var SmartWeatherForecast = { detectsRains: false };
            EVENTSOL.EnvEventSys.CreateGroup(group);
            EVENTSOL.EnvEventSys.CreateEventWhenWaitEvery(evtWhenRains3Times, group, true, function () { return SmartWeatherForecast.detectsRains; }, function () {
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + " Process: Detects that rains, wait for 3 seconds. Fertilization Process Starts...";
            }, EVENTSOL.Time.seconds(3), EVENTSOL.Time.seconds(2));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO, group, true, function () {
                SmartWeatherForecast.detectsRains = true;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Deactivate";
            }, EVENTSOL.Time.seconds(30));
            EVENTSOL.EnvEventSys.CreateEventEvery(evtHelperSO1, group, true, function () {
                SmartWeatherForecast.detectsRains = !SmartWeatherForecast.detectsRains;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Smart Weather Forecast changed status.";
            }, EVENTSOL.Time.seconds(10));
            EVENTSOL.EnvEventSys.CreateEventAfter(evtHelperSO2, group, true, function () {
                SmartWeatherForecast.detectsRains = false;
                var el = document.getElementById('content');
                el.innerHTML = el.innerHTML + "<br/>" + "--> Activate";
            }, EVENTSOL.Time.seconds(50));
            EVENTSOL.EnvEventSys.SetEventsTurnOffFromEnvironmentEvent(evtHelperSO, group, [evtWhenRains3Times]);
            EVENTSOL.EnvEventSys.SetEventsTurnOnFromEnvironmentEvent(evtHelperSO2, group, [evtWhenRains3Times]);
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