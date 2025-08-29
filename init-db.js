import DatabaseService from './database.js';

async function initializeDatabase() {
    console.log('🔄 Initializing PitchLink database...');
    
    const db = new DatabaseService();
    
    try {
        // Test connection
        const connected = await db.testConnection();
        if (!connected) {
            console.error('❌ Failed to connect to database');
            process.exit(1);
        }

        // Initialize tables
        const initialized = await db.initializeTables();
        if (!initialized) {
            console.error('❌ Failed to initialize database tables');
            process.exit(1);
        }

        console.log('✅ PitchLink database initialized successfully!');
        console.log('🎯 Your football booking platform is ready to go!');
        
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

// Run initialization
initializeDatabase();