# Furrix — Stratégie d'acquisition & modèle économique

**Éditeur :** Groupe Senyara — Yannis Sénéchal
**Contexte :** application mobile native iOS + Android · budget d'acquisition 0 € · lancement Hauts-de-France puis France

> Ce document remplace tous les business plans antérieurs. Les chiffrages précédents reposaient sur une grille à 7,99 € / 59,99 € et un canal de paiement web — **tous deux obsolètes**.

---

## 1. Le modèle économique réel, après commissions

Furrix est **mobile-only** : 100 % du chiffre d'affaires passe par l'In-App Purchase. La commission Apple/Google (15 % via le Small Business Program la première année de chaque abonné, 30 % au-delà) s'applique donc à **tout**.

### Revenu net par abonné

| Offre | Prix affiché | Net à 15 % | Net à 30 % |
|---|---|---|---|
| Plus mensuel | 9,99 € | 8,49 € | 6,99 € |
| Plus annuel | 74,99 € (6,25 €/mois) | 5,31 €/mois | 4,37 €/mois |
| Max mensuel | 19,99 € | 16,99 € | 13,99 € |
| Max annuel | 149,99 € (12,50 €/mois) | 10,62 €/mois | 8,75 €/mois |

**Hypothèse de mix retenue :** 75 % Plus / 25 % Max, et 40 % d'abonnements annuels (objectif, car l'annuel donne du cash immédiat et réduit le churn).

**Revenu net moyen par abonné et par mois : environ 7,50 €.**

### Objectif 10 000 €/mois net

| Indicateur | Valeur |
|---|---|
| Abonnés payants nécessaires | **~1 330** |
| Taux de conversion visé | 3 % (réaliste en B2C mature) |
| Utilisateurs actifs nécessaires | **~44 000** |
| Apport des achats ponctuels | +10 à 20 % de revenu → abaisse le seuil à **~1 150 abonnés** |

### Seuil de rentabilité

Coûts fixes : Supabase, domaine, compte Apple, Brevo → **50 à 150 €/mois**.
**Rentable à partir d'environ 15 à 20 abonnés.** C'est un seuil très bas, atteignable dès le premier mois.

---

## 2. Positionnement prix face au marché

| Acteur | Tarif mensuel |
|---|---|
| Wag! Premium (leader US pet) | 5,99 $ |
| Petme (pet sitting) | 4,99 – 5,99 $ |
| **Furrix Plus** | **9,99 €** |
| Tinder+ | 14,99 € |
| **Furrix Max** | **19,99 €** |
| Tinder Platinum | 19,99 – 37,12 € |
| Tinder Gold | 24,99 – 30,91 € |

**Lecture :** les apps animalières grand public tournent autour de 5-6 €/mois, les apps de rencontre entre 15 et 31 €. Furrix se place entre les deux — ce qui est cohérent avec un produit qui combine matching et services.

**Plus à 9,99 €** correspond exactement à la référence sectorielle citée pour un modèle d'abonnement dans le pet-tech. Bien calibré.

**Max à 19,99 €** n'est défendable **que parce qu'il vend un statut** (créer sa communauté, organiser sans limite) et non du volume. Un abonnement qui ne vendrait que « plus de boosts » ne tiendrait pas ce prix sur ce marché.

---

## 3. Pourquoi le téléchargement reste gratuit

Un prix d'entrée, même symbolique à 1 €, a été envisagé puis écarté. Les raisons, chiffrées :

| | 1 € au téléchargement | Freemium |
|---|---|---|
| Net par utilisateur | ~0,75 € **une seule fois** | 7,50 €/mois **récurrent** par abonné |
| Pour 10 000 €/mois | 13 000 téléchargements **chaque mois** | ~1 330 abonnés **acquis une fois** |
| Base d'utilisateurs | Divisée par 10 à 50 | Maximale |
| Parrainage | Mort (« invite un ami à payer ») | Moteur principal |
| Densité locale | Détruite | Préservée |

La densité locale est le **risque n°1** de Furrix : une app de matching où l'utilisateur voit trois animaux dans son rayon ne vaut rien, qu'il ait payé ou non. Le gratuit n'est pas du déchet — c'est l'infrastructure qui rend le produit utilisable pour ceux qui payent.

Aucun comparable ne fait payer le téléchargement : Tinder, Wag, Petme, Animou sont tous gratuits à l'installation.

**Pour filtrer les faux comptes**, le rate-limiting multi-clés (IP + appareil + empreinte) est déjà codé et déployable — il résout le problème sans sacrifier l'acquisition.

---

## 4. Les cinq moteurs d'acquisition à 0 €

Classés par rapport impact/effort. À activer **dans cet ordre, en cumulant**.

### Moteur 1 — Contenu vertical court (TikTok, Reels, Shorts)

Le contenu animalier est le format le plus partagé au monde. Coût zéro, portée potentiellement massive.

