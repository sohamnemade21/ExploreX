# -*- coding: utf-8 -*-
"""
WanderAI_ML_Model_Training.ipynb

Google Colab notebook for training the WanderAI ML models:
  1. Price Prediction — RandomForestRegressor
  2. Weather-Fit Score — GradientBoostingRegressor

Data Loading Options:
  - Option A: Google Drive (directly loads from your uploaded codebase in GDrive)
  - Option B: Direct File Upload (upload JSON/CSV files from your computer)
  - Option C: Generate Synthetic Data (auto-generates realistic placeholder data)

To use in Colab:
  1. Open https://colab.research.google.com
  2. File → Upload Notebook → select this file (or upload directly from Google Drive)
  3. Runtime → Run all
"""

# ============================================================================
# CELL 1: Install Dependencies
# ============================================================================
# @title 🔧 Install Required Libraries
# @markdown Run this cell first to install all required dependencies.

!pip install scikit-learn==1.5.0 pandas==2.2.2 numpy==1.26.4 joblib==1.4.2 matplotlib seaborn -q
print("✅ All dependencies installed successfully!")

# ============================================================================
# CELL 2: Imports
# ============================================================================
# @title 📦 Import Libraries

import json
import os
import sys
import shutil
import math
import random
import glob
import numpy as np
import pandas as pd
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import date, timedelta
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

# Set style for plots
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")
print("✅ All imports ready!")

# ============================================================================
# CELL 3: Data Loading — Google Drive, Manual Upload, or Synthetic
# ============================================================================
# @title 📂 Data Loading — Select your data source
# @markdown Choose how you want to load data for training:
# @markdown
# @markdown - **Option A: Google Drive** — Mount Google Drive and auto-load `destinations.json` & `climate.json` from your uploaded codebase folder.
# @markdown - **Option B: Direct File Upload** — Manually upload JSON files from your local computer.
# @markdown - **Option C: Generate Synthetic Data** — Auto-generate realistic placeholder training data.

DATA_SOURCE = "Option A: Google Drive (Uploaded Codebase)" # @param ["Option A: Google Drive (Uploaded Codebase)", "Option B: Direct File Upload", "Option C: Generate Synthetic Data"]
GDRIVE_PROJECT_FOLDER = "assets" # @param {type:"string"}
# @markdown *(Name of the folder you uploaded to Google Drive, e.g., `assets` or `assets/ml-service`)*

# Create local working directories
os.makedirs("models", exist_ok=True)
os.makedirs("data", exist_ok=True)

loaded_from_drive = False
loaded_from_upload = False
gdrive_models_path = None

if "Option A" in DATA_SOURCE:
    print("🔗 Connecting to Google Drive...")
    from google.colab import drive
    drive.mount('/content/drive')
    
    # Search for project folder in Google Drive
    possible_paths = [
        f"/content/drive/MyDrive/{GDRIVE_PROJECT_FOLDER}",
        f"/content/drive/MyDrive/{GDRIVE_PROJECT_FOLDER}/ml-service",
        f"/content/drive/MyDrive/{GDRIVE_PROJECT_FOLDER}/assets",
        "/content/drive/MyDrive/assets",
        "/content/drive/MyDrive/ml-service"
    ]
    
    found_data_dir = None
    for p in possible_paths:
        test_data_dir = os.path.join(p, "data") if not p.endswith("data") else p
        if os.path.exists(os.path.join(test_data_dir, "destinations.json")):
            found_data_dir = test_data_dir
            gdrive_models_path = os.path.join(os.path.dirname(test_data_dir), "models")
            break
        elif os.path.exists(os.path.join(p, "ml-service", "data", "destinations.json")):
            found_data_dir = os.path.join(p, "ml-service", "data")
            gdrive_models_path = os.path.join(p, "ml-service", "models")
            break
            
    # Fallback search if not found in standard paths
    if not found_data_dir:
        print("🔍 Searching Google Drive for destinations.json...")
        search_results = glob.glob("/content/drive/MyDrive/**/destinations.json", recursive=True)
        if search_results:
            found_data_dir = os.path.dirname(search_results[0])
            gdrive_models_path = os.path.join(os.path.dirname(found_data_dir), "models")

    if found_data_dir:
        print(f"📁 Found data directory in Google Drive: {found_data_dir}")
        shutil.copy(os.path.join(found_data_dir, "destinations.json"), "data/destinations.json")
        if os.path.exists(os.path.join(found_data_dir, "climate.json")):
            shutil.copy(os.path.join(found_data_dir, "climate.json"), "data/climate.json")
        
        # Check if CSV files exist for real-data ingestion
        price_csv = os.path.join(found_data_dir, "real_prices.csv")
        climate_csv = os.path.join(found_data_dir, "real_climate.csv")
        if os.path.exists(price_csv):
            shutil.copy(price_csv, "data/real_prices.csv")
            print("  ℹ️ Found real_prices.csv in Google Drive")
        if os.path.exists(climate_csv):
            shutil.copy(climate_csv, "data/real_climate.csv")
            print("  ℹ️ Found real_climate.csv in Google Drive")
            
        print("✅ Copied data files from Google Drive to local Colab workspace!")
        loaded_from_drive = True
    else:
        print(f"⚠️ Could not automatically find 'destinations.json' in Google Drive folder '{GDRIVE_PROJECT_FOLDER}'.")
        print("Falling back to synthetic data generator...")

