import { useState } from 'react';
import {
  BookOpen,
  Trophy,
  CheckCircle,
  XCircle,
  Lightbulb,
  AlertTriangle,
  Shield,
  ArrowRight,
  Target,
  Award,
} from 'lucide-react';

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  lessons: number;
  duration: string;
  quizzes: Quiz[];
}

const modules: Module[] = [
  {
    id: 'otp-safety',
    title: 'OTP Safety',
    description: 'When should you share OTP and when you should not',
    category: 'Banking Security',
    icon: '🔐',
    lessons: 5,
    duration: '15 min',
    quizzes: [
      {
        id: 'q1',
        question: 'What should you do if a bank official asks for OTP?',
        options: ['Share the OTP', 'Do not share the OTP', 'Send OTP via email', 'Share OTP on WhatsApp'],
        correct: 1,
        explanation: 'Bank officials never ask for OTP. This is a scam!',
      },
      {
        id: 'q2',
        question: 'How many people should you share OTP with?',
        options: ['Family members', 'Bank staff', 'Police', 'Nobody'],
        correct: 3,
        explanation: 'OTP should not be shared with anyone, whether a family member or bank staff.',
      },
    ],
  },
  {
    id: 'phishing',
    title: 'Phishing Awareness',
    description: 'Identify fake emails and websites',
    category: 'Online Safety',
    icon: '🎣',
    lessons: 4,
    duration: '10 min',
    quizzes: [
      {
        id: 'q1',
        question: 'Email has a "Click here to verify account" link. What should you do?',
        options: ['Click on it', 'Hover over the link to check', 'Reply to it', 'Forward it'],
        correct: 1,
        explanation: 'Hover over the link to check the actual URL. Fake links often have spelling errors or suspicious domains.',
      },
    ],
  },
  {
    id: 'upi-safety',
    title: 'UPI Safety',
    description: 'How to stay safe in UPI payments',
    category: 'Payment Security',
    icon: '💳',
    lessons: 6,
    duration: '20 min',
    quizzes: [
      {
        id: 'q1',
        question: 'If someone asks you to open the app to "Receive money", what should you do?',
        options: ['Open the app', 'Verify the number', 'Ignore it', 'Share OTP'],
        correct: 2,
        explanation: 'You do not need to open the app to "Receive money". This is a scam!',
      },
    ],
  },
];

const tips = [
  { title: 'Bank Call Received?', tip: 'Banks never ask for OTP. Do not share details on calls.', severity: 'high' },
  { title: 'Link Received?', tip: 'Hover over to check the URL. Do not click on suspicious links.', severity: 'medium' },
  { title: 'QR Scan Request?', tip: 'Scan QR for payment only. Not for "Receive" requests.', severity: 'high' },
  { title: 'Job Offer?', tip: 'Jobs never require upfront payment. Registration fees are fake.', severity: 'high' },
];

const fakeVsReal = [
  { type: 'Website URL', fake: 'paytm-verify.xyz', real: 'paytm.com', indicator: 'Extra words & wrong domain' },
  { type: 'Email Address', fake: 'support@paytm-alert.com', real: 'noreply@paytm.com', indicator: 'Different domain' },
  { type: 'Phone Number', fake: 'Call from mobile number', real: 'Official helpline', indicator: 'Banks use landlines' },
  { type: 'WhatsApp Message', fake: 'From unknown number', real: 'Verified business account', indicator: 'Check for green tick' },
];

