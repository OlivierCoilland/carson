'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('util');
const config = require('./config');
const carson = require('./lib/carson');

app.use(bodyParser.json());

app.post('/', (req, res) => {
    const github_event = req.header('x-github-event');
    const payload = req.body;
    const sender_id = payload.sender.id;

    if (sender_id == config.id) {
        console.log(util.format('[%s] ignored (sent by webhook)', github_event));
    } else {
        if (github_event == 'issues') {
            handle_issues_event(payload);
        } else if (github_event == 'issue_comment') {
            handle_issue_comment_event(payload);
        } else {
            console.log(util.format('[%s] not supported', github_event));
        }
    }

    res.sendStatus(200);
})

function handle_issues_event(payload) {
    const action = payload.action;

    if (action == 'opened') {
        carson.handle_new_issue(payload);
    } else {
        console.log(util.format('[issues] [%s] not supported', action));
    }
}

function handle_issue_comment_event(payload) {
    const action = payload.action;

    if (action == 'created') {
        carson.handle_new_comment(payload);
    } else {
        console.log(util.format('[issue_comment] [%s] not supported', action));
    }
}

app.listen(3000, () => {
    console.log('App listening on port 3000!');
})
