declare module EVENTSOL {
    class Time {
        private _value;
        static DefaultCondTime: Time;
        constructor(timeVal?: number);
        value: number;
        static now(): number;
        static mseconds(msecs: number): Time;
        static seconds(secs: number): Time;
        static minutes(mins: number): Time;
        static hours(hours: number): Time;
        static days(days: number): Time;
        static accSecond(seconds: number, mseconds: number): Time;
        static accMinute(minutes: number, seconds: number, mseconds: number): Time;
        static accHour(hours: number, minutes: number, seconds: number, mseconds: number): Time;
        static accDay(days: number, hours: number, minutes: number, seconds: number, mseconds: number): Time;
    }
}
