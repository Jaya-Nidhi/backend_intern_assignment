import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth.routes';
import noteRoutes from './routes/note.routes';
import { errorHandler, notFound } from './middlewares/error.middleware';
import { swaggerSpec } from './config/swagger';

const app = express();

// ── Security & Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ── Rate Limiting ──────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/v1/auth', authLimiter);

// ── Health Check ───────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ── Swagger Docs ───────────────────────────────────────────────────────
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'NoteVault API Docs',
    customCss: `
      .topbar { background: #1a1a24 !important; }
      .topbar-wrapper img { display: none; }
      .topbar-wrapper::after { content: '📝 NoteVault API'; color: #a78bfa; font-size: 1.2rem; font-weight: 600; }
      .swagger-ui .info .title { color: #a78bfa; }
      body { background: #0a0a0f; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  })
);

// Serve raw JSON spec for Postman import
app.get('/api/docs.json', (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ── API Routes ─────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/notes', noteRoutes);

// ── 404 & Error Handling ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = parseInt(process.env.PORT || '5000', 10);
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Docs at  http://localhost:${PORT}/api/docs`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
