module.exports = {
	name: 'all categories',
	description: 'Get all categories for a game',
	execute: async function (Discord, message, args) {
        if (args[1].length > 2) {
            message.reply('invalid command');
        } else {
            const querystring = require('querystring');
            const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });

            const fetch = require('node-fetch');
            const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
            const body = await response.json();
            if (body.data.length === 0) {
                message.reply('no game found');
            } else {
                
                let categoryList = '';
                for (i = 0; i < body.data[0].categories.data.length; i++) {
                    if (!body.data[0].categories.data[i].miscellaneous || args[1] == '*+') {
                        categoryList = i === 0 ? categoryList + body.data[0].categories.data[i].name : categoryList + ', ' + body.data[0].categories.data[i].name;
                    }
                }
                
                const embed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle('Leaderboard')
                    .setThumbnail(body.data[0].assets['cover-medium'].uri)
                    .setURL(body.data[0].weblink)
                    .setAuthor(body.data[0].names.international)
                    .setDescription('Categories: ' + categoryList)
                    .setTimestamp();
        
                message.channel.send(embed);
            }
        }
	}
};