# Anti Nuke Bot
A discord bot to protect your servers.
# Requirements
- [`node.js`](https://nodejs.org) v16.6
# Setup
1. Open a terminal in this folder and run `npm i`
2. Fill in the values in [`config.json`](./config.json)
```jsonc
{
    // Discord bot token
    "token": "",

    // 2 events fired in under 2500 milliseconds = ban.
    // 4 events fired in under 15000 milliseconds = ban.
    "intervals": [2500, 15000],

    // Your user ID
    "developer-id": "",

    // Bot prefix
    "prefix": "=",

    // Port (unimportant if you don't want to host it 24/7)
    "port": 8000
}
```
3. Run `node .` in the terminal
# License
[Apache License 2.0](./LICENSE)
