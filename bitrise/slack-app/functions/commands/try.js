const lib = require('lib')({ token: process.env.STDLIB_TOKEN });
const request = require('request');

/**
* /test
*
*   Run 'test' workflow on Bitrise.
*   All Commands use this template, simply create additional files with
*   different names to add commands.
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {object} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, text = 'master', command = {}, botToken = null, callback) => {
  callback(null, {
    dialog: {
      callback_id: `set_personal_access_token`,
      title: `Personal Access Token`,
      submit_label: `Update`,
      notify_on_cancel: false,
      elements: [
        {
          type: `text`,
          label: `Personal Access Token`,
          name: `token`
        }
      ]
    }
  });
};
