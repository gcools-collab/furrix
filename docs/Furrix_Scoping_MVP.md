# Furrix — Scoping MVP (analyse Product Manager)

**Problème principal identifié** : un propriétaire d'animal veut trouver rapidement un autre animal compatible près de chez lui (reproduction, balade, socialisation) et échanger avec son propriétaire. C'est le seul problème que le MVP doit résoudre. Tout ce qui n'y contribue pas directement est reporté.

**Méthode** : règle 80/20 appliquée aux 6 onglets existants + à l'onboarding 4 étapes du produit actuel. Verdict fonctionnalité par fonctionnalité, sans complaisance.

---

## 1. Fonctionnalités conservées (le MVP)

| # | Fonctionnalité | Pourquoi elle est indispensable |
|---|---|---|
| 1 | **Inscription / connexion** (email) | Sans compte, pas de produit |
| 2 | **Créer le profil de son animal** — nom, espèce, race, âge, sexe, 1 photo, bio courte | Le minimum pour être "swipable" et crédible |
| 3 | **Swipe** (like / pass) | Le cœur du produit, ce qui le différencie |
| 4 | **Matching automatique** (like réciproque → match) | Sans ça, le swipe ne sert à rien |
| 5 | **Liste des matchs** | Voir ce qu'on a obtenu |
| 6 | **Chat texte simple** (1 conversation par match) | Sans échange, le match est une impasse |
| 7 | **Filtre par espèce + rayon géographique** | Rend le matching pertinent (pas de chat sans lapin à 300 km) |
| 8 | **Géolocalisation approximative** (ville, pas de carte) | Nécessaire au filtre, pas besoin de carte visuelle pour le MVP |

**8 fonctionnalités. C'est tout.**

---

## 2. Fonctionnalités supprimées (reportées) — avec justification

| Fonctionnalité (existante dans le produit actuel) | Pourquoi elle sort du MVP |
|---|---|
| **Carnet de santé complet** (vaccins, stérilisation, puce, allergies, poids, alimentation, jouet préféré) | Enrichit le profil mais ne conditionne pas le match. Un champ "vacciné oui/non" suffit si besoin ; le reste attend. |
| **Caractère détaillé** (énergie/social/propreté en barres 1-5) | Nice-to-have de personnalisation. Le score de compatibilité peut tourner sur espèce + rayon + purpose seuls. |
| **Onboarding en 4 étapes** (animal détaillé + santé + maître + vérification) | Fusionné en **1 seul écran** : juste les champs du MVP. Chaque étape en plus = abandon utilisateur en plus. |
| **Profil du maître** (ville, bio séparée) | Fusionné dans le profil animal (une seule fiche à remplir, pas deux). |
| **Vétérinaires + prise de RDV + téléconsultation** | Fonctionnalité B2B2C entière, aucun rapport avec "trouver un compagnon". Gros chantier (partenariats, planning, visio) pour zéro apport au problème n°1. |
| **Assurances** | Pareil : dépend de partenariats externes qui n'existent pas encore. Sans objet avant d'avoir des utilisateurs à monétiser. |
| **Marketplace produits** | Nécessite catalogue, paiement, logistique/partenaires. Aucun lien avec le matching. |
| **Communauté / forum / stories** | Fonctionnalité d'engagement, pas de résolution de problème. Elle retient les utilisateurs qu'on a déjà, elle n'en amène aucun. |
| **Événements** | Complexité (jauge, inscriptions, lieux) pour un usage secondaire. |
| **Carte visuelle (Mapbox)** | Le filtre "rayon + ville" suffit pour matcher. La carte est un confort visuel, pas une nécessité fonctionnelle. |
| **Alertes animaux perdus** | Service précieux mais **différent** du problème "trouver un compagnon" — c'est presque un second produit. |
| **PawPoints / XP / niveaux / streak / classement** | Système de rétention pensé pour une app mature avec du volume. Sur un MVP à 0 utilisateur, il n'y a rien à gamifier. |
| **Marketplace de récompenses partenaires** | Dépend des partenariats du plan business dev — inexistants au jour 1. |
| **Abonnement Premium / paiement IAP (RevenueCat)** | **Fusionné avec le swipe illimité** : au MVP, tout le monde swipe illimité (pas de paywall). Monétiser avant d'avoir prouvé la traction, c'est ralentir le lancement pour un revenu qui ne viendra pas encore. |
| **Notifications push** | Utile pour la rétention, pas pour le premier test du produit. Un email suffit au début (ou rien du tout). |
| **Boost de visibilité** | Fonctionnalité de monétisation avancée, sans objet sans Premium. |
| **Vérification d'identité / pedigree** | Feature de confiance pour une app à volume. Inutile à 50 premiers utilisateurs qui se connaissent souvent via le bouche-à-oreille local. |
| **Appel vidéo dans le chat** | Confort, pas nécessité. Le texte suffit pour se mettre d'accord et échanger un numéro. |
| **Suggestion d'accroche IA dans le chat** | Gadget sympa, zéro impact sur la résolution du problème. |

