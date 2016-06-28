namespace EVENTSOL {
    export var totalDefinedEvts = 0;

    export enum EnvironmentEvtStatus {
        EVT_ACTIVE,
        EVT_JNOACTIVE,
        EVT_NOACTIVE
    }

    export class Time {
        private _value: number;

        constructor() {
            this._value = 0;
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