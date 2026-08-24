import re
import os
import json
import httpx
from app.schemas.schemas import ParseQueryRequest, ParseQueryResponse

class NlpQueryParserService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    async def parse_prompt(self, req: ParseQueryRequest) -> ParseQueryResponse:
        prompt = req.prompt.strip()

        # Try Gemini API if key is available
        if self.api_key and len(self.api_key) > 10:
            try:
                system_instruction = (
                    "You are a real estate search query parameter extractor. "
                    "Convert the natural language user prompt into structured JSON search parameters. "
                    "Allowed keys: location, city, locality, propertyType (Apartment/Villa/Independent House/Commercial Property), "
                    "bedrooms (number), maxPrice (number in local currency), minPrice (number), parking (boolean), nearSchools (boolean). "
                    "Respond with pure valid JSON only, no markdown markdown blocks."
                )

                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.api_key}"
                payload = {
                    "contents": [{
                        "parts": [
                            {"text": f"{system_instruction}\nUser prompt: '{prompt}'"}
                        ]
                    }]
                }

                async with httpx.AsyncClient() as client:
                    resp = await client.post(url, json=payload, timeout=5.0)
                    if resp.status_code == 200:
                        res_json = resp.json()
                        text = res_json['candidates'][0]['content']['parts'][0]['text']
                        text_clean = text.replace("```json", "").replace("```", "").strip()
                        extracted = json.loads(text_clean)
                        return ParseQueryResponse(structured_query=extracted, confidence=0.95)
            except Exception as e:
                print(f"[NLP Parser API Error]: {e}")

        # Robust NLP rule-based entity extractor fallback
        extracted = {}
        prompt_lower = prompt.lower()

        # Property type
        if 'apartment' in prompt_lower or 'flat' in prompt_lower:
            extracted['propertyType'] = 'Apartment'
        elif 'villa' in prompt_lower:
            extracted['propertyType'] = 'Villa'
        elif 'house' in prompt_lower:
            extracted['propertyType'] = 'Independent House'

        # Bedrooms
        bhk = re.search(r'(\d+)\s*bhk', prompt_lower)
        if bhk:
            extracted['bedrooms'] = int(bhk.group(1))

        # Price parsing (Lakhs / Crores / Lakhs under/below)
        lakh = re.search(r'(\d+)\s*(lakh|lakhs|l)', prompt_lower)
        if lakh:
            extracted['maxPrice'] = int(lakh.group(1)) * 100000

        cr = re.search(r'(\d+(\.\d+)?)\s*(cr|crore|crores)', prompt_lower)
        if cr:
            extracted['maxPrice'] = int(float(cr.group(1)) * 10000000)

        # Location extraction
        localities = ['omr', 'velachery', 'adyar', 'ecr', 'anna nagar', 'indiranagar', 'koramangala', 'whitefield', 'bandra', 'powai']
        for loc in localities:
            if loc in prompt_lower:
                extracted['locality'] = loc.upper() if len(loc) <= 3 else loc.title()
                break

        cities = ['chennai', 'bangalore', 'mumbai', 'delhi', 'hyderabad']
        for c in cities:
            if c in prompt_lower:
                extracted['city'] = c.title()
                break

        if 'parking' in prompt_lower:
            extracted['parking'] = True
        if 'school' in prompt_lower:
            extracted['nearSchools'] = True

        return ParseQueryResponse(structured_query=extracted, confidence=0.88)

nlp_parser_service = NlpQueryParserService()
