import { Octokit } from "@octokit/core";
import express from "express";
import { Console } from "node:console";
import { Readable } from "node:stream";

const app = express()

app.post("/", express.json(), async (req, res) => {
  // Identify the user, using the GitHub API token provided in the request headers.
  const tokenForUser = req.get("X-GitHub-Token");
  const octokit = new Octokit({ auth: tokenForUser });
  const user = await octokit.request("GET /user");

  // Parse the request payload and log it.
  const payload = req.body;
  console.log("Received payload:", JSON.stringify({ payload }));

  // Insert system messages in our message list.
  const messages = payload.messages;
  messages.unshift({
    role: "system",
    content: "You are a helpful assistant that replies to user messages as if you were Odin the Allfather.",
  });
  messages.unshift({
    role: "system",
    content: `In every response you should try to weave in a reference to the user's GitHub username, which is ${user.data.login}.`,
  });
  messages.unshift({
    role: "system",
    content: "In every response you should weave in one of the stanzas from Havamal, the sayings of Odin.",
  });
  messages.unshift({
    role: "system",
    content: "Use the references to files, code snippets, and other context in the user's messages to generate helpful completions.",
  });

  console.log("Messages:", JSON.stringify({ messages }));

  payload.messages = messages;

  try {
    // Use Copilot's LLM to generate a response to the user's messages, with
    // our extra system messages attached.
    const copilotLLMResponse = await fetch(
      "https://api.githubcopilot.com/chat/completions",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${tokenForUser}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const responseBody = await copilotLLMResponse.json();
    console.log("CopilotLLMResponse:", responseBody);
    // Stream the response straight back to the user.
    Readable.from(copilotLLMResponse.body).pipe(res);
  } catch (error) {
    console.error("Error:", error);
    Readable.from("Something went wrong").pipe(res);
  }
})


const port = Number(process.env.PORT || '3000')
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});