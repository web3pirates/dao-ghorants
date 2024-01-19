import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { Competition, Submission } from "./models";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(bodyParser.json());

const mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_OPTIONS}`;

console.log("Connecting to MongoDB...");
mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = 3000;
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
  const competition = await Competition.findById(req.params.id);
  res.send(competition);
});

// Endpoint to retrieve all submissions for a competition
app.get("/competitions/:id/submissions", async (req, res) => {
  const submissions = await Submission.find({ competitionId: req.params.id });
  res.send(submissions);
});