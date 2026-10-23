# Furrix — Intégration Géolocalisation & Cartes

**Objectif** : brancher la géolocalisation utilisateur, l'affichage carte, et la recherche de vétérinaires/lieux réels. Feature cœur — présente sur les onglets Découvrir (carte, perdus) et Soins (vétérinaires).

---

## 1. Vue d'ensemble — 3 briques distinctes

Il y a une confusion fréquente : ce n'est **pas une seule API**, mais 3 briques qui travaillent ensemble.

| Brique | Rôle | Fournisseur | Coût |
|---|---|---|---|
| **1. Position de l'utilisateur** | Savoir où il est | Navigateur (natif, gratuit) | 0 € |
| **2. Affichage de la carte** | Rendu visuel, zoom, markers | Mapbox | Gratuit jusqu'à 50k chargements/mois |
| **3. Données à afficher** | Vétos, animaux perdus, services | Ta base Supabase + Google Places en complément | Supabase inclus / Places ~17€/1000 requêtes |

Mapbox ne "sait" rien de tes vétérinaires. Il affiche juste une carte. C'est toi qui lui donnes les points (markers) à partir de tes propres données.

---

## 2. Brique 1 — Géolocalisation utilisateur (natif, gratuit)

Aucune API externe nécessaire. L'API `Geolocation` est intégrée à tous les navigateurs.

```js
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Géolocalisation non supportée"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 } // cache 5 min
    );
  });
}
```

### Règles UX importantes

- **Ne jamais demander la permission au chargement de l'app.** Demande-la seulement quand l'utilisateur ouvre Découvrir ou Soins — sinon 80% refusent par réflexe.
- **Toujours prévoir un fallback** : si refusé, proposer une saisie manuelle de ville (champ texte + autocomplete Mapbox, voir §4). Ne jamais bloquer l'app si l'user dit non.
- Le refus est **permanent** tant que l'utilisateur ne le change pas dans les réglages du téléphone — stocke le fallback (ville saisie) pour ne pas re-demander à chaque session.

### Stockage

```js
// Une fois obtenue, stocker dans Supabase pour éviter de redemander
await supabase.from('pets').update({ lat, lng, city }).eq('id', myPetId);
```

---

## 3. Brique 2 — Affichage carte (Mapbox)

### Setup

1. Compte sur [mapbox.com](https://mapbox.com) → Access Tokens → copier le token public (`pk.xxx`)
2. `npm install mapbox-gl`
3. Variable d'env : `VITE_MAPBOX_TOKEN=pk.xxx` (publique, c'est normal qu'elle soit dans le bundle client — Mapbox limite par domaine, pas par secret)

### Intégration React minimale

```jsx
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function VetMap({ userLat, userLng, vets }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11', // sobre, cohérent avec le design
      center: [userLng, userLat],
      zoom: 12,
    });

    // Marker utilisateur
    new mapboxgl.Marker({ color: '#1F7A5C' })
      .setLngLat([userLng, userLat])
      .addTo(mapRef.current);

    // Markers vétérinaires (données Supabase)
    vets.forEach(v => {
      new mapboxgl.Marker({ color: '#3A5BCC' })
        .setLngLat([v.lng, v.lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<b>${v.name}</b><br>${v.address}`))
        .addTo(mapRef.current);
    });

    return () => mapRef.current.remove(); // cleanup obligatoire
  }, [userLat, userLng, vets]);

  return <div ref={containerRef} style={{ width: '100%', height: 400, borderRadius: 12 }} />;
}
```

### Coût réel

Gratuit jusqu'à **50 000 chargements de carte/mois**. Pour Furrix en lancement (quelques milliers d'utilisateurs), tu es large dans le gratuit pendant des mois. Au-delà : ~5$/1000 chargements. Mets une alerte de quota dans le dashboard Mapbox pour ne pas être surpris.

---

## 4. Brique 3a — Autocomplete d'adresse (saisie manuelle de ville)

Pour le fallback quand l'user refuse la géoloc, ou pour saisir sa ville à l'inscription :

```js
async function searchCity(query) {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
    `?access_token=${MAPBOX_TOKEN}&country=fr&types=place&limit=5`
  );
  const data = await res.json();
  return data.features.map(f => ({ name: f.place_name, lat: f.center[1], lng: f.center[0] }));
}
```
Même token que la carte, même quota (inclus dans les 50k gratuits).

---

## 5. Brique 3b — Trouver les vétérinaires réels

C'est la question la plus stratégique. **Deux sources, à combiner** :

### Source A — Ta table `vets` (partenaires, prioritaire)

Les vétérinaires que tu démarches toi-même (voir le plan partenariats). Ce sont eux qui ont un vrai intérêt business à être bien référencés, qui activent la téléconsultation, qui te rapportent de la commission.

```sql
-- Requête géo simple (distance approximative, suffisant à l'échelle d'une ville)
select *, 
  sqrt(power(lat - :user_lat, 2) + power(lng - :user_lng, 2)) as distance
