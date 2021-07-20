const config = require('./config.json');
const { Client, Intents } = require('discord.js');

const client = new Client({ ws: { intents: Intents.ALL } });
const manager = { channelCreate: {}, channelDelete: {}, roleCreate: {}, roleDelete: {}, ban: {}, kick: {} };

const events = ['channelCreate', 'channelDelete', 'roleCreate', 'roleDelete', 'guildBanAdd', 'guildMemberRemove'];

function main(entry, history, event) {
  if (!history) {
    manager[event][entry.executor.id] = [Date.now()];
  } else if (Date.now() - history[history.length - 1] <= 2500) {
    const user = client.guilds.cache.get(config['guild-id']).members.cache.get(entry.executor.id);

    if (user) user.ban().catch(() => {});
  } else {
    manager[event][entry.executor.id].push(Date.now());
  };
};

function replace(string) {
  if (typeof string !== 'string') return null;

  return string.split(/(?=[A-Z])/).map(word => word.toUpperCase()).join('_');
};

client.on('ready', () => {
  console.log('Anti Nuke Bot is Online');
});

events.forEach(event => {
  client.on(event, async (obj) => {
    const log = await (obj.guild ? obj.guild.fetchAuditLogs({ limit: 1, type: replace(event) }) : obj.fetchAuditLogs({ limit: 1, type: replace(event) }));
    const entry = log.entries.first();
  
    if (!entry) return;
  
    const history = manager[event][entry.executor.id];
    main(entry, history, event);
  });
});

client.login(config.token);
