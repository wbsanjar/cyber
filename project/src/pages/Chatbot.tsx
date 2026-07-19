import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';

const API_BASE = '/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'warning' | 'success' | 'info';
  riskScore?: number;
  suggestions?: string[];
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I am CyberSathi AI.\n\nYou can talk to me in Hindi, English, or Hinglish.\n\nI will help you solve cyber fraud related problems.\n\nHow can I help you?',
    type: 'text',
        suggestions: ['Received OTP call', 'Fake KYC call', 'Lottery scam', 'UPI fraud happened', 'Job scam'],
    timestamp: new Date(),
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).slice(2)
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveChatHistory = useCallback(async (msgs: Message[]) => {
    try {
      await fetch(`${API_BASE}/chat-history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionIdRef.current,
          messages: msgs.map(m => ({ role: m.role, content: m.content })),
        }),
      });
    } catch {
      // silently fail — history saving is non-critical
    }
  }, []);

  const callChatApi = async (userMessage: string, history: Message[]) => {
    const messagesPayload = history.slice(-10).map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));
    messagesPayload.push({ role: 'user', content: userMessage });

    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: messagesPayload }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return res.json();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const data = await callChatApi(currentInput, messages);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content,
        type: data.type || 'text',
        riskScore: data.riskScore > 0 ? data.riskScore : undefined,
        suggestions: data.suggestions,
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch {
      const fallback: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I am unable to respond right now. Please try again later. If it is an emergency, call 1930.',
        type: 'text',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallback]);
    }

    setIsTyping(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const toggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 5000);
    }
  };

  const speakMessage = (content: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(content.replace(/[\uD800-\uDFFF]|[\u200B-\u20FF]/g, ''));
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'info': return <Shield className="w-5 h-5 text-blue-400" />;
      default: return <Bot className="w-5 h-5 text-primary-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col p-4">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">CyberSathi AI</h1>
              <p className="text-sm text-gray-400">Hindi • English • Hinglish</p>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            AI chatbot that answers your cyber fraud queries
          </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center flex-shrink-0">
                  {getMessageIcon(msg.type)}
                </div>
              )}

              <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : msg.type === 'warning'
                      ? 'bg-amber-500/10 border border-amber-500/30 text-white'
                      : 'bg-dark-700 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                </div>

                {msg.riskScore && msg.riskScore > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Risk Score:</span>
                    <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden max-w-32">
                      <div
                        className={`h-full rounded-full ${
                          msg.riskScore > 80 ? 'bg-red-500' :
                          msg.riskScore > 50 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${msg.riskScore}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      msg.riskScore > 80 ? 'text-red-400' :
                      msg.riskScore > 50 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {msg.riskScore}%
                    </span>
                  </div>
                )}

                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="px-3 py-1.5 rounded-lg bg-dark-600 text-gray-300 text-xs hover:bg-dark-500 hover:text-white transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speakMessage(msg.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-gray-500 hover:text-gray-400 transition-colors"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    <span>Listen</span>
                  </button>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-400" />
              </div>
              <div className="bg-dark-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-dark-700 pt-4">
          <div className="flex gap-2">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="p-3 rounded-xl bg-primary-600 text-white hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {['Received OTP call', 'Check fake link', 'UPI fraud', 'KYC scam', 'Job scam'].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="px-3 py-1.5 rounded-lg bg-dark-700 text-gray-300 text-xs hover:bg-dark-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
