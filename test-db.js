// Test database connection
import { testConnection, initializeDatabase, getDatabaseStats } from './src/utils/database.js';

async function testDatabase() {
  console.log('🧪 Testing database connection...\n');

  try {
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ Database connection failed');
      return;
    }

    // Initialize database
    console.log('🔄 Initializing database...');
    await initializeDatabase();

    // Get stats
    console.log('📊 Getting database stats...');
    const stats = await getDatabaseStats();
    console.log('Database Stats:', stats);

    console.log('\n✅ Database test completed successfully!');
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();