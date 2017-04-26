const Nagato = require('./lib/Nagato')
    , Options = require('./options.json');

const Options_mapping = {
  'admins'          : 'admins'
, 'eris_options'    : 'Eris'
, 'message_handler' : 'MessageHandler'
, 'help'            : 'Help'
, 'logger'          : 'Logger' // Logger file to use
, 'token'           : 'Token'
};

var options_parsed = {};

// options.json uses different format than Nagato (because I have an aversion
// to capitalization), so switch the format first
Object.entries(Options).forEach( ( [ opt , val ] ) => {
  const Opt_converted = Options_mapping[ opt ] || opt;
  options_parsed[ Opt_converted ] = val;
} );

// For debugging purposes only
// console.log(options_parsed);

const Bot = new Nagato(options_parsed);

// TODO: Maybe not use full path because that's dumb
Bot.loadCommands('/home/blep/g/dev/discord/bots/Nagato/commands/');

Bot.connect();
