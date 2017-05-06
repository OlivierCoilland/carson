'use strict';

const util = require('util');
const config = require('../config');
const github = require('./github');

const ln = '\r\n';

function handle_new_issue(payload) {
    const issue = payload.issue;
    const comments_url = issue.comments_url;

    github.add_comment_to_issue(comments_url, "Hi, I'm Carson, have fun!")
    .then(() => {
        console.log("Added welcome message");
    })
    .catch((err) => {
        console.error(err);
    });
}

function handle_new_comment(payload) {
    const action = payload.action;
    const comment_body = payload.comment.body;

    if (/#close/.test(comment_body)) {
        handle_ask_for_closing(payload);
    } else if (/#\+1/.test(comment_body)) {
        handle_vote(payload, '+1');
    } else if (/#-1/.test(comment_body)) {
        handle_vote(payload, '-1');
    } else {
        console.log(util.format('[issue_comment] [%s] triggered but nothing to do :(', action));
    }
}

function handle_ask_for_closing(payload) {
    const issue = payload.issue;
    const comments_url = issue.comments_url;
    const sender_login = payload.sender.login;
    const text = util.format(
        "@%s asked to close this issue." + ln
        + "`#+1` if you agree" + ln
        + "`#-1` if you don't" + ln
        + ln
        + "#closepoll"
    , sender_login);

    github.add_comment_to_issue(comments_url, text)
    .then(() => {
        console.log("Added ask for closing message");
    })
    .catch((err) => {
        console.error(err);
    });
}

function handle_vote(payload, vote) {
    const issue = payload.issue;
    const comments_url = issue.comments_url;
    const comment_url = payload.comment.url;

    github.get_comments(comments_url)
    .then((comments) => {
        const poll = get_poll_comment(comments);

        if (poll) {
            const poll_body = poll.body;
            const sender_login = payload.sender.login;
            const matches = poll_body.match(/([^]*#closepoll)([^]*)/);
            const new_poll_body = matches[1] + ln + "@" + sender_login + ": " + vote + matches[2];
            github.edit_comment(poll.url, new_poll_body);
            console.log("Voting " + vote);
        } else {
            console.log("Nothing to vote for!");
        }
    });
}

function get_poll_comment(comments) {
    return comments.find((comment) => {
        return comment.user.id == config.id
            && /#closepoll/.test(comment.body);
    });
}

module.exports.handle_new_issue = handle_new_issue;
module.exports.handle_new_comment = handle_new_comment;
