import * as discord from "discord.js";
import * as moment from "moment-timezone";
import * as users from "./users";
import * as rates from "./rates";
import * as assert from "assert";
import * as mongoose from "mongoose";

const client = new discord.Client();

client.on("ready", () => {
    console.log("ready");
});

mongoose
    .connect(process.env.MONGO_URL || `mongodb://root:example@localhost`, {
        db: process.env.MONGO_DBNAME || `turnip`,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        authSource: "admin",
        useCreateIndex: true,
    })
    .then(() => {
        console.log("mongo OK");
    })
    .catch(console.error);

client.login(process.env.DISCORD_BOT_TOKEN);

enum Actions {
    getTimezones,
    setTimezone,
    setSellingPrice,
    setSoldPrice,
    setBuyingPrice,
    setBoughtPrice,
}

interface Command {
    match: string[];
    argNb: number;
    cb: (msg: discord.Message | discord.PartialMessage, splitMsg: string[]) => void;
}

/**
 * Lists all timezones available with moment.js
 */
function tzHelper(msg: discord.Message | discord.PartialMessage, splitMsg: string[]) {
    let builder: string[] = [
        'Re-run this command with the region of the world your game is set to (i.e. "Europe")',
        "`turnip get zones Europe`",
    ];

    msg.channel.send(builder.join("\n"));
}

/**
 * Only lists the timezones of a specific country
 */
async function listCountryTz(msg: discord.Message | discord.PartialMessage, splitMsg: string[]) {
    try {
        await msg.channel.send(moment.tz.zonesForCountry(splitMsg[0]).join("\n"));
    } catch {
        try {
            let builder: string[] = ["Here is a list of available timezones matching your search."];
            moment.tz.names().forEach((element) => {
                if (element.toLowerCase().includes(splitMsg[0].toLowerCase()))
                    builder.push(element);
            });
            // await msg.channel.send(builder.join("\n"));
            await msg.author.send(builder.join("\n"));
        } catch {
            msg.channel
                .send(
                    "Zone query too broad for a discord message. Please refine your search keyword."
                )
                .catch(console.error);
        }
    }
}

/**
 * Let the user set their own timezone.
 */
async function setUserTz(
    msg: discord.Message | discord.PartialMessage,
    splitMsg: string[],
    user: users.DbUser
) {
    let tzInfo: string;
    try {
        tzInfo = moment.tz(splitMsg[0]).format("Z z");
    } catch (err) {
        msg.channel.send(
            `I wasn't able to change your time zone to ${splitMsg[0]}. I encourage you to check its spelling.`
        );
        return;
    }
    user.timezone = splitMsg[0];
    try {
        await user.save();
    } catch (err) {
        msg.channel.send(
            "I wasn't able to save the changes to my database. I'd like it if you'd try again in a few."
        );
        return;
    }
    msg.channel.send(
        `Your timezone has been set to ${splitMsg[0]}. That's to say: ${tzInfo} (as of now).`
    );
}

/**
 * Let the user report their selling rate
 */
async function setSellingRate(
    msg: discord.Message | discord.PartialMessage,
    splitMsg: string[],
    user: users.DbUser
) {
    let now = moment()
        .tz(user.timezone)
        .toDate();

    let delRes = await rates.Db.deleteMany({
        user: user._id,
        from: { $lte: now },
        to: { $gte: now },
    });
    if (delRes && delRes.deletedCount) {
        msg.channel.send(`Deleted ${delRes.deletedCount} prior report for same time period.`);
    }
    await rates.Db.add(user, msg.guild.id, parseInt(splitMsg[0]), rates.Kind.selling);
    msg.channel.send("Your store is accepting turnips at " + splitMsg[0]);
}

/**
 * Let the user report their buying rate
 */
async function setBuyingRate(
    msg: discord.Message | discord.PartialMessage,
    splitMsg: string[],
    user: users.DbUser
) {
    let now = moment()
        .tz(user.timezone)
        .toDate();

    let delRes = await rates.Db.deleteMany({
        user: user._id,
        from: { $lte: now },
        to: { $gte: now },
    });
    if (delRes && delRes.deletedCount) {
        msg.channel.send(`Deleted ${delRes.deletedCount} prior report for same time period.`);
    }
    await rates.Db.add(user, msg.guild.id, parseInt(splitMsg[0]), rates.Kind.buying);
    msg.channel.send("Your store is selling you turnips at " + splitMsg[0]);
}

async function status(
    msg: discord.Message | discord.PartialMessage,
    _splitMsg: string[],
    user: users.DbUser
) {
    let now = moment()
        .tz(user.timezone)
        .toDate();
    let ratesInEffect: rates.DbRate[];
    try {
        ratesInEffect = await rates.Db.find({
            kind: rates.Kind.selling,
            guildId: msg.guild.id,
            from: { $lte: now },
            to: { $gte: now },
        })
            .sort({
                price: -1,
            })
            .populate("user", "name");
    } catch (err) {
        console.error("Rates retrival");
        console.error(err);
        msg.channel.send("Something is preventing me from retriving the rates in store...");
        return;
    }

    if (!ratesInEffect || !ratesInEffect.length) {
        msg.channel.send("No rates to display as of now...");
    } else {
        let builder: string[] = ["Here are the rates you can sell at, right now:"];
        ratesInEffect.forEach((rate) => {
            let islander = rate.user as users.User;

            builder.push(
                `- ${rate.price} bells on ${islander.name}'s island till ${moment(rate.to)
                    .tz(user.timezone)
                    .locale("en-gb")
                    .calendar()}.`
            );
        });
        msg.channel.send(builder.join("\n"));
    }
}

/**
 * Gets the current user before calling the command handler
 */
async function cbWithUser(
    cb: Function,
    msg: discord.Message | discord.PartialMessage,
    splitMsg: string[]
) {
    let user: users.DbUser;
    try {
        user = await users.Db.findOne({ discordId: msg.author.id });
        assert(user);
        cb(msg, splitMsg, user);
    } catch {
        try {
            user = new users.Db();
            user.discordId = msg.author.id;
            user.name = msg.author.username;
            user.timezone = "Europe/Paris";
            cb(msg, splitMsg, await user.save());
        } catch (err) {
            console.error(err);
            msg.channel.send(
                "There was an issue when mapping you with my database. I cannot proceed."
            );
        }
    }
}

const commands: Command[] = [
    { match: ["get", "zones"], argNb: 1, cb: listCountryTz },
    { match: ["get", "zones"], argNb: 0, cb: tzHelper },
    { match: ["set", "zone"], argNb: 1, cb: cbWithUser.bind(null, setUserTz) },
    { match: ["sell"], argNb: 1, cb: cbWithUser.bind(null, setSellingRate) },
    { match: ["selling"], argNb: 1, cb: cbWithUser.bind(null, setSellingRate) },
    { match: ["buy"], argNb: 1, cb: cbWithUser.bind(null, setBuyingRate) },
    { match: ["buying"], argNb: 1, cb: cbWithUser.bind(null, setBuyingRate) },
    { match: [], argNb: 0, cb: cbWithUser.bind(null, status) },
    // { match: ["sold"], argNb: 1, cb: () => {} },
    // { match: ["bought"], argNb: 1, cb: () => {} },
    // { match: [], argNb: 0, cb: () => {} },
];

/**
 * Indicates a match between a command and the message inputed.
 */
function cmdPredicate(split: string[], cmd: Command): boolean {
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
    if (!split.length || split[0] != "turnip") return;
    split.shift();
    for (let cmd of commands) {
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
