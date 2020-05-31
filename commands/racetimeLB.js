module.exports = {
    name: 'racetime leaderboards',
    description: 'Get leaderboards on racetime for a game',
    execute: async function (Discord, message, args) {
        let slug = args[0];
        let cat = args.length > 1 ? args[1].trim() : null;

        const fetch = require('node-fetch');
        const response = await fetch(`https://racetime.gg/${slug}/leaderboards/data`);
        const body = await response.json();
        const lbArr = body.leaderboards;

        const catBoard = cat === null ? lbArr[0] : lbArr.find(lb => lb.goal.toLowerCase() === args[1].toLowerCase());
        
    }
}