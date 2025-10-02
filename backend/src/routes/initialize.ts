import express from 'express';
import { Skill } from '../models/Skill.js';
import { SkillCategory } from '../models/SkillCategory.js';
import { ApiResponse } from '../types.js';

const router = express.Router();

// Initialize default data (skills and categories)
router.post('/default-data', async (req, res) => {
  try {
    // Define all default skills
    const defaultSkills = [
      { name: 'JavaScript', category: 'Programming', level: 'intermediate' as const, description: 'Web development with JavaScript' },
      { name: 'React', category: 'Programming', level: 'intermediate' as const, description: 'React library for building user interfaces' },
      { name: 'Python', category: 'Programming', level: 'intermediate' as const, description: 'Python programming language' },
      { name: 'Machine Learning', category: 'Data Science', level: 'advanced' as const, description: 'Machine learning algorithms and techniques' },
      { name: 'Design', category: 'Creative', level: 'intermediate' as const, description: 'UI/UX design principles' },
      { name: 'Photography', category: 'Creative', level: 'beginner' as const, description: 'Digital photography techniques' },
      { name: 'Public Speaking', category: 'Communication', level: 'intermediate' as const, description: 'Effective public speaking skills' },
      { name: 'Writing', category: 'Communication', level: 'intermediate' as const, description: 'Technical and creative writing' },
      { name: 'Mathematics', category: 'Academic', level: 'advanced' as const, description: 'Advanced mathematics and statistics' },
      { name: 'Languages', category: 'Communication', level: 'intermediate' as const, description: 'Foreign language proficiency' },
      { name: 'Coding', category: 'Programming', level: 'intermediate' as const, description: 'General programming and software development' },
      { name: 'Video Editing', category: 'Creative', level: 'intermediate' as const, description: 'Video editing and post-production' },
      { name: 'Data Analysis', category: 'Data Science', level: 'intermediate' as const, description: 'Data analysis and visualization' },
      { name: 'UI/UX', category: 'Creative', level: 'intermediate' as const, description: 'User interface and user experience design' },
      { name: 'Marketing', category: 'Business', level: 'intermediate' as const, description: 'Digital marketing and brand strategy' },
      { name: 'Project Management', category: 'Business', level: 'intermediate' as const, description: 'Project planning and team coordination' }
    ];

    // Add skills that don't already exist
    let skillsCreated = 0;
    for (const skillData of defaultSkills) {
      const existingSkill = await Skill.findOne({ name: skillData.name });
      if (!existingSkill) {
        await Skill.create(skillData);
        skillsCreated++;
      }
    }

    // Check if categories already exist
    const categoriesCount = await SkillCategory.countDocuments();
    let categoriesCreated = 0;
    
    if (categoriesCount === 0) {
      const defaultCategories = [
        { name: 'Programming', description: 'Software development and coding' },
        { name: 'Data Science', description: 'Data analysis and machine learning' },
        { name: 'Creative', description: 'Art, design, and creative skills' },
        { name: 'Communication', description: 'Speaking, writing, and language skills' },
        { name: 'Academic', description: 'Academic subjects and research' },
        { name: 'Business', description: 'Business and entrepreneurship skills' },
        { name: 'Technical', description: 'Technical and engineering skills' }
      ];
      
      await SkillCategory.insertMany(defaultCategories);
      categoriesCreated = defaultCategories.length;
    }

    res.json({
      success: true,
      data: {
        skillsCreated,
        categoriesCreated,
        totalSkills: await Skill.countDocuments(),
        totalCategories: await SkillCategory.countDocuments()
      },
      message: 'Default data initialization completed'
    } as ApiResponse);
  } catch (error) {
    console.error('Error initializing default data:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
});

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    // Test database connectivity
    let skillsCount = 0;
    let categoriesCount = 0;
    let databaseStatus = 'disconnected';
    
    try {
      skillsCount = await Skill.countDocuments();
      categoriesCount = await SkillCategory.countDocuments();
      databaseStatus = 'connected';
    } catch (dbError) {
      console.warn('Database not available for health check:', dbError);
      databaseStatus = 'disconnected';
    }
    
    return res.json({
      success: true,
      data: {
        status: 'healthy',
        database: databaseStatus,
        skills: skillsCount,
        categories: categoriesCount,
        timestamp: new Date().toISOString()
      }
    } as ApiResponse);
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Health check failed',
      data: {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      }
    } as ApiResponse);
  }
});

export default router;
