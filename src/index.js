require('dotenv').config();

// Main Libraries
const express = require('express');
const {
  InteractionType,
  InteractionResponseType,
} = require('discord-interactions');

// Controllers
const { applicationHandler } = require('./interactions');
// Extras
const { verifyDiscordRequest } = require('./lib/utils');

// Create an express app
const app = express();


// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: verifyDiscordRequest(process.env.PUBLIC_KEY) }));


/**
 * Interactions endpoint URL where Discord w!ill send HTTP requests
 */
app.post('/interactions', async (req, res) => {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  console.log(InteractionType);
  console.log({
    type,
    id,
  });

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    try {
      const response = await applicationHandler(req, res, name);
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'An error occurred while executing the command',
        },
      });
    }
  }
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
