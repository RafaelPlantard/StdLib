const lib = require('lib')({token: process.env.STDLIB_TOKEN});
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
module.exports = (user, channel, text = '', command = {}, botToken = null, callback) => {
  var branch = "master";

  if (text.length > 0) {
    branch = text;
  }

  const options = {
    url: 'https://app.bitrise.io/app//build/start.json',
    method: 'POST',
    body: {
      hook_info: { 
        type: "bitrise",
        build_trigger_token: ""
      },
      build_params: {
        branch: branch,
        workflow_id: "test"
      },
      triggered_by: "curl"
    },
    json: true
  }

  request.post(options, function(err, res, body) {
    callback(null, {
      text: `Send cURL request to Bitrise!`,
      attachments: []
    });
  })  
};
