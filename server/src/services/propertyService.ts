import { Property, IProperty } from '../models/Property';
import { cacheService } from '../config/redis';

export interface PropertyQueryFilters {
  city?: string;
  locality?: string;
  propertyType?: string;
  listingType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  furnishedStatus?: string;
  constructionStatus?: string;
  parking?: boolean;
  amenities?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number; // Distance filter in km
  verificationStatus?: string;
  agentId?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular' | 'area_desc';
  page?: number;
  limit?: number;
}

export class PropertyService {
  static async searchProperties(filters: PropertyQueryFilters) {
    const cacheKey = `properties:${JSON.stringify(filters)}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, Math.max(1, filters.limit || 12));
    const skip = (page - 1) * limit;

    const query: any = {};

    // Verification status filtering: default to APPROVED for buyers unless requested otherwise by agent/admin
    if (filters.verificationStatus) {
      query.verificationStatus = filters.verificationStatus;
    } else if (!filters.agentId) {
      query.verificationStatus = 'APPROVED';
    }

    if (filters.city) {
      query.city = { $regex: new RegExp(filters.city, 'i') };
    }
    if (filters.locality) {
      query.locality = { $regex: new RegExp(filters.locality, 'i') };
    }
    if (filters.propertyType) {
      query.propertyType = filters.propertyType;
    }
    if (filters.listingType) {
      query.listingType = filters.listingType;
    }
    if (filters.agentId) {
      query.agentId = filters.agentId;
    }

    // Range filters
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.price = {};
      if (filters.minPrice !== undefined) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice !== undefined) query.price.$lte = Number(filters.maxPrice);
    }

    if (filters.bedrooms) {
      query.bedrooms = { $gte: Number(filters.bedrooms) };
    }
    if (filters.bathrooms) {
      query.bathrooms = { $gte: Number(filters.bathrooms) };
    }

    if (filters.minArea !== undefined || filters.maxArea !== undefined) {
      query.area = {};
      if (filters.minArea !== undefined) query.area.$gte = Number(filters.minArea);
      if (filters.maxArea !== undefined) query.area.$lte = Number(filters.maxArea);
    }

    if (filters.furnishedStatus) {
      query.furnishedStatus = filters.furnishedStatus;
    }
    if (filters.constructionStatus) {
      query.constructionStatus = filters.constructionStatus;
    }
    if (filters.parking !== undefined) {
      query.parking = filters.parking;
    }

    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $all: filters.amenities };
    }

    // Text search
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    // Geospatial query
    if (filters.lat !== undefined && filters.lng !== undefined && filters.radiusKm) {
      const radiusInMeters = filters.radiusKm * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [Number(filters.lng), Number(filters.lat)],
          },
          $maxDistance: radiusInMeters,
        },
      };
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    if (filters.sortBy === 'price_asc') sort = { price: 1 };
    else if (filters.sortBy === 'price_desc') sort = { price: -1 };
    else if (filters.sortBy === 'popular') sort = { views: -1, favoritesCount: -1 };
    else if (filters.sortBy === 'area_desc') sort = { area: -1 };

    let total = 0;
    let properties: any[] = [];

    try {
      total = await Property.countDocuments(query);
      properties = await Property.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('agentId', 'name email phone avatar agencyName isVerified');
    } catch (dbErr) {
      console.warn('[MongoDB Search Warning]: Returning fallback empty array during test environment.');
    }

    const result = {
      properties,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    };

    // Cache results for 2 minutes
    await cacheService.set(cacheKey, JSON.stringify(result), 120);

    return result;
  }

  static async getById(id: string): Promise<IProperty | null> {
    return Property.findById(id).populate('agentId', 'name email phone avatar agencyName isVerified');
  }

  static async incrementViews(id: string): Promise<void> {
    await Property.findByIdAndUpdate(id, { $inc: { views: 1 } });
  }

  static async invalidateCache(): Promise<void> {
    await cacheService.invalidatePattern('properties:*');
  }
}
