# Tasks: add-deals-table

## Task List

### 1. Extend Zustand Store for Search and Filtering
**Description:** Ajouter la logique de recherche textuelle au store global.

**Actions:**
- Ajouter `searchQuery: string` à l'état du store
- Ajouter `filteredDeals: Deal[]` à l'état du store
- Implémenter `setSearchQuery(query: string)` qui met à jour la query et filtre automatiquement
- Implémenter la fonction de filtrage (recherche case-insensitive sur `contactName`, `companyName`, `notes`)
- Mettre à jour `setDeals()` pour initialiser `filteredDeals` avec tous les deals

**Validation:**
- Tests unitaires : vérifier que `setSearchQuery('test')` filtre correctement
- Vérifier que la recherche est case-insensitive
- Vérifier que les `filteredDeals` sont mis à jour automatiquement

**Dépendances:** Aucune

**Fichiers modifiés:** `store/dealsStore.ts`

---

### 2. Create SearchBar Component
**Description:** Créer un composant réutilisable de barre de recherche.

**Actions:**
- Créer `components/shared/SearchBar.tsx`
- Utiliser `Input.Search` d'Ant Design
- Props : `value`, `onChange`, `placeholder`
- Ajouter debounce (300ms) pour optimiser les performances
- Rendre le composant accessible (ARIA labels)

**Validation:**
- Component test : vérifier que `onChange` est appelé avec la bonne valeur
- Vérifier que le debounce fonctionne (pas de call immédiat)
- Vérifier l'accessibilité (screen reader)

**Dépendances:** Aucune

**Fichiers créés:** `components/shared/SearchBar.tsx`

---

### 3. Create DealsTable Component
**Description:** Créer le composant principal du data grid avec toutes les colonnes et le tri.

**Actions:**
- Créer `components/deals/DealsTable.tsx`
- Utiliser `<Table>` d'Ant Design
- Définir les colonnes :
  - Contact Name (sortable)
  - Company Name (sortable)
  - Status (sortable, avec badge coloré)
  - Amount (sortable, formaté en €)
  - Due Date (sortable, formaté DD/MM/YYYY)
  - Priority (sortable, avec badge)
  - Tags (affichage chips ou texte)
- Activer le tri natif Ant Design (`sorter: true`)
- Ajouter pagination (50 deals/page)
- Implémenter empty state ("Aucun deal ne correspond à votre recherche")
- Rendre le tableau responsive

**Validation:**
- Component test : vérifier l'affichage des colonnes
- Vérifier que le tri fonctionne (clic sur header)
- Vérifier le formatage des montants et dates
- Vérifier l'empty state avec tableau vide

**Dépendances:** Tâche 1 (besoin de `filteredDeals` du store)

**Fichiers créés:** `components/deals/DealsTable.tsx`

---

### 4. Integrate Components into Main Dashboard Page
**Description:** Intégrer la SearchBar et DealsTable dans la page principale du dashboard.

**Actions:**
- Modifier `app/page.tsx`
- Ajouter la SearchBar au-dessus du tableau
- Connecter la SearchBar au store Zustand (`searchQuery`, `setSearchQuery`)
- Ajouter le DealsTable sous les KPIs et le graphique
- Passer `filteredDeals` du store au DealsTable
- Ajuster le layout pour une bonne hiérarchie visuelle

**Validation:**
- Vérifier l'affichage complet sur la page
- Vérifier que la recherche filtre bien le tableau en temps réel
- Vérifier le responsive design (desktop + tablet)

**Dépendances:** Tâches 1, 2, 3

**Fichiers modifiés:** `app/page.tsx`

---

### 5. Add Unit Tests for Search Logic
**Description:** Tester la logique de recherche du store.

**Actions:**
- Créer `__tests__/unit/searchLogic.test.ts`
- Tester `setSearchQuery` avec différentes queries
- Tester la recherche sur `contactName`, `companyName`, `notes`
- Tester le case-insensitive
- Tester les edge cases (query vide, aucun résultat)

**Validation:**
- Tous les tests passent
- Coverage > 80% sur la logique de recherche

**Dépendances:** Tâche 1

**Fichiers créés:** `__tests__/unit/searchLogic.test.ts`

---

### 6. Add Component Tests for DealsTable and SearchBar
**Description:** Tester les composants React avec Testing Library.

**Actions:**
- Créer `__tests__/components/DealsTable.test.tsx`
- Tester l'affichage des colonnes et des données
- Tester le tri (simuler clic sur header)
- Tester l'empty state
- Créer `__tests__/components/SearchBar.test.tsx`
- Tester l'input utilisateur et le onChange

**Validation:**
- Tous les tests passent
- Coverage > 60% sur les composants

**Dépendances:** Tâches 2, 3

**Fichiers créés:** `__tests__/components/DealsTable.test.tsx`, `__tests__/components/SearchBar.test.tsx`

---

### 7. Add E2E Test for Search and Sort Workflow
**Description:** Tester le workflow complet utilisateur avec Playwright.

**Actions:**
- Créer `__tests__/e2e/deals-table.spec.ts`
- Tester le workflow :
  1. Upload fichier CSV
  2. Vérifier affichage du tableau
  3. Utiliser la recherche et vérifier le filtrage
  4. Cliquer sur un header de colonne et vérifier le tri
  5. Vérifier l'empty state avec recherche sans résultat

**Validation:**
- Test E2E passe de bout en bout
- Temps d'exécution < 30s

**Dépendances:** Tâche 4

**Fichiers créés:** `__tests__/e2e/deals-table.spec.ts`

---

### 8. Performance Testing and Optimization
**Description:** Vérifier les performances avec un dataset réaliste et optimiser si nécessaire.

**Actions:**
- Créer un fichier CSV de test avec 500 deals
- Mesurer le temps de recherche et de tri
- Si > 200ms, optimiser avec :
  - `useMemo` pour les calculs de filtrage
  - Debounce sur la SearchBar (déjà fait en tâche 2)
  - Considérer `react-window` si nécessaire

**Validation:**
- Recherche < 200ms sur 500 deals
- Tri instantané (< 100ms)
- Pas de lag visible dans l'UI

**Dépendances:** Tâche 4

**Fichiers modifiés:** `store/dealsStore.ts`, `components/deals/DealsTable.tsx` (si optimisations nécessaires)

---

### 9. Documentation and Code Review
**Description:** Documenter le code et préparer pour review.

**Actions:**
- Ajouter JSDoc comments aux fonctions clés
- Vérifier la conformité TypeScript (strict mode)
- Exécuter `npm run lint` et corriger les warnings
- Exécuter `npm run format`
- Vérifier le build production (`npm run build`)

**Validation:**
- Aucune erreur TypeScript
- Aucune erreur de lint
- Build production réussit
- Code formaté correctement

**Dépendances:** Toutes les tâches précédentes

**Fichiers modifiés:** Tous les fichiers créés/modifiés

---

## Task Summary
- **Total tasks:** 9
- **Parallel work possible:** Tâches 2 et 5 peuvent être faites en parallèle après la tâche 1
- **Critical path:** Tâche 1 → Tâche 3 → Tâche 4 → Tâche 7
- **Estimated effort:** 6-8 heures de développement total
