import { Pool } from 'pg';

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('✅ PostgreSQL connected successfully');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
}

// Initialize database tables
export async function initializeTables(): Promise<void> {
  const client = await pool.connect();

  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        display_name VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        gender VARCHAR(10),
        age INTEGER,
        interests TEXT[],
        hobbies TEXT[],
        games TEXT[],
        bio TEXT,
        photos TEXT[],
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Channels table
    await client.query(`
      CREATE TABLE IF NOT EXISTS channels (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        channel_id INTEGER REFERENCES channels(id) ON DELETE CASCADE,
        reply_to_id INTEGER REFERENCES messages(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default data
    await insertDefaultData(client);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Failed to initialize tables:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function insertDefaultData(client: any): Promise<void> {
  // Insert admin user
  const adminPassword = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'; // 'password'
  await client.query(`
    INSERT INTO users (email, username, display_name, password_hash, gender, age, interests, hobbies, games, location_lat, location_lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    ON CONFLICT (email) DO NOTHING
  `, [
    'admin@focus.com',
    'admin',
    'Администратор',
    adminPassword,
    'male',
    30,
    ['programming', 'gaming'],
    ['coding', 'reading'],
    ['strategy', 'rpg'],
    55.7558,
    37.6173
  ]);

  // Insert general channel
  await client.query(`
    INSERT INTO channels (name, description)
    VALUES ($1, $2)
    ON CONFLICT (name) DO NOTHING
  `, ['general', 'Общий чат']);

  // Insert welcome message
  const adminId = await client.query('SELECT id FROM users WHERE email = $1', ['admin@focus.com']);
  const channelId = await client.query('SELECT id FROM channels WHERE name = $1', ['general']);

  if (adminId.rows.length > 0 && channelId.rows.length > 0) {
    await client.query(`
      INSERT INTO messages (content, author_id, channel_id)
      SELECT $1, $2, $3
      WHERE NOT EXISTS (
        SELECT 1 FROM messages WHERE author_id = $2 AND channel_id = $3 LIMIT 1
      )
    `, ['Добро пожаловать в FOCUS!', adminId.rows[0].id, channelId.rows[0].id]);
  }
}

// User operations
export async function getUserById(id: number) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(userData: any) {
  const { email, username, displayName, password, gender, age, interests, hobbies, games, location } = userData;

  const result = await pool.query(`
    INSERT INTO users (email, username, display_name, password_hash, gender, age, interests, hobbies, games, location_lat, location_lng)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `, [
    email,
    username,
    displayName,
    password,
    gender,
    age,
    interests || [],
    hobbies || [],
    games || [],
    location?.lat,
    location?.lng
  ]);

  return result.rows[0];
}

export async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
  return result.rows;
}

// Channel operations
export async function getChannels() {
  const result = await pool.query('SELECT * FROM channels ORDER BY created_at DESC');
  return result.rows;
}

export async function getChannelById(id: number) {
  const result = await pool.query('SELECT * FROM channels WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createChannel(channelData: any) {
  const { name, description } = channelData;
  const result = await pool.query(`
    INSERT INTO channels (name, description)
    VALUES ($1, $2)
    RETURNING *
  `, [name, description]);

  return result.rows[0];
}

// Message operations
export async function getMessagesByChannel(channelId: number, limit = 50) {
  const result = await pool.query(`
    SELECT m.*, u.username, u.display_name
    FROM messages m
    JOIN users u ON m.author_id = u.id
    WHERE m.channel_id = $1
    ORDER BY m.created_at DESC
    LIMIT $2
  `, [channelId, limit]);

  return result.rows.reverse();
}

export async function createMessage(messageData: any) {
  const { content, authorId, channelId, replyToId } = messageData;
  const result = await pool.query(`
    INSERT INTO messages (content, author_id, channel_id, reply_to_id)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `, [content, authorId, channelId, replyToId]);

  return result.rows[0];
}

// Graceful shutdown
process.on('SIGINT', () => {
  pool.end(() => {
    console.log('PostgreSQL pool closed');
    process.exit(0);
  });
});

export { pool };