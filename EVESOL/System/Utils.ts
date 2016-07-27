module EVENTSOL {
    
    export class Time {
        private _value: number;

        static DefaultCondTime: Time = new Time(500);

        constructor(timeVal?: number) {
            this._value = timeVal ? timeVal : 0;
        }

        get value(): number { return this._value; }
        set value(value: number) { this._value = value; }

        static now(): number {
            if (!Date.now) {
                Date.now = function now() {
                    return new Date().getTime();
                }
            }
            return Date.now();
        }

        static mseconds(msecs: number): Time {
            if (msecs < 0) {
                console.error("Error: Invalid set of Time with negative number of mili-seconds: " + msecs);
            }
            return new Time(msecs);
        }

        static seconds(secs: number): Time {
            if (secs < 0) {
                console.error("Error: Invalid set of Time with negative number of seconds: " + secs);
            }
            return new Time(secs * 1000);
        }

        static minutes(mins: number): Time {
            if (mins < 0) {
                console.error("Error: Invalid set of Time with negative number of minutes: " + mins);
            }
            return new Time(mins * 1000 * 60);
        }
        
        static hours(hours: number): Time {
            if (hours < 0) {
                console.error("Error: Invalid set of Time with negative number of hours: " + hours);
            }
            return new Time(hours * 1000 * 60 * 60);
        }

        static days(days: number): Time {
            if (days < 0) {
                console.error("Error: Invalid set of Time with negative number of days: " + days);
            }
            return new Time(days * 1000 * 60 * 60 * 24);
        }

        ///////
        
        static accSecond(seconds: number, mseconds: number): Time {
            if (seconds < 0 || mseconds < 0) {
                console.error("Error: Invalid set of Time with negative number of defined hour.");
            }
            return new Time(seconds * 1000 + mseconds);
        }

        static accMinute(minutes: number, seconds: number, mseconds: number): Time {
            if (minutes < 0 || seconds < 0 || mseconds < 0) {
                console.error("Error: Invalid set of Time with negative number of defined hour.");
            }
            return new Time(minutes * 1000 * 60 + seconds * 1000 + mseconds);
        }

        static accHour(hours: number, minutes: number, seconds: number, mseconds: number): Time {
            if (hours < 0 || minutes < 0 || seconds < 0 || mseconds < 0) {
                console.error("Error: Invalid set of Time with negative number of defined hour.");
            }
            return new Time(hours * 1000 * 60 * 60 + minutes * 1000 * 60 + seconds * 1000 + mseconds);
        }

        static accDay(days: number, hours: number, minutes: number, seconds: number, mseconds: number): Time {
            if (days < 0 || hours < 0 || minutes < 0 || seconds < 0 || mseconds < 0) {
                console.error("Error: Invalid set of Time with negative number of defined hour.");
            }
            return new Time(days * 1000 * 60 * 60 * 24 + hours * 1000 * 60 * 60 + minutes * 1000 * 60 + seconds * 1000 + mseconds);
        }
    }
}