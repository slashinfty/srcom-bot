module.exports = {
	name: 'game and category',
	description: 'Get the WR in a specific category of a game',
	execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });
        const terms = args[1].split('|');
        terms.forEach((term, index, array) => { array[index] = term.trim() });

        const fetch = require('node-fetch');
        const respInitial = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories.variables`);
        const initial = await respInitial.json();
        if (initial.data.length === 0) {
            message.reply('no game found');
        } else {
            let gameID = initial.data[0].id;
            let categoryID;
            for (i = 0; i < initial.data[0].categories.data.length; i++) {
                if (initial.data[0].categories.data[i].name.toLowerCase() == terms[0].toLowerCase()) {
                    categoryID = initial.data[0].categories.data[i].id;
                    break;
                }
            }
            if (categoryID === undefined) {
                message.reply('no category found');
            } else {
                var varFilter = '';
                var variableName;
                if (terms.length > 1) {
                    let variableID, variableVal;
                    for (i = 0; i < initial.data[0].categories.data[0].variables.data.length; i++) {
                        if (initial.data[0].categories.data[0].variables.data[i]['is-subcategory']) {
                            Object.keys(initial.data[0].categories.data[0].variables.data[i].values.values).forEach((key, index) => {
                                if (initial.data[0].categories.data[0].variables.data[i].values.values[key].label.toLowerCase() === terms[1].toLowerCase()) {
                                    variableVal = key;
                                    variableID = initial.data[0].categories.data[0].variables.data[i].id;
                                    variableName = initial.data[0].categories.data[0].variables.data[i].values.values[key].label;
                                }
                            });
                        }
                    }
                    if (variableVal === undefined || variableID === undefined) {
                        message.reply('no sub-category found'); 
                    } else {
                        varFilter = varFilter + '&var-' + variableID + '=' + variableVal;
                    }
                }
                const response = await fetch(`https://www.speedrun.com/api/v1/leaderboards/${gameID}/category/${categoryID}?top=1${varFilter}&embed=game,category.variables,players,regions,platforms`);//new
                const body = await response.json();
        
                let region = body.data.regions.data.length > 0 ? ' - ' + body.data.regions.data[0].name : '';
                let emu = body.data.runs[0].run.system.emulated ? ' [EMU]' : '';
                let subCategory = variableName === undefined ? '' : ' (' + variableName + ')';
        
                const time = require('../seconds.js');
                const embed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle(time.convert(body.data.runs[0].run.times.primary_t) + ' by ' + body.data.players.data[0].names.international)
                    .setThumbnail(body.data.game.data.assets['cover-medium'].uri)
                    .setURL(body.data.runs[0].run.weblink)
                    .setAuthor(body.data.game.data.names.international + ' - ' + body.data.category.data.name + subCategory)
                    .addField('Date Played:', body.data.runs[0].run.date)
                    .addField('Played On:', body.data.platforms.data[0].name + region + emu)
                    .setTimestamp();
        
                message.channel.send(embed);
            }
        }
	}
};