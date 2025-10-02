# SkillShare Backend API

A secure Express.js backend API for the SkillShare application with MongoDB integration.

## Features

- **Secure API Endpoints**: RESTful API with proper authentication and validation
- **MongoDB Integration**: Uses Mongoose for database operations
- **Authentication Middleware**: JWT-based authentication system
- **Input Validation**: Comprehensive request validation using express-validator
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **CORS Support**: Properly configured for frontend integration
- **Error Handling**: Centralized error handling with detailed logging
- **Health Checks**: Built-in health monitoring endpoints

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Copy the environment example file:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillshare?retryWrites=true&w=majority
MONGODB_DB=skillshare

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BCRYPT_ROUNDS=12

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Health & Initialization

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/initialize/health` - Database health check
- `POST /api/initialize/default-data` - Initialize default skills and categories

### User Profiles

- `GET /api/profiles/me` - Get current user's profile (authenticated)
- `POST /api/profiles` - Create user profile (authenticated)
- `PUT /api/profiles/:id` - Update user profile (authenticated)
- `GET /api/profiles` - Get all profiles (public)
- `GET /api/profiles/search` - Search profiles (public)
- `GET /api/profiles/:id` - Get profile by ID (public)

### Skills

- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (authenticated)
- `GET /api/skills/:id` - Get skill by ID

### Skill Categories

- `GET /api/skill-categories` - Get all skill categories
- `POST /api/skill-categories` - Create skill category (authenticated)
- `GET /api/skill-categories/:id` - Get skill category by ID

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Development

### Scripts

- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

### Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.ts              # Authentication middleware
│   │   └── validation.ts        # Request validation
│   ├── models/
│   │   ├── UserProfile.ts       # User profile model
│   │   ├── Skill.ts             # Skill model
│   │   └── SkillCategory.ts     # Skill category model
│   ├── routes/
│   │   ├── profiles.ts          # Profile endpoints
│   │   ├── skills.ts            # Skill endpoints
│   │   ├── skillCategories.ts   # Category endpoints
│   │   └── initialize.ts        # Initialization endpoints
│   ├── types.ts                 # TypeScript type definitions
│   └── server.ts                # Main server file
├── dist/                        # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configuration
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Comprehensive request validation
- **JWT Authentication**: Secure token-based authentication
- **Environment Variables**: Sensitive data stored in environment variables

## Deployment

1. Set `NODE_ENV=production` in your environment
2. Update environment variables for production
3. Build the application: `npm run build`
4. Start the server: `npm start`

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation for all endpoints
4. Write tests for new features
5. Update documentation
