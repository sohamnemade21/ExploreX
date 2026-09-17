# ExploreX 🌍
### AI-Powered Smart Tourism, Sustainable Demand Balancing & Travel Intelligence Platform


---

## 📌 1. Project Overview & Problem Statement

### The Problem
India's tourism ecosystem faces severe structural imbalances that threaten both ecological sustainability and local socio-economic growth:
- **Overtourism & Congestion in Saturated Hubs**: Popular destinations (e.g., North Goa, Manali, Shimla, Jaipur) suffer from acute infrastructure strain, hyper-inflation, environmental degradation, and resource depletion during peak seasons.
- **Economic Leakage in Rural & Heritage Clusters**: Tier-2, Tier-3, and rural artisan hubs (e.g., Sindhudurg, Solapur, Channapatna) receive less than 12% of total tourist footfall, depriving local homestays, craftsmen, and small businesses of direct tourism revenue.
- **Rigid, Static Itineraries**: Conventional travel planners provide static PDFs or fixed lists that fail when confronted with sudden weather disruptions, localized crowd spikes, or route closures.
- **Fragmented Traveler Safety Systems**: Solo and female travelers lack integrated, context-aware emergency tools, verified local helpline directories, and automated check-in safety nets.

### The Solution: ExploreX
**ExploreX** is an end-to-end intelligent travel and sustainable destination management platform engineered to resolve these challenges. By combining **Generative AI grounding**, **deterministic multi-objective optimization**, **open geospatial cartography**, and **secure transactional workflows**, ExploreX provides:
1. **Dynamic Demand Redistribution**: Algorithms that divert tourist footfall to high-authenticity, low-congestion alternative destinations.
2. **Real-Time Contextual Adaptation**: Autopilot itinerary rescheduling triggered by live weather forecasts and crowd levels.
3. **Local Economic Direct Retention**: Integrated directories connecting travelers directly to verified homestays, traditional khanavals, and GI-tagged artisan cooperatives.
4. **Comprehensive Traveler Safety**: Profile-based risk monitoring, check-in verification, night travel advisories, and single-click SOS dispatch.

---

## ✨ 2. Key Features & Unique Selling Propositions (USP)

| Feature Module | Core Capability | Unique Selling Proposition (USP) |
| :--- | :--- | :--- |
| **Sustainable Demand Balancer** | 5-factor heuristic scoring engine balancing tourist satisfaction with regional carrying capacity. | Actively reduces tourist concentration by up to 60% while boosting rural economic retention to >85%. |
| **AI Travel Concierge & Autopilot** | Conversational assistant with live database grounding + automated weather/congestion replanning. | Generates structured JSON re-plans shifting outdoor activities to indoor heritage sites during rain or surge. |
| **Cultural Specialty & Heritage Discovery** | Deep taxonomy of 200+ verified Indian POIs, GI-tagged crafts, local cuisines, and folk traditions. | Promotes authentic cultural preservation with direct links to local artisan guilds and khanavals. |
| **Geospatial Itinerary Mapping** | OpenStreetMap, Leaflet, Nominatim, and OSRM routing engine with interactive polylines. | 100% open-standard cartography without proprietary vendor lock-in or recurring per-query map tile costs. |
| **The Explorer Mobility Dispatcher** | Micro-mobility ride booking simulator (sedans, SUVs, autos, e-scooters) with distance-based pricing. | Realistic transit time computation, OTP security verification, and route visualizers. |
| **End-to-End Traveler Safety Center** | Mode-specific safety profiles (`solo_female`, `family`, `friends`), check-in intervals, and SOS broadcast. | Instant SOS dispatch with auto-populated Indian emergency helplines (112, 1363, 1091, 1098). |
| **Magic Moments Media Vault** | Cloud-persisted travel memory albums with per-user storage ceilings and location tagging. | User memory capture engine with strict file validation (15MB per file, 20MB user ceiling). |
| **Group Expense Splitter & Ledger** | Multi-passenger travel expense tracking with equal/custom split algorithms and debt simplification. | Zero-overhead group budgeting with internal wallet integration for seamless balance settlements. |
| **Secure Payment Gateway & Invoicing** | Razorpay integration with HMAC-SHA256 signature verification and automated Resend GST invoices. | End-to-end financial auditability with 18% GST calculation, coupon engine, and webhook receivers. |
| **Enterprise Admin Dashboard** | Role-based control center with real-time KPI metrics, audit logs, and rate-limited management APIs. | Full platform observability covering bookings, revenue, ride dispatches, and email delivery status. |