elif "Option B" in DATA_SOURCE:
    from google.colab import files
    print("📤 Upload destinations.json:")
    uploaded = files.upload()
    if 'destinations.json' in uploaded:
        with open('data/destinations.json', 'wb') as f:
            f.write(uploaded['destinations.json'])
        print("  ✅ destinations.json uploaded successfully")
        loaded_from_upload = True

    print("\n📤 Upload climate.json (optional, press cancel if not available):")
    uploaded_c = files.upload()
    if 'climate.json' in uploaded_c:
        with open('data/climate.json', 'wb') as f:
            f.write(uploaded_c['climate.json'])
        print("  ✅ climate.json uploaded successfully")

if not loaded_from_drive and not loaded_from_upload and not os.path.exists("data/destinations.json"):
    print("🔄 Generating synthetic data...")

# ============================================================================
# CELL 4: Data Generator / Loader
# ============================================================================
# @title 🏗️ Data Verification & Synthetic Fallback Generator

random.seed(42)

VIBE_VOCAB = ["beach","mountain","heritage","nature","urban","adventure",
              "luxury","budget","wellness","culinary","spiritual","cultural",
              "eco_friendly","shopping","rural"]
TAG_VOCAB  = ["food","culture","clothing","shopping","nature","adventure",
              "heritage","spirituality","beaches","festivals","rural_tribal",
              "wildlife","history","art"]
MONTHS = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"]
STATES = ["Goa","Maharashtra","Rajasthan","Kerala","Tamil Nadu","Karnataka",
          "Himachal Pradesh","Uttarakhand","Gujarat","Madhya Pradesh",
          "Odisha","Sikkim","Assam","Jammu & Kashmir","Andhra Pradesh"]

