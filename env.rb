require 'json'

environmentVariables = {
    ENV['STDLIB_ENV'] || 'dev' => {
        'STDLIB_TOKEN' => ENV['STDLIB_TOKEN'] || '',
        'SLACK_CLIENT_ID' => ENV['SLACK_CLIENT_ID'] || '',
        'SLACK_CLIENT_SECRET' => ENV['SLACK_CLIENT_SECRET'] || '',
        'SLACK_VERIFICATION_TOKEN' => ENV['SLACK_VERIFICATION_TOKEN'] || '',
        'SLACK_OAUTH_SCOPE' => ENV['SLACK_OAUTH_SCOPE'] || '',
        'SLACK_APP_NAME' => ENV['SLACK_APP_NAME'] || '',
        'SLACK_REDIRECT' => ENV['SLACK_REDIRECT'] || ''
    }
};

environmentVariablesJson = JSON.pretty_generate(environmentVariables);

File.write("bitrise/slack-app/env.json", environmentVariablesJson); 
