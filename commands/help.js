const { getFiles } = require('../utils/utils');
const { prefix } = require('../config.json');

module.exports = {
  type: 1,
  description: 'List of Commands',
  run(message) {
    const files = getFiles(__dirname);
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

    const embed = {
      color: 0xFFD700,
      title: `Commands (${files.length - 1})`,
      description: `**Prefix is \`${prefix || 'N/A'}\`**`,
      timestamp: new Date(),
      footer: {
        text: 'Anti Nuke'
      },
      fields: []
    };

    const data = files.map(command => {
      if (command === 'help') return;

      const file = require('./' + command);

      return {
        value: `\`${capitalize(command)}\` - ${file.description}`,
        type: file.type
      }
    });

    const developer = data.filter(command => command?.type === 0);
    const owner = data.filter(command => command?.type === 1);

    const commands = [owner, developer];
    const types = ['Owner', 'Developer'];

    for (const index in commands) {
      const str = commands[index].map(command => command.value).join('\n');

      embed.fields.push({ name: types[index] + ' Commands', value: str || 'None', inline: false });
    }

    message.channel.send({ embeds: [embed] });
  }
}
