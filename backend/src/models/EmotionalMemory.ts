import mongoose, { Document, Schema } from 'mongoose';

export interface IEmotionalMemory extends Document {
  userId: mongoose.Types.ObjectId;
  favoriteSongs: { title: string; artist: string; url?: string }[];
  favoriteMovies: { title: string; genre: string }[];
  detectedTriggers: string[];
  wellnessGoals: string[];
  weeklySummaries: { weekOf: Date; summary: string }[];
  monthlyReports: { month: string; report: string }[];
  aiConversations: {
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const emotionalMemorySchema = new Schema<IEmotionalMemory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One memory profile per user
      index: true,
    },
    favoriteSongs: [
      {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        url: { type: String },
      },
    ],
    favoriteMovies: [
      {
        title: { type: String, required: true },
        genre: { type: String, required: true },
      },
    ],
    detectedTriggers: {
      type: [String],
      default: [],
    },
    wellnessGoals: {
      type: [String],
      default: [],
    },
    weeklySummaries: [
      {
        weekOf: { type: Date, required: true },
        summary: { type: String, required: true },
      },
    ],
    monthlyReports: [
      {
        month: { type: String, required: true },
        report: { type: String, required: true },
      },
    ],
    aiConversations: [
      {
        role: { type: String, enum: ['user', 'ai'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEmotionalMemory>('EmotionalMemory', emotionalMemorySchema);