---

## 🏗️ 3. System Architecture

ExploreX operates on a unified, high-performance decoupled full-stack architecture:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (Vite SPA)                             │
│                                                                                  │
│   • React 19 + TypeScript 5.8              • Tailwind CSS v4 Engine              │
│   • Motion (Smooth Transitions & Modals)   • Lucide React Icons                  │
│   • Leaflet Interactive Map Canvas         • OpenStreetMap Standard Tiles        │
│   • AuthContext (JWT Session Store)        • Centralized API Service Wrapper     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                         HTTPS REST API  │  Authorization: Bearer <Supabase_JWT>
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND API GATEWAY (Express.js 4.21)                       │
│                                                                                  │
│   • Port 3000 Ingress Binding              • Raw Body Preservation (HMAC Auth)   │
│   • Supabase JWT Auth Middleware           • Multer Storage Engine (/uploads)    │
│   • Vite Dev Middleware / Prod Static      • Rate-Limited Admin Router           │
│   • Local JSON Document Store Fallback     • Robust Automated Verification Suite │
└───┬──────────────────┬─────────────────┬───────────────────┬─────────────────┬───┘
    │                  │                 │                   │                 │
    ▼                  ▼                 ▼                   ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐ ┌─────────────┐
│  AI ENGINE   │ │  SUPABASE    │ │   PAYMENTS   │ │  MAPS & GEODATA   │ │    EMAIL    │
│              │ │  AUTH & DB   │ │  (RAZORPAY)  │ │   (OSM / OSRM)    │ │  (RESEND)   │
│ • @google/   │ │ • Supabase   │ │ • Orders API │ │ • Leaflet Canvas  │ │ • Resend    │
│   genai SDK  │ │   Auth API   │ │ • HMAC-SHA256│ │ • OpenStreetMap   │ │   REST API  │
│ • Gemini 2.5 │ │ • PostgreSQL │ │   Signature  │ │   Tile Server     │ │ • Dynamic   │
│   Flash      │ │ • Row Level  │ │   Check      │ │ • Nominatim Geo   │ │   HTML GST  │
│ • Context    │ │   Security   │ │ • Asymmetric │ │ • OSRM Routing &  │ │   Vouchers  │
│   Grounding  │ │ • Resilient  │ │   Webhooks   │ │   Polyline Matrix │ │ • Sandbox   │
│ • Heuristic  │ │   Local JSON │ │ • In-App Wlt │ │ • 200+ Verified   │ │   Automatic │
│   Optimizer  │ │   DB Manager │ │ • GST & Disc.│ │   Indian POIs     │ │   Fallback  │
└──────────────┘ └──────────────┘ └──────────────┘ └───────────────────┘ └─────────────┘
```

---

## 💻 4. Actual Tech Stack

### Frontend
- **Framework**: React `19.0.1` (Single-Page Application)
- **Language**: TypeScript `5.8.2`
- **Build Tool & Bundler**: Vite `6.2.3`
- **Styling**: Tailwind CSS v4 (`4.1.14`) via `@tailwindcss/vite`
- **Animations**: Motion (`12.23.24`)
- **Icons**: Lucide React (`0.546.0`)
- **Mapping & GIS**: Leaflet (`1.9.4`) with `@types/leaflet`
- **State Management**: React Context API (`AuthContext`, custom hooks)

### Backend & Middleware
- **Runtime**: Node.js v20+ LTS
- **Server Framework**: Express.js `4.21.2`
- **Execution / Compilation**: `tsx` (`4.21.0`) for development, `esbuild` (`0.25.0`) for production bundling
- **File Uploads**: Multer `2.3.0` (multipart form handling with file ceilings)
- **Environment Management**: `dotenv` `17.2.3`
- **Security & Crypto**: Native Node.js `crypto` (HMAC-SHA256)

### Database & Authentication
- **Cloud Database**: Supabase PostgreSQL (`@supabase/supabase-js` `2.114.0`) with Row Level Security (RLS)
- **Authentication**: Supabase Auth (JWT Bearer Token verification, password hashing)
- **Local Persistence Fallback**: Zero-cold-start JSON Document Store (`server/db.ts` ↔ `data_store.json`)

### External Services & APIs
- **Generative AI**: Google Gemini 2.5 Flash via official `@google/genai` (`2.4.0`)
- **Payments**: Razorpay REST API v1 (Orders, Signatures, Webhook verification)
- **Communications**: Resend REST API (Itemized GST booking confirmations & vouchers)
- **Geodata & Routing**: OpenStreetMap (OSM) Tiles, Nominatim Geocoding API, OSRM (Open Source Routing Machine)

### Companion ML Microservice (Optional / Extended Pipeline)
- **Framework**: FastAPI (Python 3.10+) with Uvicorn
- **Algorithms**: Scikit-Learn (Random Forest Regressor, Gradient Boosting), VADER NLP (`nltk`), OR-Tools TSP solver

---

## 🧠 5. AI/ML Approach & Technical Clarification

> [!IMPORTANT]
> **Active Prototype Architecture Clarification:**  
> The core production prototype runs on **Generative AI (Google Gemini 2.5 Flash) combined with deterministic multi-objective heuristic optimization algorithms and contextual database grounding**.  
> It does **NOT** rely on an unexplainable black-box machine learning model in its critical production path.

### 1. Deterministic Demand Balancer Formula
The Sustainable Demand Balancer (`server/services/demandBalancerService.ts`) calculates a multi-objective index across five weighted parameters:

$$\text{Overall Score} = (S \times 0.25) + (A \times 0.20) + (E \times 0.25) + (W \times 0.15) + (C \times 0.15)$$

Where:
- **$S$ (Tourist Satisfaction - 25%)**: Evaluates vibe alignment, thematic tag intersections, and historical ratings.
- **$A$ (Affordability - 20%)**: Compares destination daily spending tier against traveler budget constraints.
- **$E$ (Local Economic Retention - 25%)**: Prioritizes destinations with registered homestays, artisan cooperatives, and community guides.
- **$W$ (Weather & Seasonal Fit - 15%)**: Evaluates ideal travel calendar months and current temperature windows (18°C–32°C).
- **$C$ (Crowd Avoidance & Carrying Capacity - 15%)**: Penalizes overtouristed hubs ($100 - \text{Capacity Load \%}$) while granting bonuses to emerging/Tier-3 destinations.

### 2. Contextual Generative AI Grounding
- **Google GenAI SDK (`@google/genai`)**: Interacts directly with `gemini-2.5-flash`.
- **Grounded Prompts**: Ingests structured POIs, local cultural attributes, and verified emergency data before query execution.
- **Dynamic Autopilot**: Triggers structured JSON replanning when environmental disruptions (rainfall >80%, crowd gridlocks) occur.

### 3. Companion ML Microservice (`ml-service/`)
For research, extended benchmarking, and offline predictive modeling, a companion FastAPI microservice and Colab training notebook (`WanderAI_ML_Model_Training.py`) are included in the repository:
- **Price Forecasting**: `RandomForestRegressor` trained with historical Indian holiday and seasonality calendars.
- **Weather-Fit Scoring**: `GradientBoostingRegressor` evaluating precipitation and temperature suitability.
- **Sentiment Analysis**: VADER NLP scoring over traveler review corpora.
- **Itinerary Optimization**: 2-Opt and Google OR-Tools solving the Traveling Salesperson Problem (TSP) across attractions.
- **Graceful Fallback**: If `ml-service` is offline, the main Express application automatically defaults to its built-in rule-based heuristic optimizer with zero downtime.

---

## 🔌 6. APIs & Services Actually Used

| Service | Provider | Purpose in ExploreX | Integration Method |
| :--- | :--- | :--- | :--- |
| **Google Gemini AI** | Google Cloud | Conversational travel assistant, weather autopilot, what-if scenarios | `@google/genai` TypeScript SDK (`gemini-2.5-flash`) |
| **Supabase Auth** | Supabase | User registration, encrypted login, JWT session verification | Supabase Auth REST API (`@supabase/supabase-js`) |
| **Supabase DB** | Supabase | Cloud PostgreSQL storage with Row-Level Security policies | Supabase Client (`@supabase/supabase-js`) |
| **Razorpay API** | Razorpay | Order generation, payment processing, 18% GST calculation | REST API v1 (`https://api.razorpay.com/v1/orders`) |
| **Razorpay Webhooks** | Razorpay | Asymmetric payment status updates (`payment.captured`, refunds) | HMAC-SHA256 verification on raw request body |
| **Resend API** | Resend | Dispatching booking vouchers, itemized tax invoices | REST API (`https://api.resend.com/emails`) |
| **OpenStreetMap** | OSM Community | Cartographic tile layers for Leaflet map canvas | Tile Layer URL (`https://{s}.tile.openstreetmap.org/`) |
| **Nominatim** | OpenStreetMap | Geocoding and reverse geocoding Indian locations | Standard OSM Geocoding REST Endpoints |
| **OSRM** | Project OSRM | Road routing, transit polylines, duration calculations | Open Source Routing Machine REST API |

