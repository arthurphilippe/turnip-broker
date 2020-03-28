import * as mongoose from "mongoose";
import * as users from "../users";
import * as moment from "moment-timezone";

export enum Kind {
    selling = 1,
    buying = 2,
}

export interface Rate {
    price: number;
    user: mongoose.Types.ObjectId | users.DbUser;
    guildId: string;
    kind: Kind;
    from: Date;
    to: Date;
}

export interface DbRate extends mongoose.Document, Rate {}

interface Model extends mongoose.Model<DbRate> {
    add: (user: users.DbUser, guildId: string, price: number, kind: Kind) => Promise<void>;
}

export const SchemaRate = new mongoose.Schema({
    price: { type: Number, min: 1, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: users.Db, required: true },
    guildId: { type: String, required: true },
    kind: { type: Number, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
});

SchemaRate.static("add", async function(
    this: mongoose.Model<DbRate>,
    user: users.DbUser,
    guildId: string,
    price: number,
    kind: Kind
) {
    let now: moment.Moment;
    let from: moment.Moment;
    let to: moment.Moment;

    try {
        now = moment().tz(user.timezone);
        from = moment().tz(user.timezone);
        to = moment().tz(user.timezone);

        if (kind == Kind.selling) {
            if (now.hours() < 12) {
                from.startOf("day");
                to.hours(11);
                to.endOf("hour");
            } else {
                from.hours(12);
                from.startOf("hour");
                to.hours(user.store.closes.hours);
                to.minutes(user.store.closes.minutes);
                to.startOf("minute");
            }
        } else {
            from.startOf("day");
            to.hour(12);
            to.startOf("hour");
        }
    } catch (err) {
        console.error(err);
        throw new Error("There was an problem when dealing with timezones...");
    }

    try {
        await this.create({
            user: user._id,
            price,
            guildId,
            kind,
            from: from.toDate(),
            to: to.toDate(),
        } as Rate);
    } catch (err) {
        throw new Error(`Failed to create rate/price. Message from the drive:\n` + err.message);
    }
});

export const Db = mongoose.model<DbRate, Model>("Rates", SchemaRate);
