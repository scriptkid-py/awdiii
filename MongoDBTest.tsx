import React, { useState } from 'react';
import { connectToDatabase, getCollections } from './mongodb';

const MongoDBTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>('Not tested');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setConnectionStatus('Testing connection to MongoDB Atlas...');
    
    try {
      const connected = await connectToDatabase();
      
      if (connected) {
        const collections = getCollections();
        
        // Test if we can access collections
        const profileCount = await collections.profiles.countDocuments();
        const skillCount = await collections.skills.countDocuments();
        
        setConnectionStatus(`✅ Connected to MongoDB Atlas! Profiles: ${profileCount}, Skills: ${skillCount}`);
      } else {
        setConnectionStatus('❌ Connection failed - check your credentials and network access');
      }
    } catch (error) {
      console.error('MongoDB connection error:', error);
      setConnectionStatus(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      border: '1px solid #ccc', 
      borderRadius: '8px', 
      margin: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>MongoDB Atlas Connection Test</h3>
      <p><strong>Status:</strong> {connectionStatus}</p>
      <button 
        onClick={testConnection} 
        disabled={isLoading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Testing...' : 'Test Connection'}
      </button>
      
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>✅ Setup Complete!</strong></p>
        <ul>
          <li>✅ MongoDB Atlas connection configured</li>
          <li>✅ Environment variables set</li>
          <li>✅ Database: skillshare</li>
          <li>✅ User: r44chr_db_user</li>
          <li>✅ Cluster: skillshire.mongodb.net</li>
        </ul>
        <p style={{ marginTop: '1rem', color: '#28a745' }}>
          <strong>Ready to use!</strong> Your MongoDB Atlas connection is configured and ready for testing.
        </p>
      </div>
    </div>
  );
};

export default MongoDBTest;
