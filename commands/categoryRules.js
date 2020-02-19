module.exports = {
    name: 'category rules',
    description: 'Get rules of a category of a game',
    execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });
        const terms = args[1].split('|');
        terms.forEach((term, index, array) => { array[index] = term.trim() });
        
        const fetch = require('node-fetch');
        const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories.variables`);
        const body = await response.json();
        if (body.data.length === 0) {
            message.reply('No game found for "' + args[0] + '"')
        } else {
            let gameID = body.data[0].id;
            let categoryID;
            let catInput = terms.length > 1 ? terms[0] : terms[0].slice(0, -1);
            for (i = 0; i < body.data[0].categories.data.length; i++) {
                if (body.data[0].categories.data[i].name.toLowerCase() == catInput.toLowerCase()) {
                    categoryID = body.data[0].categories.data[i].id;
					var catName = body.data[0].categories.data[i].name;
                    var catURL = body.data[0].categories.data[i].weblink;
                    break;
                }
            }
            if (categoryID === undefined) {
                message.reply('No category found for "' + catInput + '" in ' + body.data[0].names.international);
            } else {
                var variableName, catRules, variableVal;
                var subCatNoRules = false;
                if (terms.length > 1) {
                    var subInput = terms[1].slice(0, -1);
                    const subResponse = await fetch (`https://www.speedrun.com/api/v1/categories/${categoryID}/variables`);
                    const subBody = await subResponse.json();
                    for (i = 0; i < subBody.data.length; i++) {
                        if (subBody.data[i]['is-subcategory']) {
                            Object.keys(subBody.data[i].values.values).forEach((key, index) => {
                                if (subBody.data[i].values.values[key].label.toLowerCase() === subInput.toLowerCase()) {
                                    variableVal = key;
                                    variableName = subBody.data[i].values.values[key].label;
                                    catRules = subBody.data[i].values.values[key].rules;
                                }
                            });
                        }
                    }
                    if (catRules === undefined || catRules === '' || catRules === null) {
                        subCatNoRules = true;
                    }
                    if (variableVal === undefined) {
                        message.reply('No sub-category found for "' + subInput + '" in ' + body.data[0].names.international + ' - ' + catName);
                        return;
                    }
                }
                if (terms.length === 1 || subCatNoRules) {
                    catRules = body.data[0].categories.data[i].rules;
                    if (catRules === undefined || catRules === '' || catRules === null) {
                        message.reply('No rules defined for "' + catInput + '" in ' + body.data[0].names.international + ' - try a sub-category?');
                        return;
                    }
                }
                let subCatName = variableName === undefined ? '' : ' (' + variableName + ')';
                if (catRules.length > 2048) catRules = catRules.substring(0, 2045) + '...';
                const rulesEmbed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle('Category Rules')
                    .setThumbnail(body.data[0].assets['cover-medium'].uri)
                    .setURL(catURL)
                    .setAuthor(body.data[0].names.international + ' - ' + catName + subCatName)
                    .setDescription(catRules)
                    .setTimestamp();
                
                message.channel.send(rulesEmbed);
            }
        }
    }
};