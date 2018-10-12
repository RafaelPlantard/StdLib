const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const request = require('request');
const yaml = require('js-yaml');

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
  var value = { branch: 'master', app_slug: '' };

  if (action.actions[0].value != undefined) {
    value = JSON.parse(action.actions[0].value);
  }

  const options = {
    url: `https://api.bitrise.io/v0.1/apps/${value.app_slug}/bitrise.yml`,
    method: 'GET',
    headers: {
      Authorization: 'token ***REMOVED***'
    },
    json: true
  };

  request.get(options, function(err, res, body) {
    var message = 'We\'re unable to list workflows';
    var attachments = [];

    if (body.error_msg != undefined) {
      message = body.error_msg;
    }

    if (body.status == 'error' && body.message != undefined) {
      message = body.message;
    }

    if (body != undefined) {
      let yamlString = yaml.safeLoad(body);
      let workflows = Object.keys(yamlString.workflows);

      message = "Which workflow will you run now?";

      if (workflows.length > 0) {
        let actions = workflows.map(workflow => {
          var valueWithWorkflow = value;
          valueWithWorkflow['workflow_id'] = workflow;

          return {
            name: 'workflow',
            text: workflow,
            type: 'button',
            value: JSON.stringify(valueWithWorkflow)
          }
        });

        attachments = [
          {
            "fallback": "You are unable to choose a worflow",
            "callback_id": "workflow_id",
            "color": "#3bc3a3",
            "attachment_type": "default",
            "actions": actions
          }
        ]        
      }

      callback(null, {
        text: message,
        attachments: attachments
      });
    }
  })
};
