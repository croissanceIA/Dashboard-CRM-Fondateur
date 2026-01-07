# csv-upload Specification

## Purpose
TBD - created by archiving change add-mvp-dashboard. Update Purpose after archive.
## Requirements
### Requirement: CSV File Upload Widget
The system SHALL provide a CSV file upload widget accessible from the main dashboard page.

#### Scenario: Upload réussi d'un fichier CSV valide
- **WHEN** l'utilisateur sélectionne un fichier CSV valide avec les colonnes requises
- **THEN** le fichier est parsé avec succès
- **AND** les données sont transformées et stockées dans le store
- **AND** un message de succès est affiché
- **AND** les KPIs et le graphique sont mis à jour

#### Scenario: Rejet d'un fichier non-CSV
- **WHEN** l'utilisateur tente de sélectionner un fichier qui n'est pas au format CSV
- **THEN** le système affiche un message d'erreur clair indiquant le format attendu
- **AND** aucune donnée n'est chargée

#### Scenario: Gestion d'un fichier CSV vide
- **WHEN** l'utilisateur upload un fichier CSV sans données (seulement les headers ou complètement vide)
- **THEN** le système affiche un message d'erreur indiquant que le fichier est vide
- **AND** aucune donnée n'est chargée

### Requirement: CSV Data Parsing
The system SHALL parse CSV files using PapaParse with automatic header detection.

#### Scenario: Parsing avec headers détectés
- **WHEN** un fichier CSV contient une ligne de headers
- **THEN** PapaParse détecte automatiquement les headers
- **AND** chaque ligne de données est convertie en objet JavaScript avec les clés correspondant aux noms de colonnes

#### Scenario: Gestion des valeurs manquantes
- **WHEN** certaines cellules du CSV sont vides
- **THEN** le système assigne des valeurs par défaut appropriées (chaîne vide pour texte, null pour dates)
- **AND** le parsing continue sans erreur

### Requirement: CSV Data Validation
The system SHALL validate that the CSV file contains all required columns before processing.

#### Scenario: Validation des colonnes requises
- **WHEN** le fichier CSV est parsé
- **THEN** le système vérifie la présence des colonnes obligatoires: `Task Name`, `Status`, `Montant Deal`
- **AND** si une colonne requise est manquante, affiche un message d'erreur listant les colonnes manquantes
- **AND** ne charge pas les données si la validation échoue

#### Scenario: Validation des valeurs de Status
- **WHEN** le fichier CSV contient des valeurs dans la colonne `Status`
- **THEN** le système vérifie que toutes les valeurs correspondent aux statuts autorisés: `prospect`, `qualifié`, `négociation`, `gagné - en cours`
- **AND** si un statut invalide est détecté, affiche un message d'erreur avec la ligne concernée
- **AND** ne charge pas les données si la validation échoue

### Requirement: Data Transformation - Task Name Parsing
The system SHALL split the `Task Name` column into two distinct columns: `Contact Name` and `Company Name`.

#### Scenario: Parsing avec format valide "Nom Prénom - Nom Entreprise"
- **WHEN** la colonne `Task Name` contient une valeur au format "Contact Name - Company Name"
- **THEN** le système split la chaîne sur le séparateur " - " (espace-tiret-espace)
- **AND** la partie avant le tiret devient `contactName`
- **AND** la partie après le tiret devient `companyName`

#### Scenario: Gestion de Task Name sans séparateur
- **WHEN** la colonne `Task Name` ne contient pas le séparateur " - "
- **THEN** le système assigne toute la valeur à `contactName`
- **AND** `companyName` est assigné à une chaîne vide
- **AND** continue le traitement sans erreur

### Requirement: Data Transformation - Type Conversion
The system SHALL convert CSV data (all strings) to appropriate TypeScript types.

#### Scenario: Conversion du montant deal en nombre
- **WHEN** la colonne `Montant Deal` contient une valeur numérique sous forme de chaîne
- **THEN** le système convertit la valeur en nombre (parseFloat)
- **AND** si la conversion échoue, assigne 0 comme valeur par défaut
- **AND** continue le traitement

#### Scenario: Conversion des dates
- **WHEN** les colonnes `Due Date`, `Date Created`, `Start Date` contiennent des valeurs de dates
- **THEN** le système convertit chaque valeur en objet Date JavaScript
- **AND** si la conversion échoue ou la valeur est vide, assigne null
- **AND** continue le traitement

### Requirement: Data Transformation - Tags Parsing
The system SHALL parse the `Tags` column to transform pipe-separated values into a string array.

#### Scenario: Parsing de tags multiples
- **WHEN** la colonne `Tags` contient "SaaS|B2B|Enterprise"
- **THEN** le système split la chaîne sur le caractère "|"
- **AND** retourne un tableau `['SaaS', 'B2B', 'Enterprise']`
- **AND** trim chaque tag pour enlever les espaces superflus

#### Scenario: Gestion de tags vides
- **WHEN** la colonne `Tags` est vide ou nulle
- **THEN** le système retourne un tableau vide `[]`
- **AND** continue le traitement

### Requirement: Store Integration
The system SHALL store parsed and transformed deals in the global Zustand store.

#### Scenario: Mise à jour du store après upload réussi
- **WHEN** les données CSV sont parsées, validées et transformées avec succès
- **THEN** le système appelle `setDeals(transformedDeals)` sur le store Zustand
- **AND** le store met à jour l'état global avec les nouveaux deals
- **AND** déclenche un re-render des composants consommant cet état

