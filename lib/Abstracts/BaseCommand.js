class BaseCommand {
    constructor(bot, type) {
        if (this.constructor === BaseCommand)
            throw new Error("Cannot instantiate abstract BaseCommand.")

        this.bot = bot;
        this.type = type;
        this.id = this.name;

        this.aliases = [];
        this.dm = true;
        this.adminOnly = false;
        this.permission = null;
        this.privateGuilds = null;

        this.execTimes = 0;
        this.cooldown = 5000;
        this.currentlyOnCooldown = {};
    }

    get name() {
        throw new Error("Name must be overridden.");
    }

    get help() {
        return `No Help Message Currently Created for \`${this.name}\`.`;
    }

    execute(message, content, options = {}) {
        return new Promise(resolve => {
            if (!message || !content || !this.checkAllPermissions(message))
                return;
            if (this.cooldownCheck(message.author.id) && !this.bot.admins.includes(message.author.id))
                this.sendMessage(message.channel, `\`${this.name}\` is currently on cooldown for ${this.cooldownTime(message.author.id).toFixed(1)}s`);
            if (options.delete && message.channel.guild && message.channel.permissionsOf("bot.id").has("manageMessages"))
                message.delete().catch(err => this.bot.log.warn("Error Deleting Command Message", err));
            this.execTimes++;
            this.bot.log.command(message.channel.guild, message.channel.name, this.name, message.author.username);
            if (options.editSent && message.author.id === this.bot.user.id)
                message.channel.editMessage(message.id, content);
            else
                this.sendMessage(message.channel, content, options).then(msg => resolve(msg));
        })
    }

    sendMessage(channel, content, options = {}) {
        return new Promise(resolve => {
            channel.createMessage(content, options.upload ? options.upload : undefined).then((msg) => {
                if (options.edit)
                    msg.edit(options.edit(msg));
                else if (options.deleteSent)
                    this.deleteSent(msg, options.deleteSent);
                resolve(msg);
            }).catch(err => this.bot.log.warn("Error Sending Message", err));
        })
    }

    awaitMessage(input, output, timeout) {
        return this.bot.messageHandler.awaitMessage(input, output, timeout);
    }

    reactionButton(emojis, add, remove, messageID, timeout) {
        return this.bot.messageHandler.reactionButton(emojis, add, remove, messageID, timeout);
    }

    deleteSent(message, time) {
        setTimeout(() => {
            message.delete().catch(err => this.bot.log.warn("Error Deleting Sent Message", err));
        }, time)
    }

    checkAllPermissions(message) {
        if (!this.privateGuildCheck(message.channel.guild))
            return false;
        else if (!this.permissionsCheck(message))
            return false;
        else if (!this.dm && !message.channel.guild)
            return false;
        else if (!this.adminCheck(message.author.id))
            return false;
        else
            return true;
    }

    cooldownCheck(user) {
        if (this.currentlyOnCooldown.hasOwnProperty(user))
            return true;
        else {
            this.currentlyOnCooldown[user] = Date.now();
            setTimeout(() => {
                delete this.currentlyOnCooldown[user];
            }, this.cooldown)
            return false;
        }
    }

    cooldownTime(user) {
        return ((this.currentlyOnCooldown[user] + this.cooldown) - Date.now()) / 1000;
    }

    privateGuildCheck(guild) {
        if (!this.privateGuilds)
            return true;
        if (!guild || !this.privateGuilds.includes(guild.id))
            return false;
        else if (this.privateGuilds.includes(guild.id))
            return true;
        else
            return true;
    }

    adminCheck(author) {
        if (!this.adminOnly || this.bot.admins.includes(author))
            return true;
        else if (!this.bot.admins.includes(author))
            return false;
        else
            return false;
    }

    permissionsCheck(message) {
        var hasPermssion = true;
        if (this.permissions != null && message.channel.guild && !this.bot.admins.includes(message.author.id)) {
            var permissionKeys = Object.keys(this.permissions),
                userPermissions = message.channel.permissionsOf(message.author.id).json;
            for (var key of permissionKeys) {
                if (this.permissions[key] !== userPermissions[key]) {
                    hasPermssion = false;
                    break;
                }
            }
        }
        return hasPermssion;
    }
}

module.exports = BaseCommand;