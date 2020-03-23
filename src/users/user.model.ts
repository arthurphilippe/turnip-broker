import * as mongoose from "mongoose";

export interface User {
    discordId: string;
    name: string;
    timezone: string;
}

export interface DbUser extends mongoose.Document {}

export const SchemaUser = new mongoose.Schema({
    discordId: { type: String, unique: true },
    name: { type: String, required: true },
    timezone: { type: String },
});

export const Users = mongoose.model<DbUser>("Users", SchemaUser);
