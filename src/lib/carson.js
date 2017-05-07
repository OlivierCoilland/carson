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

    github.get_comments(issue.comments_url)
    .then((comments) => {
        const poll = get_poll_comment(comments);

        if (poll) {
            update_poll(issue, payload, vote, poll);
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

function update_poll(issue, payload, vote, poll) {
    const sender_login = payload.sender.login;
    const poll_body = poll.body;

    const new_poll_body = compute_new_poll_body(poll_body, sender_login, vote);
    github.edit_comment(poll.url, new_poll_body);
    github.delete_comment(payload.comment.url);
    console.log(sender_login + " voted " + vote);

    const poll_score = compute_poll_score(new_poll_body);
    if (poll_score >= config.score_to_close) {
        const close_comment_body = "This issue has been closed by show of hands.";
        github.add_comment_to_issue(issue.comments_url, close_comment_body);
        github.close_issue(issue.url);
    }
}

function compute_new_poll_body(poll_body, sender_login, vote) {
    const sender_vote = '@' + sender_login + ': ' + vote;
    if ((new RegExp('@' + sender_login + ':')).test(poll_body)) {
        return poll_body.replace(new RegExp('@' + sender_login + ':.*'), sender_vote);
    } else {
        return poll_body.replace(/#closepoll/, '#closepoll' + ln + sender_vote);
    }
}

function compute_poll_score(poll_body) {
    const re = /@.*([+-]1)/g;
    let score = 0;
    let matches;
    while ((matches = re.exec(poll_body)) !== null) {
        score += 1*matches[1];
    }
    return score;
}

module.exports.handle_new_issue = handle_new_issue;
module.exports.handle_new_comment = handle_new_comment;
