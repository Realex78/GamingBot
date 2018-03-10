//Cosas de inicialización
const Discord = require("discord.js");
const YTDL = require("ytdl-core");

const TOKEN = process.env.BOT_TOKEN;
const PREFIX = "/"

var bot = new Discord.Client();

var servers = {};

var version = "1.3.5"
bot.on("ready", function() {
  console.log("¡Listo!")
  console.log("SocialBot corriendo en la versión " + version)
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
  member.guild.channels.find("id", "421828860590424064").send(welcome[Math.floor(Math.random() * welcome.length)]);
});

bot.on("message", function(message) {
  if(message.author.equals(bot.user)) return;

  if(!message.content.startsWith(PREFIX)) return;

  var args = message.content.substring(PREFIX.length).split(" ");

  var HelpEmbed = new Discord.RichEmbed()
    .addField("/comandos", "Muestra esta lista", true)
    .addField("/info", "Muestra información sobre GamingBot", true)
    .addField("/escuchar <String: Link de YouTube>", "Pone en la fila la canción de YouTube especificada", true)
    .addField("/saltar", "Salta la canción y pasa a la siguiente el la fila", true)
    .addField("/parar", "Para la fila de canciones", true)
    .addField("/borrar <Number: Número de mensajes a eliminar>", "Elimina los mensajes especificados. **Solo para staff.**", true)
    .setColor("#3a96dd")
    .setDescription("Estos son los comandos actuales:")
    .setTitle("Comandos")

  var ErrorMessage = [
    "Hmmm... intenta ",
    "Creo que sería más fácil ",
    "Ayúdame ",
    "Oops. Intenta ",
  ];

  var SuccessMessage = [
    "¡Yay! ",
    "¡Hurra! ",
    "¡Súper! "
  ];

  var DenyMessage = [
    "Hmmm... no puedes hacer este comando porque ",
    "Creo que ",
    "Oops, ",
  ];

  switch (args[0].toLowerCase()) {
    case "comandos":
      message.channel.sendEmbed(HelpEmbed);
      break;
    case "ayuda":
      message.channel.sendEmbed(HelpEmbed);
      break;
    case "info":
      message.channel.send("GamingBot v." + version + " | Hecho por Renato Peña / @Realex78#2193");
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
        message.channel.send(SuccessMessage[Math.floor(Math.random() * SuccessMessage.length)] + "La canción fue agregada a la cola.")
      });
      break;
    case "saltar":
      if (server == null) {
        message.channel.send(DenyMessage[Math.floor(Math.random() * DenyMessage.length)] + "no hay nada en la fila.");
        return;
      };
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      message.channel.send(SuccessMessage[Math.floor(Math.random() * SuccessMessage.length)] + "La canción fue saltada.")
      break;
    case "parar":
      var server = servers[message.guild.id];
      if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
      message.channel.send(SuccessMessage[Math.floor(Math.random() * SuccessMessage.length)] + "La fila fue parada y borrada.")
      break;
    case "borrar":
      async function purge() {
          message.delete();
          if (!message.member.roles.find("name", "Staff")) {
              message.channel.send(DenyMessage[Math.floor(Math.random() * DenyMessage.length)] + "no eres staff.");
              return;
          };

          if (isNaN(args[1])) {
              message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "poniendo un número");
              return;
          };

          const fetched = await message.channel.fetchMessages({limit: args[1]});
          message.channel.bulkDelete(fetched);
      };
      purge();
      break;
    default:
      message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "escribiendo un comando válido. Utiliza /ayuda para verlos.");
    };
  });

bot.login(TOKEN);