# Full destination seed data (50 destinations)
DEST_SEEDS = [
    ("Tarkarli","Maharashtra",16.005,73.469,["beach","nature","adventure"],["beaches","wildlife","food"],["November","December","January","February"],2500,"gem","Tier-3"),
    ("Sindhudurg","Maharashtra",16.038,73.510,["heritage","beach","adventure"],["heritage","beaches","history"],["November","December","January"],2800,"gem","Tier-3"),
    ("Kolhapur","Maharashtra",16.705,74.243,["cultural","culinary","heritage"],["culture","food","heritage","festivals"],["October","November","December","January","February"],1800,"emerging","Tier-2"),
    ("Solapur","Maharashtra",17.686,75.906,["cultural","heritage","shopping"],["culture","clothing","shopping","heritage"],["October","November","December","January"],1500,"emerging","Tier-2"),
    ("Aurangabad","Maharashtra",19.877,75.343,["heritage","cultural","spiritual"],["heritage","history","art","culture"],["October","November","February","March"],2200,"popular","Tier-2"),
    ("Ratnagiri","Maharashtra",16.994,73.312,["beach","nature","culinary"],["beaches","food","nature"],["November","December","January","February"],2600,"gem","Tier-3"),
    ("Lonavala","Maharashtra",18.750,73.405,["mountain","nature","wellness"],["nature","adventure","food"],["June","July","August","September"],3000,"popular","Tier-2"),
    ("Pune","Maharashtra",18.520,73.856,["urban","culinary","heritage"],["culture","food","history","art"],["October","November","December","January","February","March"],3500,"popular","Tier-1"),
    ("Mahabaleshwar","Maharashtra",17.924,73.659,["mountain","nature","wellness"],["nature","food","adventure"],["March","April","May","October","November"],3200,"popular","Tier-2"),
    ("Alibaug","Maharashtra",18.641,72.872,["beach","wellness","nature"],["beaches","nature","food"],["October","November","December","January","February","March"],2800,"popular","Tier-2"),
    ("Goa","Goa",15.299,74.124,["beach","nightlife","adventure","luxury"],["beaches","food","culture","festivals"],["November","December","January","February"],5000,"popular","Tier-1"),
    ("Panjim","Goa",15.499,73.827,["urban","cultural","heritage"],["culture","heritage","food","art"],["November","December","January","February","March"],4500,"popular","Tier-1"),
    ("Jaipur","Rajasthan",26.912,75.787,["heritage","cultural","shopping"],["heritage","culture","art","shopping","history"],["October","November","December","January","February","March"],4000,"popular","Tier-1"),
    ("Udaipur","Rajasthan",24.585,73.712,["heritage","luxury","cultural"],["heritage","culture","art","history"],["October","November","December","January","February"],4500,"popular","Tier-1"),
    ("Jodhpur","Rajasthan",26.294,73.048,["heritage","cultural","culinary"],["heritage","culture","food","history"],["October","November","December","January","February","March"],3800,"popular","Tier-1"),
    ("Jaisalmer","Rajasthan",26.914,70.916,["adventure","heritage","rural"],["heritage","adventure","culture","rural_tribal"],["October","November","December","January","February"],3500,"popular","Tier-2"),
    ("Pushkar","Rajasthan",26.490,74.551,["spiritual","cultural","adventure"],["spirituality","culture","festivals","heritage"],["October","November","February","March"],2500,"emerging","Tier-3"),
    ("Munnar","Kerala",10.089,77.059,["mountain","nature","wellness"],["nature","wildlife"],["September","October","November","December","January","February","March"],3500,"popular","Tier-2"),
    ("Alleppey","Kerala",9.498,76.339,["nature","wellness","rural"],["nature","food","culture","rural_tribal"],["September","October","November","December","January","February"],3800,"popular","Tier-2"),
    ("Wayanad","Kerala",11.686,76.132,["nature","adventure","eco_friendly"],["nature","wildlife","rural_tribal"],["September","October","November","December","January","February"],3200,"emerging","Tier-2"),
    ("Coorg","Karnataka",12.337,75.812,["nature","adventure","wellness"],["nature","wildlife","food","culture"],["October","November","December","January","February","March"],4000,"popular","Tier-2"),
    ("Hampi","Karnataka",15.335,76.461,["heritage","cultural","adventure"],["heritage","history","art","culture"],["October","November","December","January","February","March"],2000,"popular","Tier-2"),
    ("Mysuru","Karnataka",12.296,76.639,["heritage","cultural","culinary"],["heritage","culture","food","art","festivals"],["October","November","December","January","February"],3000,"popular","Tier-1"),
    ("Ooty","Tamil Nadu",11.414,76.695,["mountain","nature","wellness"],["nature","food"],["March","April","May","October","November","December"],3000,"popular","Tier-2"),
    ("Chettinad","Tamil Nadu",10.100,78.700,["cultural","culinary","heritage"],["culture","food","heritage","art","rural_tribal"],["October","November","December","January","February"],2800,"gem","Tier-3"),
    ("Madurai","Tamil Nadu",9.925,78.120,["heritage","spiritual","culinary"],["heritage","spirituality","food","culture","history"],["October","November","December","January","February","March"],2200,"popular","Tier-2"),
    ("Kanyakumari","Tamil Nadu",8.087,77.552,["spiritual","nature","heritage"],["spirituality","beaches","heritage","nature"],["October","November","December","January","February"],2000,"popular","Tier-2"),
    ("Manali","Himachal Pradesh",32.241,77.189,["mountain","adventure","nature"],["adventure","nature","wildlife"],["March","April","May","June","October","November"],4500,"popular","Tier-2"),
    ("Kasol","Himachal Pradesh",32.009,77.314,["mountain","adventure","wellness"],["nature","adventure","culture"],["March","April","May","June","October"],2500,"emerging","Tier-3"),
    ("Spiti Valley","Himachal Pradesh",32.244,78.066,["mountain","adventure","spiritual"],["adventure","heritage","spirituality","rural_tribal"],["June","July","August","September"],3500,"gem","Rural/Village"),
    ("Dharamsala","Himachal Pradesh",32.219,76.325,["mountain","spiritual","cultural"],["spirituality","culture","heritage","art"],["March","April","May","September","October","November"],3000,"popular","Tier-2"),
    ("Rishikesh","Uttarakhand",30.086,78.267,["spiritual","adventure","wellness"],["spirituality","adventure","culture","nature"],["February","March","April","May","September","October","November"],2500,"popular","Tier-2"),
    ("Mussoorie","Uttarakhand",30.458,78.066,["mountain","nature","adventure"],["nature","adventure","heritage"],["March","April","May","September","October","November"],3500,"popular","Tier-2"),
    ("Auli","Uttarakhand",30.524,79.568,["mountain","adventure","nature"],["adventure","nature"],["December","January","February","March","April","May"],5000,"emerging","Tier-3"),
    ("Khajuraho","Madhya Pradesh",24.832,79.919,["heritage","cultural","spiritual"],["heritage","history","art","spirituality"],["October","November","December","January","February","March"],2500,"popular","Tier-2"),
    ("Orchha","Madhya Pradesh",25.352,78.642,["heritage","spiritual","nature"],["heritage","spirituality","history","nature"],["October","November","December","January","February","March"],2000,"gem","Tier-3"),
    ("Pachmarhi","Madhya Pradesh",22.467,78.433,["nature","adventure","heritage"],["nature","wildlife","heritage","adventure"],["October","November","December","January","February","March","April","May"],2800,"emerging","Tier-2"),
    ("Rann of Kutch","Gujarat",23.738,69.859,["adventure","cultural","nature"],["culture","rural_tribal","festivals","nature"],["November","December","January","February"],3500,"popular","Tier-2"),
    ("Ahmedabad","Gujarat",23.030,72.587,["heritage","cultural","culinary"],["heritage","culture","food","history","art"],["October","November","December","January","February","March"],2500,"popular","Tier-1"),
    ("Dwarka","Gujarat",22.238,68.967,["spiritual","heritage","beach"],["spirituality","heritage","beaches","history"],["October","November","December","January","February","March"],2000,"popular","Tier-2"),
    ("Puri","Odisha",19.810,85.832,["spiritual","beach","cultural"],["spirituality","beaches","heritage","festivals","culture"],["October","November","December","January","February","March"],2000,"popular","Tier-2"),
    ("Konark","Odisha",19.887,86.094,["heritage","spiritual","beach"],["heritage","history","art","spirituality","beaches"],["October","November","December","January","February","March"],1800,"popular","Tier-2"),
    ("Raghurajpur","Odisha",19.936,85.830,["cultural","heritage","rural"],["culture","art","rural_tribal","heritage"],["October","November","December","January","February"],1500,"gem","Rural/Village"),
    ("Gangtok","Sikkim",27.336,88.612,["mountain","adventure","cultural"],["nature","adventure","culture","wildlife"],["March","April","May","September","October","November"],4000,"popular","Tier-2"),
    ("Lachung","Sikkim",27.685,88.745,["mountain","nature","adventure"],["nature","wildlife","adventure","rural_tribal"],["March","April","May","September","October"],4500,"gem","Rural/Village"),
    ("Kaziranga","Assam",26.578,93.171,["nature","adventure","eco_friendly"],["wildlife","nature","rural_tribal"],["November","December","January","February","March","April"],3500,"popular","Tier-2"),
    ("Majuli","Assam",26.940,94.170,["cultural","rural","nature"],["culture","rural_tribal","art","festivals"],["October","November","December","January","February","March"],2000,"gem","Rural/Village"),
    ("Tirthan Valley","Himachal Pradesh",31.596,77.372,["nature","adventure","wellness"],["nature","wildlife","adventure","rural_tribal"],["April","May","June","September","October"],3000,"gem","Rural/Village"),
    ("Ziro Valley","Arunachal Pradesh",27.547,93.813,["nature","cultural","rural"],["culture","rural_tribal","nature","festivals"],["September","October","November"],3500,"gem","Rural/Village"),
    ("Hamirpur","Himachal Pradesh",31.685,76.522,["rural","cultural","nature"],["culture","heritage","nature","rural_tribal"],["March","April","May","September","October","November"],1500,"gem","Rural/Village"),
]

