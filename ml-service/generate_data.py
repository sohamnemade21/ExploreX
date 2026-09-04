"""
Data generator for ml-service placeholder data.
Run once: python generate_data.py
Produces: destinations.json, attractions.json, reviews.json, climate.json
All data is SYNTHETIC / PLACEHOLDER — see data/README.md for swap instructions.
"""
import json, random, math, os
from datetime import date, timedelta

random.seed(42)
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# ──────────────────────────────────────────────
# CANONICAL VOCABULARY (mirrors recommendation_service.py)
# ──────────────────────────────────────────────
VIBE_VOCAB = ["beach","mountain","heritage","nature","urban","adventure",
              "luxury","budget","wellness","culinary","spiritual","cultural","eco_friendly","shopping","rural"]
TAG_VOCAB  = ["food","culture","clothing","shopping","nature","adventure",
              "heritage","spirituality","beaches","festivals","rural_tribal","wildlife","history","art"]
POPULARITY_TIERS = ["gem","emerging","popular"]
TIER_CATS = ["Tier-1","Tier-2","Tier-3","Rural/Village"]
MONTHS = ["January","February","March","April","May","June",
          "July","August","September","October","November","December"]
ATTR_CATS = ["beach","fort","restaurant","museum","market","temple","nightlife","park","waterfall"]
STATES = ["Goa","Maharashtra","Rajasthan","Kerala","Tamil Nadu","Karnataka",
          "Himachal Pradesh","Uttarakhand","Gujarat","Madhya Pradesh",
          "Odisha","Sikkim","Assam","Jammu & Kashmir","Andhra Pradesh"]

