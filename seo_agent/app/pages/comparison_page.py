import streamlit as st
from app.agents.comparison_agent import comparison_agent

def render():
    st.title("Comparison Article Agent")
    st.markdown("Create detailed product comparison articles with tables and buying guides.")

    with st.form("comparison_form"):
        keyword = st.text_input("Comparison Keyword (A vs B)", placeholder="e.g., iPhone 15 vs Galaxy S24")
        criteria = st.text_input("Focus Criteria (Optional)", placeholder="e.g., Camera, Battery, Price")
        
        submitted = st.form_submit_button("Compare & Write")

    if submitted and keyword:
        with st.spinner("Gathering specs and writing comparison..."):
            try:
                result = comparison_agent.run(keyword, criteria if criteria else "General Specs")
                
                if "error" in result:
                    st.error(result["error"])
                else:
                    st.success("Comparison Complete!")
                    
                    st.subheader("Comparison Table")
                    st.dataframe(result["table"], use_container_width=True)
                    
                    st.subheader("Comparison Article")
                    st.markdown(result["article"])
                    
                    st.download_button(
                        "Download Article",
                        result["article"],
                        file_name=f"{keyword.replace(' ', '_')}_comparison.md"
                    )
            except Exception as e:
                st.error(f"An error occurred: {e}")
