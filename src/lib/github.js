'use strict';

const rp = require('request-promise');
const config = require('../config');

const github_client = rp.defaults({
    headers: {
        'User-Agent': 'OlivierCoilland/carson',
        'Authorization': 'token ' + config.token
    },
    json: true
});

function add_welcome_comment_to_issue(comments_url) {
    github_client({
        method: 'POST',
        uri: comments_url,
        body: {
            body: "Hi, I'm Carson, have fun!"
        }
    })
    .then(function (body) {
        console.log("New issue comment added!");
    })
    .catch(function (err) {
        console.error(err);
    });
}

module.exports.add_welcome_comment_to_issue = add_welcome_comment_to_issue;
