import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, Show, UserButton } from '@clerk/react';
import {
  Shield,
  Menu,
  X,
  MessageCircle,
  Search,
  Phone,
  BookOpen,
  User,
  FileText,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Shield },
  { path: '/chatbot', label: 'AI Assistant', icon: MessageCircle },
  { path: '/scam-detector', label: 'Scam Detector', icon: Search },
  { path: '/investment-shield', label: 'Investment Shield', icon: TrendingUp },

  { path: '/complaint-generator', label: 'Complaint Generator', icon: FileText },
  { path: '/emergency', label: 'Emergency', icon: Phone },
  { path: '/govt-portals', label: 'Govt Portals', icon: FileText },
  { path: '/learning', label: 'Learning', icon: BookOpen },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-xl border-b border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg group-hover:shadow-primary-500/25 transition-all">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl">
              <span className="gradient-text">CyberSathi</span>
              <span className="text-cyan-400"> AI</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <Link
              to="/cyber-score"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              My Score
            </Link>
            <Show when="signed-out">
              <SignInButton>
                <button className="flex items-center space-x-2 btn-primary text-sm">
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-dark-800 border-t border-dark-700">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400'
                      : 'text-gray-300 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-dark-700 pt-4 mt-4 space-y-2">
              <Link
                to="/cyber-score"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-dark-700 rounded-lg"
              >
                My Cyber Score
              </Link>
              <Show when="signed-out">
                <SignInButton>
                  <button className="w-full block px-4 py-3 btn-primary text-center">
                    Login / Register
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <div className="px-4 py-3">
                  <UserButton />
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
