const {
  InteractionResponseType,
  MessageComponentTypes,
} = require('discord-interactions');

const { getRandomEmoji } = require('../lib/utils');

const applicationHandler = async (req, res, name) => {
  console.log('Aplication Controller');
  console.log(name);
  switch (name) {
    case 'test':
      // Send a message into the channel where command was triggered from
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: 'hello world ' + getRandomEmoji(),
        },
      };
    default:
      return {
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'A message with a button',
          // Selects are inside of action rows
          components: [
            {
              type: MessageComponentTypes.ACTION_ROW,
              components: [
                {
                  type: MessageComponentTypes.STRING_SELECT,
                  // Value for your app to identify the select menu interactions
                  custom_id: 'my_select',
                  // Select options - see https://discord.com/developers/docs/interactions/message-components#select-menu-object-select-option-structure
                  options: [
                    {
                      label: 'Option #1',
                      value: 'option_1',
                      description: 'The very first option',
                    },
                    {
                      label: 'Second option',
                      value: 'option_2',
                      description: 'The second AND last option',
                    },
                  ],
                },
              ],
            },
          ],
        },
      };
  }
};

module.exports = applicationHandler;
