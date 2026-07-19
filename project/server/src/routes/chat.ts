import { Router, Request, Response } from 'express';

const router = Router();

const SYSTEM_PROMPT = `You are CyberSathi AI, a helpful cybersecurity assistant for Indian users. You speak Hindi, English, and Hinglish.

Your role:
- Help users identify cyber fraud, scams, and phishing
- Provide step-by-step safety guidance
- Explain how to report cyber crimes (1930 helpline, cybercrime.gov.in)
- Give risk assessments of suspicious messages, calls, links, etc.
- Educate users about digital safety

Keep responses:
- Clear and practical
- Respond in the same language as the user (Hindi/English/Hinglish)
- Actionable with specific steps
- Empathetic and non-judgmental
- Concise but thorough

Important numbers: 1930 (National Cyber Crime Helpline), cybercrime.gov.in (reporting portal)

Give a risk score (0-100) at the end of your response in format: [RISK: number]

If the user wants to:
- Report a fraud: Tell them you can help and ask for details, then say you will save the report
- Check a scam link/message: Analyze it and give a risk score
- Generate a complaint: Ask for details and say you'll generate it
- Save chat: Tell them it will be saved automatically`;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const openrouterMessages = messages.slice(-10).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    openrouterMessages.unshift({ role: 'system', content: SYSTEM_PROMPT });

    const apiRes = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.VITE_OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-001',
          messages: openrouterMessages,
        }),
      }
    );

    if (!apiRes.ok) {
      const errorText = await apiRes.text();
      console.error('OpenRouter API error:', apiRes.status, errorText);
      return res.status(apiRes.status).json({ error: 'OpenRouter API error', detail: errorText });
    }

    const data = await apiRes.json();
    const content = data.choices?.[0]?.message?.content || 'Sorry, I could not process that.';

    const riskMatch = content.match(/\[RISK:\s*(\d+)\]/);
    const riskScore = riskMatch ? parseInt(riskMatch[1]) : 0;
    const cleanContent = content.replace(/\[RISK:\s*\d+\]/, '').trim();

    res.json({
      content: cleanContent,
      riskScore,
      type: riskScore > 70 ? 'warning' : riskScore > 0 ? 'info' : 'text',
      suggestions: riskScore > 0
        ? ['Report it', 'Emergency 1930', 'Ask another question']
        : undefined,
    });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({
      error: 'Chat service unavailable',
      content: 'Sorry, I am unable to respond right now. Please try again later.',
      riskScore: 0,
      type: 'text',
    });
  }
});

export default router;
