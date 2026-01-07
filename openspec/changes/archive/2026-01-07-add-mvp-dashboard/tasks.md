# Implementation Tasks - MVP Dashboard

## 1. Project Setup
- [x] 1.1 Initialiser le projet Next.js 15 avec TypeScript
- [x] 1.2 Installer les dépendances core (React 19, TypeScript 5.7+)
- [x] 1.3 Configurer Ant Design 5.22+ et importer les styles globaux
- [x] 1.4 Configurer Tailwind CSS 3.x
- [x] 1.5 Installer et configurer les dépendances métier (PapaParse, Zustand, Recharts, date-fns)
- [x] 1.6 Configurer ESLint (Next.js config étendue)
- [x] 1.7 Configurer Prettier avec règles du projet
- [x] 1.8 Créer `.gitignore` approprié
- [x] 1.9 Copier le fichier `crm_prospects_demo.csv` dans `public/`

## 2. TypeScript Types & Constants
- [x] 2.1 Créer `lib/types.ts` avec les interfaces:
  - `Deal` (id, contactName, companyName, status, amount, dueDate, priority, tags, notes)
  - `Status` type union
  - `Priority` type union
  - `KPIs` (totalDeals, pipelineBrut, panierMoyen)
  - Props types pour composants
- [x] 2.2 Créer `lib/constants.ts` avec:
  - `STATUS_PROBABILITIES` (pour V1, mais défini maintenant)
  - `CSV_COLUMN_MAPPING`
  - `VALID_STATUSES`
  - `VALID_PRIORITIES`

## 3. Business Logic Layer
- [x] 3.1 Créer `lib/validation.ts`:
  - `validateCSVData(data: any[]): { valid: boolean; errors: string[] }`
  - Vérifier colonnes requises
  - Vérifier valeurs de Status
- [x] 3.2 Créer `lib/dataProcessing.ts`:
  - `parseTaskName(taskName: string): { contactName: string; companyName: string }`
  - `parseTags(tags: string): string[]`
  - `transformCSVRow(row: any): Deal`
  - `processCSVData(rawData: any[]): Deal[]`
- [x] 3.3 Créer `lib/kpiCalculations.ts`:
  - `calculateKPIs(deals: Deal[]): KPIs`
  - Gérer division par zéro pour panier moyen
- [x] 3.4 Créer `lib/utils.ts` pour utilitaires génériques (formatage nombres, dates)

## 4. State Management
- [x] 4.1 Créer `store/dealsStore.ts` avec Zustand:
  - État: `deals`, `loading`, `error`
  - Actions: `setDeals`, `setLoading`, `setError`, `resetStore`
  - Computed: selector pour KPIs (utilise `calculateKPIs`)

## 5. Shared Components
- [x] 5.1 Créer `components/shared/CSVUploader.tsx`:
  - Utiliser `Upload` d'Ant Design
  - Intégrer PapaParse pour parsing
  - Appeler validation puis transformation
  - Mettre à jour le store avec `setDeals`
  - Afficher messages de succès/erreur via `message` d'Ant Design
  - Accepter uniquement fichiers `.csv`
  - Afficher état de chargement pendant parsing

## 6. Dashboard Components
- [x] 6.1 Créer `components/dashboard/KPICards.tsx`:
  - Consommer `deals` depuis le store
  - Calculer KPIs via `calculateKPIs`
  - Afficher 3 `Statistic` cards d'Ant Design (Volume, CA Brut, Panier Moyen)
  - Formater montants en euros avec séparateur de milliers
  - Gérer état de chargement (skeleton)
- [x] 6.2 Créer `components/dashboard/PipelineChart.tsx`:
  - Consommer `deals` depuis le store
  - Agréger deals par statut
  - Afficher BarChart de Recharts
  - Utiliser palette de couleurs définie
  - Gérer empty state avec `Empty` d'Ant Design
  - Responsive design
  - Utiliser `useMemo` pour optimisation

## 7. Pages & Layout
- [x] 7.1 Créer `app/layout.tsx`:
  - Layout global avec metadata
  - Importer styles globaux (Ant Design, Tailwind)
  - Provider Ant Design ConfigProvider si nécessaire
- [x] 7.2 Créer `app/globals.css`:
  - Imports Tailwind (`@tailwind base/components/utilities`)
  - Imports Ant Design CSS
  - Variables CSS custom si nécessaire
- [x] 7.3 Créer `app/page.tsx`:
  - Marquer comme `'use client'`
  - Afficher `CSVUploader` en haut
  - Afficher `KPICards` en dessous
  - Afficher `PipelineChart` en dessous
  - Layout responsive avec Grid ou Flex (Tailwind)
  - Message d'instructions initial si pas de données

