<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

## Aperçu de l'Objectifs du Projet

Développer une **Single Page Application (SPA)** de suivi commercial pour un fondateur unique. L'objectif est de maximiser deux axes : le **Volume** de deals et la **Valeur** des deals.

L'application ingère des données CSV côté client et affiche des KPIs business essentiels (pipeline brut, pipeline pondéré, panier moyen) avec des visualisations interactives. Le code doit être structuré pour faciliter une migration future vers une base de données SQL.

**Roadmap :**
- **Phase 1 (MVP)** : Vue macro immédiate avec KPIs de base et graphique de répartition
- **Phase 2 (V1)** : Intelligence et gestion opérationnelle (CA prévisionnel, top 5 deals, tableau complet)
- **Phase 3 (V2)** : Analyse fine avec filtres avancés et export CSV

---

## Aperçu de l'Architecture Globale

**Stack Technique :**
- **Frontend** : Next.js 15 + React 19 + TypeScript 5.7+
- **UI Library** : Ant Design 5.22+ (composants business) + Tailwind CSS 3.x (customisations)
- **Visualisations** : Recharts 2.15+
- **State Management** : Zustand 5.x
- **Parsing CSV** : PapaParse 5.4+
- **Testing** : Vitest (unit) + Testing Library (components) + Playwright (E2E)
- **Deployment** : Vercel

**Structure du Projet :**
```
├── app/                    # Next.js App Router (pages et routing)
├── components/             # Composants React organisés par domaine
│   ├── dashboard/          # KPIs, charts, alertes
│   ├── deals/              # Table, filtres, détails
│   └── shared/             # CSV uploader, search, export
├── lib/                    # Logique métier (processing, calculs, types)
├── store/                  # Zustand stores (état global)
├── __tests__/              # Tests unitaires, composants, E2E
└── public/                 # Assets statiques et fichier CSV de démo
```

**Principes Architecturaux :**
1. **Separation of Concerns** : UI / Logique métier / État
2. **Type Safety First** : TypeScript strict mode
3. **Component Composition** : Composants petits et réutilisables
4. **Business Logic Centralisée** : Calculs KPIs isolés et testables

---

## Style Visuel

- Interface claire et minimaliste
- Pas de mode sombre pour le MVP
- Design professionnel adapté aux dashboards business
- Utilisation de la palette Ant Design par défaut
- Responsive design pour desktop et tablette

---

## Contraintes et Politiques

### Sécurité
- **NE JAMAIS exposer les clés API au client**
- Toutes les clés sensibles doivent être stockées côté serveur uniquement
- Utiliser les variables d'environnement avec le préfixe `NEXT_PUBLIC_` UNIQUEMENT pour les valeurs non sensibles

### Code Quality
- TypeScript strict mode obligatoire
- Pas de `any` types sauf cas exceptionnels documentés
- Préférer la composition à l'héritage
- Éviter l'over-engineering : garder les solutions simples et focalisées

---

## Dépendances

- **Préférer les composants existants** plutôt que d'ajouter de nouvelles bibliothèques UI
- Utiliser Ant Design pour tous les composants business (Table, Upload, Statistic, etc.)
- Utiliser Tailwind uniquement pour les customisations rapides et le responsive
- Avant d'ajouter une nouvelle dépendance, vérifier si la fonctionnalité existe déjà dans la stack

---

## Avant de Pusher vers Github

- **Tester avec playwright-skill** : L'interface doit être responsive et fonctionnelle
- Vérifier que tous les tests passent (`npm run test` + `npm run test:e2e`)
- Exécuter le linter (`npm run lint`)
- Formatter le code (`npm run format`)
- Vérifier le build production (`npm run build`)
- S'assurer qu'aucune clé API ou secret n'est committée

---

## Documentation

Pour les spécifications complètes du projet, consulter :

- **[@PRD.md](./PRD.md)** - Spécifications fonctionnelles et règles métier
- **[@ARCHITECTURE.md](./ARCHITECTURE.md)** - Architecture technique détaillée

---

## Context7

**Utilisation automatique de Context7** : Utilise toujours les outils MCP Context7 pour résoudre l'identifiant de bibliothèque et obtenir la documentation à jour lorsque tu as besoin de :
- Génération de code avec une bibliothèque spécifique
- Étapes de configuration ou d'installation
- Documentation d'API ou de bibliothèque
- Exemples de code pour une fonctionnalité

Tu dois automatiquement utiliser les outils MCP Context7 (`resolve-library-id` puis `query-docs`) sans que l'utilisateur ait à le demander explicitement.

---

## Langue et Spécifications

**Toutes les spécifications doivent être rédigées en français**, y compris :
- Les specs OpenSpec (sections Purpose et Scenarios)
- La documentation technique
- Les commentaires de code importants
- Les messages de commit

**Exception** : Les titres de Requirements dans OpenSpec doivent rester en anglais avec les mots-clés SHALL/MUST pour la validation OpenSpec.