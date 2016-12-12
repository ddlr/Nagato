class BaseCommand {
    constructor(bot, type) {
        if (this.constructor === BaseCommand) {
            throw new Error('Cannot instantiate abstract BaseCommand.')
        }
        this.bot = bot;
        this.type = type;

        this.dm = true;
        this.togglable = true;
        this.adminOnly = false;
        this.aliases = null;
        this.privateGuilds = null;
        this.permissions = null;

        this.execTimes = 0;
        this.currentCooldown = {};
    }

    get name() {
        throw new Error('Name must be overridden.');
    }

    get usage() {
        return this.name;
    }

    get help() {
        return 'No Help Message Currently Created.';
    }

    execute(message, content, options) {
        if (!message || !content) return;
        if (options && options.delete && message.channel.guild && message.channel.permissionsOf('bot.id').has('manageMessages')) {
            message.delete().catch(err => this.bot.log.warn('Error Deleting Command Message', err));
        }
        this.execTimes++;
        this.bot.log.command(message.channel.guild, message.channel ? message.channel.name : undefined, this.name, message.author.username);
        this.sendMessage(message.channel, content, options);
    }

    sendMessage(channel, content, options) {
        channel.createMessage(content, options && options.upload ? options.upload : undefined).then((msg) => {
            if (options && options.edit) {
                msg.edit(options.edit(msg));
            }
            if (options && options.deleteSent) {
                msg.deleteSent(msg, options.deleteSent > 0 ? options.deleteSent : undefined);
            }
        }).catch(err => this.bot.log.warn('Error Sending Message', err))
    }

    deleteSent(message, time) {
        setTimeout(() => {
            message.delete().catch(err => this.bot.log.warn('Error Deleting Sent Message', err));
        }, time ? time : 5000)
    }

    cooldownCheck(user, cooldown) {
        if (this.currentCooldown.hasOwnProperty(user))
            return true;
        else {
            this.currentCooldown[user] = Date.now();
            setTimeout(() => {
                delete this.currentCooldown[user];
            }, cooldown ? cooldown : 5 * 1000)
            return false;
        }
    }

    cooldownTime(user, cooldown) {
        return ((this.currentCooldown[user] + (cooldown ? cooldown : 5 * 1000)) - Date.now()) / 1000;
    }

    privateGuildCheck(guild) {
        if (!this.privateGuilds)
            return false;
        else if (!guild)
            return true;
        else if (this.privateGuilds.indexOf(guild.id) > -1)
            return false;
        else
            return true;
    }

    adminCheck(author) {
        if (!this.adminOnly)
            return false;
        else if (!this.bot.Admins.includes(author))
            return true;
        else if (this.bot.Admins.includes(author))
            return false;
    }

    permissionsCheck(message) {
        var hasPermssion = true;
        if (this.permissions != null && message.channel.guild && !this.bot.Admins.includes(message.author.id)) {
            var permissionKeys = Object.keys(this.permissions),
                userPermissions = message.channel.permissionsOf(message.author.id).json;
            for (var key of permissionKeys) {
                if (this.permissions[key] !== userPermissions[key]) {
                    hasPermssion = false;
                    break;
                }
            }
        }
        return !hasPermssion;
    }
}

module.exports = BaseCommand;