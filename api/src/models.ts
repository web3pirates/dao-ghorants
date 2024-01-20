import mongoose, { Document, Schema } from "mongoose";

// Interface for the Competition model
interface ICompetition extends Document {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  prize: number;
  admin: string;
}

// Interface for the Submission model
interface ISubmission extends Document {
  id: string;
  title: string;
  address: string;
  githubUrl: string;
  proposalId: mongoose.Types.ObjectId;
}

const competitionSchema: Schema = new Schema({
  id: { type: Number, require: true },
  imageUrl: { type: String, require: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  prize: { type: Number, required: true },
  admin: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const submissionSchema: Schema = new Schema({
  proposalId: {
    type: Number,
    required: true,
  },
  id: { type: String, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  githubUrl: { type: String, required: true },
});

export const Competition = mongoose.model<ICompetition>(
  "Competition",
  competitionSchema
);
export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