MONSOON_STATES = {
    "Goa": [6,7,8,9], "Maharashtra": [6,7,8,9], "Kerala": [6,7,8,9,10],
    "Karnataka": [6,7,8,9], "Tamil Nadu": [10,11,12], "Odisha": [6,7,8,9],
    "Assam": [5,6,7,8,9], "Sikkim": [5,6,7,8,9], "Rajasthan": [7,8],
    "Gujarat": [6,7,8,9], "Madhya Pradesh": [6,7,8,9],
    "Himachal Pradesh": [7,8,9], "Uttarakhand": [7,8,9],
    "Andhra Pradesh": [6,7,8,9], "Arunachal Pradesh": [5,6,7,8,9],
    "Jammu & Kashmir": [7,8],
}

def base_temp(lat, month_idx):
    seasonal = -15 * math.cos(2 * math.pi * (month_idx - 1) / 12)
    lat_effect = max(0, (25 - lat)) * 0.5
    return round(15 + seasonal + lat_effect + random.uniform(-2, 2), 1)

# Generate if missing
if not os.path.exists("data/destinations.json"):
    destinations = []
    for i, seed in enumerate(DEST_SEEDS):
        name, state, lat, lng, vibes, tags, best_months, price, pop_tier, tier_cat = seed
        did = f"dest-{str(i+1).zfill(3)}"
        afford = max(20, min(100, 100 - int((price - 1500) / 70)))
        sustain = random.randint(55, 98)
        capacity_load = random.randint(15, 85) if pop_tier == "gem" else random.randint(30, 95)
        is_over = capacity_load > 80 and pop_tier == "popular"
        destinations.append({
            "id": did, "name": name, "state": state,
            "lat": lat + random.uniform(-0.01, 0.01),
            "lng": lng + random.uniform(-0.01, 0.01),
            "vibe": vibes, "thematicTags": tags, "bestMonths": best_months,
            "rating": round(random.uniform(3.8, 4.9), 1),
            "startingPrice": price + random.randint(-200, 200),
            "popularityTier": pop_tier, "tierCategory": tier_cat,
            "affordabilityIndex": afford, "sustainabilityScore": sustain,
            "currentCapacityLoadPct": capacity_load, "isOvertouristed": is_over
        })
    with open("data/destinations.json", "w", encoding="utf-8") as f:
        json.dump(destinations, f, indent=2)
    print(f"✨ Generated synthetic destinations.json ({len(destinations)} records)")
else:
    with open("data/destinations.json", encoding="utf-8") as f:
        destinations = json.load(f)
    print(f"📄 Loaded destinations.json ({len(destinations)} destinations)")

if not os.path.exists("data/climate.json"):
    climate = []
    for dest in destinations:
        state = dest.get("state", "")
        monsoon_months = MONSOON_STATES.get(state, [7, 8])
        lat = dest["lat"]
        for mi, month in enumerate(MONTHS):
            m = mi + 1
            is_monsoon = m in monsoon_months
            rainfall = random.randint(200, 950) if is_monsoon else random.randint(0, 80)
            humidity = random.randint(70, 95) if is_monsoon else random.randint(30, 65)
            temp = base_temp(lat, m)
            climate.append({
                "destinationId": dest["id"], "month": month,
                "avgTempC": temp, "avgRainfallMm": rainfall,
                "avgHumidityPct": humidity, "monsoonSeason": is_monsoon
            })
    with open("data/climate.json", "w", encoding="utf-8") as f:
        json.dump(climate, f, indent=2)
    print(f"✨ Generated synthetic climate.json ({len(climate)} records)")
else:
    with open("data/climate.json", encoding="utf-8") as f:
        climate = json.load(f)
    print(f"📄 Loaded climate.json ({len(climate)} climate records)")

# ============================================================================
# CELL 5: Data Exploration
# ============================================================================
# @title 📊 Data Exploration & Visualization

df_dest = pd.DataFrame(destinations)
df_climate = pd.DataFrame(climate)

print("=" * 60)
print("  DESTINATIONS OVERVIEW")
print("=" * 60)
print(f"  Total destinations: {len(df_dest)}")
print(f"  States covered: {df_dest['state'].nunique()}")
print(f"  Popularity tiers: {dict(df_dest['popularityTier'].value_counts())}")
print(f"  Tier categories: {dict(df_dest['tierCategory'].value_counts())}")
print(f"  Price range: ₹{df_dest['startingPrice'].min()} – ₹{df_dest['startingPrice'].max()}")
print(f"  Avg rating: {df_dest['rating'].mean():.2f}")