---

## 📂 7. Project Structure

```text
ExploreX/
├── .env.example                 # Environment configuration template (placeholders only)
├── .gitignore                   # Git ignore specifications
├── data_store.json              # Local persistent JSON document store
├── index.html                   # HTML entry point with Leaflet stylesheets & meta tags
├── package.json                 # Project dependencies and script definitions
├── README.md                    # Project documentation
├── server.ts                    # Main Express.js backend & Vite integration server
├── Tech_stack.md                # Comprehensive technical specification document
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 & React plugin
│
├── ml-service/                  # Optional Python FastAPI ML Microservice
│   ├── data/                    # Seed datasets (destinations, attractions, reviews, climate)
│   ├── models/                  # Trained model serialization directory
│   ├── routes/                  # FastAPI router definitions (price, weather, recommendations)
│   ├── services/                # Scikit-learn, VADER NLP & OR-Tools implementations
│   ├── generate_data.py         # Synthetic benchmark dataset generator
│   ├── load_real_data.py        # Real POI data ingestion pipeline
│   ├── main.py                  # FastAPI server entry point
│   ├── requirements.txt         # Python dependencies
│   └── train.py                 # Offline model training script
│
├── public/                      # Static client assets and favicon
│   └── images/                  # High-resolution destination and vehicle assets
│
├── server/                      # Express.js Backend Architecture
│   ├── config/
│   │   ├── env.ts               # Environment validation & secret masking diagnostics
│   │   └── supabase.ts          # Supabase client initialization
│   ├── data/
│   │   └── initialData.ts       # 200+ verified Indian POIs, cultural & economic seed data
│   ├── routes/
│   │   └── api.ts               # Central REST API router (/api/v1/*)
│   ├── scripts/
│   │   └── runTests.ts          # 44+ automated integration tests
│   ├── services/
│   │   ├── aiChatService.ts     # Gemini conversational grounding & assistant service
│   │   ├── culturalService.ts   # Regional specialties, handicrafts & hierarchy browser
│   │   ├── demandBalancerService.ts # Multi-objective sustainable demand balancing engine
│   │   ├── emailService.ts      # Resend email client with GST invoice templates
│   │   ├── exploreService.ts    # Geospatial POI filtering & discovery engine
│   │   ├── itineraryService.ts  # Intelligent multi-day itinerary generation
│   │   ├── packageService.ts    # Curated travel packages & booking calculations
│   │   ├── paymentService.ts    # Razorpay orders, HMAC checks & in-app wallet ledger
│   │   ├── pdfInvoiceService.ts # Itemized tax invoice generator
│   │   ├── razorpayService.ts   # Razorpay API client & webhook handler
│   │   ├── safetyService.ts     # Traveler safety profiles, check-ins & emergency SOS
│   │   ├── supabaseAuthService.ts # Supabase JWT authentication middleware
│   │   └── weatherService.ts    # Weather data ingestion & advisory service
│   ├── db.ts                    # Resilient local JSON document store manager
│   └── gemini.ts                # Google GenAI SDK client & context assembler
│
├── src/                         # React 19 Frontend Application
│   ├── components/              # Reusable UI Components & Modals
│   │   ├── admin/               # Admin dashboard charts, audit tables & analytics
│   │   ├── ui/                  # Design system primitives (buttons, cards, badges)
│   │   ├── AuthModal.tsx        # Authentication modal dialog
│   │   ├── BestTimeEngineCard.tsx # Seasonal weather & crowd guide card
│   │   ├── BookingCheckoutModal.tsx # Multi-step checkout with Razorpay & Wallet
│   │   ├── CulturalSpecialtyDiscovery.tsx # Regional culture, food & craft explorer
│   │   ├── DemandBalancerCard.tsx # Sustainable alternative comparison card
│   │   ├── Footer.tsx           # Responsive application footer
│   │   ├── ImageWithFallback.tsx # Optimized image component with fallback handlers
│   │   ├── IndiaTravelHierarchyBrowser.tsx # State/Region/District taxonomy browser
│   │   ├── InvoiceModal.tsx     # Itemized booking receipt & tax breakdown view
│   │   ├── LocalEconomyDirectoryCard.tsx # Homestays, artisans & guides directory
│   │   ├── MapComponent.tsx     # Leaflet interactive map with custom divIcons
│   │   ├── Navbar.tsx           # Global navigation header with user controls
│   │   ├── PaymentResultModal.tsx # Transaction confirmation & status feedback
│   │   ├── ReviewModal.tsx      # Verified booking review submission dialog
│   │   └── TravelerSafetyCenterModal.tsx # SOS broadcast, check-in & safety settings
│   ├── context/
│   │   ├── AuthContext.tsx      # Global Supabase authentication session provider
│   │   └── ToastContext.tsx     # Global notification toast provider
│   ├── services/
│   │   └── api.ts               # Type-safe client REST API client with JWT injection
│   ├── utils/                   # Formatting, date & currency helpers
│   ├── views/                   # Application Views / Pages
│   │   ├── AIAssistantView.tsx  # Interactive travel chat & itinerary autopilot
│   │   ├── AdminView.tsx        # Executive analytics dashboard & audit logs
│   │   ├── BookingsView.tsx     # Booking history, cancellation & voucher download
│   │   ├── DestinationsView.tsx # Destination catalog & demand balancer explorer
│   │   ├── ExploreView.tsx      # Interactive map-first POI discovery interface
│   │   ├── HomeView.tsx         # Landing page with featured gems & search engine
│   │   ├── LoginView.tsx        # User login portal
│   │   ├── MagicMomentsView.tsx # Travel photo/video album memory vault
│   │   ├── MyTripsDashboardView.tsx # Active itineraries & trip expense tracker
│   │   ├── PackagesView.tsx     # Curated holiday packages with day-wise plans
│   │   ├── ProfileView.tsx      # User profile, Travel DNA & safety settings
│   │   ├── SignupView.tsx       # New user onboarding portal
│   │   ├── TheExplorerView.tsx  # Micro-mobility transit booking simulator
│   │   └── WalletView.tsx       # In-app wallet ledger & transaction history
│   ├── App.tsx                  # Root application view router
│   ├── index.css                # Tailwind CSS v4 styling rules
│   ├── main.tsx                 # React DOM mount entrypoint
│   └── types.ts                 # Strict TypeScript domain interfaces & types
│
├── supabase/                    # Supabase Cloud Database Configurations
│   └── migrations/              # PostgreSQL table schemas & RLS policies
└── uploads/                     # Local storage destination for user uploads
```

