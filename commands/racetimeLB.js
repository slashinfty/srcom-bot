module.exports = {
    name: 'racetime leaderboards',
    description: 'Get leaderboards on racetime for a game',
    execute: async function (Discord, message, args) {
        let slug = args[0];
        let cat = args.length > 1 ? args[1].trim() : null;

        const fetch = require('node-fetch');
        try {
            var gameResponse = await fetch(`https://racetime.gg/${slug}/data`);
            var gameBody = await gameResponse.json();
        } catch(error) {
            console.log(error);
            message.channel.send('Sorry, ' + slug + ' is does not correspond to a game.');
            return;
        }
        const response = await fetch(`https://racetime.gg/${slug}/leaderboards/data`);
        const body = await response.json();
        const lbArr = body.leaderboards;

        const catBoard = cat === null ? lbArr[0] : lbArr.find(lb => lb.goal.toLowerCase() === args[1].toLowerCase());
        if (catBoard === undefined) {
            message.channel.send(gameBody.name + ' does not have a category named ' + cat);
        }
        const limit = catBoard.num_ranked > 10 ? 10 : catBoard.num_ranked;
        if (limit === 0) {
            message.channel.send(catBoard.goal + ' does not have any races yet!');
        } else {
            let playerList = '';
            for (let i = 0; i < limit; i++) {
                let player = catBoard.rankings[i];
                playerList += player.place_ordinal + ': ' + player.user.name + ' (' + player.score + ')';
                playerList += i < (limit - 1) ? '\n' : '';
            }
            
            let title = gameBody.name + ' - ' + catBoard.goal;
            let link = 'https://racetime.gg' + gameBody.url + '/leaderboards';
            let image = 'http://racetime.gg' + gameBody.image;

            const embed = new Discord.RichEmbed()
                .setColor('#800020')
                .setTitle('Leaderboard')
                .setThumbnail(image)
                .setURL(link)
                .setAuthor(title)
                .addField('Top ' + limit.toString(), playerList)
                .setTimestamp();
            
            message.channel.send(embed);
        }
    }
}