# Speedrun.com Discord Bot

Click this [link](https://discordapp.com/oauth2/authorize?client_id=545399263253757953&scope=bot) to authorize Speedrun Bot to join your server.

# Commands

**Get world record of a game:** `!src game`

Gets the world record in the main category for a specific game. For example, `!src super mario world` would get the world record for Super Mario World's main category (first listed category on speedrun.com).

*Note:* game name searching is not perfect (by speedrun.com's API's design), so a better way to search is by the game's speedrun.com abbreviation. Thus, you could search for Super Mario World by doing `!src /smw`. This abbreviation-style searching for games works for all commands.

**Get world record of a specific category of a game:** `!src game;category|sub-category`

Gets the world record in a specific category for a specific game. For example, `!src super mario world;all castles` would the get the world record in the All Castles category of Super Mario World. Sub-category is optional, and dependent on the game. For example, `!src /kdl;beat the game|extra mode` would get the world record in the Beat the Game (Extra Mode) category of Kirby's Dream Land.

**Get a list of a game's categories:** `!src game;*`

Gets a list of all categories for a specific game. For example, `!src celeste;*` would get all (main) categories of Celeste. If you want to include miscellaneous categories, include a `+` at the end, such as `!src celeste;*+`.

*Note:* some games have sub-categories, and they can be retrieved with `!src game;category|*`.

**Get the rules of a category of a game:** `!src game;category?`

Gets the rules for a category of a specific games. For example, `!src kirby's dream land;beat the game?` would get the rules for the Beat the Game category of Kirby's Dream Land.

*Note:* some categories do not have rules, but their sub-categories do. The rules of a subcategory can be retrieved using `!src game;category|sub-category?`. If the sub-category does not have rules, the category's rules are returned.

**Get the personal best of a runner:** `!src game;category|sub-category;runner`

Gets a person best for a specific runner in a specific category of a specific game. For example, `!src super mario world;0 exit;linkdeadx2` would get linkdeadx2's personal best in the 0 Exit category of Super Mario World. As before, sub-category is optional and dependent on the game. To get andreww's No Major Glitches (Low%) PB in The Legend of Zelda: A Link to the Past, you could do `!src /alttp;no major glitches|low%;andreww`.

*Note:* runner name searching is also not perfect (again, by the API's design), but you can search by Twitch username if you add a `*` at the end of the name. This, however, depends on the user registering their Twitch username on speedrun.com.

**Get help:** `!src -help`

DMs the user a list of these commands.

# Other Commands

**Get leaderboard rankings from racetime.gg**: `!rtgg slug;category`

Gets the top 10 (or top X if the number of racers is less than 10) of a category leaderboard, sorted by score. Appending `*` to the category name sorts results by best time; appending `+` to the category name sorts results by most races.

**Get a list of a game's goals from racetime.gg**: `!rtgg slug?`

Gets a list of a game's categories.

**Get a Super Mario Land 2 Randomizer race seed:** `!sml2r race`

Returns a random seed with the most common race flags of the Super Mario Land 2: 6 Golden Coins [Randomizer](http://sml2r.download/).

# Embed

For each command that returns a specific run, it will give the game name and category, the time and runner name (with a link to the run), a leaderboard rank if it's a PB and not a WR, the date the run was completed, the platform the run was completed on, the region of the game (if available), and if the run was emulated. For the command returning a list of categories, it will link to the game leaderboards.

# Report a Bug

If you have any issues, please report them to the [GitHub](https://github.com/slashinfty/srcom-bot/issues).

## Most Recent Updates

31 May 2020 - Added [racetime.gg](https://racetime.gg) leaderboard command.

21 February 2020 - Returns a list of subcategories when the rules of a category do not exist.

18 February 2020 - Added the ability to search for sub-category rules. Game rules are not in the SRC API yet, though.

25 January 2020 - Added the ability to search for category rules.

30 May 2019 - Provides proper name feedback on queries that have no results.

20 February 2019 - Added a reply for queries that result in games/categories with no runs.

19 February 2019 - Get all sub-categories command; descriptive "can't find" replies; find WRs by runners who are not users ("guests").
