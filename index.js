const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const prefix = ['!src', '!sml2r', '!rtgg'];
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandsPath = path.join(__dirname, '/commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
	client.user.setActivity("!src -help");
	console.log('Bot is in ' + client.guilds.array().length + ' servers!');
  client.guilds.forEach(guild => console.log(guild.name));
});

client.on('message', async message => {
	if ((!message.content.startsWith(prefix[0]) && !message.content.startsWith(prefix[1]) && !message.content.startsWith(prefix[2])) || message.author.bot) return;

    if (message.content.startsWith('!src')) {
      const args = message.content.match(/^(\S+)\s(.*)/).slice(2);
    	let terms = args[0].split(';');
    	terms.forEach((term, index, array) => { array[index] = term.trim() });
    	if (terms.length === 0 || terms.length > 3) {
      	message.reply('those are the incorrect number of arguments. Try !src -help if you need assistance.');
    	} else {
      	try {
        	if (terms.length === 1) {
          	if (terms[0] === '-help') client.commands.get('help').execute(message, terms);
            else client.commands.get('game only').execute(Discord, message, terms);
          }
          else if (terms.length === 2) {
          	if (terms[1].slice(-2).search(/\*/) !== -1) client.commands.get('all categories').execute(Discord, message, terms);
            else if (terms[1].slice(-2).search(/\?/) !== -1) client.commands.get('category rules').execute(Discord, message, terms);
            else client.commands.get('game and category').execute(Discord, message, terms);
          } else if (terms.length === 3) client.commands.get('runner pb').execute(Discord, message, terms);
		 		} catch (error) {
			 		console.error(error);
          message.reply('Sorry, there was a problem. Try !src -help if you need assistance.');
        }
    	}
	} else if (message.content.startsWith('!sml2r')) {
		const args = message.content.match(/^(\S+)\s(.*)/).slice(2)[0];
		try {
			client.commands.get('sml2 randomizer').execute(Discord, message, args);
		} catch (error) {
			console.error(error);
			message.channel.send('Create a seed at http://sml2r.download/');
		}
	} else if (message.content.startsWith('!rtgg')) {
		const args = message.content.match(/^(\S+)\s(.*)/).slice(2);
		let terms = args[0].split(';');
		terms.forEach((term, index, array) => { array[index] = term.trim() });
		if (terms.length === 0 || terms.length > 3) {
			message.reply('those are the incorrect number of arguments. Try !-src -help if you need assistance.');
		} else {
			try {
				client.commands.get('racetime leaderboards').execute(Discord, message, terms);
			} catch (error) {
				console.error(error);
				message.reply('Sorry, there was a problem. Try !src -help if you need assistance.');
			}
		}
	}
});

client.login("");
