# Carson

Carson allows your contributors to auto-moderate your repository. For example they can ask Carson to close an issue, saving you the hassle of tracking inactive and obsolete issues. Carson will ask others to confirm the request and then do it.

## Getting started

- Deploy Carson as a web server accessible from the internet.
- Add a webhook to your repository. Content type should be `application/json` and only `Issues` and `Issue comment` events should trigger it.

## Authentication

Carson needs to be authenticated and have push access to your repository. You can either use your own account or (maybe better) create a new one and add it as a collaborator.

In both case you have to update `config.json` with the account credentials. Update the [carson_token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) (`public_repo` scope needed) and the [carson_id](https://api.github.com/users/[name]).

## Features

Contributors can:

- ask for an issue to be closed

## Closing an issue

Add a comment with `#close` keyword.
