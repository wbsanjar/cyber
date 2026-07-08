import { useState, useRef, useEffect } from 'react';
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'warning' | 'success' | 'info';
  riskScore?: number;
  suggestions?: string[];
  timestamp: Date;
}

const scamPatterns = {
  otp: {
    patterns: ['otp', 'one time password', 'otp share', 'otp dedo', 'otp batao'],
    risk: 95,
    response: {
      en: '🚨 HIGH RISK ALERT!\n\nThis appears to be an OTP scam. NEVER share your OTP with anyone - not even bank officials.\n\nWhat to do:\n1. Do NOT share the OTP\n2. Block the caller\n3. Report to 1930\n4. Check your bank account\n\nBank officials NEVER ask for OTP.',
      hi: '🚨 उच्च जोखिम अलर्ट!\n\nयह एक OTP स्कैम लग रहा है। अपना OTP किसी के साथ साझा न करें - बैंक कर्मचारियों से भी नहीं।\n\nक्या करें:\n1. OTP साझा न करें\n2. कॉलर को ब्लॉक करें\n3. 1930 पर रिपोर्ट करें\n4. अपना बैंक खाता चेक करें',
    },
  },
  kyc: {
    patterns: ['kyc', 'kyc update', 'kyc kare', 'kyc update kare', 'account band', 'account suspend', 'account block'],
    risk: 90,
    response: {
      en: '⚠️ KYC SCAM ALERT!\n\nFake KYC calls are very common. Banks never call for KYC over phone.\n\nWhat to check:\n1. Bank does not do KYC on calls\n2. Never click on KYC links from SMS\n3. Visit official bank branch or website\n4. Never share Aadhaar/PAN over phone',
      hi: '⚠️ KYC स्कैम अलर्ट!\n\nफर्जी KYC कॉल बहुत आम हैं। बैंक कभी भी फोन पर KYC नहीं करते।\n\nक्या चेक करें:\n1. बैंक कॉल पर KYC नहीं करता\n2. SMS से KYC लिंक पर क्लिक न करें\n3. आधिकारिक बैंक शाखा या वेबसाइट पर जाएं\n4. Aadhaar/PAN फोन पर साझा न करें',
    },
  },
  lottery: {
    patterns: ['lottery', 'lottery jeeta', 'prize', 'winner', 'award', 'price won', 'crorepati', 'lakhpati'],
    risk: 98,
    response: {
      en: '🎰 FAKE LOTTERY SCAM!\n\n100% SCAM ALERT!\n\nYou did NOT win any lottery. This is a classic fraud.\n\nWarning signs:\n1. You never entered any contest\n2. Asking for fees/charges to claim\n3. Poor English/spelling errors\n4. Urgent action demanded\n\nDo NOT pay any money or share documents.',
      hi: '🎰 फर्जी लॉटरी स्कैम!\n\n100% स्कैम अलर्ट!\n\nआपने कोई लॉटरी नहीं जीती। यह एक क्लासिक फ्रॉड है।\n\nचेतावनी के संकेत:\n1. आपने कोई प्रतियोगिता में भाग नहीं लिया\n2. पुरस्कार पाने के लिए शुल्क मांग रहे हैं\n3. गलत हिंदी/अंग्रेजी\n4. तत्काल कार्रवाई की मांग\n\nकोई भी पैसा न दें या दस्तावेज साझा न करें。',
    },
  },
  job: {
    patterns: ['job offer', 'online job', 'work from home', 'data entry job', 'job deposit', 'typing job', 'form filling'],
    risk: 85,
    response: {
      en: '💼 FAKE JOB SCAM!\n\nThis is likely a fake job offer scam.\n\nRed Flags:\n1. Asking for registration fees\n2. No proper company details\n3. WhatsApp/Telegram interviews only\n4. Too good to be true salary\n\nNever pay for jobs. Real companies pay YOU.',
      hi: '💼 फर्जी नौकरी स्कैम!\n\nयह फर्जी नौकरी ऑफर स्कैम हो सकता है।\n\nचेतावनी के संकेत:\n1. पंजीकरण शुल्क मांग रहे हैं\n2. कंपनी की जानकारी नहीं\n3. सिर्फ WhatsApp/Telegram पर साक्षात्कार\n4. बहुत अच्छी सैलरी\n\nनौकरी के लिए पैसे न दें। असली कंपनियां आपको पैसे देती हैं।',
    },
  },
  link: {
    patterns: ['click link', 'link pe click', 'link open', 'website visit', 'verify now', 'update now', 'link pay'],
    risk: 75,
    response: {
      en: '🔗 SUSPICIOUS LINK WARNING!\n\nBe very careful with links sent by unknown numbers.\n\nSafety tips:\n1. Never click unknown links\n2. Check URL before visiting\n3. Links may steal data or install malware',
      hi: '🔗 संदिग्ध लिंक चेतावनी!\n\nअज्ञात नंबरों से भेजे गए लिंक से बहुत सावधान रहें।\n\nसुरक्षा टिप्स:\n1. अज्ञात लिंक पर क्लिक न करें\n2. विज़िट करने से पहले URL जांचें\n3. लिंक डेटा चुरा सकते हैं या मैलवेयर इंस्टॉल कर सकते हैं',
    },
  },
  upi: {
    patterns: ['upi', 'payment', 'gpay', 'phonepe', 'paytm', 'transaction failed', 'refund', 'money back', 'double payment'],
    risk: 80,
    response: {
      en: '📱 UPI/Payment Scam Warning!\n\nCommon UPI fraud tactics detected:\n\nSafety measures:\n1. Never share UPI PIN\n2. Verify receiver before sending\n3. Check for screen share requests\n4. Fake "receive money" requests\n5. Always verify with official sources\n\nUse QR Scanner to verify UPI IDs.',
      hi: '📱 UPI/पेमेंट स्कैम चेतावनी!\n\nआम UPI फ्रॉड रणनीतियां पाई गईं:\n\nसुरक्षा उपाय:\n1. UPI PIN साझा न करें\n2. भेजने से पहले प्राप्तकर्ता सत्यापित करें\n3. स्क्रीन शेयर अनुरोधों की जांच करें\n4. फर्जी "पैसे प्राप्त करें" अनुरोध\n5. हमेशा आधिकारिक स्रोतों से सत्यापित करें\n\nUPI ID सत्यापित करने के लिए QR स्कैनर का उपयोग करें।',
    },
  },
  courier: {
    patterns: ['courier', 'parcel', 'package', 'customs', 'delivery', 'shipping', 'fedex', 'dhl'],
    risk: 70,
    response: {
      en: '📦 COURIER SCAM ALERT!\n\nFake courier/package scams are increasing.\n\nWarning signs:\n1. Unexpected international parcel\n2. Customs clearance fees\n3. Request for bank details\n4. Urgent payment needed\n\nYou never ordered? It is fake. Do NOT pay.',
      hi: '📦 कूरियर स्कैम अलर्ट!\n\nफर्जी कूरियर/पार्सल स्कैम बढ़ रहे हैं।\n\nचेतावनी के संकेत:\n1. अप्रत्याशित अंतरराष्ट्रीय पार्सल\n2. कस्टम्स क्लीयरेंस शुल्क\n3. बैंक विवरण का अनुरोध\n4. तत्काल भुगतान की आवश्यकता\n\nआपने कभी ऑर्डर नहीं किया? यह फर्जी है। पेमेंट न करें।',
    },
  },
};

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: '🙏 Namaste! Main CyberSathi AI hoon.\n\nAap mujhse Hindi, English ya Hinglish mein baat kar sakte hain.\n\nMain aapki cyber fraud related problems solve karne me madad karunga.\n\nAapko kya help chahiye?',
    type: 'text',
        suggestions: ['OTR call aaya', 'Fake KYC call', 'Lottery scam', 'UPI fraud hua', 'Job scam'],
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectLanguage = (text: string): 'hi' | 'en' | 'hinglish' => {
    const hindiChars = /[\u0900-\u097F]/;
    if (hindiChars.test(text)) return 'hi';
    const hinglishPatterns = ['kya', 'hai', 'kare', 'karo', 'bataye', 'batao', 'dedo', 'chahiye'];
    const lowerText = text.toLowerCase();
    if (hinglishPatterns.some(p => lowerText.includes(p))) return 'hinglish';
    return 'en';
  };

  const analyzeMessage = (text: string): { risk: number; response: string; type: Message['type'] } => {
    const lowerText = text.toLowerCase();
    const lang = detectLanguage(text);

    for (const [, data] of Object.entries(scamPatterns)) {
      if (data.patterns.some(p => lowerText.includes(p))) {
        return {
          risk: data.risk,
          response: lang === 'hi' ? data.response.hi : data.response.en,
          type: data.risk > 80 ? 'warning' : 'info',
        };
      }
    }

    const generalResponses = {
      en: 'Thank you for sharing. Could you provide more details about what happened? For example:\n\n1. Did someone call you asking for OTP?\n2. Did you receive a suspicious link?\n3. Did you lose money in a transaction?\n4. Is there a fake job offer?\n\nI am here to help you stay safe.',
      hi: 'बात साझा करने के लिए धन्यवाद। क्या आप और विवरण दे सकते हैं? उदाहरण के लिए:\n\n1. क्या किसी ने आपको OTP मांगने के लिए कॉल किया?\n2. क्या आपको कोई संदिग्ध लिंक मिला?\n3. क्या आप लेनदेन में पैसे खो गए?\n4. क्या कोई फर्जी नौकरी ऑफर है?\n\nमैं आपको सुरक्षित रखने में मदद करने के लिए यहां हूं।',
      hinglish: 'Aapki baat samajh aa gayi. Thoda aur detail mein batayein:\n\n1. Kya kisi ne OTP maanga?\n2. Kya koi suspicious link aaya?\n3. Kya transaction mein paise kat gaye?\n4. Koi fake job offer hai kya?\n\nMain yahan hoon aapki madad ke liye.',
    };

    return {
      risk: 0,
      response: generalResponses[lang],
      type: 'text',
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const analysis = analyzeMessage(input);
      const suggestions = [
        'Report karein',
        'Emergency 1930',
        'Naya sawaal',
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis.response,
        type: analysis.type,
        riskScore: analysis.risk,
        suggestions: analysis.risk > 0 ? suggestions : undefined,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
            AI chatbot jo aapki cyber fraud queries ka jawab deta hai
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
              placeholder="Apna sawaal likhein... / Type your question..."
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
            {['OTP call aaya', 'Fake link check', 'UPI fraud', 'KYC scam', 'Job scam'].map((q) => (
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
