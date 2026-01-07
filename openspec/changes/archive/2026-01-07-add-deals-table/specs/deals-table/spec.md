# deals-table Specification

## Purpose
Fournir une interface de type "data grid" permettant au fondateur de visualiser, trier et rechercher l'ensemble de ses deals dans un tableau interactif. Cette capacité transforme le dashboard d'un simple affichage de métriques agrégées en un véritable outil de pilotage opérationnel.

## ADDED Requirements

### Requirement: Data Grid Display SHALL display all uploaded deals in a table
The system SHALL display all deals from the uploaded CSV file in a structured table (data grid) format.

#### Scenario: Affichage complet après upload d'un fichier CSV
- **GIVEN** l'utilisateur a uploadé un fichier CSV contenant 50 deals
- **WHEN** les données sont parsées et stockées dans le store
- **THEN** le data grid affiche les 50 deals dans le tableau
- **AND** chaque ligne correspond à un deal unique
- **AND** toutes les colonnes essentielles sont visibles (Contact Name, Company Name, Status, Amount, Due Date, Priority, Tags)

#### Scenario: Affichage des valeurs formatées
- **GIVEN** un deal avec `amount: 25000`, `dueDate: 2026-01-15`, `status: 'négociation'`
- **WHEN** le deal est affiché dans le tableau
- **THEN** le montant s'affiche formaté avec séparateur de milliers : "25 000 €"
- **AND** la date s'affiche au format français : "15/01/2026"
- **AND** le statut s'affiche dans un badge coloré (violet pour "négociation")

#### Scenario: Gestion des valeurs manquantes
- **GIVEN** un deal avec `dueDate: null`, `tags: []`
- **WHEN** le deal est affiché dans le tableau
- **THEN** la colonne Due Date affiche "-"
- **AND** la colonne Tags affiche "-"
- **AND** aucune erreur n'est générée

### Requirement: Table Sorting SHALL allow sorting by any column
The system SHALL allow users to sort the data grid by clicking on any column header, with ascending/descending toggle.

#### Scenario: Tri par montant descendant
- **GIVEN** le tableau affiche 20 deals avec différents montants
- **WHEN** l'utilisateur clique sur le header de la colonne "Montant"
- **THEN** le tableau se réorganise avec les deals les plus gros montants en premier
- **AND** un indicateur visuel (flèche) montre l'ordre de tri (descendant)
- **AND** un second clic inverse l'ordre (montants les plus petits en premier)

#### Scenario: Tri par date d'échéance
- **GIVEN** le tableau affiche des deals avec différentes due dates
- **WHEN** l'utilisateur clique sur le header de la colonne "Échéance"
- **THEN** le tableau se trie par date d'échéance croissante (dates les plus proches en premier)
- **AND** les deals sans due date (`null`) s'affichent en dernier

#### Scenario: Tri alphabétique sur Contact Name
- **GIVEN** le tableau affiche des deals avec différents noms de contacts
- **WHEN** l'utilisateur clique sur le header "Contact"
- **THEN** le tableau se trie alphabétiquement (A-Z) sur le nom du contact
- **AND** le tri respecte les règles de locale française (accents gérés correctement)

### Requirement: Text Search SHALL filter deals in real-time
The system SHALL provide a search bar that filters the visible deals based on text input, searching across multiple fields.

#### Scenario: Recherche par nom de contact
- **GIVEN** le tableau affiche 50 deals
- **WHEN** l'utilisateur tape "Martin" dans la barre de recherche
- **THEN** le tableau n'affiche que les deals dont le champ `contactName` contient "Martin"
- **AND** le filtrage est instantané (< 300ms)
- **AND** la recherche est case-insensitive ("martin", "MARTIN", "Martin" donnent les mêmes résultats)

#### Scenario: Recherche par nom d'entreprise
- **GIVEN** le tableau affiche 50 deals
- **WHEN** l'utilisateur tape "Acme Corp" dans la barre de recherche
- **THEN** le tableau n'affiche que les deals dont le champ `companyName` contient "Acme Corp"

#### Scenario: Recherche dans les notes
- **GIVEN** un deal avec `notes: "Rendez-vous prévu pour démo produit"`
- **WHEN** l'utilisateur tape "démo" dans la barre de recherche
- **THEN** ce deal s'affiche dans les résultats de recherche
- **AND** les deals sans le mot "démo" dans leurs notes sont masqués

#### Scenario: Recherche sans résultat
- **GIVEN** le tableau affiche 50 deals
- **WHEN** l'utilisateur tape "XYZ123" et qu'aucun deal ne correspond
- **THEN** le tableau affiche un empty state avec le message "Aucun deal ne correspond à votre recherche"
- **AND** la barre de recherche reste active avec la query affichée

#### Scenario: Effacement de la recherche
- **GIVEN** l'utilisateur a tapé une query et le tableau affiche des résultats filtrés
- **WHEN** l'utilisateur efface complètement le contenu de la barre de recherche
- **THEN** le tableau affiche à nouveau tous les deals (reset du filtre)

