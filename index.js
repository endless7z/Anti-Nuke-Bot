const config = require('./config.json');
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const manager = {};

const events = ['channelCreate', 'channelDelete', 'roleCreate', 'roleDelete', 'guildBanAdd', 'guildMemberRemove'];

function main(entry, history, event) {
  if (!history) {
    manager[event][entry.executor.id] = [Date.now()];
  } else if (Date.now() - history[history.length - 1] <= config.interval) {
    const user = client.guilds.cache.get(config['guild-id']).members.cache.get(entry.executor.id);

    if (user && user.bannable) user.ban().catch(() => {});
  } else {
    manager[event][entry.executor.id].push(Date.now());
  };
};

function replace(string) {
  if (typeof string !== 'string') return null;

  return string.split(/(?=[A-Z])/).map(word => word.toUpperCase()).join('_');
};

client.on('ready', () => {
  const guild = client.guilds.cache.get(config['guild-id']);

  if (!guild) {
    console.error(`Invalid Guild ID (${config['guild-id']})`);
    
    setTimeout(process.exit, 3000);
  } else {
    console.log('Anti Nuke Bot is Online');
  };
});

events.forEach(event => {
  manager[event] = {};
 
  client.on(event, async (obj) => {
    const log = await (obj.guild ? obj.guild.fetchAuditLogs({ limit: 1, type: replace(event) }) : obj.fetchAuditLogs({ limit: 1, type: replace(event) }));
    const entry = log.entries.first();
  
    if (!entry) return;
  
    const history = manager[event][entry.executor.id];
    main(entry, history, event);
  });
});

client.login(config.token);
