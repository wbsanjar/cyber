import { ExternalLink, Shield, Building, Scale, BookOpen, GraduationCap, Heart, FileText, Users, Landmark, Globe, Search } from 'lucide-react';

const portalCategories = [
  {
    title: 'Cyber Crime & Security',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    portals: [
      { name: 'National Cyber Crime Portal', url: 'https://cybercrime.gov.in', desc: 'Report cyber crimes online (1930 helpline)' },
      { name: 'CERT-In', url: 'https://www.cert-in.org.in', desc: 'Indian Computer Emergency Response Team' },
      { name: 'Indian Cyber Crime Coordination Centre', url: 'https://www.i4c.gov.in', desc: 'I4C - Cyber crime coordination centre' },
      { name: 'National Critical Information Infrastructure Protection Centre', url: 'https://nciipc.gov.in', desc: 'NCIIPC - Critical infrastructure protection' },
    ],
  },
  {
    title: 'Police & Law Enforcement',
    icon: Building,
    color: 'from-blue-500 to-indigo-500',
    portals: [
      { name: 'MP Police Portal', url: 'https://police.mponline.gov.in', desc: 'Madhya Pradesh police online services' },
      { name: 'MP e-District Portal', url: 'https://mpedistrict.gov.in', desc: 'MP district-level government services' },
      { name: 'National Police Portal', url: 'https://digitalpolice.gov.in', desc: 'Central police online services' },
    ],
  },
  {
    title: 'Banking & Finance',
    icon: Landmark,
    color: 'from-green-500 to-emerald-500',
    portals: [
      { name: 'RBI Complaint Management', url: 'https://www.rbi.org.in/commonman/English/scripts/againstcommon.aspx', desc: 'File complaint against banks/NBFCs' },
      { name: 'SBI Grievance Portal', url: 'https://www.sbi.co.in/web/customer-care/grievance-redressal-mechanism', desc: 'State Bank of India grievance redressal' },
      { name: 'UPI Payment Portal (NPCI)', url: 'https://www.npci.org.in', desc: 'National Payments Corporation of India' },
      { name: 'SEBI Complaints', url: 'https://scores.gov.in', desc: 'SEBI Complaints Redressal System' },
      { name: 'Insurance Ombudsman', url: 'https://www.cioins.co.in', desc: 'Insurance complaint redressal' },
    ],
  },
  {
    title: 'Legal & Consumer Rights',
    icon: Scale,
    color: 'from-amber-500 to-orange-500',
    portals: [
      { name: 'National Consumer Helpline', url: 'https://www.nationalconsumerhelpline.in', desc: 'Consumer complaint portal (1915)' },
      { name: 'e-Courts Portal', url: 'https://ecourts.gov.in', desc: 'Check court case status online' },
      { name: 'Legal Services Authority', url: 'https://nalsa.gov.in', desc: 'Free legal aid for eligible citizens' },
      { name: 'Income Tax e-Filing', url: 'https://www.incometax.gov.in', desc: 'File tax returns, check refunds' },
    ],
  },
  {
    title: 'Telecom & Technology',
    icon: Globe,
    color: 'from-cyan-500 to-teal-500',
    portals: [
      { name: 'DoT Sanchar Saathi', url: 'https://sancharsaathi.gov.in', desc: 'Block/trace lost mobiles, verify handsets' },
      { name: 'TRAI', url: 'https://www.trai.gov.in', desc: 'Telecom complaints & regulations' },
      { name: 'MeitY', url: 'https://www.meity.gov.in', desc: 'Ministry of Electronics & IT' },
    ],
  },
  {
    title: 'Women & Child Safety',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    portals: [
      { name: 'Women Helpline (181)', url: 'https://www.womenhelpline.in', desc: 'National women safety helpline' },
      { name: 'Child Helpline (1098)', url: 'https://www.childhelpline.in', desc: 'Child abuse & protection' },
      { name: 'National Commission for Women', url: 'https://ncw.gov.in', desc: 'NCW online complaint portal' },
      { name: 'One Stop Centre', url: 'https://www.osc.gov.in', desc: 'Integrated support for women affected by violence' },
    ],
  },
  {
    title: 'Government Portals',
    icon: Users,
    color: 'from-purple-500 to-violet-500',
    portals: [
      { name: 'Digital India Portal', url: 'https://www.digitalindia.gov.in', desc: 'Digital India initiative & services' },
      { name: 'MyGov', url: 'https://www.mygov.in', desc: 'Citizen engagement platform' },
      { name: 'UMANG App', url: 'https://umang.gov.in', desc: 'Unified Mobile App for New-age Governance' },
      { name: 'DigiLocker', url: 'https://www.digilocker.gov.in', desc: 'Digital document wallet' },
      { name: 'CPGRAMS', url: 'https://pgportal.gov.in', desc: 'Centralized public grievance redressal' },
      { name: 'e-Samiksha', url: 'https://esamiksha.gov.in', desc: 'Track government project progress' },
    ],
  },
  {
    title: 'Education & Employment',
    icon: GraduationCap,
    color: 'from-blue-500 to-sky-500',
    portals: [
      { name: 'National Career Service', url: 'https://www.ncs.gov.in', desc: 'Job search & career guidance' },
      { name: 'SWAYAM', url: 'https://swayam.gov.in', desc: 'Free online education courses' },
      { name: 'UGAD (Ujjwala)', url: 'https://www.ujjwala.gov.in', desc: 'Skill development for women & youth' },
      { name: 'MP Online', url: 'https://www.mponline.gov.in', desc: 'MP government citizen services portal' },
    ],
  },
];

export default function GovtPortals() {
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-display font-bold text-white">Government Portals</h1>
              <p className="text-sm text-gray-400">Official portals for cyber safety & citizen services</p>
            </div>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Direct links to all important Indian government portals. Whether you are a victim or need help, access the official portals directly from here.
          </p>
        </div>

        <div className="flex items-center gap-2 p-4 mb-8 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-300 text-sm">
            These are all official government portals. Never share personal details or OTP on any third-party site.
          </p>
        </div>

        <div className="space-y-8">
          {portalCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div key={idx} className="card animate-fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{category.title}</h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {category.portals.map((portal, i) => (
                    <a
                      key={i}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-all duration-300 hover:scale-[1.02] hover:translate-x-1 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate group-hover:text-primary-400 transition-colors">
                          {portal.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate">{portal.desc}</p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-primary-400" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-br from-primary-500/10 to-cyan-500/10 border border-primary-500/30 rounded-xl text-center">
          <p className="text-gray-400 text-sm">
            Cannot access any portal? Call <span className="text-white font-semibold">1930</span> — National Cyber Crime Helpline
          </p>
        </div>
      </div>
    </div>
  );
}
