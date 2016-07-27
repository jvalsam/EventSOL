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
        
    }
}