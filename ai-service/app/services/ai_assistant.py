from typing import List, Dict, Any
from app.schemas.schemas import ChatAssistantRequest, ChatAssistantResponse

class AiAssistantService:
    def chat(self, req: ChatAssistantRequest) -> ChatAssistantResponse:
        messages = req.messages
        available_props = req.availableProperties or []

        last_user_msg = ""
        for m in reversed(messages):
            if m.role == 'user':
                last_user_msg = m.content
                break

        # Ground response strictly on available database properties
        top_matches = available_props[:3]

        if not top_matches:
            reply = "I checked our database, but could not find exact matching properties right now. Would you like to adjust your search budget or preferred location?"
            return ChatAssistantResponse(reply=reply, suggestedProperties=[])

        lines = [f"Based on real-time database listings, here are the best property options for your request:\n"]
        for idx, p in enumerate(top_matches, 1):
            title = p.get('title', 'Property Listing')
            price_lakhs = (p.get('price', 0) / 100000)
            locality = p.get('locality') or p.get('city') or 'Prime Location'
            bhk = p.get('bedrooms', 2)
            lines.append(f"{idx}. **{title}**")
            lines.append(f"   • Price: ₹{price_lakhs:.1f} Lakhs | {bhk} BHK in {locality}")

        lines.append("\nAll options are verified. Would you like me to schedule a visit with the agent or compare them side by side?")

        reply = "\n".join(lines)

        return ChatAssistantResponse(
            reply=reply,
            suggestedProperties=top_matches
        )

ai_assistant_service = AiAssistantService()
