export type UserRole = 'BUYER' | 'AGENT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  agencyName?: string;
  avatar?: string;
  isVerified?: boolean;
  compareList?: string[];
}

export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Property';
export type ListingType = 'Sale' | 'Rent';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface Property {
  _id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  pricePerSqFt: number;
  negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor: number;
  totalFloors: number;
  propertyAge: number;
  furnishedStatus: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  constructionStatus: 'Ready to Move' | 'Under Construction';
  amenities: string[];
  parking: boolean;
  address: string;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
  images: string[];
  videos?: string[];
  virtualTour?: string;
  agentId: User | string;
  verificationStatus: VerificationStatus;
  fraudRiskScore: number;
  fraudReasons?: string[];
  views: number;
  favoritesCount: number;
  inquiriesCount: number;
  createdAt: string;
}

export interface RecommendationItem {
  propertyId: string;
  property: Property;
  matchScore: number;
  explainableReasons: string[];
}

export interface PricePrediction {
  predicted_price: number;
  lower_bound: number;
  upper_bound: number;
  confidence_interval: string;
  is_fallback?: boolean;
}

export interface FraudCheckResult {
  fraudRiskScore: number;
  reasons: string[];
}

export interface Inquiry {
  _id: string;
  propertyId: Property | any;
  buyerId: User | any;
  agentId: User | any;
  name: string;
  email: string;
  phone: string;
  preferredVisitDate?: string;
  message: string;
  status: 'PENDING' | 'CONTACTED' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
}

export interface Appointment {
  _id: string;
  propertyId: Property | any;
  buyerId: User | any;
  agentId: User | any;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  propertyId?: Property | any;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  user: User;
}

export interface AgentAnalytics {
  totalListings: number;
  totalViews: number;
  totalFavorites: number;
  totalInquiries: number;
  totalAppointments: number;
  conversionRate: string;
  mostViewedProperty: Property | null;
  mostFavoritedProperty: Property | null;
  popularLocations: Record<string, number>;
  priceTrends: any[];
}

export interface AdminAnalytics {
  userCount: number;
  agentCount: number;
  propertyCount: number;
  pendingApprovals: number;
  suspiciousListings: number;
  propertyTypeDistribution: { _id: string; count: number }[];
  verificationStatusDistribution: { _id: string; count: number }[];
  popularLocations: { _id: string; count: number }[];
}
