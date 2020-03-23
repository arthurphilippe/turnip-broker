import * as discord from "discord.js";

const client = new discord.Client();

client.on("ready", () => {
    console.log("ready");
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("message", (msg) => {
    if (!msg.content.startsWith("turnip")) return;

    let splitMsg = msg.content.split(" ");
    if (splitMsg[1] == "set" && splitMsg[2] == "timezone") {
    }

    if (splitMsg[1] == "price") {
        if (splitMsg[2] == "selling") {
        } else if (splitMsg[2] == "bought") {
        }
    }
});
