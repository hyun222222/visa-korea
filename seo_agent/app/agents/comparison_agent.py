import pandas as pd
from typing import Dict, List
from ..services.llm_client import llm_client
from ..services.search_client import search_client
from ..core.models import ProductInfo

class ComparisonAgent:
    """Agent for creating Comparison Articles (A vs B)."""

    def run(self, comparison_keyword: str, criteria: str = "General Specs") -> Dict:
        """
        Execute the comparison workflow.
        Returns a dictionary with the comparison table (DataFrame) and the article text.
        """
        print(f"Starting Comparison for: {comparison_keyword}")
        
        # Step 1: Identify Entities
        entities = self._identify_entities(comparison_keyword)
        if len(entities) != 2:
            return {"error": "Could not identify two distinct entities for comparison."}
        
        entity_a, entity_b = entities
        
        # Step 2: Gather Info
        info_a = self._get_product_info(entity_a, criteria)
        info_b = self._get_product_info(entity_b, criteria)
        
        # Step 3: Create Table
        df = self._create_comparison_table(info_a, info_b)
        
        # Step 4: Write Article
        article = self._write_comparison_article(comparison_keyword, info_a, info_b, df)
        
        return {
            "table": df,
            "article": article
        }

    def _identify_entities(self, keyword: str) -> List[str]:
        """Parse the 'A vs B' string to extract entity names."""
        prompt = f"Extract the two main entities being compared in the query: '{keyword}'. Return them as a comma-separated list (e.g., 'iPhone 15, Galaxy S24')."
        response = llm_client.generate_text("You are a helpful assistant.", prompt)
        return [e.strip() for e in response.split(",") if e.strip()]

    def _get_product_info(self, product_name: str, criteria: str) -> ProductInfo:
        """Search and extract product information."""
        results = search_client.search(f"{product_name} specs review {criteria}", max_results=3)
        context = "\n".join([r.get('content', '') for r in results])
        
        prompt = f"""
        Extract detailed product information for '{product_name}' based on the following search results.
        Focus on criteria: {criteria}.
        
        Search Context:
        {context[:4000]} # Truncate to avoid token limits
        """
        
        try:
            return llm_client.generate_structured(
                "You are a product researcher.",
                prompt,
                ProductInfo
            )
        except Exception as e:
            print(f"Error getting info for {product_name}: {e}")
            # Return dummy info on failure
            return ProductInfo(name=product_name, specs={}, price="Unknown", pros=[], cons=[])

    def _create_comparison_table(self, info_a: ProductInfo, info_b: ProductInfo) -> pd.DataFrame:
        """Create a pandas DataFrame comparing the two products."""
        # Merge specs keys
        all_keys = set(info_a.specs.keys()) | set(info_b.specs.keys())
        
        data = []
        for key in all_keys:
            data.append({
                "Feature": key,
                info_a.name: info_a.specs.get(key, "-"),
                info_b.name: info_b.specs.get(key, "-")
            })
            
        # Add Price row
        data.append({
            "Feature": "Price",
            info_a.name: info_a.price,
            info_b.name: info_b.price
        })
        
        return pd.DataFrame(data)

    def _write_comparison_article(self, keyword: str, info_a: ProductInfo, info_b: ProductInfo, df: pd.DataFrame) -> str:
        """Write the comparison article with a buying guide."""
        table_markdown = df.to_markdown(index=False)
        
        prompt = f"""
        Write a detailed comparison article for '{keyword}'.
        
        Product A: {info_a.name}
        - Pros: {', '.join(info_a.pros)}
        - Cons: {', '.join(info_a.cons)}
        
        Product B: {info_b.name}
        - Pros: {', '.join(info_b.pros)}
        - Cons: {', '.join(info_b.cons)}
        
        Comparison Table:
        {table_markdown}
        
        Structure:
        1. Introduction (Who is this comparison for?)
        2. Detailed Comparison (Analyze key differences based on the table)
        3. Pros & Cons Analysis
        4. Buying Guide / Verdict (Who should buy what?)
        """
        
        return llm_client.generate_text(
            "You are a tech reviewer and shopping guide expert.",
            prompt
        )

# Singleton instance
comparison_agent = ComparisonAgent()
