# Furrix — Cahier des Charges Produit (version non technique)

**Projet :** Furrix — application mobile tout-en-un pour la vie animale
**Éditeur :** Groupe Senyara — Yannis Sénéchal
**Développement :** Guillaume Cools

> Ce document décrit **le produit et les décisions**, sans entrer dans la technique.
> La version technique complète (schéma de base de données, architecture, code) est dans `Furrix_CDC_Produit_Technique.md`.

---

## 1. Ce qu'est Furrix

**Furrix est l'application tout-en-un de la vie animale.** Le matching entre animaux en est la porte d'entrée — c'est ce qui attire et ce qui fait revenir — mais le produit couvre l'ensemble des besoins du propriétaire.

**Ce que Furrix n'est pas :** un simple « Tinder pour animaux ». Le matching est un moteur, pas la finalité.

**Formulation de référence :** *l'écosystème complet du maître animalier, dont la rencontre est la première porte.*

**Pourquoi c'est différenciant :** tous les concurrents font une seule chose. Animou et Lost'Him font les animaux perdus. Santévet fait l'assurance. Paranu fait le matching seul. Personne ne réunit matching, soins, communauté et services dans un même produit.

---

## 2. À qui ça s'adresse

| Public | Description |
|---|---|
| **Particuliers** | Propriétaires d'animaux, 18 ans minimum |
| **Professionnels** | Vétérinaires, éducateurs, pet sitters, toiletteurs, éleveurs, assurances |
| **Associations** | SPA, refuges, associations d'adoption |
| **Ambassadeurs** | Créateurs de contenu et relais locaux |

**Âge minimum : 18 ans.** Décision ferme — l'application met des inconnus en relation et organise des rencontres réelles.

---

## 3. Quels animaux

**Tous les animaux de compagnie**, sans limitation : chiens, chats, lapins, oiseaux, rongeurs, reptiles, chevaux, animaux de ferme, et tout ce qui viendra ensuite.

Chiens et chats seront majoritaires dans les faits, et c'est sur eux que portera la communication — parce que ce sont eux qui créent la densité locale nécessaire au bon fonctionnement du matching. Mais l'application ne les privilégie pas techniquement.

---

## 4. Les fonctionnalités au lancement

Tout ce qui suit doit être opérationnel dès la sortie. **Il n'y a pas de découpage en phases.**

### Le matching
Découverte de profils à proximité, swipe, likes, matchs, filtres par espèce et par rayon, messagerie entre utilisateurs matchés.

### Les profils animaux
Création et gestion, photos, caractéristiques, bio. Un utilisateur gratuit a un animal, un abonné en a plusieurs.

### La communauté
Communautés thématiques et locales que l'on rejoint (par espèce, par territoire), avec publications, discussions, signalement et modération.

### Les animaux perdus
Déclaration d'une perte, alerte géolocalisée aux utilisateurs proches, consultation des alertes, passage en « retrouvé ».

*Positionnement assumé : version simple. Le marché est occupé par des acteurs spécialisés avec reconnaissance photo par IA. Furrix ne les concurrence pas frontalement — la brique sert la cohérence de l'écosystème pour nos propres utilisateurs.*

### Les événements
Découverte, création et inscription à des événements animaliers (balades, rencontres, concours).

### Les professionnels
Annuaire complet avec fiches détaillées, carte, coordonnées, services. Les professionnels créent eux-mêmes leur fiche, Furrix la valide avant publication.

### La santé
Annuaire vétérinaire, prise de rendez-vous, téléconsultation vidéo, carnet de santé numérique par animal.

### Ce qui est exclu du lancement
**La marketplace de produits.** C'est la seule fonctionnalité explicitement hors périmètre.

---

## 5. La reproduction

**Décision ferme : la reproduction n'est jamais mise en avant.**

Elle n'apparaît ni dans la communication, ni comme fonctionnalité centrale, ni comme parcours utilisateur. Les mentions actuellement présentes dans l'application (filtre, catégorie, badge, hashtag) sont à retirer.

**Le produit se centre sur :** la vie animale, les rencontres, les interactions sociales, les communautés, les services, la santé, les professionnels, les événements, la sécurité et le bien-être animal.

**Cadre juridique (déjà rédigé, Art. 2 des CGU) :** Furrix est une plateforme de **mise en relation**. Furrix ne vend, ne loue et ne fait commerce d'aucun animal. Toute décision de reproduction et le respect des obligations légales associées relèvent exclusivement des utilisateurs.

