import { Inquiry, ServicePriceItem } from './types';

export const FARM_METADATA = {
  name: 'Aquaculture Distributors Zimbabwe',
  location: 'Mt Hampden Farm, Harare, Zimbabwe',
  motto: 'We Hatch to Feed',
  dailyProduction: '30,000 fry (GIFT strain)',
  buyBackRate: '$35 USD per 1,000 fingerlings',
  phone: '+263 773 561 176', // Real WhatsApp contact from flyer
};

export const PRODUCT_CATALOG: ServicePriceItem[] = [
  {
    id: 'tilapia_fingerlings',
    name: 'Tilapia Fingerlings',
    price: '$50 per 1,000',
    description: 'Sex-reversed, high-yield GIFT strain. 40-day intensive nursery grow-out phase completed.',
    category: 'fingerlings',
  },
  {
    id: 'catfish_fingerlings',
    name: 'Catfish Fingerlings',
    price: '$70 per 1,000',
    description: 'Highly resilient Clarias gariepinus fingerlings. Fast growth rates, excellent survival rates.',
    category: 'fingerlings',
  },
  {
    id: 'breeders_tilapia',
    name: 'Tilapia Breeders',
    price: '$2.50 each',
    description: 'Mature parent stock selected for growth performance and high fecundity.',
    category: 'fingerlings',
  },
  {
    id: 'pond_10_10',
    name: '10m x 10m Pond Construction',
    price: '$702',
    description: 'Standard excavation, lining, inlet/outlet channels, and basic plumbing setup.',
    category: 'pond',
  },
  {
    id: 'pond_20_10',
    name: '20m x 10m Pond Construction',
    price: '$1,100',
    description: 'Excavation, specialized clay-compaction/liner, plumbing, aeration fittings.',
    category: 'pond',
  },
  {
    id: 'pond_20_20',
    name: '20m x 20m Pond Construction',
    price: '$2,200',
    description: 'Heavy duty commercial pond construction, deep excavation, and overflow systems.',
    category: 'pond',
  },
  {
    id: 'pond_20_30',
    name: '20m x 30m Pond Construction',
    price: '$3,228',
    description: 'Large scale commercial earthen/lined pond. Designed for optimal stocking densities.',
    category: 'pond',
  },
  {
    id: 'predator_nets',
    name: 'Predator Nets',
    price: '$0.60 per sq meter',
    description: 'Anti-bird, anti-reptile heavy duty mesh netting customized for all pond dimensions.',
    category: 'nets',
  },
  {
    id: 'training_day',
    name: 'Practical Aquaculture Training',
    price: '$50 per person',
    description: 'Full-day hands-on masterclass at Mt Hampden Farm. Lunch and manuals included.',
    category: 'training',
  },
  {
    id: 'partnership_package',
    name: 'Breeding Hub Partnership',
    price: '$2,500 USD',
    description: 'Complete breeding hub setup (4 Ponds | 360 Breeders | 300micron UV-treated Damliners | Nutrition & Protection). Expected output of 40,000+ fingerlings/month. Guaranteed buy-back at $35 USD per 1,000 fingerlings ($1,400 monthly return!). Setup must commence between June & July.',
    category: 'partnership',
  },
];

