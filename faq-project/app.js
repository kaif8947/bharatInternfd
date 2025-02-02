import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import faqRoutes from './routes/faqRoutes.js';

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api/faqs', faqRoutes); // Use FAQ routes

// ✅ Ensure correct export
export default app;
