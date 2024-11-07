import streamlit as st
import pandas as pd
from datetime import datetime as dt
from streamlit_autorefresh import st_autorefresh

# Set up the dark theme with a custom page title and icon
st.set_page_config(page_title="KHARCHI APP",
                   layout="wide", page_icon="📊")

# Auto-refresh to keep data up-to-date
st_autorefresh(interval=1000, limit=100, key="data_refresh")

# Center-aligned title
st.markdown("<h1 style='text-align: center;'>🌑 KHARCHI APP </h1>",
            unsafe_allow_html=True)
st.markdown("<h4 style='text-align: center;'>Keep you daily expenses with ease </h4>",
            unsafe_allow_html=True)

krh = pd.read_csv("./demo.csv")

# Display the DataFrame with increased height and width and center it
st.markdown("<h3 style='text-align: center;'>📊 Current Data</h3>",
            unsafe_allow_html=True)
st.dataframe(krh, width=1000)

# Define actions in a sidebar for better layout
st.sidebar.header("Select Action")
action = st.sidebar.selectbox("Choose action to perform", [
                              "Sum Prices", "Describe Data", "Add Entry"])

# Placeholder for dynamic content
dis = st.empty()

# Perform actions based on selection
if action == "Sum Prices":
    # Display the sum of the 'Price' column
    total_price = krh['Price'].sum()
    dis.markdown(f"<h3 style='text-align: center;'>💵 Sum of Prices: `{
                 total_price}`</h3>", unsafe_allow_html=True)

elif action == "Describe Data":
    # Show descriptive statistics with improved styling
    dis.markdown(
        "<h3 style='text-align: center;'>📈 Data Description</h3>", unsafe_allow_html=True)
    dis.dataframe(krh.describe())

elif action == "Add Entry":
    # Input fields for new data entry
    st.sidebar.subheader("Add New Entry")
    item = st.sidebar.text_input("Enter item")
    price = st.sidebar.number_input("Enter price", min_value=0, format="%d")

    if st.sidebar.button("Add Entry"):
        # Append new data to DataFrame and save to CSV
        new_entry = [item, dt.now().date(), int(price)]
        krh.loc[krh.shape[0]] = new_entry
        krh.to_csv('./demo.csv', index=False)

        # Show success message and update data display
        st.sidebar.success("Entry added successfully!")

# Note: The auto-refresh will automatically re-run the app, maintaining the layout.
        # Show success message and update data display
        st.sidebar.success("Entry added successfully!")

# Note: The auto-refresh will automatically re-run the app, maintaining the layout.
