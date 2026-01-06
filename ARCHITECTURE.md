# Architecture Technique - Dashboard CRM "Fondateur"

## 1. Vue d'Ensemble

### Description
Application web de suivi commercial (CRM) pour fondateur unique, permettant de piloter le pipeline de ventes avec deux axes : **Volume** et **Valeur** des deals.

L'application est construite comme une **Single Page Application (SPA)** qui ingère des données CSV côté client, avec une architecture préparée pour une migration future vers une base de données SQL.

### Objectifs Techniques
- ✅ Développement rapide des 3 phases (MVP → V1 → V2)
- ✅ Expérience utilisateur fluide et réactive
- ✅ Architecture scalable pour ajout de fonctionnalités complexes
- ✅ Migration facile vers un backend full-stack
- ✅ Maintenabilité et testabilité maximales

### Principes Architecturaux
1. **Separation of Concerns** : UI (components) / Logique métier (lib) / État (store)
2. **Type Safety First** : TypeScript strict mode pour éliminer les bugs
3. **Component Composition** : Composants petits et réutilisables
4. **Business Logic Centralisée** : Calculs KPIs isolés et testables
5. **Progressive Enhancement** : MVP simple → Itérations progressives

---

## 2. Stack Technique

### Core Technologies

| Technologie | Version | Justification |
|------------|---------|---------------|
| **Next.js** | 15.x | Framework React avec routing intégré, optimisations automatiques, migration backend triviale |
| **React** | 19.x | Écosystème massif, standard de l'industrie pour dashboards business |
| **TypeScript** | 5.7+ | Type safety, réduction bugs, meilleure DX (autocomplete, refactoring) |
| **Ant Design** | 5.22+ | UI library spécialisée business/admin, composants prêts (Table, Upload, Statistic) |
| **Tailwind CSS** | 3.x | Complément à Ant Design pour customisations rapides et responsive design |
| **Recharts** | 2.15+ | Librairie de charts déclarative et React-friendly (Bar, Pie/Donut) |
| **Zustand** | 5.x | State management simple et performant, minimal boilerplate |
| **PapaParse** | 5.4+ | Standard de facto pour parsing CSV (robuste, streaming) |
| **date-fns** | 4.1+ | Manipulation de dates, tree-shakeable, fonctionnel |
| **React Hook Form** | 7.54+ | Gestion formulaires performante (peu de re-renders) |

### Testing & Quality

| Technologie | Usage |
|------------|-------|
| **Vitest** | Tests unitaires et composants (compatible Vite, rapide) |
| **@testing-library/react** | Tests composants React (user-centric) |
| **Playwright** | Tests end-to-end (workflows critiques) |
| **ESLint** | Linting code (Next.js config étendue) |
| **Prettier** | Formatting automatique |

### Deployment & Tooling

| Technologie | Usage |
|------------|-------|
| **Vercel** | Hébergement et CI/CD (auto-deploy sur git push) |
| **GitHub Actions** | (Optionnel) CI/CD custom si nécessaire |

---

## 3. Structure du Projet

