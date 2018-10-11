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
module.exports = (user, channel, text = 'master', command = {}, botToken = null, callback) => {
  if (text.trim().length == 0) {
    text = 'master';
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
        branch: text,
        workflow_id: "test"
      },
      triggered_by: "curl"
    },
    json: true
  }

  console.log(text);

  request.post(options, function(err, res, body) {
    var message = `Send cURL request to Bitrise!`;

    if (body.error_msg != undefined) {
      message = body.error_msg;
    }

    if (body.status == 'error' && body.message != undefined) {
      message = body.message;
    }

    if (body.status == 'ok' && body.build_number != undefined && body.build_url != undefined) {
      message = "Build " + body.build_number + " scheduled. Follow here: " + body.build_url;
    }

    callback(null, {
      text: message,
      attachments: []
    });
  })  
};
