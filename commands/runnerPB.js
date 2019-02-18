module.exports = {
	name: 'runner pb',
	description: 'Get the personal best of a runner in a specific category of a game',
	execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });
        const terms = args[1].split('|');
        terms.forEach((term, index, array) => { array[index] = term.trim() });

        const fetch = require('node-fetch');
        const respInitial = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories.variables,regions,platforms`);
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
                    var variableID, variableVal;
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
                const search = args[2].slice(-1) === '*' ? querystring.stringify({ twitch: args[2].slice(0, -1) }) : querystring.stringify({ name: args[2] });
                console.log(search);
                const respNext = await fetch(`https://www.speedrun.com/api/v1/users?${search}`);
                const next = await respNext.json();
                if (next.data.length === 0) {
                    message.reply('no runner found');
                } else {
                    let userID = next.data[0].id;
                    const response = await fetch(`https://www.speedrun.com/api/v1/users/${userID}/personal-bests?game=${gameID}&embed=game,players,category`);
                    const body = await response.json();
                    if (body.data.length === 0) {
                        message.reply('runner has no PB in that game');
                    } else {
                        let data;
                        for (i = 0; i < body.data.length; i++) {
                            if (terms.length > 1) {
                                if (body.data[i].run.category === categoryID && body.data[i].run.values[variableID] === variableVal) {
                                    data = body.data[i];
                                    break;
                                }
                            } else {
                                if (body.data[i].run.category === categoryID) {
                                    data = body.data[i];
                                    break;
                                }
                            }
                        }
                        if (data === undefined) {
                            message.reply('runner has no PB in that category');
                        } else {
                            let platform;
                            const platObj = initial.data[0].platforms.data.find(plat => plat.id === data.run.system.platform);
                            platform = platObj.name;
                            let region;
                            if (data.run.system.region === null) region = '';
                            else {
                                const regObj = initial.data[0].regions.data.find(reg => reg.id === data.run.system.region);
                                region = ' - ' + regObj.name;
                            }
                            let emu = data.run.system.emulated ? ' [EMU]' : '';
                            let subCategory = variableName === undefined ? '' : ' (' + variableName + ')';
        
                            const time = require('../seconds.js');
                            const embed = new Discord.RichEmbed()
                                .setColor('#800020')
                                .setTitle(time.convert(data.run.times.primary_t) + ' by ' + data.players.data[0].names.international)
                                .setThumbnail(data.game.data.assets['cover-medium'].uri)
                                .setURL(data.run.weblink)
                                .setAuthor(data.game.data.names.international + ' - ' + data.category.data.name + subCategory)
                                .setDescription('Leaderboard Rank: ' + data.place)
                                .addField('Date Played:', data.run.date)
                                .addField('Played On:', platform + region + emu)
                                .setTimestamp();
        
                            message.channel.send(embed);
                        }
                    }
                }
            }
        }
	}
};