```
crm-fondateur/
│
├── app/                                # Next.js App Router (routing file-based)
│   ├── layout.tsx                      # Layout global (header, navigation future)
│   ├── page.tsx                        # Page principale : Dashboard avec KPIs + Charts
│   ├── deals/
│   │   └── [id]/page.tsx               # Page drill-down deal individuel
│   ├── globals.css                     # Styles globaux + imports Tailwind/Ant
│   └── api/                            # (Future) API Routes Next.js pour backend
│
├── components/                         # Composants React
│   ├── dashboard/                      # Composants spécifiques dashboard
│   │   ├── KPICards.tsx                # Cartes KPIs (Volume, CA Brut, Panier Moyen, CA Pondéré)
│   │   ├── PipelineChart.tsx           # Bar/Donut chart répartition par statut
│   │   └── AlertsBadge.tsx             # Badge compteur Due Dates passées
│   │
│   ├── deals/                          # Composants gestion deals
│   │   ├── DealsTable.tsx              # Data Grid principal (tri, recherche, filtres)
│   │   ├── TopDealsWidget.tsx          # Top 5 deals par valeur pondérée
│   │   ├── DealDetail.tsx              # Modale/Panel détail deal (drill-down)
│   │   └── DealFilters.tsx             # Filtres avancés (Status, Priority, Tags)
│   │
│   └── shared/                         # Composants réutilisables
│       ├── CSVUploader.tsx             # Widget upload CSV avec validation
│       ├── SearchBar.tsx               # Barre de recherche globale
│       └── ExportButton.tsx            # Bouton export CSV enrichi
│
├── lib/                                # Logique métier (business logic)
│   ├── dataProcessing.ts               # Parsing CSV + transformations (split Task Name, typage)
│   ├── kpiCalculations.ts              # Calculs KPIs (pipeline brut/pondéré, panier moyen)
│   ├── types.ts                        # Types TypeScript (Deal, Status, KPIs, etc.)
│   ├── constants.ts                    # Configuration statique (probabilités, colonnes CSV)
│   ├── validation.ts                   # Validation données CSV
│   └── utils.ts                        # Utilitaires génériques
│
├── store/                              # Zustand stores
│   └── dealsStore.ts                   # État global : deals, filtres, recherche, KPIs
│
├── __tests__/                          # Tests
│   ├── unit/                           # Tests unitaires (lib/)
│   │   ├── dataProcessing.test.ts
│   │   ├── kpiCalculations.test.ts
│   │   └── validation.test.ts
│   ├── components/                     # Tests composants (Testing Library)
│   │   ├── KPICards.test.tsx
│   │   └── DealsTable.test.tsx
│   └── e2e/                            # Tests Playwright
│       ├── upload-workflow.spec.ts     # Upload CSV → Affichage KPIs
│       └── drill-down.spec.ts          # Navigation vers détail deal
│
├── public/                             # Assets statiques
│   ├── crm_prospects_demo.csv          # Fichier CSV de démo
│   └── favicon.ico
│
├── .env.local                          # Variables d'environnement (dev)
├── .env.example                        # Template variables d'env
├── tailwind.config.ts                  # Configuration Tailwind CSS
├── next.config.ts                      # Configuration Next.js
├── vitest.config.ts                    # Configuration Vitest
├── playwright.config.ts                # Configuration Playwright
├── tsconfig.json                       # Configuration TypeScript
├── .eslintrc.json                      # Configuration ESLint
├── .prettierrc                         # Configuration Prettier
├── package.json                        # Dépendances et scripts
└── README.md                           # Documentation utilisateur
```

---

## 4. Patterns et Conventions

### 4.1 Naming Conventions

**Fichiers :**
- Composants React : `PascalCase.tsx` (ex: `KPICards.tsx`)
- Utilitaires/Lib : `camelCase.ts` (ex: `kpiCalculations.ts`)
- Tests : `*.test.ts` ou `*.test.tsx` ou `*.spec.ts` (Playwright)

**Variables :**
- Variables/Fonctions : `camelCase`
- Constantes : `UPPER_SNAKE_CASE`
- Types/Interfaces : `PascalCase`
- Composants : `PascalCase`

**Exemple :**
```typescript
// lib/constants.ts
export const STATUS_PROBABILITIES = { ... }

// lib/types.ts
export interface Deal { ... }
export type Status = 'prospect' | 'qualifié' | ...

// components/KPICards.tsx
export function KPICards({ deals }: KPICardsProps) { ... }
```

### 4.2 Server vs Client Components (Next.js App Router)

**Server Components (par défaut) :**
- Layouts
- Pages statiques
- Composants qui ne nécessitent pas d'interactivité

**Client Components (`'use client'`) :**
- Composants avec hooks (`useState`, `useEffect`, etc.)
- Event handlers (`onClick`, `onChange`, etc.)
- Composants dépendant du browser (localStorage, window, etc.)

**Règle :** Maximiser les Server Components, ajouter `'use client'` uniquement quand nécessaire.

