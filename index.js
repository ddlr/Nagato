const Nagato = require('./lib/Nagato')
    , Options = require('./options.json');

var options_parsed = {};

const Bot = new Nagato(Options);

Bot.loadCommands('/home/blep/g/dev/discord/bots/Nagato/commands');

Bot.connect();
