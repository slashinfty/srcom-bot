# Speedrun.com Discord Bot

Click this [link](https://discordapp.com/oauth2/authorize?client_id=545399263253757953&scope=bot) to authorize Speedrun Bot to join your server.

# Commands

`!src game`

Gets the world record in the main category for a specific game. For example, `!src super mario world` would get the world record for Super Mario World's main category (first listed category on speedrun.com).

**Note:** game name searching is not perfect (by speedrun.com's API's design), so a better way to search is by the game's speedrun.com abbreviation. Thus, you could search for Super Mario World by doing `!src /smw`. This abbreviation-style searching for games works for all commands.

`!src game;category|sub-category`

Gets the world record in a specific category for a specific game. For example, `!src super mario world;all castles` would the get the world record in the All Castles category of Super Mario World. Sub-category is optional, and dependent on the game. For example, `!src /kdl;beat the game|extra mode` would get the world record in the Beat the Game (Extra Mode) category of Kirby's Dream Land.

`!src game;*`

Gets a list of all categories for a specific game. For example, `!src celeste;*` would get all (main) categories of Celeste. If you want to include miscellaneous categories, include a `+` at the end, such as `!src celeste;*+`.

`!src game;category|sub-category;runner`

Gets a person best for a specific runner in a specific category of a specific game. For example, `!src super mario world;0 exit;linkdeadx2` would get linkdeadx2's personal best in the 0 Exit category of Super Mario World. As before, sub-category is optional and dependent on the game. To get andreww's No Major Glitches (Low%) PB in The Legend of Zelda: A Link to the Past, you could do `!src /alttp;no major glitches|low%;andreww`.

`!src -help`

DMs the user a list of these commands.

# Embed

For each command that returns a specific run, it will give the game name and category, the time and runner name (with a link to the run), a leaderboard rank if it's a PB and not a WR, the date the run was completed, the platform the run was completed on, the region of the game (if available), and if the run was emulated. For the command returning a list of categories, it will link to the game leaderboards.

# Report a Bug

If you have any issues, please report them to the [GitHub](https://github.com/slashinfty/srcom-bot/issues).