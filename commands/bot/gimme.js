'use strict'

const BaseCommand = require('../../lib/Abstracts/BaseCommand')

class Gimme extends BaseCommand {
  constructor(bot, type) {
    super(bot, type)
    this.needsPrefix = false
  }

  get name() {
    return 'gimme'
  }

  get help() {
    return '`~gimme cute` - equivalent to `~derpibooru cute,-oc,-screencap`'
  }

  async process(msg, args) {
    // Really lazy aliasing
    if (args.toLowerCase() == 'cute') {
      const Derpibooru = this.bot.commands.get('derpibooru')
      return Derpibooru.process(msg, 'cute,-oc,-screencap')
    } else {
      await this.execute(msg, 'no u')
    }
  }
}

module.exports = Gimme
