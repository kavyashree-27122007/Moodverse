import mongoose, { Document, Schema } from 'mongoose';

export interface IMoodEntry extends Document {
  userId: mongoose.Types.ObjectId;
  emotion: string;
  intensity: number; // 1-10
  note?: string;
  language?: string;
  createdAt: Date;
}

const moodSchema = new Schema<IMoodEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    emotion: {
      type: String,
      required: true,
      trim: true,
    },
    intensity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 5,
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    language: {
      type: String,
      default: 'English',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for O(1) history retrieval by user sorted by time
moodSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IMoodEntry>('MoodEntry', moodSchema);
