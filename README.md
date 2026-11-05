# ☀️ HOLM Solar Optimizer Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
![Version](https://img.shields.io/github/v/release/kaaribou/holm-solar-optimizer-card)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.1%2B-03a9f4)

🇫🇷 Français · [🇬🇧 English](README.en.md)

**Une interface moderne pour [Solar Optimizer](https://github.com/jmcollin78/solar_optimizer) : le surplus en direct, les appareils pilotés, l'historique et les réglages, réunis dans une seule carte.**

Solar Optimizer reste le moteur : la carte s'appuie uniquement sur ses entités, ses actions et ses propres formulaires de configuration. Rien à installer en plus, aucune entité à créer, aucun redémarrage.

### En bref

- ⚡ **Surplus en direct** : production, consommation de la maison, revente ou achat sur le réseau, puissance pilotée par Solar Optimizer, et le prix du moment (heures pleines / heures creuses).
- 🔌 **Appareils pilotés** : état (en marche, forcé, rattrapage en heures creuses, condition non remplie, en attente du surplus…), priorité modifiable, interrupteur de pilotage automatique et bouton **Forcer** (1 h, 2 h, 4 h, 8 h ou sans limite).
- ⏱️ **Temps de marche** du jour avec une jauge entre le **minimum** et le **maximum** paramétrés, durées minimales de marche et d'arrêt, heure creuse et heure de remise à zéro.
- 📈 **Historique sur une journée** (jours précédents compris) **ou sur 7 jours** : courbes production / consommation / surplus, bandes des heures creuses, frise des périodes de marche de chaque appareil (au solaire ou en heures creuses).
- 💶 **Autoconsommation et économies** : part consommée sur place et part revendue, en kWh et en %, couverture solaire, et économies en € calculées heure par heure avec le prix réel.
- ⚙️ **Réglages des appareils** (administrateurs) : modifier tous les paramètres d'un appareil ou en **ajouter** un nouveau, avec les formulaires de Solar Optimizer lui-même. La carte signale aussi une condition d'utilisation entourée de guillemets en trop, et propose de la corriger.
- 🗂️ **Compacte** : le direct seul au départ, puis deux onglets à ouvrir d'un clic, comme sur les autres cartes HOLM : **Appareils** (avec le nombre d'appareils en marche) et **Historique**.
- 🌍 **8 langues**, thème clair et sombre, affichage mobile, éditeur visuel.

| Onglet Appareils | Onglet Historique |
|---|---|
| ![Carte HOLM Solar Optimizer](docs/images/carte.png) | ![Historique](docs/images/historique.png) |

### 🆕 Nouveautés de la 1.4.0

- 👁️ **Choisir les appareils du graphique** : sous le graphique « Appareils », un clic sur un appareil le masque ou le réaffiche, un double-clic n'affiche que lui ; la production se masque aussi, pour que l'échelle s'adapte à un petit appareil. Bouton « Tout afficher » ; le choix est retenu par le navigateur.

### Nouveautés de la 1.3.0

- 🔌 **Graphique « Appareils »** dans l'historique, affiché par défaut, à côté du graphique « Énergie » : la puissance de chaque appareil piloté, empilée sous la courbe de production (jour), ou ses kWh par jour (7 jours). Sous le graphique, la consommation de chaque appareil et sa **part solaire**.
- 📏 **Vraies mesures** : la carte trouve seule le capteur de puissance de l'appareil piloté (même appareil dans Home Assistant). Sinon, indiquez-le avec `power_sensors` ; à défaut, la consommation est estimée (puissance max × durée de marche, signalée par ≈).
- Option `history_chart` pour choisir le graphique affiché à l'ouverture.

- 📦 **Carte compacte au départ** : seul le direct s'affiche ; les onglets **Appareils** et **Historique** s'ouvrent d'un clic et se referment de la même façon. Option `default_tab` pour ouvrir un onglet d'office.
- 🏷️ **Barres légendées** : « Production : 62 % consommée sur place · 38 % revendue » et « Maison : 15 % solaire · 85 % réseau ».
- 🗂️ **Onglets** : les appareils pilotés et l'historique passent dans deux onglets, sous le direct toujours visible.
- 🧮 **Bilans identiques au tableau Énergie** : production, achat réseau, revente et autoconsommation sont lus sur les mêmes compteurs que le tableau Énergie de Home Assistant (avant : estimés à partir des puissances moyennes).
- 🔌 **Nouvelle tuile Achat réseau**, avec son coût calculé aux prix déclarés dans le tableau Énergie ; la tuile Revendu affiche le gain de la revente.

### Avec HOLM HP/HC

Si vous utilisez l'intégration **HOLM HP/HC, Tarification et abonnement**, la carte le détecte tout seul (`sensor.tarif_actuel`) : période en cours dans l'en-tête, bandes des heures creuses sur le graphique, prix de rachat et taxe de revente pour les économies. Sans lui, la carte utilise les prix d'achat et de vente déclarés dans Solar Optimizer.

---

## Installation

### Via HACS (recommandé)

1. HACS → menu ⋮ → **Dépôts personnalisés** → ajoutez `https://github.com/kaaribou/holm-solar-optimizer-card`, catégorie **Tableau de bord**.
2. Recherchez **HOLM Solar Optimizer Card** et installez.
3. Rechargez la page (Ctrl + F5).

### Manuelle

1. Copiez `holm-solar-optimizer-card.js` dans `config/www/community/holm-cards/`.
2. Paramètres → Tableaux de bord → ⋮ → **Ressources** → ajoutez `/local/community/holm-cards/holm-solar-optimizer-card.js?v=1.0.0`, type **Module JavaScript**.
3. Rechargez la page (Ctrl + F5).

Prérequis : l'intégration [Solar Optimizer](https://github.com/jmcollin78/solar_optimizer) installée et configurée (version récente, avec les actions `solar_optimizer.start_device` et `stop_device`).

## Configuration

Ajoutez la carte **HOLM – Solar Optimizer** depuis le sélecteur de cartes. Sans aucune option, elle trouve seule les appareils et les capteurs de Solar Optimizer.

```yaml
type: custom:holm-solar-optimizer-card
title: Solar Optimizer
history_mode: day      # day (journée) ou week (7 jours)
```

| Option | Description | Par défaut |
|---|---|---|
| `title` | Titre | `Solar Optimizer` |
| `language` | Langue de la carte : `fr`, `en`, `de`, `es`, `it`, `nl`, `pt`, `pl` | celle du profil |
| `show_live` | Afficher le direct | `true` |
| `show_devices` | Afficher les appareils pilotés | `true` |
| `show_history` | Afficher l'historique | `true` |
| `default_tab` | Onglet ouvert au départ : `none` (carte repliée), `devices` ou `history` | `none` |
| `history_mode` | Historique affiché à l'ouverture : `day` ou `week` | `day` |
| `history_chart` | Graphique affiché à l'ouverture : `devices` ou `energy` | `devices` |
| `power_sensors` | Capteur de puissance réel d'un appareil piloté, quand il n'est pas sur le même appareil (voir ci-dessous) | — |
| `exclude` | Appareils à masquer (`switch.solar_optimizer_…`) | — |
| `production_entity` | Capteur de production solaire (W) | celui de Solar Optimizer |
| `grid_entity` | Consommation nette (W, négative à la revente) | celle de Solar Optimizer |
| `price_entity` | Prix d'achat (€/kWh) | celui de Solar Optimizer, ou `sensor.tarif_actuel` |

L'éditeur visuel est disponible.

**Capteur de puissance d'un appareil** : la carte cherche un capteur de puissance sur le même appareil que l'entité pilotée (le chauffe-eau et son `sensor.chauffe_eau_power`, par exemple). Si la mesure vient d'une prise connectée à part, indiquez-la :

```yaml
power_sensors:
  switch.solar_optimizer_deshumidificateur: sensor.prise_deshumidificateur_power
```

## Comment ça marche

- **Le direct** : la grande tuile montre l'achat réseau, ou le surplus revendu quand les panneaux produisent plus que la maison ne consomme. Production, Maison (achat réseau + solaire consommé sur place) et Pilotés (puissance des appareils allumés par Solar Optimizer) complètent. Les deux barres répartissent la production (consommée sur place / revendue) et la consommation de la maison (solaire / réseau). Le direct lit les capteurs déclarés dans Solar Optimizer (production et consommation nette). Le surplus est la puissance revendue sur le réseau ; la consommation de la maison est l'achat réseau plus la production consommée sur place.
- **Forcer un appareil** appelle `solar_optimizer.start_device` (avec ou sans durée) ; **Arrêter** appelle `solar_optimizer.stop_device`. Pendant un forçage, Solar Optimizer désactive le pilotage automatique et le rétablit à la fin.
- **Les bilans** (production, achat, revente, autoconsommation) viennent des compteurs d'énergie déclarés dans le **tableau Énergie** de Home Assistant, par tranches de 5 minutes : ce sont les mêmes chiffres, à jour jusqu'aux 5 dernières minutes (les cartes basées sur les statistiques horaires s'arrêtent à la dernière heure terminée). Le coût de l'achat utilise les prix du tableau Énergie ; les économies additionnent l'énergie consommée sur place, au prix d'achat de l'instant, et la revente. Sans tableau Énergie, la carte se rabat sur les puissances moyennes ; la source est indiquée sous les tuiles.
- **Le graphique Appareils** additionne la puissance de chaque appareil (statistiques sur 5 minutes de son capteur). Sa part solaire est la part de la maison couverte par le solaire au même moment, appliquée à sa consommation.
- **Les courbes** viennent des statistiques de puissance sur 5 minutes (conservées 10 jours par défaut) et la frise de l'historique des appareils.
- **Les réglages** ouvrent les formulaires d'options et d'ajout de Solar Optimizer, comme dans Paramètres → Appareils et services : la carte n'écrit rien d'autre. La suppression d'un appareil reste dans Home Assistant.

## FAQ

**Je ne vois pas le bouton Réglages.** Il est réservé aux administrateurs de Home Assistant, comme les formulaires de configuration.

**L'achat réseau est un peu plus élevé que sur une autre carte.** Les cartes qui lisent les statistiques horaires ne comptent pas l'heure en cours ; la HOLM Solar Optimizer Card l'inclut.

**Le temps de marche du jour diffère de la frise.** Solar Optimizer remet ses compteurs à zéro à l'heure de remise à zéro (5 h par défaut), alors que la frise compte de minuit à minuit.

**Le graphique « 7 jours » est vide au-delà de 10 jours.** Les statistiques sur 5 minutes ne sont gardées que 10 jours par défaut (option `purge_keep_days` du recorder).

---

Fait partie de **HOLM — Home Orchestration & Living Management** : la gestion et l'orchestration intelligente de la maison.

Les autres projets : [Volets HOLM](https://github.com/kaaribou/volets-holm) · [Climat HOLM](https://github.com/kaaribou/climat-holm) · [Carburant HOLM](https://github.com/kaaribou/carburant-holm) · [Commandes à la maison HOLM](https://github.com/kaaribou/commandes-holm) · [HOLM LaMetric](https://github.com/kaaribou/lametric-holm) · [HOLM My Menu](https://github.com/kaaribou/holm-mymenu) · [HOLM Lektrico](https://github.com/kaaribou/lektrico-holm) · [HOLM GitHub](https://github.com/kaaribou/github-holm) · [HOLM Navbar Card](https://github.com/kaaribou/holm-navbar-card) · [HOLM Climate Card](https://github.com/kaaribou/climate-card-holm) · [HOLM Music Card](https://github.com/kaaribou/holm-music-card) · [HOLM Sentinel Card](https://github.com/kaaribou/holm-sentinel-card) · [HOLM Security Card](https://github.com/kaaribou/holm-security-card) · [HOLM Recordings Card](https://github.com/kaaribou/holm-recordings-card) · [HOLM Covers Card](https://github.com/kaaribou/holm-covers-card) · [HOLM Runtime Card](https://github.com/kaaribou/holm-runtime-card) · [HOLM Power Flow Card](https://github.com/kaaribou/holm-power-flow-card) · [HOLM Energy Cards](https://github.com/kaaribou/holm-energy-cards) · [HOLM Radiator Card](https://github.com/kaaribou/holm-radiator-card) · [HOLM Floor Card](https://github.com/kaaribou/holm-floor-card) · [HOLM Ecojoko Card](https://github.com/kaaribou/holm-ecojoko-card) · [HOLM Smoke Card](https://github.com/kaaribou/holm-smoke-card) · [HOLM BG Card](https://github.com/kaaribou/holm-bg-card).

Licence MIT · Non affilié à Solar Optimizer. · [☕ Offrir une bière](https://paypal.me/kaaribou)
