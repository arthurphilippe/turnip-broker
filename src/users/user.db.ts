import * as mongoose from "mongoose";

export interface User {
    discordId: string;
    name: string;
    timezone: string;
    store: {
        closes: {
            hours: number;
            minutes: number;
        };
    };
}

export interface DbUser extends mongoose.Document, User {}

export const SchemaUser = new mongoose.Schema({
    discordId: { type: String, unique: true, index: true },
    name: { type: String, required: true },
    timezone: { type: String },
    store: {
        closes: {
            hours: { type: Number, default: 22, min: 0, max: 23 },
            minutes: { type: Number, default: 0, min: 0, max: 59 },
        },
    },
});

export const Db = mongoose.model<DbUser>("Users", SchemaUser);
