import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    """Application configuration loaded from environment variables."""
    
    # LLM Settings
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai").lower()
    LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o")
    
    # Search Settings
    SEARCH_PROVIDER = os.getenv("SEARCH_PROVIDER", "tavily").lower()
    TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
    PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")
    
    # Database Settings
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./seo_agent.db")

    @classmethod
    def validate(cls):
        """Validate that necessary API keys are present based on provider choices."""
        if cls.LLM_PROVIDER == "openai" and not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY is required for OpenAI provider.")
        if cls.LLM_PROVIDER == "anthropic" and not cls.ANTHROPIC_API_KEY:
            raise ValueError("ANTHROPIC_API_KEY is required for Anthropic provider.")
            
        if cls.SEARCH_PROVIDER == "tavily" and not cls.TAVILY_API_KEY:
            raise ValueError("TAVILY_API_KEY is required for Tavily provider.")
        if cls.SEARCH_PROVIDER == "perplexity" and not cls.PERPLEXITY_API_KEY:
            raise ValueError("PERPLEXITY_API_KEY is required for Perplexity provider.")
