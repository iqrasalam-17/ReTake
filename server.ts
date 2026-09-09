import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { runProductionPipeline } from './src/agents/orchestrator';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RETAKE AI Production Intelligence',
    version: '2.4.0',
    track: 'Google Cloud Agentic Cinema — Parallel Track',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    parallelConfigured: Boolean(process.env.PARALLEL_API_KEY),
  });
});

// Primary Analysis API (POST /api/analyze)
app.post('/api/analyze', async (req, res) => {
  const { screenplay, constraints } = req.body || {};

  if (!screenplay || typeof screenplay !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "screenplay" text in request body.' });
  }

  const safeConstraints = typeof constraints === 'string' ? constraints : '';

  try {
    console.log(`[API /api/analyze] Received analysis request (${screenplay.length} characters).`);
    const result = await runProductionPipeline(screenplay, safeConstraints);
    return res.json(result);
  } catch (error: any) {
    console.error('[API /api/analyze] Error during multi-agent analysis:', error);
    return res.status(500).json({
      error: 'Analysis pipeline failed',
      details: error?.message || 'Internal Server Error',
    });
  }
});

// Real-time Server-Sent Events (SSE) Stream API (/api/analyze/stream)
// Supports both POST (direct payload) and GET (query parameters or SSE hook)
app.post('/api/analyze/stream', async (req, res) => {
  const { screenplay, constraints } = req.body || {};

  if (!screenplay || typeof screenplay !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid "screenplay" text in request body.' });
  }

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    console.log('[API /api/analyze/stream] Client connected to SSE stream.');
    const result = await runProductionPipeline(screenplay, constraints || '', (event) => {
      sendEvent(event);
    });

    sendEvent({ stage: 'COMPLETE', status: 'complete', result });
    res.write('event: end\ndata: {}\n\n');
    res.end();
  } catch (error: any) {
    console.error('[API /api/analyze/stream] SSE stream error:', error);
    sendEvent({ stage: 'ERROR', status: 'error', message: error?.message || 'Pipeline error' });
    res.end();
  }
});

// GET fallback for SSE stream testing
app.get('/api/analyze/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  res.write(`data: ${JSON.stringify({ message: 'RETAKE SSE Stream Endpoint Ready. Send POST to initiate pipeline stream.' })}\n\n`);
  res.end();
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[RETAKE SERVER] Starting in development mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[RETAKE SERVER] Starting in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RETAKE SERVER] 🚀 Server running on port ${PORT} (0.0.0.0:${PORT})`);
  });
}

startServer();
