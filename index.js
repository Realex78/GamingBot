//Cosas de inicialización
const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = process.env.BOT_TOKEN;
const PREFIX = "/"

var bot = new Discord.Client();

var servers = {};

bot.on("ready", function() {
  console.log("¡Listo!")
  console.log("SocialBot corriendo en la versión 1.3.3")
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
  if(message.author.equals(bot.user)) return;

  if(!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  var HelpEmbed = new Discord.RichEmbed()
    .addField("/comandos", "Muestra esta lista", true)
    .addField("/info", "Muestra información sobre GamingBot", true)
    .addField("/escuchar", "Pone en la fila la canción de YouTube especificada", true)
    .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
    .addField("/parar", "Para la fila de canciones", true)
    .setColor("#3a96dd")
    .setDescription("Estos son los comandos actuales:")
    .setTitle("Comandos")

  var ErrorMessage = [
    "Hmmm... intenta ",
    "Creo que sería más fácil ",
    "Ayúdame ",
  ];

  switch (args[0].toLowerCase()) {
    case "comandos":
      message.channel.sendEmbed(HelpEmbed);
      break;
    case "ayuda":
      message.channel.sendEmbed(HelpEmbed);
      break;
    case "info":
      message.channel.send("GamingBot v.1.3.3 | Hecho por Renato Peña / Realex78#2193");
      break;
    case "escuchar":
      if (!args[1]) {
        message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "incluyendo un link a un video de YouYube.");
        return
      }
      if (!message.member.voiceChannel) {
        message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "metiéndote en un canal de voz.");
        return
      }
      if (!servers[message.guild.id]) servers[message.guild.id] = {
        queue: []
      };
      var server = servers[message.guild.id];
      server.queue.push(args[1]);
      if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
        play(connection, message);
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
      message.channel.send("Comando inválido");
    };
  });

bot.login(TOKEN);
