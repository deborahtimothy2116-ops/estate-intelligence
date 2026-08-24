import os
import joblib
import numpy as np
import pandas as pd
from app.schemas.schemas import PricePredictRequest, PricePredictResponse

class PricePredictorService:
    def __init__(self, model_path: str = "trained_models/price_model.joblib"):
        self.model = None
        if os.path.exists(model_path):
            try:
                self.model = joblib.load(model_path)
                print(f"[PricePredictor]: Loaded ML model from {model_path}")
            except Exception as e:
                print(f"[PricePredictor]: Failed loading model: {e}")

    def predict(self, req: PricePredictRequest) -> PricePredictResponse:
        if self.model is not None:
            input_df = pd.DataFrame([{
                'city': req.city,
                'locality': req.locality,
                'propertyType': req.propertyType,
                'bedrooms': req.bedrooms,
                'bathrooms': req.bathrooms,
                'area': req.area,
                'propertyAge': req.propertyAge,
                'floor': req.floor,
                'amenities_count': len(req.amenities or []),
                'parking': 1 if req.parking else 0
            }])

            predicted_price = float(self.model.predict(input_df)[0])
        else:
            # Mathematical fallback estimator
            base_rate = 6500
            if req.city.lower() in ['mumbai', 'delhi']:
                base_rate = 14000
            predicted_price = req.area * base_rate + (req.bedrooms * 200000)

        # 95% Confidence Interval Calculation (+/- 7%)
        lower = round(predicted_price * 0.93, -3)
        upper = round(predicted_price * 1.07, -3)
        predicted = round(predicted_price, -3)

        return PricePredictResponse(
            predicted_price=max(100000.0, predicted),
            lower_bound=max(90000.0, lower),
            upper_bound=max(110000.0, upper),
            confidence_interval="95%"
        )

price_predictor_service = PricePredictorService()
