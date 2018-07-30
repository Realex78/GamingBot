exports.run = async (client, message, args, ops) => {
  let fetched = ops.active.get(message.guild.id);

  if (!fetched) return message.channel.send("No hay nada en la fila.");

  let queue = fetched.queue;
  let nowPlaying = queue[0];

  let resp = `Ahora escuchando **${nowPlaying.songTitle}** | Pedido por ${nowPlaying.requester}`;

  for (var i = 1; i < queue.length; i++) {
    resp += `\n${i}. **${queue[i].songTitle}** | Pedido por ${queue[i].requester}`;
  }

  message.channel.send(resp)
}
