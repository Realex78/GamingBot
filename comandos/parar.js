exports.run = (client, message, args, ops) => {
  if (!message.member.voiceChannel) return message.channel.send('Por favor conéctate a un canal de voz.');

  if (!message.guild.me.voiceChannel) return message.channel.send('El bot no está conectado a un canal de voz.');

  if (message.guild.me.voiceChannelID !== message.member.voiceChannelID) return message.channel.send('No estas conectado al mismo canal de voz');

  message.guild.me.voiceChannel.leave();

  message.channel.send('Saliendo del canal de voz...');
}
