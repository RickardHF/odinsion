import express from 'express';
import havamal from './havamal.js';
import { Octokit } from "@octokit/core";

const router = express.Router();

router.post("/stanza", async (req, res) => {
    const stanza = havamal.filter(stanza => {
        return stanza.id === req.body.number;
    });
    if (stanza) {
        res.send(stanza[0].text);
    }
    else {
        res.send("stanza not found");
    }
});

router.post("/greeting", async (req, res) => {
    const { god, recipient, to_himself, type } = req.body;
    var name = recipient;
    if (to_himself || !recipient) {
        const tokenForUser = req.get("X-GitHub-Token");
        const octokit = new Octokit({ auth: tokenForUser });
        const user = await octokit.request("GET /user");

        name = user.data.name ?? user.data.login;
    }
    res.send(`Create a greeting from ${god} to ${name} that is ${type}`);
});

export { router as skillsets };