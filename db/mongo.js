const mongoose = require('mongoose');

// Database connection options
const clientOptions = {
    dbName: 'apinode',
};

exports.initClienDbConnection = async () => {
    try {
        // Connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.URL_MONGO, clientOptions);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error;
    }
};

