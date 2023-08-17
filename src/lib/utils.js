const { verifyKey } = require('discord-interactions');
require('dotenv').config();

/**
 * Middleware para verificar las solicitudes entrantes de Discord.
 * @param {string} clientKey - Clave secreta del cliente.
 * @returns {Function} - Función middleware para la verificación.
 */
const verifyDiscordRequest = (clientKey) => (req, res, buf, encoding) => {
  const { 'x-signature-ed25519': signature, 'x-signature-timestamp': timestamp } = req.headers;

  const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);

  if (!isValidRequest) {
    res.status(401).send('Bad request signature');
    throw new Error('Bad request signature');
  }

};
const discordRequest = async (endpoint, options) => {
  const url = 'https://discord.com/api/v10/' + endpoint;

  if (options.body) options.body = JSON.stringify(options.body);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options,
  });

  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }

  return res;
};

const installGlobalCommands = async (appId, commands) => {
  const endpoint = `applications/${appId}/commands`;

  try {
    await discordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
};

const getRandomEmoji = () => {
  const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
};

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

module.exports = {
  verifyDiscordRequest,
  discordRequest,
  installGlobalCommands,
  getRandomEmoji,
  capitalize,
};
