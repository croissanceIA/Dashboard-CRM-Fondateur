# Project Context

## Purpose

**Dashboard CRM "Fondateur"** - A Single Page Application (SPA) for commercial tracking designed for a solo founder.

### Goals
- Maximize two key axes: **Volume** (number of deals) and **Value** (deal amounts)
- Provide immediate business insights ("La Météo du Business")
- Enable operational pipeline management and fine-grained analysis
- Support CSV-based data input (no database initially)
- Prepare architecture for future SQL migration

### Key Features by Phase

**MVP (Phase 1):**
- CSV file upload
- Macro KPIs display (Pipeline Volume, Total Revenue, Average Deal Size)
- Simple visualization: deals distribution by status

**V1 (Phase 2):**
- Weighted pipeline with probability calculations
- Top 5 deals by weighted value
- Complete data grid with sorting and search
- Due date alerts
- Deal drill-down view

**V2 (Phase 3):**
- Advanced filters (Status, Priority, Tags)
- CSV export with enriched data
- KPI trend indicators

## Tech Stack

### Core Technologies
- **Next.js** 15.x - React framework with routing, optimizations, easy backend migration
- **React** 19.x - UI library
- **TypeScript** 5.7+ - Strict mode for type safety
- **Ant Design** 5.22+ - Business UI components (Table, Upload, Statistic)
- **Tailwind CSS** 3.x - Custom styling and responsive design
- **Recharts** 2.15+ - Declarative charts (Bar, Donut)
- **Zustand** 5.x - Simple state management
- **PapaParse** 5.4+ - CSV parsing
- **date-fns** 4.1+ - Date manipulation
- **React Hook Form** 7.54+ - Form management

### Testing & Quality
- **Vitest** - Unit and component tests
- **@testing-library/react** - React component testing
- **Playwright** - End-to-end tests
- **ESLint** - Code linting (Next.js config)
- **Prettier** - Code formatting

### Deployment
- **Vercel** - Hosting and CI/CD
- Auto-deploy on git push to main
- Preview deployments for PRs

## Project Conventions

### Code Style

**Naming Conventions:**
- **Files:**
  - React components: `PascalCase.tsx` (e.g., `KPICards.tsx`)
  - Utilities/Lib: `camelCase.ts` (e.g., `kpiCalculations.ts`)
  - Tests: `*.test.ts`, `*.test.tsx`, `*.spec.ts`

- **Variables & Functions:**
  - Variables/Functions: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Types/Interfaces: `PascalCase`
  - Components: `PascalCase`

**TypeScript Conventions:**
- Use `interface` for objects with fixed structure, component props, extensible types
- Use `type` for unions (`type Status = 'prospect' | 'qualifié' | ...`), utility types, complex types
- Strict mode enabled
- No implicit any

**Example:**
```typescript
// lib/constants.ts
export const STATUS_PROBABILITIES = { ... }

// lib/types.ts
export interface Deal { ... }
export type Status = 'prospect' | 'qualifié' | 'négociation' | 'gagné - en cours'

// components/KPICards.tsx
export function KPICards({ deals }: KPICardsProps) { ... }
```

### Architecture Patterns

**Core Principles:**
1. **Separation of Concerns**: UI (components) / Business logic (lib) / State (store)
2. **Type Safety First**: TypeScript strict mode to eliminate bugs
3. **Component Composition**: Small, reusable components
4. **Business Logic Centralized**: KPI calculations isolated and testable
5. **Progressive Enhancement**: MVP simple → Progressive iterations

**Server vs Client Components (Next.js App Router):**
- Server Components by default for layouts, static pages
- Client Components (`'use client'`) for hooks, event handlers, browser APIs
- **Rule:** Maximize Server Components, add `'use client'` only when necessary

**State Management:**
- **Zustand for:** Shared state (deals, filters, search), persisted data, global KPIs
- **Props for:** Local component state, parent → child communication, isolated reusable components

**Error Handling Strategy:**
1. CSV validation: Reject invalid files with clear messages
2. KPI calculations: Handle division by zero, null values
3. UI: Display errors via `message` (Ant Design)
4. Logging: `console.error` in dev, external service (Sentry) in prod (future)

**Project Structure:**
```
crm-fondateur/
├── app/                    # Next.js App Router (file-based routing)
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific (KPICards, PipelineChart, AlertsBadge)
│   ├── deals/              # Deal management (DealsTable, TopDealsWidget, DealDetail, DealFilters)
│   └── shared/             # Reusable (CSVUploader, SearchBar, ExportButton)
├── lib/                    # Business logic
│   ├── dataProcessing.ts   # CSV parsing + transformations
│   ├── kpiCalculations.ts  # KPI calculations
│   ├── types.ts            # TypeScript types
│   ├── constants.ts        # Static configuration (probabilities, CSV columns)
│   ├── validation.ts       # CSV data validation
│   └── utils.ts            # Generic utilities
├── store/                  # Zustand stores
│   └── dealsStore.ts       # Global state: deals, filters, search, KPIs
└── __tests__/              # Tests (unit, components, e2e)
```

### Testing Strategy

**Test Pyramid:**
- **60% Unit Tests** (Vitest): Business logic in `lib/`
- **30% Component Tests** (@testing-library/react): Critical UI components
- **10% E2E Tests** (Playwright): Critical user workflows