**Trois règles à ne jamais enfreindre :**
1. Furrix ne perçoit jamais d'argent sur une vente d'animal ou de portée
2. Aucune annonce de type « chiot à vendre » ne doit pouvoir être publiée
3. Le mot « vente » n'apparaît jamais dans l'application en lien avec un animal

---

## 6. Le modèle économique

**Téléchargement gratuit.** Pas de prix d'entrée sur les stores — un péage, même symbolique, diviserait les installations par 10 à 50 et détruirait la densité locale dont le produit a besoin.

**Structure : gratuit + deux abonnements + achats ponctuels.**

### L'offre gratuite

| | Gratuit |
|---|---|
| Profil animal | **1 animal** |
| Swipes | **5 par jour** |
| Messagerie avec ses matchs | Illimitée |
| Communautés | Rejoindre, publier |
| Animaux perdus | Consulter, déclarer |
| Événements | Consulter, s'inscrire, **créer 1 par mois** |
| Annuaire professionnel | Complet |
| Carnet de santé | 1 animal |
| Voir qui m'a liké | Compteur visible, profils floutés |

*Principe : le gratuit ne bride jamais la valeur de découverte ni l'utilité sociale. Il bride l'usage intensif du matching — c'est le seul levier de conversion qui fonctionne durablement.*

### Furrix Plus — 9,99 €/mois ou 74,99 €/an

Pour l'utilisateur régulier qui veut lever les limites du matching.

- Swipes illimités
- **Voir qui m'a liké** (profils révélés)
- 3 animaux
- Rayon élargi jusqu'à 100 km
- Filtres avancés
- 1 boost offert par mois
- 3 événements créés par mois
- Outils d'organisateur
- PawPoints doublés

### Furrix Max — 19,99 €/mois ou 149,99 €/an

Pour le propriétaire multi-animaux et l'organisateur local.

- Tout Furrix Plus
- **Animaux illimités**
- **Créer ses propres communautés** — droit exclusif
- Événements illimités + 1 mise en avant offerte par mois
- 4 boosts et 5 super likes par mois
- Visibilité renforcée dans la découverte
- Carnet de santé : export PDF et rappels de vaccins
- Support prioritaire

### Les achats ponctuels

| Produit | Prix |
|---|---|
| 1 boost (1ʳᵉ position 30 min) | 2,99 € |
| Pack de 5 boosts | 9,99 € |
| 5 super likes | 4,99 € |
| 20 super likes | 14,99 € |
| Mise en avant d'un événement (7 jours) | 9,99 € |
| Visibilité locale 24 h | 4,99 € |
| Crédit téléconsultation | selon tarif du vétérinaire |

### Deux règles de cohérence

**1. Les PawPoints ne débloquent jamais une fonctionnalité payante.** Ils récompensent l'engagement avec des avantages partenaires, des badges et un boost découverte ponctuel. Si les points permettaient d'obtenir gratuitement ce que vend l'abonnement, personne ne paierait.

**2. On vend l'accès et la visibilité, pas la quantité.** C'est pour ça que créer une communauté est réservé à Max — c'est une position durable, on devient l'animateur d'un groupe local. Créer un événement reste accessible à tous, parce qu'il faut remplir l'application.

---

## 7. Positionnement prix face au marché

| Acteur | Prix mensuel |
|---|---|
| Wag! Premium (leader US pet) | 5,99 $ |
| Petme | 4,99 – 5,99 $ |
| **Furrix Plus** | **9,99 €** |
| Tinder+ | 14,99 € |
| **Furrix Max** | **19,99 €** |
| Tinder Platinum | 19,99 – 37,12 € |

Les apps animalières tournent autour de 5-6 €/mois, les apps de rencontre entre 15 et 31 €. Furrix se place entre les deux, ce qui est cohérent avec un produit qui combine matching et services.

Plus à 9,99 € correspond à la référence sectorielle. Max à 19,99 € n'est défendable **que parce qu'il vend un statut** (créer sa communauté, organiser sans limite) et non du volume.

**Point de vigilance :** Wag justifie son abonnement par une économie chiffrable. À terme, Max devra intégrer un avantage financier mesurable — remise sur les téléconsultations, frais de rendez-vous offerts, ou réduction chez les partenaires.

---

## 8. Professionnels et partenaires

