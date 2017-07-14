const Nagato = require('./lib/Nagato')
    , Options = require('./options.json')
    , middleware = require('./middleware')

var options_parsed = {};

const Bot = new Nagato(Options);

Bot.loadCommands(`${__dirname}/commands/`);
Bot.loadEvents(`${__dirname}/events/`);
Bot.loadMiddleware(middleware)

Bot.connect();
