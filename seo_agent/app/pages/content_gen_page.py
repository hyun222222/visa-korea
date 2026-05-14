import streamlit as st
from app.agents.seo_research_agent import seo_research_agent

def render():
    st.title("Deep SEO Research & Content Generator")
    st.markdown("Generate high-quality, SEO-optimized blog posts based on competitor analysis.")

    with st.form("content_gen_form"):
        col1, col2 = st.columns(2)
        with col1:
            keyword = st.text_input("Main Keyword", placeholder="e.g., AI Marketing Tools")
            target_audience = st.text_input("Target Audience", value="General")
        with col2:
            tone = st.selectbox("Tone", ["Professional", "Friendly", "Marketing", "Technical"])
            language = st.selectbox("Language", ["Korean", "English"])

        submitted = st.form_submit_button("Generate Content")

    if submitted and keyword:
        with st.spinner("Analyzing competitors and drafting content... This may take a minute."):
            try:
                # Pass language to agent if needed, currently agent defaults to English prompts but can be adjusted.
                # For now, we assume the user input language drives the output.
                result = seo_research_agent.run(keyword, tone, target_audience)
                
                # Display Results
                st.success("Content Generated Successfully!")
                
                tab1, tab2, tab3 = st.tabs(["Draft", "Content Plan", "Competitor Analysis"])
                
                with tab1:
                    st.subheader("Blog Post Draft")
                    st.markdown(result["draft"])
                    st.download_button(
                        "Download Markdown",
                        result["draft"],
                        file_name=f"{keyword.replace(' ', '_')}_draft.md"
                    )
                
                with tab2:
                    st.subheader("Content Strategy")
                    st.json(result["plan"])
                
                with tab3:
                    st.subheader("Competitor Insights")
                    st.json(result["competitors"])
                    
            except Exception as e:
                st.error(f"An error occurred: {e}")
