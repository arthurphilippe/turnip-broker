export * from "./rates.db";
// export const commands = [{ "": undefined }, {}];

import * as moment from "moment-timezone";

export function generateBounds(tz: string) {
    let now: moment.Moment;
    let from: moment.Moment;
    let to: moment.Moment;

    try {
        now = moment().tz(tz);
        from = moment().tz(tz);
        to = moment().tz(tz);

        if (now.hours() < 12) {
            from.startOf("day");
            to.hours(11);
            to.endOf("hour");
        } else {
            from.hours(12);
            from.startOf("hour");
            to.endOf("day");
        }
        return { to, from };
    } catch (err) {
        console.error(err);
        throw new Error("There was an problem when dealing with timezones...");
    }
}