print("\n" + "=" * 60)
print("  CLIMATE OVERVIEW")
print("=" * 60)
print(f"  Total climate records: {len(df_climate)}")
print(f"  Temperature range: {df_climate['avgTempC'].min():.1f}°C – {df_climate['avgTempC'].max():.1f}°C")
print(f"  Rainfall range: {df_climate['avgRainfallMm'].min()} – {df_climate['avgRainfallMm'].max()} mm")
print(f"  Monsoon records: {df_climate['monsoonSeason'].sum()} / {len(df_climate)}")

# Visualization
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("WanderAI Data Overview", fontsize=16, fontweight='bold')

# Price distribution by tier
sns.boxplot(data=df_dest, x='popularityTier', y='startingPrice', ax=axes[0, 0],
            order=['gem', 'emerging', 'popular'], palette='viridis')
axes[0, 0].set_title("Starting Price by Popularity Tier")
axes[0, 0].set_ylabel("Price (₹)")

# Destinations per state
state_counts = df_dest['state'].value_counts().head(10)
axes[0, 1].barh(state_counts.index, state_counts.values, color=sns.color_palette("husl", len(state_counts)))
axes[0, 1].set_title("Top States by Destination Count")
axes[0, 1].set_xlabel("Count")

# Temperature distribution by monsoon
sns.violinplot(data=df_climate, x='monsoonSeason', y='avgTempC', ax=axes[1, 0], palette='coolwarm')
axes[1, 0].set_title("Temperature Distribution (Monsoon vs Non-Monsoon)")
axes[1, 0].set_xticklabels(['Non-Monsoon', 'Monsoon'])

# Rainfall distribution
sns.histplot(data=df_climate, x='avgRainfallMm', hue='monsoonSeason', bins=30,
             ax=axes[1, 1], palette='coolwarm', alpha=0.7)
axes[1, 1].set_title("Rainfall Distribution")
axes[1, 1].set_xlabel("Avg Rainfall (mm)")

plt.tight_layout()
plt.savefig("data_overview.png", dpi=150, bbox_inches='tight')
plt.show()
print("📊 Saved: data_overview.png")

# ============================================================================
# CELL 6: Price Model — Training
# ============================================================================
# @title 🏷️ MODEL 1: Price Prediction (RandomForestRegressor) — Training

MONTHS_ORDER = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"]

POPULARITY_SCORE = {"popular": 1.0, "emerging": 0.5, "gem": 0.1}

INDIA_HOLIDAYS = [
    (1,1),(1,26),(3,7),(3,30),(4,5),(4,14),
    (6,16),(8,15),(9,7),(10,3),(10,12),(10,24),(11,1),(12,25)
]
HOLIDAY_WINDOW_DAYS = 3

def demand_multiplier(month_name, best_months, is_holiday, popularity_tier, capacity_load_pct):
    mult = 1.0
    mult += 0.40 if month_name in best_months else 0.0
    mult += 0.25 if is_holiday else 0.0
    mult += 0.15 * POPULARITY_SCORE.get(popularity_tier, 0.5)
    mult += 0.10 * (capacity_load_pct / 100.0)
    return mult

# Build training data
print("Building price training dataset...")
X_price_rows, y_price_rows = [], []
rng = np.random.default_rng(42)

# Fit tier encoder
all_tiers = [d.get("popularityTier", "emerging") for d in destinations]
tier_encoder = LabelEncoder()
tier_encoder.fit(all_tiers)

for dest in destinations:
    base_price = dest.get("startingPrice", 3000)
    best_months = dest.get("bestMonths", [])
    pop_tier = dest.get("popularityTier", "emerging")
    cap_load = dest.get("currentCapacityLoadPct", 50)

    for month_idx, month_name in enumerate(MONTHS_ORDER, start=1):
        for hol_flag in [True, False]:
            mult = demand_multiplier(month_name, best_months, hol_flag, pop_tier, float(cap_load))
            noise = rng.normal(1.0, 0.05)
            price = base_price * mult * noise
            tier_enc_val = tier_encoder.transform([pop_tier])[0]
            X_price_rows.append([
                month_idx,
                float(tier_enc_val),
                float(cap_load),
                1.0 if hol_flag else 0.0,
                1.0 if month_name in best_months else 0.0,
            ])
            y_price_rows.append(price)

X_price = np.array(X_price_rows)
y_price = np.array(y_price_rows)

FEATURE_NAMES_PRICE = ["month_num", "popularity_tier_enc", "capacity_load_pct",
                       "is_holiday", "is_best_month"]

print(f"✅ Training data: {X_price.shape[0]} samples, {X_price.shape[1]} features")
print(f"   Features: {FEATURE_NAMES_PRICE}")
print(f"   Price range: ₹{y_price.min():.0f} – ₹{y_price.max():.0f}")
print(f"   Mean price: ₹{y_price.mean():.0f}")

# Train-test split
X_train_p, X_test_p, y_train_p, y_test_p = train_test_split(
    X_price, y_price, test_size=0.2, random_state=42
)

# Train evaluation model
print("\n🔄 Training evaluation model (80/20 split)...")
eval_model_price = RandomForestRegressor(
    n_estimators=200, max_depth=8, random_state=42, n_jobs=-1
)
eval_model_price.fit(X_train_p, y_train_p)
y_pred_test = eval_model_price.predict(X_test_p)

