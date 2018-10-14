/**
  Slack Format Message Utility

  Format a message into the correct format Slack expect (from raw text or
    proper object).

  For full documentation see: https://api.slack.com/methods/dialog.open
*/

module.exports = (token, channel, trigger_id, dialog) => {
  return {
    token: token,
    trigger_id: trigger_id,
    dialog: dialog,
    channel: channel,
    as_user: false,
    response_type: 'in_channel'
  };
};
