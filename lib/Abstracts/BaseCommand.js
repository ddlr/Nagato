class BaseCommand {
    constructor(bot, type) {
        if (this.constructor === BaseCommand)
            throw new Error('Cannot instantiate abstract BaseCommand.')

        this.bot = bot

        this.aliases = []
        this.id = this.name
        this.type = type

        this.adminOnly = false
        this.dm = true
        this.permission = null
        this.privateGuilds = null
    }

    get name() {
        throw new Error('Name must be overridden.')
    }

    get help() {
        return `No Help Message Currently Created for \`${this.name}\`.`
    }

    execute(message, content, options = {}) {
        return new Promise(resolve => {
            if (!message || !content || !this.permissions(message)) {
                return
            }

            this.increaseUsage()
            this.bot.log.command(message, this.name)

            this.sendMessage(message.channel, content, options).then(msg => resolve(msg))
        })
    }

    sendMessage(channel, content, options = {}) {
        return new Promise(resolve => {
            channel.createMessage(content, options.upload ? options.upload : undefined).then(msg => {
                if (options.edit) {
                    msg.edit(options.edit(msg))
                }

                resolve(msg)
            }).catch(err => this.bot.log.warn(`${this.name} - Error Sending Message: ${err}`))
        })
    }

    increaseUsage() {
        if (this.bot.commandUsage.has(this.name)) {
            const usage = ++this.bot.commandUsage.get(this.name)

            this.bot.commandUsage.set(this.name, usage)
        } else {
            this.bot.commandUsage.set(this.name, 1)
        }
    }

    awaitMessage(input, output, timeout) {
        return this.bot.messageHandler.awaitMessage(input, output, timeout)
    }

    reactionButton(emojis, add, remove, messageID, timeout) {
        return this.bot.messageHandler.reactionButton(emojis, add, remove, messageID, timeout)
    }

    permissions(message) {
        if (!this.privateGuildCheck(message.channel.guild)) {
            return false
        } else if (!this.permissionsCheck(message)) {
            return false
        } else if (!this.dm && !message.channel.guild) {
            return false
        } else {
            return true
        }
    }

    privateGuildCheck(guild) {
        if (!this.privateGuilds) {
            return true
        } else if (!guild || !this.privateGuilds.includes(guild.id)) {
            return false
        } else {
            return true
        }
    }

    permissionsCheck(message) {
        let hasPermssion = true

        if (this.permissions != null && message.channel.guild) {
            let permissionKeys = Object.keys(this.permissions)
            let userPermissions = message.channel.permissionsOf(message.author.id).json

            for (const key of permissionKeys)
                if (this.permissions[key] !== userPermissions[key]) {
                    hasPermssion = false

                    break
                }
        }
        return hasPermssion
    }
}

module.exports = BaseCommand