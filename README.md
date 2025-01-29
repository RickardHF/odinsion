# Odin extension - Odinsion

__Links__:

Agent Extension: https://github.com/apps/odinsion

Skillset Extension: https://github.com/apps/odins-skills

## Introduction

This is the Odin extension. This repository contains the backend for both the agent-extension and the skillset-extension. 

The API handles the requests of users interacting with the extension in the GitHub chat widget. The API is responsible for handling the requests, validating the requests, and sending the responses back to the user.

The API is built using Node.js and Express.js. We use the GitHub API to interact with the GitHub platform. We use the GitHub App to authenticate the requests and to make requests to the GitHub API on behalf of the user.

## Table of contents
- [Local development](#local-development)
    - [Requirements](#requirements)
    - [Set up the environment](#set-up-the-environment)
- [Solution](#solution)
    - [API](#api)
    - [Request validation](#request-validation)
    - [User token](#user-token)
    - [Agent](#agent)
    - [Skillsets](#skillsets)
- [GitHub App](#github-app)
    - [Agent Extension](#agent-extension)
    - [Skillset Extension](#skillset-extension)

# Local development

## Requirements

To be able to work and test the Odin extension locally you need to have the following installed/set up:

- The server running on your local machine
- Ngrok, or something similar, to expose your local server to the internet
- A GitHub App with the correct permissions and the Copilot Extension set to forward the messages to the correct endpoint
- A GitHub user with a copilot seat assigned to it
- Permissions to use Copilot Extensions
- The GitHub app (extension) installed.

## Set up the environment

__Install dependencies__:

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

__Exposing local server__

When communicating with the GitHub chat widget to our locally running code we need to expose our local server to the internet. We can use ngrok for this, which will give us a public URL that we can use to communicate with the GitHub chat widget. Other solutions can be used as well, althogh we will not cover them here.

To install ngrok [visit the official website](https://dashboard.ngrok.com/get-started/setup/windows<>)

__Start ngrok__:

```bash
# use the correct port
ngrok http http://localhost:3000
```

if you have a static domain with ngrok you can use it like this:

```bash
ngrok http --domain=YOUR-STATIC-DOMAIN.ngrok-free.app 3000
```

# Solution

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

# GitHub App

The GitHub App is basically the extension. This is where end users can install the extension and use it in their GitHub chat widget.

When using the extension in the chat widget, the extension would be called with starting the message with @the-extension-name. Any spaces in the name of the app would be replaced with dashes.

## Permissions

The GitHub App should have at least the following permissions under account permissions:

- Read access to the copilot chat
- Read access to the copilot editor context

Additional permissions might be needed depending on the use case. If the extension is to perform actions on behalf of the user, like creating issues, or making comments, then the permissions for these actions should be added.

## Agent Extension

The __agent__ is, as mentioned, the most free form of extension where we have the most controll of how we want to handle the messages, context and answers. 

To make the GitHub App an agent extension you go to the settings of the GitHub App and select __Copilot__ from the menu.

Under __App Type__ you select __Agent__. Mandatory fields to fill out here are:

__URL__

This should be the URL to the endpoint that recieves and handles the requests (need to support POST requests).

__Inference description__

This should infer the capabilities of your app. In the chat this will show as the placeholder value before you've started to write a promt to the extension.

## Skillset Extension

The __skillset__ is a more specialized extension where we can define different skills that the extension can handle. GitHub will detect user intent and use the correct skill to handle the request. We can define up to 5 skills for a skillset extension. 

GitHub will also extract the parameters from the user and send them to the API as the body of the request, the original messages will not be sent, neither will we be provided the editor context.

A skillset extension is set up in the same way as an agent extension, but as the __App Type__ you select __Skillset__. Then you can specify the different skills that the extension can handle.

To see more of how the skillsets are defined, see the [Skillsets.md](Skillsets.md) file.


## Pre-authorization URL

For both agent and skillset extensions you can provide a pre-authorization URL. This is a URL that GitHub will call when the user installs and authorizes the extension. This can be used to set up an authorization flow where the user is forced to ie. log in to an external identity provider, agree to terms and conditions, or to set up some initial configuration for the extension.
