exports.run = (client, message, args, ops) => {
  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send('No hay nada en la fila.');

  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('No estas conectado al mismo canal.');

  if (isNaN(args[0]) || args[0] > 200 || args[0] < 0) return message.channel.send('Por favor escribe un número entre 0-200');

  fetched.dispatcher.setVolume(args[0]/100);

  message.channel.send(`Se ha cambiado el volumen satisfactoriamente de ${fetched.queue[0].songTitle} a ${args[0]}`);
}
