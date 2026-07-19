import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import ScamDetector from './pages/ScamDetector';
import QRScanner from './pages/QRScanner';

import Emergency from './pages/Emergency';
import GovtPortals from './pages/GovtPortals';
import LearningCenter from './pages/LearningCenter';
import Login from './pages/Login';
import CyberScore from './pages/CyberScore';
import ComplaintGenerator from './pages/ComplaintGenerator';
import InvestmentShield from './pages/InvestmentShield';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="scam-detector" element={<ScamDetector />} />
          <Route path="qr-scanner" element={<QRScanner />} />

          <Route path="emergency" element={<Emergency />} />
          <Route path="learning" element={<LearningCenter />} />
          <Route path="cyber-score" element={<CyberScore />} />
          <Route path="login" element={<Login />} />
          <Route path="complaint-generator" element={<ComplaintGenerator />} />
          <Route path="investment-shield" element={<InvestmentShield />} />
          <Route path="govt-portals" element={<GovtPortals />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