---

## 🚀 8. Installation & Local Setup

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Python** *(Optional - for standalone ML service)*: Python 3.10+

### Step-by-Step Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/explorex.git
   cd explorex
   ```

2. **Install Node.js Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment template to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in the placeholders (see [Section 9](#-9-environment-variables)).

4. **Verify Type Checking & Automated Tests**:
   ```bash
   npm run lint
   npm run test:verify
   ```

---

## 🔐 9. Environment Variables

> [!CAUTION]
> **Security Notice:** Never commit `.env` or expose API keys, webhook secrets, or private database passwords to public repositories. All production secrets reside strictly on the server.

Create a `.env` file in the root directory with the following structure:

```ini
# ==============================================================================
# ExploreX Environment Configuration Template
# ==============================================================================

# Core Application Settings
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# Artificial Intelligence (Google Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=optional_openai_api_key_here

# Cloud Database & Authentication (Supabase)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_key_secret_here
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret_here

# Transactional Communications (Resend Email)
RESEND_API_KEY=re_your_resend_api_key_here
RESEND_FROM_EMAIL=confirmations@explorex.com

# Geospatial & Maps
GOOGLE_MAPS_API_KEY=optional_google_maps_key_here

# Optional Companion ML Microservice
ML_SERVICE_URL=http://localhost:8000
```

---

## 🏃 10. Running Frontend, Backend & Test Suites

### Development Mode (Express + Vite Hybrid)
In development, Express hosts the API endpoints and integrates Vite in middleware mode on port **3000**:
```bash
npm run dev
```
- Web Application: `http://localhost:3000`
- API Health Endpoint: `http://localhost:3000/api/health`
- REST API Root: `http://localhost:3000/api/v1`

