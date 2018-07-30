const Discord = require('discord.js');

exports.run = async (client, message, args, ops) => {
  if (!message.member.roles.find(r => r.name == 'Staff')) return message.channel.send('No eres moderador.');

  if (!args[0]) return message.channel.send('Especifica una pregunta.')

  const embed = new Discord.RichEmbed()
    .setColor("#2D72FE")
    .setFooter('Reacciona para votar')
    .setDescription(args.join(' '))
    .setTitle(`Encuesta creada por ${message.author.tag}`);

  let msg = await message.channel.send(embed);

  await msg.react('✅');
  await msg.react('⛔');
}
