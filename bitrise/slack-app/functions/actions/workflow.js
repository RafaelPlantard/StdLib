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
  let value = {}

  if (action.actions[0].value != undefined) {
    value = JSON.parse(action.actions[0].value);
  }

  if (!value.branch || !value.app_slug || !value.token) {
    return callback(null, {
      text: `*Branch name*, *Bitrise's app* and *Bitrise's token* are required.`,
      attachments: []
    });
  }

  const options = {
    url: `https://api.bitrise.io/v0.1/apps/${value.app_slug}/builds`,
    method: 'POST',
    body: {
      hook_info: { 
        type: "bitrise"
      },
      build_params: {
        branch: value.branch,
        workflow_id: value.workflow_id
      },
      triggered_by: "bitrise_api_doc"
    },
    headers: {
      Authorization: `token ${value.token}`
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
              url: `https://app.bitrise.io/app/${value.app_slug}`
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
