exports.run = async (client, message, args, ops) => {
  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send("No hay nada en la fila.");

  if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send("No estás conectado al mismo canal de voz.");

  let userCount = message.member.voiceChannel.members.size;

  let required = Math.ceil(userCount/2);

  if (!fetched.queue[0].voteSkips) fetched.queue[0].voteSkips = [];

  if (fetched.queue[0].voteSkips.includes(message.member.id)) return message.channel.send(`Ya votaste para saltar la canción. ${fetched.queue[0].voteSkips.length}/${required} requeridos.`);

  fetched.queue[0].voteSkips.push(message.member.id);

  ops.active.set(message.guild.id, fetched);

  if (fetched.queue[0].voteSkips.length >= required) {
    message.channel.send('Se ha saltado la canción.');

    return fetched.dispatcher.emit('finish');
  }

  message.channel.send(`Has votado para saltar la canción satisfactoriamente. ${fetched.queue[0].voteSkips.length}/${required} requeridos.`);
}