| Élément | Détail |
|---|---|
| Cadence | 1 à 2 vidéos/jour, 5-15 s, accroche dans la première seconde |
| Formats qui fonctionnent | Matchs réussis, sauvetage d'animal perdu via l'app, avant/après adoption, réactions de vétérinaires, coulisses du développement |
| Objectif | 1 vidéo virale sur 20 |
| CTA | « lien en bio » — installation directe |

**Démarrage immédiat, sans attendre le développement.** Le prototype peut être déployé sur une URL privée pour filmer de vraies séquences de swipe dès cette semaine.

### Moteur 2 — Communautés existantes (le raccourci)

Les futurs utilisateurs sont **déjà regroupés**. Inutile de créer une audience, il faut aller la chercher.

- Groupes Facebook régionaux « Animaux perdus/trouvés Hauts-de-France » — plusieurs dizaines de milliers de membres
- Forums de race, Reddit FR, serveurs Discord d'éleveurs et d'éducateurs

**Le cheval de Troie : la fonctionnalité animaux perdus.** Elle rend un service réel et gratuit, donc elle est accueillie au lieu d'être rejetée comme du spam. Chaque alerte relayée est une démonstration du produit.

### Moteur 3 — Boucle de parrainage

Transforme chaque utilisateur en recruteur. L'infrastructure existe déjà (PawPoints, parrainage +100 points).

- Mécanique : « Parraine un ami — vous gagnez chacun 1 mois de Plus offert »
- Objectif : coefficient viral (K-factor) > 0,5
- Amplificateur : profils d'animaux, alertes perdus et événements sont partageables — chaque partage ramène du trafic

### Moteur 4 — Partenariats gratuits

| Partenaire | Contrepartie | Ce qu'ils apportent |
|---|---|---|
| Refuges, SPA, associations | Vitrine d'adoption gratuite + fiche pro | Communauté déjà engagée, forte légitimité |
| Vétérinaires, éducateurs, pet sitters, toiletteurs | Fiche pro gratuite + QR code en salle d'attente | Trafic qualifié local |
| Micro-influenceurs animaliers (5-50k abonnés) | Max à vie + code de parrainage traçable | Portée, zéro cash avancé |
| Ambassadeurs locaux | Badge + droit de créer une communauté | Animation locale durable |

**Ne pas viser les gros comptes (900k+)** : ils ignorent les marques sans budget et convertissent mal. La tranche 5-50k abonnés est le bon terrain.

### Moteur 5 — SEO local & presse

- Pages web statiques « vétérinaire à [ville] », « animal perdu [ville] » — trafic gratuit et durable, et elles servent aussi la conformité stores
- Presse locale : angle « jeune entrepreneur des Hauts-de-France » → La Voix du Nord, presse tech FR. Un article = pic d'installations gratuit

---

## 5. Stratégie anti « application vide »

C'est la phase la plus critique, et elle se joue **avant** l'ouverture publique.

### Pré-lancement (2 à 3 semaines avant)

1. **Pré-remplir l'annuaire professionnel** — 30 à 50 fiches (vétérinaires, éducateurs, pet sitters, refuges de la métropole lilloise). L'utilisateur qui ouvre l'app doit trouver un écosystème déjà peuplé, même sans aucun autre utilisateur.
2. **Créer 3 à 5 communautés fondatrices** — par espèce et par territoire (« Chiens de Lille », « Chats du Nord »).
3. **Programmer 2 à 3 événements réels** — une balade collective suffit.
4. **Recruter 30 à 50 bêta-testeurs** via les refuges et les micro-influenceurs, avec profils animaux complets.

**Objectif : qu'aucun premier utilisateur ne tombe sur un écran vide, quel que soit l'onglet qu'il ouvre.**

### Concentration géographique

**Dominer la métropole lilloise avant d'élargir.** L'application est techniquement ouverte à toute la France, mais 100 % de l'effort d'acquisition se concentre sur un seul bassin jusqu'à atteindre la masse critique.

Mieux vaut 2 000 utilisateurs sur Lille que 2 000 dispersés sur la France : dans le premier cas le produit fonctionne, dans le second il est vide partout.

---

## 6. Trajectoire vers 10 000 €/mois

Hypothèses : conversion progressant de 2 % à 3,5 %, revenu net moyen de 7,50 € par abonné, achats ponctuels ajoutant 15 %.

| Mois | Utilisateurs actifs | Conversion | Abonnés | Revenu net | Phase |
|---|---|---|---|---|---|
| M1 | 1 500 | 2,0 % | 30 | 260 € | Lancement, bêta locale |
| M2 | 4 000 | 2,0 % | 80 | 690 € | Contenu quotidien |
| M3 | 9 000 | 2,5 % | 225 | 1 940 € | Premiers effets viraux |
| M4 | 16 000 | 3,0 % | 480 | 4 140 € | Presse + partenariats |
| M5 | 25 000 | 3,0 % | 750 | 6 470 € | Parrainage |
| M6 | 34 000 | 3,5 % | 1 190 | 10 260 € | **Objectif atteint** |
| M7 | 42 000 | 3,5 % | 1 470 | 12 680 € | Consolidation |

### Les trois scénarios

