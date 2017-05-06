'use strict';

const rp = require('request-promise');
const config = require('../config');

const github_client = rp.defaults({
    headers: {
        'User-Agent': config.repository,
        'Authorization': 'token ' + config.token
    },
    json: true
});

function get_comments(comments_url) {
    return github_client({
        method: 'GET',
        uri: comments_url
    });
}

function add_comment_to_issue(comments_url, body) {
    return github_client({
        method: 'POST',
        uri: comments_url,
        body: {
            body: body
        }
    });
}

function edit_comment(comment_url, body) {
    return github_client({
        method: 'PATCH',
        uri: comment_url,
        body: {
            body: body
        }
    });
}

function delete_comment(comment_url) {
    return github_client({
        method: 'DELETE',
        uri: comment_url
    });
}

module.exports.get_comments = get_comments;
module.exports.add_comment_to_issue = add_comment_to_issue;
module.exports.edit_comment = edit_comment;
module.exports.delete_comment = delete_comment;
