const fs = require('fs');
const Discord = require('discord.js');
const fetch = require('node-fetch');
const prefix = require('./config.json');

require('http').createServer().listen(3000);

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	//const commandName = args.shift().toLowerCase();

    //use client.commands.get(command).execute(message, args);
    
    let wildcards = args.split('|'); //[0] is not a wildcard
    let terms = wildcards[0].split(';');
    
    if (terms.length === 1) client.commands.get('game only').execute(message, terms);

	try {
		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('Sorry, I was unable to complete that request.');
	}
});

client.login(process.env.TOKEN);