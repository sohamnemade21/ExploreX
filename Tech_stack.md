# ExploreX Technology Stack Specification
**SIH-Ready Architecture & Engineering Reference**  
*Document Version: 2.0.0 | Last Verified: September 2026*

---

## 1. Executive Summary

**ExploreX** is an AI-powered smart tourism and travel optimization platform engineered for sustainable, high-efficiency destination management. The system is built upon a high-performance decoupled full-stack architecture combining a reactive TypeScript/React 19 single-page application (SPA), an Express.js API gateway, cloud-native database and authentication via Supabase PostgreSQL, state-of-the-art generative AI through Google Gemini (`@google/genai`), open-standard geospatial mapping (Leaflet, OpenStreetMap, Nominatim, OSRM), secure transactional payments via Razorpay with cryptographic webhook verification, and transactional communications via Resend.

Every technology listed in this document is actively implemented, verified, and operational within the project codebase.

---

## 2. Technology Stack Matrix

| Domain | Technology / Service | Version / Spec | Role & Function |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **React** | `^19.0.1` | Declarative UI rendering, reactive component lifecycle, hooks architecture |
| **Frontend Language** | **TypeScript** | `~5.8.2` | Compile-time type safety, domain data contracts, interfaces |
| **Client Bundler & Dev Server** | **Vite** | `^6.2.3` | Hot Module Replacement (HMR) in development, tree-shaken static production bundle |
| **CSS & Design System** | **Tailwind CSS (v4)** | `^4.1.14` (`@tailwindcss/vite`) | Utility-first responsive design, modern `@import "tailwindcss"` CSS architecture |
| **UI Motion & Transitions** | **Motion (Framer Motion)** | `^12.23.24` (`motion/react`) | Fluid route transitions, modal reveals, interactive card hover physics |
| **Iconography** | **Lucide React** | `^0.546.0` | Standardized SVG vector travel, UI, mobility, and navigational icons |
| **Map Rendering** | **Leaflet** | `^1.9.4` (`@types/leaflet`) | Interactive client-side map canvas, custom HTML/SVG divIcons, popups, polylines |
| **Map Cartography** | **OpenStreetMap (OSM)** | Standard Tile Layer | Open-access global map tile service without restrictive proprietary API quotas |
| **Geocoding Engine** | **Nominatim** | OSM Geocoding Standard | Natural-language location-to-coordinate lookup and reverse geocoding |
| **Routing & Distance Engine** | **OSRM** | Open Source Routing Machine | Waypoint routing, distance matrices, transit polylines, and duration calculations |
| **State Management** | **React Context API** | Native React Hooks | Global authentication (`AuthContext`), toast alerts (`ToastContext`), view state |
| **API Client** | **Native Fetch API Wrapper** | Custom (`src/services/api.ts`) | Type-safe REST client with automatic JWT Bearer token injection and error handling |
| **Backend Runtime** | **Node.js LTS** | Node.js v20+ / `tsx ^4.21.0` | TypeScript execution in development, high-throughput asynchronous event loop |
| **Backend Framework** | **Express.js** | `^4.21.2` (`@types/express`) | REST API routing, custom middleware, raw body preservation, static file delivery |
| **Backend Bundler** | **esbuild** | `^0.25.0` | Compiles and bundles TypeScript server into standalone CommonJS `dist/server.cjs` |
| **Cloud Database** | **Supabase PostgreSQL** | `@supabase/supabase-js ^2.114.0` | Cloud-hosted relational database engine with Row Level Security (RLS) support |
| **Authentication & IAM** | **Supabase Auth** | Cloud Supabase Auth API | Sole source of truth for user registration, encrypted passwords, login, and JWTs |
| **Local Storage / Sync** | **JSON Document Store** | `DatabaseManager` (`server/db.ts`) | Resilient local file persistence (`data_store.json`) for zero-cold-start development |
| **Generative AI SDK** | **Google Gen AI SDK** | `@google/genai ^2.4.0` | Official Google GenAI TypeScript client for model interaction |
| **Core AI Model** | **Gemini 2.5 Flash** | `gemini-2.5-flash` | Multimodal conversational concierge, weather/congestion autopilot, what-if simulations |
| **ML Microservice Gateway** | **Python ML Gateway** | FastAPI / `ML_SERVICE_URL` | Integration for tourism demand forecasting and algorithmic heuristics |
| **Payment Processing** | **Razorpay** | REST API v1 (`api.razorpay.com`) | Orders API, checkout integration, 18% GST calculation, currency in INR (paise) |
| **Payment Verification** | **Cryptographic HMAC** | Node.js `crypto` module | HMAC-SHA256 signature verification for order completion and webhook payloads |
| **Transactional Email** | **Resend** | REST API (`api.resend.com/emails`) | High-deliverability transactional booking vouchers and itemized GST invoices |
| **File Upload Handling** | **Multer** | `^2.3.0` (`@types/multer`) | Multipart form handling with 15MB file ceiling and 20MB per-user quota checks |
| **Testing & Quality Assurance** | **Custom Test Suite** | `server/scripts/runTests.ts` | 44+ automated integration tests covering DB isolation, payments, auth, and webhooks |
| **Static Code Analysis** | **TypeScript Compiler** | `tsc --noEmit` | Strict static type checking and contract enforcement across server and client |
| **Hosting & Containerization** | **Google Cloud Run** | Docker Container | Port 3000 ingress, reverse proxy compatible, production static asset serving |