**Règle de fusion appliquée** : profil maître + profil animal → un seul écran. Onboarding santé/caractère → un champ minimal si nécessaire, sinon rien. Swipe + Premium → swipe illimité pour tous au MVP (pas de paywall à gérer).

---

## 3. Parcours utilisateur le plus simple possible

```
1. Ouvre l'app → Inscription (email + mot de passe)
2. Écran unique : crée le profil de son animal
   (photo, nom, espèce, race, âge, sexe, ville, bio courte)
3. Swipe (like / pass) sur les animaux compatibles à proximité
4. Match → apparaît dans "Mes matchs"
5. Tape sur un match → chat texte → échange
```

**5 écrans au total** : Connexion/Inscription · Création profil · Swipe · Liste des matchs · Chat.
Contre 6 onglets + 10+ modales dans le produit actuel. Aucun écran de paramètres avancés, aucune modale de paywall, aucune navigation à onglets multiples — juste un fil linéaire.

---

## 4. Estimation de la complexité de développement

| Brique | Complexité | Détail |
|---|---|---|
| Auth + profil animal | **Faible** | Formulaire simple + upload 1 photo (Supabase Auth + Storage) |
| Swipe + matching | **Moyenne** | Le moteur swipe existe déjà dans le prototype (drag 60fps, buildPool, computeScore) — réutilisable tel quel en le simplifiant (retirer les critères santé/caractère du score) |
| Chat texte | **Faible** | Supabase Realtime, 1 table, pas de fioritures (pas de vidéo, pas de suggestions IA) |
| Filtre espèce + rayon | **Faible** | Un `WHERE` géographique simple, pas besoin de carte |

**Complexité globale du MVP : Faible à Moyenne.**
C'est nettement plus rapide que le produit actuel car on supprime Stripe, Mapbox, les Edge Functions de paiement, le rate-limiting avancé, le système de points, et 4 des 6 onglets. Réaliste en **quelques jours** pour deux devs qui connaissent déjà la stack (vs les 3-4 semaines du produit complet).

---

## 5. Roadmap en trois étapes

### 🚀 MVP — à développer immédiatement
Les 8 fonctionnalités du §1. Objectif unique : **valider que des gens swipent, matchent et se parlent**. Rien d'autre ne compte tant que ce comportement de base n'est pas prouvé avec de vrais utilisateurs.

### 📈 V1 — après les premiers utilisateurs
À ajouter seulement si le MVP prouve la traction (des matchs se créent, des conversations démarrent) :
- Carnet de santé simplifié (vacciné, stérilisé — 2 champs)
- Caractère (énergie/sociabilité en curseurs simples)
- Notifications push (nouveau match, nouveau message)
- Carte visuelle Mapbox (remplace le filtre texte)
- PawPoints basique (streak + un seul type de récompense)
- Premium simple (swipes illimités, un seul palier de prix)

### 🏗️ V2 — fonctionnalités avancées
Tout ce qui dépend de partenariats externes ou d'un volume d'utilisateurs déjà installé :
- Vétérinaires + prise de RDV + téléconsultation
- Assurances (commissions)
- Marketplace produits
- Communauté / forum / stories
- Événements
- Alertes animaux perdus (mérite peut-être son propre produit/marque à ce stade)
- Vérification d'identité, pedigree
- Appel vidéo, suggestions IA dans le chat
- Classement, boosts, récompenses partenaires

---

## En une phrase

Le produit actuel répond à "je veux tout faire pour mon animal dans une seule app" — le MVP répond uniquement à "je veux trouver un compagnon pour mon animal, vite". C'est ce deuxième problème, plus étroit, qui doit être validé en premier. Le reste attend d'avoir des utilisateurs pour justifier l'investissement.
