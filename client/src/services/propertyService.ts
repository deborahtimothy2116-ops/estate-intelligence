import { api } from './api';
import { Property } from '../types';

export interface SearchFilters {
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
  radiusKm?: number;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  agentId?: string;
  verificationStatus?: string;
}

export const propertyService = {
  async searchProperties(filters: SearchFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        if (Array.isArray(val)) {
          params.append(key, val.join(','));
        } else {
          params.append(key, String(val));
        }
      }
    });

    const res = await api.get<{
      success: boolean;
      properties: Property[];
      pagination: { total: number; page: number; limit: number; pages: number };
    }>(`/properties?${params.toString()}`);
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<{ success: boolean; property: Property }>(`/properties/${id}`);
    return res.data.property;
  },

  async createProperty(propertyData: any) {
    const res = await api.post<{ success: boolean; property: Property }>('/properties', propertyData);
    return res.data.property;
  },

  async updateProperty(id: string, propertyData: any) {
    const res = await api.put<{ success: boolean; property: Property }>(`/properties/${id}`, propertyData);
    return res.data.property;
  },

  async deleteProperty(id: string) {
    const res = await api.delete<{ success: boolean }>(`/properties/${id}`);
    return res.data;
  },

  async getCompareProperties(propertyIds: string[]) {
    const res = await api.post<{ success: boolean; properties: Property[] }>('/properties/compare', { propertyIds });
    return res.data.properties;
  },

  async getFavorites() {
    const res = await api.get<{ success: boolean; favorites: any[] }>('/favorites');
    return res.data.favorites;
  },

  async addFavorite(propertyId: string) {
    const res = await api.post<{ success: boolean }>(`/favorites/${propertyId}`);
    return res.data;
  },

  async removeFavorite(propertyId: string) {
    const res = await api.delete<{ success: boolean }>(`/favorites/${propertyId}`);
    return res.data;
  },
};
