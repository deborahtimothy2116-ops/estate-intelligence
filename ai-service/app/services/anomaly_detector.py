from typing import List
from app.schemas.schemas import FraudCheckRequest, FraudCheckResponse

class AnomalyDetectorService:
    def check_listing(self, req: FraudCheckRequest) -> FraudCheckResponse:
        score = 0
        reasons: List[str] = []

        price = req.price
        area = req.area
        price_per_sqft = price / area if area > 0 else 0

        # Anomaly Rule 1: Price significantly below market rate (< ₹2,500 / sqft)
        if price_per_sqft > 0 and price_per_sqft < 2500:
            score += 45
            reasons.append(f"Price (₹{int(price_per_sqft)}/sqft) is abnormally below city baseline market rates.")

        # Anomaly Rule 2: Missing or insufficient property photos
        if not req.images or len(req.images) == 0:
            score += 25
            reasons.append("No verification images attached to listing.")
        elif len(req.images) == 1:
            score += 10
            reasons.append("Only a single photo provided for complete listing.")

        # Anomaly Rule 3: Description anomaly (too short or contains suspicious urgency keywords)
        desc = (req.description or "").lower()
        if len(desc) < 30:
            score += 15
            reasons.append("Listing description is unusually brief or generic.")

        suspicious_keywords = ['urgent sale', 'advance cash', 'bank transfer', 'no paperwork', 'wire money']
        for kw in suspicious_keywords:
            if kw in desc:
                score += 20
                reasons.append(f"Description contains high-risk keyword: '{kw}'")

        # Anomaly Rule 4: Abnormally high posting frequency from agent
        if req.agentListingFrequency and req.agentListingFrequency > 15:
            score += 15
            reasons.append("High listing creation frequency detected for agent account.")

        if score == 0:
            reasons.append("All listing parameters within normal market distribution limits.")

        final_score = min(100, score)

        return FraudCheckResponse(
            fraudRiskScore=final_score,
            reasons=reasons
        )

anomaly_detector_service = AnomalyDetectorService()