**Exemple :**
```typescript
// app/page.tsx (Server Component par défaut, mais ici besoin interactivité)
'use client'

import { CSVUploader } from '@/components/shared/CSVUploader'
import { KPICards } from '@/components/dashboard/KPICards'
import { useDealsStore } from '@/store/dealsStore'

export default function DashboardPage() {
  const deals = useDealsStore(state => state.deals)
  // ...
}
```

### 4.3 State Management : Zustand vs Props

**Utiliser Zustand pour :**
- État partagé entre plusieurs composants (deals, filtres, recherche)
- Données qui survivent aux re-renders (upload CSV → persist)
- KPIs calculés globalement

**Utiliser Props pour :**
- État local à un composant (formulaire, modale)
- Communication parent → enfant directe
- Composants réutilisables isolés

**Exemple Store Zustand :**
```typescript
// store/dealsStore.ts
import { create } from 'zustand'
import { Deal, KPIs } from '@/lib/types'

interface DealsState {
  deals: Deal[]
  filteredDeals: Deal[]
  searchQuery: string
  filters: { status?: string[], priority?: string[] }
  kpis: KPIs | null

  setDeals: (deals: Deal[]) => void
  setSearchQuery: (query: string) => void
  applyFilters: () => void
}

export const useDealsStore = create<DealsState>((set, get) => ({
  deals: [],
  filteredDeals: [],
  searchQuery: '',
  filters: {},
  kpis: null,

  setDeals: (deals) => set({ deals, filteredDeals: deals }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  applyFilters: () => {
    const { deals, filters, searchQuery } = get()
    // Logique de filtrage...
    set({ filteredDeals: filtered })
  }
}))
```

### 4.4 Error Handling

**Stratégie :**
1. **Validation données CSV** : Rejeter fichiers invalides avec message clair
2. **Calculs KPIs** : Gérer divisions par zéro, valeurs nulles
3. **UI** : Afficher messages d'erreur via `message` (Ant Design)
4. **Logging** : `console.error` en dev, service externe (Sentry) en prod (future)

**Exemple :**
```typescript
// lib/validation.ts
export function validateCSVData(data: any[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.length) {
    errors.push('Le fichier CSV est vide')
  }

  // Vérifier colonnes requises
  const requiredColumns = ['Task Name', 'Status', 'Montant Deal']
  // ...

  return { valid: errors.length === 0, errors }
}

// components/CSVUploader.tsx
const handleUpload = (file: File) => {
  Papa.parse(file, {
    complete: (result) => {
      const { valid, errors } = validateCSVData(result.data)
      if (!valid) {
        message.error(errors.join(', '))
        return
      }
      // Traiter données...
    }
  })
}
```

### 4.5 Types TypeScript : Interfaces vs Types

**Utiliser `interface` pour :**
- Objets avec structure fixe (Deal, KPIs)
- Props de composants React
- Extensibilité future (interface peut être étendue)

**Utiliser `type` pour :**
- Unions (`type Status = 'prospect' | 'qualifié' | ...`)
- Types utilitaires (`Pick`, `Omit`, etc.)
- Types complexes (intersections, mapped types)

**Exemple :**
```typescript
// lib/types.ts

// Interface pour objets
export interface Deal {
  id: string
  contactName: string
  companyName: string
  status: Status
  amount: number
  dueDate: Date | null
  priority: Priority
  tags: string[]
  notes: string
}

// Type pour unions
export type Status = 'prospect' | 'qualifié' | 'négociation' | 'gagné - en cours'
export type Priority = 'low' | 'medium' | 'high'

// Interface pour KPIs
export interface KPIs {
  totalDeals: number
  pipelineBrut: number
  pipelinePondere: number
  panierMoyen: number
  dealsEnRetard: number
}

// Props composants
export interface KPICardsProps {
  kpis: KPIs
  loading?: boolean
}
```

---

## 5. Data Flow

### 5.1 Flux Principal

