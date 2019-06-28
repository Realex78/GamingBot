/*
  Packages
  ====================
*/
const Discord = require('discord.js');
const client = new Discord.Client();
const sm = require('string-similarity');
const db = require('quick.db');

/*
  Global variables
  ====================
*/
const prefix = '/';
const ownerID = '331589592027234306';
const active = new Map();
const serverStats = {
  guildID: '423621616984129547',
  totalUsersID: '460896867157409832',
  memberCountID: '460896642846031873',
  botCountID: '460896907405819915'
};
const roleChannelID = '594292459551457301';

/*
  Message Event
  ====================
*/
client.on('message', async message => {
  let blacklisted = ['gemidos'];
  let foundInText = false;
  for (let i in blacklisted) {
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true;
  };
  if (foundInText) {
    message.delete();
    message.channel.send(`<@${message.author.id}> esa palabra está bloqueada.`).then((m) => {
      m.delete(5000)
    });
    return;
  };

  if (message.author.bot) return;

  /* Support feature */
  if (message.channel.type !== 'text') {
    let active = await db.fetch(`support_${message.author.id}`);

    let guild = client.guilds.get('423621616984129547');

    let channel, found = true;

    try {
      if (active) client.channels.get(active.channelID).guild;
    } catch (e) {
      found = false;
    };

    if (!active || !found) {
      active = {};

      channel = await guild.createChannel(`soporte-${message.author.username}`, 'text', [], 'Usuario contactó soporte');

      channel.setParent('446016282324762624');
      channel.setTopic(`/completar para cerrar el ticket | Soporte para ${message.author.tag} | ID: ${message.author.id}`);
      channel.overwritePermissions('423621616984129547', {'VIEW_CHANNEL': false});
      channel.overwritePermissions('423635108726177792', {'VIEW_CHANNEL': true});

      let author = message.author;

      const newChannel = new Discord.RichEmbed()
        .setColor('#2D72FE')
        .setAuthor(author.tag, author.displayAvatarURL)
        .setFooter(`Ticket de Soporte Creado`)
        .addField('Usuario', author)
        .addField('ID', author.id);

      await channel.send(newChannel);

      const newTicket = new Discord.RichEmbed()
        .setColor('#2D72FE')
        .setAuthor(`Hola, ${author.tag}`, author.displayAvatarURL)
        .setFooter(`Ticket de Soporte Creado`);

      await author.send(newTicket);

      active.channelID = channel.id;
      active.targetID = author.id;
    };

    channel = client.channels.get(active.channelID);

    const embed = new Discord.RichEmbed()
      .setColor('#2D72FE')
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setDescription(message.content)
      .setFooter(`Mensaje Recivido | ${message.author.tag}`);

    await channel.send(embed);

    db.set(`support_${message.author.id}`, active);
    db.set(`supportChannel_${channel.id}`, message.author.id);
    return;
  };
  let support = await db.fetch(`supportChannel_${message.channel.id}`);
  if (support) {
    support = await db.fetch(`support_${support}`);

    let supportUser = client.users.get(support.targetID);
    if (!supportUser) return message.channel.delete();

    if (message.content.toLowerCase() === '/completar') {
      const complete= new Discord.RichEmbed()
        .setColor('#2D72FE')
        .setAuthor(`Oye, ${supportUser.tag}`, supportUser.displayAvatarURL)
        .setFooter('Ticket Cerrado | GamingHub')
        .setDescription('Tu ticket fue marcado como **completo**. Si quieres reabrir el ticket, o crear uno nuevo, mándame un mensaje.');

      supportUser.send(complete);

      message.channel.delete();

      return db.delete(`support_${support.targetID}`);
    };

    const embed = new Discord.RichEmbed()
      .setColor('#2D72FE')
      .setAuthor(message.author.tag, message.author.displayAvatarURL)
      .setFooter('Mensaje Recivido | GamingHub')
      .setDescription(message.content);

    client.users.get(support.targetID).send(embed);

    message.delete({timeout: 1000});

    embed.setFooter(`Mensaje Enviado | ${supportUser.tag}`).setDescription(message.content);

    return message.channel.send(embed);
  };

  /* Autoroles feature */
  if (message.channel.id == roleChannelID) {
    if (!message.member.hasPermission('ADMINISTRATOR') || message.attachments == undefined) message.delete(1000);

    let msg = message.content.toLowerCase();
    let words = msg.split(',');
    let roles = message.guild.roles.sort((roleA, roleB) => roleA.position - roleB.position).map(r => r.name);
    let parsed = {};
    let rolesToAdd = [];

    roles.length = roles.indexOf('3°A');

    roles = roles.slice(1);

    let rolesByLength = roles;

    rolesByLength.sort((a, b) => {
      return b.length - a.length
    });

    for (let i in words) {
      parsed[words[i]] = sm.findBestMatch(words[i], roles).bestMatch;
    };

    for (let i in parsed) {
      if (parsed[i].rating > .75) rolesToAdd.push(parsed[i].target);
    };

    if (rolesToAdd.length === 0) {
      for (let i in rolesByLength) {
        if (msg.includes(rolesByLength[i].toLowerCase())) {
          msg = msg.replace(rolesByLength[i].toLowerCase(), '');
          rolesToAdd.push(rolesByLength[i]);
        };
      };

      if (rolesToAdd.length === 0) {
        words = words.join(' ').split(' ');
        parsed = {};

        for (let i in words) {
          parsed[words[i]] = sm.findBestMatch(words[i], roles).bestMatch;
        };
      };
    };

    for (let i in rolesToAdd) {
      let role = message.guild.roles.find(r => r.name === rolesToAdd[i]);
      if (role.managed) rolesToAdd.splice(rolesToAdd.indexOf(rolesToAdd[i]), 1);
      else message.member.addRole(role, 'Solicitó el rol en #reglas');
    };

    const embed = new Discord.RichEmbed()
      .setColor('#2D72FE');

    if (rolesToAdd.length === 1) embed.setFooter(`Añadí el rol ${rolesToAdd[0]}.`);
    else if (rolesToAdd.length === 2) embed.setFooter(`Añadí los roles ${rolesToAdd.join(' y ')}:`);
    else if (rolesToAdd.length > 2) embed.setFooter(`Añadí los roles ${rolesToAdd.join(', ')}`);
    else embed.setTitle('Formato Inválido').setDescription('Por favor escríbe los nombres de los roles separados por comas. \n\n**Ejemplo:**\nUS South, Brasil, Western Europe');

    message.channel.send(embed).then(msg => msg.delete(5000));

    return ;
  };

  db.add(`guildMessages_${message.guild.id}_${message.author.id}`, 1);

  let args = message.content.slice(prefix.length).trim().split(' ');
  let cmd = args.shift().toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  try {
    let ops = {
      ownerID: ownerID,
      active: active
    };

    let commandFile = require(`./comandos/${cmd}.js`);
    commandFile.run(client, message, args, ops);
  } catch (e) {
    console.log(e.stack);
  };
});

