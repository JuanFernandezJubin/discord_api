const { verifyKey } = require('discord-interactions');
const axios = require('axios');

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

  const headers = {
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    'Content-Type': 'application/json; charset=UTF-8',
    'User-Agent': 'DiscordBot (SASHA, 1.0.0)',
  };

  const axiosConfig = {
    method: 'PUT',
    url,
    headers,
    data: options.body,
  };

  const response = await axios(axiosConfig);
  return response.data;
};


const installGlobalCommands = async (appId, commands) => {
  const endpoint = `applications/${appId}/commands`;

  try {
    await discordRequest(endpoint, { method: 'PUT', body: commands });
    console.log('Successfully registered application commands.');
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
