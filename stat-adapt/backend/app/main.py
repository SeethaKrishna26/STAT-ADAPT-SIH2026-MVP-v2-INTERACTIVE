import streamlit as st

# Page config
st.set_page_config(
    page_title="AI Travel Agent",
    page_icon="✈️",
    layout="wide"
)

# Title
st.title("🌍 AI Travel Agent")
st.subheader("Plan your trips smartly with AI")

# Sidebar
st.sidebar.title("🧭 Controls")

destination = st.sidebar.text_input("Enter Destination")
days = st.sidebar.number_input("Number of Days", min_value=1, max_value=30, value=3)

budget = st.sidebar.number_input("Budget (INR)", min_value=1000, value=10000)

# Main UI
if st.button("Generate Travel Plan 🚀"):

    if destination == "":
        st.warning("Please enter a destination")
    else:
        st.success("Your Travel Plan is being generated...")

        st.write("## 📍 Trip Details")
        st.write(f"**Destination:** {destination}")
        st.write(f"**Days:** {days}")
        st.write(f"**Budget:** ₹{budget}")

        st.write("## 🗺️ Sample Plan")

        for i in range(1, days + 1):
            st.write(f"### Day {i}")
            st.write("- Morning: Explore local attractions")
            st.write("- Afternoon: Visit famous spots")
            st.write("- Evening: Food & relaxation")

        st.info("⚡ This is a demo plan. You can connect your AI/LLM logic here.")
