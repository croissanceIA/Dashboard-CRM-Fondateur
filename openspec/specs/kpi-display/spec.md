# kpi-display Specification

## Purpose
TBD - created by archiving change add-mvp-dashboard. Update Purpose after archive.
## Requirements
### Requirement: KPI Calculation - Pipeline Volume
The system SHALL calculate the total number of active deals in the pipeline.

#### Scenario: Calcul du volume avec deals multiples
- **WHEN** le store contient une liste de deals
- **THEN** le système compte le nombre total de deals
- **AND** retourne ce nombre comme KPI "Volume du Pipeline"

#### Scenario: Calcul du volume avec zéro deals
- **WHEN** le store ne contient aucun deal
- **THEN** le système retourne 0 comme "Volume du Pipeline"
- **AND** n'affiche pas d'erreur

### Requirement: KPI Calculation - Pipeline Brut
The system SHALL calculate the total pipeline amount by summing all deal amounts.

#### Scenario: Calcul du CA total avec deals multiples
- **WHEN** le store contient des deals avec des montants [1000, 2000, 3000]
- **THEN** le système somme tous les montants
- **AND** retourne 6000 comme "CA Total Pipeline Brut"

#### Scenario: Calcul avec zéro deals
- **WHEN** le store ne contient aucun deal
- **THEN** le système retourne 0 comme "CA Total Pipeline Brut"
- **AND** n'affiche pas d'erreur

### Requirement: KPI Calculation - Panier Moyen
The system SHALL calculate the average deal size by dividing the gross pipeline by the number of deals.

#### Scenario: Calcul du panier moyen avec deals multiples
- **WHEN** le pipeline brut est de 6000€ et il y a 3 deals
- **THEN** le système calcule 6000 / 3
- **AND** retourne 2000 comme "Panier Moyen"

#### Scenario: Gestion de la division par zéro
- **WHEN** le store ne contient aucun deal (nombre de deals = 0)
- **THEN** le système retourne 0 comme "Panier Moyen"
- **AND** ne génère pas d'erreur de division par zéro

### Requirement: KPI Display Component
The system SHALL display KPIs in clear and readable visual cards.

#### Scenario: Affichage des 3 KPIs macro
- **WHEN** les KPIs sont calculés avec succès
- **THEN** le système affiche 3 cartes distinctes:
  - Carte 1: "Volume du Pipeline" avec le nombre de deals
  - Carte 2: "CA Total Pipeline Brut" avec le montant formaté en euros
  - Carte 3: "Panier Moyen" avec le montant moyen formaté en euros
- **AND** chaque carte utilise le composant `Statistic` d'Ant Design

#### Scenario: Formatage des montants en euros
- **WHEN** un KPI monétaire est affiché (CA Total, Panier Moyen)
- **THEN** le système formate le nombre avec le séparateur de milliers (espace)
- **AND** ajoute le symbole "€" après le nombre
- **AND** affiche 2 décimales pour le Panier Moyen
- **EXAMPLE**: 125000 devient "125 000 €", 2976.19 devient "2 976,19 €"

#### Scenario: Mise à jour réactive des KPIs
- **WHEN** de nouvelles données sont uploadées via le CSV
- **THEN** les KPIs sont recalculés automatiquement
- **AND** les cartes se mettent à jour sans rechargement de page
- **AND** la transition est fluide (pas de flash)

### Requirement: KPI Calculation Logic Isolation
KPI calculations SHALL be isolated in a dedicated module `lib/kpiCalculations.ts` for testability.

#### Scenario: Fonction pure pour calculs
- **WHEN** la fonction `calculateKPIs(deals: Deal[])` est appelée
- **THEN** elle retourne un objet `KPIs` avec les 3 métriques calculées
- **AND** ne mute pas l'array de deals en entrée
- **AND** est testable de manière unitaire sans dépendance au store

#### Scenario: Réutilisabilité des calculs
- **WHEN** les calculs KPIs sont nécessaires dans différents contextes (composants, tests)
- **THEN** le même module `lib/kpiCalculations.ts` peut être importé partout
- **AND** garantit la cohérence des calculs dans toute l'application

### Requirement: État de Chargement
The system SHALL display an appropriate loading state before data is available.

#### Scenario: Affichage initial sans données
- **WHEN** l'utilisateur arrive sur la page dashboard sans avoir uploadé de CSV
- **THEN** les cartes KPIs affichent des valeurs par défaut (0 ou "-")
- **AND** un message guide l'utilisateur vers l'upload CSV

#### Scenario: Feedback pendant le parsing
- **WHEN** un fichier CSV est en cours de parsing
- **THEN** les cartes KPIs affichent un indicateur de chargement (skeleton ou spinner)
- **AND** passent à l'affichage des valeurs calculées une fois le parsing terminé