mae_price = mean_absolute_error(y_test_p, y_pred_test)
rmse_price = np.sqrt(mean_squared_error(y_test_p, y_pred_test))
r2_price = r2_score(y_test_p, y_pred_test)

print(f"\n{'='*50}")
print(f"  PRICE MODEL — Evaluation Results (Test Set)")
print(f"{'='*50}")
print(f"  MAE:  ₹{mae_price:.2f}")
print(f"  RMSE: ₹{rmse_price:.2f}")
print(f"  R²:   {r2_price:.4f}")
print(f"  Test samples: {len(y_test_p)}")

# Cross-validation
cv_scores = cross_val_score(eval_model_price, X_price, y_price, cv=5, scoring='neg_mean_absolute_error')
print(f"\n  5-Fold CV MAE: ₹{-cv_scores.mean():.2f} (±{cv_scores.std():.2f})")

# Train final model on ALL data
print("\n🔄 Training final production model (all data)...")
final_price_model = RandomForestRegressor(
    n_estimators=200, max_depth=8, random_state=42, n_jobs=-1
)
final_price_model.fit(X_price, y_price)

# Save models locally
joblib.dump(final_price_model, "models/price_model.pkl")
joblib.dump(tier_encoder, "models/tier_encoder.pkl")
print(f"💾 Saved locally: models/price_model.pkl ({os.path.getsize('models/price_model.pkl')/1024/1024:.1f} MB)")
print(f"💾 Saved locally: models/tier_encoder.pkl")

# ============================================================================
# CELL 7: Price Model — Visualization
# ============================================================================
# @title 📈 Price Model — Evaluation Plots

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Price Prediction Model — Evaluation", fontsize=16, fontweight='bold')

# 1. Feature Importance
importances = dict(zip(FEATURE_NAMES_PRICE, final_price_model.feature_importances_))
sorted_imp = sorted(importances.items(), key=lambda x: x[1], reverse=True)
names, vals = zip(*sorted_imp)
colors = sns.color_palette("viridis", len(names))
axes[0, 0].barh(names[::-1], vals[::-1], color=colors[::-1])
axes[0, 0].set_title("Feature Importance")
axes[0, 0].set_xlabel("Importance")
for i, v in enumerate(vals[::-1]):
    axes[0, 0].text(v + 0.005, i, f"{v:.3f}", va='center', fontsize=9)

# 2. Actual vs Predicted
axes[0, 1].scatter(y_test_p, y_pred_test, alpha=0.4, s=20, c='steelblue')
min_v = min(y_test_p.min(), y_pred_test.min())
max_v = max(y_test_p.max(), y_pred_test.max())
axes[0, 1].plot([min_v, max_v], [min_v, max_v], 'r--', lw=2, label='Perfect prediction')
axes[0, 1].set_xlabel("Actual Price (₹)")
axes[0, 1].set_ylabel("Predicted Price (₹)")
axes[0, 1].set_title(f"Actual vs Predicted (R² = {r2_price:.4f})")
axes[0, 1].legend()

# 3. Residual Distribution
residuals = y_test_p - y_pred_test
axes[1, 0].hist(residuals, bins=40, color='steelblue', edgecolor='black', alpha=0.7)
axes[1, 0].axvline(0, color='red', linestyle='--', lw=2)
axes[1, 0].set_title(f"Residual Distribution (Mean = ₹{residuals.mean():.1f})")
axes[1, 0].set_xlabel("Residual (₹)")

# 4. Prediction error by month
df_test = pd.DataFrame(X_test_p, columns=FEATURE_NAMES_PRICE)
df_test['actual'] = y_test_p
df_test['predicted'] = y_pred_test
df_test['error'] = np.abs(residuals)
monthly_error = df_test.groupby('month_num')['error'].mean()
axes[1, 1].bar(monthly_error.index, monthly_error.values, color=sns.color_palette("husl", 12))
axes[1, 1].set_title("Mean Absolute Error by Month")
axes[1, 1].set_xlabel("Month")
axes[1, 1].set_ylabel("MAE (₹)")
axes[1, 1].set_xticks(range(1, 13))
axes[1, 1].set_xticklabels(['J','F','M','A','M','J','J','A','S','O','N','D'])

plt.tight_layout()
plt.savefig("price_model_evaluation.png", dpi=150, bbox_inches='tight')
plt.show()
print("📊 Saved: price_model_evaluation.png")

# ============================================================================
# CELL 8: Weather-Fit Model — Training
# ============================================================================
# @title 🌦️ MODEL 2: Weather-Fit Score (GradientBoostingRegressor) — Training

def weather_fit_label(row, activity_type):
    """Rule-based label generator — exact replica of weather_service.py"""
    rain = row.get("avgRainfallMm", 0)
    temp = row.get("avgTempC", 25)
    hum = row.get("avgHumidityPct", 60)

    if activity_type == "outdoor":
        rain_penalty = min(100.0, rain / 10.0)
    else:
        rain_penalty = min(40.0, rain / 25.0)

    temp_penalty = max(0.0, (abs(temp - 25.0) - 3.0) * 2.0)  # ideal 22–28°C
    hum_penalty = max(0.0, (hum - 70.0) / 3.0)

    score = max(0.0, 100.0 - rain_penalty - temp_penalty - hum_penalty)
    return round(score, 2)

print("Building weather-fit training dataset...")
X_weather_rows, y_weather_rows = [], []

