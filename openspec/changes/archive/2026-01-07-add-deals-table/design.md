# Design: add-deals-table

## Architecture Overview

Cette fonctionnalité suit l'architecture existante du projet basée sur la séparation des responsabilités :
- **UI Layer** : Composants React (DealsTable, SearchBar)
- **State Layer** : Zustand store (gestion de la recherche et du filtrage)
- **Business Logic** : Logique de recherche isolée dans le store

```
┌─────────────────────────────────────────────────────┐
│                    app/page.tsx                     │
│                  (Main Dashboard)                   │
│                                                     │
│  ┌──────────────────────────────────────────────┐ │
│  │            SearchBar Component                │ │
│  │  Props: value, onChange, placeholder          │ │
│  └──────────────────────────────────────────────┘ │
│                        ↓                           │
│  ┌──────────────────────────────────────────────┐ │
│  │           DealsTable Component                │ │
│  │  Props: deals (filteredDeals from store)     │ │
│  │  Features: Sorting, Pagination, Empty State   │ │
│  └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
                         ↓↑
              ┌────────────────────┐
              │   Zustand Store    │
              │                    │
              │  - deals           │
              │  - searchQuery     │
              │  - filteredDeals   │
              │  - setSearchQuery()│
              └────────────────────┘
```

## Component Design

### SearchBar Component (`components/shared/SearchBar.tsx`)

**Purpose:** Composant réutilisable de recherche textuelle avec debounce.

**Props:**
```typescript
interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  debounceMs?: number  // Default: 300
}
```

**Key Features:**
- Utilise `Input.Search` d'Ant Design pour l'UI native
- Debounce intégré pour optimiser les performances (évite les re-renders trop fréquents)
- Accessible (ARIA labels)
- Icône de recherche + bouton clear intégré (fourni par Ant Design)

**Implementation Notes:**
- Utiliser `useDebouncedValue` hook personnalisé ou bibliothèque comme `use-debounce`
- Le composant est "controlled" : la valeur vient du parent (store)

---

### DealsTable Component (`components/deals/DealsTable.tsx`)

**Purpose:** Data grid principal affichant tous les deals avec tri et pagination.

**Props:**
```typescript
interface DealsTableProps {
  deals: Deal[]
  loading?: boolean
}
```

**Column Configuration:**

| Colonne | Clé | Sortable | Render | Notes |
|---------|-----|----------|--------|-------|
| **Contact** | `contactName` | ✅ | Text | Colonne principale |
| **Entreprise** | `companyName` | ✅ | Text | - |
| **Statut** | `status` | ✅ | Badge coloré | prospect (bleu), qualifié (orange), négociation (violet), gagné (vert) |
| **Montant** | `amount` | ✅ | Formaté `XX XXX €` | Séparateur milliers |
| **Échéance** | `dueDate` | ✅ | `DD/MM/YYYY` | Highlight si passée (rouge) |
| **Priorité** | `priority` | ✅ | Badge | low (gris), medium (bleu), high (rouge) |
| **Tags** | `tags` | ❌ | Chips Ant Design | Max 3 visibles + "..." si plus |

**Sorting Logic:**
- Utiliser le `sorter` natif d'Ant Design Table
- Pour dates : comparer les timestamps
- Pour montants : comparer les valeurs numériques
- Pour texte : `localeCompare('fr')`

**Pagination:**
- 50 deals par page (configurable)
- Position : `bottom center`
- Afficher le total : "X deals affichés sur Y total"

**Empty State:**
- Si `deals.length === 0` et `searchQuery !== ''` : "Aucun deal ne correspond à votre recherche"
- Si `deals.length === 0` et `searchQuery === ''` : "Aucun deal uploadé. Importez un fichier CSV pour commencer."

**Responsive Design:**
- Desktop (>1024px) : Toutes les colonnes visibles
- Tablet (768px-1024px) : Cacher la colonne `startDate` et `dateCreated`
- Mobile (<768px) : Afficher une version card-based (future amélioration, pas V1)

---

## State Management

### Zustand Store Extension (`store/dealsStore.ts`)