### Requirement: Pagination SHALL organize deals into pages
The system SHALL paginate the data grid to improve readability and performance with large datasets.

#### Scenario: Pagination avec 120 deals
- **GIVEN** l'utilisateur a uploadé un fichier avec 120 deals
- **WHEN** le tableau s'affiche
- **THEN** la première page affiche 50 deals maximum
- **AND** un contrôle de pagination s'affiche en bas du tableau
- **AND** le contrôle indique "Page 1 sur 3" et "120 deals au total"

#### Scenario: Navigation entre les pages
- **GIVEN** le tableau affiche la page 1 sur 3
- **WHEN** l'utilisateur clique sur "Page suivante" ou "2"
- **THEN** le tableau charge et affiche les deals 51 à 100
- **AND** l'indicateur de page se met à jour : "Page 2 sur 3"

#### Scenario: Pagination avec recherche active
- **GIVEN** l'utilisateur a tapé "Martin" et obtient 15 résultats
- **WHEN** les résultats s'affichent
- **THEN** tous les 15 résultats tiennent sur une seule page
- **AND** le contrôle de pagination indique "15 deals affichés"

### Requirement: Status Badge Display SHALL use colored badges
The system SHALL display the `status` field using colored badges for better visual distinction.

#### Scenario: Affichage des badges de statut
- **GIVEN** le tableau affiche des deals avec différents statuts
- **WHEN** la colonne Status s'affiche
- **THEN** chaque statut utilise un badge coloré :
  - "prospect" → Badge bleu
  - "qualifié" → Badge orange
  - "négociation" → Badge violet
  - "gagné - en cours" → Badge vert

#### Scenario: Cohérence visuelle avec le pipeline chart
- **GIVEN** le pipeline chart utilise une palette de couleurs pour les statuts
- **WHEN** le tableau affiche les badges de statut
- **THEN** les couleurs des badges sont cohérentes avec celles du graphique

### Requirement: Priority Badge Display SHALL use colored badges
The system SHALL display the `priority` field using colored badges to highlight urgency.

#### Scenario: Affichage des badges de priorité
- **GIVEN** le tableau affiche des deals avec différentes priorités
- **WHEN** la colonne Priority s'affiche
- **THEN** chaque priorité utilise un badge coloré :
  - "low" → Badge gris (default)
  - "medium" → Badge bleu
  - "high" → Badge rouge

### Requirement: Tags Display SHALL show tags as visual chips
The system SHALL display the `tags` array as colored chips for better readability.

#### Scenario: Affichage de tags multiples
- **GIVEN** un deal avec `tags: ['SaaS', 'B2B', 'Enterprise']`
- **WHEN** le deal s'affiche dans le tableau
- **THEN** la colonne Tags affiche 3 chips colorés avec les valeurs "SaaS", "B2B", "Enterprise"
- **AND** chaque chip utilise une couleur distincte mais cohérente (basée sur un hash du nom du tag)

#### Scenario: Limitation du nombre de tags visibles
- **GIVEN** un deal avec `tags: ['SaaS', 'B2B', 'Enterprise', 'High-Value', 'Warm-Lead']`
- **WHEN** le deal s'affiche dans le tableau
- **THEN** la colonne Tags affiche les 3 premiers chips : "SaaS", "B2B", "Enterprise"
- **AND** un indicateur "+2" s'affiche pour indiquer qu'il y a 2 tags supplémentaires
- **AND** un tooltip au survol affiche tous les 5 tags

#### Scenario: Deal sans tags
- **GIVEN** un deal avec `tags: []`
- **WHEN** le deal s'affiche dans le tableau
- **THEN** la colonne Tags affiche "-"

### Requirement: Due Date Highlighting SHALL emphasize overdue deals
The system SHALL visually highlight deals whose `dueDate` has passed to draw attention.

#### Scenario: Mise en évidence des deals en retard
- **GIVEN** aujourd'hui est le 07/01/2026
- **AND** un deal a `dueDate: 2026-01-05` (passée)
- **WHEN** le deal s'affiche dans le tableau
- **THEN** la date d'échéance s'affiche en rouge et en gras : "05/01/2026"
- **AND** optionnellement, un icône d'alerte (⚠️) s'affiche à côté

#### Scenario: Deals à venir ou sans échéance
- **GIVEN** aujourd'hui est le 07/01/2026
- **AND** un deal a `dueDate: 2026-01-15` (future)
- **WHEN** le deal s'affiche dans le tableau
- **THEN** la date d'échéance s'affiche normalement (pas de highlight)

### Requirement: Empty State SHALL provide clear feedback
The system SHALL display appropriate empty states when no deals are available.

#### Scenario: Aucun deal uploadé
- **GIVEN** l'utilisateur vient d'arriver sur le dashboard
- **AND** aucun fichier CSV n'a été uploadé
- **WHEN** le tableau s'affiche
- **THEN** un message s'affiche : "Aucun deal uploadé. Importez un fichier CSV pour commencer."
- **AND** le message inclut un call-to-action visuel vers le CSV uploader

