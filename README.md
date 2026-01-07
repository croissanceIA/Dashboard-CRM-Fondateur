# Dashboard CRM "Fondateur"

Single Page Application de suivi commercial pour fondateur unique, permettant de piloter le pipeline de ventes avec deux axes : **Volume** et **Valeur** des deals.

## 🎯 Objectif

Maximiser l'efficacité commerciale en offrant une vision claire et actionnable du pipeline, de la génération de leads à la conclusion des deals, sans complexité technique.

## ✨ Fonctionnalités

### Phase 1 : MVP - "La Météo du Business" ✅

Vue macro immédiate pour une prise de décision rapide :

- 📤 **Upload CSV** : Import simple des données prospects
- 📊 **KPIs Macro** :
  - Volume du Pipeline (nombre de deals actifs)
  - CA Total Pipeline Brut (somme sans pondération)
  - Panier Moyen (valeur moyenne par deal)
- 📈 **Visualisation** : Graphique de répartition des deals par étape (Status)

### Phase 2 : V1 - "L'Outil de Pilotage" (À venir)

Intelligence et gestion opérationnelle :

- 💰 CA Prévisionnel (Weighted Pipeline) avec probabilités
- 🎯 Top 5 deals par valeur pondérée
- 📋 Tableau complet avec tri et recherche
- ⚠️ Alertes sur les tâches en retard
- 🔍 Drill-down détaillé par deal

### Phase 3 : V2 - "L'Explorateur" (À venir)

Analyse fine et filtrage avancé :

- 🔎 Filtres avancés (Status, Priority, Tags)
- 📥 Export CSV enrichi
- 📉 Indicateurs de variation et tendances

## 🛠 Stack Technique

- **Framework** : Next.js 15 + React 19 + TypeScript 5.7+
- **UI** : Ant Design 5.22+ + Tailwind CSS 3.x
- **Charts** : Recharts 2.15+
- **State** : Zustand 5.x
- **CSV** : PapaParse 5.4+
- **Tests** : Vitest + Testing Library + Playwright
- **Deployment** : Vercel

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation des dépendances

```bash
npm install
```

### Configuration

Créer un fichier `.env.local` à la racine (optionnel pour le MVP) :

```bash
cp .env.example .env.local
```

## 💻 Commandes Disponibles

### Développement

```bash
npm run dev          # Démarrer le serveur de développement (http://localhost:3000)
```

### Build & Production

```bash
npm run build        # Compiler pour la production
npm start            # Démarrer le serveur de production
```

### Code Quality

```bash
npm run lint         # Vérifier les erreurs ESLint
npm run lint:fix     # Corriger automatiquement les erreurs ESLint
npm run format       # Formatter le code avec Prettier
npm run format:check # Vérifier le formatage
npm run type-check   # Vérifier les types TypeScript
```

### Tests

```bash
npm run test              # Lancer les tests unitaires (Vitest)
npm run test:watch        # Tests en mode watch
npm run test:coverage     # Générer le rapport de couverture
npm run test:e2e          # Lancer les tests E2E (Playwright)
npm run test:e2e:ui       # Tests E2E avec interface UI
```

### Analyse

```bash
npm run analyze      # Analyser la taille des bundles
```

## 📁 Structure du Projet

```
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout global
│   ├── page.tsx            # Page principale du dashboard
│   └── globals.css         # Styles globaux
├── components/             # Composants React
│   ├── dashboard/          # KPICards, PipelineChart, AlertsBadge
│   ├── deals/              # DealsTable, TopDealsWidget, DealFilters
│   └── shared/             # CSVUploader, SearchBar, ExportButton
├── lib/                    # Logique métier
│   ├── dataProcessing.ts   # Parsing et transformation CSV
│   ├── kpiCalculations.ts  # Calculs KPIs
│   ├── types.ts            # Types TypeScript
│   ├── constants.ts        # Configuration des probabilités
│   ├── validation.ts       # Validation des données
│   └── utils.ts            # Utilitaires génériques
├── store/                  # Zustand stores
│   └── dealsStore.ts       # État global des deals
├── __tests__/              # Tests
│   ├── unit/               # Tests unitaires (Vitest)
│   ├── components/         # Tests composants (Testing Library)
│   └── e2e/                # Tests end-to-end (Playwright)
├── public/                 # Assets statiques
│   └── crm_prospects_demo.csv  # Fichier CSV de démo
└── openspec/               # Spécifications OpenSpec
```

## 📊 Format CSV Attendu

Le fichier CSV doit contenir les colonnes suivantes :

| Colonne | Type | Exemple | Obligatoire |
|---------|------|---------|-------------|
| `Task Name` | String | "Jean Dupont - Entreprise SAS" | ✅ |
| `Status` | String | prospect, qualifié, négociation, gagné - en cours | ✅ |
| `Montant Deal` | Number | 15000 | ✅ |
| `Due Date` | Date | 2024-01-15 | ❌ |
| `Date Created` | Date | 2024-01-01 | ❌ |
| `Start Date` | Date | 2024-01-05 | ❌ |
| `Priority` | String | low, medium, high | ❌ |
| `Tags` | String | "SaaS\|B2B\|Enterprise" | ❌ |
| `Task Content` | String | Notes sur le prospect | ❌ |
| `Assignees` | String | Nom de l'assigné | ❌ |

### Fichier de démo

Un fichier CSV de démonstration est disponible dans `public/crm_prospects_demo.csv`.

## 🔄 Règles Métier

### Transformation des Données

1. **Parsing Identité** : La colonne `Task Name` est automatiquement séparée en :
   - `Contact Name` (avant le " - ")
   - `Company Name` (après le " - ")

2. **Parsing Tags** : Les tags séparés par `|` sont convertis en tableau

3. **Typage** : Conversion automatique des montants et dates

### Calcul des KPIs

- **Pipeline Brut** : Somme de tous les montants de deals actifs
- **Pipeline Pondéré** : Somme des (Montant × Probabilité du statut)
- **Panier Moyen** : Pipeline Brut ÷ Nombre de deals actifs

### Probabilités par Statut

| Statut | Probabilité |
|--------|-------------|
| prospect | 10% |
| qualifié | 40% |
| négociation | 75% |
| gagné - en cours | 100% |

## 🎨 Design

- Interface claire et minimaliste
- Design professionnel pour dashboards business
- Palette de couleurs Ant Design par défaut
- Responsive design (desktop et tablette)

## 🚢 Déploiement

### Vercel (Recommandé)

1. Connecter le repository GitHub à Vercel
2. Configuration automatique Next.js
3. Déploiement automatique sur chaque push `main`

### Autre hébergement

```bash
npm run build
npm start
```

Le build statique sera disponible dans le dossier `.next/`.

## 📈 Roadmap

- [x] **Phase 1 - MVP** : Vue macro avec KPIs essentiels et graphique
- [ ] **Phase 2 - V1** : Intelligence avec CA pondéré, top deals, tableau complet
- [ ] **Phase 3 - V2** : Filtres avancés, export, indicateurs de tendance

## 🤝 Contribution

Ce projet utilise OpenSpec pour la gestion des changements. Consultez `openspec/AGENTS.md` pour plus d'informations.

## 📄 Documentation

- [PRD.md](./PRD.md) - Spécifications fonctionnelles détaillées
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture technique complète
- [CLAUDE.md](./CLAUDE.md) - Instructions pour Claude Code

## 📝 License

Propriétaire - Tous droits réservés

---

**Version actuelle** : MVP - Phase 1
**Dernière mise à jour** : 2026-01-07
