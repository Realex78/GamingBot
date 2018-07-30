const db = require('quick.db');

exports.run = async (client, message, args, ops) => {
  let member = message.mentions.members.first() || message.member;

  let guild = await db.fetch(`guildMessages_${member.guild.id}_${member.id}`);

  message.channel.send(`Mensajes: \`${guild}\``)
}
