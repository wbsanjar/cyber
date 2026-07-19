import { Router, Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('scam_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Supabase fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch scam alerts' });
    }

    res.json(data || []);
  } catch (err) {
    console.error('Scam alerts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/check', async (req: Request, res: Response) => {
  try {
    const { text, url } = req.body;

    if (!text && !url) {
      return res.status(400).json({ error: 'text or url is required' });
    }

    const query = text || url;

    const { data, error } = await supabase
      .from('scam_alerts')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) {
      console.error('Supabase search error:', error);
      return res.status(500).json({ error: 'Failed to check scam alerts' });
    }

    const isScam = data && data.length > 0;
    res.json({
      isScam,
      matches: data || [],
      riskLevel: isScam ? (data![0].severity === 'high' ? 85 : data![0].severity === 'medium' ? 55 : 25) : 0,
    });
  } catch (err) {
    console.error('Scam check error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
