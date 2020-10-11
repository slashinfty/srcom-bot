const iso = require('iso8601-duration');
module.exports = {
    name: 'racetime leaderboards',
    description: 'Get leaderboards on racetime for a game',
    execute: async function (Discord, message, args) {
        const convert = time => {
            let hr, min, sec, ms;
            let parts = time.toString().split('.');
            ms = parts.length > 1 ? parseInt((parts[1] + '00').substr(0,3)) : undefined;
            sec = parseInt(parts[0]);
            if (sec >= 60) {min = Math.floor(sec / 60); sec = ('0' + (sec % 60)).substr(-2, 2);}
            if (min >= 60) {hr = Math.floor(min / 60); min = ('0' + (min % 60)).substr(-2, 2);}
            ms = ('00' + ms).substr(-3, 3);
            if (min === undefined) return ms === undefined ? sec.toString() + 's' : sec.toString() + 's ' + ms.toString() + 'ms';
            else if (hr === undefined) return ms === undefined ? min.toString() + 'm ' + sec.toString() + 's' : min.toString() + 'm ' + sec.toString() + 's ' + ms.toString() + 'ms';
            else return ms === undefined ? hr.toString() + 'h ' + min.toString() + 'm ' + sec.toString() + 's' : hr.toString() + 'h ' + min.toString() + 'm ' + sec.toString() + 's ' + ms.toString() + 'ms';
        }

        let slug = args[0];
        let cat = args.length > 1 ? args[1].trim() : null;
        let runner = args.length > 2 ? args[2].trim() : null;

        const fetch = require('node-fetch');
        let listGoals = false;
        if (slug.endsWith('?')) {
            slug = slug.slice(0, -1);
            listGoals = true;
        }
        try {
            var gameResponse = await fetch(`https://racetime.gg/${slug}/data`);
            var gameBody = await gameResponse.json();
        } catch(error) {
            console.log(error);
            message.channel.send('Sorry, ' + slug + ' is does not correspond to a game.');
            return;
        }
        let link = 'https://racetime.gg' + gameBody.url + '/leaderboards';
        let image = 'http://racetime.gg' + gameBody.image;
        if (listGoals) {
            const lbResponse = await fetch (`https://racetime.gg/${slug}/leaderboards/data`);
            const lbBody = await lbResponse.json();
            const lb = lbBody.leaderboards;
            let goalList = '';
            lb.forEach((g, i) => goalList += i == (lb.length - 1) ? g.goal : g.goal + '\n');
            const embed = new Discord.RichEmbed()
                .setColor('#800020')
                .setTitle('Leaderboard')
                .setThumbnail(image)
                .setURL(link)
                .setAuthor(gameBody.name)
                .addField('List of Goals', goalList)
                .setTimestamp();
            
            message.channel.send(embed);
            return;
        }
        let sortByPB = false;
        let sortByRaces = false;
        let query = '';
        let catName = cat === null ? null : cat.toLowerCase();
        if (catName !== null) {
            if (args.length > 2) catName = catName.endsWith('*') || catName.endsWith('+') ? catName.slice(0, -1) : catName;
            else if (args[1].endsWith('*')) {
                sortByPB = true;
                catName = catName.slice(0, -1);
                query = '?sort=best_time';
            } else if (args[1].endsWith('+')) {
                sortByRaces = true;
                catName = catName.slice(0, -1);
                query = '?sort=times_raced';
            }
        }
        const response = await fetch(`https://racetime.gg/${slug}/leaderboards/data${query}`);
        const body = await response.json();
        const lbArr = body.leaderboards;
        const catBoard = cat === null ? lbArr[0] : lbArr.find(lb => lb.goal.toLowerCase() === catName);
        if (catBoard === undefined) {
            message.channel.send(gameBody.name + ' does not have a category named ' + cat);
            return;
        }
        const limit = catBoard.num_ranked > 10 ? 10 : catBoard.num_ranked;
        let title = gameBody.name + ' - ' + catBoard.goal;
        if (limit === 0) {
            message.channel.send(gameBody.name + ' - ' + catBoard.goal + ' does not have any races yet!');
            return;
        }
        else if (args.length > 2) {
            let statsList = '';
            let rankings = catBoard.rankings.map(u => {
                return {"name": u.user.name, "score": u.score, "best": iso.toSeconds(iso.parse(u.best_time)), "races": u.times_raced};
            });
            const player = rankings.find(u => u.name.toLowerCase() == args[2].toLowerCase());
            if (player === undefined) {
                message.channel.send('Can not find ' + args[2] + ' in ' + gameBody.name + ' - ' + catBoard.goal);
                return;
            }
            const suffix = i => {
                let j = i % 10, k = i % 100;
                return j === 1 && k !== 11 ? i + 'st' : j === 2 && k !== 12 ? i + 'nd' : j === 3 && k !== 13 ? i + 'rd' : i + 'th';
            };
            statsList += 'Score: ' + player.score + ' (' + suffix(rankings.findIndex(p => player.name === p.name) + 1) + ')\n';
            rankings.sort((a, b) => a.best > b.best ? 1 : a.best === b.best ? (a.score < b.score ? 1 : -1) : -1);
            statsList += 'Best: ' + convert(player.best) + ' (' + suffix(rankings.findIndex(p => player.name === p.name) + 1) + ')\n';
            rankings.sort((a, b) => a.races < b.races ? 1 : a.races === b.races ? (a.score < b.score ? 1 : -1) : -1);
            statsList += 'Races: ' + player.races + ' (' + suffix(rankings.findIndex(p => player.name === p.name) + 1) + ')';
            const embed = new Discord.RichEmbed()
                .setColor('#800020')
                .setTitle('Leaderboard')
                .setThumbnail(image)
                .setURL(link)
                .setAuthor(title)
                .addField(player.name, statsList)
                .setTimestamp();
            
            message.channel.send(embed);
        } else {
            let playerList = '';
            for (let i = 0; i < limit; i++) {
                let player = catBoard.rankings[i];
                let playerValue;
                if (sortByPB) playerValue = convert(iso.toSeconds(iso.parse(player.best_time)));
                else if (sortByRaces) playerValue = player.times_raced;
                else playerValue = player.score;
                playerList += player.place_ordinal + ': ' + player.user.name + ' (' + playerValue + ')';
                playerList += i < (limit - 1) ? '\n' : '';
            }
            let rankingHeader = 'Top ' + limit.toString() + ' by ';
            rankingHeader += sortByPB ? 'Best Time' : sortByRaces ? 'Most Races' : 'Score';
            const embed = new Discord.RichEmbed()
                .setColor('#800020')
                .setTitle('Leaderboard')
                .setThumbnail(image)
                .setURL(link)
                .setAuthor(title)
                .addField(rankingHeader, playerList)
                .setTimestamp();
            
            message.channel.send(embed);
        }
    }
}
