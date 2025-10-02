import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps } from 'firebase-admin/app';

// Initialize Firebase Admin SDK if not already initialized
if (getApps().length === 0) {
  // For development, we'll use a simple approach
  // In production, you should use proper service account credentials
  try {
    initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || 'knoweachother-ba559'
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Access token required'
    });
    return;
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || ''
    };
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    });
    return;
  }
};

export const optionalAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || ''
      };
    } catch (error) {
      // Token is invalid, but we continue without authentication
      console.warn('Invalid token provided, continuing without auth');
    }
  }
  
  next();
};
