import express, { Response } from 'express';
import { validationResult } from 'express-validator';
import { UserProfile } from '../models/UserProfile.js';
import { authenticateToken, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { 
  validateCreateProfile, 
  validateUpdateProfile, 
  validateMongoId,
  validateSearch 
} from '../middleware/validation.js';
import { ApiResponse, PaginatedResponse, SearchFilters } from '../types.js';

const router = express.Router();

// Get user profile by UID
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profile = await UserProfile.findOne({ uid: req.user!.uid });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: profile
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Create user profile
router.post('/', authenticateToken, validateCreateProfile, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      } as ApiResponse);
    }

    // Ensure the profile belongs to the authenticated user
    const profileData = {
      ...req.body,
      uid: req.user!.uid,
      email: req.user!.email
    };

    const existingProfile = await UserProfile.findOne({ uid: req.user!.uid });
    if (existingProfile) {
      return res.status(409).json({
        success: false,
        error: 'Profile already exists for this user'
      } as ApiResponse);
    }

    const profile = new UserProfile(profileData);
    await profile.save();

    return res.status(201).json({
      success: true,
      data: profile,
      message: 'Profile created successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error creating profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Update user profile
router.put('/:id', authenticateToken, validateUpdateProfile, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      } as ApiResponse);
    }

    const profile = await UserProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      } as ApiResponse);
    }

    // Ensure the profile belongs to the authenticated user
    if (profile.uid !== req.user!.uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this profile'
      } as ApiResponse);
    }

    const updatedProfile = await UserProfile.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    return res.json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Get all profiles (public endpoint with optional auth for personalization)
router.get('/', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const profiles = await UserProfile.find({})
      .select('-contactInfo.email -contactInfo.phone') // Hide private contact info
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await UserProfile.countDocuments({});
    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      data: profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    } as PaginatedResponse);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Search profiles
router.get('/search', optionalAuth, validateSearch, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        data: errors.array()
      } as ApiResponse);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    // Build search filters
    const filters: SearchFilters = {
      skills: [],
      availability: [],
      university: req.query.university as string,
      year: req.query.year as string,
      searchTerm: req.query.searchTerm as string
    };

    // Handle skills parameter (can be string or array)
    if (req.query.skills) {
      filters.skills = Array.isArray(req.query.skills) 
        ? req.query.skills as string[]
        : [req.query.skills as string];
    }

    // Handle availability parameter (can be string or array)
    if (req.query.availability) {
      filters.availability = Array.isArray(req.query.availability)
        ? req.query.availability as string[]
        : [req.query.availability as string];
    }

    // Build MongoDB query
    const query: any = {};

    if (filters.skills.length > 0) {
      query.skills = { $in: filters.skills };
    }

    if (filters.availability.length > 0) {
      query.availability = { $in: filters.availability };
    }

    if (filters.university) {
      query.university = new RegExp(filters.university, 'i');
    }

    if (filters.year) {
      query.year = filters.year;
    }

    if (filters.searchTerm) {
      query.$text = { $search: filters.searchTerm };
    }

    const profiles = await UserProfile.find(query)
      .select('-contactInfo.email -contactInfo.phone') // Hide private contact info
      .skip(skip)
      .limit(limit)
      .sort(filters.searchTerm ? { score: { $meta: 'textScore' } } : { createdAt: -1 });

    const total = await UserProfile.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return res.json({
      success: true,
      data: profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    } as PaginatedResponse);
  } catch (error) {
    console.error('Error searching profiles:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Delete user profile
router.delete('/:id', authenticateToken, validateMongoId, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid profile ID'
      } as ApiResponse);
    }

    const profile = await UserProfile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      } as ApiResponse);
    }

    // Ensure the profile belongs to the authenticated user
    if (profile.uid !== req.user!.uid) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this profile'
      } as ApiResponse);
    }

    await UserProfile.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: 'Profile deleted successfully'
    } as ApiResponse);
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Get profile by ID (public endpoint)
router.get('/:id', validateMongoId, async (req: express.Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid profile ID'
      } as ApiResponse);
    }

    const profile = await UserProfile.findById(req.params.id)
      .select('-contactInfo.email -contactInfo.phone'); // Hide private contact info

    if (!profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found'
      } as ApiResponse);
    }

    return res.json({
      success: true,
      data: profile
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

export default router;
