import * as discord from "discord.js";
import * as users from "../users";
import * as assert from "assert";

/**
 * Gets the current user before calling the command handler
 */
export async function cbWithUser(
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
            msg.channel.send(
                "Je ne pense pas vous avoir vu jusqu'alors, ainsi j'ai pris la liberté de noter que vous êtes dans le fuseau horraire de Paris. Vous pouvez changer ceci en regardant les commandes de fuseau horraire en tapant :\n`navet!aled`."
            );
            cb(msg, splitMsg, await user.save());
        } catch (err) {
            console.error(err);
            msg.channel.send(
                "Il y a eu une erreur lorsque j'ai fait appel à ma base de donner pour essayer de me souvenir de vous. C'est n'est pas de votre faute, non non, mais plutôt celle de ma créatrice."
            );
        }
    }
}