for row in climate:
    for activity_type_int, activity_type_str in [(0, "indoor"), (1, "outdoor")]:
        label = weather_fit_label(row, activity_type_str)
        X_weather_rows.append([
            row.get("avgTempC", 25),
            row.get("avgRainfallMm", 0),
            row.get("avgHumidityPct", 60),
            1 if row.get("monsoonSeason") else 0,
            activity_type_int,
        ])
        y_weather_rows.append(label)

X_weather = np.array(X_weather_rows)
y_weather = np.array(y_weather_rows)

FEATURE_NAMES_WEATHER = ["avgTempC", "avgRainfallMm", "avgHumidityPct",
                         "monsoonSeason", "activityType"]

print(f"✅ Training data: {X_weather.shape[0]} samples, {X_weather.shape[1]} features")
print(f"   Features: {FEATURE_NAMES_WEATHER}")
print(f"   Score range: {y_weather.min():.1f} – {y_weather.max():.1f}")
print(f"   Mean score: {y_weather.mean():.1f}")

# Train-test split
X_train_w, X_test_w, y_train_w, y_test_w = train_test_split(
    X_weather, y_weather, test_size=0.2, random_state=42
)

# Train evaluation model
print("\n🔄 Training evaluation model (80/20 split)...")
eval_model_weather = GradientBoostingRegressor(
    n_estimators=100, max_depth=4, random_state=42
)
eval_model_weather.fit(X_train_w, y_train_w)
y_pred_test_w = eval_model_weather.predict(X_test_w)

mae_weather = mean_absolute_error(y_test_w, y_pred_test_w)
rmse_weather = np.sqrt(mean_squared_error(y_test_w, y_pred_test_w))
r2_weather = r2_score(y_test_w, y_pred_test_w)

print(f"\n{'='*50}")
print(f"  WEATHER-FIT MODEL — Evaluation Results (Test Set)")
print(f"{'='*50}")
print(f"  MAE:  {mae_weather:.2f} points")
print(f"  RMSE: {rmse_weather:.2f} points")
print(f"  R²:   {r2_weather:.4f}")
print(f"  Test samples: {len(y_test_w)}")

# Cross-validation
cv_scores_w = cross_val_score(eval_model_weather, X_weather, y_weather, cv=5,
                               scoring='neg_mean_absolute_error')
print(f"\n  5-Fold CV MAE: {-cv_scores_w.mean():.2f} (±{cv_scores_w.std():.2f})")

# Train final model on ALL data
print("\n🔄 Training final production model (all data)...")
final_weather_model = GradientBoostingRegressor(
    n_estimators=100, max_depth=4, random_state=42
)
final_weather_model.fit(X_weather, y_weather)

# Save model locally
joblib.dump(final_weather_model, "models/weather_fit_model.pkl")
print(f"💾 Saved locally: models/weather_fit_model.pkl ({os.path.getsize('models/weather_fit_model.pkl')/1024:.1f} KB)")

# ============================================================================
# CELL 9: Weather-Fit Model — Visualization
# ============================================================================
# @title 📈 Weather-Fit Model — Evaluation Plots

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Weather-Fit Score Model — Evaluation", fontsize=16, fontweight='bold')

# 1. Feature Importance
importances_w = dict(zip(FEATURE_NAMES_WEATHER, final_weather_model.feature_importances_))
sorted_imp_w = sorted(importances_w.items(), key=lambda x: x[1], reverse=True)
names_w, vals_w = zip(*sorted_imp_w)
colors_w = sns.color_palette("magma", len(names_w))
axes[0, 0].barh(names_w[::-1], vals_w[::-1], color=colors_w[::-1])
axes[0, 0].set_title("Feature Importance")
axes[0, 0].set_xlabel("Importance")
for i, v in enumerate(vals_w[::-1]):
    axes[0, 0].text(v + 0.005, i, f"{v:.3f}", va='center', fontsize=9)

# 2. Actual vs Predicted
axes[0, 1].scatter(y_test_w, y_pred_test_w, alpha=0.4, s=20, c='darkorange')
min_v = min(y_test_w.min(), y_pred_test_w.min())
max_v = max(y_test_w.max(), y_pred_test_w.max())
axes[0, 1].plot([min_v, max_v], [min_v, max_v], 'r--', lw=2, label='Perfect prediction')
axes[0, 1].set_xlabel("Actual Fit Score")
axes[0, 1].set_ylabel("Predicted Fit Score")
axes[0, 1].set_title(f"Actual vs Predicted (R² = {r2_weather:.4f})")
axes[0, 1].legend()

# 3. Residual Distribution
residuals_w = y_test_w - y_pred_test_w
axes[1, 0].hist(residuals_w, bins=40, color='darkorange', edgecolor='black', alpha=0.7)
axes[1, 0].axvline(0, color='red', linestyle='--', lw=2)
axes[1, 0].set_title(f"Residual Distribution (Mean = {residuals_w.mean():.2f})")
axes[1, 0].set_xlabel("Residual (points)")

# 4. Weather-Fit Heatmap (outdoor only, first 15 destinations)
pivot_data = []
for row in climate:
    if row['destinationId'] in [f"dest-{str(i+1).zfill(3)}" for i in range(15)]:
        score = weather_fit_label(row, "outdoor")
        dest_name = next((d['name'] for d in destinations if d['id'] == row['destinationId']), row['destinationId'])
        pivot_data.append({"Destination": dest_name, "Month": row['month'], "Score": score})

