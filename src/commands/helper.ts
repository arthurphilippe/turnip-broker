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
                "Je suis là pour vous aider à trouver où revendre vos navets au meilleur prix !\nIl suffit que chacun me dise à quel prix son magasin rachète les navets.\nEt si vous n'êtes pas dans le même fuseau horraire que tout le monde : pas de panique (à bord), il y a une commande pour me le préciser ! Regardez vous-même, ci-dessous...\nJ'éspère que vous me trouverez utile !",
        },
        {
            name: "Ce qu'il me manque...",
            value:
                "Je ne peux pas encore vous aider lorsqu'il s'agit de regarder où est-ce que vous pouvez acheter vos navet le moins cher, même s'il y a une commande pour me notifier des prix de vente chez vous.\nJe n'ai pas non plus une orthographe parfaite, il m'arrive de faire des fautes.\nJe pense aussi que ça serait cool si je pouvais notifier ceux qui le veulent lorsqu'il y a des prix de rachat qui peuvent les intéresser.\nEnfin, j'aimerai être traduite entièrement en anglais et français de façon à me rendre utile chez davantage de monde.",
        },
        { name: "\u200B", value: "\u200B" },
        {
            name: "Cours à la vente et au rachat",
            value:
                "`navet!sell <prix>`\nM'indique le prix auquel vous pouvez revendre vos navets sur votre île.\n\n`navet!buy <prix>`\nM'indique le prix auquel vous pouvez acheter des navets à Porcelette, le dimanche.",
        },
        {
            name: "Tableau du cours du navet",
            value:
                "`navet!board`\nAffiche les prix rapportés par tout le monde, dans les magasin encore ouverts, du prix le plus haut au plus bas.",
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
