//Cosas de inicialización
const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const request = require('request');

const TOKEN = process.env.BOT_TOKEN;
const PREFIX = "/"

var bot = new Discord.Client();

var servers = {};

var version = "1.3.6 (Beta)"
bot.on("ready", function() {
  console.log("¡Listo!")
  console.log("SocialBot corriendo en la versión " + version)
  bot.user.setPresence({ game: { name: 'versión ' + version, type: 'PLAYING' }, status: 'idle' })
});

function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));

  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) {
      play(connection, message)
    } else {
      connection.disconnect();
      message.channel.send(SuccessMessage[Math.floor(Math.random() * SuccessMessage.length)] + "La fila fue reproducida completamente. Me he desconectado del canal de voz.")
    }
  })
}

bot.on("guildMemberAdd", function(member) {
  var welcome = [
    "¡Hola " + member + "!",
    "¿Cómo te va, " + member + "?",
    "¿Qué hay de nuevo, " + member + "?",
    "¿Cómo están las cosas, " + member + "?",
    "¿Cómo está tu día, " + member + "?",
    "¡Qué bueno verte, " + member + "!",
    "¡Mucho tiempo sin verte, " + member + "!",
    "¡Encantado de conocerte, " + member + "!",
    "¿Cómo has estado, " + member + "?",
  ];
  const channel = member.guild.channels.find('name', 'nuevos-miembros');
  if (!channel) return;
  channel.send(welcome[Math.floor(Math.random() * welcome.length)]);
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
      message.channel.send(HelpEmbed);
      break;
    case "ayuda":
      message.channel.send(HelpEmbed);
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
      message.channel.send(SuccessMessage[Math.floor(Math.random() * SuccessMessage.length)] + "La fila fue parada y borrada. Me he desconectado del canal de voz.")
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
    case "clima":
      if (!args[1]) {
        message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "incluyendo el nombre de una ciudad.");
        return
      }

      let apiKey = process.env.WEATHER_TOKEN;
      let city = "ciudad de mexico";
      let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`

      request(url, function (err, response, body) {
        if(err){
          console.log('error:', error);
        } else {
          message.channel.send('body:', body);
        }
      });
      
      break;
    default:
      message.channel.send(ErrorMessage[Math.floor(Math.random() * ErrorMessage.length)] + "escribiendo un comando válido. Utiliza /ayuda para verlos.");
    };
  });

bot.login(TOKEN);
