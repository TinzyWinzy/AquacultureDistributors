export type ServiceType = 'fingerlings' | 'pond' | 'breeding' | 'training' | 'general';

export type InquiryStatus = 'new' | 'pending' | 'shortlisted' | 'confirmed' | 'not_interested';

export interface FingerlingsDetails {
  species: 'Tilapia' | 'Catfish';
  quantity: number;
  deliveryDate: string;
}

export interface PondDetails {
  size: '10x10' | '20x10' | '20x20' | '20x30' | 'Custom';
  landSizeAvailable: string;
  budgetRange: string;
}

export interface BreedingDetails {
  investmentCapacity: '$2,500' | '$5,000' | '$10,000+';
  questions: string;
  referralSource: string;
}

export interface TrainingDetails {
  attendeesCount: number;
  paymentDetails?: string;
}

export interface GeneralDetails {
  message: string;
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  location: string;
  serviceType: ServiceType;
  status: InquiryStatus;
  createdAt: string; // ISO format
  lastContactedAt?: string; // ISO format
  notes?: string;
  priority: 'high' | 'normal';
  details: FingerlingsDetails | PondDetails | BreedingDetails | TrainingDetails | GeneralDetails;
}

export interface ServicePriceItem {
  id: string;
  name: string;
  price: string;
  description: string;
  category: 'fingerlings' | 'pond' | 'nets' | 'training' | 'partnership';
}

export interface SystemStats {
  totalInquiriesThisMonth: number;
  partnershipSlotsRemaining: number;
  totalConfirmedPartners: number;
  conversionRate: number; // percentage
}
