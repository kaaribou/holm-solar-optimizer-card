# ☀️ HOLM Solar Optimizer Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
![Version](https://img.shields.io/github/v/release/kaaribou/holm-solar-optimizer-card)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.1%2B-03a9f4)

[🇫🇷 Français](README.md) · 🇬🇧 English

**A modern interface for [Solar Optimizer](https://github.com/jmcollin78/solar_optimizer): live surplus, managed devices, history and settings, all in one card.**

Solar Optimizer stays the engine: the card only uses its entities, its actions and its own configuration forms. Nothing else to install, no entity to create, no restart.

### At a glance

- ⚡ **Live surplus**: production, home consumption, grid export or import, power managed by Solar Optimizer, and the current price (peak / off-peak).
- 🔌 **Managed devices**: state (running, forced, off-peak catch-up, condition not met, waiting for surplus…), editable priority, automatic-control switch and a **Force** button (1 h, 2 h, 4 h, 8 h or no limit).
- ⏱️ **Today's run time** with a gauge between the configured **minimum** and **maximum**, minimum on and off durations, off-peak time and daily reset time.
- 📈 **History for one day** (previous days included) **or 7 days**: production / consumption / surplus curves, off-peak bands, a timeline of each device's runs (solar or off-peak).
- 💶 **Self-consumption and savings**: share used on site and share sold, in kWh and %, solar coverage, and savings in € computed with the real price at each moment.
- ⚙️ **Device settings** (administrators): edit every setting of a device or **add** a new one, using Solar Optimizer's own forms. The card also flags a usability condition wrapped in extra quotes and offers to fix it.
- 🌍 **8 languages**, light and dark themes, mobile layout, visual editor.

| Live and devices | Today's history |
|---|---|
| ![HOLM Solar Optimizer card](docs/images/carte.png) | ![History](docs/images/historique.png) |

### With HOLM HP/HC

If you use the **HOLM HP/HC, Tarification et abonnement** integration, the card detects it on its own (`sensor.tarif_actuel`): current period in the header, off-peak bands on the chart, feed-in price and resale tax for the savings. Without it, the card uses the buy and sell prices set in Solar Optimizer.

---

## Installation

### Through HACS (recommended)

1. HACS → ⋮ menu → **Custom repositories** → add `https://github.com/kaaribou/holm-solar-optimizer-card`, category **Dashboard**.
2. Search for **HOLM Solar Optimizer Card** and install it.
3. Reload the page (Ctrl + F5).

### Manual

1. Copy `holm-solar-optimizer-card.js` to `config/www/community/holm-cards/`.
2. Settings → Dashboards → ⋮ → **Resources** → add `/local/community/holm-cards/holm-solar-optimizer-card.js?v=1.0.0`, type **JavaScript module**.
3. Reload the page (Ctrl + F5).

Requirement: the [Solar Optimizer](https://github.com/jmcollin78/solar_optimizer) integration installed and configured (a recent version, with the `solar_optimizer.start_device` and `stop_device` actions).

## Configuration

Add the **HOLM – Solar Optimizer** card from the card picker. With no option at all, it finds Solar Optimizer's devices and sensors on its own.

```yaml
type: custom:holm-solar-optimizer-card
title: Solar Optimizer
history_mode: day      # day or week (7 days)
```

| Option | Description | Default |
|---|---|---|
| `title` | Title | `Solar Optimizer` |
| `language` | Card language: `fr`, `en`, `de`, `es`, `it`, `nl`, `pt`, `pl` | the profile's |
| `show_live` | Show the live section | `true` |
| `show_devices` | Show the managed devices | `true` |
| `show_history` | Show the history | `true` |
| `history_mode` | History shown first: `day` or `week` | `day` |
| `exclude` | Devices to hide (`switch.solar_optimizer_…`) | — |
| `production_entity` | Solar production sensor (W) | Solar Optimizer's |
| `grid_entity` | Net consumption (W, negative when exporting) | Solar Optimizer's |
| `price_entity` | Buy price (€/kWh) | Solar Optimizer's, or `sensor.tarif_actuel` |

The visual editor is available.

## How it works

- **Live** reads the sensors set in Solar Optimizer (production and net consumption). The surplus is the power exported to the grid; home consumption is grid import plus production used on site.
- **Force** calls `solar_optimizer.start_device` (with or without a duration); **Stop** calls `solar_optimizer.stop_device`. While a device is forced, Solar Optimizer disables automatic control and restores it at the end.
- **History** comes from Home Assistant's statistics (5-minute means, kept 10 days by default) and the devices' history. Savings add up the energy used on site, at the buy price of that moment, and the energy sold, at the feed-in price net of tax.
- **Settings** open Solar Optimizer's own options and add-device forms, as in Settings → Devices & services: the card writes nothing else. Deleting a device stays in Home Assistant.

## FAQ

**I can't see the Settings button.** It is reserved for Home Assistant administrators, like the configuration forms.

**Today's run time differs from the timeline.** Solar Optimizer resets its counters at the daily reset time (5 am by default), while the timeline counts from midnight to midnight.

**The 7-day view is empty beyond 10 days.** 5-minute statistics are kept 10 days by default (recorder `purge_keep_days` option).

---

Part of **HOLM — Home Orchestration & Living Management**: smart management and orchestration of the home.

Other projects: [Volets HOLM](https://github.com/kaaribou/volets-holm) · [Climat HOLM](https://github.com/kaaribou/climat-holm) · [Carburant HOLM](https://github.com/kaaribou/carburant-holm) · [Commandes à la maison HOLM](https://github.com/kaaribou/commandes-holm) · [HOLM LaMetric](https://github.com/kaaribou/lametric-holm) · [HOLM My Menu](https://github.com/kaaribou/holm-mymenu) · [HOLM Lektrico](https://github.com/kaaribou/lektrico-holm) · [HOLM GitHub](https://github.com/kaaribou/github-holm) · [HOLM Navbar Card](https://github.com/kaaribou/holm-navbar-card) · [HOLM Climate Card](https://github.com/kaaribou/climate-card-holm) · [HOLM Music Card](https://github.com/kaaribou/holm-music-card) · [HOLM Sentinel Card](https://github.com/kaaribou/holm-sentinel-card) · [HOLM Security Card](https://github.com/kaaribou/holm-security-card) · [HOLM Recordings Card](https://github.com/kaaribou/holm-recordings-card) · [HOLM Covers Card](https://github.com/kaaribou/holm-covers-card) · [HOLM Runtime Card](https://github.com/kaaribou/holm-runtime-card) · [HOLM Power Flow Card](https://github.com/kaaribou/holm-power-flow-card) · [HOLM Energy Cards](https://github.com/kaaribou/holm-energy-cards) · [HOLM Radiator Card](https://github.com/kaaribou/holm-radiator-card) · [HOLM Floor Card](https://github.com/kaaribou/holm-floor-card) · [HOLM Ecojoko Card](https://github.com/kaaribou/holm-ecojoko-card) · [HOLM Smoke Card](https://github.com/kaaribou/holm-smoke-card) · [HOLM BG Card](https://github.com/kaaribou/holm-bg-card).

MIT licence · Not affiliated with Solar Optimizer. · [☕ Buy me a beer](https://paypal.me/kaaribou)
