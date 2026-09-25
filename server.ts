import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = parseInt(process.env.PORT || '3000', 10);

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);
  let geminiAI: GoogleGenAI | null = null;
  if (hasApiKey) {
    try {
      geminiAI = new GoogleGenAI();
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI with current environment:', e);
    }
  }

  // System Health & AI Provider Status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'SnapShield AI Backend',
      hasCloudReasoning: Boolean(process.env.GEMINI_API_KEY),
      cloudModel: 'gemini-3.8-flash',
      localTarget: 'Qualcomm AI Hub (Snapdragon X Elite / Plus)',
    });
  });

  // Optional Cloud AI Q&A Endpoint
  // Enforces that input context must be privacy-sanitized
  app.post('/api/ai/qa', async (req, res) => {
    try {
      const { question, sanitizedContext, documentTitle } = req.body;
      if (!question || !sanitizedContext) {
        return res.status(400).json({ error: 'Missing question or sanitized document context.' });
      }

      if (!geminiAI) {
        return res.status(503).json({
          error: 'Cloud reasoning is offline (GEMINI_API_KEY not configured). Local inference remains active.',
          isLocalFallback: true,
        });
      }

      const prompt = `You are SnapShield AI, a privacy-first document intelligence assistant running in Cloud Reasoning Mode.
IMPORTANT PRIVACY POLICY:
- The user has supplied a PRE-SANITIZED document where sensitive PII has already been redacted or masked.
- Do NOT fabricate or attempt to guess any redacted personal information.
- Provide a clear, precise, and professional answer based only on the available facts in the sanitized document.
- Never output speculative personal phone numbers, physical addresses, or ID credentials.

Document Title: ${documentTitle || 'Uploaded Document'}
Document Content (Privacy-Safe Sanitized):
"""
${sanitizedContext}
"""

User Question: ${question}

Please answer the question accurately and concisely:`;

      const response = await geminiAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        answer: response.text || 'No answer generated.',
        provider: 'GeminiProvider (Cloud AI - gemini-3.8-flash)',
        privacyMode: 'Sanitized Context Ingestion',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/qa:', error);
      return res.status(500).json({
        error: error.message || 'Failed to process cloud Q&A request.',
      });
    }
  });

  // Optional Cloud AI Summarization Endpoint
  app.post('/api/ai/summarize', async (req, res) => {
    try {
      const { sanitizedContext, documentTitle, summaryType } = req.body;
      if (!sanitizedContext) {
        return res.status(400).json({ error: 'Missing sanitized document context.' });
      }

      if (!geminiAI) {
        return res.status(503).json({
          error: 'Cloud reasoning is offline (GEMINI_API_KEY not configured). Local inference remains active.',
          isLocalFallback: true,
        });
      }

      const prompt = `You are SnapShield AI, a privacy-first document intelligence assistant running in Cloud Reasoning Mode.
TASK: Generate a privacy-safe executive summary of this document.

IMPORTANT PRIVACY RULES:
- The document has already had sensitive PII redacted (marked as [REDACTED] or masked).
- Under NO circumstance should any guessed, unmasked, or exposed PII appear in your summary.
- Focus on the document's purpose, key operational points, dates, obligations, and general structure.

Document Title: ${documentTitle || 'Document'}
Sanitized Content:
"""
${sanitizedContext}
"""

Format your response in Markdown with:
1. **Executive Overview**: High-level purpose (2-3 sentences).
2. **Key Topics & Findings**: 3-5 concise bullet points.
3. **Privacy & Redaction Note**: A 1-sentence confirmation of PII containment.`;

      const response = await geminiAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        summary: response.text || 'No summary generated.',
        provider: 'GeminiProvider (Cloud AI - gemini-3.8-flash)',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Error in /api/ai/summarize:', error);
      return res.status(500).json({
        error: error.message || 'Failed to process cloud summarization.',
      });
    }
  });

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, port: PORT, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SnapShield AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
