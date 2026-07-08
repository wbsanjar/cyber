import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-lg gradient-text">CyberSathi AI</span>
                <p className="text-xs text-gray-400">Cyber Fraud Protection</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-powered cyber fraud detection and protection assistant for Indian citizens.
              Report scams, detect frauds, and stay safe online.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/chatbot" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">AI Chatbot</Link></li>
              <li><Link to="/scam-detector" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Scam Detector</Link></li>
              <li><Link to="/qr-scanner" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">QR Scanner</Link></li>
              <li><Link to="/report-fraud" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Report Fraud</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/learning" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Learning Center</Link></li>
              <li><Link to="/cyber-score" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Cyber Safety Score</Link></li>
              <li><Link to="/emergency" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">Emergency Help</Link></li>
              <li>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors text-sm flex items-center gap-1">
                  Cyber Crime Portal <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Emergency Contacts</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-cyber-danger" />
                <span className="font-mono font-semibold text-white">1930</span>
                <span>- Cyber Crime</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="font-mono font-semibold text-white">100</span>
                <span>- Police</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary-400" />
                <span>help@cybersathi.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © 2024 CyberSathi AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-500 hover:text-primary-400 transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
