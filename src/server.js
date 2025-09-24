const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const { errorHandler, logger } = require('./middleware/errorHandler');
const { requestIdMiddleware } = require('./middleware/requestId');
const { auditMiddleware, auditResponseMiddleware } = require('./middleware/audit');
const { rateLimiters } = require('./middleware/rateLimiter');
const healthRoutes = require('./routes/health');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const adminCategoriesRoutes = require('./routes/adminCategories');
const adminProductsRoutes = require('./routes/adminProducts');
const adminSearchRoutes = require('./routes/adminSearch');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const searchRoutes = require('./routes/search');
const docsRoutes = require('./routes/docs');
const openapiRoutes = require('./routes/openapi');
const db = require('./database/models');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3002'];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Request ID middleware (must be early for correlation)
app.use(requestIdMiddleware);

// Audit middleware (must be early for request tracking)
app.use(auditMiddleware);

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// Apply rate limiting to routes
app.use('/health', rateLimiters.health, healthRoutes);
app.use('/auth', rateLimiters.auth, authRoutes);
app.use('/admin', rateLimiters.admin, adminRoutes);
app.use('/api/admin/categories', rateLimiters.admin, adminCategoriesRoutes);
app.use('/api/admin/products', rateLimiters.admin, adminProductsRoutes);
app.use('/api/admin/search', rateLimiters.admin, adminSearchRoutes);
app.use('/api/categories', rateLimiters.public, categoriesRoutes);
app.use('/api/products', rateLimiters.public, productsRoutes);
app.use('/api/search', rateLimiters.search, searchRoutes);
app.use('/api', rateLimiters.general, docsRoutes);
app.use('/api', rateLimiters.general, openapiRoutes);

// Response audit middleware (after routes)
app.use(auditResponseMiddleware);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'GlobeMart Backend API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'Route not found',
      requestId: req.requestId
    }
  });
});

module.exports = app;
