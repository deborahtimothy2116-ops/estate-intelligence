import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AiIntegrationService } from '../services/aiIntegrationService';
import { PropertyService } from '../services/propertyService';
import { Interaction } from '../models/Interaction';
import { Property } from '../models/Property';

export class AiController {
  static async nlpSearch(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        res.status(400).json({ success: false, message: 'Natural language search prompt required.' });
        return;
      }

      // Step 1: Python FastAPI NLP / LLM extracts structured JSON query
      const nlpResult = await AiIntegrationService.parseNaturalLanguageQuery(prompt);
      const structuredQuery = nlpResult.structured_query || {};

      // Step 2: Pass validated structured parameters to MongoDB property search service
      const searchFilters: any = {
        city: structuredQuery.city,
        locality: structuredQuery.locality,
        propertyType: structuredQuery.propertyType,
        bedrooms: structuredQuery.bedrooms,
        maxPrice: structuredQuery.maxPrice,
        parking: structuredQuery.parking,
        limit: 12,
      };

      const searchResult = await PropertyService.searchProperties(searchFilters);

      res.json({
        success: true,
        extracted_parameters: structuredQuery,
        confidence: nlpResult.confidence || 0.9,
        properties: searchResult.properties,
        total: searchResult.pagination.total,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async predictPrice(req: AuthRequest, res: Response): Promise<void> {
    try {
      const propertyData = req.body;
      const prediction = await AiIntegrationService.predictPrice(propertyData);
      res.json({ success: true, ...prediction });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async fraudCheck(req: AuthRequest, res: Response): Promise<void> {
    try {
      const propertyData = req.body;
      const checkResult = await AiIntegrationService.checkFraud(propertyData);
      res.json({ success: true, ...checkResult });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getRecommendations(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId || 'guest';

      // Gather candidate properties from database
      const candidates = await Property.find({ verificationStatus: 'APPROVED' })
        .limit(30)
        .populate('agentId', 'name email phone avatar agencyName');

      // Fetch user interaction history if logged in
      let userHistory: any[] = [];
      if (req.userId) {
        userHistory = await Interaction.find({ userId }).sort({ createdAt: -1 }).limit(20);
      }

      const recResult = await AiIntegrationService.getRecommendations(userId, userHistory, candidates);
      res.json({ success: true, ...recResult });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async chatAssistant(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { messages } = req.body;
      if (!Array.isArray(messages)) {
        res.status(400).json({ success: false, message: 'Messages array is required.' });
        return;
      }

      // Fetch sample properties to provide context for AI Assistant
      const availableProperties = await Property.find({ verificationStatus: 'APPROVED' })
        .limit(10)
        .select('title price propertyType bedrooms locality city images');

      const response = await AiIntegrationService.chatAssistant(messages, availableProperties);
      res.json({ success: true, ...response });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
