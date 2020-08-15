const AccessLevel = require('../enums/AccessLevel');
const EmbedGenerator = require('../utils/EmbedGenerator');

const WikiResponse = require('../db/models/WikiResponse');

module.exports = {
  command: 'wiki',
  accessLevel: AccessLevel.EVERYONE,
  description: 'Shows iwki responses',
  execute: async (message, args) => {
    if (args && args[0]) {
      switch (args[0]) {
        case 'list': {
          const wikiResponses = await WikiResponse.findAll();
          const responseString = wikiResponses.map((response) => `${response.id}. \`${response.trigger}\``);
          message.channel.send(EmbedGenerator.generate(`Responses: \n${responseString.join('\n')}`));
          break;
        }
        case 'add': {
          if (!AccessLevel.hasAccess(message.member, AccessLevel.SUPPORT)) return;
          const trigger = args[1];
          if (trigger === 'add' || trigger === 'remove' || trigger === 'list') return;
          const wikiExists = await WikiResponse.findOne({ where: { trigger } });
          if (wikiExists === null) {
            args.shift();
            args.shift();
            if (args.length !== 0) {
              const response = args.join(' ');
              WikiResponse.create({
                trigger,
                response,
              });
              message.channel.send(EmbedGenerator.generate(`A new wiki response has been added, you can use this by running \`-wiki ${trigger}\``));
            }
          } else {
            message.channel.send(EmbedGenerator.generate('Trigger already exists'));
          }
          break;
        }
        case 'remove': {
          if (!AccessLevel.hasAccess(message.member, AccessLevel.SUPPORT)) return;
          const trigger = args[1];
          const wikiExists = await WikiResponse.findOne({ where: { trigger } });
          if (wikiExists === null) {
            message.channel.send(EmbedGenerator.generate('Trigger does not exist'));
          } else {
            await WikiResponse.destroy({ where: { trigger } });
            message.channel.send(EmbedGenerator.generate('Wiki response has been removed'));
          }
          break;
        }
        default: {
          const trigger = args[0];
          const wikiResponse = await WikiResponse.findOne({ where: { trigger } });
          if (wikiResponse !== null) {
            message.channel.send(EmbedGenerator.generate(wikiResponse.response));
          } else {
            message.channel.send(EmbedGenerator.generate('Wiki response not found'));
          }
          break;
        }
      }
    } else {
      message.channel.send(EmbedGenerator.generate(
        'Invalid usage, commands are: \n'
            + '- `-wiki list` ~ Displays a list of wiki topics\n'
            + '- `-wiki <name>` ~ Triggers a wiki response\n'
            + '- `-wiki add <name> <response>` ~ Adds a wiki response\n'
            + '- `-wiki remove <name>` ~ Removes a wiki response',
      ));
    }
  },
};
