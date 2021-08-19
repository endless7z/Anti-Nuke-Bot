module.exports = {
  type: 1,
  description: 'Enables protection in the guild this is executed in.',
  run(message, _, guilds) {
    if (guilds.get(message.guild.id, 'enabled')) return;

    guilds.set(message.guild.id, { enabled: true });

    message.reply({ embeds: [{
      title: 'Enabled Protection',
      description: 'Your server is now protected',
      color: 0x00FF00,
      footer: {
        text: 'Anti Nuke'
      },
      timestamp: new Date()
    }]});
  }
}