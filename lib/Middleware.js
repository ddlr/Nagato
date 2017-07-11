// Usage:
// separate file, with class that extends Middleware.js. To load your class:
// Nagato.loadMiddleware(middleware)
class Middleware {
	constructor(bot) {
		this.bot = bot
	}
	checkChannel(channel, cmd, args) {
		return false
	}

	checkCommand(guild, cmd) {
		return false
	}

	checkPrefix(guild) {
		return null
	}

	checkUser(userID){
		return false
	}

	checkGuild(guild){
		return false
	}
}

module.exports = Middleware
