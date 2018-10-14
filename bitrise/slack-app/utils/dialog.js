/**
  Slack Message Utility

  Sends a message as your bot user, provided the appropriate bot token.
  For full documentation see: https://api.slack.com/methods/dialog.open
*/

const request = require('request');
const formatDialog = require('./format_dialog.js');

module.exports = (token, channel, trigger_id, dialog, callback) => {

  let data = formatDialog(token, channel, trigger_id, dialog);

  if (!dialog) {
    return callback(null, data);
  }

  // If no token, assume development
  if (!token) {
    console.log('Warning: No token provided for message');
    return callback(null, data);
  }

  if (data.dialog) {
    data.dialog = JSON.stringify(data.dialog);
  }

  request.post({
    uri: 'https://slack.com/api/dialog.open',
    form: data
  }, (err, result) => {

    if (err) {
      return callback(err);
    }

    let body;
    try {
      body = JSON.parse(result.body);
    } catch (e) {
      body = {}
    }

    if (!body.ok) {
      return callback(new Error(body.error ? `Slack Error: ${body.error}` : 'Invalid JSON Response from Slack'));
    }

    callback(null, data);

  });

};
