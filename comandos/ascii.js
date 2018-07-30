const ascii = require('ascii-art');

exports.run = (client, message, args, ops) => {
  if (args[0].startsWith('[') && args[0].endsWith(']')) {
    var string = args.join(' ').slice(args[0].length+1);
  } else {
    var string = args.join(' ');
  };

  ascii.font(string, 'Doom', function(rendered) {
    rendered = rendered.trimRight();

    if (rendered.length > 2000) return message.channel.send('Lo siento, pero el mensaje es muy largo.');

    var lang = 'md';

    if (args[0].startsWith('[') && args[0].endsWith(']')) {
      lang = args[0].slice(1, -1);
    };

    message.channel.send(rendered, {
      code: lang,
    });
  });
}