# ──────────────────────────────────────────────
# DESTINATION SEED DATA (realistic Indian destinations)
# ──────────────────────────────────────────────
DEST_SEEDS = [
    # (name, state, lat, lng, vibe_sample, tag_sample, best_months, starting_price, pop_tier, tier_cat)
    ("Tarkarli",     "Maharashtra", 16.005, 73.469, ["beach","nature","adventure"], ["beaches","wildlife","food"], ["November","December","January","February"], 2500, "gem",      "Tier-3"),
    ("Sindhudurg",   "Maharashtra", 16.038, 73.510, ["heritage","beach","adventure"], ["heritage","beaches","history"], ["November","December","January"], 2800, "gem",      "Tier-3"),
    ("Kolhapur",     "Maharashtra", 16.705, 74.243, ["cultural","culinary","heritage"], ["culture","food","heritage","festivals"], ["October","November","December","January","February"], 1800, "emerging","Tier-2"),
    ("Solapur",      "Maharashtra", 17.686, 75.906, ["cultural","heritage","shopping"], ["culture","clothing","shopping","heritage"], ["October","November","December","January"], 1500, "emerging","Tier-2"),
    ("Aurangabad",   "Maharashtra", 19.877, 75.343, ["heritage","cultural","spiritual"], ["heritage","history","art","culture"], ["October","November","February","March"], 2200, "popular", "Tier-2"),
    ("Ratnagiri",    "Maharashtra", 16.994, 73.312, ["beach","nature","culinary"], ["beaches","food","nature"], ["November","December","January","February"], 2600, "gem",      "Tier-3"),
    ("Lonavala",     "Maharashtra", 18.750, 73.405, ["mountain","nature","wellness"], ["nature","adventure","food"], ["June","July","August","September"], 3000, "popular",  "Tier-2"),
    ("Pune",         "Maharashtra", 18.520, 73.856, ["urban","culinary","heritage"], ["culture","food","history","art"], ["October","November","December","January","February","March"], 3500, "popular",  "Tier-1"),
    ("Mahabaleshwar","Maharashtra", 17.924, 73.659, ["mountain","nature","wellness"], ["nature","food","adventure"], ["March","April","May","October","November"], 3200, "popular",  "Tier-2"),
    ("Alibaug",      "Maharashtra", 18.641, 72.872, ["beach","wellness","nature"], ["beaches","nature","food"], ["October","November","December","January","February","March"], 2800, "popular",  "Tier-2"),
    ("Goa",          "Goa",         15.299, 74.124, ["beach","nightlife","adventure","luxury"], ["beaches","food","culture","festivals"], ["November","December","January","February"], 5000, "popular",  "Tier-1"),
    ("Panjim",       "Goa",         15.499, 73.827, ["urban","cultural","heritage"], ["culture","heritage","food","art"], ["November","December","January","February","March"], 4500, "popular",  "Tier-1"),
    ("Jaipur",       "Rajasthan",   26.912, 75.787, ["heritage","cultural","shopping"], ["heritage","culture","art","shopping","history"], ["October","November","December","January","February","March"], 4000, "popular",  "Tier-1"),
    ("Udaipur",      "Rajasthan",   24.585, 73.712, ["heritage","luxury","cultural"], ["heritage","culture","art","history"], ["October","November","December","January","February"], 4500, "popular",  "Tier-1"),
    ("Jodhpur",      "Rajasthan",   26.294, 73.048, ["heritage","cultural","culinary"], ["heritage","culture","food","history"], ["October","November","December","January","February","March"], 3800, "popular",  "Tier-1"),
    ("Jaisalmer",    "Rajasthan",   26.914, 70.916, ["adventure","heritage","rural"], ["heritage","adventure","culture","rural_tribal"], ["October","November","December","January","February"], 3500, "popular",  "Tier-2"),
    ("Pushkar",      "Rajasthan",   26.490, 74.551, ["spiritual","cultural","adventure"], ["spirituality","culture","festivals","heritage"], ["October","November","February","March"], 2500, "emerging", "Tier-3"),
    ("Munnar",       "Kerala",      10.089, 77.059, ["mountain","nature","wellness"], ["nature","wildlife","tea"], ["September","October","November","December","January","February","March"], 3500, "popular",  "Tier-2"),
    ("Alleppey",     "Kerala",      9.498,  76.339, ["nature","wellness","rural"], ["nature","food","culture","rural_tribal"], ["September","October","November","December","January","February"], 3800, "popular",  "Tier-2"),
    ("Wayanad",      "Kerala",      11.686, 76.132, ["nature","adventure","eco_friendly"], ["nature","wildlife","rural_tribal"], ["September","October","November","December","January","February"], 3200, "emerging", "Tier-2"),
    ("Coorg",        "Karnataka",   12.337, 75.812, ["nature","adventure","wellness"], ["nature","wildlife","food","culture"], ["October","November","December","January","February","March"], 4000, "popular",  "Tier-2"),
    ("Hampi",        "Karnataka",   15.335, 76.461, ["heritage","cultural","adventure"], ["heritage","history","art","culture"], ["October","November","December","January","February","March"], 2000, "popular",  "Tier-2"),
    ("Mysuru",       "Karnataka",   12.296, 76.639, ["heritage","cultural","culinary"], ["heritage","culture","food","art","festivals"], ["October","November","December","January","February"], 3000, "popular",  "Tier-1"),
    ("Ooty",         "Tamil Nadu",  11.414, 76.695, ["mountain","nature","wellness"], ["nature","tea","food"], ["March","April","May","October","November","December"], 3000, "popular",  "Tier-2"),
    ("Chettinad",    "Tamil Nadu",  10.100, 78.700, ["cultural","culinary","heritage"], ["culture","food","heritage","art","rural_tribal"], ["October","November","December","January","February"], 2800, "gem",      "Tier-3"),
    ("Madurai",      "Tamil Nadu",  9.925,  78.120, ["heritage","spiritual","culinary"], ["heritage","spirituality","food","culture","history"], ["October","November","December","January","February","March"], 2200, "popular",  "Tier-2"),
    ("Kanyakumari",  "Tamil Nadu",  8.087,  77.552, ["spiritual","nature","heritage"], ["spirituality","beaches","heritage","nature"], ["October","November","December","January","February"], 2000, "popular",  "Tier-2"),
    ("Manali",       "Himachal Pradesh", 32.241, 77.189, ["mountain","adventure","nature"], ["adventure","nature","wildlife"], ["March","April","May","June","October","November"], 4500, "popular",  "Tier-2"),
    ("Kasol",        "Himachal Pradesh", 32.009, 77.314, ["mountain","adventure","wellness"], ["nature","adventure","culture"], ["March","April","May","June","October"], 2500, "emerging", "Tier-3"),
    ("Spiti Valley", "Himachal Pradesh", 32.244, 78.066, ["mountain","adventure","spiritual"], ["adventure","heritage","spirituality","rural_tribal"], ["June","July","August","September"], 3500, "gem",      "Rural/Village"),
    ("Dharamsala",   "Himachal Pradesh", 32.219, 76.325, ["mountain","spiritual","cultural"], ["spirituality","culture","heritage","art"], ["March","April","May","September","October","November"], 3000, "popular",  "Tier-2"),
    ("Rishikesh",    "Uttarakhand", 30.086, 78.267, ["spiritual","adventure","wellness"], ["spirituality","adventure","culture","nature"], ["February","March","April","May","September","October","November"], 2500, "popular",  "Tier-2"),
    ("Mussoorie",    "Uttarakhand", 30.458, 78.066, ["mountain","nature","adventure"], ["nature","adventure","heritage"], ["March","April","May","September","October","November"], 3500, "popular",  "Tier-2"),
    ("Auli",         "Uttarakhand", 30.524, 79.568, ["mountain","adventure","nature"], ["adventure","nature","sports"], ["December","January","February","March","April","May"], 5000, "emerging", "Tier-3"),
    ("Khajuraho",    "Madhya Pradesh", 24.832, 79.919, ["heritage","cultural","spiritual"], ["heritage","history","art","spirituality"], ["October","November","December","January","February","March"], 2500, "popular",  "Tier-2"),
    ("Orchha",       "Madhya Pradesh", 25.352, 78.642, ["heritage","spiritual","nature"], ["heritage","spirituality","history","nature"], ["October","November","December","January","February","March"], 2000, "gem",      "Tier-3"),
    ("Pachmarhi",    "Madhya Pradesh", 22.467, 78.433, ["nature","adventure","heritage"], ["nature","wildlife","heritage","adventure"], ["October","November","December","January","February","March","April","May"], 2800, "emerging", "Tier-2"),
    ("Rann of Kutch","Gujarat",     23.738, 69.859, ["adventure","cultural","nature"], ["culture","rural_tribal","festivals","nature"], ["November","December","January","February"], 3500, "popular",  "Tier-2"),
    ("Ahmedabad",    "Gujarat",     23.030, 72.587, ["heritage","cultural","culinary"], ["heritage","culture","food","history","art"], ["October","November","December","January","February","March"], 2500, "popular",  "Tier-1"),
    ("Dwarka",       "Gujarat",     22.238, 68.967, ["spiritual","heritage","beach"], ["spirituality","heritage","beaches","history"], ["October","November","December","January","February","March"], 2000, "popular",  "Tier-2"),
    ("Puri",         "Odisha",      19.810, 85.832, ["spiritual","beach","cultural"], ["spirituality","beaches","heritage","festivals","culture"], ["October","November","December","January","February","March"], 2000, "popular",  "Tier-2"),
    ("Konark",       "Odisha",      19.887, 86.094, ["heritage","spiritual","beach"], ["heritage","history","art","spirituality","beaches"], ["October","November","December","January","February","March"], 1800, "popular",  "Tier-2"),
    ("Raghurajpur",  "Odisha",      19.936, 85.830, ["cultural","heritage","rural"], ["culture","art","rural_tribal","heritage"], ["October","November","December","January","February"], 1500, "gem",      "Rural/Village"),
    ("Gangtok",      "Sikkim",      27.336, 88.612, ["mountain","adventure","cultural"], ["nature","adventure","culture","wildlife"], ["March","April","May","September","October","November"], 4000, "popular",  "Tier-2"),
    ("Lachung",      "Sikkim",      27.685, 88.745, ["mountain","nature","adventure"], ["nature","wildlife","adventure","rural_tribal"], ["March","April","May","September","October"], 4500, "gem",      "Rural/Village"),
    ("Kaziranga",    "Assam",       26.578, 93.171, ["nature","adventure","eco_friendly"], ["wildlife","nature","rural_tribal"], ["November","December","January","February","March","April"], 3500, "popular",  "Tier-2"),
    ("Majuli",       "Assam",       26.940, 94.170, ["cultural","rural","nature"], ["culture","rural_tribal","art","festivals"], ["October","November","December","January","February","March"], 2000, "gem",      "Rural/Village"),
    ("Tirthan Valley","Himachal Pradesh", 31.596, 77.372, ["nature","adventure","wellness"], ["nature","wildlife","adventure","rural_tribal"], ["April","May","June","September","October"], 3000, "gem",      "Rural/Village"),
    ("Ziro Valley",  "Arunachal Pradesh", 27.547, 93.813, ["nature","cultural","rural"], ["culture","rural_tribal","nature","festivals"], ["September","October","November"], 3500, "gem",      "Rural/Village"),
    ("Hamirpur",     "Himachal Pradesh", 31.685, 76.522, ["rural","cultural","nature"], ["culture","heritage","nature","rural_tribal"], ["March","April","May","September","October","November"], 1500, "gem",      "Rural/Village"),
]

