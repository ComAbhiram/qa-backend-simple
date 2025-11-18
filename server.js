const express = require('express');
const cors = require('cors');
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

// Mock user data (temporary - simple password check for testing)
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123', // Plain text for testing
  role: 'Admin',
  status: 'Active'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'QA Bug Tracker Backend is running!',
    cors: 'Enabled for Netlify'
  });
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password });
    
    // Check if user exists
    if (email !== mockUser.email) {
      console.log('Email not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password (simple comparison for testing)
    if (password !== mockUser.password) {
      console.log('Password mismatch:', { provided: password, expected: mockUser.password });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('Login successful for:', email);
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: mockUser.id, 
        email: mockUser.email,
        role: mockUser.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key-for-testing',
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
      progress: 25,
      members: [mockUser],
      startDate: '2024-11-01',
      endDate: '2024-12-31'
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
});

// Mock labels endpoint
app.get('/api/labels', (req, res) => {
  res.json([
    { id: '1', name: 'Bug', color: '#ff4d4f' },
    { id: '2', name: 'Feature', color: '#52c41a' },
    { id: '3', name: 'Enhancement', color: '#1890ff' }
  ]);
});

// Mock issue types endpoint
app.get('/api/issue-types', (req, res) => {
  res.json([
    { id: '1', name: 'Bug', icon: 'bug_report' },
    { id: '2', name: 'Enhancement', icon: 'lightbulb' },
    { id: '3', name: 'Correction', icon: 'build' }
  ]);
});

// Catch all other API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 CORS enabled for: https://tubular-syrnki-3cb15e.netlify.app`);
  console.log(`🔑 Login credentials: admin@example.com / admin123`);
});
