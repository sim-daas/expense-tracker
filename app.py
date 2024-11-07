'''

import numpy as np
import pandas as pd
from datetime import datetime as dt

krh = pd.read_csv("./demo.csv")
print(krh)

while True:
    cmd = input("Enter action to perform: ")
    if cmd == "sum":
        print(krh.Price.sum(axis=0))
    elif cmd == 'dsc':
        print(krh.describe())
    elif cmd == "q":
        break
    else:
        a = []
        a.append(input("Enter items: "))
        a.append(dt.now().date())
        a.append(int(input("Enter price: ")))
        krh.loc[krh.shape[0]] = a
        krh.to_csv('./demo.csv', index=False)
'''


import streamlit as st
import pandas as pd
from datetime import datetime as dt

# Set the dark theme
st.set_page_config(page_title="Dark Themed Data App",
                   layout="centered", page_icon="📊")

# Load the CSV file
krh = pd.read_csv("./demo.csv")

# App Title
st.title("Data Management App")
st.markdown("### A simple data manipulation app with dark theme")

# Display the dataframe
st.write("Current Data:")
st.dataframe(krh)

# Define actions
action = st.selectbox("Choose action to perform", [
                      "Sum Prices", "Describe Data", "Add Entry"])

if action == "Sum Prices":
    # Display the sum of the 'Price' column
    st.write("Sum of Prices:", krh['Price'].sum())

elif action == "Describe Data":
    # Show descriptive statistics
    st.write("Data Description:")
    st.write(krh.describe())

elif action == "Add Entry":
    # Input fields for new data
    item = st.text_input("Enter item")
    price = st.number_input("Enter price", min_value=0, format="%d")

    if st.button("Add Entry"):
        # Append new data to DataFrame and save to CSV
        new_entry = {
            'Item': item,
            'Date': dt.now().date(),
            'Price': int(price)
        }
        krh = krh.append(new_entry, ignore_index=True)
        krh.to_csv('./demo.csv', index=False)
        st.success("Entry added successfully!")
        st.write("Updated Data:")
        st.dataframe(krh)
