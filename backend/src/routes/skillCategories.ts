import express, { Response } from 'express';
import { validationResult } from 'express-validator';
import { SkillCategory } from '../models/SkillCategory.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreateSkillCategory, validateMongoId } from '../middleware/validation.js';
import { ApiResponse, PaginatedResponse } from '../types.js';

const router = express.Router();

// Get all skill categories
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;
    const search = req.query.search as string;

    // Build query
    const query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }

    const categories = await SkillCategory.find(query)
      .skip(skip)
      .limit(limit)
      .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 });

    const total = await SkillCategory.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    } as PaginatedResponse);
  } catch (error) {
    console.error('Error fetching skill categories:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Create skill category (authenticated endpoint)
router.post('/', authenticateToken, validateCreateSkillCategory, async (req: express.Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      } as ApiResponse);
    }

    const existingCategory = await SkillCategory.findOne({ name: req.body.name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        error: 'Skill category already exists'
      } as ApiResponse);
    }

    const category = new SkillCategory(req.body);
    await category.save();

    return res.status(201).json({
      success: true,
      data: category,
      message: 'Skill category created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating skill category:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Get skill category by ID
router.get('/:id', validateMongoId, async (req: express.Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category ID'
      } as ApiResponse);
    }

    const category = await SkillCategory.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Skill category not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: category
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching skill category:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;
