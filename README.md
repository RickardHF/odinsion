# Odin extension - Odinsion

## Table of contents
- [Local development](#local-development)
- [API](#api)
- [Request validation](#request-validation)
- [User token](#user-token)
- [Agent](#agent)
- [Skillsets](#skillsets)

## Local development

Install dependencies:

```bash
npm install
```

To run:

```bash
npm start
```

or in watch mode:

```bash
npm run dev
```

To run ngrok

To install ngrok [visit the official website](https://dashboard.ngrok.com/get-started/setup/windows<>)

```bash
# use the correct port
ngrok http http://localhost:3000
```

if you have a static domain with ngrok you can use it like this:

```bash
ngrok http --domain=YOUR-STATIC-DOMAIN.ngrok-free.app 3000
```
## API

This extension is an API, which handles traffic from the user to the copilot extension. We have configured muplitple endpoints, which are used both for an agent and a skillset.

## User token

In all requests we are provided the token for the user, which has the scope that the GitHub App requires. This allows us to make requests to the GitHub API on behalf of the user.

## Request validation

We validate the request by checking the signatures of the request. This is way we can verify that the request is coming from GitHub and that it has not been tampered with.

## Agent 

The agent is using the main entry point by sending the user messages to the "/" endpoint using a POST request.

We get the entire message here, as the copilot chat widget sends the entire message to the API. 

This allows for great flexibility in the agent, as we can decide what to do with the message. We can send it to different LLMs, add additional context or messages, or perform different actions based on the access of the token.

For an agent we can only define a single endpoint, which is to handle all requests for the extension. All logic needs to be handled from this.

## Skillsets

Skillsets differ from agents in a number of ways. They are more specialized, and can be used to handle different types of intents.

In GitHub we can set up different skills, up to 5 per extension. Each skill can have its own endpoint, which can be used to handle different types of intents.

We describe the skills in the GitHub app by providing a name and description of each skill using natural language. GitHub then uses this information to determine which skill to use for a given message from the user. When defining a skill we can also define what parameters we expect from the user. GitHub will then extract these for us and send them to the API as the body of the request.

We do not get the full context, like in the agent, but we get the extracted parameters from the user.

We can then use these parameters to perform different actions, like sending a message to the user, or making a request to the GitHub API.

How the skillsets have been defined can be seen in the [Skillsets.md](Skillsets.md) file.
