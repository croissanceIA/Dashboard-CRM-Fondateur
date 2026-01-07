# pipeline-visualization Specification

## Purpose
TBD - created by archiving change add-mvp-dashboard. Update Purpose after archive.
## Requirements
### Requirement: Chart Data Aggregation
The system SHALL aggregate deals by status to populate the distribution chart.

#### Scenario: Agrégation par statut avec deals multiples
- **WHEN** le store contient des deals avec différents statuts
- **THEN** le système compte le nombre de deals pour chaque statut
- **AND** retourne un tableau d'objets `[{ name: 'prospect', value: 5 }, { name: 'qualifié', value: 3 }, ...]`
- **AND** inclut uniquement les statuts présents dans les données

#### Scenario: Agrégation avec zéro deals
- **WHEN** le store ne contient aucun deal
- **THEN** le système retourne un tableau vide `[]`
- **AND** le graphique affiche un message "Aucune donnée disponible"

#### Scenario: Tous les deals ont le même statut
- **WHEN** tous les deals ont le statut "prospect"
- **THEN** le système retourne un tableau avec un seul élément `[{ name: 'prospect', value: N }]`
- **AND** le graphique affiche correctement cet unique segment

### Requirement: Bar Chart Visualization
The system SHALL display a Bar Chart showing the distribution of deals by status.

#### Scenario: Affichage du Bar Chart avec données
- **WHEN** les données agrégées sont disponibles
- **THEN** le système affiche un BarChart Recharts
- **AND** l'axe X affiche les noms de statuts
- **AND** l'axe Y affiche le nombre de deals
- **AND** chaque barre a une couleur distincte basée sur le statut

#### Scenario: Responsive design du graphique
- **WHEN** la fenêtre du navigateur est redimensionnée
- **THEN** le graphique s'adapte automatiquement à la largeur du conteneur
- **AND** reste lisible sur desktop et tablette (minimum 768px)

#### Scenario: Labels et légende
- **WHEN** le graphique est affiché
- **THEN** chaque barre affiche le nombre de deals au-dessus
- **AND** une légende indique la correspondance statut/couleur
- **AND** le titre du graphique est "Répartition des Deals par Étape"

### Requirement: Alternative Donut Chart Option
The system SHALL support alternatively displaying a Donut Chart (PieChart) instead of the Bar Chart.

#### Scenario: Affichage du Donut Chart avec données
- **WHEN** les données agrégées sont disponibles
- **THEN** le système affiche un PieChart Recharts avec `innerRadius` pour effet donut
- **AND** chaque segment représente un statut avec sa proportion
- **AND** affiche les pourcentages dans ou à côté de chaque segment

#### Scenario: Tooltip sur survol
- **WHEN** l'utilisateur survole un segment du donut
- **THEN** un tooltip s'affiche montrant:
  - Le nom du statut
  - Le nombre de deals
  - Le pourcentage du total

### Requirement: Chart Component Integration
The chart SHALL be encapsulated in a reusable React component `PipelineChart.tsx`.

#### Scenario: Props du composant
- **WHEN** le composant `PipelineChart` est utilisé
- **THEN** il accepte une prop `deals: Deal[]`
- **AND** calcule automatiquement l'agrégation en interne
- **AND** gère le rendu conditionnel (données présentes vs vides)

#### Scenario: Performance avec grands datasets
- **WHEN** le nombre de deals dépasse 100
- **THEN** le graphique affiche correctement sans lag
- **AND** utilise `useMemo` pour éviter les recalculs inutiles lors des re-renders

### Requirement: Couleurs par Statut
The system SHALL assign consistent and distinct colors to each status.

#### Scenario: Palette de couleurs fixe
- **WHEN** un graphique est affiché
- **THEN** le système utilise une palette de couleurs prédéfinie:
  - `prospect`: Bleu clair (#1890ff)
  - `qualifié`: Orange (#fa8c16)
  - `négociation`: Vert (#52c41a)
  - `gagné - en cours`: Vert foncé (#389e0d)
- **AND** ces couleurs restent cohérentes même si l'utilisateur change de données

### Requirement: Empty State
The system SHALL display an appropriate empty state when no data is available.

#### Scenario: Affichage sans deals uploadés
- **WHEN** aucun CSV n'a été uploadé
- **THEN** le graphique affiche un composant `Empty` d'Ant Design
- **AND** affiche le message "Aucune donnée disponible. Veuillez uploader un fichier CSV."
- **AND** peut optionnellement afficher une icône illustrative

### Requirement: Chart Accessibility
The chart SHALL be accessible and understandable for users.

#### Scenario: Texte alternatif
- **WHEN** le graphique est rendu
- **THEN** le conteneur a un attribut `aria-label` décrivant le contenu
- **EXAMPLE**: "Graphique montrant la répartition de X deals par statut"

#### Scenario: Contraste et lisibilité
- **WHEN** le graphique est affiché
- **THEN** les couleurs ont un contraste suffisant avec le fond blanc
- **AND** les labels sont lisibles (taille de police minimum 12px)
- **AND** les axes sont clairement étiquetés

