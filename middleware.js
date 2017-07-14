const Middleware_Core = require('./lib/Middleware.js')
// TODO: connect to some database

class Middleware extends Middleware_Core {
  checkCommand(guild, cmd) {
    return false
  }
  async checkChannel(channel, cmd, args) {
    const blacklisted = false
    // blacklisted = whether user in blacklist database
    return !!blacklisted
  }

  async checkUser(userID) {
  }
}

module.exports = Middleware
