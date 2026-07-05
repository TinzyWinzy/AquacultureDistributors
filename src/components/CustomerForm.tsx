import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Sparkles, MapPin, Phone, User } from 'lucide-react';
import { Inquiry, ServiceType } from '../types';
import LandingPage from './customer/LandingPage';
import ServiceSelector from './customer/ServiceSelector';
import FingerlingsForm from './customer/FingerlingsForm';
import PondForm from './customer/PondForm';
import BreedingForm from './customer/BreedingForm';
import TrainingForm from './customer/TrainingForm';
import GeneralForm from './customer/GeneralForm';
import SuccessView from './customer/SuccessView';
import PricingCatalog from './customer/PricingCatalog';

interface CustomerFormProps {
  onAddInquiry: (inquiry: Inquiry) => void;
  triggerAdminNotification: (message: string) => void;
}

type Stage = 'landing' | 'form' | 'success';

const serviceLabels: Record<ServiceType, string> = {
  fingerlings: 'Tilapia / Catfish Fingerlings',
  pond: 'Pond Construction',
  breeding: 'Partnership (Breeding Contract)',
  training: 'Training Registration',
  general: 'General Inquiry',
};

export default function CustomerForm({ onAddInquiry, triggerAdminNotification }: CustomerFormProps) {
  const [stage, setStage] = useState<Stage>('landing');
  const [selectedService, setSelectedService] = useState<ServiceType>('fingerlings');
  const [lastSubmittedId, setLastSubmittedId] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

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

    if (selectedService === 'fingerlings') details = { species, quantity: parseInt(quantity), deliveryDate };
    else if (selectedService === 'pond') details = { size: pondSize, landSizeAvailable: landSize, budgetRange };
    else if (selectedService === 'breeding') details = { investmentCapacity: investment, questions, referralSource: referral };
    else if (selectedService === 'training') details = { attendeesCount: parseInt(attendees), paymentDetails: paymentRef };
    else if (selectedService === 'general') details = { message };

    onAddInquiry({
      id, name, phone, location,
      serviceType: selectedService,
      status: 'new',
      createdAt: new Date().toISOString(),
      priority: selectedService === 'breeding' ? 'high' : 'normal',
      details,
    });

    setLastSubmittedId(id);
    setStage('success');

    triggerAdminNotification(
      selectedService === 'breeding'
        ? `High Priority Partnership Application submitted by ${name} ($${investment} investment capacity)!`
        : `New Inquiry received from ${name} for ${selectedService.toUpperCase()}!`
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setName(''); setPhone(''); setLocation('');
    setQuantity('1000'); setDeliveryDate('');
    setLandSize(''); setQuestions(''); setAttendees('1'); setPaymentRef(''); setMessage('');
    setStage('landing'); setErrors({});
  };

  const handleStartForm = (service: ServiceType) => {
    setSelectedService(service);
    setStage('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {stage === 'landing' && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onStartForm={handleStartForm} />
            <div className="w-full">
              <PricingCatalog onSelectBreeding={() => handleStartForm('breeding')} />
            </div>
          </motion.div>
        )}

        {stage === 'form' && (
          <motion.div key="form" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="max-w-4xl mx-auto px-4 py-12 w-full">
            <ServiceSelector selectedService={selectedService} onSelect={setSelectedService} />

            <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8">
              <h3 className="text-xl font-display font-semibold text-brand-navy mb-6 pb-3 border-b border-slate-200 flex items-center justify-between">
                <span>{serviceLabels[selectedService]} Form</span>
                {selectedService === 'breeding' && (
                  <span className="text-[10px] font-bold bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded-full">HIGH PRIORITY</span>
                )}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { id: 'customer-name', label: 'Full Name', icon: User, value: name, onChange: setName, placeholder: 'e.g. John Moyo', error: errors.name },
                  { id: 'customer-phone', label: 'WhatsApp/Phone Number', icon: Phone, value: phone, onChange: setPhone, placeholder: 'e.g. +263 77 123 4567', error: errors.phone, type: 'tel' },
                  { id: 'customer-location', label: 'Farm Location / City', icon: MapPin, value: location, onChange: setLocation, placeholder: 'e.g. Mt Hampden, Harare', error: errors.location },
                ].map(({ id, label, icon: Icon, value, onChange, placeholder, error }) => (
                  <div key={id}>
                    <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                      {label} <span className="text-brand-gold">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                        <Icon size={16} />
                      </span>
                      <input
                        type={id === 'customer-phone' ? 'tel' : 'text'}
                        id={id}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className={`glass-input pl-10 ${
                          error ? '!border-red-400 !focus:border-red-500 !focus:ring-red-500/50' : ''
                        }`}
                      />
                    </div>
                    {error && <span className="text-xs text-red-400 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {error}</span>}
                  </div>
                ))}
              </div>

              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
                {selectedService === 'fingerlings' && (
                  <FingerlingsForm
                    species={species} quantity={quantity} deliveryDate={deliveryDate} errors={errors}
                    onSpeciesChange={setSpecies} onQuantityChange={setQuantity} onDeliveryDateChange={setDeliveryDate}
                  />
                )}
                {selectedService === 'pond' && (
                  <PondForm
                    pondSize={pondSize} landSize={landSize} budgetRange={budgetRange} errors={errors}
                    onPondSizeChange={setPondSize} onLandSizeChange={setLandSize} onBudgetChange={setBudgetRange}
                  />
                )}
                {selectedService === 'breeding' && (
                  <BreedingForm
                    investment={investment} breedingHubsCount={breedingHubsCount} questions={questions} referral={referral}
                    onInvestmentChange={setInvestment} onHubsCountChange={setBreedingHubsCount}
                    onQuestionsChange={setQuestions} onReferralChange={setReferral}
                  />
                )}
                {selectedService === 'training' && (
                  <TrainingForm
                    attendees={attendees} paymentRef={paymentRef} errors={errors}
                    onAttendeesChange={setAttendees} onPaymentRefChange={setPaymentRef}
                  />
                )}
                {selectedService === 'general' && (
                  <GeneralForm message={message} errors={errors} onMessageChange={setMessage} />
                )}
              </div>

              <div className="flex items-center gap-3 justify-end">
                <button type="button" onClick={() => setStage('landing')} className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-sm font-semibold rounded-xl cursor-pointer transition-all shadow-sm">
                  Back
                </button>
                <button type="submit" className="px-8 py-3 glass-button-primary flex items-center gap-2 text-sm group">
                  {selectedService === 'breeding' ? 'Apply for Breeding Contract' : 'Submit My Inquiry'}
                  <Sparkles size={16} className="text-brand-navy group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {stage === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-4xl mx-auto px-4 py-12 w-full">
            <SuccessView lastSubmittedId={lastSubmittedId} selectedService={selectedService} name={name} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