def make_destinations():
    destinations = []
    for i, seed in enumerate(DEST_SEEDS):
        name, state, lat, lng, vibes, tags, best_months, price, pop_tier, tier_cat = seed
        did = f"dest-{str(i+1).zfill(3)}"
        # affordability: cheaper = higher index
        afford = max(20, min(100, 100 - int((price - 1500) / 70)))
        sustain = random.randint(55, 98)
        capacity_load = random.randint(15, 85) if pop_tier == "gem" else random.randint(30, 95)
        is_over = capacity_load > 80 and pop_tier == "popular"
        destinations.append({
            "id": did,
            "name": name,
            "state": state,
            "lat": lat + random.uniform(-0.01, 0.01),
            "lng": lng + random.uniform(-0.01, 0.01),
            "vibe": vibes,
            "thematicTags": tags,
            "bestMonths": best_months,
            "rating": round(random.uniform(3.8, 4.9), 1),
            "startingPrice": price + random.randint(-200, 200),
            "popularityTier": pop_tier,
            "tierCategory": tier_cat,
            "affordabilityIndex": afford,
            "sustainabilityScore": sustain,
            "currentCapacityLoadPct": capacity_load,
            "isOvertouristed": is_over
        })
    return destinations

# ──────────────────────────────────────────────
# ATTRACTIONS (8 per top 15 destinations)
# ──────────────────────────────────────────────
ATTR_NAME_TEMPLATES = {
    "beach":     ["{} Beach","South {} Beach","Hidden {} Cove","Scenic {} Shoreline"],
    "fort":      ["{} Fort","Old {} Citadel","Ruins of {}","Royal {} Fort"],
    "restaurant":["{} Dhaba","Authentic {} Kitchen","The {} Table","Flavors of {}"],
    "museum":    ["{} Heritage Museum","Museum of {}","{} Gallery","Regional {} Museum"],
    "market":    ["{} Bazaar","Old {} Market","Artisan {} Market","Night Bazaar of {}"],
    "temple":    ["{} Temple","Shri {} Mandir","Ancient {} Shrine","{} Sacred Complex"],
    "nightlife": ["{} Café Row","Sunset Bar {}","The {} Lounge","Social Hub {}"],
    "park":      ["{} National Park","Botanical Gardens {}","{} Wildlife Sanctuary","{} Eco Park"],
    "waterfall": ["{} Falls","Cascades of {}","Hidden {} Waterfall","Scenic {} Plunge"],
}

