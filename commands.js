const { installGlobalCommands } = require('./utils.js');
require('dotenv').config();

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND];

installGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
