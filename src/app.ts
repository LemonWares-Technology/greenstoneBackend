import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { config } from './config';

const app: Application = express();

const healthCheck = (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
};

// ====================== MIDDLEWARE ======================
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
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Greenstone API is running',
    health: '/health',
    apiHealth: '/api/health',
  });
});

app.get('/favicon.ico', (req: Request, res: Response) => {
  res.status(204).end();
});

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

app.use('/api', routes);
app.use('/', routes);   // Helps if cPanel mounts app at /api and strips prefix

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global Error Handler
app.use(errorHandler);

export default app;