Furrix est principalement B2C, mais construit dès le lancement un véritable écosystème professionnel.

**Comment ça marche :** le professionnel crée lui-même sa fiche (catégorie, activité, services, adresse, coordonnées, horaires, espèces prises en charge). La fiche reste **invisible tant que Furrix ne l'a pas validée** — sans ce garde-fou, n'importe qui pourrait publier une fausse fiche vétérinaire.

**Règle commerciale essentielle :** les partenaires doivent **toujours apparaître avant** les autres dans les listes et sur la carte, avec un badge distinctif. C'est ce qui donne de la valeur au partenariat — sans priorité d'affichage, il n'y a rien à vendre.

**Catégories prévues :** vétérinaires, éducateurs, pet sitters, toiletteurs, associations, refuges, ambassadeurs, assurances, éleveurs.

**Téléconsultation :** vendue **à l'acte uniquement**, jamais incluse dans un abonnement. Le vétérinaire fixe son tarif, Furrix prélève 15 %. Chaque session a une durée limitée avec coupure automatique. *Zéro risque de marge : Furrix ne paie jamais plus qu'elle n'encaisse.*

---

## 9. Lancement et acquisition

**Disponibilité :** toute la France dès le lancement, sur iOS et Android simultanément.

**Commercialisation :** concentrée sur la métropole lilloise. Mieux vaut 2 000 utilisateurs sur Lille que 2 000 dispersés sur la France — dans le premier cas le produit fonctionne, dans le second il est vide partout.

### Éviter l'effet « application vide »

C'est la phase la plus critique, et elle se joue **avant** l'ouverture publique :

1. **Pré-remplir l'annuaire** — 30 à 50 fiches professionnelles de la métropole lilloise
2. **Créer 3 à 5 communautés fondatrices** par espèce et par territoire
3. **Programmer 2 à 3 événements réels** — une balade collective suffit
4. **Recruter 30 à 50 bêta-testeurs** via les refuges et les micro-influenceurs, avec profils animaux complets

**Objectif : qu'aucun premier utilisateur ne tombe sur un écran vide, quel que soit l'onglet qu'il ouvre.**

### Les cinq moteurs d'acquisition à 0 €

1. **Contenu vertical quotidien** (TikTok, Reels) — 1 à 2 vidéos par jour
2. **Communautés existantes** — groupes Facebook locaux, la fonctionnalité animaux perdus sert de porte d'entrée légitime
3. **Parrainage** — 1 mois offert de chaque côté
4. **Partenariats gratuits** — refuges, vétérinaires, micro-influenceurs (5-50k abonnés)
5. **SEO local et presse régionale**

*Détail complet dans `Furrix_Strategie_Acquisition.md`.*

---

## 10. Ce qu'est un lancement réussi

**Rentabilité :** les coûts fixes sont de 50 à 150 €/mois. **Rentable dès 15 à 20 abonnés.**

**À 30 jours :**

| Indicateur | Cible |
|---|---|
| Utilisateurs inscrits | 500 – 1 500 |
| Profil animal créé | > 60 % des inscrits |
| Matchs | 200+ |
| Conversations démarrées | 100+ |
| Abonnés payants | 15 – 40 |
| Partenaires professionnels | 5 – 10 |

**À 90 jours :** ~9 000 utilisateurs, ~225 abonnés, ~1 900 €/mois net.

**L'indicateur le plus important : le taux de conversation par match.** Si les utilisateurs matchent sans se parler, le produit ne résout pas le problème — et aucun volume d'acquisition ne le compensera. À surveiller dès les 50 premiers matchs.

---

## 11. Réponses aux questions de Guillaume

### Balade, socialisation ou reproduction : les trois au même niveau ?
**Non.** Balade et socialisation portent le volume et la communication. La reproduction n'est jamais mise en avant (voir §5).

### Parcours minimal ou tous les modules dès le lancement ?
**Tous les modules dès le lancement.** Pas de découpage en phases. Vétérinaires, téléconsultation, communauté, événements, animaux perdus, carnet de santé et espace professionnel sont dans le périmètre. **Seule la marketplace est exclue.**

### Quelle est la vision exacte ?
**Application tout-en-un autour de la vie de l'animal.** Le matching est la porte d'entrée et le moteur d'engagement, pas la finalité.

