"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const aiIntegrationService_1 = require("../services/aiIntegrationService");
const propertyService_1 = require("../services/propertyService");
const Interaction_1 = require("../models/Interaction");
const Property_1 = require("../models/Property");
class AiController {
    static async nlpSearch(req, res) {
        try {
            const { prompt } = req.body;
            if (!prompt || typeof prompt !== 'string') {
                res.status(400).json({ success: false, message: 'Natural language search prompt required.' });
                return;
            }
            // Step 1: Python FastAPI NLP / LLM extracts structured JSON query
            const nlpResult = await aiIntegrationService_1.AiIntegrationService.parseNaturalLanguageQuery(prompt);
            const structuredQuery = nlpResult.structured_query || {};
            // Step 2: Pass validated structured parameters to MongoDB property search service
            const searchFilters = {
                city: structuredQuery.city,
                locality: structuredQuery.locality,
                propertyType: structuredQuery.propertyType,
                bedrooms: structuredQuery.bedrooms,
                maxPrice: structuredQuery.maxPrice,
                parking: structuredQuery.parking,
                limit: 12,
            };
            const searchResult = await propertyService_1.PropertyService.searchProperties(searchFilters);
            res.json({
                success: true,
                extracted_parameters: structuredQuery,
                confidence: nlpResult.confidence || 0.9,
                properties: searchResult.properties,
                total: searchResult.pagination.total,
            });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async predictPrice(req, res) {
        try {
            const propertyData = req.body;
            const prediction = await aiIntegrationService_1.AiIntegrationService.predictPrice(propertyData);
            res.json({ success: true, ...prediction });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async fraudCheck(req, res) {
        try {
            const propertyData = req.body;
            const checkResult = await aiIntegrationService_1.AiIntegrationService.checkFraud(propertyData);
            res.json({ success: true, ...checkResult });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async getRecommendations(req, res) {
        try {
            const userId = req.userId || 'guest';
            // Gather candidate properties from database
            const candidates = await Property_1.Property.find({ verificationStatus: 'APPROVED' })
                .limit(30)
                .populate('agentId', 'name email phone avatar agencyName');
            // Fetch user interaction history if logged in
            let userHistory = [];
            if (req.userId) {
                userHistory = await Interaction_1.Interaction.find({ userId }).sort({ createdAt: -1 }).limit(20);
            }
            const recResult = await aiIntegrationService_1.AiIntegrationService.getRecommendations(userId, userHistory, candidates);
            res.json({ success: true, ...recResult });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
    static async chatAssistant(req, res) {
        try {
            const { messages } = req.body;
            if (!Array.isArray(messages)) {
                res.status(400).json({ success: false, message: 'Messages array is required.' });
                return;
            }
            // Fetch sample properties to provide context for AI Assistant
            const availableProperties = await Property_1.Property.find({ verificationStatus: 'APPROVED' })
                .limit(10)
                .select('title price propertyType bedrooms locality city images');
            const response = await aiIntegrationService_1.AiIntegrationService.chatAssistant(messages, availableProperties);
            res.json({ success: true, ...response });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
exports.AiController = AiController;
