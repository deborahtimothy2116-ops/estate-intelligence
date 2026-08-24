import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['BUYER', 'AGENT', 'ADMIN']).optional().default('BUYER'),
  phone: z.string().optional(),
  agencyName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const propertyCreateSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  propertyType: z.enum(['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Property']),
  listingType: z.enum(['Sale', 'Rent']).default('Sale'),
  price: z.number().positive('Price must be greater than 0'),
  negotiable: z.boolean().optional().default(false),
  bedrooms: z.number().int().nonnegative().default(1),
  bathrooms: z.number().int().nonnegative().default(1),
  area: z.number().positive('Area sqft must be greater than 0'),
  floor: z.number().int().optional().default(1),
  totalFloors: z.number().int().optional().default(1),
  propertyAge: z.number().nonnegative().optional().default(0),
  furnishedStatus: z.enum(['Unfurnished', 'Semi-Furnished', 'Fully Furnished']).default('Semi-Furnished'),
  constructionStatus: z.enum(['Ready to Move', 'Under Construction']).default('Ready to Move'),
  amenities: z.array(z.string()).optional().default([]),
  parking: z.boolean().optional().default(false),
  address: z.string().min(3, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  images: z.array(z.string()).optional().default([]),
  videos: z.array(z.string()).optional().default([]),
  virtualTour: z.string().optional().default(''),
});

export const inquirySchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5, 'Phone number is required'),
  preferredVisitDate: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

export const appointmentSchema = z.object({
  propertyId: z.string().min(1, 'Property ID is required'),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
  notes: z.string().optional(),
});
