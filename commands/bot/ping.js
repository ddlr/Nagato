// thx zeyla

'use strict'

const BaseCommand = require('../../lib/Abstracts/BaseCommand')

class Ping extends BaseCommand {
  constructor(bot, type) {
    super(bot, type)

    this.aliases = ['p']
  }

  get name() {
    return 'ping'
  }

  async process(msg) {
    await this.execute(msg, 'Pong!')
  }
}

module.exports = Ping
