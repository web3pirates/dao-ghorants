import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import { Competition, Judgement, Submission } from "./models";
import { fetchUserRepos } from "./utils/github";

const { ObjectId } = require("mongodb"); // Import ObjectId from MongoDB

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_OPTIONS}`;

console.log("Connecting to MongoDB...");
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Endpoint to create a competition
app.post("/competitions", async (req, res) => {
  const competition = new Competition(req.body);
  await competition.save();
  res.status(201).send(competition);
});

// Endpoint to submit to a competition
app.post("/submissions", async (req, res) => {
  const submission = new Submission(req.body);
  await submission.save();
  res.status(201).send(submission);
});

// Endpoint to retrieve all competitions
app.get("/competitions", async (req, res) => {
  const competitions = await Competition.find({});
  res.send(competitions);
});

// Endpoint to retrieve a competition by ID
app.get("/competitions/:id", async (req, res) => {
  try {
    const competition = await Competition.findOne({ _id: req.params.id });

    if (!competition) {
      return res.status(404).send({ error: "Competition not found" });
    }

    res.send(competition);
  } catch (error) {
    console.error("Error fetching competition:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

// Endpoint to retrieve all submissions for a competition
app.get("/competitions/:id/submissions", async (req, res) => {
  try {
    const submissions = await Submission.find({
      proposalId: req.params.id,
    });

    res.send(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

app.get("/logingithub/:code", async (req, res) => {
  const code = req.params.code;
  const data = new FormData();
  data.append("client_id", process.env.GITHUB_CLIENT_ID);
  data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
  data.append("code", code);
  data.append("redirect_uri", "http://localhost:3000/login");

  // Request to exchange code for an access token
  fetch(`https://github.com/login/oauth/access_token`, {
    method: "POST",
    body: data,
  })
    .then((response) => response.text())
    .then((paramsString) => {
      let params = new URLSearchParams(paramsString);
      const access_token = params.get("access_token");

      // Request to return data of a user that has been authenticated
      return fetch(`https://api.github.com/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      });
    })
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((error) => {
      console.log({ error });
      return res.status(400).json(error);
    });
});

// Endpoint to retrieve a submission by ID
app.get("/submissions/:id", async (req, res) => {
  const submission = await Submission.find({ id: req.params.id });
  res.send(submission);
});

app.get("/repoinfo/:owner/:repo", async (req, res) => {
  // const { owner, repo } = req.params;
  // const decodedRepoUrl = decodeURIComponent(repo);
  // const repoInfo = await fetchRepoInfo(owner, decodedRepoUrl);

  // res.send(repoInfo);
  res.send({ owner: "test", repo: "test" });
});

app.get("/userrepos/:userId", async (req, res) => {
  const { userId } = req.params;
  const repoList = await fetchUserRepos(userId);
  res.send(repoList);
});

// Endpoint to submit to a competition
app.post("/judgements", async (req, res) => {
  if (!req.body.submissionId) {
    res.status(400).send("Submission ID is required");
  }
  const findJudgement = await Judgement.findOne({
    submissionId: req.body.submissionId,
  });

  if (findJudgement) {
    findJudgement.chatGptJudgement = req.body.chatGptJudgement;
    findJudgement.chatGptScore = req.body.chatGptScore;
    findJudgement.creativity = req.body.creativity;
    findJudgement.useOfBlockchain = req.body.useOfBlockchain;
    findJudgement.impact = req.body.impact;
    findJudgement.collaboration = req.body.collaboration;
    findJudgement.reliability = req.body.reliability;
    findJudgement.judgeAddress = req.body.judgeAddress;
    findJudgement.save();
    res.status(200).send(findJudgement);
  } else {
    const judgement = new Judgement(req.body);
    await judgement.save();
    res.status(201).send(judgement);
  }
});

// Endpoint to retrieve the judgement for a submission
app.get("/judgements/:id", async (req, res) => {
  const judgement = await Judgement.find({ submissionId: req.params.id });
  res.send(judgement[0]);
});
