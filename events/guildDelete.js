module.exports = {
  run(guild, guilds) {
    if (!guilds.get(guild.id)) guilds.set(guild.id, { enabled: true });

    console.log(`[JOIN] Joined ${guild.name}`);
  }
}