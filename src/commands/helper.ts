import * as discord from "discord.js";

/**
 * Lists all timezones available with moment.js
 */
export function helper(msg: discord.Message | discord.PartialMessage, _splitMsg: string[]) {
    let builder: string[] = [
        `Hi! I'm here to help your server keep track of everyone's turnip resell rates.`,
        `Here are the commands you can run.`,
    ];

    let message = new discord.MessageEmbed();
    message.title = "Aide d'utilisation";
    message.addFields([
        {
            name: "A quoi je sers ?",
            value:
                "Je suis là pour vous aider à trouver où revendre vos navets au meilleur prix !\nIl suffit que chacun me dise à quel prix son magasin rachète les navets.\nEt si vous n'êtes pas dans le même fuseau horraire que tout le monde : pas de panique (à bord), il y a une commande pour me le préciser ! Regardez vous-même, ci-dessous...",
        },
        { name: "\u200B", value: "\u200B" },
        {
            name: "Cours à la vente et au rachat",
            value:
                "`navet!sell <prix>`\nM'indique le prix auquel vous pouvez revendre vos navet sur votre île.\n\n`navet!buy <prix>`\nM'indique le prix auquel vous pouvez acheter des navets à Porcelette, le dimanche.",
        },
        {
            name: "Tableau du cours du navet",
            value:
                "`navet!board`\nAffiche les prix rapportés par tout le monde, dans les magasin encore ouverts, du prix le plus haut au plus faible.",
        },
        { name: "\u200B", value: "\u200B" },
        {
            name: "Fuseaux horraires",
            value:
                '`navet!getzones <code pays ISO à deux lettres>`\nAffiche les fuseaux horraires qui existent pour votre pays.\nLe code de la France est : "fr"\n\n`navet!setzone <nom du fuseau>`\nM\'indique le fuseau horraire dans lequel votre île est située. Le nom du fuseau à donner doit être tel que renvoyé par la commande `getzones`.',
        },
    ]);

    msg.channel.send(message);
}
