exports.run = (client, message, args, ops) => {
  if (message.author.id !== ops.ownerID) return message.channel.send('Sólo el propetario del bot puede hacer este comando.');

  try {
    delete require.cache[require.resolve(`./${args[0]}.js`)];
  } catch (e) {
    return message.channel.send(`No se ha podido recargar ${args[0]}`);
  }

  message.channel.send(`Se ha recargado satisfactoriamente ${args[0]}`);
}
