import * as discord from "discord.js";
import * as moment from "moment-timezone";

/**
 * Only lists the timezones of a specific country
 */
export async function tzListCountry(
    msg: discord.Message | discord.PartialMessage,
    splitMsg: string[]
) {
    try {
        await msg.channel.send(
            `Les fuseaux que j'ai trouvé avec le code pays (ISO à deux chiffre) "${splitMsg[0]}" sont les suivants:\n` +
                moment.tz.zonesForCountry(splitMsg[0]).join("\n")
        );
    } catch {
        try {
            let builder: string[] = ["Voici les résulats de votre recherche de fuseau horraire :"];
            moment.tz.names().forEach((element) => {
                if (element.toLowerCase().includes(splitMsg[0].toLowerCase()))
                    builder.push(element);
            });
            // await msg.channel.send(builder.join("\n"));
            msg.channel.send(
                "Car que vous m'avez envoyé n'est pas un code pays, je vais effectuer une recherche syntaxique sur les données dont je dispose.\n" +
                    "Etant donné que les résultats peuvent être très long, je vous les envoies en MP."
            );
            await msg.author.send(builder.join("\n"));
        } catch {
            msg.channel
                .send(
                    "Les résultats sont trop long pour que je vous les affiche sur Discord. Pouvez-vous préciser votre recherche ou utiliser le code à deux chiffre de votre pays ?"
                )
                .catch(console.error);
        }
    }
}
