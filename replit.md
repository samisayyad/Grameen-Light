# Grameen-Light

AI-Powered Smart Village Streetlight Monitoring and Energy Audit System — a mobile app for villagers to report faulty streetlights and for Panchayat admins to monitor, assign, and resolve issues efficiently.

## Run & Operate

- Mobile app: runs via `artifacts/mobile: expo` workflow (Expo Go)
- API Server: runs via `artifacts/api-server: API Server` workflow (port 8080)
- `pnpm --filter @workspace/api-server run dev` — run the API server

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Mobile: Expo (React Native) + Expo Router
- UI: Custom Gen Z dark theme (electric green #00E676 accent on deep navy #060B18)
- State: React Context (AuthContext) + AsyncStorage persistence
- Fonts: Inter (400/500/600/700)
- API: Express 5 (shared api-server artifact)

## Where things live

- `artifacts/mobile/` — Expo React Native app
  - `app/` — Expo Router file-based routes
  - `app/(tabs)/` — 5-tab bottom navigation (Home, Poles, Report, Activity, Profile)
  - `app/auth/` — Login & Register screens
  - `app/complaint/[id].tsx` — Complaint detail with timeline
  - `app/chat.tsx` — GrameenAI chatbot assistant
  - `app/analytics.tsx` — Energy analytics dashboard
  - `components/` — StatCard, ComplaintCard, PoleCard
  - `constants/colors.ts` — Design tokens (dark Gen Z theme)
  - `constants/mockData.ts` — Mock poles, complaints, analytics
  - `context/AuthContext.tsx` — Auth with role-based access
- `artifacts/api-server/` — Express backend

## Architecture decisions

- Dark-mode-first UI with electric green (#00E676) as primary action color — Gen Z aesthetic
- Role-based access: Villager (report), Admin (manage), Worker (tasks) — all persisted via AsyncStorage
- AsyncStorage used for local persistence in first build (Firebase integration can be added next)
- react-native-reanimated for entrance animations on cards and stat counters
- No UUID package (Expo Go incompatible) — using Date.now() + Math.random() for IDs

## Product

- Onboarding: 3-screen animated intro with AI-generated illustrations
- Authentication: Email/password login with 3 demo accounts (Villager/Admin/Worker)
- Dashboard: Role-aware stats (total poles, faulty, complaints, resolved), quick actions, village status
- Poles Map: Searchable/filterable grid of all poles with color-coded status indicators
- Quick Report: 3-step complaint wizard (select pole → issue type → details + photo)
- Activity: Complaint history with filter tabs and status badges
- Complaint Detail: Full timeline (Submitted → Assigned → In Progress → Fixed)
- AI Chat: GrameenAI assistant with smart responses about poles, complaints, energy, safety
- Energy Analytics: Energy waste/saved bar chart, monthly trend, AI predictive maintenance insight
- Profile: User stats, achievement badges, settings, logout

## User preferences

- Build with Expo (React Native) — not native Kotlin/Android Studio
- Gen Z UI with dynamic animations
- Dark mode first

## Gotchas

- react-native-maps must be pinned to 1.18.0 if added — not currently installed
- Do NOT add react-native-maps to plugins array in app.json
- Do NOT use UUID package — crashes on iOS/Android
- Colors are defined in constants/colors.ts with both light and dark keys (both use dark theme)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Demo login credentials: villager@demo.com / admin@demo.com / worker@demo.com (all password: demo123)
