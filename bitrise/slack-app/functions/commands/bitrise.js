const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const request = require('request');
const storage = require('../../helpers/storage.js');

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
  storage.getBitriseAppToken(command.team_id, (err, token) => {
    if (text.trim().length == 0) {
      text = 'master';
    }

    let setBitriseAppTokenDialog = {
      dialog: {
        callback_id: 'access_token',
        title: 'Personal Access Token',
        submit_label: 'Update',
        notify_on_cancel: true,
        elements: [
          {
            type: 'text',
            label: 'THE-ACCESS-TOKEN',
            placeholder: 'Tokens that can be used to access the Bitrise API.',
            name: 'token',
            min_length: 80,
            hint: 'Generate through https://app.bitrise.io/me/profile#/security'
          }
        ]
      }
    };

    if (err) {
      return callback(null, setBitriseAppTokenDialog);
    }

    const options = {
      url: 'https://api.bitrise.io/v0.1/apps?sort_by=last_build_at',
      method: 'GET',
      headers: {
        Authorization: `token ${token}`
      },
      json: true
    };

    request.get(options, function (err, res, body) {
      var message = 'Send cURL request to Bitrise!';
      var attachments = [];

      if (body.error_msg != undefined) {
        message = body.error_msg;
      }

      if (body.status == 'error' && body.message != undefined) {
        message = body.message;
      }

      if (res.statusCode == 401) {
        return callback(null, setBitriseAppTokenDialog);
      }

      var actions = [];

      if (body.data != undefined) {
        actions = body.data.map(app => {
          return {
            name: 'app',
            text: app.title,
            type: 'button',
            value: JSON.stringify({ branch: text, app_slug: app.slug })
          }
        });
      }

      if (actions.length == 0) {
        return callback(null, {
          'text': message,
          'attachments': attachments
        })
      }

      callback(null, {
        "text": "Which app will you run now?",
        "attachments": [
          {
            "fallback": "You are unable to choose an app",
            "callback_id": "app_id",
            "color": "#492f5c",
            "attachment_type": "default",
            "actions": actions
          }
        ]
      });
    });
  });
};
