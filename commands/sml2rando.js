module.exports = {
	name: 'sml2 randomizer',
	description: 'Create a SML2 randomizer seed',
	execute: function (Discord, message, args) {
		const seed = () => {
			let a = (Math.floor(Math.random() * 3839) + 256).toString(16).toUpperCase();
			let b = Date.now().toString(16).toUpperCase().substr(-5,5);
			return a.concat(b);
		};
		const addDX = args.endsWith('+dx') ? '+dx' : '';
		var cleanFlags = flagSubmit => {
    		let flagArray = flagSubmit.split('+');
    		let flags = flagArray[0];
    		//strip out extraneous characters
    		flags = flags.replace(/[^lbDdceupBgixXsfFmMho+]/g, '');
    		//strip out duplicate characters
    		flags = flags.split('').filter((x, n, s) => s.indexOf(x) == n).join('');
    		//disallow and strip out one-of settings
    		if (flags.includes('D') && flags.includes('d')) flags = flags.replace(/[dD]/g, '');
    		if (flags.includes('x') && flags.includes('X')) flags = flags.replace(/[xX]/g, '');
    		if (flags.includes('f') && flags.includes('F')) flags = flags.replace(/[fF]/g, '');
    		flags = flagArray.length > 1 ? flags + '+' + flagArray[1] : flags; //expand later
    		return flags;
		}
		
		if (args.startsWith('race')) message.channel.send('http://sml2r.download/?s=' + seed() + '&f=lbDceupBgixsfmMh' + addDX);
		else if (args.startsWith('hard')) message.channel.send('http://sml2r.download/?s=' + seed() + '&f=lbdceupBgixsFmMho' + addDX);
		else if (args != null) message.channel.send('http://sml2r.download/?s=' + seed() + '&f=' + cleanFlags(args));
	}
};