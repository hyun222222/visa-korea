import streamlit as st
import sys
import os

# Add project root to python path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.pages import content_gen_page, comparison_page, report_page

st.set_page_config(
    page_title="SEO Content Agent",
    page_icon="🤖",
    layout="wide"
)

def main():
    st.sidebar.title("SEO Automation Agent")
    
    page = st.sidebar.radio(
        "Select Feature",
        ["Content Gen", "Comparison", "Report"]
    )
    
    st.sidebar.markdown("---")
    st.sidebar.info(
        """
        **Features:**
        - **Content Gen**: Deep research & blog writing.
        - **Comparison**: Product vs Product analysis.
        - **Report**: Keyword trends & slide summaries.
        """
    )

    if page == "Content Gen":
        content_gen_page.render()
    elif page == "Comparison":
        comparison_page.render()
    elif page == "Report":
        report_page.render()

if __name__ == "__main__":
    main()
