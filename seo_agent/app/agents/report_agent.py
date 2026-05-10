import pandas as pd
import numpy as np
from typing import Dict
from ..services.llm_client import llm_client

class ReportAgent:
    """Agent for Keyword Reporting and Slide Text Generation."""

    def run(self, keyword: str) -> Dict:
        """
        Generate report data and slide text.
        """
        # Step 1: Generate Mock Data
        df = self._generate_mock_data(keyword)
        
        # Step 2: Generate Slide Text
        slide_text = self._generate_slide_text(keyword, df)
        
        return {
            "data": df,
            "slide_text": slide_text
        }

    def _generate_mock_data(self, keyword: str) -> pd.DataFrame:
        """Generate mock time-series data for the keyword."""
        dates = pd.date_range(start="2024-01-01", periods=90)
        
        # Random trend with some seasonality or noise
        base_vol = np.random.randint(1000, 5000)
        trend = np.linspace(0, 500, 90)
        noise = np.random.normal(0, 100, 90)
        
        search_volume = base_vol + trend + noise
        clicks = search_volume * np.random.uniform(0.05, 0.15, 90) # 5-15% CTR
        ctr = (clicks / search_volume) * 100
        
        df = pd.DataFrame({
            "Date": dates,
            "Search Volume": search_volume.astype(int),
            "Clicks": clicks.astype(int),
            "CTR": ctr.round(2)
        })
        return df

    def _generate_slide_text(self, keyword: str, df: pd.DataFrame) -> str:
        """Generate text for Google Slides based on the data."""
        # Calculate summary stats
        avg_ctr = df["CTR"].mean()
        total_clicks = df["Clicks"].sum()
        growth = ((df["Search Volume"].iloc[-1] - df["Search Volume"].iloc[0]) / df["Search Volume"].iloc[0]) * 100
        
        prompt = f"""
        Create a slide deck outline for a marketing report on the keyword '{keyword}'.
        
        Data Summary:
        - Total Clicks (Last 90 days): {total_clicks}
        - Average CTR: {avg_ctr:.2f}%
        - Search Volume Growth: {growth:.2f}%
        
        Format the output as a Markdown list, where each item is a slide.
        Example:
        # Slide 1: Title
        - Bullet point
        
        Required Slides:
        1. Title & Executive Summary
        2. Key Performance Indicators (KPIs)
        3. Trend Analysis (Growth/Decline)
        4. Strategic Recommendations
        """
        
        return llm_client.generate_text(
            "You are a marketing data analyst.",
            prompt
        )

# Singleton instance
report_agent = ReportAgent()
