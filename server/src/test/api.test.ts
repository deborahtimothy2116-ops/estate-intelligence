import request from 'supertest';
import app from '../app';

jest.setTimeout(15000);

describe('Express Backend API Integration Tests', () => {
  it('GET /api/health should return status OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
    expect(res.body.service).toContain('Real Estate');
  });

  it('POST /api/ai/predict-price should return price prediction bounds', async () => {
    const payload = {
      city: 'Chennai',
      locality: 'OMR',
      propertyType: 'Apartment',
      bedrooms: 3,
      bathrooms: 3,
      area: 1650,
    };

    const res = await request(app).post('/api/ai/predict-price').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.predicted_price).toBeGreaterThan(0);
    expect(res.body.lower_bound).toBeLessThanOrEqual(res.body.predicted_price);
    expect(res.body.upper_bound).toBeGreaterThanOrEqual(res.body.predicted_price);
  });

  it('POST /api/ai/fraud-check should return listing risk score', async () => {
    const payload = {
      title: 'Suspicious property',
      price: 100000,
      area: 2000,
      images: [],
    };

    const res = await request(app).post('/api/ai/fraud-check').send(payload);
    expect(res.status).toBe(200);
    expect(res.body.fraudRiskScore).toBeGreaterThanOrEqual(40);
    expect(Array.isArray(res.body.reasons)).toBe(true);
  });

  it('POST /api/ai/search should parse natural language and return structured filters', async () => {
    const res = await request(app)
      .post('/api/ai/search')
      .send({ prompt: '3BHK apartment in OMR under 80 lakhs with parking' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.extracted_parameters).toBeDefined();
  });
});
