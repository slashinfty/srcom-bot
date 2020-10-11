module.exports = {
	name: 'help',
	description: 'DM the user a help block',
	execute: function (message, args) {
        message.author.send("Hi! I can get information from speedrun.com and racetime.gg\n\nIf you need to see what commands to use, check this out: <https://mattbraddock.com/srcom-bot/>\n\nIf you want to report an issue, you can do that: <https://github.com/slashinfty/srcom-bot/issues>");
	}
};
