const User = require('../db/models/User');

module.exports = {
  handle: async (client, message) => {
    if (message.author.bot) return;
    const user = await User.findOne({ where: { id: message.author.id } });

    if (!user) {
      await User.create({
        id: message.author.id,
        username: message.author.username,
        discriminator: message.author.discriminator,
      });
    } else {
      user.username = message.author.username;
      user.discriminator = message.author.discriminator;
      await user.save();
    }
  },
};
