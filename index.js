//Cosas de inicialización
const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = proccess.env.BOT_TOKEN;
const PREFIX = "/"

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
  console.log("¡Listo!")
  console.log("SocialBot corriendo en la versión 1.3.1")
});

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message)
    else connection.disconnect();
  })
}

bot.on("guildMemberAdd", function(member) {
  var welcome = [
    "¡Hola " + member.toString() + "!",
    "¿Cómo te va, " + member.toString() + "?",
    "¿Qué hay de nuevo, " + member.toString() + "?",
    "¿Cómo están las cosas, " + member.toString() + "?",
    "¿Cómo está tu día, " + member.toString() + "?",
    "¡Qué bueno verte, " + member.toString() + "!",
    "¡Mucho tiempo sin verte, " + member.toString() + "!",
    "¡Encantado de conocerte, " + member.toString() + "!",
    "¿Cómo has estado, " + member.toString() + "?",
  ];
  console.log("Nuevo miembro");
  member.guild.channels.find("name", "nuevos-miembros").send(welcome[Math.floor(Math.random() * welcome.length)]);
});

bot.on("message", function(message) {
  var args = message.content.substring(PREFIX.length).split(" ");
  //Música
  switch (args[0].toLowerCase()) {
    case "escuchar":
      if (!args[1]) {
        message.channel.send("Por favor incluye un link de YouTube");
        return
      }
      if (!message.member.voiceChannel) {
        message.channel.send("Tienes que estar en un canal de voz primero");
        console.log("No hay VC");
        return
      }
      if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      };
      var server = servers[message.guild.id];
      server.queue.push(args[1]);
      console.log("Agregado a la cola");
      if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
        play(connection, message);
        console.log("Reproduciendo")
      });
      break;
    case "saltar":
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      break;
    case "parar":
      var server = servers[message.guild.id];
      if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
      break;
  }


  //Mi servidor
  if (message.guild.id == "360532553435971586") {
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;


    switch (args[0].toLowerCase()) {
      case "comandos":
      var embed = new Discord.RichEmbed()
        .addField("/comandos", "Muestra esta lista", true)
        .addField("/socialbot", "Muestra información sobre SocialBot", true)
        .addField("/aplicarhelper", "Muestra el enlace para aplicar al rango Helper", true)
        .addField("/aplicaryt", "Muestra el enlace para aplicar al rango YouTuber", true)
        .addField("/escuchar", "Pone en la fila la canción de YouTube especificada", true)
        .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
        .addField("/parar", "Para la fila de canciones", true)
        .setColor("#3a96dd")
        .setDescription("Estos son los comandos actuales:")
        .setTitle("Comandos")
      message.channel.send(embed);
      break;
      case "ayuda":
        var embed = new Discord.RichEmbed()
          .addField("/comandos", "Muestra esta lista", true)
          .addField("/socialbot", "Muestra información sobre SocialBot", true)
          .addField("/aplicarhelper", "Muestra el enlace para aplicar al rango Helper", true)
          .addField("/aplicaryt", "Muestra el enlace para aplicar al rango YouTuber", true)
          .addField("/escuchar", "Pone en la fila la canción de YouTube especificada", true)
          .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
          .addField("/parar", "Para la fila de canciones", true)
          .setColor("#3a96dd")
          .setDescription("Estos son los comandos actuales:")
          .setTitle("Comandos")
        message.channel.send(embed);
        break;
      case "socialbot":
        message.channel.send("SocialBot v.1.3.1 | Hecho por Renato Peña / Realex78 #2193");
        break;
      case "aplicarhelper":
        var embed = new Discord.RichEmbed()
          .setColor("#3a96dd")
          .setDescription("Contesta este formulario de aplicación")
          .setFooter("Haz clic en el título para ir al formulario")
          .setTitle("Rango de Helper")
          .setURL("https://goo.gl/forms/wdsPdXWIu9jwgDaO2")
        message.channel.send(embed);
        break;
      case "aplicaryt":
        var embed = new Discord.RichEmbed()
          .setColor("#3a96dd")
          .setDescription("Contesta este formulario de aplicación")
          .setFooter("Haz clic en el título para ir al formulario")
          .setTitle("Rango de YouTuber")
          .setURL("https://goo.gl/forms/Ck8cJEi4gnXt5OGI2")
        message.channel.send(embed);
        break;

      /*case "borrar":
          if (!message.member.roles.find("name", "Owner") || !message.member.roles.find("name", "Admin") || message.member.roles.find("name", "Helper")) {
              message.channel.send('Necesitas ser staff para usar este comando');
              return;
          }
          if (isNaN(args[0])) {
              message.channel.send('Por favor introduce un número');
              return;
          }

          const fetched = message.channel.fetchMessages({limit: args[0]});
          message.delete();
          message.channel.bulkDelete(fetched)
        break;*/
      default:
        if (!message.startsWith("esuchar")) {
          console.log("Comando 1");
          message.channel.send("Comando inválido");
        }
    };
  };

  //Servidor de Angel
  if (message.guild.id == "411711319599742986") {
    if(message.author.equals(bot.user)) return;

    if(!message.content.startsWith(PREFIX)) return;

    switch (args[0].toLowerCase()) {
      case "comandos":
      var embed = new Discord.RichEmbed()
        .addField("/comandos", "Muestra esta lista", true)
        .addField("/socialbot", "Muestra información sobre SocialBot", true)
        .addField("/aplicaradmin", "Muestra el enlace para aplicar al rango Admin", true)
        .addField("/aplicaryt", "Muestra el enlace para aplicar al rango YouTuber", true)
        .addField("/escuchar", "Pone en la fila la canción de YouTube especificada", true)
        .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
        .addField("/parar", "Para la fila de canciones", true)
        .setColor("#3a96dd")
        .setDescription("Estos son los comandos actuales:")
        .setTitle("Comandos")
      message.channel.sendEmbed(embed);
      break;
      case "ayuda":
        var embed = new Discord.RichEmbed()
          .addField("/comandos", "Muestra esta lista", true)
          .addField("/socialbot", "Muestra información sobre SocialBot", true)
          .addField("/aplicaradmin", "Muestra el enlace para aplicar al rango Admin", true)
          .addField("/aplicaryt", "Muestra el enlace para aplicar al rango YouTuber", true)
          .addField("/escuchar", "Pone en la fila la canción de YouTube especificada", true)
          .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
          .addField("/parar", "Para la fila de canciones", true)
          .setColor("#3a96dd")
          .setDescription("Estos son los comandos actuales:")
          .setTitle("Comandos")
        message.channel.sendEmbed(embed);
        break;
      case "socialbot":
        message.channel.send("SocialBot v.1.3.1 | Hecho por Renato Peña / Realex78 #2193");
        break;
      case "aplicaradmin":
        var embed = new Discord.RichEmbed()
          .setColor("#3a96dd")
          .setDescription("Contesta este formulario de aplicación")
          .setFooter("Haz clic en el título para ir al formulario")
          .setTitle("Rango de Admin")
          .setURL("https://goo.gl/forms/IyUyn29GJ2VQwpEL2")
        message.channel.sendEmbed(embed);
        break;
      case "aplicaryt":
        var embed = new Discord.RichEmbed()
          .setColor("#3a96dd")
          .setDescription("¡El rango todavía no existe!")
          .setFooter("Dile al propetario del servidor que lo haga")
          .setTitle("Rango de YouTuber")
        message.channel.sendEmbed(embed);
        break;
      /*  case "borrar":
          async function delete() {
            message.delete();
            if (!message.member.roles.name == "administrador superior") {
              message.channel.send('Necesitas ser staff para usar este comando');
              return;
            }
            if (isNaN(args[1])) {
                message.channel.send('Por favor introduce un número');
                return;
            }
            const fetched = await message.channel.fetchMessages({limit: args[1]});
            fetched.delete()
          };
          delete();
          break;*/
      default:
        if (!message.content.startsWith("/escuchar")) {
          console.log("Comando 2");
          message.channel.send("Comando inválido");
        }
    };
  };
});

bot.login(TOKEN);
