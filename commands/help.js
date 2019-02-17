module.exports = {
	name: 'help',
	description: 'DM the user a help block',
	execute: function (message, args) {
        message.author.send("```Here are all of my commands.\n\n!src game\nGet the WR in a game's main category\nEx: !src super mario world\n\n!src game;category\nGet the WR in a specific category of a game\nEx: !src celeste;all hearts\n\n!src game;*\nGet a list of categories for a game (*+ will include all miscellaneous categories)\nEx: !src legend of zelda ocarina of time;*+\n\n!src game;category;runner\nGet the PB of a runner in a specific category of a game\nEx: !src popeye;any%;authorblues\n\nNote: Searching by game name may not yield perfect results - try searching by /abbreviation\nEx: !src /sml2;any% glitchless;darbian```\nFor more information, visit <https://mattbraddock.com/srcom-bot/>");
	}
};