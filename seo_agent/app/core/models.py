from typing import List, Optional
from pydantic import BaseModel, Field

class CompetitorArticle(BaseModel):
    """Model representing a competitor's article analysis."""
    url: str
    title: str
    h_structure: List[str] = Field(description="List of H1, H2, H3 headers found")
    keywords: List[str] = Field(description="Main keywords extracted from the article")
    summary: str = Field(description="Brief summary of the content")

class ContentPlan(BaseModel):
    """Model representing the SEO content structure plan."""
    title_candidates: List[str] = Field(description="3 SEO-optimized title suggestions")
    final_h1: str = Field(description="Selected H1 title")
    outline: List[str] = Field(description="Detailed outline with H2/H3 structure")
    target_keywords: List[str] = Field(description="Primary and secondary keywords to target")

class ProductInfo(BaseModel):
    """Model representing product information for comparison."""
    name: str
    specs: dict = Field(description="Key-value pairs of specifications")
    price: str = Field(description="Approximate price or price range")
    pros: List[str]
    cons: List[str]
    use_cases: List[str] = Field(description="Best for... scenarios")

class ComparisonTable(BaseModel):
    """Model for the comparison table data."""
    headers: List[str]
    rows: List[dict] = Field(description="List of rows, where each row is a dict of header: value")
