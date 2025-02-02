import app from './app.js'; // Import the configured Express app
import connectDB from './config/db.js'; // Import the MongoDB connection function

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Define the port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});