```
┌─────────────────┐
│  User uploads   │
│   CSV file      │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  PapaParse.parse()      │
│  (lib/dataProcessing)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Validation             │
│  (lib/validation)       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Transformations        │
│  - Split "Task Name"    │
│  - Parse tags (A|B)     │
│  - Type conversions     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Zustand Store          │
│  setDeals(deals)        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  KPI Calculations       │
│  (lib/kpiCalculations)  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  UI Components          │
│  - KPICards             │
│  - PipelineChart        │
│  - DealsTable           │
└─────────────────────────┘
```

### 5.2 Calculs KPIs

**Pipeline Brut (€) :**
```typescript
const pipelineBrut = deals.reduce((sum, deal) => sum + deal.amount, 0)
```

**Pipeline Pondéré (€) :**
```typescript
import { STATUS_PROBABILITIES } from '@/lib/constants'

const pipelinePondere = deals.reduce((sum, deal) => {
  const probability = STATUS_PROBABILITIES[deal.status] || 0
  return sum + (deal.amount * probability)
}, 0)
```

**Panier Moyen (€) :**
```typescript
const panierMoyen = deals.length > 0
  ? pipelineBrut / deals.length
  : 0
```

**Deals en Retard :**
```typescript
const now = new Date()
const dealsEnRetard = deals.filter(deal =>
  deal.dueDate && deal.dueDate < now
).length
```

### 5.3 Filtrage et Recherche

**Recherche textuelle :**
```typescript
const filtered = deals.filter(deal =>
  deal.contactName.toLowerCase().includes(query.toLowerCase()) ||
  deal.companyName.toLowerCase().includes(query.toLowerCase()) ||
  deal.notes.toLowerCase().includes(query.toLowerCase())
)
```

**Filtres multiples (Status, Priority, Tags) :**
```typescript
let filtered = deals

if (filters.status?.length) {
  filtered = filtered.filter(d => filters.status.includes(d.status))
}

if (filters.priority?.length) {
  filtered = filtered.filter(d => filters.priority.includes(d.priority))
}

if (filters.tags?.length) {
  filtered = filtered.filter(d =>
    d.tags.some(tag => filters.tags.includes(tag))
  )
}
```

### 5.4 Export CSV Enrichi

```typescript
// Ajout colonnes calculées
const enrichedDeals = deals.map(deal => ({
  ...deal,
  'Probabilité': STATUS_PROBABILITIES[deal.status],
  'Valeur Pondérée': deal.amount * STATUS_PROBABILITIES[deal.status],
  'En Retard': deal.dueDate && deal.dueDate < new Date() ? 'Oui' : 'Non'
}))

// Export avec PapaParse
const csv = Papa.unparse(enrichedDeals)
const blob = new Blob([csv], { type: 'text/csv' })
// Téléchargement...
```

---

## 6. Configuration des Probabilités

### 6.1 Constantes Métier

```typescript
// lib/constants.ts

/**
 * Probabilités de conversion par statut de deal
 * Utilisées pour calculer le pipeline pondéré (weighted pipeline)
 */
export const STATUS_PROBABILITIES = {
  'prospect': 0.10,        // 10% de chance de conversion
  'qualifié': 0.40,        // 40%
  'négociation': 0.75,     // 75%
  'gagné - en cours': 1.00 // 100% (deal gagné)
} as const

/**
 * Mapping colonnes CSV → Types TypeScript
 */
export const CSV_COLUMN_MAPPING = {
  'Task Name': 'taskName',
  'Status': 'status',
  'Date Created': 'dateCreated',
  'Due Date': 'dueDate',
  'Start Date': 'startDate',
  'Assignees': 'assignees',
  'Priority': 'priority',
  'Tags': 'tags',
  'Task Content': 'notes',
  'Montant Deal': 'amount'
} as const

/**
 * Valeurs autorisées pour Status
 */
export const VALID_STATUSES = ['prospect', 'qualifié', 'négociation', 'gagné - en cours'] as const

/**
 * Valeurs autorisées pour Priority
 */
export const VALID_PRIORITIES = ['low', 'medium', 'high'] as const
```

