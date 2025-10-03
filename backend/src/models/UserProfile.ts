import mongoose, { Schema, Document } from 'mongoose';

// Define the document shape explicitly to avoid TypeScript inference issues
export interface UserProfileDocument extends Document {
  _id: mongoose.Types.ObjectId;
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  bio?: string;
  skills: string[];
  interests?: string[];
  availability: string[];
  university?: string;
  year?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    social?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      whatsapp?: string;
    };
    socialLinks?: Array<{
      id: string;
      platform: string;
      url: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema({
  id: { type: String, required: true },
  platform: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true }
}, { _id: false });

const contactInfoSchema = new Schema({
  email: { type: String },
  phone: { type: String },
  social: {
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    whatsapp: { type: String }
  },
  socialLinks: [socialLinkSchema]
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
  photoURL: { 
    type: String,
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
  interests: [{ 
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
      delete (ret as any)._id;
      delete (ret as any).__v;
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
