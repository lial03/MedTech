import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'medtech-secret-key';

app.use(cors());

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Authentication required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Login Route (Isolated Parser)
app.post('/api/auth/login', express.json(), (req, res) => {
  const { email, password } = req.body;
  
  if (email && email.includes('@')) {
    const user = {
      id: 'u-001',
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'Administrator'
    };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Proxy Routes (Native Streaming)
const serviceProxy = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: { '^/api': '' },
});

// Public Health Check
app.get('/api/health', (req, res) => res.json({ status: 'Gateway Online' }));

// Protected Service Routes
const TIMEOUT = 30000; // 30s proxy timeout
app.use('/api/assets', authenticateToken, serviceProxy('http://127.0.0.1:3001'));
app.use('/api/workorders', authenticateToken, serviceProxy('http://127.0.0.1:3002'));
app.use('/api/inventory', authenticateToken, serviceProxy('http://127.0.0.1:3003'));
app.use('/api/ai', authenticateToken, serviceProxy('http://127.0.0.1:8000'));

app.listen(PORT, () => {
  console.log(`Fi-CMMS API Gateway running on http://localhost:${PORT}`);
});
