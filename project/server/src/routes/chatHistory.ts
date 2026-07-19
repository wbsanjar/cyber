import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages, session_id } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const sid = session_id || uuidv4();

    const chatRecords = messages.map((msg: { role: string; content: string }) => ({
      id: uuidv4(),
      session_id: sid,
      role: msg.role,
      content: msg.content,
      created_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('chat_history')
      .insert(chatRecords)
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save chat history' });
    }

    res.status(201).json({ session_id: sid, count: data.length });
  } catch (err) {
    console.error('Chat history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:session_id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('session_id', req.params.session_id)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch chat history' });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Fetch chat history error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
