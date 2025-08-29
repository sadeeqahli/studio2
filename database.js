import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

class DatabaseService {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    async testConnection() {
        try {
            const result = await this.query('SELECT NOW()');
            console.log('✓ Database connected successfully at:', result.rows[0].now);
            return true;
        } catch (err) {
            console.error('✗ Database connection failed:', err);
            return false;
        }
    }

    async initializeTables() {
        try {
            // Users table
            await this.query(`
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    email VARCHAR(100) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    user_type VARCHAR(10) CHECK (user_type IN ('player', 'owner')) NOT NULL,
                    full_name VARCHAR(100),
                    phone VARCHAR(20),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Sports facilities table
            await this.query(`
                CREATE TABLE IF NOT EXISTS facilities (
                    id SERIAL PRIMARY KEY,
                    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(100) NOT NULL,
                    description TEXT,
                    location VARCHAR(200) NOT NULL,
                    address TEXT,
                    latitude DECIMAL(10, 8),
                    longitude DECIMAL(11, 8),
                    amenities JSONB,
                    images JSONB,
                    hourly_rate DECIMAL(10, 2) NOT NULL,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Bookings table
            await this.query(`
                CREATE TABLE IF NOT EXISTS bookings (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
                    booking_date DATE NOT NULL,
                    start_time TIME NOT NULL,
                    end_time TIME NOT NULL,
                    total_amount DECIMAL(10, 2) NOT NULL,
                    booking_type VARCHAR(20) CHECK (booking_type IN ('individual', 'team')) NOT NULL,
                    team_id INTEGER,
                    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
                    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'partial', 'completed', 'failed')) DEFAULT 'pending',
                    notes TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Teams table
            await this.query(`
                CREATE TABLE IF NOT EXISTS teams (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100) NOT NULL,
                    captain_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
                    max_members INTEGER DEFAULT 22,
                    split_amount DECIMAL(10, 2) NOT NULL,
                    join_code VARCHAR(10) UNIQUE NOT NULL,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Team members table
            await this.query(`
                CREATE TABLE IF NOT EXISTS team_members (
                    id SERIAL PRIMARY KEY,
                    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    contribution_amount DECIMAL(10, 2) DEFAULT 0.00,
                    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'completed')) DEFAULT 'pending',
                    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(team_id, user_id)
                )
            `);

            // Reviews table
            await this.query(`
                CREATE TABLE IF NOT EXISTS reviews (
                    id SERIAL PRIMARY KEY,
                    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    facility_id INTEGER REFERENCES facilities(id) ON DELETE CASCADE,
                    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
                    comment TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `);

            console.log('✓ Database tables initialized successfully');
            return true;
        } catch (err) {
            console.error('✗ Database initialization failed:', err);
            return false;
        }
    }

    // User methods
    async createUser(userData) {
        const { username, email, password_hash, user_type, full_name, phone } = userData;
        const result = await this.query(
            'INSERT INTO users (username, email, password_hash, user_type, full_name, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, email, password_hash, user_type, full_name, phone]
        );
        return result.rows[0];
    }

    async getUserByEmail(email) {
        const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async getUserById(id) {
        const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    // Facility methods
    async createFacility(facilityData) {
        const { owner_id, name, description, location, address, latitude, longitude, amenities, images, hourly_rate } = facilityData;
        const result = await this.query(
            'INSERT INTO facilities (owner_id, name, description, location, address, latitude, longitude, amenities, images, hourly_rate) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [owner_id, name, description, location, address, latitude, longitude, JSON.stringify(amenities), JSON.stringify(images), hourly_rate]
        );
        return result.rows[0];
    }

    async getAllFacilities() {
        const result = await this.query('SELECT * FROM facilities WHERE is_active = true ORDER BY created_at DESC');
        return result.rows;
    }

    async getFacilitiesByOwner(ownerId) {
        const result = await this.query('SELECT * FROM facilities WHERE owner_id = $1 ORDER BY created_at DESC', [ownerId]);
        return result.rows;
    }

    // Booking methods
    async createBooking(bookingData) {
        const { user_id, facility_id, booking_date, start_time, end_time, total_amount, booking_type, team_id, notes } = bookingData;
        const result = await this.query(
            'INSERT INTO bookings (user_id, facility_id, booking_date, start_time, end_time, total_amount, booking_type, team_id, notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [user_id, facility_id, booking_date, start_time, end_time, total_amount, booking_type, team_id, notes]
        );
        return result.rows[0];
    }

    async getBookingsByUser(userId) {
        const result = await this.query(`
            SELECT b.*, f.name as facility_name, f.location as facility_location 
            FROM bookings b 
            JOIN facilities f ON b.facility_id = f.id 
            WHERE b.user_id = $1 
            ORDER BY b.booking_date DESC, b.start_time DESC
        `, [userId]);
        return result.rows;
    }

    async getBookingById(bookingId) {
        const result = await this.query(`
            SELECT b.*, f.name as facility_name, f.location as facility_location, u.full_name as user_name 
            FROM bookings b 
            JOIN facilities f ON b.facility_id = f.id 
            JOIN users u ON b.user_id = u.id 
            WHERE b.id = $1
        `, [bookingId]);
        return result.rows[0];
    }

    // Team methods
    async createTeam(teamData) {
        const { name, captain_id, booking_id, max_members, split_amount, join_code } = teamData;
        const result = await this.query(
            'INSERT INTO teams (name, captain_id, booking_id, max_members, split_amount, join_code) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, captain_id, booking_id, max_members, split_amount, join_code]
        );
        return result.rows[0];
    }

    async getTeamByJoinCode(joinCode) {
        const result = await this.query('SELECT * FROM teams WHERE join_code = $1 AND is_active = true', [joinCode]);
        return result.rows[0];
    }

    async addTeamMember(teamId, userId, contributionAmount = 0) {
        const result = await this.query(
            'INSERT INTO team_members (team_id, user_id, contribution_amount) VALUES ($1, $2, $3) RETURNING *',
            [teamId, userId, contributionAmount]
        );
        return result.rows[0];
    }

    async getTeamMembers(teamId) {
        const result = await this.query(`
            SELECT tm.*, u.username, u.full_name 
            FROM team_members tm 
            JOIN users u ON tm.user_id = u.id 
            WHERE tm.team_id = $1 
            ORDER BY tm.joined_at
        `, [teamId]);
        return result.rows;
    }

    async close() {
        await this.pool.end();
    }
}

export default DatabaseService;