### 6.2 Configuration Next.js

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Pour démarrage SPA pur (export statique)
  // output: 'export', // Décommenter si hébergement statique (non Vercel)

  // Optimisations
  reactStrictMode: true,

  // Support CSV
  webpack: (config) => {
    config.module.rules.push({
      test: /\.csv$/,
      use: 'raw-loader'
    })
    return config
  }
}

export default nextConfig
```

---

## 7. Testing Strategy

### 7.1 Pyramide de Tests

```
        ┌──────────┐
        │   E2E    │  ← 10% (Playwright : workflows critiques)
        ├──────────┤
        │Component │  ← 30% (Testing Library : composants clés)
        ├──────────┤
        │   Unit   │  ← 60% (Vitest : logique métier)
        └──────────┘
```

### 7.2 Unit Tests (Vitest)

**Cible :** Logique métier dans `lib/`

**Coverage target :** 80%+ sur `lib/`

**Exemple :**
```typescript
// __tests__/unit/kpiCalculations.test.ts
import { describe, it, expect } from 'vitest'
import { calculateKPIs } from '@/lib/kpiCalculations'
import { Deal } from '@/lib/types'

describe('calculateKPIs', () => {
  it('calcule le pipeline brut correctement', () => {
    const deals: Deal[] = [
      { amount: 1000, status: 'prospect', ... },
      { amount: 2000, status: 'qualifié', ... }
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.pipelineBrut).toBe(3000)
  })

  it('calcule le pipeline pondéré avec probabilités', () => {
    const deals: Deal[] = [
      { amount: 1000, status: 'prospect', ... },     // 1000 * 0.10 = 100
      { amount: 2000, status: 'négociation', ... }   // 2000 * 0.75 = 1500
    ]

    const kpis = calculateKPIs(deals)
    expect(kpis.pipelinePondere).toBe(1600)
  })

  it('gère le cas de deals vides (division par zéro)', () => {
    const kpis = calculateKPIs([])
    expect(kpis.panierMoyen).toBe(0)
    expect(kpis.totalDeals).toBe(0)
  })
})
```

### 7.3 Component Tests (Testing Library)

**Cible :** Composants UI critiques

**Coverage target :** 60%+ sur `components/`

**Exemple :**
```typescript
// __tests__/components/KPICards.test.tsx
import { render, screen } from '@testing-library/react'
import { KPICards } from '@/components/dashboard/KPICards'

describe('KPICards', () => {
  it('affiche les KPIs formatés correctement', () => {
    const kpis = {
      totalDeals: 42,
      pipelineBrut: 125000,
      pipelinePondere: 85000,
      panierMoyen: 2976.19,
      dealsEnRetard: 5
    }

    render(<KPICards kpis={kpis} />)

    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText(/125\s?000\s?€/)).toBeInTheDocument()
    expect(screen.getByText(/85\s?000\s?€/)).toBeInTheDocument()
  })
})
```

### 7.4 E2E Tests (Playwright)

**Cible :** Workflows utilisateur critiques

**Exemple :**
```typescript
// __tests__/e2e/upload-workflow.spec.ts
import { test, expect } from '@playwright/test'

test('upload CSV et affichage KPIs', async ({ page }) => {
  await page.goto('/')

  // Upload fichier
  const fileInput = page.locator('input[type="file"]')
  await fileInput.setInputFiles('public/crm_prospects_demo.csv')

  // Vérifier KPIs affichés
  await expect(page.locator('text=/Volume du Pipeline/')).toBeVisible()
  await expect(page.locator('text=/CA Total Pipeline Brut/')).toBeVisible()

  // Vérifier graphique
  await expect(page.locator('canvas, svg')).toBeVisible()

  // Vérifier tableau
  await expect(page.locator('table')).toBeVisible()
})

test('drill-down sur un deal', async ({ page }) => {
  await page.goto('/')

  // Upload + navigation
  // ...

  // Clic sur un deal
  await page.locator('table tbody tr').first().click()

  // Vérifier modale détail
  await expect(page.locator('text=/Détail du Deal/')).toBeVisible()
  await expect(page.locator('text=/Notes/')).toBeVisible()
})
```

### 7.5 Commandes de Test

```bash
# Unit tests (watch mode)
npm run test

