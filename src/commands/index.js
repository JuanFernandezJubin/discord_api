// Import de comandos
const { testCommand } = require('./tests');

const { installGlobalCommands } = require('../lib/utils');

require('dotenv').config();

const ALL_COMMANDS = [
  testCommand,
];

installGlobalCommands(process.env.APP_ID, ALL_COMMANDS);