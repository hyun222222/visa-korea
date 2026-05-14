import json
from typing import List, Dict
from ..services.llm_client import llm_client
from ..services.search_client import search_client
from ..services.db_client import db_client
from ..core.models import CompetitorArticle, ContentPlan

class SEOResearchAgent:
    """Agent for Deep SEO Research and Content Generation."""

    def run(self, keyword: str, tone: str = "Professional", target_audience: str = "General") -> Dict:
        """
        Execute the full SEO content generation workflow.
        Returns a dictionary containing research data, content plan, and final draft.
        """
        print(f"Starting SEO Research for: {keyword}")
        
        # Step 1: Competitor Analysis
        competitors = self._analyze_competitors(keyword)
        
        # Step 2: Content Planning
        plan = self._create_content_plan(keyword, competitors, target_audience)
        
        # Step 3: Write Draft
        draft = self._write_draft(keyword, plan, tone, target_audience)
        
        # Save to DB
        self._save_results(keyword, competitors, plan, draft)
        
        return {
            "competitors": [c.model_dump() for c in competitors],
            "plan": plan.model_dump(),
            "draft": draft
        }

    def _analyze_competitors(self, keyword: str) -> List[CompetitorArticle]:
        """Search and analyze top competitor articles."""
        results = search_client.search(f"{keyword} blog post", max_results=3)
        analyzed_articles = []
        
        for res in results:
            # Use LLM to extract structure from raw content/snippet
            # In a real scenario, we might scrape the full URL content here.
            # For now, we rely on the snippet provided by the search API.
            prompt = f"""
            Analyze the following search result snippet for the keyword '{keyword}'.
            Extract the likely H-structure, main keywords, and a brief summary.
            
            Title: {res.get('title')}
            URL: {res.get('url')}
            Content Snippet: {res.get('content')}
            """
            
            try:
                article_data = llm_client.generate_structured(
                    "You are an SEO analyst. Extract structured data from the provided content.",
                    prompt,
                    CompetitorArticle
                )
                # Ensure URL and Title are preserved from search result if LLM hallucinates
                article_data.url = res.get('url')
                article_data.title = res.get('title')
                analyzed_articles.append(article_data)
            except Exception as e:
                print(f"Error analyzing article {res.get('url')}: {e}")
                
        return analyzed_articles

    def _create_content_plan(self, keyword: str, competitors: List[CompetitorArticle], audience: str) -> ContentPlan:
        """Generate an SEO content plan based on competitor analysis."""
        competitor_summaries = "\n".join([f"- {c.title}: {c.summary}" for c in competitors])
        
        prompt = f"""
        Create a comprehensive SEO content plan for the keyword '{keyword}'.
        Target Audience: {audience}
        
        Competitor Insights:
        {competitor_summaries}
        
        The plan should include 3 catchy title candidates, a final H1, a detailed outline (H2/H3), and target keywords.
        """
        
        return llm_client.generate_structured(
            "You are an expert SEO Content Strategist.",
            prompt,
            ContentPlan
        )

    def _write_draft(self, keyword: str, plan: ContentPlan, tone: str, audience: str) -> str:
        """Write the full blog post draft in Markdown."""
        prompt = f"""
        Write a high-quality, SEO-optimized blog post based on the following plan.
        
        Keyword: {keyword}
        Tone: {tone}
        Audience: {audience}
        
        Title: {plan.final_h1}
        Outline: {json.dumps(plan.outline)}
        Target Keywords: {", ".join(plan.target_keywords)}
        
        Requirements:
        - Use Markdown formatting.
        - Include an Introduction, Body (following the outline), Conclusion, and FAQ (5 questions).
        - Ensure the content is engaging and valuable.
        """
        
        return llm_client.generate_text(
            "You are a professional SEO copywriter.",
            prompt
        )

    def _save_results(self, keyword: str, competitors: List[CompetitorArticle], plan: ContentPlan, draft: str):
        """Save research and draft to database."""
        # Save Research
        comp_data = json.dumps([c.model_dump() for c in competitors])
        db_client.save_research(keyword, comp_data)
        
        # Save Draft
        meta = json.dumps(plan.model_dump())
        db_client.save_draft(keyword, plan.final_h1, draft, meta)

# Singleton instance
seo_research_agent = SEOResearchAgent()