**Current State:**
```typescript
interface DealsState {
  deals: Deal[]
  kpis: KPIs | null
  setDeals: (deals: Deal[]) => void
  clearDeals: () => void
}
```

**Extended State:**
```typescript
interface DealsState {
  deals: Deal[]
  kpis: KPIs | null

  // NEW: Search and filtering
  searchQuery: string
  filteredDeals: Deal[]

  setDeals: (deals: Deal[]) => void
  clearDeals: () => void

  // NEW: Search
  setSearchQuery: (query: string) => void
}
```

**Implementation Details:**

```typescript
setSearchQuery: (query: string) => {
  set({ searchQuery: query })

  // Appliquer le filtre automatiquement
  const { deals } = get()

  if (query.trim() === '') {
    set({ filteredDeals: deals })
    return
  }

  const lowerQuery = query.toLowerCase()
  const filtered = deals.filter(deal => {
    return (
      deal.contactName.toLowerCase().includes(lowerQuery) ||
      deal.companyName.toLowerCase().includes(lowerQuery) ||
      deal.notes.toLowerCase().includes(lowerQuery)
    )
  })

  set({ filteredDeals: filtered })
}
```

**Why this approach:**
- ✅ Logique de filtrage centralisée (réutilisable)
- ✅ Single source of truth : `filteredDeals` est toujours à jour
- ✅ Performance : filtrage optimisé côté store, pas de recalcul dans les composants
- ✅ Testable : logique isolée, facile à unit-tester

---

## Data Flow

### Search Flow
```
User types in SearchBar
         ↓
onChange handler called
         ↓
store.setSearchQuery(query) called
         ↓
Store filters deals based on query
         ↓
filteredDeals state updated
         ↓
DealsTable re-renders with new filteredDeals
```

### Sort Flow
```
User clicks on column header
         ↓
Ant Design Table handles sorting internally
         ↓
Table re-renders with sorted rows
         ↓
(No store update needed - sorting is UI-only)
```

---

## Performance Considerations

### Target Performance
- **Search filtering:** < 200ms sur 500 deals
- **Table sorting:** < 100ms (instantané)
- **Initial render:** < 500ms

### Optimization Strategies

**1. Search Debouncing**
- Debounce de 300ms sur le SearchBar input
- Évite les appels trop fréquents à `setSearchQuery`
- Améliore la fluidité de la saisie

**2. Memoization (if needed)**
```typescript
// Dans DealsTable.tsx
const columns = useMemo(() => getTableColumns(), [])
```

**3. Virtualization (if needed)**
- Si performance < 200ms avec >1000 deals, utiliser `react-window`
- **Décision:** Postposée à V2 si problème constaté

**4. Lazy Loading (future)**
- Pour l'instant, tous les deals sont chargés en mémoire (CSV client-side)
- Migration vers pagination serveur lors de l'ajout du backend

---

## Styling & UI Design

### Design Tokens (Ant Design + Tailwind)

**Table Styling:**
- Utiliser le composant `<Table>` d'Ant Design avec theme par défaut
- Customisations mineures avec Tailwind si nécessaire (padding, spacing)

**Status Badge Colors:**
```typescript
const STATUS_COLORS = {
  'prospect': 'blue',         // Badge bleu
  'qualifié': 'orange',       // Badge orange
  'négociation': 'purple',    // Badge violet
  'gagné - en cours': 'green' // Badge vert
}
```

**Priority Badge Colors:**
```typescript
const PRIORITY_COLORS = {
  'low': 'default',    // Gris
  'medium': 'blue',    // Bleu
  'high': 'red'        // Rouge
}
```

**Tags Display:**
- Utiliser `<Tag>` d'Ant Design
- Couleur : Random mais consistante (hash du tag name)
- Max 3 tags visibles, "..." pour les autres

**Due Date Highlighting:**
```typescript
// Si dueDate < today
<span className="text-red-600 font-semibold">
  {formatDate(dueDate)}
</span>
```

### Layout Integration

