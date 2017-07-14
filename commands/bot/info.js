'use strict'

const BaseCommand = require('../../lib/Abstracts/BaseCommand')

class Info extends BaseCommand {
  constructor(bot, type) {
    super(bot, type)

    this.aliases = ['about', 'invite']
  }

  get name() {
    return 'info'
  }

  async process(msg) {
    const help =
`__**About Changeling Bot#6006:**__

Invite me:
<https://discordapp.com/oauth2/authorize?client_id=249725990232653826&scope=bot&permissions=85056>

Testing server (ask to be added to testing channel):
<https://discord.gg/w8AqVxT>

Use \`~help\` for a list of commands.

**Source code:** <https://github.com/ddlr/douxieme>
`
    await this.execute(msg, help)
  }
}

module.exports = Info