# Coverage report
npm run test -- --coverage

# E2E tests
npm run test:e2e

# E2E avec UI (debug)
npm run test:e2e -- --ui
```

---

## 8. Deployment & CI/CD

### 8.1 Vercel Deployment

**Configuration automatique :**
1. Connecter repository GitHub à Vercel
2. Auto-détection Next.js
3. Build command : `next build`
4. Output directory : `.next`
5. Install command : `npm install`

**Environnements :**
- **Production :** Branche `main` → `https://crm-fondateur.vercel.app`
- **Preview :** Chaque PR → URL unique (ex: `https://crm-fondateur-git-feature-xyz.vercel.app`)
- **Development :** Local avec `npm run dev`

### 8.2 Variables d'Environnement

**Fichier `.env.local` (développement) :**
```bash
# Pas de variables critiques pour MVP (tout client-side)
# Exemple pour futur :
# DATABASE_URL="postgresql://..."
# NEXTAUTH_SECRET="..."
```

**Fichier `.env.example` (template) :**
```bash
# Configuration future
# DATABASE_URL=
# NEXTAUTH_SECRET=
# NEXTAUTH_URL=
```

### 8.3 Build & Deploy Process

```
┌──────────────┐
│  git push    │
│  to main     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│  Vercel CI           │
│  1. Install deps     │
│  2. Run lint         │
│  3. Run build        │
│  4. Run tests (opt)  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│  Deploy to Edge      │
│  - Global CDN        │
│  - Zero config       │
└──────────────────────┘
```

### 8.4 Performance Monitoring

**Vercel Analytics (gratuit) :**
- Core Web Vitals (LCP, FID, CLS)
- Page load times
- User interactions

**Future :** Intégrer Sentry pour error tracking

---

## 9. Migration Path (Backend Future)

### 9.1 Transition vers Full-Stack

**Quand migrer ?**
- Besoin de collaboration multi-utilisateur
- Volume de données trop important pour CSV
- Besoin d'authentification
- Synchronisation temps réel

### 9.2 Stack Backend Recommandé

```typescript
// Ajout à stack existant
+ Prisma ORM           // Type-safe database access
+ PostgreSQL           // Base de données relationnelle
+ NextAuth.js          // Authentification
+ tRPC (optionnel)     // Type-safe API calls
```

### 9.3 Étapes de Migration

**1. Ajout Base de Données (PostgreSQL + Prisma)**

```bash
npm install prisma @prisma/client
npx prisma init
```

**Schéma Prisma :**
```prisma
// prisma/schema.prisma
model Deal {
  id            String   @id @default(cuid())
  contactName   String
  companyName   String
  status        Status
  amount        Float
  dueDate       DateTime?
  priority      Priority
  tags          String[]
  notes         String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  userId        String   // Pour multi-user
  user          User     @relation(fields: [userId], references: [id])
}

enum Status {
  PROSPECT
  QUALIFIE
  NEGOCIATION
  GAGNE_EN_COURS
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id       String @id @default(cuid())
  email    String @unique
  name     String
  deals    Deal[]
}
```

**2. Création API Routes Next.js**

```typescript
// app/api/deals/route.ts
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const deals = await prisma.deal.findMany({
    where: { userId: 'current-user-id' } // Récupérer depuis session
  })

  return Response.json(deals)
}

export async function POST(request: NextRequest) {
  const body = await request.json()

  const deal = await prisma.deal.create({
    data: {
      ...body,
      userId: 'current-user-id'
    }
  })

  return Response.json(deal, { status: 201 })
}
```

**3. Mise à jour Zustand Store**

