import express, { Response } from 'express';
import { validationResult } from 'express-validator';
import { Skill } from '../models/Skill.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreateSkill, validateMongoId } from '../middleware/validation.js';
import { ApiResponse, PaginatedResponse } from '../types.js';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const skip = (page - 1) * limit;
    const category = req.query.category as string;
    const level = req.query.level as string;
    const search = req.query.search as string;

    // Build query
    const query: any = {};
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    if (level) {
      query.level = level;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const skills = await Skill.find(query)
      .skip(skip)
      .limit(limit)
      .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 });

    const total = await Skill.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: skills,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    } as PaginatedResponse);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Create skill (authenticated endpoint)
router.post('/', authenticateToken, validateCreateSkill, async (req: express.Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      } as ApiResponse);
    }

    const existingSkill = await Skill.findOne({ name: req.body.name });
    if (existingSkill) {
      return res.status(409).json({
        success: false,
        error: 'Skill already exists'
      } as ApiResponse);
    }

    const skill = new Skill(req.body);
    await skill.save();

    return res.status(201).json({
      success: true,
      data: skill,
      message: 'Skill created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating skill:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Get skill by ID
router.get('/:id', validateMongoId, async (req: express.Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid skill ID'
      } as ApiResponse);
    }

    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: skill
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching skill:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;
