# SkillShare - University Skill Sharing Platform

A modern web application that connects university students to share and learn skills from each other. Built with React, TypeScript, and a secure Express.js backend.

## 🚀 Features

- **User Profiles**: Create detailed profiles showcasing your skills and availability
- **Skill Discovery**: Browse and search for students with specific skills
- **Secure Backend**: RESTful API with authentication and data validation
- **Real-time Search**: Find students by skills, university, year, or search terms
- **Firebase Authentication**: Secure user authentication system
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This application follows a secure client-server architecture:

- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Express.js + MongoDB + Mongoose (Port 3001)
- **Database**: MongoDB Atlas (secure cloud database)
- **Authentication**: Firebase Auth + JWT tokens

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project for authentication

### 1. Clone and Install

```bash
git clone <repository-url>
cd skillshare

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Setup

#### Frontend Environment
Copy and configure the frontend environment:

```bash
cp env.example .env
```

Update `.env` with your configuration:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:3001/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### Backend Environment
Configure the backend environment:

```bash
cd backend
cp env.example .env
```

Update `backend/.env` with your configuration:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillshare?retryWrites=true&w=majority
MONGODB_DB=skillshare

# Server Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Application

#### Start Backend Server (Terminal 1)
```bash
cd backend
npm run dev
```

#### Start Frontend Development Server (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## 📁 Project Structure

```
skillshare/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── api-client.ts          # Frontend API client
├── database-api.ts        # API-based database operations
├── types.ts              # Shared TypeScript types
└── README.md
```

## 🔒 Security Features

- **Secure Backend API**: All database operations happen on the server
- **Authentication Middleware**: JWT-based authentication
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Proper cross-origin setup
- **Environment Variables**: Sensitive data stored securely

## 🛠️ Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

#### Backend
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

### API Documentation

The backend provides RESTful API endpoints:

- **Profiles**: `/api/profiles/*` - User profile management
- **Skills**: `/api/skills/*` - Skill data management
- **Categories**: `/api/skill-categories/*` - Skill category management
- **Health**: `/api/initialize/health` - System health checks

See [backend/README.md](backend/README.md) for detailed API documentation.

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas database
2. Configure environment variables for production
3. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Update `VITE_API_BASE_URL` to your production backend URL
2. Build the application: `npm run build`
3. Deploy the `dist` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
