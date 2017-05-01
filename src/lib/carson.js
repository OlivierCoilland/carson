'use strict';

const util = require('util');
const github = require('./github');

function handle_new_issue(payload) {
    const issue = payload.issue;
    const comments_url = issue.comments_url;

    github.add_comment_to_issue(comments_url, "Hi, I'm Carson, have fun!")
    .then(function (body) {
        console.log("Added welcome message");
    })
    .catch(function (err) {
        console.error(err);
    });
}

function handle_new_comment(payload) {
    const action = payload.action;
    const comment_body = payload.comment.body;

    if (/#close/.test(comment_body)) {
        handle_ask_for_closing(payload);
    } else {
        console.log(util.format('[issue_comment] [%s] triggered but nothing to do :(', action));
    }
}

function handle_ask_for_closing(payload) {
    const issue = payload.issue;
    const comments_url = issue.comments_url;
    const sender_login = payload.sender.login;
    const text = util.format(
        "@%s asked to close this issue.\n"
        + "Comment **#+1** if you agree, **#-1** if you don't"
    , sender_login);

    github.add_comment_to_issue(comments_url, text)
    .then(() => {
        console.log("Added ask for closing message");
    })
    .catch((err) => {
        console.error(err);
    });
}

module.exports.handle_new_issue = handle_new_issue;
module.exports.handle_new_comment = handle_new_comment;
