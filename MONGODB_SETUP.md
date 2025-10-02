# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up for a free account
3. Create a new project

## 2. Create a Cluster
1. Click "Build a Database"
2. Choose "FREE" tier (M0)
3. Select a cloud provider and region
4. Name your cluster (e.g., "skillshare-cluster")
5. Click "Create"

## 3. Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and password
5. Set privileges to "Read and write to any database"
6. Click "Add User"

## 4. Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

## 5. Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string

## 6. Update Your Environment Variables
Create a `.env` file in your project root:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/skillshare?retryWrites=true&w=majority
MONGODB_DB=skillshare
```

Replace:
- `your-username` with your database username
- `your-password` with your database password
- `your-cluster` with your cluster name

## 7. Install Dependencies
```bash
npm install mongodb mongoose
```

## 8. Update Your Code
Replace the import in your components:
```typescript
// Change from:
import { getUserProfile } from './database';

// To:
import { getUserProfile } from './database-mongodb';
```

## 9. Test Connection
The MongoDB connection will be automatically established when you first use any database function.

## Security Notes
- Never commit your `.env` file to version control
- Use environment variables in production
- Consider using MongoDB Atlas IP whitelisting for production
- Regularly rotate your database passwords
