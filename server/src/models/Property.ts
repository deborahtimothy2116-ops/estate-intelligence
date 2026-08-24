import mongoose, { Schema, Document } from 'mongoose';

export type PropertyType = 'Apartment' | 'Villa' | 'Independent House' | 'Plot' | 'Commercial Property';
export type ListingType = 'Sale' | 'Rent';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface IProperty extends Document {
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  pricePerSqFt: number;
  negotiable: boolean;
  bedrooms: number;
  bathrooms: number;
  area: number; // in sq ft
  floor: number;
  totalFloors: number;
  propertyAge: number; // in years
  furnishedStatus: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  constructionStatus: 'Ready to Move' | 'Under Construction';
  amenities: string[];
  parking: boolean;
  address: string;
  city: string;
  locality: string;
  latitude: number;
  longitude: number;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: string[];
  videos: string[];
  virtualTour: string;
  agentId: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  fraudRiskScore: number; // 0-100
  fraudReasons: string[];
  views: number;
  favoritesCount: number;
  inquiriesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Property'],
      required: true,
    },
    listingType: { type: String, enum: ['Sale', 'Rent'], default: 'Sale' },
    price: { type: Number, required: true, index: true },
    pricePerSqFt: { type: Number, default: 0 },
    negotiable: { type: Boolean, default: false },
    bedrooms: { type: Number, required: true, default: 1 },
    bathrooms: { type: Number, required: true, default: 1 },
    area: { type: Number, required: true },
    floor: { type: Number, default: 1 },
    totalFloors: { type: Number, default: 1 },
    propertyAge: { type: Number, default: 0 },
    furnishedStatus: {
      type: String,
      enum: ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'],
      default: 'Semi-Furnished',
    },
    constructionStatus: {
      type: String,
      enum: ['Ready to Move', 'Under Construction'],
      default: 'Ready to Move',
    },
    amenities: [{ type: String }],
    parking: { type: Boolean, default: false },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    locality: { type: String, required: true, index: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [{ type: String }],
    videos: [{ type: String }],
    virtualTour: { type: String, default: '' },
    agentId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
      default: 'PENDING',
      index: true,
    },
    fraudRiskScore: { type: Number, default: 0 },
    fraudReasons: [{ type: String }],
    views: { type: Number, default: 0 },
    favoritesCount: { type: Number, default: 0 },
    inquiriesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create 2dsphere index for geospatial searches
PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ title: 'text', description: 'text', locality: 'text', city: 'text' });

PropertySchema.pre('save', function (next) {
  if (this.area && this.price) {
    this.pricePerSqFt = Math.round(this.price / this.area);
  }
  if (this.latitude && this.longitude) {
    this.location = {
      type: 'Point',
      coordinates: [this.longitude, this.latitude],
    };
  }
  next();
});

export const Property = mongoose.model<IProperty>('Property', PropertySchema);