---

## 3. Project Architecture

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER (Vite SPA)                             │
│                                                                                  │
│   • React 19 + TypeScript (5.8)            • Tailwind CSS v4 Engine              │
│   • Motion (Smooth Transitions & Modals)   • Lucide React Icons                  │
│   • Leaflet Interactive Map View           • OpenStreetMap Standard Tiles        │
│   • AuthContext (JWT Bearer Token Store)   • Centralized API Service Wrapper     │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                         HTTPS REST API  │  Authorization: Bearer <Supabase_JWT>
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND API GATEWAY (Express.js 4.21)                       │
│                                                                                  │
│   • Port 3000 Ingress Binding              • Raw Body Preservation (HMAC Auth)   │
│   • JWT Auth Middleware (requireAuth)      • Multer File Storage (/uploads)      │
│   • Vite Dev Middleware / Prod Static      • API Router (/api/v1/*)              │
└───┬──────────────────┬─────────────────┬───────────────────┬─────────────────┬───┘
    │                  │                 │                   │                 │
    ▼                  ▼                 ▼                   ▼                 ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐ ┌─────────────┐
│  AI ENGINE   │ │  SUPABASE    │ │   PAYMENTS   │ │  MAPS & GEODATA   │ │    EMAIL    │
│              │ │  AUTH & DB   │ │  (RAZORPAY)  │ │   (OSM / OSRM)    │ │  (RESEND)   │
│ • @google/   │ │ • Supabase   │ │ • Orders API │ │ • Leaflet Engine  │ │ • Resend    │
│   genai SDK  │ │   Auth API   │ │ • HMAC-SHA256│ │ • OpenStreetMap   │ │   REST API  │
│ • gemini-2.5-│ │ • PostgreSQL │ │   Signature  │ │   Tile Server     │ │ • Dynamic   │
│   flash      │ │ • Row Level  │ │   Check      │ │ • Nominatim Geo   │ │   HTML      │
│ • Context    │ │   Security   │ │ • Asymmetric │ │ • OSRM Routing &  │ │   Vouchers  │
│   Grounding  │ │ • User Meta  │ │   Webhooks   │ │   Polyline Matrix │ │ • Sandbox   │
│ • ML Gateway │ │ • Token Vrfy │ │ • In-App Wlt │ │ • 200+ Verified   │ │   Automatic │
│   Fallback   │ │ • DB Manager │ │ • GST & Disc.│ │   Indian POIs     │ │   Routing   │
└──────────────┘ └──────────────┘ └──────────────┘ └───────────────────┘ └─────────────┘
```

---

## 4. Layer-by-Layer Architectural Breakdown

### 4.1. Frontend Application Layer
- **Component Architecture**: Built with React 19 functional components utilizing strict hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`). View navigation is implemented via state-driven views (`ExploreView`, `ItineraryView`, `DemandBalancerView`, `CulturalSpecialtiesView`, `LocalEconomyView`, `ExplorerRidesView`, `MagicMomentsView`, `ExpensesView`, `ProfileView`, `AdminDashboardView`).
- **Styling with Tailwind CSS v4**: Uses the official `@tailwindcss/vite` plugin with `@import "tailwindcss";` in `src/index.css`. Fully responsive, mobile-first design adhering strictly to high-contrast accessibility standards and mathematical spacing rules.
- **Micro-Interactions & Animations**: Powered by `motion/react` (`^12.23.24`) for smooth modal backdrop appearances, checkout step transitions, badge state pulses, and tab switching.
- **Client Security & Authentication State**:
  - `AuthContext.tsx` handles user session lifecycle.
  - Supabase JWT access tokens are stored in `localStorage` under `explorex_auth_token` and automatically included in HTTP requests via `Authorization: Bearer <token>`.
  - Passwords are never handled, retained, or cached in client state.

### 4.2. Backend & Middleware Layer
- **Web Framework**: Express.js (`server.ts`) hosting all REST endpoints under `/api/v1/*` (with `/api/*` alias for backward compatibility).
- **Vite Integration (Hybrid Architecture)**:
  - *Development*: Express mounts Vite in middleware mode (`createServer({ server: { middlewareMode: true }, appType: 'spa' })`), serving client code and API endpoints seamlessly on a single port (3000).
  - *Production*: Express serves the production client bundle from `dist/` with a wildcard catch-all fallback for SPA client-side routing.
- **Raw Request Body Preservation**: Configured via `express.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); } })`. This ensures byte-for-byte cryptographic integrity when computing HMAC-SHA256 signatures for Razorpay webhooks.
- **Authentication Middleware (`requireAuth`)**: Located in `server/services/supabaseAuthService.ts`. Validates bearer tokens using Supabase Auth `getUser()` before granting access to protected endpoints.
- **File Upload Engine (`multer`)**: Manages multipart form data for the Magic Moments travel memory gallery, restricting single file sizes to 15MB and enforcing an active 20MB storage ceiling per user.

### 4.3. Database & Authentication Layer
- **Supabase Cloud PostgreSQL**:
  - Connected through `@supabase/supabase-js` (`server/config/supabase.ts`).
  - Supports Row Level Security (RLS) policies ensuring users can only read and mutate their own bookings, personal itineraries, private albums, and payment ledgers.
- **Supabase Authentication**:
  - **Sole Source of Truth**: Completely decoupled from local password storage. Passwords are sent over TLS directly to Supabase Auth and hashed with industry-standard bcrypt/Argon2.
  - **User Registration**: `supabase.auth.signUp()` / `supabaseAdmin.auth.admin.createUser()`.
  - **User Login**: `supabase.auth.signInWithPassword()` with strict credential verification.
  - **Session Verification**: Server-side verification of active JWTs via `supabase.auth.getUser(token)`.
  - **Password Recovery**: `supabase.auth.resetPasswordForEmail()`.
- **Hybrid Local Persistence Fallback (`DatabaseManager`)**:
  - Document store (`server/db.ts`) synchronizing with `data_store.json`.
  - Maintains seeded collections: `users`, `destinations`, `packages`, `bookings`, `explorerRides`, `magicAlbums`, `magicPhotos`, `reviews`, `walletTransactions`, `groupTrips`, `offers`.
  - Ensures the platform operates smoothly in isolated developer environments, automated continuous integration tests, and container cold starts.

### 4.4. Artificial Intelligence & Machine Learning
- **Google GenAI SDK**: Implemented via `@google/genai` (`^2.4.0`) using server-side lazy initialization (`server/gemini.ts`). The API key is strictly maintained server-side and never exposed to the client.
- **Gemini 2.5 Flash (`gemini-2.5-flash`)**:
  1. **Conversational Concierge (`askTravelAssistant`)**: Answers queries regarding attractions, best seasons, local customs, transit modes, and safety guidelines. Context is dynamically grounded using verified destination records and cultural specialty databases.
  2. **Itinerary Autopilot (`generateAutopilotReplan`)**: Ingests real-time environmental events (e.g., sudden torrential rain in Mumbai, crowd gridlock in Old Goa) and generates a structured JSON re-plan shifting outdoor sights to indoor museums or heritage centers.
  3. **What-If Scenario Simulation (`runWhatIfSimulation`)**: Evaluates policy or travel changes (e.g., "Shift travel dates to off-peak shoulder season") and calculates crowd reduction percentages and budget savings.
- **Sustainable Demand Balancer Engine (`demandBalancerService.ts`)**:
  - Multi-objective heuristic optimization algorithm designed for SIH sustainability goals.
  - Evaluates candidate destinations across five weighted criteria: Tourist Satisfaction (25%), Affordability (20%), Local Economic Retention (25%), Weather/Seasonal Suitability (15%), and Carrying Capacity / Crowd Avoidance (15%).
  - Effectively redirects overtourism from congested centers to lesser-known heritage gems.

### 4.5. Maps, Geospatial & Routing Layer
- **Map Viewer (`MapComponent.tsx`)**:
  - Embedded Leaflet map container managed via React refs.
  - Renders interactive marker clusters, route polylines, pickup/drop coordinates, and destination zoom envelopes.
- **OpenStreetMap (OSM)**:
  - Base map tiles fetched directly from OpenStreetMap servers (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
  - Provides completely open cartography without proprietary licensing restrictions or per-load billing.
- **Nominatim Geocoding**:
  - OpenStreetMap's geocoding engine utilized for resolving human-readable Indian landmarks and towns into precise WGS84 geographic coordinates.
- **OSRM (Open Source Routing Machine)**:
  - Open routing protocol utilized for computing point-to-point road itineraries, calculating realistic driving/transit durations, generating polyline coordinates, and powering The Explorer micro-mobility dispatch simulator.
- **Geographic POI Database**:
  - 200+ verified Indian Points of Interest spanning Maharashtra (Mumbai, Pune, Sindhudurg, Solapur, Nashik), Goa, Rajasthan (Jaipur), Kerala (Munnar), and Delhi NCR with category classification (Heritage, Nature, Food, Sightseeing).

### 4.6. Payments & Billing Layer
- **Razorpay Orders API**:
  - Fully implemented in `server/services/paymentService.ts` and `server/services/razorpayService.ts`.
  - Secure server-side calculation of travel package costs, applying itemized 18% GST (Goods and Services Tax) and coupon discounts (`WANDER20`, `EARLYBIRD`).
  - Creates authenticated orders with amount formatted in Indian Paise (e.g., ₹100 = 10,000 paise).
- **Cryptographic Payment Verification**:
  - Verifies payment completion by generating an HMAC-SHA256 hash of `order_id + "|" + payment_id` using the secret key and verifying against `razorpay_signature`.
  - Updates booking status from `pending_payment` to `confirmed` with an audit-ready transaction record.
- **Asymmetric Webhook Receiver (`/api/v1/payments/webhook`)**:
  - Validates `X-Razorpay-Signature` against `req.rawBody` using HMAC-SHA256.
  - Asynchronously processes critical events:
    - `payment.captured`: Confirms booking and issues transaction receipt.
    - `payment.failed`: Flags booking failure and prompts retry.
    - `refund.processed`: Adjusts booking status and updates wallet ledgers.
- **In-App Wallet System**:
  - Internal wallet ledger allowing users to maintain credit balances, receive booking cashback, apply discounts, and pay directly without external gateway roundtrips.

### 4.7. Transactional Communications (Resend)
- **Resend Email Service (`server/services/emailService.ts`)**:
  - Connected via REST endpoint `https://api.resend.com/emails` with `RESEND_API_KEY`.
- **Trigger Strictness**:
  - **Only triggered on confirmed, verified payments** (Razorpay payment capture, webhook event, or confirmed wallet transaction).
  - Never triggered during user signup or session creation.
- **Voucher & Invoice Contents**:
  - Traveler name, PNR / Booking ID, trip title, and destination.
  - Travel dates and passenger count.
  - Razorpay payment reference ID and payment method.
  - Itemized financial breakdown: Base fare, 18% GST, applied discount, and total paid.
  - Free cancellation deadline and support contact.
- **Sandbox Graceful Handling**:
  - Automatically redirects emails to verified developer accounts when testing in unverified Resend sandboxes.

---

## 5. Security & Data Protection Architecture

1. **Zero Secret Leakage**:
   - All critical secrets (`GEMINI_API_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`) reside exclusively in server-side memory (`process.env`).
   - No secret environment variables are prefixed with `VITE_` or sent to client bundles.
2. **Cryptographic Webhook Defense**:
   - Webhooks reject unauthenticated, forged, or tampered payloads using constant-time HMAC-SHA256 validation before parsing or processing.
3. **Decoupled Identity & Password Security**:
   - Application servers do not store user passwords, salt hashes, or security questions. All identity authentication is delegated to Supabase Auth's security infrastructure.
4. **JWT Bearer Token Guard**:
   - Express middleware validates incoming bearer tokens with Supabase Auth servers before allowing access to user-specific routes.
5. **Payload & Storage Quotas**:
   - Server body parsers cap JSON and URL-encoded payloads at 20MB.
   - Multer file uploads enforce 15MB file size limits and individual 20MB cumulative storage quotas.

---

## 6. Testing, Verification & Quality Assurance

ExploreX includes an automated integration test suite located at `server/scripts/runTests.ts`, executable via `npm run test:verify`.

### Test Coverage (44 / 44 Passing Tests):
- **Destination Query Isolation**: Proves that queries for Mumbai, Pune, Goa, and Solapur return zero POI leakage or accidental fallback to other regions.
- **Unknown Destination Resiliency**: Proves that unseeded destinations (e.g., Reykjavik) are handled gracefully without silent fallback corruption.
- **Server-Side Price Calculation**: Verifies conversion to paise, 18% GST calculation, and promo code deduction math.
- **Razorpay Payment Verification**: Verifies cryptographic signature verification and fallback safety net logic.
- **Supabase Authentication**: Tests user signup, login token issuance, rejection of incorrect passwords, rejection of non-existent emails, session token verification, password reset dispatch, and session logout.
- **Razorpay Webhook Verification**: Tests valid HMAC-SHA256 signature acceptance, tampered payload rejection, bogus signature rejection, empty payload rejection, and asynchronous `payment.captured` event processing.
- **Static Compilation & Linting**: `tsc --noEmit` runs with zero TypeScript compiler errors.

---

## 7. Environment Variables Reference

| Variable | Purpose | Status | Sensitivity |
| :--- | :--- | :--- | :--- |
| `PORT` | Local and container server port (standard 3000) | Required | Non-sensitive |
| `NODE_ENV` | Runtime mode (`development` or `production`) | Optional | Non-sensitive |
| `APP_URL` | Public origin URL for redirects and links | Optional | Non-sensitive |
| `ML_SERVICE_URL` | Microservice URL for Python ML engine (default `http://localhost:8000`) | Optional | Non-sensitive |
| `GEMINI_API_KEY` | Google Gemini API key for GenAI services | Required for AI | **Confidential Secret** |
| `SUPABASE_URL` | Supabase project API URL (`https://<project-id>.supabase.co`) | Required for Cloud DB | Public URL |
| `SUPABASE_ANON_KEY` | Supabase public anonymous API key (also accepts `SUPABASE_API_KEY`) | Required for Auth | Public Token |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase administrative key for elevated backend operations | Optional | **Confidential Secret** |
| `RAZORPAY_KEY_ID` | Razorpay public key ID for client checkout | Required for Payments | Public Credential |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key for HMAC signature verification | Required for Payments | **Confidential Secret** |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay secret key for HMAC webhook verification | Required for Webhooks | **Confidential Secret** |
| `RESEND_API_KEY` | Resend API key for transactional email delivery | Required for Email | **Confidential Secret** |
| `RESEND_FROM_EMAIL` | Sender email address for booking vouchers (e.g. `confirmations@explorex.com`) | Optional | Non-sensitive |

*(Note: In accordance with security best practices, actual API keys, private tokens, and credentials are never checked into version control or documentation files. They are supplied through secure container configuration or local `.env` files).*

---

## 8. Explicitly Excluded & Removed Technologies

To prevent architecture confusion during presentations, evaluations, or SIH jury reviews, the following legacy or third-party services are **not** part of ExploreX:

- **Google Maps JavaScript API**: Replaced entirely by **Leaflet + OpenStreetMap + Nominatim + OSRM**, providing open-source, quota-free cartography and routing without Google Cloud billing dependencies.
- **Twilio / MSG91**: Excluded. SMS notifications were phased out in favor of high-fidelity, itemized HTML booking vouchers delivered via **Resend**.
- **Amadeus / Sabre Global Distribution Systems**: Excluded. All transport, hotel, and curated package catalogs are powered by internal high-efficiency scheduling engines.
- **Stripe / PayPal**: Excluded. Payment processing is optimized for Indian and international transactions via **Razorpay** and the ExploreX in-app wallet.

---

## 9. Build, Run & Deployment Instructions

### Development Mode
```bash
# Install dependencies
npm install

# Run full-stack application (Express + Vite HMR on Port 3000)
npm run dev
```

### Automated Verification & Tests
```bash
# Run comprehensive 44-test verification suite
npm run test:verify

# Run static TypeScript compiler verification
npm run lint
```

### Production Build & Launch
```bash
# Build client bundle (Vite) and backend bundle (esbuild)
npm run build

# Start production server
npm run start
```

### Deployment Configuration
- **Container Target**: Google Cloud Run (Linux x86_64).
- **Port**: Bound strictly to `0.0.0.0:3000`.
- **Permissions**: Defined in `metadata.json` (`geolocation` frame permission for interactive map centering).
