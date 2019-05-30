module.exports = {
	name: 'all categories',
	description: 'Get all categories or sub-categories for a game',
	execute: async function (Discord, message, args) {
        const querystring = require('querystring');
        const filter = args[0].charAt(0) === '/' ? querystring.stringify({ abbreviation: args[0].slice(1) }) : querystring.stringify({ name: args[0] });
        const terms = args[1].split('|');
        terms.forEach((term, index, array) => { array[index] = term.trim() });

        const fetch = require('node-fetch');
        const response = await fetch(`https://www.speedrun.com/api/v1/games?${filter}&embed=categories`);
        const body = await response.json();
        if (body.data.length === 0) {
            message.reply('No game found for "' + args[0] + '"');
        } else {
            if (terms.length === 2 && terms[1] !== '') {
                let categoryID;
                for (i = 0; i < body.data[0].categories.data.length; i++) {
                    if (body.data[0].categories.data[i].name.toLowerCase() == terms[0].toLowerCase()) {
                        categoryID = body.data[0].categories.data[i].id;
                        var categoryURL = body.data[0].categories.data[i].weblink;
                        var categoryName = body.data[0].categories.data[i].name;
                        break;
                    }
                }
                if (categoryID === undefined) {
                    message.reply('No category found for "' + terms[0] + '" in ' + body.data[0].names.international);
                } else {
                    const respSec = await fetch(`https://www.speedrun.com/api/v1/categories/${categoryID}/variables`);
                    const secondary = await respSec.json();
                    if (secondary.data.length === 0) {
                        message.reply('No sub-categories found for ' + categoryName + ' in ' + body.data[0].names.international);
                    } else {
                        var subCategoryList = '';
                        for (i = 0; i < secondary.data.length; i++) {
                            if (secondary.data[i]['is-subcategory']) {
                                Object.keys(secondary.data[i].values.values).forEach((key, index) => {
                                    subCategoryList = index === 0 ? subCategoryList + secondary.data[i].values.values[key].label : subCategoryList + ', ' + secondary.data[i].values.values[key].label;
                                });
                            }
                        }
                        if (subCategoryList === '') {
                            message.reply('No sub-categories found for ' + categoryName + ' in ' + body.data[0].names.international);
                        } else {
                            const subCatEmbed = new Discord.RichEmbed()
                                .setColor('#800020')
                                .setTitle('Leaderboard')
                                .setThumbnail(body.data[0].assets['cover-medium'].uri)
                                .setURL(categoryURL)
                                .setAuthor(body.data[0].names.international + ' - ' + categoryName)//add category name
                                .setDescription('Sub-categories: ' + subCategoryList)
                                .setTimestamp();
        
                                message.channel.send(subCatEmbed);
                        }
                    }
                }
            } else {
                var categoryList = '';
                for (i = 0; i < body.data[0].categories.data.length; i++) {
                    if (!body.data[0].categories.data[i].miscellaneous || terms[0] === '*+') {
                        categoryList = i === 0 ? categoryList + body.data[0].categories.data[i].name : categoryList + ', ' + body.data[0].categories.data[i].name;
                    }
                }
                const categoryEmbed = new Discord.RichEmbed()
                    .setColor('#800020')
                    .setTitle('Leaderboard')
                    .setThumbnail(body.data[0].assets['cover-medium'].uri)
                    .setURL(body.data[0].weblink)
                    .setAuthor(body.data[0].names.international)
                    .setDescription('Categories: ' + categoryList)
                    .setTimestamp();
        
                message.channel.send(categoryEmbed);
            }   
        }
    }
};