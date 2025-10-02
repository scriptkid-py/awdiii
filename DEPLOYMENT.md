# 🚀 SkillShare Deployment Guide for Render.com

## Prerequisites
- GitHub account with your code pushed
- Render.com account (free tier available)
- MongoDB Atlas account (free tier available)

## Step 1: Set up MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account
   - Create a new project called "SkillShare"

2. **Create Database Cluster:**
   - Click "Build a Database"
   - Choose "M0 Sandbox" (Free tier)
   - Select your preferred cloud provider and region
   - Name your cluster "skillshare-cluster"

3. **Configure Database Access:**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `skillshare-user`
   - Generate a secure password and save it
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access:**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - This allows Render.com to connect

5. **Get Connection String:**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://skillshare-user:<password>@skillshare-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password

## Step 2: Deploy Backend to Render

1. **Create Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Backend Service:**
   - **Name:** `skillshare-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://skillshare-user:YOUR_PASSWORD@skillshare-cluster.xxxxx.mongodb.net/skillshare?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here
   FIREBASE_PROJECT_ID=knoweachother-ba559
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://skillshare-backend.onrender.com`

## Step 3: Deploy Frontend to Render

1. **Create Static Site:**
   - In Render Dashboard, click "New +" → "Static Site"
   - Connect your GitHub repository
   - Select your repository

2. **Configure Frontend Service:**
   - **Name:** `skillshare-frontend`
   - **Branch:** `main`
   - **Root Directory:** Leave empty (root of repo)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`

3. **Set Environment Variables:**
   ```
   VITE_API_BASE_URL=https://skillshare-backend.onrender.com/api
   VITE_ENVIRONMENT=production
   ```

4. **Deploy:**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note your frontend URL: `https://skillshare-frontend.onrender.com`

## Step 4: Update Backend CORS

1. **Update Environment Variables:**
   - Go to your backend service in Render
   - Add environment variable:
   ```
   FRONTEND_URL=https://skillshare-frontend.onrender.com
   ```

2. **Redeploy Backend:**
   - The service will automatically redeploy with new environment variables

## Step 5: Initialize Database

1. **Visit Your App:**
   - Go to your frontend URL: `https://skillshare-frontend.onrender.com`
   - The app should automatically initialize the database with default skills

2. **Test Functionality:**
   - Try logging in with Google
   - Create a profile
   - Browse profiles
   - Test all features

## 🔧 Troubleshooting

### Backend Issues:
- Check logs in Render dashboard
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend Issues:
- Check browser console for errors
- Verify API_BASE_URL points to your backend
- Check network tab for failed requests

### Database Issues:
- Verify MongoDB Atlas network access allows all IPs
- Check database user permissions
- Test connection string locally first

## 📱 Free Tier Limitations

**Render.com Free Tier:**
- Services sleep after 15 minutes of inactivity
- 750 hours/month (enough for one service)
- Cold start delays (10-30 seconds)

**MongoDB Atlas Free Tier:**
- 512 MB storage
- Shared clusters
- No backup/restore

## 🚀 Going Live Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Backend deployed to Render with correct environment variables
- [ ] Frontend deployed to Render with correct API URL
- [ ] CORS configured to allow frontend domain
- [ ] Database initialized with default skills
- [ ] Google authentication working
- [ ] Profile creation and browsing working
- [ ] All features tested in production

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Firebase Console](https://console.firebase.google.com/)

Your SkillShare app should now be live and accessible worldwide! 🌟
