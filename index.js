const outdated = process.versions.node.split('v')[1] < 16.6;

if (outdated) {
  console.log('Please Upgrade to Node Version 16.6 or higher | https://nodejs.org');

  return setTimeout(process.exit, 5000);
}

require('./server/server');

const { Client } = require('discord.js');
const Enmap = require('enmap');

const { bypassed, replace, getFiles } = require('./utils/utils');
const { token, prefix, 'developer-id': dev } = require('./config.json');

const { manager, guilds } = Enmap.multi(['manager', 'guilds']);
const events = ['channelCreate', 'channelDelete', 'roleCreate', 'roleDelete', 'guildBanAdd', 'guildMemberRemove'];

// GUILD, GUILD_BANS, GUILD_MESSAGES, GUILD_MEMBERS
const client = new Client({ intents: [1 << 0, 1 << 1, 1 << 2, 1 << 9] });

const main = async (entry, history, event, guild) => {
  if (!guilds.get(guild, 'enabled')) return;

  const id = entry.executor.id;

  if (!history) {
    manager.set(event, {
      [guild]: {
        [id]: [Date.now()]
      }
    });
  } else if (bypassed(...history)) {
    const embed = { footer: { text: 'Anti Nuke' }, timestamp: new Date() };
    const server = client.guilds.cache.get(guild);
    const member = await server.members.fetch(id);

    try {
      await member.ban();

      embed.title = 'Banned ' + member.user.tag;
      embed.description = `Banned \`${member.user.tag}\` for firing multiple \`${replace(event)}\` events.`;
      embed.color = 0x00FF00;
    } catch {
      embed.title = 'Error';
      embed.description = `Unable to ban \`${member.user.tag}\` for firing multiple \`${replace(event)}\` events.`;
      embed.color = 0xFF0000;
    } finally {
      client.guilds.cache.get(guild).fetchOwner().then(owner => {
        owner.send({ embeds: [embed] }).catch(() => { });
      });
    }
  } else {
    manager.push(event, Date.now(), `${guild}.${id}`);
  }
}

client.on('ready', () => {
  client.user.setActivity({
    name: `Protecting ${client.guilds.cache.size} Servers.`,
    type: 'STREAMING',
    url: 'https://twitch.tv/pewdiepie'
  });

  client.guilds.cache.forEach(guild => {
    if (!guilds.get(guild.id)) guilds.set(guild.id, { enabled: true });
  });

  console.log('Anti Nuke Bot is Online');
});

client.on('messageCreate', message => {
  if (message.author.bot || message.channel.type === 'DM' || !message.content.startsWith(prefix)) return;

  const args = message.content.trim().split(/ +/);
  const command = args[0].slice(prefix.length).toLowerCase();

  if (getFiles('./commands').includes(command)) {
    const file = require(`./commands/${command}`);

    if (
      (file.type === 1 && message.author.id !== message.guild.ownerId) ||
      (file.type === 0 && message.author.id !== dev)) return;

    file.run(message, args, guilds);
  }
});

for (const event of events) {
  manager.ensure(event, {});

  client.on(event, async (obj) => {
    const id = obj.guild.id;
    const log = await (obj.guild ? obj.guild.fetchAuditLogs({ limit: 1, type: replace(event) }) : obj.fetchAuditLogs({ limit: 1, type: replace(event) }));
    const entry = log.entries.first();
  
    if (!entry) return;
  
    const history = manager.get(event, `${id}.${entry.executor.id}`);
    main(entry, history, event, id);
  });
}

for (const event of getFiles('./events'))
  client.on(event, guild => require('./events/' + event).run(guild, guilds));

client.login(token);
