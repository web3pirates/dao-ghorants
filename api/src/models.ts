import mongoose, { Document, Schema } from "mongoose";

// Interface for the Competition model
interface ICompetition extends Document {
  name: string;
  wallet: string;
  startDate: Date;
  endDate: Date;
  grant: number;
}

// Interface for the Submission model
interface ISubmission extends Document {
  competitionId: mongoose.Types.ObjectId;
  submitterAddress: string;
  projectLink: string;
}

const competitionSchema: Schema = new Schema({
  name: { type: String, required: true },
  wallet: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  grant: { type: Number, required: true },
});

const submissionSchema: Schema = new Schema({
  competitionId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Competition",
  },
  submitterAddress: { type: String, required: true },
  projectLink: { type: String, required: true },
});

export const Competition = mongoose.model<ICompetition>(
  "Competition",
  competitionSchema
);
export const Submission = mongoose.model<ISubmission>(
  "Submission",
  submissionSchema
);
