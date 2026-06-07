import app from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/db/db.js';

// Connect to MongoDB database
connectDB();

// Start express server
app.listen(config.PORT, () => {
    console.log(`\nServer Running! Access it here: http://localhost:${config.PORT}`);
});