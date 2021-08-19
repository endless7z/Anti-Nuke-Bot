module.exports = {
  type: 1,
  description: 'Disables protection in the guild this is executed in.',
  run(message, _, guilds) {
    if (!guilds.get(message.guild.id, 'enabled')) return;

    message.reply({ embeds: [{
      title: 'Disable Protection',
      description: 'Are you sure you want to do this? `yes` or `no`',
      color: 0xFFD700,
      footer: {
        text: 'Anti Nuke'
      },
      timestamp: new Date()
    }]});

    const filter = _message => _message.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 1e4, max: 1 });

    const embed = {
      title: 'Disable Protection',
      timestamp: new Date(),
      footer: {
        text: 'Anti Nuke'
      }
    };

    collector.on('collect', _message => {
      if (_message.content === 'yes') {
        guilds.set(message.guild.id, { enabled: false });

        embed.color = 0xFF0000;
        embed.description = 'Protection disabled. Your server will be vulnerable.';
      } else if (_message.content === 'no') {
        embed.color = 0x00FF00;
        embed.description = 'Action canceled.';
      } else {
        embed.color = 0xFF0000;
        embed.description = 'Invalid response';
      }

      _message.reply({ embeds: [embed] });
    });

    collector.on('end', collected => {
      if (!collected.size) {
        embed.color = 0xFF0000;
        embed.description = 'Request timed out. Action canceled.';

        message.reply({ embeds: [embed] });
      }
    });
  }
}