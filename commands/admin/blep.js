BaseCommand = require('../../lib/Abstracts/BaseCommand')
util = require('util')

class Blep extends BaseCommand {
  constructor(bot, type) {
    super(bot, type)

    this.ownerOnly = true
  }

  get name() {
    return 'blep'
  }

  get help() {
    return 'Says something as the bot on any channel/guild it is on.\n' +
           '~blep [server ID] [guild ID] [message]'
  }

  async process(msg, args) {
    const argsSplit = args.split(' ')
    const a = argsSplit[0]
    const b = argsSplit[1]
    let c = argsSplit.splice(2).join(' ')

    if (
      Number.isInteger(parseInt(a)) &&
      Number.isInteger(parseInt(b)) &&
      c
    ) {
      // third parameter is surrounded by ``these`` (e.g. so strings like
      // :these: or <these> aren’t parsed by Discord as emoji)
      if (c && c.startsWith('``')) {
        c = c.slice(2, -2)
      }

      try {
        await this.bot.guilds.get(a).channels.get(b).createMessage(c)
      } catch (e) {
        await this.execute(
          msg,
          'Didn\'t work. Be sure to check if the bot has permission to post ' +
          'in that channel.'
        )
      }
    } else {
      await this.execute(msg, 'You gotta type something in, silly!')
    }
  }
}

module.exports = Blep
