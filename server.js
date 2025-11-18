const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['https://tubular-syrnki-3cb15e.netlify.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Mock user data (temporary - until database works)
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: '$2b$10$K7L8yWjmkQD8h2F5ZGhX8OqGhVtJ3R9XzF6N8K4L2P7Q9S1T5V3W7Y', // admin123
  role: 'Admin',
  status: 'Active'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'QA Bug Tracker Backend is running!'
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', email);
    
    // Check if user exists (mock check)
    if (email !== mockUser.email) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, mockUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        email: mockUser.email,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mock projects endpoint
app.get('/api/projects', (req, res) => {
  res.json([
    {
      id: '1',
      name: 'Sample QA Project',
      description: 'Test project for QA Bug Tracker',
      status: 'In Progress',
      issueCount: 1,
      progress: 25
    }
  ]);
});

// Mock issues endpoint
app.get('/api/projects/:id/issues', (req, res) => {
  res.json([
    {
      id: '1',
      projectId: req.params.id,
      bugId: 'SAMPLE-001',
      title: 'Sample Issue for Testing',
      description: 'This is a sample issue to test functionality',
      type: 'Bug',
      severity: 'Medium',
      priority: 'P2',
      status: 'Open',
      assignedTo: mockUser,
      reportedBy: mockUser,
      createdAt: new Date().toISOString()
    }
  ]);
});

// Catch all other API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for: https://tubular-syrnki-3cb15e.netlify.app`);
});
