import * as discord from "discord.js";

export * from "./tzHelper";
export * from "./tzListCountry";
export * from "./tzSet";
export * from "./rateSet";
export * from "./board";
export * from "./helper";

export interface Command {
    match: string[];
    argNb: number;
    cb: (msg: discord.Message | discord.PartialMessage, splitMsg: string[]) => void;
}