### Running the Automated Test Suite
Run the 44+ automated integration test suite verifying destination isolation, Razorpay HMAC security, and zero POI leakage:
```bash
npm run test:verify
```

### Production Build & Deployment
```bash
# 1. Build client bundle and bundle server with esbuild
npm run build

# 2. Launch production server
npm start
```

### (Optional) Running the Companion Python ML Microservice
```bash
# Navigate to ML service directory
cd ml-service

# Create virtual environment & install requirements
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Launch FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```

---

## 🛡️ 11. Authentication, Security & Payment Flow

```text
 ┌──────────────┐         ┌──────────────┐         ┌──────────────┐         ┌──────────────┐
 │   TRAVELER   │         │ EXPLOREX APP │         │   EXPRESS    │         │   RAZORPAY   │
 │   BROWSER    │         │  (REACT 19)  │         │   BACKEND    │         │   GATEWAY    │
 └──────┬───────┘         └──────┬───────┘         └──────┬───────┘         └──────┬───────┘
        │                        │                        │                        │
        │ 1. Select Package/Ride │                        │                        │
        │───────────────────────>│                        │                        │
        │                        │ 2. Create Order Intent │                        │
        │                        │───────────────────────>│                        │
        │                        │                        │ 3. Compute 18% GST     │
        │                        │                        │    & Create Order      │
        │                        │                        │───────────────────────>│
        │                        │                        │ 4. Order ID (Paise)    │
        │                        │                        │<───────────────────────│
        │                        │ 5. Return Order Params │                        │
        │                        │<───────────────────────│                        │
        │ 6. Razorpay Modal Open │                        │                        │
        │<───────────────────────│                        │                        │
        │ 7. Complete Payment    │                        │                        │
        │─────────────────────────────────────────────────────────────────────────>│
        │ 8. Return Signatures (order_id, payment_id, signature)                   │
        │<─────────────────────────────────────────────────────────────────────────│
        │                        │ 9. Verify Signature    │                        │
        │                        │───────────────────────>│                        │
        │                        │                        │ 10. Verify HMAC-SHA256 │
        │                        │                        │     Update DB to Paid  │
        │                        │                        │ 11. Dispatch Email     │
        │                        │                        │     via Resend API     │
        │                        │ 12. Confirm Booking    │                        │
        │                        │<───────────────────────│                        │
        │ 13. Render Voucher/PDF │                        │                        │
        │<───────────────────────│                        │                        │
```

