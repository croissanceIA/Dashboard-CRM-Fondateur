# Change: Implémenter le Dashboard CRM MVP (Phase 1)

## Why

Créer la première version fonctionnelle du Dashboard CRM pour permettre au fondateur de visualiser rapidement l'état de son pipeline commercial. Cette phase MVP, appelée "La Météo du Business", offre une vue macro immédiate sans tableau de données détaillé, permettant une prise de décision rapide basée sur les KPIs essentiels.

## What Changes

- **CSV Upload**: Widget d'upload de fichier CSV avec parsing et validation des données
- **Data Processing**: Nettoyage et transformation des données (parsing identité, typage, parsing tags)
- **KPI Calculations**: Calcul des 3 KPIs macro fondamentaux:
  - Volume du Pipeline (nombre de deals actifs)
  - CA Total Pipeline Brut (somme des montants sans pondération)
  - Panier Moyen (indicateur de valeur moyenne par deal)
- **Pipeline Visualization**: Graphique simple (Bar Chart ou Donut) montrant la répartition des deals par étape (Status)
- **State Management**: Store Zustand pour gérer l'état global des deals et KPIs
- **Type System**: Définition des types TypeScript pour Deal, Status, Priority, KPIs

## Impact

### Affected Specs
- **NEW**: `csv-upload` - Gestion de l'upload et du parsing CSV
- **NEW**: `kpi-display` - Affichage des KPIs macro
- **NEW**: `pipeline-visualization` - Graphique de répartition par statut

### Affected Code
- `app/page.tsx` - Page principale du dashboard (NEW)
- `app/layout.tsx` - Layout global de l'application (NEW)
- `components/shared/CSVUploader.tsx` - Composant d'upload CSV (NEW)
- `components/dashboard/KPICards.tsx` - Cartes d'affichage KPIs (NEW)
- `components/dashboard/PipelineChart.tsx` - Graphique de répartition (NEW)
- `lib/dataProcessing.ts` - Logique de parsing et transformation CSV (NEW)
- `lib/kpiCalculations.ts` - Calculs des KPIs (NEW)
- `lib/types.ts` - Types TypeScript (NEW)
- `lib/constants.ts` - Configuration des probabilités et constantes (NEW)
- `lib/validation.ts` - Validation des données CSV (NEW)
- `store/dealsStore.ts` - Store Zustand pour l'état global (NEW)

### Dependencies Added
- `papaparse` - Parsing CSV
- `@types/papaparse` - Types pour PapaParse
- `antd` - Bibliothèque UI (Upload, Statistic, Card, message)
- `recharts` - Graphiques (BarChart, PieChart)
- `zustand` - State management
- `date-fns` - Manipulation de dates
- `tailwindcss` - Styling

### Breaking Changes
Aucun changement cassant, c'est la première version.

## Migration Notes

Non applicable pour le MVP initial.

## Testing Strategy

- **Unit Tests** (Vitest):
  - `lib/dataProcessing.test.ts` - Parsing CSV, split Task Name, typage
  - `lib/kpiCalculations.test.ts` - Calculs KPIs, gestion division par zéro
  - `lib/validation.test.ts` - Validation données CSV

- **Component Tests** (@testing-library/react):
  - `components/shared/CSVUploader.test.tsx` - Upload et validation
  - `components/dashboard/KPICards.test.tsx` - Affichage formaté KPIs
  - `components/dashboard/PipelineChart.test.tsx` - Rendu graphique

- **E2E Tests** (Playwright):
  - `upload-workflow.spec.ts` - Upload CSV → Affichage KPIs → Graphique visible

### Coverage Targets
- `lib/`: 80%+
- `components/`: 60%+
