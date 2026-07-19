import { Link } from 'react-router-dom';
import {
  Shield,
  MessageCircle,
  Search,
  QrCode,
  AlertTriangle,
  Phone,
  BookOpen,
  TrendingUp,
  MapPin,
  ArrowRight,
  Zap,
  Lock,
  Eye,
  Smartphone,
  Clock,
  ChevronRight,
} from 'lucide-react';
import CyberFraudAnimation from '../components/CyberFraudAnimation';

const features = [
  {
    icon: MessageCircle,
    title: 'AI Chatbot',
    description: 'Talk in Hindi, English, or Hinglish. AI will understand your problem and provide an instant solution.',
    path: '/chatbot',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Search,
    title: 'Scam Detector',
    description: 'Upload screenshots, SMS, or emails. AI will detect fake links, OTP scams, and frauds.',
    path: '/scam-detector',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: QrCode,
    title: 'QR Scanner',
    description: 'Scan QR codes. Verify UPI ID to stay safe from fake QR codes.',
    path: '/qr-scanner',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BookOpen,
    title: 'Learning Center',
    description: 'Daily quizzes, awareness tips, and learn to identify fake vs real examples.',
    path: '/learning',
    color: 'from-amber-500 to-orange-500',
  },
];

const scamTypes = [
  { name: 'UPI Fraud', count: 1234, trend: '+12%' },
  { name: 'OTP Scam', count: 856, trend: '+8%' },
  { name: 'KYC Scam', count: 654, trend: '+5%' },
  { name: 'Job Scam', count: 432, trend: '+15%' },
  { name: 'Lottery Scam', count: 321, trend: '+3%' },
];

const liveAlerts = [
  { city: 'Bhopal', count: 45, level: 'high' },
  { city: 'Indore', count: 38, level: 'medium' },
  { city: 'Jabalpur', count: 22, level: 'medium' },
  { city: 'Gwalior', count: 15, level: 'low' },
  { city: 'Ujjain', count: 12, level: 'low' },
];

const stats = [
  { label: 'Frauds Detected', value: '15,000+', icon: Shield },
  { label: 'Reports Filed', value: '8,500+', icon: AlertTriangle },
  { label: 'Users Protected', value: '50,000+', icon: Lock },
  { label: 'Avg Response', value: '< 2 min', icon: Clock },
];

export default function Home() {


  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slow delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-600/20 border border-primary-500/30">
                <Zap className="w-4 h-4 text-primary-400" />
                <span className="text-primary-300 text-sm font-medium">AI-Powered Cyber Protection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold tracking-tight">
                <span className="text-white">Stay </span>
                <span className="gradient-text">Protected</span>
                <br />
                <span className="text-white">from Cyber Fraud with AI</span>
              </h1>

              <p className="max-w-xl text-lg sm:text-xl text-gray-300 leading-relaxed">
                Chat with AI, detect scams, report frauds. Hindi, English, or Hinglish - whatever suits you best.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/chatbot" className="btn-primary text-lg flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat with AI</span>
                </Link>
                <Link to="/scam-detector" className="btn-secondary text-lg flex items-center justify-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Report Fraud</span>
                </Link>
              </div>

              <div className="flex gap-8 pt-4">
                <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-cyber-danger" />
                  <span className="font-mono font-bold">1930</span>
                  <span className="text-sm">Emergency</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <CyberFraudAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-dark-800 border-y border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-600/20 mb-3">
                    <Icon className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="text-3xl font-display font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              AI-powered tools that will protect you from cyber frauds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={i}
                  to={feature.path}
                  className="card-hover group"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary-400 text-sm font-medium group-hover:gap-3 gap-2 transition-all">
                    <span>Try Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Scam Map & Alerts */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Live Scam Alerts */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Live Scam Alerts</h3>
                    <p className="text-sm text-gray-400">Madhya Pradesh</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-gray-400">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                {liveAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-700/50"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className={`w-4 h-4 ${
                        alert.level === 'high' ? 'text-red-400' :
                        alert.level === 'medium' ? 'text-amber-400' : 'text-green-400'
                      }`} />
                      <span className="text-white font-medium">{alert.city}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">{alert.count} scams</span>
                      <div className={`w-2 h-2 rounded-full ${
                        alert.level === 'high' ? 'bg-red-500' :
                        alert.level === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Scam Types */}
            <div className="card">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Top Scam Types</h3>
                  <p className="text-sm text-gray-400">This month</p>
                </div>
              </div>

              <div className="space-y-4">
                {scamTypes.map((scam, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-300">{scam.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{scam.count.toLocaleString()}</span>
                        <span className="text-red-400 text-xs">{scam.trend}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-cyan-500 rounded-full"
                        style={{ width: `${(scam.count / 1234) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-20 bg-gradient-to-b from-dark-900 to-red-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
              Emergency Assistance
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              If you have been a victim of cyber fraud, get immediate help
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="tel:1930"
              className="card-hover group text-center p-8 bg-red-600/20 border-red-500/30"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-4 group-hover:bg-red-500/30 transition-colors">
                <Phone className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Call 1930</h3>
              <p className="text-gray-400 text-sm">National Cyber Crime Helpline</p>
              <span className="font-mono text-2xl font-bold text-red-400 block mt-4">1930</span>
            </a>

            <Link
              to="/emergency"
              className="card-hover group text-center p-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-primary-500/20 flex items-center justify-center mb-4 group-hover:bg-primary-500/30 transition-colors">
                <Shield className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Emergency Actions</h3>
              <p className="text-gray-400 text-sm">Police stations, FIR guide, contacts</p>
              <ChevronRight className="w-5 h-5 text-primary-400 mx-auto mt-4" />
            </Link>

            <Link
              to="/scam-detector"
              className="card-hover group text-center p-8"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Report Fraud</h3>
              <p className="text-gray-400 text-sm">AI-powered complaint filing</p>
              <ChevronRight className="w-5 h-5 text-amber-400 mx-auto mt-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News/Alerts */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-white">Latest Alerts</h2>
            <Link to="/learning" className="text-primary-400 hover:text-primary-300 text-sm flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="card group cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-md bg-red-500/20 text-red-400 text-xs font-medium">Critical</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <h3 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors">
                New Fake Bank Call Scam Active in MP
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                Scammers posing as bank officials asking for OTP. Don't share any details.
              </p>
            </div>

            <div className="card group cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-medium">Warning</span>
                <span className="text-xs text-gray-500">5 hours ago</span>
              </div>
              <h3 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors">
                RBI Alert: Never Share CVV or OTP
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                RBI issues fresh advisory about sharing card details on calls.
              </p>
            </div>

            <div className="card group cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs font-medium">Info</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <h3 className="text-white font-medium mb-2 group-hover:text-primary-400 transition-colors">
                Free Government Scheme Scam Detected
              </h3>
              <p className="text-gray-400 text-sm line-clamp-2">
                Fraudulent messages about PM Kisan Yojana payment circulating.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-dark-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card p-8 sm:p-12 bg-gradient-to-br from-primary-600/20 to-cyan-600/20 border-primary-500/30">
            <Smartphone className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-4">
              Check Your Cyber Safety Score
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Password strength, 2FA settings, device security - check everything and know your safety score
            </p>
            <Link to="/cyber-score" className="btn-primary inline-flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span>Check My Score</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
