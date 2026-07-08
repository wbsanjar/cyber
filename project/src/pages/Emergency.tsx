import { useState } from 'react';
import {
  Phone,
  Shield,
  MapPin,
  AlertTriangle,
  FileText,
  ExternalLink,
  Clock,
  Building,
  Copy,
  CheckCircle,
} from 'lucide-react';

const emergencyContacts = [
  { name: 'Cyber Crime Helpline', number: '1930', description: 'National Cyber Crime Reporting', color: 'red' },
  { name: 'Police Emergency', number: '100', description: 'Immediate police assistance', color: 'blue' },
  { name: 'Women Helpline', number: '181', description: 'Women safety & support', color: 'pink' },
  { name: 'Child Helpline', number: '1098', description: 'Child abuse & protection', color: 'yellow' },
];

const policeStations = [
  { name: 'Cyber Crime Police Station', address: 'Bhopal, MP', phone: '0755-2762345', distance: '5.2 km' },
  { name: 'Central Police Station', address: 'Indore, MP', phone: '0731-2542111', distance: '3.8 km' },
  { name: 'Mahila Thana', address: 'Jabalpur, MP', phone: '0761-2623456', distance: '2.1 km' },
];

const firSteps = [
  { step: 1, title: 'Gather Evidence', description: 'Collect screenshots, messages, call logs, transaction details' },
  { step: 2, title: 'Note Details', description: 'Write down dates, times, amounts, fraudster details' },
  { step: 3, title: 'Visit Police Station', description: 'Go to nearest PS or Cyber Crime Cell' },
  { step: 4, title: 'File FIR', description: 'Submit complaint with all evidence' },
  { step: 5, title: 'Get Receipt', description: 'Take FIR copy and acknowledgment number' },
  { step: 6, title: 'Follow Up', description: 'Track status using acknowledgment number' },
];

const quickActions = [
  { title: 'Block UPI', description: 'Call your bank or use banking app', icon: Shield },
  { title: 'Freeze Account', description: 'Prevent further transactions', icon: AlertTriangle },
  { title: 'Change Passwords', description: 'Update all sensitive passwords', icon: Shield },
  { title: 'Inform Bank', description: 'Report fraud to your bank', icon: Building },
];

export default function Emergency() {
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  const copyNumber = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">Emergency Help</h1>
              <p className="text-sm text-gray-400">Immediate assistance for cyber fraud</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-xl mx-auto">
            Agar aap cyber fraud ka shikar ho gaye hain, turant yahan se help lein.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="card border-2 border-red-500/30 bg-red-500/5 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-semibold text-white">Emergency Hotlines</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div
                    key={contact.number}
                    className="flex items-center justify-between p-4 bg-dark-800 rounded-xl hover:bg-dark-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/10 animate-glow-pulse"
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div>
                      <p className="font-medium text-white">{contact.name}</p>
                      <p className="text-sm text-gray-400">{contact.description}</p>
                    </div>
                    <div className="text-right">
                      <a
                        href={`tel:${contact.number}`}
                        className="flex items-center gap-2 text-2xl font-mono font-bold text-white hover:text-primary-400 transition-colors"
                      >
                        <Phone className="w-5 h-5 text-red-400" />
                        {contact.number}
                      </a>
                      <button
                        onClick={() => copyNumber(contact.number)}
                        className="text-xs text-gray-400 hover:text-primary-400 flex items-center gap-1 mt-1"
                      >
                        {copiedNumber === contact.number ? (
                          <><CheckCircle className="w-3 h-3" /> Copied!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={i}
                      className="flex items-center gap-3 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary-500/10 text-left animate-scale-in"
                      style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{action.title}</p>
                        <p className="text-sm text-gray-400">{action.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">FIR Filing Guide</h2>
              </div>
              <div className="space-y-3">
                {firSteps.map((step) => (
                  <div key={step.step} className="flex items-start gap-4 animate-step-in" style={{ animationDelay: `${0.5 + step.step * 0.1}s` }}>
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500/30">
                      <span className="text-sm font-semibold text-primary-400">{step.step}</span>
                    </div>
                    <div className="flex-1 pb-3 border-b border-dark-700 last:border-b-0">
                      <p className="font-medium text-white">{step.title}</p>
                      <p className="text-sm text-gray-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card animate-slide-left" style={{ animationDelay: '0.15s' }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Nearby Police Stations</h2>
              </div>
              <div className="space-y-3">
                {policeStations.map((station, i) => (
                  <div key={i} className="p-4 bg-dark-700 rounded-xl transition-all duration-300 hover:bg-dark-600 hover:scale-[1.02] hover:shadow-lg animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <p className="font-medium text-white mb-1">{station.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {station.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" /> {station.address}
                      </span>
                    </div>
                    <a
                      href={`tel:${station.phone}`}
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-all duration-300 hover:translate-x-1"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{station.phone}</span>
                    </a>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 btn-secondary flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-[1.02]">
                <MapPin className="w-4 h-4" /> View on Map
              </button>
            </div>

            <div className="card animate-slide-left" style={{ animationDelay: '0.25s' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary-400" />
                <h2 className="text-lg font-semibold text-white">Important Links</h2>
              </div>
              <div className="space-y-3">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-300 hover:scale-[1.02] hover:translate-x-1 animate-fade-in-up"
                  style={{ animationDelay: '0.4s' }}
                >
                  <span className="text-gray-300">Cyber Crime Portal</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.sbi.co.in/web/customer-care/grievance-redressal-mechanism"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-300 hover:scale-[1.02] hover:translate-x-1 animate-fade-in-up"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="text-gray-300">Bank Grievance</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <a
                  href="https://www.rbi.org.in/commonman/English/scripts/againstcommon.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-300 hover:scale-[1.02] hover:translate-x-1 animate-fade-in-up"
                  style={{ animationDelay: '0.6s' }}
                >
                  <span className="text-gray-300">RBI Complaint</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            <div className="card bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 animate-slide-left" style={{ animationDelay: '0.35s' }}>
              <h3 className="font-semibold text-white mb-3">Remember</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 transition-all duration-300 hover:scale-125 hover:text-amber-300" />
                  <span>Call 1930 within 24 hours</span>
                </li>
                <li className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 transition-all duration-300 hover:scale-125 hover:text-amber-300" />
                  <span>Keep all evidence safe</span>
                </li>
                <li className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 transition-all duration-300 hover:scale-125 hover:text-amber-300" />
                  <span>Don't delete any messages</span>
                </li>
                <li className="flex items-start gap-2 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5 transition-all duration-300 hover:scale-125 hover:text-amber-300" />
                  <span>Block fraudster's number</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