def make_attractions(destinations):
    attractions = []
    top15 = destinations[:15]
    aid = 0
    for dest in top15:
        dname = dest["name"]
        dlat, dlng = dest["lat"], dest["lng"]
        cats = random.sample(ATTR_CATS, 8)
        for j, cat in enumerate(cats):
            aid += 1
            spread = 0.05
            name_tmpl = random.choice(ATTR_NAME_TEMPLATES.get(cat, ["{} Place"]))
            aname = name_tmpl.format(dname) if "{}" in name_tmpl else f"{dname} {cat.title()} {j+1}"
            open_h = random.choice(["06:00","07:00","08:00","09:00","10:00"])
            close_h = random.choice(["17:00","18:00","19:00","20:00","21:00","22:00"])
            indoor = "indoor" if cat in ["restaurant","museum","market","nightlife"] else "outdoor"
            attractions.append({
                "id": f"attr-{str(aid).zfill(4)}",
                "destinationId": dest["id"],
                "name": aname,
                "lat": dlat + random.uniform(-spread, spread),
                "lng": dlng + random.uniform(-spread, spread),
                "category": cat,
                "avgVisitDurationMins": random.choice([30,45,60,90,120]),
                "openHour": open_h,
                "closeHour": close_h,
                "indoorOutdoor": indoor,
                "estimatedCost": random.choice([0,50,100,150,200,300,500])
            })
    return attractions

