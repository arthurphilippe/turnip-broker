import * as moment from "moment-timezone";
import * as users from "./users";
import * as rates from "./rates";
import * as assert from "assert";

import * as discord from "discord.js";

const client = new discord.Client();

client.on("ready", () => {
    console.log("ready");
    client.user.setPresence({ activity: { name: 'faites : "navet!aled"' } });
});
client.login(process.env.DISCORD_BOT_TOKEN);

import * as mongoose from "mongoose";

mongoose
    .connect(process.env.MONGO_URL || `mongodb://root:example@localhost/turnip`, {
        useNewUrlParser: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log("mongo OK");
    })
    .catch(console.error);

import * as commands from "./commands";

const cmds: commands.Command[] = [
    { match: ["getzones"], argNb: 1, cb: commands.tzListCountry },
    { match: ["getzones"], argNb: 0, cb: commands.tzHelper },
    { match: ["setzone"], argNb: 1, cb: commands.tzSet },
    { match: ["sell"], argNb: 1, cb: commands.setSellingRate },
    { match: ["buy"], argNb: 1, cb: commands.setBuyingRate },
    { match: ["board"], argNb: 0, cb: commands.board },
    { match: [""], argNb: 0, cb: commands.helper },
    { match: ["aled"], argNb: 0, cb: commands.helper },
    { match: ["help"], argNb: 0, cb: commands.helper },
    // { match: ["sold"], argNb: 1, cb: () => {} },
    // { match: ["bought"], argNb: 1, cb: () => {} },
    // { match: [], argNb: 0, cb: () => {} },
];

/**
 * Indicates a match between a command and the message inputed.
 */
function cmdPredicate(split: string[], cmd: commands.Command): boolean {
    if (split.length >= cmd.match.length + cmd.argNb) {
        let i = 0;
        for (let toMatch of cmd.match) {
            if (toMatch != split[i++]) return false;
        }
        return true;
    } else {
        return false;
    }
}

client.on("message", (msg) => {
    let split = msg.content.split(" ");
    if (!split.length || !split[0].startsWith("navet!")) return;
    try {
        split[0] = split[0].split("!")[1] || "";
    } catch {
        split[0] = "";
    }
    for (let cmd of cmds) {
        if (cmdPredicate(split, cmd)) {
            let nbToShift = cmd.match.length;
            while (nbToShift--) {
                split.shift();
            }
            cmd.cb(msg, split);
            return;
        }
    }
});
