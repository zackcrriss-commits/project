import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_mN5GXVDe6YQE@ep-gentle-rain-a161ii9h-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

// Create connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon
  },
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};

// Initialize database tables
export const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    // Create sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        session_id VARCHAR(255) PRIMARY KEY,
        user_agent TEXT,
        screen_resolution VARCHAR(50),
        language VARCHAR(10),
        platform VARCHAR(50),
        ip_address INET,
        first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        activity_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create activities table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id VARCHAR(255) PRIMARY KEY,
        session_id VARCHAR(255) REFERENCES sessions(session_id) ON DELETE CASCADE,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        action VARCHAR(50) NOT NULL,
        target VARCHAR(255),
        value TEXT,
        page VARCHAR(255),
        user_agent TEXT,
        screen_resolution VARCHAR(50),
        ip_address INET,
        received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_activities_session_id ON activities(session_id);
      CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
      CREATE INDEX IF NOT EXISTS idx_activities_action ON activities(action);
      CREATE INDEX IF NOT EXISTS idx_sessions_last_seen ON sessions(last_seen);
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Session operations
export const createSession = async (sessionData) => {
  const client = await pool.connect();
  try {
    const { sessionId, userAgent, screenResolution, language, platform, ipAddress } = sessionData;

    const query = `
      INSERT INTO sessions (session_id, user_agent, screen_resolution, language, platform, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (session_id) DO NOTHING
      RETURNING *
    `;

    const values = [sessionId, userAgent, screenResolution, language, platform, ipAddress];
    const result = await client.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const updateSessionLastSeen = async (sessionId) => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE sessions
      SET last_seen = NOW(), activity_count = activity_count + 1
      WHERE session_id = $1
    `;
    await client.query(query, [sessionId]);
  } catch (error) {
    console.error('Error updating session:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getAllSessions = async (limit = 1000) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT
        session_id,
        user_agent,
        screen_resolution,
        first_seen,
        last_seen,
        activity_count,
        created_at
      FROM sessions
      ORDER BY last_seen DESC
      LIMIT $1
    `;
    const result = await client.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Error getting sessions:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getSessionById = async (sessionId) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM sessions WHERE session_id = $1
    `;
    const result = await client.query(query, [sessionId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting session:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Activity operations
export const addActivity = async (activityData) => {
  const client = await pool.connect();
  try {
    const {
      sessionId,
      timestamp,
      action,
      target,
      value,
      page,
      userAgent,
      screenResolution,
      ipAddress
    } = activityData;

    // First, ensure session exists
    await createSession({
      sessionId,
      userAgent,
      screenResolution,
      language: navigator?.language || 'unknown',
      platform: navigator?.platform || 'unknown',
      ipAddress
    });

    // Then add activity
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const query = `
      INSERT INTO activities (
        id, session_id, timestamp, action, target, value, page,
        user_agent, screen_resolution, ip_address
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    const values = [
      activityId,
      sessionId,
      timestamp,
      action,
      target,
      value,
      page,
      userAgent,
      screenResolution,
      ipAddress
    ];

    await client.query(query, values);

    // Update session last seen and activity count
    await updateSessionLastSeen(sessionId);

    return { id: activityId, ...activityData };
  } catch (error) {
    console.error('Error adding activity:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getAllActivities = async (limit = 5000) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM activities
      ORDER BY timestamp DESC
      LIMIT $1
    `;
    const result = await client.query(query, [limit]);
    return result.rows;
  } catch (error) {
    console.error('Error getting activities:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getActivitiesBySession = async (sessionId) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM activities
      WHERE session_id = $1
      ORDER BY timestamp ASC
    `;
    const result = await client.query(query, [sessionId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting activities by session:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getActivitiesByDateRange = async (startDate, endDate) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM activities
      WHERE timestamp >= $1 AND timestamp <= $2
      ORDER BY timestamp DESC
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error('Error getting activities by date range:', error);
    throw error;
  } finally {
    client.release();
  }
};

export const getSessionsByDateRange = async (startDate, endDate) => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT * FROM sessions
      WHERE first_seen >= $1 AND first_seen <= $2
      ORDER BY first_seen DESC
    `;
    const result = await client.query(query, [startDate, endDate]);
    return result.rows;
  } catch (error) {
    console.error('Error getting sessions by date range:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Cleanup old data (optional - for maintenance)
export const cleanupOldData = async (daysOld = 30) => {
  const client = await pool.connect();
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    // Delete old activities
    await client.query('DELETE FROM activities WHERE timestamp < $1', [cutoffDate]);

    // Delete sessions with no activities
    await client.query(`
      DELETE FROM sessions
      WHERE session_id NOT IN (
        SELECT DISTINCT session_id FROM activities
      )
    `);

    console.log(`✅ Cleaned up data older than ${daysOld} days`);
  } catch (error) {
    console.error('Error cleaning up old data:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Get database stats
export const getDatabaseStats = async () => {
  const client = await pool.connect();
  try {
    const sessionStats = await client.query(`
      SELECT
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN last_seen >= NOW() - INTERVAL '1 hour' THEN 1 END) as active_last_hour,
        COUNT(CASE WHEN last_seen >= NOW() - INTERVAL '24 hours' THEN 1 END) as active_last_24h
      FROM sessions
    `);

    const activityStats = await client.query(`
      SELECT
        COUNT(*) as total_activities,
        COUNT(CASE WHEN action = 'page_view' THEN 1 END) as page_views,
        COUNT(CASE WHEN action = 'input_change' THEN 1 END) as input_changes,
        COUNT(CASE WHEN action = 'form_submit' THEN 1 END) as form_submissions
      FROM activities
    `);

    return {
      sessions: sessionStats.rows[0],
      activities: activityStats.rows[0]
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Close pool (for graceful shutdown)
export const closePool = async () => {
  await pool.end();
  console.log('✅ Database pool closed');
};

export default pool;