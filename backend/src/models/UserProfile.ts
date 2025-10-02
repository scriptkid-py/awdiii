import mongoose, { Schema, Document } from 'mongoose';
import { UserProfile as IUserProfile } from '../types.js';

export interface UserProfileDocument extends Omit<IUserProfile, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const contactInfoSchema = new Schema({
  email: { type: String },
  phone: { type: String },
  social: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String }
  }
}, { _id: false });

const userProfileSchema = new Schema<UserProfileDocument>({
  uid: { 
    type: String, 
    required: true, 
    unique: true,
    index: true 
  },
  displayName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  bio: { 
    type: String,
    maxlength: 500,
    trim: true
  },
  skills: [{ 
    type: String,
    trim: true
  }],
  availability: [{ 
    type: String,
    trim: true
  }],
  university: { 
    type: String,
    trim: true,
    maxlength: 100
  },
  year: { 
    type: String,
    trim: true
  },
  contactInfo: contactInfoSchema
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
userProfileSchema.index({ skills: 1 });
userProfileSchema.index({ availability: 1 });
userProfileSchema.index({ university: 1 });
userProfileSchema.index({ year: 1 });
userProfileSchema.index({ displayName: 'text', bio: 'text' });

export const UserProfile = mongoose.model<UserProfileDocument>('UserProfile', userProfileSchema);
