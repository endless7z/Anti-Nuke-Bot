module.exports = {
  run(guild, guilds) {
    if (guilds.get(guild.id)) guilds.remove(guild.id);

    console.log(`[LEAVE] Left ${guild.name}`);
  }
}