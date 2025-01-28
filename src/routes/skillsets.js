import express from 'express';
import havamal from './havamal.js';
import { Octokit } from "@octokit/core";
import { verifySignature } from "../lib/helper.js";

const router = express.Router();

router.post("/stanza", async (req, res) => {
    try {
        const is_verified = await verifySignature(req);

        if (!is_verified) throw new Error("Invalid signature");

        const stanza = havamal.filter(stanza => {
            return stanza.id === req.body.number;
        });
        if (stanza) {
            res.send(stanza[0].text);
        }
        else {
            res.send("stanza not found");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

router.post("/greeting", async (req, res) => {
    try {
        const is_verified = await verifySignature(req);

        if (!is_verified) throw new Error("Invalid signature");

        const { god, recipient, to_himself, type } = req.body;
        var name = recipient;
        if (to_himself || !recipient) {
            const tokenForUser = req.get("X-GitHub-Token");
            const octokit = new Octokit({ auth: tokenForUser });
            const user = await octokit.request("GET /user");

            name = user.data.name ?? user.data.login;
        }
        res.send(`Create a greeting from ${god} to ${name} that is ${type}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

export { router as skillsets };