### Security Highlights
1. **Zero Secret Leakage**: No API keys or webhook secrets are exposed to client-side bundles. All critical integrations execute server-side.
2. **Raw Body Webhook Verification**: Express preserves `req.rawBody` byte-for-byte to prevent payload tampering when verifying HMAC-SHA256 signatures from Razorpay.
3. **Decoupled Identity Management**: User passwords are never handled or stored by the application server; all credentials pass directly to Supabase Auth over TLS.
4. **JWT Bearer Protection**: Protected endpoints enforce strict session token validation via Supabase Auth middleware (`requireAuth`).
5. **Rate-Limiting Defense**: In-memory rate limiting guards administrative routes (120 reqs/min per IP) against brute-force attacks.

---

## 🔮 12. Future ML & Scaling Improvements

1. **IoT & Edge Sensor Integration**: Ingest real-time ticketing gate counts and parking occupancy sensors from state tourism boards for sub-hourly crowd predictions.
2. **Reinforcement Learning from Human Feedback (RLHF)**: Dynamic hyper-parameter tuning of the Demand Balancer weights based on post-trip review scores and repeat booking rates.
3. **Multilingual Speech & Dialect Grounding**: Expand AI assistant to support voice queries in 12+ regional Indian languages (Hindi, Marathi, Tamil, Bengali, Telugu, Gujarati, etc.).
4. **Offline-First PWA Synchronization**: Service worker caching and SQLite/WASM client replication for travelers exploring remote Himalayan or coastal areas with intermittent connectivity.
5. **Decentralized Carbon Offset Verification**: Direct integration with verified Indian afforestation initiatives for verifiable carbon credit calculation per trip.