```typescript
// store/dealsStore.ts (migration)

// AVANT (CSV client-side)
const setDeals = (deals: Deal[]) => set({ deals })

// APRÈS (API calls)
const fetchDeals = async () => {
  const response = await fetch('/api/deals')
  const deals = await response.json()
  set({ deals })
}

const createDeal = async (deal: NewDeal) => {
  const response = await fetch('/api/deals', {
    method: 'POST',
    body: JSON.stringify(deal)
  })
  const newDeal = await response.json()
  set(state => ({ deals: [...state.deals, newDeal] }))
}
```

**4. Ajout Authentification (NextAuth.js)**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ]
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

### 9.4 Aucun Refactoring UI Nécessaire

**Avantage clé :** Les composants React restent identiques !

```typescript
// components/dashboard/KPICards.tsx
// Code INCHANGÉ - fonctionne avec CSV ou API
export function KPICards() {
  const deals = useDealsStore(state => state.deals)
  const kpis = calculateKPIs(deals)

  return <div>...</div>
}
```

**Seul changement :** Source de données dans le store (CSV parsing → API calls)

---

## 10. Performance Considerations

### 10.1 Optimisations Next.js (Automatiques)

- ✅ **Code Splitting** : Chaque route charge uniquement son code
- ✅ **Tree Shaking** : Élimination code non utilisé
- ✅ **Image Optimization** : `next/image` pour images optimisées
- ✅ **Bundle Analysis** : `npx @next/bundle-analyzer`

### 10.2 Optimisations React

**Memoization pour calculs lourds :**
```typescript
// components/dashboard/KPICards.tsx
import { useMemo } from 'react'

export function KPICards({ deals }: Props) {
  // Recalculer uniquement si deals change
  const kpis = useMemo(() => calculateKPIs(deals), [deals])

  return <Statistic value={kpis.pipelineBrut} />
}
```

**React.memo pour composants purs :**
```typescript
// components/deals/DealRow.tsx
import { memo } from 'react'

export const DealRow = memo(({ deal }: Props) => {
  return <tr>...</tr>
})
```

### 10.3 Virtualization (Si >1000 Deals)

**Installer react-window :**
```bash
npm install react-window
```

**Utiliser FixedSizeList :**
```typescript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={deals.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <DealRow deal={deals[index]} />
    </div>
  )}
</FixedSizeList>
```

### 10.4 Lazy Loading

**Charger composants lourds à la demande :**
```typescript
// app/page.tsx
import dynamic from 'next/dynamic'

const PipelineChart = dynamic(() => import('@/components/dashboard/PipelineChart'), {
  loading: () => <Spin />,
  ssr: false // Si nécessite window/document
})
```

### 10.5 Performance Budget

| Métrique | Target | Critique |
|----------|--------|----------|
| **First Contentful Paint (FCP)** | < 1.8s | < 3s |
| **Largest Contentful Paint (LCP)** | < 2.5s | < 4s |
| **Time to Interactive (TTI)** | < 3.8s | < 7.3s |
| **Bundle Size (JS)** | < 200KB | < 400KB |

**Monitoring :** Vercel Analytics + Lighthouse CI

---

## 11. Scripts NPM

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md}\"",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true next build"
  }
}
```

### Workflow de Développement

```bash
# Démarrer environnement dev
npm run dev

# Pendant développement
npm run test:watch        # Tests unitaires en continu
npm run lint              # Vérifier code quality

# Avant commit
npm run format            # Formatter code
npm run type-check        # Vérifier types
npm run test              # Lancer tous tests unitaires
npm run lint              # Linter

# Avant push
npm run build             # Vérifier build production
npm run test:e2e          # Tests end-to-end

# Analyse bundle
npm run analyze           # Identifier gros modules
```

---

## 12. Références

### Documentation Officielle
- [Next.js 15](https://nextjs.org/docs)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Ant Design](https://ant.design/components/overview)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Recharts](https://recharts.org/en-US/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [PapaParse](https://www.papaparse.com/docs)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Ressources Utiles
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)
- [Ant Design Pro](https://pro.ant.design/) (Templates dashboard)
- [TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Version :** 1.0
**Dernière mise à jour :** 2026-01-06
**Auteur :** Architecture définie pour Dashboard CRM "Fondateur"
