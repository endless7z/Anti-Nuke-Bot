module.exports = {
  type: 0,
  description: 'Execute valid JavaScript code',
  run(message, args) {
    if (!args.length) return;

    const code = args.slice(1).join(' ');
    const embed = { footer: { text: 'Anti Nuke' }, timestamp: new Date() };

    const clean = (string) => {
      if (typeof string !== 'string')
        string = require('util').inspect(string);
      
      if (string.length > 2000) return null;

      const space = String.fromCharCode(8203);

      return string
        .replace(/`/g, '`' + space)
        .replace(/@/g, '@' + space);
    }

    try {
      const str = eval(code);

      embed.title = 'Eval';
      embed.color = 0x00FF00;

      embed.description = `\`\`\`js\n${clean(str)}\`\`\``;
    } catch (err) {
      embed.title = 'Error';
      embed.color = 0xFF0000;

      embed.description = `\`\`\`${clean(err)}\`\`\``;
    } finally {
      message.channel.send({ embeds: [embed] });
    }
  }
}
