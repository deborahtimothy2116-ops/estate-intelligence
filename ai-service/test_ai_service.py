import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "OK"

def test_price_predict():
    payload = {
        "city": "Chennai",
        "locality": "OMR",
        "propertyType": "Apartment",
        "bedrooms": 3,
        "bathrooms": 3,
        "area": 1500,
        "propertyAge": 2,
        "floor": 5,
        "amenities": ["Gym", "Pool"],
        "parking": True
    }
    response = client.post("/api/predict-price", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_price" in data
    assert data["predicted_price"] > 0
    assert data["lower_bound"] <= data["predicted_price"]
    assert data["upper_bound"] >= data["predicted_price"]

def test_fraud_check():
    payload = {
        "title": "Cheap villa for urgent sale",
        "description": "Urgent cash bank transfer no paperwork required",
        "price": 500000,
        "area": 3000,
        "images": []
    }
    response = client.post("/api/fraud-check", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["fraudRiskScore"] >= 50
    assert len(data["reasons"]) > 0

def test_parse_query():
    payload = {"prompt": "I need a 3BHK apartment in OMR under 80 lakhs with parking"}
    response = client.post("/api/parse-query", json=payload)
    assert response.status_code == 200
    data = response.json()
    query = data["structured_query"]
    assert query.get("bedrooms") == 3
    assert query.get("maxPrice") == 8000000
    assert query.get("parking") is True

def test_recommend():
    payload = {
        "userId": "user123",
        "userHistory": [],
        "candidateProperties": [
            {
                "_id": "p1",
                "title": "3BHK Villa",
                "price": 8000000,
                "area": 1800,
                "bedrooms": 3,
                "locality": "OMR",
                "city": "Chennai",
                "parking": True
            }
        ]
    }
    response = client.post("/api/recommend", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["recommendations"]) == 1
    assert data["recommendations"][0]["matchScore"] > 70
    assert len(data["recommendations"][0]["explainableReasons"]) > 0
