module.exports = {
	name: 'game only',
	description: 'Get the WR in a game’s main category',
	execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });

        const fetch = require('node-fetch');
        const respInitial = await fetch(`https://www.speedrun.com/api/v1/games?${filter}`);
        const initial = await respInitial.json();
        if (initial.data.length === 0) {
            message.reply('No game found for "' + args[0] + '"');
        } else {
            let gameID = initial.data[0].id;
        
            const response = await fetch(`https://www.speedrun.com/api/v1/games/${gameID}/records?miscellaneous=no&scope=full-game&top=1&embed=game,category,players,platforms,regions`);
            const body = await response.json();
            
            if (body.data[0].runs.length === 0) {
                message.reply(body.data[0].game.data.names.international + ' has no runs');
            } else {
                let platform = body.data[0].platforms.data.length > 0 ? body.data[0].platforms.data[0].name : '';
                let region = body.data[0].regions.data.length > 0 ? ' - ' + body.data[0].regions.data[0].name : '';
                let emu = body.data[0].runs[0].run.system.emulated ? ' [EMU]' : '';
                let runnerName = body.data[0].players.data[0].rel === 'user' ? body.data[0].players.data[0].names.international : body.data[0].players.data[0].name;
        
                const time = require('../seconds.js');
                const embed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle(time.convert(body.data[0].runs[0].run.times.primary_t) + ' by ' + runnerName)
                    .setThumbnail(body.data[0].game.data.assets['cover-medium'].uri)
                    .setURL(body.data[0].runs[0].run.weblink)
                    .setAuthor(body.data[0].game.data.names.international + ' - ' + body.data[0].category.data.name)
                    .addField('Date Played:', body.data[0].runs[0].run.date)
                    .addField('Played On:', platform + region + emu)
                    .setTimestamp();
        
                message.channel.send(embed);
            }
        }
	}
};