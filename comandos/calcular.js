const math = require('mathjs');
const Discord = require('discord.js');

exports.run = (client, message, args, ops) => {
  if (!args[0]) return message.channel.send('Por favor escribe un cálculo.');

  let resp;
  try {
    resp = math.eval(args.join(' '));
  } catch (e) {
    return message.channel.send('Lo siento, por favor escribe un cálculo válido.');
  }

  const embed = new Discord.RichEmbed()
    .setColor("#2D72FE")
    .setTitle('Cálculo')
    .addField('Entrada', `\`\`\`js\n${args.join(' ')}\`\`\``)
    .addField('Salida', `\`\`\`js\n${resp}\`\`\``)

  message.channel.send(embed);
}