#### Scenario: Recherche sans résultat
- **GIVEN** l'utilisateur a uploadé 50 deals
- **AND** l'utilisateur tape "XYZ123" dans la recherche
- **AND** aucun deal ne correspond
- **WHEN** le tableau s'affiche
- **THEN** un message s'affiche : "Aucun deal ne correspond à votre recherche"
- **AND** la barre de recherche reste visible avec la query affichée
- **AND** un bouton "Effacer la recherche" permet de revenir à la vue complète

### Requirement: Responsive Design SHALL adapt to different screen sizes
The system SHALL adjust the table layout for different screen sizes (desktop, tablet).

#### Scenario: Affichage desktop
- **GIVEN** l'utilisateur accède au dashboard sur un écran > 1024px
- **WHEN** le tableau s'affiche
- **THEN** toutes les colonnes essentielles sont visibles (Contact, Company, Status, Amount, Due Date, Priority, Tags)
- **AND** le tableau utilise toute la largeur disponible

#### Scenario: Affichage tablet
- **GIVEN** l'utilisateur accède au dashboard sur un écran entre 768px et 1024px
- **WHEN** le tableau s'affiche
- **THEN** les colonnes essentielles restent visibles
- **AND** les colonnes moins critiques (ex: Start Date, Date Created) sont masquées
- **AND** le tableau reste scrollable horizontalement si nécessaire

### Requirement: Column Width Management SHALL optimize readability
The system SHALL set appropriate column widths based on content type.

#### Scenario: Configuration des largeurs de colonnes
- **GIVEN** le tableau affiche plusieurs colonnes
- **WHEN** le tableau s'affiche
- **THEN** les colonnes ont des largeurs optimisées :
  - Contact Name : ~150px
  - Company Name : ~150px
  - Status : ~120px (largeur fixe)
  - Amount : ~120px (aligné à droite)
  - Due Date : ~120px
  - Priority : ~100px (largeur fixe)
  - Tags : ~200px (flexible)

#### Scenario: Gestion du overflow sur longues valeurs
- **GIVEN** un deal avec `companyName: "Société Internationale de Technologies Avancées"`
- **WHEN** le nom s'affiche dans la colonne Company Name
- **THEN** le texte est tronqué avec ellipsis ("Société Internatio...")
- **AND** un tooltip au survol affiche le nom complet

### Requirement: Store Integration SHALL manage search state globally
The system SHALL store the search query and filtered results in the Zustand global store.

#### Scenario: Synchronisation de la recherche avec le store
- **GIVEN** l'utilisateur tape "Martin" dans la barre de recherche
- **WHEN** l'input change
- **THEN** le store Zustand est mis à jour avec `searchQuery: "Martin"`
- **AND** le store calcule automatiquement `filteredDeals` en filtrant sur la query
- **AND** le tableau consomme `filteredDeals` et se re-render

#### Scenario: Persistance de la recherche
- **GIVEN** l'utilisateur a tapé une query et obtenu des résultats filtrés
- **WHEN** l'utilisateur navigue vers une autre partie de l'app (future feature)
- **AND** revient sur le tableau
- **THEN** la query de recherche est toujours présente dans la barre de recherche
- **AND** les résultats filtrés sont toujours affichés

### Requirement: Performance SHALL maintain responsiveness
The system SHALL maintain good performance even with moderately large datasets.

#### Scenario: Performance avec 500 deals
- **GIVEN** l'utilisateur a uploadé un fichier CSV contenant 500 deals
- **WHEN** l'utilisateur effectue une recherche
- **THEN** les résultats s'affichent en moins de 200ms
- **AND** le tri par colonne s'exécute en moins de 100ms
- **AND** l'interface reste fluide sans lag perceptible

#### Scenario: Debouncing de la recherche
- **GIVEN** l'utilisateur tape rapidement "Martin" dans la barre de recherche
- **WHEN** l'utilisateur tape chaque lettre en moins de 100ms d'intervalle
- **THEN** la recherche est debounced (déclenchée seulement après 300ms de pause)
- **AND** évite les calculs de filtrage trop fréquents

### Requirement: Accessibility SHALL support keyboard navigation and screen readers
The system SHALL be accessible via keyboard and screen readers.

#### Scenario: Navigation au clavier
- **GIVEN** l'utilisateur utilise uniquement le clavier
- **WHEN** l'utilisateur appuie sur Tab
- **THEN** le focus se déplace séquentiellement : Search Bar → Table Headers → Table Rows → Pagination
- **AND** les éléments focalisés ont un outline visible

#### Scenario: Support des screen readers
- **GIVEN** l'utilisateur utilise un screen reader
- **WHEN** le tableau s'affiche
- **THEN** la barre de recherche a un label ARIA : "Rechercher un deal"
- **AND** le tableau a des headers ARIA appropriés
- **AND** l'empty state est lisible par le screen reader

#### Scenario: Tri accessible
- **GIVEN** l'utilisateur navigue au clavier
- **WHEN** l'utilisateur appuie sur Enter sur un header de colonne
- **THEN** le tri s'active comme si l'utilisateur avait cliqué avec la souris
- **AND** un feedback audio (screen reader) indique l'ordre de tri actif
