declare module EVENTSOL {
    class Time {
        private _value;
        static DefaultCondTime: Time;
        constructor(timeVal?: number);
        value: number;
        static now(): number;
    }
}