### La reproduction au lancement ? Principale ou secondaire ? (volet juridique)
**Présente techniquement, jamais mise en avant.** Le cadre juridique existe déjà (Art. 2 des CGU) et reste valable. Le repositionnement le renforce même. Voir §5 pour les trois règles à ne jamais enfreindre.

### Tous les animaux ou chiens et chats d'abord ?
**Tous**, sans limitation technique. Nuance commerciale : l'acquisition cible chiens et chats en priorité, car ce sont eux qui créent la densité locale.

### Zone de lancement ?
**Toute la France techniquement, Hauts-de-France commercialement.** Aucune restriction géographique dans l'application — le filtre est un rayon en kilomètres.

### Comment éviter l'effet « application vide » ?
Voir §9. En résumé : annuaire pré-rempli, communautés et événements fondateurs, bêta locale de 30-50 testeurs, et les cinq moteurs d'acquisition activés **avant** l'ouverture.

### Monétiser dès le lancement ? Quels tarifs ?
**Dès le lancement.** C'est le seul moyen de savoir si le modèle convertit.

⚠️ **La grille 7,99 € / 59,99 € est OBSOLÈTE** — elle subsiste dans d'anciens documents Word. **La grille valide est 9,99 € / 74,99 € pour Plus et 19,99 € / 149,99 € pour Max.** Détail complet en §6.

### PWA d'abord ou natif direct ? Le design est-il conservé ?
**Natif direct iOS + Android.** Pas de version web de vente — conséquence assumée : 100 % du chiffre d'affaires passe par les achats intégrés Apple/Google, avec leur commission de 15 à 30 %.

Seule exception : une page web statique pour les mentions légales, **obligatoire** pour la soumission aux stores.

**Le design actuel est la référence principale, pas une maquette jetable.** Il a déjà reçu une passe complète sur la conversion et l'accessibilité. Le temps disponible doit aller au branchement des données, pas à un redesign. Les seuls changements validés sont les 8 points listés dans le CDC technique §13.

*Ce qui n'existe pas encore : le branding visuel définitif (logo, icône, splash screen). Le logo actuel est une illustration générique.*

### Priorités business après le matching ?
1. Vétérinaires (annuaire + rendez-vous) — porte d'entrée du B2B
2. Téléconsultation — valeur perçue élevée, commission immédiate
3. Animaux perdus — fort en acquisition, faible en revenu direct
4. Communauté — moteur de rétention
5. Événements — ancrage local
6. Assurances — meilleur ratio revenu/effort une fois le volume atteint
7. Carnet de santé — confort, pas de revenu direct
8. Marketplace — **hors périmètre**

### B2C seul ou espace professionnel dès le départ ?
**Les deux, dès le lancement**, en self-service avec validation. Voir §8.

### Plusieurs animaux dès la V1 ? Matching indépendant par animal ?
**Oui aux deux.** Gratuit = 1 animal, Plus = 3, Max = illimité. Chaque animal a son propre profil et son propre matching.

*Bonne nouvelle technique : la base de données supporte déjà cette logique sans modification. Le travail est côté interface.*

### Qu'est-ce qu'un lancement réussi ?
Voir §10. Rentable dès 15-20 abonnés ; objectif à 30 jours : 500-1 500 utilisateurs, 200+ matchs, 15-40 abonnés.

---

## 12. Le point à arbitrer ensemble

Le périmètre décrit dans ce document représente environ **43 à 45 jours de développement**, soit **10 à 12 semaines** pour un développeur seul — et non 3 semaines.

Ce document ne tranche pas et ne reporte rien en « phase 2 ». Trois leviers existent :
1. **Allonger le délai**
2. **Ajouter une ressource** en renfort
3. **Réduire le périmètre** de lancement

**Si le périmètre doit être réduit**, les chantiers les plus coûteux sont, dans l'ordre : l'espace professionnel self-service (6-7 jours), le second abonnement avec achats ponctuels (3 jours), les communautés (2 jours), la téléconsultation (2 jours) et le multi-animaux (2 jours).

**Ce qui n'est jamais négociable**, quel que soit l'arbitrage : le signalement de contenu, le blocage d'utilisateur, la suppression de compte dans l'application et les pages légales en ligne. Ce sont des **exigences Apple et Google** — sans elles, l'application est refusée à la soumission, quel que soit le reste.

---

*Document de référence produit — Groupe Senyara. Version technique complète : `Furrix_CDC_Produit_Technique.md`.*