# ──────────────────────────────────────────────
# REVIEWS (10 per destination)
# ──────────────────────────────────────────────
POS_REVIEWS = [
    "Absolutely stunning location! The natural beauty took my breath away.",
    "Incredible experience. The local food was amazing and the staff were super helpful.",
    "One of the best trips I've ever taken. Clean, peaceful and worth every rupee.",
    "The heritage sites here are world-class. Highly recommend for culture lovers.",
    "Perfect family destination. Kids loved every moment and everything was safe.",
    "Outstanding hospitality from the locals. Felt like a home away from home.",
    "The beach was pristine and uncrowded. Great value for money overall.",
    "Magical experience overall. The sunrise view alone was worth the journey.",
    "Loved the authentic local food and the guided tours were informative.",
    "Best hidden gem in India! Way better than the crowded tourist spots.",
]
NEG_REVIEWS = [
    "The roads leading to the destination were terrible. Need major improvement.",
    "Overcrowded during peak season. Staff seemed overwhelmed and not helpful.",
    "Too expensive for what it offers. Cleanliness could be much better.",
    "Disappointed with the accommodation. Basic amenities were lacking.",
    "The place is getting overtouristed. Lost its original charm.",
    "Not worth the long drive. Better options exist nearby for less money.",
]
MIXED_REVIEWS = [
    "Beautiful location but the crowds in December were overwhelming. Staff was helpful though.",
    "Great heritage sites but accommodation options are limited and overpriced.",
    "Amazing natural beauty, but the local transport options are very poor.",
    "Food was delicious but some places were not clean enough for international standards.",
    "Loved the culture and heritage, but the budget options are quite limited.",
    "Scenic and peaceful on weekdays, but weekends get very crowded.",
    "The main attractions are great but the surrounding infrastructure is underdeveloped.",
    "Value for money is good but do expect some rough roads on the way in.",
    "Staff at the hotel was fantastic but the restaurant attached to it was average.",
    "Good overall experience, though it can get very hot in summer months.",
]

def make_reviews(destinations):
    reviews = []
    rid = 0
    base_date = date(2023, 1, 1)
    for dest in destinations:
        for k in range(10):
            rid += 1
            roll = random.random()
            if roll < 0.55:
                text = random.choice(POS_REVIEWS)
                rating = random.randint(4, 5)
            elif roll < 0.75:
                text = random.choice(MIXED_REVIEWS)
                rating = random.randint(3, 4)
            else:
                text = random.choice(NEG_REVIEWS)
                rating = random.randint(1, 3)
            rdate = base_date + timedelta(days=random.randint(0, 730))
            reviews.append({
                "id": f"rev-{str(rid).zfill(5)}",
                "destinationId": dest["id"],
                "rating": rating,
                "text": text,
                "date": rdate.isoformat()
            })
    return reviews

# ──────────────────────────────────────────────
# CLIMATE (12 months × all destinations)
# ──────────────────────────────────────────────
# Monsoon states & their monsoon months
MONSOON_STATES = {
    "Goa": [6,7,8,9], "Maharashtra": [6,7,8,9], "Kerala": [6,7,8,9,10],
    "Karnataka": [6,7,8,9], "Tamil Nadu": [10,11,12], "Odisha": [6,7,8,9],
    "Assam": [5,6,7,8,9], "Sikkim": [5,6,7,8,9], "Rajasthan": [7,8],
    "Gujarat": [6,7,8,9], "Madhya Pradesh": [6,7,8,9],
    "Himachal Pradesh": [7,8,9], "Uttarakhand": [7,8,9],
    "Andhra Pradesh": [6,7,8,9], "Arunachal Pradesh": [5,6,7,8,9],
    "Jammu & Kashmir": [7,8],
}
# Base temp by latitude & month (rough approximation)
def base_temp(lat, month_idx):
    # Annual cycle: hottest around May (m=5), coldest Jan (m=1)
    seasonal = -15 * math.cos(2 * math.pi * (month_idx - 1) / 12)
    # Latitude effect: warmer near equator
    lat_effect = max(0, (25 - lat)) * 0.5
    return round(15 + seasonal + lat_effect + random.uniform(-2, 2), 1)

def make_climate(destinations):
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
                "destinationId": dest["id"],
                "month": month,
                "avgTempC": temp,
                "avgRainfallMm": rainfall,
                "avgHumidityPct": humidity,
                "monsoonSeason": is_monsoon
            })
    return climate

# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("Generating synthetic placeholder data...")

    destinations = make_destinations()
    print(f"  {len(destinations)} destinations")

    attractions = make_attractions(destinations)
    print(f"  {len(attractions)} attractions (8 × top-15 destinations)")

    reviews = make_reviews(destinations)
    print(f"  {len(reviews)} reviews (10 × {len(destinations)} destinations)")

    climate = make_climate(destinations)
    print(f"  {len(climate)} climate records (12 months × {len(destinations)} destinations)")

    for fname, data in [("destinations.json", destinations), ("attractions.json", attractions),
                        ("reviews.json", reviews), ("climate.json", climate)]:
        path = os.path.join(DATA_DIR, fname)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"  Wrote {path}")

    print("\nDone. All data files are SYNTHETIC PLACEHOLDERS.")
    print("See data/README.md for schema details and swap instructions.")
