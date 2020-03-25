import * as mongoose from "mongoose";
import * as users from "../users";
import * as moment from "moment-timezone";

export enum Kind {
    selling = 1,
    buying = 2,
}

export interface Rate {
    price: number;
    discordId: { user: string; guild: string };
    kind: Kind;
    from: Date;
    to: Date;
}

export interface DbRate extends mongoose.Document, Rate {}

interface Model extends mongoose.Model<DbRate> {
    add: (user: users.DbUser, guildId: string, price: number, kind: Kind) => Promise<void>;
}

export const SchemaRate = new mongoose.Schema({
    price: { type: Number },
    discordId: {
        user: { type: String },
        guild: { type: String },
    },
    kind: { type: Number, required: true },
    from: { type: Date },
    to: { type: Date },
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
                to.endOf("day");
            }
        } else {
            from.startOf("day");
            to.endOf("day");
        }
    } catch (err) {
        console.error(err);
        throw new Error("There was an problem when dealing with timezones...");
    }

    try {
        await this.create({
            price,
            discordId: { user: user.discordId, guild: guildId },
            kind,
            from: from.toDate(),
            to: to.toDate(),
        } as Rate);
    } catch (err) {
        console.error(err);
        throw new Error("Cannot commit to database...");
    }
});

export const Db = mongoose.model<DbRate, Model>("Rates", SchemaRate);