df_pivot = pd.DataFrame(pivot_data)
heatmap_data = df_pivot.pivot(index='Destination', columns='Month', values='Score')
heatmap_data = heatmap_data[MONTHS]  # Reorder months

sns.heatmap(heatmap_data, annot=True, fmt='.0f', cmap='RdYlGn', ax=axes[1, 1],
            linewidths=0.5, cbar_kws={'label': 'Fit Score'}, annot_kws={'size': 6})
axes[1, 1].set_title("Outdoor Weather-Fit Score Heatmap (Top 15)")
axes[1, 1].tick_params(axis='x', rotation=45)
axes[1, 1].tick_params(axis='y', rotation=0, labelsize=7)

plt.tight_layout()
plt.savefig("weather_model_evaluation.png", dpi=150, bbox_inches='tight')
plt.show()
print("📊 Saved: weather_model_evaluation.png")

# ============================================================================
# CELL 10: Combined Training Summary
# ============================================================================
# @title 📋 Training Summary

print("=" * 60)
print("  WANDER-AI ML MODEL TRAINING — COMPLETE SUMMARY")
print("=" * 60)
print()
print("  MODEL 1: Price Prediction")
print(f"    Algorithm:    RandomForestRegressor")
print(f"    Trees:        200, Max Depth: 8")
print(f"    Features:     {FEATURE_NAMES_PRICE}")
print(f"    Samples:      {len(X_price)}")
print(f"    Test MAE:     ₹{mae_price:.2f}")
print(f"    Test R²:      {r2_price:.4f}")
print(f"    Saved:        models/price_model.pkl")
print()
print("  MODEL 2: Weather-Fit Score")
print(f"    Algorithm:    GradientBoostingRegressor")
print(f"    Trees:        100, Max Depth: 4")
print(f"    Features:     {FEATURE_NAMES_WEATHER}")
print(f"    Samples:      {len(X_weather)}")
print(f"    Test MAE:     {mae_weather:.2f} points")
print(f"    Test R²:      {r2_weather:.4f}")
print(f"    Saved:        models/weather_fit_model.pkl")
print()
print("  SAVED FILES:")
print("    models/price_model.pkl")
print("    models/tier_encoder.pkl")
print("    models/weather_fit_model.pkl")
print("=" * 60)

# ============================================================================
# CELL 11: Save Models (Direct to Google Drive + Download)
# ============================================================================
# @title 💾 Save & Export Trained Models
# @markdown Run this cell to save models directly back into your Google Drive folder, and optionally download them.

# 1. Save directly back to Google Drive if available
if gdrive_models_path and os.path.exists(os.path.dirname(gdrive_models_path)):
    os.makedirs(gdrive_models_path, exist_ok=True)
    shutil.copy("models/price_model.pkl", os.path.join(gdrive_models_path, "price_model.pkl"))
    shutil.copy("models/tier_encoder.pkl", os.path.join(gdrive_models_path, "tier_encoder.pkl"))
    shutil.copy("models/weather_fit_model.pkl", os.path.join(gdrive_models_path, "weather_fit_model.pkl"))
    print(f"✅ Models saved directly back to Google Drive at:")
    print(f"   {gdrive_models_path}")
else:
    print("ℹ️ Google Drive destination not detected automatically.")

# 2. Browser Download
DOWNLOAD_TO_LOCAL = True # @param {type:"boolean"}
if DOWNLOAD_TO_LOCAL:
    from google.colab import files
    print("\n📥 Triggering browser downloads for .pkl files...")
    files.download('models/price_model.pkl')
    files.download('models/tier_encoder.pkl')
    files.download('models/weather_fit_model.pkl')
    print("✅ Download initiated!")

# ============================================================================
# CELL 12: Quick Prediction Demo
# ============================================================================
# @title 🎯 Quick Prediction Demo — Test the trained models

print("=" * 60)
print("  PREDICTION DEMO")
print("=" * 60)

# Price prediction demo
print("\n📊 Price Predictions for Goa:")
goa_matches = [d for d in destinations if d.get('name') == 'Goa']
if goa_matches:
    goa = goa_matches[0]
    goa_tier = float(tier_encoder.transform([goa.get('popularityTier', 'popular')])[0])
    cap = float(goa.get('currentCapacityLoadPct', 50))

    for month_idx, month in enumerate(MONTHS_ORDER, 1):
        is_best = 1.0 if month in goa.get('bestMonths', []) else 0.0
        for hol in [0.0, 1.0]:
            features = np.array([[month_idx, goa_tier, cap, hol, is_best]])
            pred = final_price_model.predict(features)[0]
            tag = "Holiday" if hol else "Regular"
            print(f"  {month:>12} ({tag}):  ₹{pred:,.0f}")

# Weather-fit demo
print("\n🌦️ Weather-Fit Scores for Tarkarli (dest-001, outdoor):")
tarkarli_climate = [c for c in climate if c.get('destinationId') == 'dest-001']
for row in tarkarli_climate:
    features = np.array([[
        row['avgTempC'], row['avgRainfallMm'], row['avgHumidityPct'],
        1 if row.get('monsoonSeason') else 0, 1  # outdoor
    ]])
    score = final_weather_model.predict(features)[0]
    score = max(0, min(100, score))
    label = "Excellent" if score >= 80 else "Good" if score >= 60 else "Fair" if score >= 40 else "Poor"
    print(f"  {row['month']:>12}: {score:5.1f} ({label})")

print("\n✅ All models tested and working!")
