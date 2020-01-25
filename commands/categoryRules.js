module.exports = {
    name: 'category rules',
    description: 'Get rules of a category of a game',
    execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });
        const terms = args[1].split('|');
        terms.forEach((term, index, array) => { array[index] = term.trim() });
        
        const fetch = require('node-fetch');
        const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
        const body = await response.json();
        if (body.data.length === 0) {
            message.reply('No game found for "' + args[0] + '"')
        } else if (terms.length === 2 && terms[1] !== '') {
            message.reply('Search without sub-category');
        } else {
            let gameID = body.data[0].id;
            let categoryID;
            for (i = 0; i < body.data[0].categories.data.length; i++) {
                if (body.data[0].categories.data[i].name.toLowerCase() == terms[0].toLowerCase()) {
                    categoryID = body.data[0].categories.data[i].id;
					var catName = body.data[0].categories.data[i].name;
                    var catURL = body.data[0].categories.data[i].weblink;
                    var catRules = body.data[0].categories.data[i].rules;
                    break;
                }
            }
            if (categoryID === undefined) {
                message.reply('No category found for "' + terms[0] + '" in ' + body.data[0].names.international);
            } else {
                const rulesEmbed = new Discord.richEmbed()
                    .setColor('#800020')
                    .setTitle('Category Rules')
                    .setThumbnail(body.data[0].assets['cover-medium'].uri)
                    .setURL(catURL)
                    .setAuthor(body.data[0].names.international + ' - ' + catName)
                    .setDescription(catRules)
                    .setTimestamp();
                
                message.channel.send(rulesEmbed);
            }
        }
    }
};