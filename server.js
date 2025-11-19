import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import issueRoutes from './routes/issueRoutes.js';
import activityRoutes from './routes/activityRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import sprintRoutes from './routes/sprintRoutes.js';
import epicRoutes from './routes/epicRoutes.js';
import labelRoutes from './routes/labels.js';
import issueTypeRoutes from './routes/issueTypes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOrigins = process.env.NODE_ENV === 'production' 
  ? process.env.CORS_ORIGINS?.split(',') || []
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000'
    ];

app.use(cors({
  origin: [
    ...corsOrigins,
    /\.netlify\.app$/,        // Allow Netlify domains
    /\.ngrok\.io$/,           // Allow all ngrok.io URLs
    /\.ngrok-free\.app$/,     // Allow new ngrok domain
    /\.ngrok\.app$/           // Allow ngrok.app URLs
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/sprints', sprintRoutes);
app.use('/api/epics', epicRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/issue-types', issueTypeRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║     🚀 QA Bugtracking Tool API Server                     ║
║                                                            ║
║     Server running on port ${PORT}                            ║
║     Environment: ${process.env.NODE_ENV || 'development'}                          ║
║                                                            ║
║     📡 API Base URL: http://localhost:${PORT}                 ║
║     🏥 Health Check: http://localhost:${PORT}/health          ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
