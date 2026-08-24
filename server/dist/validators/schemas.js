"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSchema = exports.inquirySchema = exports.propertyCreateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['BUYER', 'AGENT', 'ADMIN']).optional().default('BUYER'),
    phone: zod_1.z.string().optional(),
    agencyName: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.propertyCreateSchema = zod_1.z.object({
    title: zod_1.z.string().min(5, 'Title must be at least 5 characters'),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters'),
    propertyType: zod_1.z.enum(['Apartment', 'Villa', 'Independent House', 'Plot', 'Commercial Property']),
    listingType: zod_1.z.enum(['Sale', 'Rent']).default('Sale'),
    price: zod_1.z.number().positive('Price must be greater than 0'),
    negotiable: zod_1.z.boolean().optional().default(false),
    bedrooms: zod_1.z.number().int().nonnegative().default(1),
    bathrooms: zod_1.z.number().int().nonnegative().default(1),
    area: zod_1.z.number().positive('Area sqft must be greater than 0'),
    floor: zod_1.z.number().int().optional().default(1),
    totalFloors: zod_1.z.number().int().optional().default(1),
    propertyAge: zod_1.z.number().nonnegative().optional().default(0),
    furnishedStatus: zod_1.z.enum(['Unfurnished', 'Semi-Furnished', 'Fully Furnished']).default('Semi-Furnished'),
    constructionStatus: zod_1.z.enum(['Ready to Move', 'Under Construction']).default('Ready to Move'),
    amenities: zod_1.z.array(zod_1.z.string()).optional().default([]),
    parking: zod_1.z.boolean().optional().default(false),
    address: zod_1.z.string().min(3, 'Address is required'),
    city: zod_1.z.string().min(2, 'City is required'),
    locality: zod_1.z.string().min(2, 'Locality is required'),
    latitude: zod_1.z.number().min(-90).max(90),
    longitude: zod_1.z.number().min(-180).max(180),
    images: zod_1.z.array(zod_1.z.string()).optional().default([]),
    videos: zod_1.z.array(zod_1.z.string()).optional().default([]),
    virtualTour: zod_1.z.string().optional().default(''),
});
exports.inquirySchema = zod_1.z.object({
    propertyId: zod_1.z.string().min(1, 'Property ID is required'),
    name: zod_1.z.string().min(2, 'Name is required'),
    email: zod_1.z.string().email('Invalid email'),
    phone: zod_1.z.string().min(5, 'Phone number is required'),
    preferredVisitDate: zod_1.z.string().optional(),
    message: zod_1.z.string().min(5, 'Message must be at least 5 characters'),
});
exports.appointmentSchema = zod_1.z.object({
    propertyId: zod_1.z.string().min(1, 'Property ID is required'),
    date: zod_1.z.string().min(1, 'Date is required'),
    timeSlot: zod_1.z.string().min(1, 'Time slot is required'),
    notes: zod_1.z.string().optional(),
});
