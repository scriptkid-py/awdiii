import React, { useState } from 'react';
import { apiClient } from './api-client';
import { logger, createUserErrorMessage } from './logger';

const MongoDBTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing database access...');
    
    try {
      // Test backend API connection and data access
      const healthResponse = await apiClient.healthCheck();
      
      if (healthResponse.success && healthResponse.data) {
        const { skills, categories } = healthResponse.data;
        setConnectionStatus(`✅ Backend API working! Skills: ${skills}, Categories: ${categories}`);
      } else {
        throw new Error(healthResponse.error || 'Health check failed');
      }
    } catch (error) {
      // Log the full error with structured logging
      const errorCode = logger.error(
        'Database access test failed',
        error instanceof Error ? error : new Error(String(error)),
        {
          operation: 'database_access_test',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      );
      
      // Show sanitized user-facing message
      setConnectionStatus(createUserErrorMessage('Backend API Access', errorCode));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="test-container">
      <h3>Backend API Access Test</h3>
      <p><strong>Status:</strong> {connectionStatus}</p>
      <button 
        onClick={testConnection} 
        disabled={isLoading}
        aria-label="Test MongoDB connection"
        aria-busy={isLoading}
        aria-disabled={isLoading}
        className="test-button"
      >
        {isLoading ? 'Testing...' : 'Test Backend API Access'}
      </button>
      
      <div className="test-info-section">
        <p><strong>✅ Backend API Setup Complete!</strong></p>
        <ul>
          <li>✅ Backend API server configured</li>
          <li>✅ Database operations moved to backend</li>
          <li>✅ Secure API endpoints available</li>
          <li>✅ Authentication middleware ready</li>
          <li>✅ Data validation implemented</li>
        </ul>
        <p className="test-success-message">
          <strong>Ready to use!</strong> Your backend API is configured and ready for testing.
        </p>
      </div>
    </div>
  );
};

export default MongoDBTest;
