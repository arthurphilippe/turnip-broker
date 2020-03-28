import * as discord from "discord.js";
import * as moment from "moment-timezone";
import * as users from "../users";
import { cbWithUser } from "./cbWithUser";
/**
 * Let the user set their own timezone.
 */
async function handler(
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

export const tzSet = cbWithUser.bind(null, handler);
