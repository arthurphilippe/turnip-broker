import * as discord from "discord.js";
import * as moment from "moment-timezone";
import * as users from "../users";
import * as rates from "../rates";
import { cbWithUser } from "./cbWithUser";
import * as assert from "assert";

async function handler(
    msg: discord.Message | discord.PartialMessage,
    _splitMsg: string[],
    user: users.DbUser
) {
    try {
        assert(msg.guild);
        assert(msg.guild.id);
    } catch {
        msg.channel.send(
            "Il me semble que nous sommes en messages privés, or le tableau du prix du navet n'existe que au sein d'un serveur."
        );
        return;
    }

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
        msg.channel.send("Quelque chose m'empêche de regarder le cours du navet...");
        return;
    }
    if (!ratesInEffect || !ratesInEffect.length) {
        msg.channel.send(
            "Il n'y a encore rien à afficher ici... Soit parce que tous les magasins sont clos, soit parce que personne n'a indiqué le prix du navet chez lui."
        );
    } else {
        let builder: string[] = [
            `Voici le cours du navet actuel (montré tel que pour le fuseau : ${user.timezone}) :`,
        ];
        ratesInEffect.forEach((rate) => {
            let islander = rate.user as users.User;
            let till = moment(rate.to)
                .tz(user.timezone)
                .locale("fr-fr");
            builder.push(
                `- ${rate.price} clo. sur l'île de ${
                    islander.name
                } jusqu'à ${till.calendar().toLowerCase()}.`
            );
        });
        msg.channel.send(builder.join("\n"));
    }
}

export const board = cbWithUser.bind(null, handler);
