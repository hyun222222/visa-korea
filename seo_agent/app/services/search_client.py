from tavily import TavilyClient
from typing import List, Dict, Any
from ..core.config import Config

class SearchClient:
    """Service for performing web searches."""
    
    def __init__(self):
        self.provider = Config.SEARCH_PROVIDER
        if self.provider == "tavily":
            self.client = TavilyClient(api_key=Config.TAVILY_API_KEY)
        else:
            # Placeholder for Perplexity or other providers
            self.client = None

    def search(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """
        Perform a search and return a list of results.
        Each result dict should contain 'url', 'title', 'content'.
        """
        if self.provider == "tavily":
            try:
                response = self.client.search(query, search_depth="advanced", max_results=max_results)
                return response.get("results", [])
            except Exception as e:
                print(f"Search error: {e}")
                return []
        elif self.provider == "perplexity":
            # Implement Perplexity API call here if needed
            # For now, return empty or raise NotImplemented
            print("Perplexity search not fully implemented yet.")
            return []
        else:
            return []

# Singleton instance
search_client = SearchClient()
