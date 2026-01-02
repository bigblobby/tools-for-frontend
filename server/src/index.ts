import express, { type Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRouter } from './routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = (process.env.PORT || 3001) as number;

// Disable ETag to prevent 304 responses
app.set('etag', false);

// Middleware
app.use(cors());

// Conditionally apply json() middleware, excluding routes that need raw body
app.use((req, res, next) => {
  if (req.path === '/api/converter/json-to-xml') {
    return next(); // Skip json parsing for this route
  }
  express.json()(req, res, next);
});

app.use(express.urlencoded({ extended: true }));

app.use('/api', createRouter());

app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

