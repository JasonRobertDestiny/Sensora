"""
AI Service for Scent Analysis using OpenAI.
Transforms user emotional input into fragrance formulations.
"""

import json
import re
from typing import Optional
from dataclasses import dataclass, asdict
from openai import OpenAI

from app.config import settings


@dataclass
class ScentRecommendation:
    """AI-generated scent recommendation."""
    primary_family: str
    secondary_family: str
    mood_interpretation: str
    top_notes: list[str]
    heart_notes: list[str]
    base_notes: list[str]
    intensity: str  # light, moderate, intense
    longevity: str  # ephemeral, moderate, long-lasting
    occasion: str
    personality_match: str
    confidence_score: float


@dataclass
class FormulaRecommendation:
    """Complete formula with ingredients and percentages."""
    name: str
    description: str
    ingredients: list[dict]  # [{name, percentage, note_type, purpose}]
    total_concentration: float
    sustainability_score: float
    ifra_compliant: bool
    physio_adjustments: list[str]


class AIScentAnalyzer:
    """
    AI-powered scent analysis engine using OpenAI.
    Interprets emotional states and physiological data to generate
    personalized fragrance recommendations.
    """

    SCENT_FAMILIES = [
        "Floral", "Oriental", "Woody", "Fresh", "Citrus",
        "Aromatic", "Chypre", "Fougere", "Gourmand", "Aquatic"
    ]

    SYSTEM_PROMPT = """You are Aether, an expert AI perfumer with deep knowledge of:
- Fragrance chemistry and molecular interactions
- Emotion-to-scent mapping based on neurological research
- IFRA safety guidelines and regulations
- Sustainability in perfumery

Your role is to analyze emotional states and physiological data to create
personalized fragrance formulations. You understand the circumplex model of
affect (valence-arousal) and how different scent molecules affect mood.

Always respond in valid JSON format."""

    ANALYSIS_PROMPT_TEMPLATE = """Analyze this emotional input and physiological profile to recommend a fragrance:

**User Emotional Input:**
{emotional_input}

**Mood Coordinates (Circumplex Model):**
- Valence: {valence} (range: -1 to 1, negative=unpleasant, positive=pleasant)
- Arousal: {arousal} (range: -1 to 1, low=calm, high=excited)

**Physiological Profile:**
- Skin pH: {ph}
- Skin Type: {skin_type}
- Body Temperature: {temperature}C

Based on this information, provide a scent recommendation in this exact JSON format:
{{
    "primary_family": "one of: Floral, Oriental, Woody, Fresh, Citrus, Aromatic, Chypre, Fougere, Gourmand, Aquatic",
    "secondary_family": "complementary family",
    "mood_interpretation": "2-3 sentence interpretation of the emotional state",
    "top_notes": ["3-4 specific ingredients"],
    "heart_notes": ["3-4 specific ingredients"],
    "base_notes": ["2-3 specific ingredients"],
    "intensity": "light/moderate/intense",
    "longevity": "ephemeral/moderate/long-lasting",
    "occasion": "suggested occasion for this fragrance",
    "personality_match": "personality traits this fragrance suits",
    "confidence_score": 0.85
}}"""

    FORMULA_PROMPT_TEMPLATE = """Based on this scent recommendation, create a complete perfume formula:

**Recommendation:**
{recommendation}

**Physiological Constraints:**
- Skin pH: {ph} (affects volatility and projection)
- Skin Type: {skin_type} (affects longevity)
- Temperature: {temperature}C (affects diffusion)

Create an IFRA-compliant formula with specific percentages. Respond in this exact JSON format:
{{
    "name": "creative fragrance name",
    "description": "evocative 2-3 sentence description",
    "ingredients": [
        {{"name": "ingredient name", "percentage": 5.0, "note_type": "top/heart/base", "purpose": "brief purpose"}},
        ...
    ],
    "total_concentration": 15.0,
    "sustainability_score": 0.75,
    "ifra_compliant": true,
    "physio_adjustments": ["list of adjustments made for user's physiology"]
}}

Ensure total_concentration is between 10-20% for Eau de Parfum.
Include 8-12 ingredients total."""

    def __init__(self):
        self._client: Optional[OpenAI] = None

    def _get_client(self) -> OpenAI:
        """Get or create OpenAI client."""
        if self._client is None:
            if not settings.openai_api_key:
                raise ValueError("OPENAI_API_KEY not configured")
            self._client = OpenAI(
                api_key=settings.openai_api_key,
                base_url=settings.openai_base_url
            )
        return self._client

    def _parse_json_response(self, content: str) -> dict:
        """Robustly parse JSON from LLM response."""
        # Try direct parse first
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            pass

        # Try extracting JSON from markdown code blocks
        json_match = re.search(r'```(?:json)?\s*([\s\S]*?)\s*```', content)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass

        # Try finding JSON object in text
        json_match = re.search(r'\{[\s\S]*\}', content)
        if json_match:
            try:
                return json.loads(json_match.group(0))
            except json.JSONDecodeError:
                pass

        raise ValueError(f"Could not parse JSON from response: {content[:200]}...")

    async def analyze_emotional_input(
        self,
        emotional_input: str,
        valence: float,
        arousal: float,
        ph: float = 5.5,
        skin_type: str = "normal",
        temperature: float = 36.5
    ) -> ScentRecommendation:
        """
        Analyze emotional input and return scent recommendation.

        Args:
            emotional_input: Natural language description of desired mood/feeling
            valence: Pleasure dimension (-1 to 1)
            arousal: Energy dimension (-1 to 1)
            ph: Skin pH level
            skin_type: dry, normal, or oily
            temperature: Body temperature in Celsius

        Returns:
            ScentRecommendation with AI-generated fragrance profile
        """
        client = self._get_client()

        prompt = self.ANALYSIS_PROMPT_TEMPLATE.format(
            emotional_input=emotional_input,
            valence=valence,
            arousal=arousal,
            ph=ph,
            skin_type=skin_type,
            temperature=temperature
        )

        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        content = response.choices[0].message.content or ""
        data = self._parse_json_response(content)

        return ScentRecommendation(
            primary_family=data.get("primary_family", "Fresh"),
            secondary_family=data.get("secondary_family", "Floral"),
            mood_interpretation=data.get("mood_interpretation", ""),
            top_notes=data.get("top_notes", []),
            heart_notes=data.get("heart_notes", []),
            base_notes=data.get("base_notes", []),
            intensity=data.get("intensity", "moderate"),
            longevity=data.get("longevity", "moderate"),
            occasion=data.get("occasion", "everyday"),
            personality_match=data.get("personality_match", ""),
            confidence_score=data.get("confidence_score", 0.8)
        )

    async def generate_formula(
        self,
        recommendation: ScentRecommendation,
        ph: float = 5.5,
        skin_type: str = "normal",
        temperature: float = 36.5
    ) -> FormulaRecommendation:
        """
        Generate complete formula from scent recommendation.

        Args:
            recommendation: ScentRecommendation from analyze_emotional_input
            ph: Skin pH level
            skin_type: dry, normal, or oily
            temperature: Body temperature

        Returns:
            FormulaRecommendation with complete ingredient list
        """
        client = self._get_client()

        prompt = self.FORMULA_PROMPT_TEMPLATE.format(
            recommendation=json.dumps(asdict(recommendation), indent=2),
            ph=ph,
            skin_type=skin_type,
            temperature=temperature
        )

        response = client.chat.completions.create(
            model=settings.openai_model,
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        content = response.choices[0].message.content or ""
        data = self._parse_json_response(content)

        return FormulaRecommendation(
            name=data.get("name", "Custom Fragrance"),
            description=data.get("description", ""),
            ingredients=data.get("ingredients", []),
            total_concentration=data.get("total_concentration", 15.0),
            sustainability_score=data.get("sustainability_score", 0.7),
            ifra_compliant=data.get("ifra_compliant", True),
            physio_adjustments=data.get("physio_adjustments", [])
        )

    async def full_analysis(
        self,
        emotional_input: str,
        valence: float,
        arousal: float,
        ph: float = 5.5,
        skin_type: str = "normal",
        temperature: float = 36.5
    ) -> dict:
        """
        Complete analysis: emotional input -> recommendation -> formula.

        Returns dict with both recommendation and formula.
        """
        recommendation = await self.analyze_emotional_input(
            emotional_input=emotional_input,
            valence=valence,
            arousal=arousal,
            ph=ph,
            skin_type=skin_type,
            temperature=temperature
        )

        formula = await self.generate_formula(
            recommendation=recommendation,
            ph=ph,
            skin_type=skin_type,
            temperature=temperature
        )

        return {
            "recommendation": asdict(recommendation),
            "formula": asdict(formula)
        }


# Singleton instance
ai_analyzer = AIScentAnalyzer()
