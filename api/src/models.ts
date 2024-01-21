import mongoose, { Document, Schema } from 'mongoose';

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
  typeOfGrant: string;
}

// Interface for the Submission model
interface ISubmission extends Document {
  id: string;
  title: string;
  description: string;
  address: string;
  githubUrl: string;
  proposalId: mongoose.Types.ObjectId;
  chatGptScore: number;
}

interface IJudgement extends Document {
  id: string;
  submissionId: string;
  judgeAddress: string;
  title: string;
  creativity: string;
  useOfBlockchain: string;
  impact: string;
  collaboration: string;
  plagiarized: string;
  reliability: string;
  chatGptJudgement: string;
  chatGptScore: number;
}

const competitionSchema: Schema = new Schema(
  {
    id: { type: String, require: true },
    imageUrl: { type: String, require: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    prize: { type: Number, required: true },
    admin: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    typeOfGrant: { type: String, required: true, default: 'project' },
  },
  { timestamps: true },
);

const submissionSchema: Schema = new Schema(
  {
    proposalId: {
      type: String,
      required: true,
    },
    id: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    githubUrl: { type: String, required: true },
    chatGptScore: { type: Number },
  },
  { timestamps: true },
);

const judgementSchema: Schema = new Schema(
  {
    proposalId: {
      type: String,
      required: true,
    },
    id: { type: String },
    submissionId: { type: String },
    judgeAddress: { type: String },
    title: { type: String },
    creativity: { type: String },
    useOfBlockchain: { type: String },
    impact: { type: String },
    collaboration: { type: String },
    reliability: { type: String },
    plagiarized: { type: String },
    chatGptJudgement: { type: String },
    chatGptScore: { type: Number },
  },
  { timestamps: true },
);

export const Competition = mongoose.model<ICompetition>('Competition', competitionSchema);
export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
export const Judgement = mongoose.model<IJudgement>('Judgement', judgementSchema);
