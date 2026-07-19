import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { fraud_type, description, amount, date, evidence } = req.body;

    if (!fraud_type || !description) {
      return res.status(400).json({ error: 'fraud_type and description are required' });
    }

    const report = {
      id: uuidv4(),
      user_id: req.body.user_id || 'anonymous',
      fraud_type,
      description,
      amount: amount || 0,
      date: date || new Date().toISOString(),
      status: 'pending' as const,
      risk_score: req.body.risk_score || 0,
      evidence: evidence || [],
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('fraud_reports')
      .insert(report)
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save fraud report' });
    }

    res.status(201).json(data);
  } catch (err) {
    console.error('Fraud report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('fraud_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch fraud reports' });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Fetch fraud reports error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('fraud_reports')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Fraud report not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('Fetch fraud report error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
