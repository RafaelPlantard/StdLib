const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const request = require('request');

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
  var branch = "master";
  var workflow_id = "test";
  let app_slug = '';

  if (action.actions[0].value != undefined) {
    let values = action.actions[0].value.split("|");

    workflow_id = values[0];
    branch = values[1];
  }

  const options = {
    url: `https://app.bitrise.io/app/${app_slug}/build/start.json`,
    method: 'POST',
    body: {
      hook_info: { 
        type: "bitrise",
        build_trigger_token: ""
      },
      build_params: {
        branch: branch,
        workflow_id: workflow_id
      },
      triggered_by: "curl"
    },
    json: true
  }

  request.post(options, function(err, res, body) {
    var message = `Send cURL request to Bitrise!`;
    var attachments = [];

    if (body.error_msg != undefined) {
      message = body.error_msg;
    }

    if (body.status == 'error' && body.message != undefined) {
      message = body.message;
    }

    if (body.status == 'ok' && body.build_number != undefined && body.build_url != undefined) {
      message = "Build " + body.build_number + " scheduled.";
      attachments = [
        {
          fallback: "Follow here: " + body.build_url,
          actions: [
            {
              type: "button",
              text: "View App",
              url: `https://app.bitrise.io/app/${app_slug}`
            },
            {
              type: "button",
              text: "View Build",
              url: body.build_url
            }
          ]
        }
      ]
    }

    callback(null, {
      text: message,
      attachments: attachments
    });
  })
};
