import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { config } from './config';

const app: Application = express();

// ====================== IMPROVED CORS ======================
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowed = config.allowedOrigins || [];

    // Allow greenstoneng.com and www subdomain
    if (origin.endsWith('.greenstoneng.com') || 
        origin === 'https://greenstoneng.com' || 
        origin === 'https://www.greenstoneng.com' ||
        allowed.includes(origin)) {
      return callback(null, true);
    }

    // Log blocked origins during development/troubleshooting
    if (config.nodeEnv !== 'production') {
      console.log(`[CORS Blocked] Origin: ${origin}`);
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Explicit OPTIONS handler (helps with some preflight issues)
app.options('*', cors(corsOptions));

// ====================== MIDDLEWARE ======================
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: false,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Debug middleware (remove after testing)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (config.nodeEnv !== 'production') {
    console.log(`[Request] ${req.method} ${req.path} | Origin: ${req.headers.origin}`);
  }
  next();
});

// ====================== ROUTES ======================
app.use('/api', routes);
// app.use('/', routes);   // For direct calls like /auth/login

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;