**Dashboard Page Structure:**
```
┌────────────────────────────────────────┐
│           Header / Navigation           │ (Future)
├────────────────────────────────────────┤
│                                        │
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ KPI Card │ │ KPI Card │ │ KPI... │ │ (Existant)
│  └──────────┘ └──────────┘ └────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │      Pipeline Chart              │ │ (Existant)
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │   🔍 Search Bar                  │ │ (NEW)
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │                                  │ │
│  │        Deals Table               │ │ (NEW)
│  │    (with sorting, pagination)    │ │
│  │                                  │ │
│  └──────────────────────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

**Spacing:**
- Gap entre sections : `mb-6` (24px)
- Padding conteneur : `p-6` (24px)
- Utiliser Ant Design `<Space>` et `<Divider>` pour la séparation visuelle

---

## Testing Strategy

### Unit Tests (`__tests__/unit/searchLogic.test.ts`)

**Test Cases:**
1. ✅ Search query filters deals correctly
2. ✅ Search is case-insensitive
3. ✅ Empty query returns all deals
4. ✅ Query with no matches returns empty array
5. ✅ Search works on contactName, companyName, notes

### Component Tests (`__tests__/components/`)

**DealsTable Tests:**
1. ✅ Renders all columns correctly
2. ✅ Displays data from props
3. ✅ Shows empty state when no deals
4. ✅ Formats amounts and dates correctly
5. ✅ Applies correct badge colors for status/priority

**SearchBar Tests:**
1. ✅ Calls onChange when user types
2. ✅ Debounces input correctly
3. ✅ Clears input when clear button clicked

### E2E Tests (`__tests__/e2e/deals-table.spec.ts`)

**Full Workflow:**
1. ✅ Upload CSV file
2. ✅ Verify table displays all deals
3. ✅ Use search bar and verify filtering
4. ✅ Click column header and verify sorting
5. ✅ Search with no results and verify empty state

---

## Edge Cases & Error Handling

### Edge Cases

**1. Empty Search Query**
- `searchQuery === ''` → afficher tous les deals

**2. Search with No Results**
- Afficher empty state : "Aucun deal ne correspond à votre recherche"

**3. Very Long Company/Contact Names**
- Utiliser `ellipsis: true` dans la config de colonne Ant Design
- Tooltip au survol pour voir le nom complet

**4. Missing/Null Values**
- Due Date null : afficher "-"
- Tags empty array : afficher "-"
- Notes empty : afficher "-"

**5. Special Characters in Search**
- Gérer correctement les accents (déjà géré par `toLowerCase()`)
- Échapper les caractères regex si nécessaire (pas de regex dans V1)

### Error Boundaries

**Pas nécessaire pour V1** : Le composant DealsTable ne fait pas d'opérations risquées.

Si erreur de rendering (ex: format de données inattendu), Next.js affichera l'error boundary global.

---

## Accessibility (a11y)

### Keyboard Navigation
- Table Ant Design : navigation au clavier native (Tab, Arrow keys)
- SearchBar : focus avec Tab, clear avec Escape

### Screen Readers
- SearchBar : `aria-label="Rechercher un deal"`
- Table : Ant Design fournit les ARIA labels par défaut
- Empty state : texte descriptif lisible par screen reader

### Color Contrast
- Vérifier que les badges status/priority respectent WCAG AA (4.5:1)
- Due dates en rouge : utiliser `text-red-600` (bon contraste sur fond blanc)

---

## Migration Considerations (Future Backend)

### Preparation for Backend Migration

**Changements nécessaires lors de la migration :**

1. **Store :** Remplacer le filtrage client-side par un API call avec query params
   ```typescript
   // Avant (V1)
   setSearchQuery: (query) => { /* filter locally */ }

   // Après (Backend)
   setSearchQuery: async (query) => {
     const deals = await fetch(`/api/deals?search=${query}`)
     set({ filteredDeals: deals })
   }
   ```

2. **DealsTable :** Aucune modification nécessaire (même props interface)

3. **SearchBar :** Aucune modification nécessaire

**Avantage de l'architecture actuelle :**
- Logique isolée dans le store → seul le store change lors de la migration
- Composants UI découplés de la source de données

---

## Alternative Approaches Considered

### Alternative 1: Search Logic in Component
**Rejected** : Logique de recherche directement dans le composant DealsTable

**Pros:**
- Plus simple (pas besoin de store)

**Cons:**
- ❌ Non réutilisable (si on ajoute un autre tableau)
- ❌ Difficile à tester (logique dans le composant)
- ❌ Viole le principe "Business Logic Centralized"

### Alternative 2: Use TanStack Table instead of Ant Design Table
**Rejected** : Utiliser TanStack Table (react-table) au lieu d'Ant Design

**Pros:**
- Plus flexible
- API moderne

**Cons:**
- ❌ Nécessite plus de configuration manuelle
- ❌ Ant Design Table suffit pour nos besoins (sorting, pagination natives)
- ❌ Cohérence avec le reste du projet (Ant Design déjà utilisé)

### Alternative 3: Server-Side Search (with Backend)
**Deferred to Backend Migration** : Implémenter la recherche côté serveur dès V1

**Pros:**
- Meilleure performance pour gros datasets

**Cons:**
- ❌ Pas de backend dans V1 (CSV client-side)
- ❌ Over-engineering pour le cas d'usage actuel (<1000 deals)

---

## Dependencies

### External Libraries (Already in Stack)
- **Ant Design** : `<Table>`, `<Input.Search>`, `<Badge>`, `<Tag>`
- **date-fns** : Formatage des dates (`format(date, 'dd/MM/yyyy')`)
- **Zustand** : Store global
- **React** : `useMemo`, `useCallback` pour optimisations si nécessaire

### New Dependencies (Optional)
- **use-debounce** : Hook de debounce (ou implémentation custom)
  - Si ajouté : `npm install use-debounce`

---

## Open Design Questions

### Question 1: Affichage des Tags dans le Tableau
**Options:**
- **A)** Chips Ant Design colorés (max 3 visibles + "..." pour le reste)
- **B)** Texte simple séparé par virgules
- **C)** Icône avec tooltip affichant tous les tags

**Recommendation:** Option A (chips) pour meilleure lisibilité et cohérence avec l'écosystème Ant Design

### Question 2: Colonnes Visibles par Défaut
**Options:**
- **A)** Afficher toutes les colonnes (Contact, Company, Status, Amount, Due Date, Priority, Tags, Start Date, Date Created)
- **B)** Afficher seulement les colonnes essentielles (Contact, Company, Status, Amount, Due Date, Priority)
- **C)** Colonnes configurables avec "Column Selector" (feature V2)

**Recommendation:** Option B pour V1 (simplicité), Option C pour V2 si demandé

### Question 3: Ordre de Tri par Défaut
**Options:**
- **A)** Tri par défaut : Due Date ascendant (deals urgents en premier)
- **B)** Tri par défaut : Amount descendant (deals les plus gros en premier)
- **C)** Pas de tri par défaut (ordre d'upload)

**Recommendation:** Option A (Due Date) pour alignement avec le cas d'usage "pilotage quotidien"

---

## Success Metrics

**Quantitative:**
- ✅ Performance < 200ms pour recherche/tri sur 500 deals
- ✅ Tests E2E passent à 100%
- ✅ Coverage > 80% sur la logique de recherche

**Qualitative:**
- ✅ Interface intuitive (pas besoin de documentation pour utiliser)
- ✅ Cohérence visuelle avec le reste du dashboard
- ✅ Accessibilité WCAG AA

---

## Future Enhancements (Out of Scope for V1)

1. **Filtres Avancés** (V2) : Dropdown filters pour Status, Priority, Tags
2. **Column Selector** (V2) : Permettre de cacher/afficher des colonnes
3. **Export CSV** (V2) : Bouton d'export des deals filtrés
4. **Bulk Actions** (V3+) : Sélection multiple + actions (ex: changer status)
5. **Inline Editing** (V3+) : Éditer les deals directement dans le tableau
6. **Saved Views** (V3+) : Sauvegarder des configurations de filtres/tri

Ces features seront adressées dans des propositions OpenSpec séparées.
