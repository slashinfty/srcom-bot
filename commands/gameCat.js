module.exports = {
	name: 'game and category',
	description: 'Get the WR in a specific category of a game',
	execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });

        const fetch = require('node-fetch');
        const respInitial = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
        const initial = await respInitial.json();
        if (initial.data.length === 0) {
            message.reply('no game found');
        } else {
            let categoryID;
            for (i = 0; i < initial.data[0].categories.data.length; i++) {
                if (initial.data[0].categories.data[i].name.toLowerCase() == args[1].toLowerCase()) {
                    categoryID = initial.data[0].categories.data[i].id;
                    break;
                }
            }
            
            if (categoryID === undefined) {
                message.reply('no category found');
            } else {
                const response = await fetch(`https://www.speedrun.com/api/v1/categories/${categoryID}/records?top=1&embed=game,category,players,regions,platforms`);
                const body = await response.json();
        
                let region = body.data[0].regions.data.length > 0 ? ' - ' + body.data[0].regions.data[0].name : '';
                let emu = body.data[0].runs[0].run.system.emulated ? ' [EMU]' : '';
        
                const time = require('../seconds.js');
                const embed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle(time.convert(body.data[0].runs[0].run.times.primary_t) + ' by ' + body.data[0].players.data[0].names.international)
                    .setThumbnail(body.data[0].game.data.assets['cover-medium'].uri)
                    .setURL(body.data[0].runs[0].run.weblink)
                    .setAuthor(body.data[0].game.data.names.international + ' - ' + body.data[0].category.data.name)
                    .addField('Date Played:', body.data[0].runs[0].run.date)
                    .addField('Played On:', body.data[0].platforms.data[0].name + region + emu)
                    .setTimestamp();
        
                message.channel.send(embed);
            }
        }
	}
};