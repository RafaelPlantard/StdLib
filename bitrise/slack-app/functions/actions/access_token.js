const lib = require('lib')({ token: process.env.STDLIB_TOKEN });
const request = require('request');
const storage = require('../../helpers/storage.js');
const bitrise = require('../../functions/commands/bitrise.js');

/**
* example.js
*
*   Basic worfklow action handler. Called in response to an input from an
*     interactive message action with name set to "worflow".
*   All Actions in response to interactive messages use this template, simply
*     create additional files with different names to add actions.
*
*   See https://api.slack.com/docs/message-buttons for more details.
*
* @param {string} user The user id of the user that invoked this command (name is usable as well)
* @param {string} channel The channel id the command was executed in (name is usable as well)
* @param {object} action The full Slack action object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user, channel, action = {}, botToken = null, callback) => {
  let noTokenError = 'No token provided for *Personal access tokens (BETA)*.';

  if (action.type == 'dialog_cancellation') {
    return callback(null, {
      text: noTokenError,
      attachments: []
    });
  }

  storage.setBitriseAppToken(action.team.id, action.submission.token, (err, token) => {
    if (err) {
      callback(null, {
        text: noTokenError,
        attachments: []
      });
    }

    let state = JSON.parse(action.state);

    bitrise(user, channel, state.text, state.command, botToken, callback);
  });
};

