import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  profilePicture?: string;
  gender?: string;
  dateOfBirth?: Date;
  country?: string;
  languagePreference?: string;
  points: number;
  currentStreak: number;
  achievements: string[];
  aiPersonality: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-Binary', 'Prefer not to say', 'Other'],
      default: 'Prefer not to say',
    },
    dateOfBirth: {
      type: Date,
    },
    country: {
      type: String,
      default: '',
    },
    languagePreference: {
      type: String,
      default: 'English',
    },
    points: {
      type: Number,
      default: 0,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    achievements: {
      type: [String],
      default: [],
    },
    aiPersonality: {
      type: String,
      enum: ['Empathetic', 'Analytical', 'Cheerleader', 'Stoic'],
      default: 'Empathetic',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', userSchema);
