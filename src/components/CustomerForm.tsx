import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fish, Hammer, Handshake, BookOpen, MessageSquare, 
  MapPin, CheckCircle2, Calendar, Phone, User, 
  DollarSign, Sparkles, AlertCircle, ShoppingBag, Info
} from 'lucide-react';
import { FARM_METADATA, PRODUCT_CATALOG } from '../data';
import { ServiceType, Inquiry } from '../types';

interface CustomerFormProps {
  onAddInquiry: (inquiry: Inquiry) => void;
  triggerAdminNotification: (message: string) => void;
}

export default function CustomerForm({ onAddInquiry, triggerAdminNotification }: CustomerFormProps) {
  const [selectedService, setSelectedService] = useState<ServiceType>('fingerlings');
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  // General Form States
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  // Specific Form States
  const [species, setSpecies] = useState<'Tilapia' | 'Catfish'>('Tilapia');
  const [quantity, setQuantity] = useState('1000');
  const [deliveryDate, setDeliveryDate] = useState('');
  
  const [pondSize, setPondSize] = useState<'10x10' | '20x10' | '20x20' | '20x30' | 'Custom'>('10x10');
  const [landSize, setLandSize] = useState('');
  const [budgetRange, setBudgetRange] = useState('$1,000 - $2,500');

  const [investment, setInvestment] = useState<'$2,500' | '$5,000' | '$10,000+'>('$2,500');
  const [breedingHubsCount, setBreedingHubsCount] = useState(1);
  const [questions, setQuestions] = useState('');
  const [referral, setReferral] = useState('Facebook');

  const [attendees, setAttendees] = useState('1');
  const [paymentRef, setPaymentRef] = useState('');

  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!location.trim()) newErrors.location = 'Location is required';

    if (selectedService === 'fingerlings') {
      if (!quantity || parseInt(quantity) <= 0) newErrors.quantity = 'Specify a valid quantity';
      if (!deliveryDate) newErrors.deliveryDate = 'Preferred delivery date is required';
    } else if (selectedService === 'pond') {
      if (!landSize.trim()) newErrors.landSize = 'Land size description is required';
    } else if (selectedService === 'training') {
      if (parseInt(attendees) <= 0) newErrors.attendees = 'At least 1 attendee is required';
    } else if (selectedService === 'general') {
      if (!message.trim()) newErrors.message = 'Inquiry message cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const id = `inq-${Date.now()}`;
    let details: any = {};

    if (selectedService === 'fingerlings') {
      details = {
        species,
        quantity: parseInt(quantity),
        deliveryDate,
      };
    } else if (selectedService === 'pond') {
      details = {
        size: pondSize,
        landSizeAvailable: landSize,
        budgetRange,
      };
    } else if (selectedService === 'breeding') {
      details = {
        investmentCapacity: investment,
        questions,
        referralSource: referral,
      };
    } else if (selectedService === 'training') {
      details = {
        attendeesCount: parseInt(attendees),
        paymentDetails: paymentRef,
      };
    } else if (selectedService === 'general') {
      details = {
        message,
      };
    }

    const newInquiry: Inquiry = {
      id,
      name,
      phone,
      location,
      serviceType: selectedService,
      status: 'new',
      createdAt: new Date().toISOString(),
      priority: selectedService === 'breeding' ? 'high' : 'normal',
      details,
    };

    onAddInquiry(newInquiry);
    setLastSubmittedId(id);
    setSubmitted(true);

    // Trigger notification
    if (selectedService === 'breeding') {
      triggerAdminNotification(`🔥 High Priority Partnership Application submitted by ${name} ($${investment} investment capacity)!`);
    } else {
      triggerAdminNotification(`🐟 New Inquiry received from ${name} for ${selectedService.toUpperCase()}!`);
    }

    // Scroll to top of success card
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setLocation('');
    setQuantity('1000');
    setDeliveryDate('');
    setLandSize('');
    setQuestions('');
    setAttendees('1');
    setPaymentRef('');
    setMessage('');
    setSubmitted(false);
    setErrors({});
  };

  const getServiceLabel = (type: ServiceType) => {
    switch (type) {
      case 'fingerlings': return 'Tilapia / Catfish Fingerlings';
      case 'pond': return 'Pond Construction';
      case 'breeding': return 'Partnership (Breeding Contract)';
      case 'training': return 'Training Registration';
      case 'general': return 'General Inquiry';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header and Branding Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12 select-none pointer-events-none">
          <Fish size={320} className="text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-emerald-500 text-slate-950 font-display font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Mt Hampden Farm, Harare
            </span>
            <span className="bg-slate-700/60 backdrop-blur-sm text-slate-200 text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <Sparkles size={12} className="text-amber-400" />
              {FARM_METADATA.dailyProduction}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-2">
            {FARM_METADATA.name}
          </h1>
          <p className="text-slate-300 font-sans italic text-lg md:text-xl mb-6">
            "{FARM_METADATA.motto}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/80 text-emerald-400 border border-slate-700/50">
                <Fish size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Tilapia Fingerlings</div>
                <div className="text-sm font-semibold font-mono text-white">From $50 / 1,000</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/80 text-sky-400 border border-slate-700/50">
                <Hammer size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Pond Construction</div>
                <div className="text-sm font-semibold font-mono text-white">Starting at $702</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-800/80 text-amber-400 border border-slate-700/50">
                <Handshake size={18} />
              </div>
              <div>
                <div className="text-xs text-slate-400">Breeding Partnership</div>
                <div className="text-sm font-semibold font-mono text-emerald-400">Buy-Back: {FARM_METADATA.buyBackRate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Service Selection Row */}
            <div className="mb-8">
              <h2 className="text-lg font-display font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-emerald-600" />
                Select the service or product you require:
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <button
                  type="button"
                  id="btn-select-fingerlings"
                  onClick={() => setSelectedService('fingerlings')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedService === 'fingerlings'
                      ? 'border-emerald-500 bg-emerald-50/55 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Fish className={`mb-2 ${selectedService === 'fingerlings' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                  <span className="font-display font-medium text-xs sm:text-xs">Fingerlings</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">$50/1K</span>
                </button>

                <button
                  type="button"
                  id="btn-select-pond"
                  onClick={() => setSelectedService('pond')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedService === 'pond'
                      ? 'border-emerald-500 bg-emerald-50/55 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Hammer className={`mb-2 ${selectedService === 'pond' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                  <span className="font-display font-medium text-xs sm:text-xs">Pond Construction</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">From $702</span>
                </button>

                <button
                  type="button"
                  id="btn-select-breeding"
                  onClick={() => setSelectedService('breeding')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer relative overflow-hidden ${
                    selectedService === 'breeding'
                      ? 'border-emerald-500 bg-emerald-50/55 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="absolute top-1 right-1">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                  </div>
                  <Handshake className={`mb-2 ${selectedService === 'breeding' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                  <span className="font-display font-medium text-xs sm:text-xs">Breeding Contract</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">20 Slots Only</span>
                </button>

                <button
                  type="button"
                  id="btn-select-training"
                  onClick={() => setSelectedService('training')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedService === 'training'
                      ? 'border-emerald-500 bg-emerald-50/55 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <BookOpen className={`mb-2 ${selectedService === 'training' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                  <span className="font-display font-medium text-xs sm:text-xs">Training Registration</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">$50/person</span>
                </button>

                <button
                  type="button"
                  id="btn-select-general"
                  onClick={() => setSelectedService('general')}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedService === 'general'
                      ? 'border-emerald-500 bg-emerald-50/55 text-emerald-900 shadow-sm ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <MessageSquare className={`mb-2 ${selectedService === 'general' ? 'text-emerald-600' : 'text-slate-400'}`} size={24} />
                  <span className="font-display font-medium text-xs sm:text-xs">General Inquiry</span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">Feedback/Qns</span>
                </button>
              </div>
            </div>

            {/* Quick Pricing/Info Box based on selection */}
            <div className="mb-8">
              {selectedService === 'fingerlings' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <Fish size={40} className="animate-pulse" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-display font-bold text-slate-900 text-sm mb-1">
                      Sex-Reversed GIFT Tilapia & Resilient Catfish
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      Our fingerlings complete a 40-day intensive nursery grow-out phase at our Mt Hampden farm. GIFT strain guarantees exceptional food conversion and rapid growth rates in standard Zimbabwean climate conditions.
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">Tilapia: $50 / 1,000</span>
                      <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg">Catfish: $70 / 1,000</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg">GIFT Sex-Reversed Stock</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'pond' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center">
                    <Hammer size={40} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-display font-bold text-slate-900 text-sm mb-1">
                      Professional Pond Infrastructure Construction
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      We handle complete site evaluation, high-performance earth excavation, specialized clay compaction, and premium 300micron UV-treated Damliner membranes for maximum water retention. Standard sizes range from 10m x 10m ($702) to 20m x 30m ($3,228).
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs font-mono">
                      <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg">300μ UV-Treated Liner</span>
                      <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg">Inlet & Outlet Plumbing</span>
                      <span className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-lg">Clay Seal Option</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'breeding' && (
                <div className="flex flex-col gap-6">
                  {/* Headline Alert */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1 z-10">
                      ★ ONLY 20 PARTNERSHIP SLOTS AVAILABLE!
                    </div>
                    <div className="max-w-2xl relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-yellow-400 tracking-wider uppercase bg-slate-800/80 px-2.5 py-1 rounded-lg">
                          Zimbabwe Commercial Breeding Program
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-4xl font-display font-extrabold tracking-tight text-white mb-2 leading-tight uppercase">
                        TURN $2,500 INTO A FISH BREEDING BUSINESS
                      </h3>
                      <p className="text-base md:text-xl font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                        GENERATES UP TO <span className="text-yellow-400 underline decoration-2">$1,400 USD</span> EVERY SINGLE MONTH!
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Join our fully managed Aquaculture Partnership Program. We construct, stock, and protect your ponds, and then <span className="font-bold text-emerald-400">buy back the fingerling output at $35 USD per 1,000</span> every 2 months of production. Setup must commence between <span className="text-yellow-300 font-bold underline">June & July</span>.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Calculator Slider */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h4 className="font-display font-bold text-slate-900 text-sm flex items-center gap-2">
                          <Sparkles size={16} className="text-amber-500 animate-spin" />
                          Interactive Partnership ROI Planner
                        </h4>
                        <p className="text-xs text-slate-500">
                          Configure your partnership scale to see your custom setup requirements and monthly returns.
                        </p>
                      </div>
                      <div className="bg-slate-100 px-3 py-1.5 rounded-xl flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">Selected Hubs:</span>
                        <span className="text-sm font-bold font-mono text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                          {breedingHubsCount}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-xs font-bold text-slate-400 font-mono">1 Hub</span>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={breedingHubsCount}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setBreedingHubsCount(val);
                          // Sync investment state selection appropriately
                          if (val === 1) setInvestment('$2,500');
                          else if (val === 2) setInvestment('$5,000');
                          else setInvestment('$10,000+');
                        }}
                        className="flex-grow accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-xs font-bold text-slate-400 font-mono">5 Hubs</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Total Investment</div>
                        <div className="text-xs font-extrabold font-mono text-red-600">${(breedingHubsCount * 2500).toLocaleString()} USD</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Ponds to Build</div>
                        <div className="text-xs font-extrabold font-mono text-slate-800">{breedingHubsCount * 4} (10m x 10m)</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Breeding Stock</div>
                        <div className="text-xs font-extrabold font-mono text-slate-800">{breedingHubsCount * 360} Breeders</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Expected Output</div>
                        <div className="text-xs font-extrabold font-mono text-emerald-600">{(breedingHubsCount * 40000).toLocaleString()}+ / mo</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center col-span-2 md:col-span-1">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">Monthly Return</div>
                        <div className="text-xs font-extrabold font-mono text-amber-600">${(breedingHubsCount * 1400).toLocaleString()} USD</div>
                      </div>
                    </div>
                  </div>

                  {/* Specification Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Col 1: Breeding Contract Package */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900"></div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-950 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>📦 BREEDING CONTRACT PACKAGE</span>
                        </h4>
                        <ul className="space-y-3 text-xs text-slate-600">
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <div>
                              <span className="font-semibold text-slate-800">Pond Infrastructure:</span> Construction of {breedingHubsCount * 4} ponds (10x10m each) + {breedingHubsCount * 4} Damliners 300micron UV-treated.
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <div>
                              <span className="font-semibold text-slate-800">Breeding Stock:</span> {breedingHubsCount * 360} Selected premium breeding parents.
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <div>
                              <span className="font-semibold text-slate-800">Pond Management:</span> {breedingHubsCount * 4} x 5L Antifungus treatment & {breedingHubsCount * 4} x 5L Booster solution.
                            </div>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">✔</span>
                            <div>
                              <span className="font-semibold text-slate-800">Nutrition & Predator Control:</span> {breedingHubsCount * 4} x 25kgs Broodstock feed & {breedingHubsCount * 4} Birdnets.
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Total Outlay:</span>
                        <span className="font-bold text-red-600 font-mono">${(breedingHubsCount * 2500).toLocaleString()} USD</span>
                      </div>
                    </div>

                    {/* Col 2: What you get & Output */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-950 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>📈 EXPECTED OUTPUT & REVENUE</span>
                        </h4>
                        <ul className="space-y-4 text-xs text-slate-600">
                          <li>
                            <div className="font-semibold text-emerald-700 mb-1 flex items-center gap-1.5">
                              <span>🐟</span> Expected Production:
                            </div>
                            <div className="text-slate-600">
                              Produces <span className="font-bold text-emerald-600 font-mono">{(breedingHubsCount * 40000).toLocaleString()}+ fingerlings</span> per month for 6 months.
                            </div>
                          </li>
                          <li>
                            <div className="font-semibold text-purple-700 mb-1 flex items-center gap-1.5">
                              <span>🤝</span> Guaranteed Buy-Back:
                            </div>
                            <div className="text-slate-600">
                              We buy back output at <span className="font-bold text-purple-700 font-mono">$35 USD per every 1,000 fingerlings</span> harvested every 2 months.
                            </div>
                          </li>
                          <li>
                            <div className="font-semibold text-amber-600 mb-1 flex items-center gap-1.5">
                              <span>💰</span> Revenue return:
                            </div>
                            <div className="text-slate-600">
                              Secures a regular <span className="font-bold text-amber-600 font-mono">${(breedingHubsCount * 1400).toLocaleString()} USD monthly return</span>.
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Guaranteed Monthly Return:</span>
                        <span className="font-bold text-emerald-600 font-mono">${(breedingHubsCount * 1400).toLocaleString()} USD / mo</span>
                      </div>
                    </div>

                    {/* Col 3: Requirements Check */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
                      <div>
                        <h4 className="font-display font-extrabold text-slate-950 text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>🛡️ REQUIREMENTS CHECKLIST</span>
                        </h4>
                        <div className="space-y-4">
                          <div className="flex gap-3 items-start">
                            <div className="text-lg bg-indigo-50 p-1.5 rounded-xl border border-indigo-100">🏞️</div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">Land Available</div>
                              <div className="text-[11px] text-slate-500">Need secure area for {breedingHubsCount * 4} ponds of 10m x 10m each.</div>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="text-lg bg-sky-50 p-1.5 rounded-xl border border-sky-100">💧</div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">Reliable Water Source</div>
                              <div className="text-[11px] text-slate-500">Borehole, river, stream, or dam with continuous clean supply.</div>
                            </div>
                          </div>
                          <div className="flex gap-3 items-start">
                            <div className="text-lg bg-red-50 p-1.5 rounded-xl border border-red-100">💰</div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">Financial Investment</div>
                              <div className="text-[11px] text-slate-500">Capital starting at ${(breedingHubsCount * 2500).toLocaleString()} USD to construct the hubs.</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Work Commencement:</span>
                        <span className="font-bold text-slate-700 font-mono">June & July</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'training' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                    <BookOpen size={40} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-display font-bold text-slate-900 text-sm mb-1">
                      Hands-On Aquaculture Masterclass
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      Join our full-day intensive masterclass training at Mt Hampden Farm, Harare. Includes comprehensive lessons in water quality management, feed schedules, hatchery management, and biosecurity protocols. Registration of $50 per person includes high-quality materials and farm lunch.
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs font-mono">
                      <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">Practical Pond Exercises</span>
                      <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">Manuals & Lunch Included</span>
                      <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg">EcoCash Payments Accepted</span>
                    </div>
                  </div>
                </div>
              )}

              {selectedService === 'general' && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-5 items-stretch">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <MessageSquare size={40} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-display font-bold text-slate-900 text-sm mb-1">
                      Direct Inquiries & Technical Consultation
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      Need custom pond sizes, specialized transport for catfish breeders, bulk feed deliveries, or a tailored site evaluation? Send us an inquiry, and our professional aquaculture experts will follow up directly via WhatsApp.
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs font-mono">
                      <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg">WhatsApp Reply &lt; 24h</span>
                      <span className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-lg">Custom Commercial Quotes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dynamic Form Card */}
            <form onSubmit={handleSubmit} id="customer-inquiry-form" className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>{getServiceLabel(selectedService)} Form</span>
                {selectedService === 'breeding' && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    👑 HIGH PRIORITY
                  </span>
                )}
              </h3>

              {/* Grid for Primary fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label htmlFor="customer-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      id="customer-name"
                      placeholder="e.g. John Moyo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border font-sans text-sm outline-none transition-all ${
                        errors.name ? 'border-red-400 bg-red-50/10 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400'
                      }`}
                    />
                  </div>
                  {errors.name && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</span>}
                </div>

                <div>
                  <label htmlFor="customer-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    WhatsApp/Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="tel"
                      id="customer-phone"
                      placeholder="e.g. +263 77 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border font-sans text-sm outline-none transition-all ${
                        errors.phone ? 'border-red-400 bg-red-50/10 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400'
                      }`}
                    />
                  </div>
                  {errors.phone && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</span>}
                </div>

                <div>
                  <label htmlFor="customer-location" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Farm Location / City <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <MapPin size={16} />
                    </span>
                    <input
                      type="text"
                      id="customer-location"
                      placeholder="e.g. Mt Hampden, Harare"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border font-sans text-sm outline-none transition-all ${
                        errors.location ? 'border-red-400 bg-red-50/10 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400'
                      }`}
                    />
                  </div>
                  {errors.location && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.location}</span>}
                </div>
              </div>

              {/* Dynamic Categories Fields */}
              <div className="p-5 bg-slate-50/50 rounded-2xl border border-slate-100/80 mb-8">
                {/* 1. Fingerlings Form */}
                {selectedService === 'fingerlings' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="species-selection" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Species Selection
                      </label>
                      <div className="flex gap-3">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-all select-none">
                          <input
                            type="radio"
                            name="species"
                            checked={species === 'Tilapia'}
                            onChange={() => setSpecies('Tilapia')}
                            className="accent-emerald-600 h-4 w-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Tilapia</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-all select-none">
                          <input
                            type="radio"
                            name="species"
                            checked={species === 'Catfish'}
                            onChange={() => setSpecies('Catfish')}
                            className="accent-emerald-600 h-4 w-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Catfish</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="fingerlings-quantity" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Quantity Required
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="fingerlings-quantity"
                          min="1000"
                          step="1000"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full pr-16 pl-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-mono text-sm outline-none bg-white"
                        />
                        <span className="absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-slate-400">
                          units
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
                        Estimated cost: <span className="font-bold text-slate-700 font-mono">${(Math.max(1000, parseInt(quantity) || 0) / 1000 * (species === 'Tilapia' ? 50 : 70)).toFixed(2)}</span>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="delivery-date" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Preferred Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                          <Calendar size={16} />
                        </span>
                        <input
                          type="date"
                          id="delivery-date"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                        />
                      </div>
                      {errors.deliveryDate && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.deliveryDate}</span>}
                    </div>
                  </div>
                )}

                {/* 2. Pond Construction Form */}
                {selectedService === 'pond' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="pond-size" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Pond Size Desired
                      </label>
                      <select
                        id="pond-size"
                        value={pondSize}
                        onChange={(e) => setPondSize(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      >
                        <option value="10x10">10m x 10m ($702)</option>
                        <option value="20x10">20m x 10m ($1,100)</option>
                        <option value="20x20">20m x 20m ($2,200)</option>
                        <option value="20x30">20m x 30m ($3,228)</option>
                        <option value="Custom">Custom Dimensions</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="land-size" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Land Size Available <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="land-size"
                        placeholder="e.g., 0.5 Acres, backyard yard"
                        value={landSize}
                        onChange={(e) => setLandSize(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      />
                      {errors.landSize && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.landSize}</span>}
                    </div>

                    <div>
                      <label htmlFor="budget-range" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Construction Budget Range
                      </label>
                      <select
                        id="budget-range"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      >
                        <option value="Under $1,000">Under $1,000</option>
                        <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                        <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                        <option value="$5,000+">$5,000+ (Commercial project)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. Breeding Contract Form */}
                {selectedService === 'breeding' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="investment" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Investment Capacity
                      </label>
                      <select
                        id="investment"
                        value={investment}
                        onChange={(e) => setInvestment(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      >
                        <option value="$2,500">$2,500 (1 Breeding Hub)</option>
                        <option value="$5,000">$5,000 (2 Breeding Hubs)</option>
                        <option value="$10,000+">$10,000+ (Commercial Scale)</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="referral" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        id="referral"
                        value={referral}
                        onChange={(e) => setReferral(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      >
                        <option value="Facebook">Facebook Page / Comments</option>
                        <option value="WhatsApp">WhatsApp Group</option>
                        <option value="Neighbor">Neighbor / Neighboring farmer</option>
                        <option value="Other">Other Referral</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="questions" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Contract Questions (Optional)
                      </label>
                      <input
                        type="text"
                        id="questions"
                        placeholder="e.g. Can I use clay soil hapas?"
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 4. Training Form */}
                {selectedService === 'training' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="attendees" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Number of Attendees <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="attendees"
                        min="1"
                        max="20"
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-mono text-sm outline-none bg-white"
                      />
                      <p className="text-[10px] text-slate-400 mt-1.5 font-sans">
                        Registration Cost: <span className="font-bold text-slate-700 font-mono">${(Math.max(1, parseInt(attendees) || 0) * 50).toFixed(2)}</span>
                      </p>
                    </div>

                    <div>
                      <label htmlFor="payment-ref" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Payment Confirmation Ref (Optional)
                      </label>
                      <input
                        type="text"
                        id="payment-ref"
                        placeholder="e.g. EcoCash Ref or Bank Transfer ID"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* 5. General Inquiry Form */}
                {selectedService === 'general' && (
                  <div>
                    <label htmlFor="general-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Inquiry Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="general-message"
                      rows={3}
                      placeholder="Type your message about breeding stocks, hapas, nets or general advice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 font-sans text-sm outline-none bg-white"
                    />
                    {errors.message && <span className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.message}</span>}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  id="btn-submit-inquiry"
                  className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-display font-semibold rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 active:translate-y-0.5 flex items-center justify-center gap-2 text-sm"
                >
                  {selectedService === 'breeding' ? 'Apply for Breeding Contract' : 'Submit My Inquiry'}
                  <Sparkles size={16} className="text-emerald-200 animate-pulse" />
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-emerald-100 p-8 text-center shadow-lg max-w-xl mx-auto"
          >
            <div className="inline-flex p-4 rounded-full bg-emerald-50 text-emerald-600 mb-6 border border-emerald-100/50">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>

            <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
              Submission Received!
            </h2>
            <p className="text-emerald-700 font-semibold text-sm mb-4">
              Your ticket reference is #{lastSubmittedId}
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 text-left text-sm text-slate-600">
              <div className="flex gap-2 mb-2">
                <span className="font-semibold text-slate-800 min-w-20">Service:</span>
                <span className="text-slate-900 font-medium">{getServiceLabel(selectedService)}</span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="font-semibold text-slate-800 min-w-20">Name:</span>
                <span className="text-slate-900 font-medium">{name}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-semibold text-slate-800 min-w-20">Next Step:</span>
                <span className="text-slate-900 font-medium flex items-center gap-1">
                  Our Mt Hampden team is notified. Expect a direct WhatsApp within 24 hours.
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-8 leading-relaxed">
              Aquaculture Distributors - Mt Hampden Farm, Harare. We Hatch to Feed.
            </p>

            <button
              type="button"
              id="btn-reset-form"
              onClick={handleReset}
              className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 font-display font-medium rounded-xl cursor-pointer text-sm transition-all inline-flex items-center gap-2"
            >
              Submit Another Inquiry
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Catalog & Info Panel (The visual rhythm element) */}
      <div className="mt-12">
        <h3 className="text-xl font-display font-semibold text-slate-800 mb-6 flex items-center gap-2">
          <ShoppingBag size={20} className="text-emerald-600" />
          Products & Setup Reference Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCT_CATALOG.map((item) => (
            <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-display font-semibold text-slate-900 text-sm">
                    {item.name}
                  </h4>
                  <span className="font-mono text-emerald-600 font-bold text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {item.price}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
              {item.category === 'partnership' && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                    👑 20 SLOTS MAX
                  </span>
                  <button
                    onClick={() => {
                      setSelectedService('breeding');
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    Apply Now &rarr;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
