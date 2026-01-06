# Spécifications Techniques : Dashboard CRM "Fondateur"

## 1. Contexte et Objectif

Développer une **Single Page Application (SPA)** de suivi commercial pour un fondateur unique.
L'objectif est de maximiser deux axes : le **Volume** de deals et la **Valeur** des deals.
L'application ne nécessite pas de base de données pour l'instant (input via CSV), mais le code doit être structuré pour faciliter une migration future vers SQL.

## 2. Source de Données (Input)

L'application ingère un fichier CSV (`crm_prospects_demo.csv`) avec les colonnes suivantes :

* `Task Name` (Format : "Nom Prénom - Nom Entreprise")
* `Status` (Valeurs : prospect, qualifié, négociation, gagné - en cours)
* `Date Created`, `Due Date`, `Start Date` (Dates)
* `Assignees`, `Priority` (low, medium, high)
* `Tags` (Séparés par `|`, ex: "SaaS|B2B")
* `Task Content` (Notes textuelles)
* `Montant Deal` (Entier/Float)

## 3. Règles Métier & Data Engineering

### A. Nettoyage des Données (Processing)

1. **Parsing Identité :** Séparer la colonne `Task Name` en deux nouvelles colonnes :
* `Contact Name` (Partie avant le tiret " - ")
* `Company Name` (Partie après le tiret)


2. **Typage :**
* Convertir `Montant Deal` en numérique.
* Convertir `Due Date` en objet Date.
* Gérer les valeurs nulles pour les dates (pour éviter les crashs).


3. **Tags :** Parser la colonne `Tags` pour transformer "A|B" en liste `['A', 'B']`.

### B. Configuration des Probabilités (Pour V1)

Le code doit définir un dictionnaire de probabilités centralisé :

* `prospect` : 10%
* `qualifié` : 40%
* `négociation` : 75%
* `gagné - en cours` : 100%

### C. Calculs des KPIs

* **Pipeline Brut (€) :** Somme de `Montant Deal` (tous statuts sauf perdus).
* **Pipeline Pondéré / Weighted Pipeline (€) :** Somme de (`Montant Deal` x `Probabilité du statut`).
* **Panier Moyen / Average Deal Size (€) :** `Pipeline Brut` / `Nombre de deals actifs`.

---

## 4. Roadmap de Développement

### Phase 1 : MVP ("La Météo du Business")

*Objectif : Vue macro immédiate. Pas de tableau de données.*

1. **Upload CSV :** Widget d'upload fichier.
2. **Affichage des KPIs Macro :**
* **Volume du Pipeline** (Nombre de deals actifs).
* **CA Total Pipeline Brut** (Somme totale sans pondération).
* **Panier Moyen** (Indicateur de valeur).


3. **Visualisation :**
* Un graphique simple (Bar Chart ou Donut) montrant la **Répartition des deals par Étape** (Status).



### Phase 2 : V1 ("L'Outil de Pilotage")

*Objectif : Intelligence et gestion opérationnelle.*

1. **Mise à jour KPIs :** Ajout du **CA Prévisionnel (Weighted Pipeline)** calculé avec les probabilités.
2. **Focus List (Top 5) :** Petit tableau affichant les 5 deals ayant la plus forte **Valeur Pondérée**.
3. **Tableau Complet (Data Grid) :**
* Affichage de toutes les données nettoyées.
* **Tri :** Colonnes triables (click-to-sort).
* **Recherche :** Barre de recherche textuelle globale.
* *Note : Pas de filtres déroulants ici.*


4. **Alertes :** Compteur visuel des tâches dont la `Due Date` est passée.
5. **Drill-down :** Possibilité de voir le détail complet (Notes/Tags) d'un deal.

### Phase 3 : V2 ("L'Explorateur")

*Objectif : Analyse fine.*

1. **Filtres Avancés :** Ajout de menus déroulants au-dessus du tableau (Filtrer par Status, Priority, Tags).
2. **Export :** Bouton pour télécharger le CSV nettoyé et enrichi.
3. **Feedback Visuel :** Indicateurs de variation sur les KPIs (ex: évolution du panier moyen).
