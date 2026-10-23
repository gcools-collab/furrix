# Assets à fournir avant le build Capacitor

Ce dossier doit contenir, avant de lancer `npx cap sync` :

- `icon.png` — 1024×1024px, sans transparence, logo Furrix seul (fond plein)
- `splash.png` — 2732×2732px, fond uni ou logo centré (couleur de fond recommandée : `#1E2420`, cohérente avec `capacitor.config.ts`)

**Ces fichiers ne peuvent pas être générés automatiquement** — ils dépendent de la charte
graphique définitive de Furrix (le logo utilisé dans l'app est actuellement une illustration
de patte SVG générique, voir `PAWS.chien` dans `src/Furrix.jsx`).

## Génération automatique de toutes les tailles

Une fois `icon.png` et `splash.png` déposés ici :

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

Cette commande génère automatiquement toutes les résolutions requises par iOS et Android
(icônes d'app, splash screens, tous les formats) à partir de ces deux fichiers sources.
