const axios = require('axios').default;

const { CLIENT_ROLE } = require('../utils/config');

const AccessLevel = require('../enums/AccessLevel');
const EmbedGenerator = require('../utils/EmbedGenerator');

const User = require('../db/models/User');

module.exports = {
  command: 'verify',
  accessLevel: AccessLevel.EVERYONE,
  execute: async (message) => {
    await message.author.createDM()
      .then(async (dmChannel) => {
        const items = { key: null, billingEmail: null };
        message.reply(EmbedGenerator.generate(`I have opened a private conversation with us to get you verified, ${message.author}`));
        const initialMessage = await dmChannel.send(EmbedGenerator.generate('Thank you for starting the verification process. Feel free to delete the messages containing sensitive information once the verification process has completed'));
        const apiKeyMessage = await dmChannel.send(EmbedGenerator.generate('Please send me an API key from the panel.\n\n'
        + 'To do this, follow these instructions:\n'
        + '1. Click [here](https://panel.humbleservers.com/account/api) to go to the panel\n'
        + '2. Click the **Create New** button\n'
        + '3. Set the description to **HumbleServers Discord Key** and click Create\n'
        + '4. Click the starred out Key on the left hand side of the table\n'
        + '5. Send that key to this DM, do __NOT__ send it in the HumbleServers discord'));

        const messageFilter = (m) => m.author.id === message.author.id;
        const options = { max: 1, time: 60000, errors: ['time'] };

        await dmChannel.awaitMessages(messageFilter, options)
          .then(async (pterodactylKeyCollected) => {
            await axios.get('https://panel.humbleservers.com/api/client', { headers: { Authorization: `Bearer ${pterodactylKeyCollected.first().content}` } })
              // eslint-disable-next-line no-unused-vars
              .then(async (response) => {
                items.key = pterodactylKeyCollected.first().content;
                const valid = await dmChannel.send(EmbedGenerator.generate('API Key Validated'));
                valid.delete({ timeout: 5000 });
                apiKeyMessage.delete();

                const billingEmailMessage = await dmChannel.send(EmbedGenerator.generate('Please reply to this message with your billing email'));
                await dmChannel.awaitMessages(messageFilter, options)
                  .then(async (billingEmailCollected) => {
                    items.billingEmail = billingEmailCollected.first().content;
                    billingEmailMessage.delete();

                    const user = await User.findOne({ where: { id: message.author.id } });
                    user.pterodactylApiKey = items.key;
                    user.billingEmail = items.billingEmail;
                    await user.save();

                    dmChannel.send(EmbedGenerator.generate('Verification complete, if you change any of these details, just re-run `-verify`'));
                    await message.member.roles.add(CLIENT_ROLE, 'Verified via bot');
                    initialMessage.delete();
                  });
              })
              .catch((error) => {
                console.log(error);
                dmChannel.send(EmbedGenerator.generate('That is not a valid API key, please restart the verification process with `-verify`'));
              });
          });
      })
      .catch((err) => {
        console.error(err);
        message.reply(EmbedGenerator.generate('There was a problem whilst opening a DM, have you disabled server DMs?', null, null, '#B12000'));
      });
  },
};
