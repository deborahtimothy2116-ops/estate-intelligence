from fastapi import APIRouter
from app.schemas.schemas import (
    PricePredictRequest, PricePredictResponse,
    FraudCheckRequest, FraudCheckResponse,
    ParseQueryRequest, ParseQueryResponse,
    RecommendRequest, RecommendResponse,
    ChatAssistantRequest, ChatAssistantResponse
)
from app.services.price_predictor import price_predictor_service
from app.services.anomaly_detector import anomaly_detector_service
from app.services.nlp_parser import nlp_parser_service
from app.services.recommendation_engine import recommendation_engine
from app.services.ai_assistant import ai_assistant_service

router = APIRouter(prefix="/api")

@router.post("/predict-price", response_model=PricePredictResponse)
def predict_price(req: PricePredictRequest):
    return price_predictor_service.predict(req)

@router.post("/fraud-check", response_model=FraudCheckResponse)
def fraud_check(req: FraudCheckRequest):
    return anomaly_detector_service.check_listing(req)

@router.post("/parse-query", response_model=ParseQueryResponse)
async def parse_query(req: ParseQueryRequest):
    return await nlp_parser_service.parse_prompt(req)

@router.post("/recommend", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    return recommendation_engine.recommend(req)

@router.post("/chat-assistant", response_model=ChatAssistantResponse)
def chat_assistant(req: ChatAssistantRequest):
    return ai_assistant_service.chat(req)
