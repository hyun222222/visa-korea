import streamlit as st
from app.agents.report_agent import report_agent
import plotly.express as px

def render():
    st.title("Keyword Report & Slide Automation")
    st.markdown("Analyze keyword trends and generate slide summaries.")

    keyword = st.text_input("Enter Keyword for Report", placeholder="e.g., SEO Automation")
    
    if st.button("Generate Report"):
        if keyword:
            with st.spinner("Generating report data..."):
                try:
                    result = report_agent.run(keyword)
                    df = result["data"]
                    slide_text = result["slide_text"]
                    
                    # Metrics
                    col1, col2, col3 = st.columns(3)
                    col1.metric("Total Clicks", f"{df['Clicks'].sum():,}")
                    col2.metric("Avg CTR", f"{df['CTR'].mean():.2f}%")
                    col3.metric("Avg Position", "3.2") # Mock value
                    
                    # Charts
                    st.subheader("Search Volume Trend")
                    fig_vol = px.line(df, x="Date", y="Search Volume", title="Daily Search Volume")
                    st.plotly_chart(fig_vol, use_container_width=True)
                    
                    st.subheader("CTR Trend")
                    fig_ctr = px.line(df, x="Date", y="CTR", title="Daily CTR (%)")
                    st.plotly_chart(fig_ctr, use_container_width=True)
                    
                    # Slide Text
                    st.subheader("Slide Deck Outline")
                    st.text_area("Copy this for your slides:", value=slide_text, height=300)
                    
                except Exception as e:
                    st.error(f"An error occurred: {e}")
        else:
            st.warning("Please enter a keyword.")
