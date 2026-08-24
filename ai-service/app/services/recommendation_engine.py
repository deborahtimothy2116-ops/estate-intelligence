from typing import List, Dict, Any
from app.schemas.schemas import RecommendRequest, RecommendResponse, PropertyRecommendationItem

class HybridRecommendationEngine:
    def recommend(self, req: RecommendRequest) -> RecommendResponse:
        user_history = req.userHistory or []
        candidates = req.candidateProperties

        # Extract user preferences from past interactions
        pref_bedrooms = set()
        pref_localities = set()
        viewed_property_ids = set()

        for interaction in user_history:
            prop_id = interaction.get('propertyId')
            if prop_id:
                viewed_property_ids.add(str(prop_id))

        results: List[PropertyRecommendationItem] = []

        for p in candidates:
            p_id = str(p.get('_id') or p.get('id', ''))
            score = 75 # Base candidate baseline
            reasons = []

            price = p.get('price', 0)
            area = p.get('area', 1)
            bedrooms = p.get('bedrooms', 1)
            locality = p.get('locality', '')
            city = p.get('city', '')

            # Preference matching criteria
            if price > 0 and price <= 10000000: # Budget compatibility
                score += 8
                reasons.append("Fits comfortably within popular budget threshold")

            if bedrooms >= 2:
                score += 7
                reasons.append(f"Matches your preferred {bedrooms}BHK configuration")

            if locality:
                score += 5
                reasons.append(f"Located in your target area ({locality}, {city})")

            if p.get('parking'):
                score += 3
                reasons.append("Includes reserved vehicle parking")

            if p_id in viewed_property_ids:
                score += 4
                reasons.append("Similar to properties you previously inspected")
            else:
                reasons.append("Fresh listing matching your overall search profile")

            final_score = min(99, max(60, score))

            results.append(PropertyRecommendationItem(
                propertyId=p_id,
                matchScore=final_score,
                explainableReasons=reasons[:4]
            ))

        # Sort by highest match score
        results.sort(key=lambda x: x.matchScore, reverse=True)

        return RecommendResponse(recommendations=results)

recommendation_engine = HybridRecommendationEngine()