## 8. Configuration Files
- [x] 8.1 Configurer `next.config.ts`:
  - Activer `reactStrictMode: true`
  - Support CSV via webpack raw-loader
- [x] 8.2 Configurer `tsconfig.json`:
  - Strict mode enabled
  - Path aliases (`@/*` → `./`)
- [x] 8.3 Configurer `tailwind.config.ts`:
  - Paths vers `app/`, `components/`
  - Intégration avec Ant Design colors si souhaité
- [x] 8.4 Créer `.env.example` (même vide pour MVP)

## 9. Unit Tests
- [x] 9.1 Configurer Vitest (`vitest.config.ts`)
- [x] 9.2 Écrire `__tests__/unit/dataProcessing.test.ts`:
  - Test `parseTaskName` avec et sans séparateur
  - Test `parseTags` avec tags multiples et vides
  - Test `transformCSVRow` avec données complètes et partielles
- [x] 9.3 Écrire `__tests__/unit/kpiCalculations.test.ts`:
  - Test calcul pipeline brut
  - Test calcul panier moyen
  - Test gestion division par zéro
  - Test avec deals vides
- [x] 9.4 Écrire `__tests__/unit/validation.test.ts`:
  - Test validation colonnes requises
  - Test validation valeurs Status
  - Test fichier vide

## 10. Component Tests
- [x] 10.1 Configurer Testing Library
- [ ] 10.2 Écrire `__tests__/components/CSVUploader.test.tsx`:
  - Test rendu du composant Upload
  - Test affichage message d'erreur (mock validation échouée)
  - Test affichage message succès (mock validation réussie)
- [ ] 10.3 Écrire `__tests__/components/KPICards.test.tsx`:
  - Test affichage des 3 KPIs
  - Test formatage des montants en euros
  - Test empty state / loading state
- [ ] 10.4 Écrire `__tests__/components/PipelineChart.test.tsx`:
  - Test rendu du graphique avec données
  - Test empty state
  - Test agrégation par statut (via mocks)

## 11. E2E Tests
- [x] 11.1 Configurer Playwright (`playwright.config.ts`)
- [ ] 11.2 Écrire `__tests__/e2e/upload-workflow.spec.ts`:
  - Test workflow complet: upload CSV → vérifier KPIs affichés → vérifier graphique visible
  - Test rejection fichier invalide
  - Test affichage messages d'erreur

## 12. Quality Checks
- [x] 12.1 Lancer `npm run lint` et corriger toutes les erreurs
- [x] 12.2 Lancer `npm run format` pour formatter le code
- [x] 12.3 Lancer `npm run type-check` pour vérifier TypeScript
- [x] 12.4 Lancer `npm run test` et atteindre 80%+ coverage sur `lib/`
- [ ] 12.5 Lancer `npm run test:e2e` et vérifier passage des tests
- [x] 12.6 Lancer `npm run build` pour vérifier build production
- [x] 12.7 Tester manuellement le responsive design (desktop 1920px, tablette 768px)

## 13. Documentation & Deploy
- [x] 13.1 Créer/Mettre à jour `README.md` avec:
  - Description du projet
  - Instructions d'installation
  - Commandes npm disponibles
  - Structure du projet
- [x] 13.2 Vérifier que `crm_prospects_demo.csv` est bien dans `public/`
- [ ] 13.3 Connecter le repo GitHub à Vercel
- [ ] 13.4 Configurer auto-deploy sur push `main`
- [ ] 13.5 Vérifier le premier déploiement
- [ ] 13.6 Tester l'application en production

## Notes d'Implémentation

### Dépendances Critiques
Chaque tâche doit être complétée dans l'ordre pour minimiser les blocages:
- 1 → 2 → 3 (Business logic pure, aucune dépendance UI)
- 4 dépend de 2 et 3 (Store utilise types et KPIs)
- 5 et 6 dépendent de 2, 3, 4 (Composants utilisent types, logic, store)
- 7 dépend de 5 et 6 (Pages assemblent composants)
- 8 peut être fait en parallèle de 1-7
- 9, 10, 11 peuvent être faits en parallèle de l'implémentation ou après
- 12 doit être fait après tout le code
- 13 est la dernière étape

### Validation Progressive
- Après section 3: Lancer tests unitaires business logic
- Après section 6: Lancer tests composants
- Après section 7: Tester manuellement dans le navigateur
- Après section 11: Lancer tests E2E
- Après section 12: Build production et vérification finale

### Critères de Succès
✅ Un utilisateur peut uploader un CSV et voir immédiatement:
  - Le nombre de deals (Volume)
  - Le CA total (Pipeline Brut)
  - Le panier moyen
  - Un graphique montrant la répartition par statut

✅ Le code est:
  - TypeScript strict compliant
  - Testé à 80%+ pour `lib/`
  - Formatté et linté
  - Déployé sur Vercel avec succès
