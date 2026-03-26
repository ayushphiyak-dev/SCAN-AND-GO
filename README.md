# ScanGo — Retail OS

A fully interactive **scan-and-go** retail prototype built with React (single-file JSX).  
Shoppers scan items on their phone, pay in-app, and walk out with a QR exit pass — no cashier queue needed.

---

## Screens & Features

| Role | Screens / Features |
|------|--------------------|
| 🛒 **Shopper** | Home (trust score, store stats) → Scan (category filter, animated scanner) → Cart (qty controls, GST breakdown) → Pay (UPI / card / wallet) → QR Exit Pass (animated timer) |
| 🛡️ **Guard** | Scan QR → Instant result: Cleared / Age Check / Spot Check / Fraud Alert, with Approve / Detain actions |
| 📊 **Dashboard** | Live KPI cards, trust-score distribution bar chart, real-time transaction feed, security rule summary |

---

## Design System

- **Colors:** Blue `#2563EB` · Violet `#7C3AED` · Semantic green / amber / red
- **Fonts:** Inter + Plus Jakarta Sans (Google Fonts)
- **Accessibility:** ARIA roles, `aria-label`, `aria-live`, focus-visible rings throughout
- **Animations:** `fadeUp`, `popIn`, `slideIn`, `ringPulse`, `skelShimmer`

---

## Getting Started

This project is a **single JSX file** — no bundler is required for reading, but you can use Vite to run it locally:

```bash
# 1. Create a Vite + React project
npm create vite@latest my-scan-and-go -- --template react
cd my-scan-and-go

# 2. Replace src/App.jsx with scan-and-go.jsx (or import it in main.jsx)
cp /path/to/scan-and-go.jsx src/App.jsx

# 3. Install & run
npm install
npm run dev
```

Or embed it directly into any React application as the root `<App/>` component.

---

## Running Tests / Build Verification

```bash
npm run build   # production build (Vite)
```

---

## Project Structure

```
scan-and-go.jsx   ← entire app: data, design tokens, components, screens
README.md
```

---

## Key User Flows

```
Shopper
  Home → [Start Scanning] → Scan screen
  Scan screen → tap products → [Cart (N) →] → Cart
  Cart → [Proceed to Pay ₹X] → Payment → UPI/Card/Wallet → QR Exit Pass
  QR Exit Pass → show at gate → [Simulate Guard Scan] → token expires

Guard
  Ready → [Simulate scenario] → Scanning… → Result card → [Approve / Detain] → Ready

Dashboard
  Live KPIs (auto-update every 3.5 s when LIVE) · Trust distribution · Transaction feed
```