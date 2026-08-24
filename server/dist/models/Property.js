"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Property = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PropertySchema = new mongoose_1.Schema({
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
    agentId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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
}, { timestamps: true });
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
exports.Property = mongoose_1.default.model('Property', PropertySchema);
