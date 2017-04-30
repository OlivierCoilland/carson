'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('util');
const github = require('./lib/github');

app.use(bodyParser.json());

app.post('/', function (req, res) {
    const github_event = req.header('x-github-event');
    const payload = req.body;

    if (github_event == 'issues') {
        handle_issues_event(payload);
    } else if (github_event == 'issue_comment') {
        handle_issue_comment_event(payload);
    } else {
        console.log(util.format('[%s] not supported', github_event));
    }

    res.sendStatus(200);
})

function handle_issues_event(payload) {
    const action = payload.action;
    const issue = payload.issue;
    const comments_url = issue.comments_url;

    if (action == 'opened') {
        github.add_new_issue_comment(comments_url);
    } else {
        console.log(util.format('[issues] [%s] not supported', action));
    }
}

function handle_issue_comment_event(payload) {

}

app.listen(3000, function () {
    console.log('App listening on port 3000!');
})
