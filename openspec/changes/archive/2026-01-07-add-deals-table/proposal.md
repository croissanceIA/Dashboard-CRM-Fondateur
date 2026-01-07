# Proposal: add-deals-table

## Purpose
Implémenter le **Tableau Complet (Data Grid)** de la Phase V1, permettant l'affichage de tous les deals avec des capacités de tri et de recherche textuelle. Cette fonctionnalité offre au fondateur une vue détaillée et interactive de l'ensemble de son pipeline commercial.

## Scope
Cette proposition couvre uniquement la fonctionnalité "Tableau Complet (Data Grid)" telle que définie dans la Phase 2 (V1) du PRD :

**Inclus :**
- Affichage de toutes les données des deals dans un tableau (Data Grid)
- Tri sur les colonnes (click-to-sort)
- Barre de recherche textuelle globale
- Intégration avec le Zustand store existant
- État de chargement et empty state

**Exclus (V2 - Futures propositions) :**
- Filtres avancés par Status, Priority, Tags (Phase 3 / V2)
- Export CSV enrichi (Phase 3 / V2)
- Drill-down détaillé (sera une proposition séparée de V1)
- Top 5 deals widget (sera une proposition séparée de V1)

## Background
Le MVP (Phase 1) fournit déjà :
- Upload et parsing de fichiers CSV (spec: `csv-upload`)
- Affichage des KPIs macro (spec: `kpi-display`)
- Visualisation graphique de la répartition des deals (spec: `pipeline-visualization`)

Actuellement, l'utilisateur peut voir des métriques agrégées et un graphique, mais **ne peut pas visualiser les deals individuellement** ni rechercher des deals spécifiques. La V1 comble cette lacune en ajoutant une interface de type "data grid" permettant une exploration plus granulaire du pipeline.

## Why
Le MVP actuel (Phase 1) offre une vue "météo du business" avec des KPIs agrégés et un graphique de répartition. Cependant, le fondateur ne peut pas :
- Voir le détail de ses deals individuellement
- Identifier rapidement un deal spécifique par nom de contact ou d'entreprise
- Trier les deals pour prioriser son action (par montant, échéance, statut)
- Accéder aux informations complètes (priorité, tags, notes) pour chaque opportunité

**Cette limitation bloque le passage d'un outil d'observation passif à un outil de pilotage actif.**

Le Tableau Complet (Data Grid) résout ce problème en permettant au fondateur de :
1. **Explorer** son pipeline en détail avec toutes les informations par deal
2. **Rechercher** instantanément un deal spécifique par nom ou mot-clé
3. **Trier** les deals selon différents critères pour prioriser son action quotidienne
4. **Identifier** visuellement les deals urgents (échéances passées, haute priorité)

**Valeur business :**
- Passage d'une vue "météo" (KPIs seuls) à un outil de pilotage opérationnel
- Facilite la priorisation et le suivi quotidien des opportunités commerciales
- Prépare le terrain pour les fonctionnalités V1 suivantes (Top 5 deals, drill-down, alertes)
- Constitue la fondation pour les filtres avancés de V2

## What Changes

### New Spec: `deals-table`
Création d'une nouvelle spec définissant les capacités du data grid complet avec recherche et tri.

**Capabilities ADDED:**
- Affichage de tous les deals dans un tableau structuré
- Tri interactif sur toutes les colonnes (click-to-sort)
- Recherche textuelle globale en temps réel
- Pagination (50 deals/page)
- Affichage de badges colorés pour Status et Priority
- Affichage de tags sous forme de chips
- Highlight visuel des deals en retard (due date passée)
- Empty states appropriés (aucun deal, aucun résultat de recherche)
- Design responsive (desktop + tablet)
- Support accessibilité (clavier + screen readers)

**Requirements:** 16 requirements avec 46 scénarios couvrant :
- Data Grid Display (affichage, formatage, valeurs manquantes)
- Table Sorting (tri par montant, date, texte)
- Text Search (recherche multi-champs, debouncing)
- Pagination
- Visual Display (badges, tags, highlighting)
- Empty States
- Responsive Design
- Performance
- Accessibility

### Store Extension: `store/dealsStore.ts`
**MODIFIED:**
```typescript
interface DealsState {
  // Existing
  deals: Deal[]
  kpis: KPIs | null

  // NEW
  searchQuery: string
  filteredDeals: Deal[]

  // Existing
  setDeals: (deals: Deal[]) => void
  clearDeals: () => void

  // NEW
  setSearchQuery: (query: string) => void
}
```

### New Components
**ADDED:**
1. `components/deals/DealsTable.tsx` - Composant principal du data grid
2. `components/shared/SearchBar.tsx` - Barre de recherche réutilisable avec debounce

### Page Integration
**MODIFIED:**
- `app/page.tsx` - Intégration de SearchBar + DealsTable sous les KPIs et le graphique