client.on('guildMemberAdd', member => {
  if (member.guild.id !== serverStats.guildID) return;

  client.channels.get(serverStats.totalUsersID).setName(`Usuarios: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Miembros: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);

  let welcome = [
    `¡Hola ${member}!`,
    `¿Cómo te va, ${member}?`,
    `¿Qué hay de nuevo, ${member}?`,
    `¿Cómo están las cosas, ${member}?`,
    `¿Cómo está tu día, ${member}?`,
    `Qué bueno verte, ${member}!`,
    `¡Mucho tiempo sin verte, ${member}!`,
    `¡Encantado de conocerte, ${member}!`,
    `¿Cómo has estado, ${member}?`,
  ];
  let channel = member.guild.channels.find('name', 'nuevos-miembros');

  channel.send(welcome[Math.floor(Math.random() * welcome.length)]);
});

client.on('guildMemberRemove', member => {
  if (member.guild.id !== serverStats.guildID) return;

  client.channels.get(serverStats.totalUsersID).setName(`Usuarios: ${member.guild.memberCount}`);
  client.channels.get(serverStats.memberCountID).setName(`Miembros: ${member.guild.members.filter(m => !m.user.bot).size}`);
  client.channels.get(serverStats.botCountID).setName(`Bots: ${member.guild.members.filter(m => m.user.bot).size}`);
});

client.on('ready', () => console.log('Iniciado.'));

client.login(process.env.BOT_TOKEN);