// Helper to get relative dates based on current date
const getDateMinusDays = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'John Moyo',
    phone: '+263 77 210 4930',
    location: 'Harare',
    serviceType: 'fingerlings',
    status: 'new',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    priority: 'normal',
    details: {
      species: 'Tilapia',
      quantity: 1000,
      deliveryDate: '2026-07-20',
    },
    notes: 'Inquired about delivery to Mt Hampden neighboring plots.',
  },
  {
    id: 'inq-2',
    name: 'Sarah Ndlovu',
    phone: '+263 71 855 2410',
    location: 'Bulawayo',
    serviceType: 'breeding',
    status: 'pending',
    createdAt: getDateMinusDays(2), // 48 hours ago - trigger for high priority / action required
    priority: 'high', // Breeding/partnership automatically high priority
    details: {
      investmentCapacity: '$2,500',
      questions: 'I want to establish a breeding hub in Bulawayo. Do you supply breeders as part of the package?',
      referralSource: 'Facebook Page',
    },
    notes: 'No contact made yet. Urgently needs follow-up regarding the $2,500 package availability.',
  },
  {
    id: 'inq-3',
    name: 'Tinashe Phiri',
    phone: '+263 73 342 1198',
    location: 'Mutare',
    serviceType: 'pond',
    status: 'shortlisted',
    createdAt: getDateMinusDays(3),
    priority: 'normal',
    details: {
      size: '20x10',
      landSizeAvailable: '1.5 Acres',
      budgetRange: '$1,000 - $1,500',
    },
    notes: 'Soil sample is clayish, which is perfect for earth ponds. Scheduled layout discussion.',
  },
  {
    id: 'inq-4',
    name: 'Chipo Moyo',
    phone: '+263 77 411 9087',
    location: 'Harare',
    serviceType: 'training',
    status: 'confirmed',
    createdAt: getDateMinusDays(5),
    priority: 'normal',
    details: {
      attendeesCount: 3,
      paymentDetails: 'EcoCash Ref: PP9821-H',
    },
    notes: 'EcoCash payment confirmed for 3 staff members. Emailed invitation and directions.',
  },
  {
    id: 'inq-5',
    name: 'Dr. Evelyn Gumbo',
    phone: '+263 78 299 1102',
    location: 'Gweru',
    serviceType: 'breeding',
    status: 'confirmed', // 1st confirmed partner
    createdAt: getDateMinusDays(8),
    priority: 'high',
    details: {
      investmentCapacity: '$5,000',
      questions: 'Setting up dual hapa breeding systems.',
      referralSource: 'WhatsApp Group Referral',
    },
    notes: 'Contract signed. First batch of breeders slated for delivery.',
  },
  {
    id: 'inq-6',
    name: 'Farai Matika',
    phone: '+263 77 344 5566',
    location: 'Harare South',
    serviceType: 'breeding',
    status: 'confirmed', // 2nd confirmed partner
    createdAt: getDateMinusDays(10),
    priority: 'high',
    details: {
      investmentCapacity: '$2,500',
      questions: 'How is water quality tested?',
      referralSource: 'Facebook Ad',
    },
    notes: 'Site survey done in Mt Hampden. Setup complete.',
  },
  {
    id: 'inq-7',
    name: 'Grace Musarurwa',
    phone: '+263 71 222 3344',
    location: 'Norton',
    serviceType: 'breeding',
    status: 'confirmed', // 3rd confirmed partner
    createdAt: getDateMinusDays(12),
    priority: 'high',
    details: {
      investmentCapacity: '$2,500',
      questions: 'Want to confirm the buyback terms.',
      referralSource: 'Word of mouth',
    },
  },
  {
    id: 'inq-8',
    name: 'Albert Chisiri',
    phone: '+263 77 987 6543',
    location: 'Goromonzi',
    serviceType: 'breeding',
    status: 'confirmed', // 4th confirmed partner
    createdAt: getDateMinusDays(14),
    priority: 'high',
    details: {
      investmentCapacity: '$10,000+',
      questions: 'Commercial breeding hub setup.',
      referralSource: 'Direct outreach',
    },
    notes: 'Large scale commercial partner.',
  },
  {
    id: 'inq-9',
    name: 'Blessing Zhou',
    phone: '+263 73 555 6677',
    location: 'Kadoma',
    serviceType: 'breeding',
    status: 'confirmed', // 5th confirmed partner
    createdAt: getDateMinusDays(15),
    priority: 'high',
    details: {
      investmentCapacity: '$2,500',
      questions: 'Can we expand after 6 months?',
      referralSource: 'Facebook',
    },
  },
  {
    id: 'inq-10',
    name: 'Memory Maposa',
    phone: '+263 77 666 7788',
    location: 'Chinhoyi',
    serviceType: 'breeding',
    status: 'confirmed', // 6th confirmed partner
    createdAt: getDateMinusDays(18),
    priority: 'high',
    details: {
      investmentCapacity: '$2,500',
      questions: 'Space requirements for 10x10 hub',
      referralSource: 'WhatsApp Group',
    },
  },
  {
    id: 'inq-11',
    name: 'Kudakwashe Shumba',
    phone: '+263 71 777 8899',
    location: 'Masvingo',
    serviceType: 'breeding',
    status: 'confirmed', // 7th confirmed partner -> exactly 7 confirmed partners (7/20 slots!)
    createdAt: getDateMinusDays(20),
    priority: 'high',
    details: {
      investmentCapacity: '$2,500',
      questions: 'Payment installment terms',
      referralSource: 'Facebook',
    },
  },
  {
    id: 'inq-12',
    name: 'Richard Banda',
    phone: '+263 77 888 9900',
    location: 'Kariba',
    serviceType: 'general',
    status: 'not_interested',
    createdAt: getDateMinusDays(6),
    priority: 'normal',
    details: {
      message: 'Do you ship live breeders directly to Kariba lake cages?',
    },
    notes: 'Declined - transport risk is too high for small quantity.',
  },
  {
    id: 'inq-13',
    name: 'Ephraim Sibanda',
    phone: '+263 77 111 2233',
    location: 'Hwange',
    serviceType: 'fingerlings',
    status: 'new',
    createdAt: new Date().toISOString(), // Just now
    priority: 'normal',
    details: {
      species: 'Catfish',
      quantity: 5000,
      deliveryDate: '2026-08-01',
    },
  },
];