**Coverage Targets:**
- `lib/`: 80%+ coverage
- `components/`: 60%+ coverage

**Test Commands:**
```bash
npm run test              # Unit tests (watch mode)
npm run test:coverage     # Coverage report
npm run test:e2e          # E2E tests
npm run test:e2e:ui       # E2E with UI (debug)
```

**Key Test Areas:**
- KPI calculations (pipeline brut/pondéré, panier moyen, division by zero)
- CSV parsing and data transformations
- Filtering and search logic
- Critical workflows (CSV upload → KPI display, deal drill-down)

### Git Workflow

**Branching Strategy:**
- `main` - Production branch (auto-deploys to Vercel)
- Feature branches: `feature/description`
- Pull Requests with preview deployments

**Commit Workflow:**
```bash
# Before commit
npm run format            # Format code
npm run type-check        # Check TypeScript types
npm run test              # Run unit tests
npm run lint              # Lint code

# Before push
npm run build             # Verify production build
npm run test:e2e          # Run E2E tests
```

**CI/CD Process:**
1. git push to main
2. Vercel CI: Install deps → Lint → Build → Tests (optional)
3. Deploy to Edge (global CDN)

## Domain Context

### Business Model
This is a **CRM (Customer Relationship Management)** tool specifically designed for solo founders managing their sales pipeline. The focus is on:

- **Pipeline Management**: Tracking deals through stages (prospect → qualifié → négociation → gagné)
- **Revenue Forecasting**: Using probability-weighted calculations
- **Deal Prioritization**: Identifying high-value opportunities

### Deal Lifecycle
Deals progress through 4 statuses with corresponding conversion probabilities:
- `prospect`: 10% probability
- `qualifié`: 40% probability
- `négociation`: 75% probability
- `gagné - en cours`: 100% probability (won deal)

### Key Business Rules

**Data Input Format (CSV):**
- `Task Name`: "Contact Name - Company Name" (parsed into separate fields)
- `Status`: prospect | qualifié | négociation | gagné - en cours
- `Montant Deal`: Numeric deal amount
- `Due Date`: Date for follow-up
- `Priority`: low | medium | high
- `Tags`: Pipe-separated values (e.g., "SaaS|B2B")
- `Task Content`: Notes

**KPI Calculations:**
- **Pipeline Brut (€)**: Sum of all deal amounts
- **Pipeline Pondéré / Weighted Pipeline (€)**: Sum of (deal amount × status probability)
- **Panier Moyen / Average Deal Size (€)**: Pipeline Brut / Number of deals
- **Deals en Retard**: Count of deals where Due Date < today

**Probability Configuration:**
```typescript
export const STATUS_PROBABILITIES = {
  'prospect': 0.10,
  'qualifié': 0.40,
  'négociation': 0.75,
  'gagné - en cours': 1.00
} as const
```

## Important Constraints

### Technical Constraints
- **No database initially**: All data processing happens client-side from CSV
- **Architecture must support future SQL migration**: Code structured for easy backend transition
- **Client-side only for MVP**: No authentication, single-user experience
- **Browser compatibility**: Modern browsers only (no IE11)
- **CSV file size**: Optimized for up to ~1000 deals (virtualization if more)

### Business Constraints
- **Solo founder use case**: No multi-user collaboration needed initially
- **French language**: UI labels in French, business terms in French
- **No lost deals tracking**: Focus on active pipeline only (no "perdu" status)

### Performance Budget
| Metric | Target | Critical |
|--------|--------|----------|
| First Contentful Paint (FCP) | < 1.8s | < 3s |
| Largest Contentful Paint (LCP) | < 2.5s | < 4s |
| Time to Interactive (TTI) | < 3.8s | < 7.3s |
| Bundle Size (JS) | < 200KB | < 400KB |

### Design Constraints
- Use **Ant Design** components as primary UI library
- Apply **Tailwind CSS** for custom styling only
- Maintain consistency with business/admin dashboard aesthetics
- Responsive design for desktop and tablet (mobile optional for MVP)

## External Dependencies

### Data Source
- **CSV files**: Manual upload by user (no external API)
- Demo file: `public/crm_prospects_demo.csv`

### Future Backend (Migration Path)
When transitioning to full-stack:
- **Prisma ORM**: Type-safe database access
- **PostgreSQL**: Relational database
- **NextAuth.js**: Authentication (Google OAuth)
- **tRPC** (optional): Type-safe API calls

### Hosting & Infrastructure
- **Vercel**: Edge hosting, auto-scaling, global CDN
- **Vercel Analytics**: Core Web Vitals monitoring

### No External APIs for MVP
Current version is entirely self-contained with no external service dependencies.

## Migration Strategy

### When to Migrate to Full-Stack
- Multi-user collaboration needed
- Data volume too large for CSV
- Authentication required
- Real-time synchronization needed

### Migration Impact
- **Components**: No changes required (same React components work with API data)
- **Store**: Update data fetching (CSV parsing → API calls)
- **Backend**: Add API routes, Prisma schema, NextAuth
- **Deployment**: Same Vercel deployment (Next.js supports both)

**Key Advantage**: UI layer is completely decoupled from data source, making migration seamless.
