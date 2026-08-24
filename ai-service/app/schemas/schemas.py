from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PricePredictRequest(BaseModel):
    city: str = Field(default="Chennai")
    locality: str = Field(default="OMR")
    propertyType: str = Field(default="Apartment")
    bedrooms: int = Field(default=2)
    bathrooms: int = Field(default=2)
    area: float = Field(default=1200.0)
    propertyAge: int = Field(default=2)
    floor: int = Field(default=3)
    amenities: Optional[List[str]] = []
    parking: bool = Field(default=True)

class PricePredictResponse(BaseModel):
    predicted_price: float
    lower_bound: float
    upper_bound: float
    confidence_interval: str = "95%"

class FraudCheckRequest(BaseModel):
    title: Optional[str] = ""
    description: Optional[str] = ""
    price: float
    area: float
    city: Optional[str] = ""
    locality: Optional[str] = ""
    images: Optional[List[str]] = []
    agentListingFrequency: Optional[int] = 1

class FraudCheckResponse(BaseModel):
    fraudRiskScore: int
    reasons: List[str]

class ParseQueryRequest(BaseModel):
    prompt: str

class ParseQueryResponse(BaseModel):
    structured_query: Dict[str, Any]
    confidence: float

class RecommendRequest(BaseModel):
    userId: str
    userHistory: Optional[List[Dict[str, Any]]] = []
    candidateProperties: List[Dict[str, Any]]

class PropertyRecommendationItem(BaseModel):
    propertyId: str
    matchScore: int
    explainableReasons: List[str]

class RecommendResponse(BaseModel):
    recommendations: List[PropertyRecommendationItem]

class ChatAssistantMessage(BaseModel):
    role: str
    content: str

class ChatAssistantRequest(BaseModel):
    messages: List[ChatAssistantMessage]
    availableProperties: Optional[List[Dict[str, Any]]] = []

class ChatAssistantResponse(BaseModel):
    reply: str
    suggestedProperties: Optional[List[Dict[str, Any]]] = []
