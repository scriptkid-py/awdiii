import mongoose, { Schema, Document } from 'mongoose';
import { SkillCategory as ISkillCategory } from '../types.js';

export interface SkillCategoryDocument extends Omit<ISkillCategory, 'id'>, Document {
  _id: mongoose.Types.ObjectId;
}

const skillCategorySchema = new Schema<SkillCategoryDocument>({
  name: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
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
      delete (ret as any)._id;
      delete (ret as any).__v;
      return ret;
    }
  }
});

// Index for text search
skillCategorySchema.index({ name: 'text', description: 'text' });

export const SkillCategory = mongoose.model<SkillCategoryDocument>('SkillCategory', skillCategorySchema);
