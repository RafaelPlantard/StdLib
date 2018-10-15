/**
  StdLib Storage Utility for Slack

  Using your StdLib Library Token, connect to `utils.storage` (key-value storage)
  and save team identity data (bot access token, etc.) for future reference.
*/

const lib = require('lib')({token: process.env.STDLIB_TOKEN});

function formatTeamKey(teamId) {
  return `SLACK::${process.env.SLACK_APP_NAME}::${teamId}`;
};

function formatBitriseAppToken(teamId) {
  return `BITRISE_APP_TOKEN::${process.env.SLACK_APP_NAME}::${teamId}`;
}

function formatBitriseTriggerToken(teamId, appSlug) {
  return `BITRISE_TRIGGER_TOKEN::${process.env.SLACK_APP_NAME}::${teamId}`;
}

const CACHE = {};

module.exports = {
  setTeam: (teamId, value, callback) => {
    lib.utils.storage.set(formatTeamKey(teamId), value, (err, value) => {
      if (!err) {
        CACHE[teamId] = value;
      }
      callback(err, value);
    });
  },
  getTeam: (teamId, callback) => {
    if (CACHE[teamId]) {
      return callback(null, CACHE[teamId]);
    }
    lib.utils.storage.get(formatTeamKey(teamId), (err, value) => {
      if (!err) {
        CACHE[teamId] = value;
      }
      callback(err, value);
    });
  },
  setBitriseAppToken: (teamId, value, callback) => {
    lib.utils.storage.set(formatBitriseAppToken(teamId), value, (err, value) => {
      if (!err) {
        CACHE[`${teamId}.bitrise_app_token`] = value;
      }
      callback(err, value);
    });
  },
  getBitriseAppToken: (teamId, callback) => {
    if (CACHE[`${teamId}.bitrise_app_token`]) {
      return callback(null, CACHE[`${teamId}.bitrise_app_token`]);
    }
    lib.utils.storage.get(formatBitriseAppToken(teamId), (err, value) => {
      if (!err) {
        CACHE[`${teamId}.bitrise_app_token`] = value;
      }
      callback(err, value);
    });
  },
  setBitriseTriggerToken: (teamId, value, callback) => {
    lib.utils.storage.set(formatBitriseTriggerToken(teamId), value, (err, value) => {
      if (!err) {
        CACHE[`${teamId}.bitrise_trigger_token`] = value;
      }
      callback(err, value);
    });
  },
  getBitriseTriggerToken: (teamId, callback) => {
    if (CACHE[`${teamId}.bitrise_trigger_token`]) {
      return callback(null, CACHE[`${teamId}.bitrise_trigger_token`]);
    }
    lib.utils.storage.get(formatBitriseTriggerToken(teamId), (err, value) => {
      if (!err) {
        CACHE[`${teamId}.bitrise_trigger_token`] = value;
      }
      callback(err, value);
    });
  }
};