export default function LearningCenter() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);

  const startQuiz = (module: Module) => {
    setSelectedModule(module);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
    if (index === selectedModule?.quizzes[currentQuiz].correct) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuiz < (selectedModule?.quizzes.length || 0) - 1) {
      setCurrentQuiz(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const closeQuiz = () => {
    setSelectedModule(null);
    setCurrentQuiz(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">Learning Center</h1>
              <p className="text-sm text-gray-400">Cyber safety awareness & quizzes</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Learn tips to stay safe from cyber fraud, attempt quizzes, and improve your safety score.
          </p>
        </div>

        {selectedModule && (
          <div className="fixed inset-0 z-50 bg-dark-900/95 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
              {quizComplete ? (
                <div className="card text-center p-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center mb-6">
                    <Trophy className="w-10 h-10 text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
                  <p className="text-gray-400 mb-6">
                    Your score: {score} / {selectedModule.quizzes.length}
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary-400">
                        {Math.round((score / selectedModule.quizzes.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-400">Score</div>
                    </div>
                  </div>
                  {score === selectedModule.quizzes.length ? (
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 mb-6">
                      <p className="text-green-400 font-medium">Perfect Score! 🎉</p>
                      <p className="text-sm text-gray-400">You are an expert on this topic!</p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6">
                      <p className="text-amber-400 font-medium">Keep Learning!</p>
                      <p className="text-sm text-gray-400">Try once more.</p>
                    </div>
                  )}
                  <button onClick={closeQuiz} className="btn-primary">
                    Back to Modules
                  </button>
                </div>
              ) : (
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{selectedModule.icon}</span>
                      <div>
                        <h2 className="text-lg font-semibold text-white">{selectedModule.title}</h2>
                        <p className="text-sm text-gray-400">Question {currentQuiz + 1} of {selectedModule.quizzes.length}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Score</p>
                      <p className="text-lg font-bold text-primary-400">{score}/{currentQuiz + (showResult ? 1 : 0)}</p>
                    </div>
                  </div>

                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all"
                      style={{ width: `${((currentQuiz + (showResult ? 1 : 0)) / selectedModule.quizzes.length) * 100}%` }}
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-xl text-white mb-6">{selectedModule.quizzes[currentQuiz].question}</p>
                    <div className="space-y-3">
                      {selectedModule.quizzes[currentQuiz].options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => !showResult && handleAnswer(i)}
                          disabled={showResult}
                          className={`w-full p-4 rounded-xl text-left transition-all ${
                            showResult
                              ? i === selectedModule.quizzes[currentQuiz].correct
                                ? 'bg-green-500/20 border-2 border-green-500'
                                : i === selectedAnswer
                                  ? 'bg-red-500/20 border-2 border-red-500'
                                  : 'bg-dark-700'
                              : selectedAnswer === i
                                ? 'bg-primary-500/20 border-2 border-primary-500'
                                : 'bg-dark-700 hover:bg-dark-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className={showResult && i === selectedModule.quizzes[currentQuiz].correct ? 'text-green-400' : 'text-gray-300'}>
                              {option}
                            </span>
                            {showResult && i === selectedModule.quizzes[currentQuiz].correct && (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            )}
                            {showResult && i === selectedAnswer && i !== selectedModule.quizzes[currentQuiz].correct && (
                              <XCircle className="w-5 h-5 text-red-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {showResult && (
                    <div className={`p-4 rounded-xl mb-6 ${
                      selectedAnswer === selectedModule.quizzes[currentQuiz].correct
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      <p className={`font-medium mb-1 ${
                        selectedAnswer === selectedModule.quizzes[currentQuiz].correct ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {selectedAnswer === selectedModule.quizzes[currentQuiz].correct ? 'Correct! ✓' : 'Incorrect! ✗'}
                      </p>
                      <p className="text-sm text-gray-300">{selectedModule.quizzes[currentQuiz].explanation}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={closeQuiz} className="btn-secondary">
                      Exit Quiz
                    </button>
                    {showResult && (
                      <button onClick={nextQuestion} className="btn-primary flex items-center gap-2">
                        {currentQuiz < selectedModule.quizzes.length - 1 ? (
                          <>Next <ArrowRight className="w-4 h-4" /></>
                        ) : (
                          'See Results'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {modules.map((module) => (
              <div key={module.id} className="card-hover">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{module.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white">{module.title}</h3>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{module.lessons} lessons</span>
                  <span>{module.duration}</span>
                  <span className="px-2 py-1 bg-dark-700 rounded">{module.category}</span>
                </div>
                <button
                  onClick={() => startQuiz(module)}
                  className="w-full btn-primary flex items-center justify-center gap-2 text-sm"
                >
                  <Target className="w-4 h-4" />
                  Start Quiz
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Quick Tips</h3>
              </div>
              <div className="space-y-3">
                {tips.map((tip, i) => (
                  <div key={i} className="p-3 bg-dark-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className={`w-4 h-4 ${tip.severity === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                      <span className="text-sm font-medium text-white">{tip.title}</span>
                    </div>
                    <p className="text-xs text-gray-400">{tip.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary-400" />
                <h3 className="font-semibold text-white">Your Progress</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Quizzes Completed</span>
                    <span className="text-sm font-medium text-white">0/3</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '0%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400">Average Score</span>
                    <span className="text-sm font-medium text-white">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Fake vs Real</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-dark-700">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Fake Example</th>
                  <th className="pb-3">Real Example</th>
                  <th className="pb-3">How to Identify</th>
                </tr>
              </thead>
              <tbody>
                {fakeVsReal.map((item, i) => (
                  <tr key={i} className="border-b border-dark-700 last:border-b-0">
                    <td className="py-4 text-gray-300">{item.type}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm">{item.fake}</span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">{item.real}</span>
                    </td>
                    <td className="py-4 text-sm text-gray-400">{item.indicator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
