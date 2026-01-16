"""
Application configuration management.
"""

from pathlib import Path
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    app_name: str = "Aether"
    app_version: str = "0.1.0"
    debug: bool = True

    # Paths
    base_dir: Path = Path(__file__).parent.parent
    data_dir: Path = base_dir / "data"

    # ChromaDB
    chroma_persist_dir: str = str(base_dir / "data" / "chroma_db")
    chroma_collection_name: str = "physio_rules"

    # Embedding Model
    embedding_model: str = "all-MiniLM-L6-v2"

    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_base_url: str = "https://newapi.deepwisdom.ai/v1"
    openai_model: str = "gpt-4o"

    # PayPal Configuration
    paypal_client_id: Optional[str] = None
    paypal_client_secret: Optional[str] = None
    paypal_mode: str = "sandbox"  # sandbox or live

    # API Settings
    api_prefix: str = "/api"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
