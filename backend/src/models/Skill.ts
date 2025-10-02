import mongoose, { Schema, Document } from 'mongoose';
import { Skill as ISkill } from '../types.js';

export interface SkillDocument extends Omit<ISkill, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const skillSchema = new Schema<SkillDocument>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  category: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  level: { 
    type: String, 
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  description: { 
    type: String,
    maxlength: 200,
    trim: true
  }
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
skillSchema.index({ category: 1 });
skillSchema.index({ level: 1 });
skillSchema.index({ name: 'text', description: 'text' });

export const Skill = mongoose.model<SkillDocument>('Skill', skillSchema);