| Scénario | Condition | 10 000 € atteints en |
|---|---|---|
| Optimiste | 1 vidéo virale/mois + parrainage qui prend | 5 – 6 mois |
| **Réaliste** | Contenu régulier, croissance linéaire, partenariats actifs | **8 – 10 mois** |
| Prudent | Croissance lente, paywall à optimiser | 12 – 15 mois |

**Point de bascule : le mois 3.** Si l'application stagne sous 5 000 utilisateurs ou à 0 % de conversion, il faut corriger l'angle du contenu ou le paywall **avant** d'investir davantage en acquisition.

---

## 7. Indicateurs à piloter chaque semaine

| KPI | Pourquoi c'est vital | Cible |
|---|---|---|
| Nouveaux utilisateurs / semaine | Mesure la traction | +20 % / semaine |
| Taux d'activation (profil animal créé) | Qualité de l'onboarding | > 60 % |
| **Conversations par match** | **L'indicateur le plus important** | > 50 % |
| Conversion gratuit → payant | Le nerf de la guerre | 2 % → 3,5 % |
| Répartition Plus / Max | Validation du second palier | > 20 % Max |
| Part d'abonnements annuels | Trésorerie et churn | > 40 % |
| Churn mensuel | Abonnés perdus | < 8 % |
| K-factor | Viralité | > 0,5 |
| Revenu des achats ponctuels | Complément d'ARPU | +15 % du MRR |

**Le taux de conversation par match prime sur tout le reste.** Si les utilisateurs matchent sans se parler, le produit ne résout pas le problème et aucun volume d'acquisition ne le compensera. À surveiller dès les 50 premiers matchs.

---

## 8. Sources de revenu complémentaires

Le B2C porte l'objectif principal, mais trois leviers s'activent en parallèle sans effort de développement supplémentaire :

| Levier | Mécanique | Quand |
|---|---|---|
| **Commission téléconsultation** | 15 % sur chaque session | Dès le lancement |
| **Affiliation produits** | Zooplus (3 %), Wanimo (4-10 %), Zoomalia (5-8 %) via Awin, Netaffiliation, Affilae | Dès le lancement — simple lien tracké |
| **Affiliation assurance** | Commission par souscription (Dalma, Santévet) | Dès qu'un accord est signé |
| **Abonnement vitrine professionnel** | Forfait mensuel pour visibilité renforcée | Quand le volume le justifie |

L'affiliation ne rapporte significativement qu'avec du volume. À considérer comme un complément qui crée de la valeur perçue (bons plans) plutôt qu'un pilier de revenu au démarrage.

---

## 9. Plan d'action 90 jours

### Jours 1-30 — Fondations
1. Lancer le compte de contenu vertical : 1 vidéo/jour minimum, sans exception
2. Cartographier 20 groupes et communautés où se trouvent les utilisateurs cibles ; s'y intégrer en apportant de la valeur
3. Démarcher 30 à 50 professionnels locaux pour pré-remplir l'annuaire
4. Recruter 5 micro-influenceurs (Max à vie contre une story + code de parrainage)
5. Constituer la bêta locale (30-50 testeurs via refuges)

**Objectif fin M1 : 1 500 utilisateurs, 30 abonnés, ~260 € net.**

### Jours 31-60 — Enclenchement
6. Doubler la cadence de contenu, analyser les formats performants, répliquer
7. Signer les partenariats refuges/SPA
8. Optimiser le paywall : tester les déclencheurs (limite de swipes vs « qui m'a liké »)
9. Contacter la presse locale
10. Activer les QR codes chez les partenaires

**Objectif fin M2 : 4 000 utilisateurs, 80 abonnés, ~690 € net.**

### Jours 61-90 — Amplification
11. Capitaliser sur la première vidéo virale ou le premier article
12. Lancer le parrainage à grande échelle
13. A/B tester la mise en avant de l'annuel (objectif 40 %)
14. Activer les relances email (Brevo) sur les inactifs et les gratuits proches de la limite
15. Faire émerger les premiers animateurs de communauté (abonnés Max)

**Objectif fin M3 : 9 000 utilisateurs, 225 abonnés, ~1 940 € net.**

---

## 10. Les trois vérités à garder en tête

**1. La régularité du contenu décide de tout.** La croissance organique est plate pendant deux à trois mois, puis elle décolle. La majorité des fondateurs arrêtent avant le décollage. Tenir la cadence 90 jours avant de juger est la seule discipline qui compte.

**2. La densité locale prime sur la couverture nationale.** Une application vide dans 95 départements ne vaut rien ; une application dense sur une métropole fonctionne et se réplique ensuite ville par ville.

**3. Le coût réel n'est pas financier, il est en temps.** Le CAC est proche de zéro, mais le contenu quotidien et le démarchage partenaires sont chronophages. C'est le budget à arbitrer — en heures, pas en euros.

---

*Document de référence — Groupe Senyara. Chiffres recalculés sur le modèle mobile-only (commission IAP 15-30 %) et la grille 9,99 € / 19,99 €.*
