import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import fraudReportsRouter from './routes/fraudReports.js';
import complaintsRouter from './routes/complaints.js';
import chatHistoryRouter from './routes/chatHistory.js';
import scamAlertsRouter from './routes/scamAlerts.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/chat', chatRouter);
app.use('/api/fraud-reports', fraudReportsRouter);
app.use('/api/complaints', complaintsRouter);
app.use('/api/chat-history', chatHistoryRouter);
app.use('/api/scam-alerts', scamAlertsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CyberSathi API server running on http://localhost:${PORT}`);
});
