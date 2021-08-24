module.exports = {
  run(guild, guilds) {
    guilds.ensure(guild.id, { enabled: true });

    console.log(`[JOIN] Joined ${guild.name}`);
  }
}