from vets
order by distance asc
limit 20;
```
Pour une vraie précision en km, utiliser l'extension PostGIS (`ST_Distance`) — à activer si le volume grandit.

### Source B — Google Places API (complément, couverture nationale)

Pour ne pas avoir de "trou" dans les villes où tu n'as pas encore de partenaire :

```js
// Depuis une Edge Function UNIQUEMENT (jamais côté client, clé sensible)
const res = await fetch(
  `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
  `?location=${lat},${lng}&radius=5000&type=veterinary_care&key=${GOOGLE_PLACES_KEY}`
);
const data = await res.json();
// data.results = liste de vétos avec nom, adresse, note, coordonnées
```

**Pourquoi obligatoirement via Edge Function** : la clé Google a un quota payant. Si elle est dans le bundle client (`VITE_...`), n'importe qui peut l'extraire et l'utiliser à ta place — facture pour toi, usage par un inconnu.

### La logique de fusion recommandée

```js
async function getNearbyVets(lat, lng) {
  const partners = await supabase.from('vets').select().eq('partner', true)... // tes partenaires
  const others = await fetch('/functions/v1/nearby-vets', { body: { lat, lng } }); // Google Places
  // Afficher : partenaires en premier (badge "Partenaire Furrix"), puis les autres
  return [...partners, ...others.filter(dedupeByAddress)];
}
```

Affiche toujours tes partenaires en premier avec un badge distinctif — c'est là que tu monétises (abonnement vitrine, commission téléconsult).

### Coût Google Places

~17$ pour 1000 requêtes `Nearby Search`. Pour limiter la facture : **cache le résultat** côté Supabase (table `vets_cache` avec `lat/lng arrondis + expiration 30 jours`) — la plupart des recherches se répètent sur les mêmes zones.

---

## 6. Cas d'usage par onglet

| Onglet | Ce qu'on affiche | Source |
|---|---|---|
| Découvrir → Carte | Animaux à proximité (swipe pool) | Supabase `pets` |
| Découvrir → Perdus | Alertes animaux perdus proches | Supabase `lost_pets` |
| Soins → Vétérinaires | Vétos proches | Supabase `vets` (partenaires) + Google Places (complément) |
| Soins → Associations | Refuges/SPA proches | Supabase `assos` |
| Onboarding | Ville du maître (autocomplete) | Mapbox Geocoding |

Toutes ces requêtes suivent le même schéma : position user → filtre géo côté Supabase (rapide, gratuit, illimité dans ton usage) → complément Google Places uniquement pour les vétérinaires (là où la couverture nationale compte).

---

## 7. Résumé — ce qu'il faut retenir

1. **Géoloc utilisateur** = gratuite, native, à demander au bon moment avec fallback ville.
2. **Mapbox** = affiche la carte, gratuit jusqu'à 50k vues/mois, une seule clé publique.
3. **Tes données (vétos, animaux, perdus)** = viennent de Supabase, pas de Mapbox.
4. **Google Places** = optionnel, seulement pour compléter la couverture vétérinaires hors de tes partenaires, **toujours via Edge Function** (clé secrète, jamais côté client).
5. **Tes partenaires toujours en premier** — c'est là qu'est ton revenu.

C'est une intégration d'une demi-journée à une journée pour un dev qui connaît déjà Supabase (déjà prévu dans le sprint T11 du plan 48h/du guide dev).
