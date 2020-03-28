import * as discord from "discord.js";

/**
 * Lists all timezones available with moment.js
 */
export function tzHelper(msg: discord.Message | discord.PartialMessage, splitMsg: string[]) {
    let builder: string[] = [
        "Re-run the same command with a search keyword.",
        " The easiest way to find your timezone is by giving me your ISO alpha-2 country code.",
        "Some examples are:",
        "- FR: France;",
        "- IE: Ireland.",
        "More codes at: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2",
    ];
    msg.channel.send(builder.join("\n")).then((msg) => {
        msg.suppressEmbeds();
    });
}
