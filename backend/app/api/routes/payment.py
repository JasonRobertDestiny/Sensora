"""
Payment API endpoints using PayPal.
Handles order creation and payment capture for formula purchases.
"""

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
import base64

from app.config import settings

router = APIRouter()


class CreateOrderRequest(BaseModel):
    """Request to create a PayPal order."""
    formula_id: str = Field(..., description="ID of the formula being purchased")
    formula_name: str = Field(..., description="Name of the formula")
    amount: float = Field(..., ge=0.01, description="Price in USD")
    currency: str = Field(default="USD", description="Currency code")


class CreateOrderResponse(BaseModel):
    """Response with PayPal order details."""
    order_id: str
    approval_url: str
    status: str


class CaptureOrderRequest(BaseModel):
    """Request to capture a PayPal payment."""
    order_id: str = Field(..., description="PayPal order ID to capture")


class CaptureOrderResponse(BaseModel):
    """Response after payment capture."""
    order_id: str
    status: str
    payer_email: Optional[str] = None
    transaction_id: Optional[str] = None


class PayPalClient:
    """PayPal REST API client."""

    SANDBOX_URL = "https://api-m.sandbox.paypal.com"
    LIVE_URL = "https://api-m.paypal.com"

    def __init__(self):
        self._access_token: Optional[str] = None

    @property
    def base_url(self) -> str:
        return self.SANDBOX_URL if settings.paypal_mode == "sandbox" else self.LIVE_URL

    async def _get_access_token(self) -> str:
        """Get PayPal OAuth access token."""
        if not settings.paypal_client_id or not settings.paypal_client_secret:
            raise ValueError("PayPal credentials not configured")

        auth = base64.b64encode(
            f"{settings.paypal_client_id}:{settings.paypal_client_secret}".encode()
        ).decode()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                headers={
                    "Authorization": f"Basic {auth}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                content="grant_type=client_credentials"
            )

            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to authenticate with PayPal")

            data = response.json()
            self._access_token = data.get("access_token", "")
            return self._access_token

    async def create_order(self, amount: float, currency: str, description: str) -> dict:
        """Create a PayPal order."""
        token = await self._get_access_token()

        order_data = {
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency,
                    "value": f"{amount:.2f}"
                },
                "description": description
            }]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json=order_data
            )

            if response.status_code not in (200, 201):
                raise HTTPException(status_code=500, detail="Failed to create PayPal order")

            return response.json()

    async def capture_order(self, order_id: str) -> dict:
        """Capture payment for an order."""
        token = await self._get_access_token()

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v2/checkout/orders/{order_id}/capture",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
            )

            if response.status_code not in (200, 201):
                raise HTTPException(status_code=500, detail="Failed to capture PayPal payment")

            return response.json()


paypal_client = PayPalClient()


@router.post("/create-order", response_model=CreateOrderResponse)
async def create_order(request: CreateOrderRequest):
    """
    Create a PayPal order for formula purchase.

    Returns an approval URL where the user should be redirected to complete payment.
    """
    if not settings.paypal_client_id:
        raise HTTPException(status_code=503, detail="Payment service not configured")

    description = f"Aether Custom Fragrance: {request.formula_name}"

    result = await paypal_client.create_order(
        amount=request.amount,
        currency=request.currency,
        description=description
    )

    # Find approval link
    approval_url = ""
    for link in result.get("links", []):
        if link.get("rel") == "approve":
            approval_url = link.get("href", "")
            break

    return CreateOrderResponse(
        order_id=result.get("id", ""),
        approval_url=approval_url,
        status=result.get("status", "CREATED")
    )


@router.post("/capture-order", response_model=CaptureOrderResponse)
async def capture_order(request: CaptureOrderRequest):
    """
    Capture payment for an approved PayPal order.

    Call this after the user has approved the payment on PayPal.
    """
    if not settings.paypal_client_id:
        raise HTTPException(status_code=503, detail="Payment service not configured")

    result = await paypal_client.capture_order(request.order_id)

    # Extract payer info
    payer = result.get("payer", {})
    payer_email = payer.get("email_address")

    # Extract transaction ID
    transaction_id = None
    purchase_units = result.get("purchase_units", [])
    if purchase_units:
        captures = purchase_units[0].get("payments", {}).get("captures", [])
        if captures:
            transaction_id = captures[0].get("id")

    return CaptureOrderResponse(
        order_id=result.get("id", ""),
        status=result.get("status", ""),
        payer_email=payer_email,
        transaction_id=transaction_id
    )


@router.get("/config")
async def get_paypal_config():
    """
    Get PayPal client configuration for frontend SDK.

    Returns the client ID needed to initialize PayPal buttons.
    """
    if not settings.paypal_client_id:
        raise HTTPException(status_code=503, detail="Payment service not configured")

    return {
        "client_id": settings.paypal_client_id,
        "currency": "USD",
        "intent": "capture"
    }
