exports.run = (client, message, args, ops) => {
  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send('No hay nada en la fila.');

  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('No estás conectado al mismo canal de voz.');

  if (!fetched.dispatcher.paused) return message.channel.send('La fila no esta en pausa.');

  fetched.dispatcher.resume();

  message.channel.send(`Se ha reanudado satisfactoriamente ${fetched.queue[0].songTitle}`);
}
