import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  name: string;
  description: string;
  pointsAwarded: number;
  icon: string;
}

const achievementSchema = new Schema<IAchievement>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  pointsAwarded: { type: Number, required: true },
  icon: { type: String, default: 'trophy' }
});

export default mongoose.model<IAchievement>('Achievement', achievementSchema);
