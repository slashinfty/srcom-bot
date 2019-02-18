const fs = require('fs');
const Discord = require('discord.js');
const prefix = '!src';
require('dotenv').config();

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity("!src -help");
    console.log('Bot is in ' + client.guilds.length + ' servers!');
    client.guilds.forEach(guild => console.log(guild.name));
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

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
                if (terms[1].charAt(0) === '*') client.commands.get('all categories').execute(Discord, message, terms);
                else client.commands.get('game and category').execute(Discord, message, terms);
            } else if (terms.length === 3) client.commands.get('runner pb').execute(Discord, message, terms);
         } catch (error) {
            console.error(error);
            message.reply('sorry, there was a problem. Try !src -help if you need assistance.');
        }
    }
});

client.login(process.env.TOKEN);