### Tests
**ADDED:**
- `__tests__/unit/searchLogic.test.ts` - Tests de la logique de recherche
- `__tests__/components/DealsTable.test.tsx` - Tests du composant tableau
- `__tests__/components/SearchBar.test.tsx` - Tests du composant recherche
- `__tests__/e2e/deals-table.spec.ts` - Test E2E du workflow complet

## Related Changes
Aucun changement actif. Ce changement dépend des specs existantes :
- **Dépend de:** `csv-upload` (pour la disponibilité des deals dans le store)
- **Dépend de:** `kpi-display` (KPIs déjà affichés sur la même page)
- **Prépare:** Futures propositions V1 (Top 5 deals, Deal drill-down, Alertes)

## Implementation Summary
Cette fonctionnalité sera implémentée en ajoutant :

1. **Nouveau spec `deals-table`** définissant les capacités du data grid
2. **Composant `DealsTable.tsx`** utilisant Ant Design Table avec sorting natif
3. **Composant `SearchBar.tsx`** réutilisable pour la recherche textuelle
4. **Extension du Zustand store** pour gérer :
   - La recherche textuelle (`searchQuery`)
   - Les deals filtrés (`filteredDeals`)
   - La logique de recherche (fonction `setSearchQuery` + application automatique)
5. **Tests** :
   - Unit tests pour la logique de recherche
   - Component tests pour DealsTable et SearchBar
   - E2E test pour le workflow "recherche + tri"

**Approche technique :**
- Utilisation d'Ant Design `<Table>` avec `sorter` pour le tri natif côté client
- Recherche case-insensitive sur `contactName`, `companyName`, `notes`
- Performance : OK jusqu'à ~1000 deals (optimisation avec virtualization si nécessaire en V2)

## Affected Systems
- **Zustand Store** (`store/dealsStore.ts`) : Ajout de `searchQuery`, `filteredDeals`, `setSearchQuery`
- **Components** : Création de `components/deals/DealsTable.tsx`, `components/shared/SearchBar.tsx`
- **Main Dashboard Page** (`app/page.tsx`) : Intégration du tableau sous les KPIs et le graphique
- **Types** : Aucune modification (types `Deal` existants suffisants)

## Open Questions
1. **Ordre des colonnes :** Quel ordre privilégier dans le tableau ? Proposition : Contact Name | Company Name | Status | Amount | Due Date | Priority | Tags
2. **Pagination :** Faut-il paginer dès la V1 ou afficher tous les deals (+ scroll) ? Proposition : Pagination 50 deals/page pour UX optimale
3. **Colonnes visibles par défaut :** Faut-il cacher certaines colonnes (ex: `dateCreated`, `startDate`) pour simplifier l'interface ? Proposition : Afficher seulement les colonnes essentielles, possibilité d'ajouter un "column selector" en V2
4. **Format des tags :** Dans le tableau, afficher les tags comme chips Ant Design ou simple texte séparé par virgules ? Proposition : Chips colorés pour meilleure lisibilité

## Timeline Estimate
*Note: Ces estimations sont fournies uniquement pour information et peuvent varier selon les priorités et la complexité découverte en cours de développement.*

- **Spec writing + validation :** ~1h
- **Store extension :** ~30min
- **SearchBar component :** ~45min
- **DealsTable component :** ~2-3h (colonnes, sorting, formatting)
- **Page integration :** ~30min
- **Tests :** ~2h (unit + component + E2E)
- **Total :** ~6-8h de développement

## Success Criteria
Cette fonctionnalité sera considérée comme réussie si :

1. ✅ Tous les deals uploadés s'affichent dans un tableau lisible et responsive
2. ✅ L'utilisateur peut trier chaque colonne en cliquant sur le header (ordre ascendant/descendant)
3. ✅ La barre de recherche filtre instantanément les deals affichés
4. ✅ La recherche fonctionne sur les champs : contact name, company name, notes
5. ✅ Le tableau affiche un empty state clair si aucun deal ne correspond à la recherche
6. ✅ Les tests E2E valident le workflow complet (upload CSV → recherche → tri)
7. ✅ Performance acceptable : < 200ms pour recherche/tri sur 500 deals

## Risks & Mitigations
| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| Performance dégradée avec >1000 deals | Medium | Low | Utiliser `react-window` pour virtualisation si nécessaire |
| Complexité du tri multi-colonnes | Low | Low | Utiliser le sorting natif d'Ant Design Table (déjà implémenté) |
| UX confuse avec trop de colonnes | Medium | Medium | Limiter aux colonnes essentielles, cacher les autres par défaut |
| Recherche trop lente sur gros datasets | Medium | Low | Debounce la recherche (300ms) et optimiser avec `useMemo` |

## Notes
- Cette fonctionnalité est un **prérequis** pour d'autres fonctionnalités V1 (Top 5 deals, Drill-down)
- Le code doit rester simple et ne pas anticiper les filtres avancés de V2
- Respect de la règle "Avoid over-engineering" : pas de features non demandées