---

## 📚 13. Research, Standards & References

- **Ministry of Tourism, Government of India**: National Strategy for Sustainable Tourism (2022) and Guidelines for Dekho Apna Desh.
- **UN Tourism (UNWTO)**: Sustainable Tourism Development Guidelines & Carrying Capacity Assessment Methodologies.
- **Geographical Indications Registry (India)**: Official database of GI-Tagged Indian Handicrafts, Textiles, and Agricultural Specialties.
- **Payment Card Industry Data Security Standard (PCI-DSS)**: Standardized guidelines for decoupled payment handling and HMAC signature validation.
- **Open Geospatial Consortium (OGC)**: Standards for WGS84 coordinates, vector tile styling, and polyline distance algorithms.

---

## 🇮🇳 14. SIH-Focused Impact & National Use Cases

| Target Stakeholder | Real-World Impact | Relevant Government Mission |
| :--- | :--- | :--- |
| **State Tourism Boards** *(e.g., MTDC, RTDC, GTDC)* | Granular dashboard for monitoring footfall, preventing overtourism, and planning sustainable infrastructure investments. | **Swadesh Darshan 2.0** |
| **Rural Homestays & Khanavals** | Zero-commission direct customer discovery, boosting local household income retention to >85%. | **Rural Tourism Mission & Vibrant Villages Programme** |
| **Local Artisans & Weavers** | In-app spotlight on GI-tagged crafts (e.g., Paithani, Solapuri Chaddar, Kolhapuri Chappals) connecting tourists directly to artisan guilds. | **One District One Product (ODOP) & Vocal for Local** |
| **Solo & Women Travelers** | Standardized safety scores, 24/7 check-in verification, night travel advisories, and immediate connection to Indian Women Helpline (1091) and Tourist Police (1363). | **Nari Shakti & Safe Tourist Destination Initiative** |
| **Travelers & Eco-Tourists** | Intelligent discovery of uncrowded heritage gems, dynamic weather re-planning, transparent GST invoices, and fair-price transit. | **Dekho Apna Desh Campaign** |

---

<div align="center">
  <sub>Built with ❤️ for sustainable tourism .</sub>
</div>
