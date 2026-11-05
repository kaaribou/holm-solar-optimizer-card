/* holm-solar-optimizer-card — https://github.com/kaaribou/holm-solar-optimizer-card — licence MIT — v1.4.0 */
// HOLM Solar Optimizer Card — une interface moderne pour Solar Optimizer (jmcollin78/solar_optimizer), qui reste le moteur.
// Config (éditeur visuel disponible) :
//   type: custom:holm-solar-optimizer-card
//   title: Solar Optimizer
//   default_tab: none            # none (carte repliée) | devices | history (onglet ouvert au départ)
//   history_mode: day            # day | week (vue de l'historique à l'ouverture)
//   history_chart: devices       # devices | energy (graphique de l'historique à l'ouverture)
//   power_sensors:               # facultatif : capteur de puissance réel d'un appareil piloté
//     switch.solar_optimizer_deshumidificateur: sensor.prise_deshumidificateur_power
//   show_live / show_devices / show_history: true
//   production_entity: sensor.xxx   # facultatif : sinon celui de Solar Optimizer
//   grid_entity: sensor.xxx         # facultatif : consommation nette (négative à la revente)
//   price_entity: sensor.tarif_actuel  # facultatif : prix d'achat (HOLM HP/HC détecté automatiquement)
//   exclude: [switch.solar_optimizer_xxx]
(() => {
  const VERSION = "1.4.0";
  const DOMAIN = "solar_optimizer";

  // ───────────────────────── traductions ─────────────────────────
  const I18N = {
    fr: {
      show_all: "Tout afficher", toggle_hint: "Clic : masquer ou afficher · double-clic : voir uniquement celui-ci",
      ch_devices: "Appareils", ch_energy: "Énergie", solar_share: "{a} % solaire", estimated: "≈ estimé : puissance max × durée de marche", l_history_chart: "Graphique à l'ouverture", dev_cons: "Consommation des appareils",
      tab_none: "Aucun (carte compacte)", bar_prod: "Production : {a} % consommée sur place · {b} % revendue", bar_house: "Maison : {a} % solaire · {b} % réseau", bar_noprod: "Production : aucune pour le moment",
      tab_devices: "Appareils", kpi_import: "Achat réseau", l_default_tab: "Onglet à l'ouverture", imp_cost: "{a} achetés", sell_gain: "{a} de revente", src_energy: "Source : compteurs du tableau Énergie", src_power: "Source : puissances moyennes (pas de tableau Énergie)",
      title: "Solar Optimizer", surplus: "Surplus", import: "Achat réseau", production: "Production", house: "Maison", grid: "Réseau", managed: "Pilotés",
      buy: "Achat", sell: "Revente", hp: "Heures pleines", hc: "Heures creuses", devices: "Appareils pilotés", weight: "Poids des priorités",
      st_on: "En marche", st_forced: "Forcé", st_until: "jusqu'à {t}", st_offpeak: "Rattrapage heures creuses", st_disabled: "Pilotage désactivé",
      st_unusable: "Condition non remplie", st_waiting: "Durée minimale en cours", st_idle: "Attend du surplus", st_available: "disponible à {t}",
      run_today: "Aujourd'hui", min_short: "min", max_short: "max", priority: "Priorité",
      prio_0: "Très basse", prio_1: "Basse", prio_2: "Moyenne", prio_3: "Haute", prio_4: "Très haute", weight_none: "Aucun",
      auto: "Pilotage automatique", force: "Forcer", stop: "Arrêter", force_for: "Forcer la marche pendant", unlimited: "Sans limite",
      d_power: "Puissance", d_on_min: "Marche min.", d_off_min: "Arrêt min.", d_offpeak: "Heure creuse", d_offpeak_max: "Max en heures creuses",
      d_raz: "Remise à zéro", d_entity: "Appareil", d_cond: "Condition",
      edit: "Réglages", add: "Ajouter un appareil", save: "Enregistrer", cancel: "Annuler", next: "Suivant", saved: "Réglages enregistrés", added: "Appareil ajouté",
      del_hint: "La suppression d'un appareil se fait dans Paramètres → Appareils et services → Solar Optimizer.",
      quote_warn: "Cette condition est entourée de guillemets : Home Assistant la lit comme du texte, elle risque de ne jamais être vraie.",
      quote_fix: "Retirer les guillemets", flow_failed: "L'opération a échoué",
      history: "Historique", day: "Jour", week: "7 jours", today: "Aujourd'hui", yesterday: "Hier",
      kpi_prod: "Production", kpi_self: "Autoconsommation", kpi_sold: "Revendu", kpi_savings: "Économies", kpi_cover: "Couverture solaire",
      sav_detail: "{a} consommés · {b} revendus", self_detail: "{a} consommés sur place", c_prod: "Production", c_house: "Consommation", c_surplus: "Surplus",
      timeline: "Marche des appareils", solar: "Solaire", offpeak: "Heures creuses", total: "Total",
      loading: "Chargement…", error: "Erreur", no_devices: "Aucun appareil Solar Optimizer trouvé.", no_data: "Pas de données sur cette période",
      l_title: "Titre", l_language: "Langue", auto_lang: "Automatique (profil)", l_show_live: "Direct", l_show_devices: "Appareils", l_show_history: "Historique",
      l_history_mode: "Historique à l'ouverture", l_sources: "Sources (facultatif)", l_production: "Production solaire (W)", l_grid: "Consommation nette (W, négative à la revente)",
      l_price: "Prix d'achat (€/kWh)", l_exclude: "Appareils masqués",
      card_name: "HOLM – Solar Optimizer", card_desc: "Surplus en direct, appareils pilotés, historique et réglages de Solar Optimizer",
    },
    en: {
      show_all: "Show all", toggle_hint: "Click: hide or show · double-click: show this one only",
      ch_devices: "Devices", ch_energy: "Energy", solar_share: "{a} % solar", estimated: "≈ estimated: max power × run time", l_history_chart: "Chart shown first", dev_cons: "Device consumption",
      tab_none: "None (compact card)", bar_prod: "Production: {a} % used on site · {b} % sold", bar_house: "Home: {a} % solar · {b} % grid", bar_noprod: "Production: none right now",
      tab_devices: "Devices", kpi_import: "Grid import", l_default_tab: "Tab shown first", imp_cost: "{a} bought", sell_gain: "{a} of sales", src_energy: "Source: Energy dashboard meters", src_power: "Source: average power (no Energy dashboard)",
      title: "Solar Optimizer", surplus: "Surplus", import: "Grid import", production: "Production", house: "Home", grid: "Grid", managed: "Managed",
      buy: "Buy", sell: "Sell", hp: "Peak hours", hc: "Off-peak hours", devices: "Managed devices", weight: "Priority weight",
      st_on: "Running", st_forced: "Forced", st_until: "until {t}", st_offpeak: "Off-peak catch-up", st_disabled: "Control disabled",
      st_unusable: "Condition not met", st_waiting: "Minimum duration running", st_idle: "Waiting for surplus", st_available: "available at {t}",
      run_today: "Today", min_short: "min", max_short: "max", priority: "Priority",
      prio_0: "Very low", prio_1: "Low", prio_2: "Medium", prio_3: "High", prio_4: "Very high", weight_none: "None",
      auto: "Automatic control", force: "Force", stop: "Stop", force_for: "Force on for", unlimited: "No limit",
      d_power: "Power", d_on_min: "Min. on", d_off_min: "Min. off", d_offpeak: "Off-peak time", d_offpeak_max: "Max off-peak",
      d_raz: "Daily reset", d_entity: "Device", d_cond: "Condition",
      edit: "Settings", add: "Add a device", save: "Save", cancel: "Cancel", next: "Next", saved: "Settings saved", added: "Device added",
      del_hint: "To delete a device, go to Settings → Devices & services → Solar Optimizer.",
      quote_warn: "This condition is wrapped in quotes: Home Assistant reads it as text, so it may never be true.",
      quote_fix: "Remove the quotes", flow_failed: "The operation failed",
      history: "History", day: "Day", week: "7 days", today: "Today", yesterday: "Yesterday",
      kpi_prod: "Production", kpi_self: "Self-consumption", kpi_sold: "Sold", kpi_savings: "Savings", kpi_cover: "Solar coverage",
      sav_detail: "{a} used · {b} sold", self_detail: "{a} used on site", c_prod: "Production", c_house: "Consumption", c_surplus: "Surplus",
      timeline: "Device runs", solar: "Solar", offpeak: "Off-peak", total: "Total",
      loading: "Loading…", error: "Error", no_devices: "No Solar Optimizer device found.", no_data: "No data for this period",
      l_title: "Title", l_language: "Language", auto_lang: "Automatic (profile)", l_show_live: "Live", l_show_devices: "Devices", l_show_history: "History",
      l_history_mode: "History shown first", l_sources: "Sources (optional)", l_production: "Solar production (W)", l_grid: "Net consumption (W, negative when exporting)",
      l_price: "Buy price (€/kWh)", l_exclude: "Hidden devices",
      card_name: "HOLM – Solar Optimizer", card_desc: "Live surplus, managed devices, history and settings for Solar Optimizer",
    },
    de: {
      show_all: "Alle anzeigen", toggle_hint: "Klick: aus- oder einblenden · Doppelklick: nur dieses anzeigen",
      ch_devices: "Geräte", ch_energy: "Energie", solar_share: "{a} % Solar", estimated: "≈ geschätzt: max. Leistung × Laufzeit", l_history_chart: "Diagramm beim Öffnen", dev_cons: "Verbrauch der Geräte",
      tab_none: "Keiner (kompakte Karte)", bar_prod: "Erzeugung: {a} % selbst verbraucht · {b} % eingespeist", bar_house: "Haus: {a} % Solar · {b} % Netz", bar_noprod: "Erzeugung: derzeit keine",
      tab_devices: "Geräte", kpi_import: "Netzbezug", l_default_tab: "Reiter beim Öffnen", imp_cost: "{a} bezahlt", sell_gain: "{a} Einspeisung", src_energy: "Quelle: Zähler des Energie-Dashboards", src_power: "Quelle: mittlere Leistung (kein Energie-Dashboard)",
      title: "Solar Optimizer", surplus: "Überschuss", import: "Netzbezug", production: "Erzeugung", house: "Haus", grid: "Netz", managed: "Gesteuert",
      buy: "Bezug", sell: "Einspeisung", hp: "Hochtarif", hc: "Niedertarif", devices: "Gesteuerte Geräte", weight: "Prioritätsgewicht",
      st_on: "In Betrieb", st_forced: "Erzwungen", st_until: "bis {t}", st_offpeak: "Nachholen im Niedertarif", st_disabled: "Steuerung deaktiviert",
      st_unusable: "Bedingung nicht erfüllt", st_waiting: "Mindestdauer läuft", st_idle: "Wartet auf Überschuss", st_available: "verfügbar um {t}",
      run_today: "Heute", min_short: "min", max_short: "max", priority: "Priorität",
      prio_0: "Sehr niedrig", prio_1: "Niedrig", prio_2: "Mittel", prio_3: "Hoch", prio_4: "Sehr hoch", weight_none: "Keins",
      auto: "Automatische Steuerung", force: "Erzwingen", stop: "Stoppen", force_for: "Einschalten für", unlimited: "Unbegrenzt",
      d_power: "Leistung", d_on_min: "Min. an", d_off_min: "Min. aus", d_offpeak: "Niedertarif ab", d_offpeak_max: "Max. im Niedertarif",
      d_raz: "Tagesreset", d_entity: "Gerät", d_cond: "Bedingung",
      edit: "Einstellungen", add: "Gerät hinzufügen", save: "Speichern", cancel: "Abbrechen", next: "Weiter", saved: "Einstellungen gespeichert", added: "Gerät hinzugefügt",
      del_hint: "Ein Gerät löschen Sie unter Einstellungen → Geräte & Dienste → Solar Optimizer.",
      quote_warn: "Diese Bedingung steht in Anführungszeichen: Home Assistant liest sie als Text, sie ist womöglich nie wahr.",
      quote_fix: "Anführungszeichen entfernen", flow_failed: "Vorgang fehlgeschlagen",
      history: "Verlauf", day: "Tag", week: "7 Tage", today: "Heute", yesterday: "Gestern",
      kpi_prod: "Erzeugung", kpi_self: "Eigenverbrauch", kpi_sold: "Eingespeist", kpi_savings: "Ersparnis", kpi_cover: "Solare Deckung",
      sav_detail: "{a} verbraucht · {b} eingespeist", self_detail: "{a} selbst verbraucht", c_prod: "Erzeugung", c_house: "Verbrauch", c_surplus: "Überschuss",
      timeline: "Gerätelaufzeiten", solar: "Solar", offpeak: "Niedertarif", total: "Gesamt",
      loading: "Wird geladen…", error: "Fehler", no_devices: "Kein Solar-Optimizer-Gerät gefunden.", no_data: "Keine Daten in diesem Zeitraum",
      l_title: "Titel", l_language: "Sprache", auto_lang: "Automatisch (Profil)", l_show_live: "Live", l_show_devices: "Geräte", l_show_history: "Verlauf",
      l_history_mode: "Verlauf beim Öffnen", l_sources: "Quellen (optional)", l_production: "Solarerzeugung (W)", l_grid: "Nettoverbrauch (W, negativ bei Einspeisung)",
      l_price: "Bezugspreis (€/kWh)", l_exclude: "Ausgeblendete Geräte",
      card_name: "HOLM – Solar Optimizer", card_desc: "Live-Überschuss, gesteuerte Geräte, Verlauf und Einstellungen für Solar Optimizer",
    },
    es: {
      show_all: "Mostrar todo", toggle_hint: "Clic: ocultar o mostrar · doble clic: ver solo este",
      ch_devices: "Dispositivos", ch_energy: "Energía", solar_share: "{a} % solar", estimated: "≈ estimado: potencia máx. × tiempo de marcha", l_history_chart: "Gráfico al abrir", dev_cons: "Consumo de los dispositivos",
      tab_none: "Ninguna (tarjeta compacta)", bar_prod: "Producción: {a} % consumida in situ · {b} % vendida", bar_house: "Casa: {a} % solar · {b} % red", bar_noprod: "Producción: ninguna por ahora",
      tab_devices: "Dispositivos", kpi_import: "Compra a la red", l_default_tab: "Pestaña al abrir", imp_cost: "{a} pagados", sell_gain: "{a} de venta", src_energy: "Fuente: contadores del panel de Energía", src_power: "Fuente: potencia media (sin panel de Energía)",
      title: "Solar Optimizer", surplus: "Excedente", import: "Compra a la red", production: "Producción", house: "Casa", grid: "Red", managed: "Gestionados",
      buy: "Compra", sell: "Venta", hp: "Horas punta", hc: "Horas valle", devices: "Dispositivos gestionados", weight: "Peso de prioridad",
      st_on: "En marcha", st_forced: "Forzado", st_until: "hasta las {t}", st_offpeak: "Recuperación en horas valle", st_disabled: "Gestión desactivada",
      st_unusable: "Condición no cumplida", st_waiting: "Duración mínima en curso", st_idle: "Esperando excedente", st_available: "disponible a las {t}",
      run_today: "Hoy", min_short: "mín", max_short: "máx", priority: "Prioridad",
      prio_0: "Muy baja", prio_1: "Baja", prio_2: "Media", prio_3: "Alta", prio_4: "Muy alta", weight_none: "Ninguno",
      auto: "Gestión automática", force: "Forzar", stop: "Detener", force_for: "Forzar durante", unlimited: "Sin límite",
      d_power: "Potencia", d_on_min: "Encendido mín.", d_off_min: "Apagado mín.", d_offpeak: "Hora valle", d_offpeak_max: "Máx. en horas valle",
      d_raz: "Reinicio diario", d_entity: "Dispositivo", d_cond: "Condición",
      edit: "Ajustes", add: "Añadir un dispositivo", save: "Guardar", cancel: "Cancelar", next: "Siguiente", saved: "Ajustes guardados", added: "Dispositivo añadido",
      del_hint: "Para eliminar un dispositivo: Ajustes → Dispositivos y servicios → Solar Optimizer.",
      quote_warn: "Esta condición está entre comillas: Home Assistant la lee como texto y puede que nunca sea verdadera.",
      quote_fix: "Quitar las comillas", flow_failed: "La operación ha fallado",
      history: "Historial", day: "Día", week: "7 días", today: "Hoy", yesterday: "Ayer",
      kpi_prod: "Producción", kpi_self: "Autoconsumo", kpi_sold: "Vendido", kpi_savings: "Ahorro", kpi_cover: "Cobertura solar",
      sav_detail: "{a} consumidos · {b} vendidos", self_detail: "{a} consumidos in situ", c_prod: "Producción", c_house: "Consumo", c_surplus: "Excedente",
      timeline: "Funcionamiento de los dispositivos", solar: "Solar", offpeak: "Horas valle", total: "Total",
      loading: "Cargando…", error: "Error", no_devices: "No se ha encontrado ningún dispositivo de Solar Optimizer.", no_data: "Sin datos en este periodo",
      l_title: "Título", l_language: "Idioma", auto_lang: "Automático (perfil)", l_show_live: "En directo", l_show_devices: "Dispositivos", l_show_history: "Historial",
      l_history_mode: "Historial al abrir", l_sources: "Fuentes (opcional)", l_production: "Producción solar (W)", l_grid: "Consumo neto (W, negativo al vender)",
      l_price: "Precio de compra (€/kWh)", l_exclude: "Dispositivos ocultos",
      card_name: "HOLM – Solar Optimizer", card_desc: "Excedente en directo, dispositivos gestionados, historial y ajustes de Solar Optimizer",
    },
    it: {
      show_all: "Mostra tutto", toggle_hint: "Clic: nascondi o mostra · doppio clic: solo questo",
      ch_devices: "Dispositivi", ch_energy: "Energia", solar_share: "{a} % solare", estimated: "≈ stimato: potenza max × tempo di funzionamento", l_history_chart: "Grafico all'apertura", dev_cons: "Consumo dei dispositivi",
      tab_none: "Nessuna (scheda compatta)", bar_prod: "Produzione: {a} % consumata in loco · {b} % venduta", bar_house: "Casa: {a} % solare · {b} % rete", bar_noprod: "Produzione: nessuna al momento",
      tab_devices: "Dispositivi", kpi_import: "Prelievo dalla rete", l_default_tab: "Scheda all'apertura", imp_cost: "{a} pagati", sell_gain: "{a} di vendita", src_energy: "Fonte: contatori della dashboard Energia", src_power: "Fonte: potenza media (nessuna dashboard Energia)",
      title: "Solar Optimizer", surplus: "Surplus", import: "Prelievo dalla rete", production: "Produzione", house: "Casa", grid: "Rete", managed: "Gestiti",
      buy: "Acquisto", sell: "Vendita", hp: "Ore di punta", hc: "Ore fuori punta", devices: "Dispositivi gestiti", weight: "Peso delle priorità",
      st_on: "In funzione", st_forced: "Forzato", st_until: "fino alle {t}", st_offpeak: "Recupero fuori punta", st_disabled: "Gestione disattivata",
      st_unusable: "Condizione non soddisfatta", st_waiting: "Durata minima in corso", st_idle: "In attesa di surplus", st_available: "disponibile alle {t}",
      run_today: "Oggi", min_short: "min", max_short: "max", priority: "Priorità",
      prio_0: "Molto bassa", prio_1: "Bassa", prio_2: "Media", prio_3: "Alta", prio_4: "Molto alta", weight_none: "Nessuno",
      auto: "Gestione automatica", force: "Forza", stop: "Ferma", force_for: "Forza l'accensione per", unlimited: "Senza limite",
      d_power: "Potenza", d_on_min: "Accensione min.", d_off_min: "Spegnimento min.", d_offpeak: "Ora fuori punta", d_offpeak_max: "Max fuori punta",
      d_raz: "Azzeramento", d_entity: "Dispositivo", d_cond: "Condizione",
      edit: "Impostazioni", add: "Aggiungi un dispositivo", save: "Salva", cancel: "Annulla", next: "Avanti", saved: "Impostazioni salvate", added: "Dispositivo aggiunto",
      del_hint: "Per eliminare un dispositivo: Impostazioni → Dispositivi e servizi → Solar Optimizer.",
      quote_warn: "Questa condizione è tra virgolette: Home Assistant la legge come testo e potrebbe non essere mai vera.",
      quote_fix: "Rimuovi le virgolette", flow_failed: "Operazione non riuscita",
      history: "Cronologia", day: "Giorno", week: "7 giorni", today: "Oggi", yesterday: "Ieri",
      kpi_prod: "Produzione", kpi_self: "Autoconsumo", kpi_sold: "Venduto", kpi_savings: "Risparmio", kpi_cover: "Copertura solare",
      sav_detail: "{a} consumati · {b} venduti", self_detail: "{a} consumati in loco", c_prod: "Produzione", c_house: "Consumo", c_surplus: "Surplus",
      timeline: "Funzionamento dei dispositivi", solar: "Solare", offpeak: "Fuori punta", total: "Totale",
      loading: "Caricamento…", error: "Errore", no_devices: "Nessun dispositivo Solar Optimizer trovato.", no_data: "Nessun dato per questo periodo",
      l_title: "Titolo", l_language: "Lingua", auto_lang: "Automatica (profilo)", l_show_live: "In diretta", l_show_devices: "Dispositivi", l_show_history: "Cronologia",
      l_history_mode: "Cronologia all'apertura", l_sources: "Fonti (facoltative)", l_production: "Produzione solare (W)", l_grid: "Consumo netto (W, negativo in immissione)",
      l_price: "Prezzo di acquisto (€/kWh)", l_exclude: "Dispositivi nascosti",
      card_name: "HOLM – Solar Optimizer", card_desc: "Surplus in diretta, dispositivi gestiti, cronologia e impostazioni di Solar Optimizer",
    },
    nl: {
      show_all: "Alles tonen", toggle_hint: "Klik: verbergen of tonen · dubbelklik: alleen deze tonen",
      ch_devices: "Apparaten", ch_energy: "Energie", solar_share: "{a} % zon", estimated: "≈ geschat: max. vermogen × looptijd", l_history_chart: "Grafiek bij openen", dev_cons: "Verbruik van de apparaten",
      tab_none: "Geen (compacte kaart)", bar_prod: "Productie: {a} % zelf verbruikt · {b} % teruggeleverd", bar_house: "Huis: {a} % zon · {b} % net", bar_noprod: "Productie: momenteel geen",
      tab_devices: "Apparaten", kpi_import: "Afname van het net", l_default_tab: "Tabblad bij openen", imp_cost: "{a} betaald", sell_gain: "{a} teruglevering", src_energy: "Bron: meters van het Energie-dashboard", src_power: "Bron: gemiddeld vermogen (geen Energie-dashboard)",
      title: "Solar Optimizer", surplus: "Overschot", import: "Afname van het net", production: "Productie", house: "Huis", grid: "Net", managed: "Gestuurd",
      buy: "Afname", sell: "Teruglevering", hp: "Piekuren", hc: "Daluren", devices: "Gestuurde apparaten", weight: "Prioriteitsgewicht",
      st_on: "Actief", st_forced: "Geforceerd", st_until: "tot {t}", st_offpeak: "Inhalen in daluren", st_disabled: "Sturing uitgeschakeld",
      st_unusable: "Voorwaarde niet vervuld", st_waiting: "Minimale duur loopt", st_idle: "Wacht op overschot", st_available: "beschikbaar om {t}",
      run_today: "Vandaag", min_short: "min", max_short: "max", priority: "Prioriteit",
      prio_0: "Zeer laag", prio_1: "Laag", prio_2: "Gemiddeld", prio_3: "Hoog", prio_4: "Zeer hoog", weight_none: "Geen",
      auto: "Automatische sturing", force: "Forceren", stop: "Stoppen", force_for: "Inschakelen gedurende", unlimited: "Onbeperkt",
      d_power: "Vermogen", d_on_min: "Min. aan", d_off_min: "Min. uit", d_offpeak: "Daluren vanaf", d_offpeak_max: "Max. in daluren",
      d_raz: "Dagelijkse reset", d_entity: "Apparaat", d_cond: "Voorwaarde",
      edit: "Instellingen", add: "Apparaat toevoegen", save: "Opslaan", cancel: "Annuleren", next: "Volgende", saved: "Instellingen opgeslagen", added: "Apparaat toegevoegd",
      del_hint: "Een apparaat verwijdert u via Instellingen → Apparaten & diensten → Solar Optimizer.",
      quote_warn: "Deze voorwaarde staat tussen aanhalingstekens: Home Assistant leest ze als tekst, ze is mogelijk nooit waar.",
      quote_fix: "Aanhalingstekens verwijderen", flow_failed: "De bewerking is mislukt",
      history: "Geschiedenis", day: "Dag", week: "7 dagen", today: "Vandaag", yesterday: "Gisteren",
      kpi_prod: "Productie", kpi_self: "Eigen verbruik", kpi_sold: "Teruggeleverd", kpi_savings: "Besparing", kpi_cover: "Zonnedekking",
      sav_detail: "{a} verbruikt · {b} teruggeleverd", self_detail: "{a} zelf verbruikt", c_prod: "Productie", c_house: "Verbruik", c_surplus: "Overschot",
      timeline: "Werking van de apparaten", solar: "Zon", offpeak: "Daluren", total: "Totaal",
      loading: "Laden…", error: "Fout", no_devices: "Geen Solar Optimizer-apparaat gevonden.", no_data: "Geen gegevens voor deze periode",
      l_title: "Titel", l_language: "Taal", auto_lang: "Automatisch (profiel)", l_show_live: "Live", l_show_devices: "Apparaten", l_show_history: "Geschiedenis",
      l_history_mode: "Geschiedenis bij openen", l_sources: "Bronnen (optioneel)", l_production: "Zonneproductie (W)", l_grid: "Nettoverbruik (W, negatief bij teruglevering)",
      l_price: "Afnameprijs (€/kWh)", l_exclude: "Verborgen apparaten",
      card_name: "HOLM – Solar Optimizer", card_desc: "Live overschot, gestuurde apparaten, geschiedenis en instellingen van Solar Optimizer",
    },
    pt: {
      show_all: "Mostrar tudo", toggle_hint: "Clique: ocultar ou mostrar · duplo clique: ver só este",
      ch_devices: "Dispositivos", ch_energy: "Energia", solar_share: "{a} % solar", estimated: "≈ estimado: potência máx. × tempo de funcionamento", l_history_chart: "Gráfico ao abrir", dev_cons: "Consumo dos dispositivos",
      tab_none: "Nenhum (cartão compacto)", bar_prod: "Produção: {a} % consumida no local · {b} % vendida", bar_house: "Casa: {a} % solar · {b} % rede", bar_noprod: "Produção: nenhuma de momento",
      tab_devices: "Dispositivos", kpi_import: "Compra à rede", l_default_tab: "Separador ao abrir", imp_cost: "{a} pagos", sell_gain: "{a} de venda", src_energy: "Fonte: contadores do painel de Energia", src_power: "Fonte: potência média (sem painel de Energia)",
      title: "Solar Optimizer", surplus: "Excedente", import: "Compra à rede", production: "Produção", house: "Casa", grid: "Rede", managed: "Geridos",
      buy: "Compra", sell: "Venda", hp: "Horas de ponta", hc: "Horas de vazio", devices: "Dispositivos geridos", weight: "Peso das prioridades",
      st_on: "Em funcionamento", st_forced: "Forçado", st_until: "até às {t}", st_offpeak: "Recuperação em horas de vazio", st_disabled: "Gestão desativada",
      st_unusable: "Condição não cumprida", st_waiting: "Duração mínima em curso", st_idle: "À espera de excedente", st_available: "disponível às {t}",
      run_today: "Hoje", min_short: "mín", max_short: "máx", priority: "Prioridade",
      prio_0: "Muito baixa", prio_1: "Baixa", prio_2: "Média", prio_3: "Alta", prio_4: "Muito alta", weight_none: "Nenhum",
      auto: "Gestão automática", force: "Forçar", stop: "Parar", force_for: "Forçar durante", unlimited: "Sem limite",
      d_power: "Potência", d_on_min: "Ligado mín.", d_off_min: "Desligado mín.", d_offpeak: "Hora de vazio", d_offpeak_max: "Máx. em vazio",
      d_raz: "Reposição diária", d_entity: "Dispositivo", d_cond: "Condição",
      edit: "Definições", add: "Adicionar dispositivo", save: "Guardar", cancel: "Cancelar", next: "Seguinte", saved: "Definições guardadas", added: "Dispositivo adicionado",
      del_hint: "Para eliminar um dispositivo: Definições → Dispositivos e serviços → Solar Optimizer.",
      quote_warn: "Esta condição está entre aspas: o Home Assistant lê-a como texto e pode nunca ser verdadeira.",
      quote_fix: "Remover as aspas", flow_failed: "A operação falhou",
      history: "Histórico", day: "Dia", week: "7 dias", today: "Hoje", yesterday: "Ontem",
      kpi_prod: "Produção", kpi_self: "Autoconsumo", kpi_sold: "Vendido", kpi_savings: "Poupança", kpi_cover: "Cobertura solar",
      sav_detail: "{a} consumidos · {b} vendidos", self_detail: "{a} consumidos no local", c_prod: "Produção", c_house: "Consumo", c_surplus: "Excedente",
      timeline: "Funcionamento dos dispositivos", solar: "Solar", offpeak: "Vazio", total: "Total",
      loading: "A carregar…", error: "Erro", no_devices: "Nenhum dispositivo Solar Optimizer encontrado.", no_data: "Sem dados neste período",
      l_title: "Título", l_language: "Idioma", auto_lang: "Automático (perfil)", l_show_live: "Em direto", l_show_devices: "Dispositivos", l_show_history: "Histórico",
      l_history_mode: "Histórico ao abrir", l_sources: "Fontes (opcional)", l_production: "Produção solar (W)", l_grid: "Consumo líquido (W, negativo ao vender)",
      l_price: "Preço de compra (€/kWh)", l_exclude: "Dispositivos ocultos",
      card_name: "HOLM – Solar Optimizer", card_desc: "Excedente em direto, dispositivos geridos, histórico e definições do Solar Optimizer",
    },
    pl: {
      show_all: "Pokaż wszystko", toggle_hint: "Kliknięcie: ukryj lub pokaż · dwuklik: pokaż tylko ten",
      ch_devices: "Urządzenia", ch_energy: "Energia", solar_share: "{a} % ze słońca", estimated: "≈ szacunek: moc maks. × czas pracy", l_history_chart: "Wykres po otwarciu", dev_cons: "Zużycie urządzeń",
      tab_none: "Brak (kompaktowa karta)", bar_prod: "Produkcja: {a} % zużyta na miejscu · {b} % sprzedana", bar_house: "Dom: {a} % słońce · {b} % sieć", bar_noprod: "Produkcja: obecnie brak",
      tab_devices: "Urządzenia", kpi_import: "Pobór z sieci", l_default_tab: "Karta po otwarciu", imp_cost: "{a} zapłacone", sell_gain: "{a} ze sprzedaży", src_energy: "Źródło: liczniki panelu Energia", src_power: "Źródło: średnia moc (brak panelu Energia)",
      title: "Solar Optimizer", surplus: "Nadwyżka", import: "Pobór z sieci", production: "Produkcja", house: "Dom", grid: "Sieć", managed: "Sterowane",
      buy: "Zakup", sell: "Sprzedaż", hp: "Godziny szczytu", hc: "Godziny pozaszczytowe", devices: "Sterowane urządzenia", weight: "Waga priorytetów",
      st_on: "Pracuje", st_forced: "Wymuszone", st_until: "do {t}", st_offpeak: "Nadrabianie poza szczytem", st_disabled: "Sterowanie wyłączone",
      st_unusable: "Warunek niespełniony", st_waiting: "Trwa czas minimalny", st_idle: "Czeka na nadwyżkę", st_available: "dostępne o {t}",
      run_today: "Dziś", min_short: "min", max_short: "maks", priority: "Priorytet",
      prio_0: "Bardzo niski", prio_1: "Niski", prio_2: "Średni", prio_3: "Wysoki", prio_4: "Bardzo wysoki", weight_none: "Brak",
      auto: "Sterowanie automatyczne", force: "Wymuś", stop: "Zatrzymaj", force_for: "Wymuś pracę przez", unlimited: "Bez limitu",
      d_power: "Moc", d_on_min: "Min. praca", d_off_min: "Min. postój", d_offpeak: "Poza szczytem od", d_offpeak_max: "Maks. poza szczytem",
      d_raz: "Reset dzienny", d_entity: "Urządzenie", d_cond: "Warunek",
      edit: "Ustawienia", add: "Dodaj urządzenie", save: "Zapisz", cancel: "Anuluj", next: "Dalej", saved: "Ustawienia zapisane", added: "Urządzenie dodane",
      del_hint: "Urządzenie usuniesz w Ustawienia → Urządzenia i usługi → Solar Optimizer.",
      quote_warn: "Ten warunek jest w cudzysłowie: Home Assistant odczytuje go jako tekst, może nigdy nie być prawdziwy.",
      quote_fix: "Usuń cudzysłów", flow_failed: "Operacja nie powiodła się",
      history: "Historia", day: "Dzień", week: "7 dni", today: "Dziś", yesterday: "Wczoraj",
      kpi_prod: "Produkcja", kpi_self: "Autokonsumpcja", kpi_sold: "Sprzedane", kpi_savings: "Oszczędności", kpi_cover: "Pokrycie solarne",
      sav_detail: "{a} zużyte · {b} sprzedane", self_detail: "{a} zużyte na miejscu", c_prod: "Produkcja", c_house: "Zużycie", c_surplus: "Nadwyżka",
      timeline: "Praca urządzeń", solar: "Słońce", offpeak: "Poza szczytem", total: "Razem",
      loading: "Ładowanie…", error: "Błąd", no_devices: "Nie znaleziono urządzeń Solar Optimizer.", no_data: "Brak danych w tym okresie",
      l_title: "Tytuł", l_language: "Język", auto_lang: "Automatycznie (profil)", l_show_live: "Na żywo", l_show_devices: "Urządzenia", l_show_history: "Historia",
      l_history_mode: "Historia po otwarciu", l_sources: "Źródła (opcjonalnie)", l_production: "Produkcja solarna (W)", l_grid: "Zużycie netto (W, ujemne przy oddawaniu)",
      l_price: "Cena zakupu (€/kWh)", l_exclude: "Ukryte urządzenia",
      card_name: "HOLM – Solar Optimizer", card_desc: "Nadwyżka na żywo, sterowane urządzenia, historia i ustawienia Solar Optimizer",
    },
  };
  const LANG_NAMES = { fr: "Français", en: "English", de: "Deutsch", es: "Español", it: "Italiano", nl: "Nederlands", pt: "Português", pl: "Polski" };
  const langOf = (hass, c) => { const l = String((c && c.language) || hass?.locale?.language || hass?.language || navigator.language || "en").toLowerCase().split(/[-_]/)[0]; return I18N[l] ? l : "en"; };
  const tr = (l, k, v) => { let s = (I18N[l] && I18N[l][k]) ?? I18N.en[k] ?? k; if (v) for (const [a, b] of Object.entries(v)) s = s.replace(`{${a}}`, b); return s; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : null; };
  const PRIOS = ["Very low", "Low", "Medium", "High", "Very high"];
  const QUOTED = /^\s*["'](\{\{[\s\S]*\}\})["']\s*$/;

  // icône devinée depuis le nom quand l'appareil piloté n'est pas connu
  const ICON_GUESS = [
    [/chauffe|ballon|boiler|water.?heater|ecs/i, "mdi:water-boiler"], [/spa|jacuzzi/i, "mdi:hot-tub"], [/piscine|pool|filtration/i, "mdi:pool"],
    [/d[ée]shum|humid/i, "mdi:air-humidifier"], [/vmc|ventil|fan/i, "mdi:fan"], [/voiture|borne|car|ev|wallbox|charge/i, "mdi:ev-station"],
    [/lave.?linge|washing/i, "mdi:washing-machine"], [/s[èe]che|dryer/i, "mdi:tumble-dryer"], [/lave.?vaisselle|dish/i, "mdi:dishwasher"],
    [/clim|pac|pompe|heat.?pump|chauffage|radiat/i, "mdi:heat-pump"], [/batter/i, "mdi:home-battery"],
  ];
  const DOMAIN_ICON = { switch: "mdi:toggle-switch", light: "mdi:lightbulb", fan: "mdi:fan", climate: "mdi:thermostat", humidifier: "mdi:air-humidifier",
    water_heater: "mdi:water-boiler", input_boolean: "mdi:toggle-switch", select: "mdi:format-list-bulleted", button: "mdi:gesture-tap-button" };

  class HolmSolarOptimizerCard extends HTMLElement {
    static getConfigElement() { return document.createElement("holm-solar-optimizer-card-editor"); }
    static getStubConfig() { return {}; }

    setConfig(c) {
      if (!c) throw new Error("holm-solar-optimizer-card : configuration invalide");
      this._c = { show_live: true, show_devices: true, show_history: true, history_mode: "day", ...c };
      this._mode = this._c.history_mode === "week" ? "week" : "day";
      this._tab = ["devices", "history"].includes(this._c.default_tab) ? this._c.default_tab : null;
      this._chart = this._c.history_chart === "energy" ? "energy" : "devices";
      try { this._off = new Set(JSON.parse(localStorage.getItem("holm-so-hidden") || "[]")); } catch (_) { this._off = new Set(); }
      this._dayOffset = 0;
      this._hist = null;
      this._histKey = "";
      this._sig = "";
      if (this.shadowRoot) this._renderAll();
    }

    set hass(h) {
      const first = !this._hass;
      this._hass = h;
      if (!this.shadowRoot) { this.attachShadow({ mode: "open" }); this._renderAll(); }
      if (first) this._boot();
      const sig = this._signature();
      if (sig !== this._sig) { this._sig = sig; this._renderLive(); this._renderDevices(); this._renderTabs(); }
      if (this._edit && this._form) this._form.hass = h;
      if (this._c.show_history !== false && this._tab === "history" && Date.now() - (this._histAt || 0) > 5 * 60000) this._loadHistory();
    }
    connectedCallback() {
      clearInterval(this._tick); this._tick = setInterval(() => { if (this._hass && this._tab === "history") this._loadHistory(); }, 5 * 60000);
      if (!this._ro && window.ResizeObserver) this._ro = new ResizeObserver(() => {
        const w = this.clientWidth; if (!w || Math.abs(w - (this._lastW || 0)) < 24) return;
        this._lastW = w; clearTimeout(this._rt); this._rt = setTimeout(() => this._renderHistory(), 120);
      });
      this._ro?.observe(this);
    }
    disconnectedCallback() { clearInterval(this._tick); this._ro?.disconnect(); }
    getCardSize() { return 10; }
    getGridOptions() { return { columns: 12, rows: "auto", min_columns: 6 }; }

    get _l() { return langOf(this._hass, this._c); }
    _t(k, v) { return tr(this._l, k, v); }
    _admin() { return !!this._hass?.user?.is_admin; }
    _nf(v, d = 0) { return new Intl.NumberFormat(this._hass?.locale?.language || this._l, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v); }
    _w(w) { const a = Math.abs(w || 0); return a >= 1000 ? `${this._nf(a / 1000, a >= 10000 ? 1 : 2)} kW` : `${this._nf(a)} W`; }
    _kwh(k) { return `${this._nf(k || 0, k >= 100 ? 0 : k >= 10 ? 1 : 2)} kWh`; }
    _eur(e) { return new Intl.NumberFormat(this._hass?.locale?.language || this._l, { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(e || 0); }
    _time(d) { return new Intl.DateTimeFormat(this._hass?.locale?.language || this._l, { hour: "2-digit", minute: "2-digit" }).format(d); }
    _dur(sec) {
      const m = Math.round((sec || 0) / 60);
      if (m < 60) return `${m} min`;
      const h = Math.floor(m / 60), mm = m % 60;
      return mm ? `${h} h ${String(mm).padStart(2, "0")}` : `${h} h`;
    }
    _st(id) { return id ? this._hass?.states[id] : undefined; }

    // ───────────── découverte des entités Solar Optimizer ─────────────
    _soEntities() {
      const ents = this._hass?.entities || {};
      const n = Object.keys(ents).length;
      if (this._soCache && this._soCache.n === n) return this._soCache;
      const list = Object.values(ents).filter((e) => e.platform === DOMAIN);
      const pick = (re) => list.find((e) => re.test(e.entity_id))?.entity_id;
      this._soCache = {
        n, list,
        production: pick(/^sensor\..*power_production$/) || pick(/^sensor\..*power_production/),
        consumption: pick(/^sensor\..*power_consumption/),
        total: pick(/^sensor\..*total_power/),
        weight: pick(/^select\..*priority_weight/),
      };
      return this._soCache;
    }
    _devices() {
      const st = this._hass.states;
      const so = this._soEntities();
      const exclude = new Set(this._c.exclude || []);
      const byDev = {};
      for (const e of so.list) if (e.device_id) (byDev[e.device_id] = byDev[e.device_id] || []).push(e.entity_id);
      const out = [];
      for (const id of Object.keys(st)) {
        if (!id.startsWith("switch.solar_optimizer_") || exclude.has(id)) continue;
        const s = st[id];
        if (s.attributes.device_name === undefined) continue;
        const key = id.slice("switch.solar_optimizer_".length);
        const d = { id, key, s, name: s.attributes.device_name,
          enable: `switch.enable_solar_optimizer_${key}`, prio: `select.solar_optimizer_priority_${key}`, ontime: `sensor.on_time_today_solar_optimizer_${key}` };
        const sib = byDev[this._hass.entities?.[id]?.device_id];
        if (sib) for (const e of sib) {
          if (e === id) continue;
          if (e.startsWith("switch.")) d.enable = e; else if (e.startsWith("select.")) d.prio = e; else if (e.startsWith("sensor.") && /on_time/.test(e)) d.ontime = e;
        }
        d.opts = this._opts?.[id]?.o;
        out.push(d);
      }
      const rank = (d) => PRIOS.indexOf(st[d.prio]?.state);
      return out.sort((a, b) => rank(b) - rank(a) || a.name.localeCompare(b.name));
    }
    _sources() {
      const so = this._soEntities();
      const c = this._central || {};
      const price = this._c.price_entity || c.buy_cost_entity_id || (this._hass.states["sensor.tarif_actuel"] ? "sensor.tarif_actuel" : undefined);
      return {
        production: this._c.production_entity || c.power_production_entity_id || so.production,
        grid: this._c.grid_entity || c.power_consumption_entity_id || so.consumption,
        price, sell: c.sell_cost_entity_id, sellTax: c.sell_tax_percent_entity_id, total: so.total, weight: so.weight,
      };
    }
    // prix de revente : HOLM HP/HC (attributs prix_rachat / taxe_revente) sinon réglages Solar Optimizer
    _sellPrice() {
      const s = this._sources();
      const pa = this._st(s.price)?.attributes || {};
      let p = num(pa.prix_rachat), tax = num(pa.taxe_revente);
      if (p === null) p = num(this._st(s.sell)?.state);
      if (tax === null) tax = num(this._st(s.sellTax)?.state);
      return Math.max(0, (p || 0) * (1 - (tax || 0) / 100));
    }

    // réglages des entrées Solar Optimizer (administrateurs) : lus en ouvrant puis en annulant le formulaire d'options
    async _boot() {
      if (!this._admin()) return;
      try {
        const so = this._soEntities();
        const sw = so.list.map((e) => e.entity_id).filter((e) => e.startsWith("switch.solar_optimizer_"));
        const reg = await this._hass.callWS({ type: "config/entity_registry/get_entries", entity_ids: sw });
        this._entryOf = {};
        for (const [eid, r] of Object.entries(reg || {})) if (r?.config_entry_id) this._entryOf[eid] = r.config_entry_id;
        const entries = await this._hass.callWS({ type: "config_entries/get", domain: DOMAIN });
        const devEntries = new Set(Object.values(this._entryOf));
        const central = (entries || []).find((e) => !devEntries.has(e.entry_id));
        if (central) { this._centralEntry = central.entry_id; this._central = (await this._readOptions(central.entry_id)).o; }
        this._opts = {};
        for (const [eid, entry] of Object.entries(this._entryOf)) this._opts[eid] = await this._readOptions(entry);
        this._sig = ""; this._renderLive(); this._renderDevices();
        this._histAt = 0; if (this._tab === "history") this._loadHistory();
      } catch (e) { console.warn("holm-solar-optimizer-card :", e); }
    }
    async _readOptions(entryId) {
      const f = await this._hass.callApi("POST", "config/config_entries/options/flow", { handler: entryId, show_advanced_options: false });
      const o = {};
      for (const s of f.data_schema || []) { const v = s.description?.suggested_value ?? s.default; if (v !== undefined) o[s.name] = v; }
      this._hass.callApi("DELETE", `config/config_entries/options/flow/${f.flow_id}`).catch(() => {});
      return { step: f.step_id, o };
    }

    // capteur de puissance réel de l'appareil piloté : option power_sensors, sinon même appareil que l'entité pilotée
    _powerSensor(d) {
      const ov = this._c.power_sensors?.[d.id] || this._c.power_sensors?.[d.key];
      if (ov) return ov;
      const ents = this._hass.entities || {};
      const dev = d.opts?.entity_id && ents[d.opts.entity_id]?.device_id;
      if (!dev) return null;
      for (const e of Object.values(ents)) {
        if (e.device_id !== dev || !e.entity_id.startsWith("sensor.")) continue;
        const a = this._hass.states[e.entity_id]?.attributes;
        if (a?.device_class === "power") return e.entity_id;
      }
      return null;
    }
    _signature() {
      const s = this._sources();
      const ids = [s.production, s.grid, s.price, s.total, s.weight];
      for (const d of this._devices()) ids.push(d.id, d.enable, d.prio, d.ontime);
      const st = this._hass.states;
      return ids.map((i) => { const x = st[i]; return x ? x.state + (i.startsWith("switch.solar_optimizer_") ? JSON.stringify(x.attributes) : "") : "-"; }).join("|");
    }

    // ───────────────────────── rendu ─────────────────────────
    _renderAll() {
      if (!this.shadowRoot || !this._c) return;
      const c = this._c;
      this.shadowRoot.innerHTML = `
        <style>${STYLE}</style>
        <ha-card>
          <div class="hdr"><span class="logo"><ha-icon icon="mdi:solar-power-variant"></ha-icon></span><span class="ttl">${esc(c.title ?? this._t("title"))}</span><span class="price" id="price"></span></div>
          ${c.show_live !== false ? `<section id="live"></section>` : ""}
          <div class="tabs" id="tabs"></div>
          ${c.show_devices !== false ? `<div class="pane" data-p="devices"><section id="devs"></section><section id="editor" hidden></section></div>` : ""}
          ${c.show_history !== false ? `<div class="pane" data-p="history"><section id="hist"></section></div>` : ""}
        </ha-card>`;
      this.shadowRoot.addEventListener("click", (e) => this._onClick(e));
      this.shadowRoot.addEventListener("change", (e) => this._onChange(e));
      this.shadowRoot.addEventListener("dblclick", (e) => {
        const b = e.target.closest('[data-act="devtoggle"]'); if (!b || !this._hist) return;
        // double-clic : n'afficher que celui-ci (la production reste comme elle est)
        const keep = b.dataset.id;
        const ids = this._hist.runs.map((r) => r.d.id);
        if (keep === "__prod") return;
        const solo = ids.every((id) => id === keep || this._off.has(id)) && !this._off.has(keep);
        for (const id of ids) { if (solo || id === keep) this._off.delete(id); else this._off.add(id); }
        this._saveOff(); this._renderHistory();
      });
      if (this._hass) { this._sig = ""; this._renderLive(); this._renderDevices(); this._renderHistory(); this._renderEditor(); }
      this._renderTabs();
    }
    _tabsAvail() { const c = this._c; return [c.show_devices !== false && "devices", c.show_history !== false && "history"].filter(Boolean); }
    _renderTabs() {
      const root = this.shadowRoot; if (!root) return;
      const av = this._tabsAvail();
      // carte repliée par défaut ; sans direct, on ouvre quand même le premier onglet
      if (this._tab !== null && !av.includes(this._tab)) this._tab = av[0] ?? null;
      if (this._tab === null && this._c.show_live === false) this._tab = av[0] ?? null;
      const bar = root.getElementById("tabs");
      if (bar) {
        const n = this._hass ? this._devices().filter((d) => d.s.attributes.is_active).length : 0;
        const T = { devices: ["mdi:power-plug-outline", this._t("tab_devices")], history: ["mdi:chart-areaspline", this._t("history")] };
        bar.hidden = !av.length || (av.length < 2 && this._c.show_live === false);
        bar.style.gridTemplateColumns = `repeat(${av.length}, minmax(0, 1fr))`;
        bar.innerHTML = av.map((k) => `<button data-act="tab" data-t="${k}" class="${k === this._tab ? "on" : ""}" aria-expanded="${k === this._tab}"><ha-icon icon="${T[k][0]}"></ha-icon><span>${T[k][1]}</span>${k === "devices" && n ? `<i class="cnt">${n}</i>` : ""}</button>`).join("");
      }
      root.querySelectorAll(".pane").forEach((p) => { p.hidden = p.dataset.p !== this._tab; });
    }

    _renderLive() {
      const root = this.shadowRoot; if (!root || !this._hass) return;
      const s = this._sources();
      const prod = Math.max(0, num(this._st(s.production)?.state) || 0);
      const grid = num(this._st(s.grid)?.state) || 0;
      const exp = Math.max(0, -grid), imp = Math.max(0, grid);
      const self = Math.max(0, prod - exp), house = imp + self;
      const managed = num(this._st(s.total)?.state) || 0;

      // prix du moment dans l'en-tête
      const pe = root.getElementById("price");
      const ps = this._st(s.price);
      if (pe) {
        if (ps && num(ps.state) !== null) {
          const per = ps.attributes.periode || ps.attributes.period || "";
          const isHC = /creuse|off/i.test(per) || (num(ps.attributes.prix_hc) !== null && Math.abs(num(ps.state) - num(ps.attributes.prix_hc)) < 1e-6 && num(ps.attributes.prix_hc) !== num(ps.attributes.prix_hp));
          pe.className = `price ${isHC ? "hc" : "hp"}`;
          pe.innerHTML = `<ha-icon icon="${isHC ? "mdi:weather-night" : "mdi:white-balance-sunny"}"></ha-icon>${esc(per || (isHC ? this._t("hc") : this._t("hp")))} · ${this._nf(num(ps.state), 4)} €/kWh`;
          pe.title = `${this._t("sell")} : ${this._nf(this._sellPrice(), 4)} €/kWh`;
        } else pe.innerHTML = "";
      }
      const el = root.getElementById("live"); if (!el) return;
      const total = Math.max(prod, house, 1);
      const pct = (v) => `${Math.max(0, Math.min(100, (v / total) * 100)).toFixed(1)}%`;
      const exporting = exp > 0;
      el.innerHTML = `
        <div class="live">
          <div class="big ${exporting ? "pos" : "neg"}">
            <div class="lbl">${exporting ? this._t("surplus") : this._t("import")}</div>
            <div class="val">${this._w(exporting ? exp : imp)}</div>
            <div class="sub">${exporting ? `<ha-icon icon="mdi:transmission-tower-export"></ha-icon>${this._t("sell")} ${this._nf(this._sellPrice(), 4)} €/kWh` : `<ha-icon icon="mdi:transmission-tower-import"></ha-icon>${this._t("grid")}`}</div>
          </div>
          <div class="stats">
            <div class="stat sun"><ha-icon icon="mdi:solar-power"></ha-icon><div><b>${this._w(prod)}</b><span>${this._t("production")}</span></div></div>
            <div class="stat home"><ha-icon icon="mdi:home-lightning-bolt-outline"></ha-icon><div><b>${this._w(house)}</b><span>${this._t("house")}</span></div></div>
            <div class="stat so"><ha-icon icon="mdi:robot-outline"></ha-icon><div><b>${this._w(managed)}</b><span>${this._t("managed")}</span></div></div>
          </div>
        </div>
        <div class="bars">
          <div class="bl">${prod > 0 ? this._t("bar_prod", { a: this._nf((self / prod) * 100), b: this._nf((exp / prod) * 100) }) : this._t("bar_noprod")}</div>
          <div class="bar"><i class="self" style="width:${pct(self)}"></i><i class="exp" style="width:${pct(exp)}"></i></div>
          <div class="bl">${this._t("bar_house", { a: this._nf(house > 0 ? (self / house) * 100 : 0), b: this._nf(house > 0 ? (imp / house) * 100 : 0) })}</div>
          <div class="bar"><i class="self" style="width:${pct(self)}"></i><i class="imp" style="width:${pct(imp)}"></i></div>
          <div class="legend"><span><i class="self"></i>${this._t("solar")}</span><span><i class="exp"></i>${this._t("surplus")}</span><span><i class="imp"></i>${this._t("grid")}</span></div>
        </div>`;
    }

    _status(d) {
      const a = d.s.attributes;
      const forcedEnd = a.forced_end_time ? new Date(a.forced_end_time) : null;
      const offpeak = !!this._st(d.ontime)?.attributes?.should_be_forced_offpeak;
      if (a.is_active && (!a.is_enabled || forcedEnd)) return { k: "forced", txt: this._t("st_forced") + (forcedEnd ? " " + this._t("st_until", { t: this._time(forcedEnd) }) : "") };
      if (a.is_active && offpeak) return { k: "offpeak", txt: this._t("st_offpeak") };
      if (a.is_active) return { k: "on", txt: this._t("st_on") };
      if (!a.is_enabled) return { k: "off", txt: this._t("st_disabled") };
      if (!a.is_usable) return { k: "warn", txt: this._t("st_unusable") };
      if (a.is_waiting) return { k: "wait", txt: this._t("st_waiting") };
      const nd = a.next_date_available ? new Date(a.next_date_available) : null;
      return { k: "idle", txt: this._t("st_idle") + (nd && nd > new Date() ? " · " + this._t("st_available", { t: this._time(nd) }) : "") };
    }
    _icon(d) {
      if (d.opts?.entity_id) { const e = this._st(d.opts.entity_id); if (e?.attributes?.icon) return e.attributes.icon; }
      for (const [re, ic] of ICON_GUESS) if (re.test(d.name)) return ic;
      if (d.opts?.entity_id) return DOMAIN_ICON[d.opts.entity_id.split(".")[0]] || "mdi:power-plug";
      return "mdi:power-plug";
    }

    _renderDevices() {
      const el = this.shadowRoot?.getElementById("devs"); if (!el || !this._hass) return;
      const devs = this._devices();
      const w = this._st(this._sources().weight);
      const prioLabel = (v) => { const i = PRIOS.indexOf(v); return i >= 0 ? this._t("prio_" + i) : v === "None" ? this._t("weight_none") : v; };
      const head = `<div class="sh top"><span>${this._t("devices")}</span>
        ${w ? `<label class="wsel" title="${this._t("weight")}"><ha-icon icon="mdi:weight"></ha-icon><select data-select="${esc(w.entity_id)}">${(w.attributes.options || []).map((o) => `<option value="${esc(o)}" ${o === w.state ? "selected" : ""}>${esc(prioLabel(o))}</option>`).join("")}</select></label>` : ""}</div>`;
      if (!devs.length) { el.innerHTML = head + `<div class="msg">${this._t("no_devices")}</div>`; return; }
      el.innerHTML = head + `<div class="devs">${devs.map((d) => {
        const a = d.s.attributes, st = this._status(d);
        const on = num(this._st(d.ontime)?.state) || 0;
        const ota = this._st(d.ontime)?.attributes || {};
        const maxS = num(ota.max_on_time_per_day_sec) ?? (num(d.opts?.max_on_time_per_day_min) ?? 0) * 60;
        const minS = (num(d.opts?.min_on_time_per_day_min) || 0) * 60;
        const scale = Math.max(maxS, minS, on, 1);
        const pr = this._st(d.prio);
        const en = this._st(d.enable)?.state === "on";
        const open = this._open === d.id;
        const forced = st.k === "forced";
        const icon = this._icon(d);
        const power = a.is_active ? (num(a.current_power) || num(a.power_max) || 0) : 0;
        return `<div class="dev ${st.k} ${open ? "open" : ""}" data-dev="${esc(d.id)}">
          <div class="dr" data-act="open" data-id="${esc(d.id)}">
            <span class="ic"><ha-icon icon="${esc(icon)}"></ha-icon><i class="dot"></i></span>
            <div class="dm">
              <div class="dn"><span class="nm">${esc(d.name)}</span>${power ? `<span class="pw">${this._w(power)}</span>` : ""}</div>
              <div class="ds">${esc(st.txt)}</div>
              <div class="gauge" title="${this._t("run_today")} ${this._dur(on)}${minS ? ` · ${this._t("min_short")} ${this._dur(minS)}` : ""}${maxS ? ` · ${this._t("max_short")} ${this._dur(maxS)}` : ""}">
                <i class="fill ${minS && on >= minS ? "ok" : ""}" style="width:${((on / scale) * 100).toFixed(1)}%"></i>
                ${minS ? `<i class="mk" style="left:${((minS / scale) * 100).toFixed(1)}%"></i>` : ""}
              </div>
              <div class="dt"><span>${this._t("run_today")} <b>${this._dur(on)}</b></span><span>${minS ? `${this._t("min_short")} ${this._dur(minS)} · ` : ""}${maxS ? `${this._t("max_short")} ${this._dur(maxS)}` : ""}</span></div>
            </div>
            <div class="da">
              ${pr ? `<select class="prio p${PRIOS.indexOf(pr.state)}" data-select="${esc(pr.entity_id)}" title="${this._t("priority")}">${(pr.attributes.options || PRIOS).map((o) => `<option value="${esc(o)}" ${o === pr.state ? "selected" : ""}>${esc(prioLabel(o))}</option>`).join("")}</select>` : ""}
              <div class="btns">
                <button class="tg ${en ? "on" : ""}" role="switch" aria-checked="${en}" data-act="enable" data-id="${esc(d.enable)}" title="${this._t("auto")}"><i></i></button>
                ${forced ? `<button class="fb stop" data-act="stop" data-key="${esc(d.key)}" title="${this._t("stop")}"><ha-icon icon="mdi:stop"></ha-icon></button>`
                  : `<button class="fb" data-act="forcemenu" data-id="${esc(d.id)}" title="${this._t("force")}"><ha-icon icon="mdi:lightning-bolt"></ha-icon></button>`}
              </div>
            </div>
          </div>
          ${this._forceMenu === d.id && !forced ? `<div class="fm"><span>${this._t("force_for")}</span>${[1, 2, 4, 8].map((h) => `<button data-act="force" data-key="${esc(d.key)}" data-h="${h}">${h} h</button>`).join("")}<button data-act="force" data-key="${esc(d.key)}" data-h="0">${this._t("unlimited")}</button></div>` : ""}
          ${open ? this._details(d) : ""}
        </div>`;
      }).join("")}</div>
      ${this._admin() ? `<button class="add" data-act="add"><ha-icon icon="mdi:plus"></ha-icon>${this._t("add")}</button>` : ""}`;
    }
    _details(d) {
      const a = d.s.attributes, o = d.opts || {}, ota = this._st(d.ontime)?.attributes || {};
      const hm = (v) => (v ? String(v).slice(0, 5) : "");
      const items = [
        [this._t("d_entity"), o.entity_id ? (this._st(o.entity_id)?.attributes?.friendly_name || o.entity_id) : ""],
        [this._t("d_power"), num(a.power_max) > 0 ? this._w(num(a.power_max)) : ""],
        [this._t("d_on_min"), a.duration_sec ? this._dur(a.duration_sec) : ""],
        [this._t("d_off_min"), num(o.duration_stop_min) !== null ? this._dur(num(o.duration_stop_min) * 60) : ""],
        [this._t("d_offpeak"), hm(ota.offpeak_time || o.offpeak_time)],
        [this._t("d_offpeak_max"), num(o.max_on_time_offpeak_min) ? this._dur(num(o.max_on_time_offpeak_min) * 60) : ""],
        [this._t("d_raz"), hm(ota.raz_time)],
      ].filter((x) => x[1]);
      const cond = o.check_usable_template && o.check_usable_template.replace(/\s/g, "") !== "{{True}}" ? o.check_usable_template : "";
      return `<div class="det">
        <div class="kv">${items.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</div>
        ${cond ? `<div class="cond ${QUOTED.test(cond) ? "bad" : ""}"><span>${this._t("d_cond")}</span><code>${esc(cond)}</code>${QUOTED.test(cond) ? `<em>${this._t("quote_warn")}</em>` : ""}</div>` : ""}
        <div class="dbtns">
          <button class="lnk" data-act="more" data-id="${esc(d.id)}"><ha-icon icon="mdi:chart-timeline-variant"></ha-icon>${esc(d.id)}</button>
          ${this._admin() && this._entryOf?.[d.id] ? `<button class="pri" data-act="edit" data-id="${esc(d.id)}"><ha-icon icon="mdi:cog-outline"></ha-icon>${this._t("edit")}</button>` : ""}
        </div>
      </div>`;
    }

    async _onClick(e) {
      const b = e.target.closest("[data-act]"); if (!b) return;
      if (e.target.closest("select")) return;
      const act = b.dataset.act, h = this._hass;
      try {
        if (act === "open") {
          if (e.target.closest(".da")) return;
          this._open = this._open === b.dataset.id ? null : b.dataset.id; this._forceMenu = null; this._renderDevices();
        } else if (act === "enable") {
          e.stopPropagation(); await h.callService("switch", "toggle", { entity_id: b.dataset.id });
        } else if (act === "forcemenu") {
          e.stopPropagation(); this._forceMenu = this._forceMenu === b.dataset.id ? null : b.dataset.id; this._renderDevices();
        } else if (act === "force") {
          const hrs = Number(b.dataset.h); this._forceMenu = null; this._renderDevices();
          await h.callService(DOMAIN, "start_device", hrs ? { device_id: b.dataset.key, duration: hrs } : { device_id: b.dataset.key });
        } else if (act === "stop") {
          e.stopPropagation(); await h.callService(DOMAIN, "stop_device", { device_id: b.dataset.key });
        } else if (act === "more") {
          const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: b.dataset.id }; this.dispatchEvent(ev);
        } else if (act === "edit") {
          await this._flowStart("options", this._entryOf[b.dataset.id], this._devices().find((x) => x.id === b.dataset.id)?.name);
        } else if (act === "add") {
          await this._flowStart("config", DOMAIN, this._t("add"));
        } else if (act === "f-cancel") { await this._flowCancel();
        } else if (act === "f-submit") { await this._flowSubmit();
        } else if (act === "f-menu") { await this._flowSubmit({ next_step_id: b.dataset.step });
        } else if (act === "f-fix") {
          const v = this._edit.data[b.dataset.field]; this._edit.data = { ...this._edit.data, [b.dataset.field]: String(v).replace(QUOTED, "$1") };
          this._form.data = this._edit.data; this._renderWarn();
        } else if (act === "tab") {
          this._tab = this._tab === b.dataset.t ? null : b.dataset.t; this._renderTabs();
          if (this._tab === "history") { if (Date.now() - (this._histAt || 0) > 5 * 60000) this._loadHistory(); else this._renderHistory(); }
        } else if (act === "devtoggle") {
          clearTimeout(this._dt);
          // laisse le temps au double-clic d'arriver
          if (e.detail > 1) return;
          const id = b.dataset.id;
          this._dt = setTimeout(() => { this._off.has(id) ? this._off.delete(id) : this._off.add(id); this._saveOff(); this._renderHistory(); }, 230);
        } else if (act === "showall") { this._off.clear(); this._saveOff(); this._renderHistory();
        } else if (act === "chart") { this._chart = b.dataset.c; this._renderHistory();
        } else if (act === "mode") { this._mode = b.dataset.m; this._dayOffset = 0; this._histAt = 0; this._loadHistory();
        } else if (act === "dprev") { this._dayOffset = Math.max(-9, this._dayOffset - 1); this._histAt = 0; this._loadHistory();
        } else if (act === "dnext") { this._dayOffset = Math.min(0, this._dayOffset + 1); this._histAt = 0; this._loadHistory(); }
      } catch (err) { this._toast(`${this._t("flow_failed")} : ${err?.message || err?.body?.message || err}`); }
    }
    async _onChange(e) {
      const s = e.target.closest("select[data-select]"); if (!s) return;
      e.stopPropagation();
      try { await this._hass.callService("select", "select_option", { entity_id: s.dataset.select, option: s.value }); }
      catch (err) { this._toast(`${this._t("flow_failed")} : ${err?.message || err}`); }
    }
    _saveOff() { try { localStorage.setItem("holm-so-hidden", JSON.stringify([...this._off])); } catch (_) { /* rien */ } }
    _vis(r) { return r.kwh > 0 && !this._off.has(r.d.id); }
    _toast(message) { this.dispatchEvent(new CustomEvent("hass-notification", { detail: { message }, bubbles: true, composed: true })); }

    // ───────────── réglages : formulaires de Solar Optimizer lui-même ─────────────
    async _ensureForm() {
      if (customElements.get("ha-form") && customElements.get("ha-selector")) return;
      try {
        const helpers = await window.loadCardHelpers?.();
        const card = await helpers?.createCardElement({ type: "entities", entities: [] });
        await card?.constructor?.getConfigElement?.();
      } catch (_) { /* rien */ }
      await customElements.whenDefined("ha-form");
    }
    async _translations(cat) {
      this._tr = this._tr || {};
      const k = `${this._hass.language}/${cat}`;
      if (!this._tr[k]) {
        const r = await this._hass.callWS({ type: "frontend/get_translations", language: this._hass.language, category: cat, integration: [DOMAIN] });
        this._tr[k] = r?.resources || {};
      }
      return this._tr[k];
    }
    _initData(step) {
      const d = {};
      for (const s of step.data_schema || []) {
        const v = s.description?.suggested_value ?? s.default;
        if (v !== undefined) d[s.name] = v;
      }
      return d;
    }
    async _flowStart(kind, handler, title) {
      if (!handler) return;
      if (this._edit) await this._flowCancel(true);
      await this._ensureForm();
      const path = kind === "options" ? "config/config_entries/options/flow" : "config/config_entries/flow";
      const [step, trs, sel] = await Promise.all([
        this._hass.callApi("POST", path, { handler, show_advanced_options: false }),
        this._translations(kind === "options" ? "options" : "config"),
        this._translations("selector"),
      ]);
      this._edit = { kind, path, title, step, data: this._initData(step), trs: { ...trs, ...sel }, busy: false, msg: "" };
      this._renderEditor();
      this.shadowRoot.getElementById("editor")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    async _flowCancel(silent) {
      const ed = this._edit; this._edit = null; this._form = null;
      if (ed?.step?.flow_id && ed.step.type !== "create_entry") this._hass.callApi("DELETE", `${ed.path}/${ed.step.flow_id}`).catch(() => {});
      if (!silent) this._renderEditor();
    }
    async _flowSubmit(payload) {
      const ed = this._edit; if (!ed || ed.busy) return;
      ed.busy = true; this._renderButtons();
      let data = payload;
      if (!data) { data = {}; for (const [k, v] of Object.entries(ed.data || {})) if (v !== undefined && v !== "") data[k] = v; }
      try {
        const step = await this._hass.callApi("POST", `${ed.path}/${ed.step.flow_id}`, data);
        ed.busy = false;
        if (step.type === "create_entry") {
          const msg = ed.kind === "options" ? this._t("saved") : this._t("added");
          this._edit = null; this._form = null; this._renderEditor(); this._toast(msg);
          setTimeout(() => this._boot(), 1500);
          return;
        }
        if (step.type === "abort") {
          ed.msg = ed.trs[`component.${DOMAIN}.${ed.kind === "options" ? "options" : "config"}.abort.${step.reason}`] || step.reason;
          ed.step = step; this._renderEditor(); return;
        }
        const errs = step.errors && Object.keys(step.errors).length;
        if (!errs || step.step_id !== ed.step.step_id) ed.data = this._initData(step);
        ed.step = step; ed.msg = "";
        this._renderEditor();
      } catch (err) {
        ed.busy = false; ed.msg = err?.body?.message || err?.message || String(err); this._renderEditor();
      }
    }
    _k(s) { const ed = this._edit; return `component.${DOMAIN}.${ed.kind === "options" ? "options" : "config"}.step.${ed.step.step_id}.${s}`; }
    _renderEditor() {
      const el = this.shadowRoot?.getElementById("editor"); if (!el) return;
      const ed = this._edit;
      if (!ed) { el.hidden = true; el.innerHTML = ""; return; }
      el.hidden = false;
      const st = ed.step, T = ed.trs;
      const stepTitle = T[this._k("title")] || "";
      const desc = T[this._k("description")] || "";
      const errBase = `component.${DOMAIN}.${ed.kind === "options" ? "options" : "config"}.error.`;
      const errs = Object.entries(st.errors || {}).map(([f, k]) => `${f !== "base" ? (T[this._k("data." + f)] || f) + " : " : ""}${T[errBase + k] || k}`);
      el.innerHTML = `
        <div class="ed">
          <div class="edh"><ha-icon icon="${ed.kind === "options" ? "mdi:cog-outline" : "mdi:plus-circle-outline"}"></ha-icon><div><b>${esc(ed.title || "")}</b>${stepTitle ? `<span>${esc(stepTitle)}</span>` : ""}</div></div>
          ${desc && st.type === "form" ? `<p class="edd">${esc(desc)}</p>` : ""}
          <div id="warn"></div>
          ${st.type === "form" ? `<div id="formhost"></div>` : ""}
          ${st.type === "menu" ? `<div class="menu">${(Array.isArray(st.menu_options) ? st.menu_options : Object.keys(st.menu_options || {})).map((m) => `<button data-act="f-menu" data-step="${esc(m)}">${esc(T[this._k("menu_options." + m)] || m)}</button>`).join("")}</div>` : ""}
          ${errs.length || ed.msg ? `<div class="ederr">${[...errs, ed.msg].filter(Boolean).map(esc).join("<br>")}</div>` : ""}
          ${ed.kind === "options" ? `<p class="hint">${this._t("del_hint")}</p>` : ""}
          <div class="edb" id="edb"></div>
        </div>`;
      if (st.type === "form") {
        const f = document.createElement("ha-form");
        f.hass = this._hass;
        f.schema = st.data_schema || [];
        f.data = ed.data;
        f.computeLabel = (s) => T[this._k("data." + s.name)] || s.name;
        f.computeHelper = (s) => T[this._k("data_description." + s.name)];
        f.localizeValue = (k) => T[`component.${DOMAIN}.selector.${k}`] || "";
        f.addEventListener("value-changed", (e) => { e.stopPropagation(); ed.data = e.detail.value; f.data = ed.data; this._renderWarn(); });
        el.querySelector("#formhost").appendChild(f);
        this._form = f;
      } else this._form = null;
      this._renderWarn();
      this._renderButtons();
    }
    _renderWarn() {
      const w = this.shadowRoot?.getElementById("warn"), ed = this._edit; if (!w || !ed) return;
      const bad = Object.entries(ed.data || {}).filter(([, v]) => typeof v === "string" && QUOTED.test(v));
      w.innerHTML = bad.map(([k]) => `<div class="qw"><ha-icon icon="mdi:alert-outline"></ha-icon><span><b>${esc(ed.trs[this._k("data." + k)] || k)}</b> — ${this._t("quote_warn")}</span><button data-act="f-fix" data-field="${esc(k)}">${this._t("quote_fix")}</button></div>`).join("");
    }
    _renderButtons() {
      const b = this.shadowRoot?.getElementById("edb"), ed = this._edit; if (!b || !ed) return;
      const isForm = ed.step.type === "form";
      const last = ed.kind === "options" || ed.step.last_step === true || ed.step.step_id !== "user";
      b.innerHTML = `<button class="sec" data-act="f-cancel">${this._t("cancel")}</button>
        ${isForm ? `<button class="pri" data-act="f-submit" ${ed.busy ? "disabled" : ""}>${ed.busy ? `<span class="spin"></span>` : ""}${last ? this._t("save") : this._t("next")}</button>` : ""}`;
    }

    // ───────────────────────── historique ─────────────────────────
    _window() {
      const now = new Date();
      if (this._mode === "week") {
        const a = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
        return { a, b: now, end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) };
      }
      const a = new Date(now.getFullYear(), now.getMonth(), now.getDate() + this._dayOffset);
      const end = new Date(a.getFullYear(), a.getMonth(), a.getDate() + 1);
      return { a, b: end < now ? end : now, end };
    }
    async _energyPrefs() {
      if (this._prefs !== undefined) return this._prefs;
      try {
        const p = await this._hass.callWS({ type: "energy/get_prefs" });
        const src = p?.energy_sources || [];
        const solar = src.filter((x) => x.type === "solar" && x.stat_energy_from).map((x) => x.stat_energy_from);
        const imp = [], exp = [];
        for (const g of src.filter((x) => x.type === "grid")) {
          // ancien format (flow_from / flow_to) et nouveau (stat_energy_from / stat_energy_to)
          const from = g.flow_from ? g.flow_from : g.stat_energy_from ? [g] : [];
          const to = g.flow_to ? g.flow_to : g.stat_energy_to ? [g] : [];
          for (const f of from) if (f.stat_energy_from) imp.push({ id: f.stat_energy_from, price: f.entity_energy_price || null, fixed: f.number_energy_price ?? null });
          for (const t of to) if (t.stat_energy_to) exp.push({ id: t.stat_energy_to, price: t.entity_energy_price_export || t.entity_energy_price || null, fixed: t.number_energy_price_export ?? t.number_energy_price ?? null });
        }
        this._prefs = solar.length && imp.length ? { solar, imp, exp } : null;
      } catch (_) { this._prefs = null; }
      return this._prefs;
    }
    async _loadHistory() {
      if (!this._hass || !this.shadowRoot?.getElementById("hist") || this._loading) return;
      const s = this._sources();
      if (!s.production || !s.grid) { this._renderHistory(); return; }
      this._histAt = Date.now();
      this._loading = true;
      if (!this._hist) this._renderHistory();
      const { a, b, end } = this._window();
      const key = `${this._mode}/${a.getTime()}`;
      try {
        const devs = this._devices();
        for (const d of devs) d.psensor = this._powerSensor(d);
        const prefs = await this._energyPrefs();
        const eIds = prefs ? [...prefs.solar, ...prefs.imp.map((x) => x.id), ...prefs.exp.map((x) => x.id)] : [];
        const priceIds = prefs ? [...new Set([...prefs.imp, ...prefs.exp].map((x) => x.price).filter(Boolean))] : [];
        const [stats, hist, estats] = await Promise.all([
          this._hass.callWS({ type: "recorder/statistics_during_period", start_time: a.toISOString(), end_time: b.toISOString(),
            statistic_ids: [...new Set([s.production, s.grid, ...devs.map((d) => d.psensor).filter(Boolean)])], period: "5minute", types: ["mean"], units: { power: "W" } }),
          this._hass.callWS({ type: "history/history_during_period", start_time: a.toISOString(), end_time: b.toISOString(),
            entity_ids: [...devs.map((d) => d.id), ...(s.price ? [s.price] : []), ...priceIds], minimal_response: true, no_attributes: true, significant_changes_only: false }),
          eIds.length ? this._hass.callWS({ type: "recorder/statistics_during_period", start_time: a.toISOString(), end_time: b.toISOString(),
            statistic_ids: eIds, period: "5minute", types: ["change"] }) : Promise.resolve(null),
        ]);
        this._hist = this._compute(stats, hist, devs, a, b, end);
        if (prefs && estats) this._applyEnergy(this._hist, prefs, estats, hist);
        this._histKey = key;
        this._histErr = null;
      } catch (e) { this._histErr = e?.message || String(e); this._histAt = 0; }
      this._loading = false;
      this._renderHistory();
    }
    _series(hist, id, A, B) {
      const rows = (hist[id] || []).map((x) => ({ t: (x.lc !== undefined ? x.lc : x.lu) * 1000, s: x.s })).sort((p, q) => p.t - q.t);
      const out = [];
      for (let i = 0; i < rows.length; i++) {
        const t0 = Math.max(rows[i].t, A), t1 = Math.min(i + 1 < rows.length ? rows[i + 1].t : B, B);
        if (t1 > t0) out.push({ t0, t1, s: rows[i].s });
      }
      return out;
    }
    _compute(stats, hist, devs, a, b, end) {
      const s = this._sources();
      const A = a.getTime(), B = b.getTime();
      const pr = (stats[s.production] || []), gr = (stats[s.grid] || []);
      const gm = new Map(gr.map((x) => [x.start, x.mean]));
      const prices = s.price ? this._series(hist, s.price, A, B) : [];
      const pa = this._st(s.price)?.attributes || {};
      const hcPrice = num(pa.prix_hc), hpPrice = num(pa.prix_hp);
      const priceAt = (t) => { for (const p of prices) if (t >= p.t0 && t < p.t1) return num(p.s); return num(this._st(s.price)?.state) || 0; };
      const isHC = (t) => hcPrice !== null && hcPrice !== hpPrice && Math.abs((priceAt(t) ?? -1) - hcPrice) < 1e-6;
      const sell = this._sellPrice();
      const buckets = [];
      const tot = { prod: 0, self: 0, exp: 0, imp: 0, house: 0, savSelf: 0, savSell: 0 };
      const days = {};
      const dayKey = (t) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
      for (const p of pr) {
        const t = p.start;
        const P = Math.max(0, p.mean || 0), G = gm.has(t) ? (gm.get(t) || 0) : 0;
        const exp = Math.max(0, -G), imp = Math.max(0, G), self = Math.max(0, P - exp), house = imp + self;
        buckets.push({ t, P, house, exp });
        const k = 1 / 12000; // W sur 5 min → kWh
        const price = priceAt(t + 150000) || 0;
        tot.prod += P * k; tot.self += self * k; tot.exp += exp * k; tot.imp += imp * k; tot.house += house * k;
        tot.savSelf += self * k * price; tot.savSell += exp * k * sell;
        const dk = dayKey(t); const dd = (days[dk] = days[dk] || { prod: 0, self: 0, exp: 0, house: 0, sav: 0 });
        dd.prod += P * k; dd.self += self * k; dd.exp += exp * k; dd.house += house * k; dd.sav += self * k * price + exp * k * sell;
      }
      const bmap = new Map(buckets.map((b) => [b.t, b]));
      const hc = [];
      for (const p of prices) if (hcPrice !== null && hcPrice !== hpPrice && Math.abs(num(p.s) - hcPrice) < 1e-6) hc.push([p.t0, p.t1]);
      const runs = devs.map((d) => {
        const segs = this._series(hist, d.id, A, B).filter((x) => x.s === "on").map((x) => ({ t0: x.t0, t1: x.t1, hc: isHC(x.t0 + 1000) }));
        const perDay = {};
        for (const g of segs) {
          // découpe par jour
          let t = g.t0;
          while (t < g.t1) {
            const dk = dayKey(t), next = Math.min(g.t1, dk + 86400000);
            const pd = (perDay[dk] = perDay[dk] || { solar: 0, hc: 0 });
            pd[g.hc ? "hc" : "solar"] += (next - t) / 1000; t = next;
          }
        }
        const total = segs.reduce((n, g) => n + (g.t1 - g.t0) / 1000, 0);
        // puissance par tranche de 5 min : capteur réel si disponible, sinon puissance max × part du temps en marche
        const pw = new Map();
        const rows = d.psensor ? stats[d.psensor] || [] : [];
        const est = !rows.length;
        if (!est) for (const r of rows) pw.set(r.start, Math.max(0, r.mean || 0));
        else {
          const pmax = num(d.s.attributes.power_max) || num(d.opts?.power_max) || 0;
          for (const b of buckets) {
            let on = 0;
            for (const g of segs) on += Math.max(0, Math.min(g.t1, b.t + 300000) - Math.max(g.t0, b.t));
            if (on) pw.set(b.t, pmax * (on / 300000));
          }
        }
        let kwh = 0, solarKwh = 0; const dayKwh = {};
        for (const [t, w] of pw) {
          const e = w / 12000; kwh += e;
          const b = bmap.get(t); const share = b && b.house > 0 ? Math.min(1, Math.max(0, b.P - b.exp) / b.house) : 0;
          solarKwh += e * share;
          const dk = dayKey(t); dayKwh[dk] = (dayKwh[dk] || 0) + e;
        }
        return { d, segs, perDay, total, pw, est, kwh, solarKwh, dayKwh };
      });
      const PAL = ["#22d3ee", "#a78bfa", "#f472b6", "#84cc16", "#fb7185", "#38bdf8", "#facc15", "#34d399"];
      runs.forEach((r, i) => { r.color = PAL[i % PAL.length]; });
      return { A, B, END: end.getTime(), buckets, tot, days, hc, runs };
    }

    // bilans recalculés depuis les compteurs d'énergie (mêmes chiffres que le tableau Énergie)
    _applyEnergy(H, prefs, estats, hist) {
      const ids = [...prefs.solar, ...prefs.imp.map((x) => x.id), ...prefs.exp.map((x) => x.id)];
      const idx = {}; const starts = new Set();
      for (const id of ids) { idx[id] = new Map(); for (const r of estats[id] || []) { idx[id].set(r.start, Math.max(0, r.change || 0)); starts.add(r.start); } }
      if (!starts.size) return;
      const g = (id, t) => idx[id]?.get(t) || 0;
      const s = this._sources();
      const ser = {};
      const at = (id, t) => { const list = (ser[id] = ser[id] || this._series(hist, id, H.A, H.B)); for (const p of list) if (t >= p.t0 && t < p.t1) return num(p.s); return num(this._st(id)?.state); };
      const buyAt = (t) => (s.price ? at(s.price, t) : null) || 0;
      const priceOf = (src, t) => (src.fixed !== null && src.fixed !== undefined ? Number(src.fixed) || 0 : src.price ? at(src.price, t) : null);
      const tot = { prod: 0, self: 0, exp: 0, imp: 0, house: 0, savSelf: 0, savSell: 0, impCost: 0 };
      const days = {};
      const dayKey = (t) => { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); };
      for (const t of [...starts].sort((x, y) => x - y)) {
        const m = t + 150000;
        const P = prefs.solar.reduce((n, id) => n + g(id, t), 0);
        let I = 0, cost = 0, E = 0, gain = 0;
        for (const src of prefs.imp) { const e = g(src.id, t); if (!e) continue; I += e; cost += e * (priceOf(src, m) ?? buyAt(m)); }
        for (const src of prefs.exp) { const e = g(src.id, t); if (!e) continue; E += e; gain += e * (priceOf(src, m) ?? this._sellPrice()); }
        const self = Math.max(0, P - E), bp = buyAt(m);
        tot.prod += P; tot.imp += I; tot.exp += E; tot.self += self; tot.house += I + self;
        tot.impCost += cost; tot.savSell += gain; tot.savSelf += self * bp;
        const dk = dayKey(t); const dd = (days[dk] = days[dk] || { prod: 0, self: 0, exp: 0, house: 0, sav: 0 });
        dd.prod += P; dd.self += self; dd.exp += E; dd.house += I + self; dd.sav += self * bp + gain;
      }
      H.tot = tot; H.days = days; H.energy = true;
    }
    _renderHistory() {
      const el = this.shadowRoot?.getElementById("hist"); if (!el || !this._hass) return;
      const H = this._hist, wk = this._mode === "week";
      const { a } = this._window();
      const dayLbl = this._dayOffset === 0 ? this._t("today") : this._dayOffset === -1 ? this._t("yesterday")
        : new Intl.DateTimeFormat(this._hass?.locale?.language || this._l, { weekday: "short", day: "numeric", month: "short" }).format(a);
      const head = `<div class="hh">
        ${!wk ? `<div class="nav"><button data-act="dprev" ${this._dayOffset <= -9 ? "disabled" : ""}><ha-icon icon="mdi:chevron-left"></ha-icon></button><span>${esc(dayLbl)}</span><button data-act="dnext" ${this._dayOffset >= 0 ? "disabled" : ""}><ha-icon icon="mdi:chevron-right"></ha-icon></button></div>` : `<div class="nav"><span>${this._t("week")}</span></div>`}
        <div class="seg"><button class="${!wk ? "on" : ""}" data-act="mode" data-m="day">${this._t("day")}</button><button class="${wk ? "on" : ""}" data-act="mode" data-m="week">${this._t("week")}</button></div></div>`;
      const stale = !H || this._histKey !== `${this._mode}/${a.getTime()}`;
      if (this._histErr && stale) { el.innerHTML = head + `<div class="msg">${this._t("error")} : ${esc(this._histErr)}</div>`; return; }
      if (stale) { el.innerHTML = head + `<div class="msg">${this._t("loading")}</div>`; return; }
      const T = H.tot;
      if (!H.buckets.length) { el.innerHTML = head + `<div class="msg">${this._t("no_data")}</div>`; return; }
      const selfPct = T.prod > 0 ? (T.self / T.prod) * 100 : 0;
      const cover = T.house > 0 ? (T.self / T.house) * 100 : 0;
      el.innerHTML = head + `
        <div class="kpis">
          <div class="kpi sun"><span>${this._t("kpi_prod")}</span><b>${this._kwh(T.prod)}</b><small>${this._t("kpi_cover")} ${this._nf(cover)} %</small></div>
          <div class="kpi imp"><span>${this._t("kpi_import")}</span><b>${this._kwh(T.imp)}</b><small>${T.impCost !== undefined ? this._t("imp_cost", { a: this._eur(T.impCost) }) : ""}</small></div>
          <div class="kpi exp"><span>${this._t("kpi_sold")}</span><b>${this._kwh(T.exp)}</b><small>+${this._t("sell_gain", { a: this._eur(T.savSell) })}</small></div>
          <div class="kpi self"><span>${this._t("kpi_self")}</span><b>${this._nf(selfPct)} %</b><small>${this._t("self_detail", { a: this._kwh(T.self) })}</small></div>
          <div class="kpi eur"><span>${this._t("kpi_savings")}</span><b>${this._eur(T.savSelf + T.savSell)}</b><small>${this._t("sav_detail", { a: this._eur(T.savSelf), b: this._eur(T.savSell) })}</small></div>
        </div>
        <div class="src">${this._t(H.energy ? "src_energy" : "src_power")}</div>
        <div class="seg ch"><button class="${this._chart === "devices" ? "on" : ""}" data-act="chart" data-c="devices"><ha-icon icon="mdi:power-plug-outline"></ha-icon>${this._t("ch_devices")}</button><button class="${this._chart === "energy" ? "on" : ""}" data-act="chart" data-c="energy"><ha-icon icon="mdi:chart-areaspline"></ha-icon>${this._t("ch_energy")}</button></div>
        ${this._chart === "devices" ? `
        <div class="chart" id="chart">${wk ? this._devWeekChart(H) : this._devDayChart(H)}<div class="tip" id="tip" hidden></div></div>
        ${this._devLegend(H)}` : `
        <div class="chart" id="chart">${wk ? this._weekChart(H) : this._dayChart(H)}<div class="tip" id="tip" hidden></div></div>
        <div class="legend lg2"><span><i class="sunc"></i>${this._t("c_prod")}</span><span><i class="housec"></i>${this._t("c_house")}</span><span><i class="exp"></i>${this._t("c_surplus")}</span>${H.hc.length && !wk ? `<span><i class="hcc"></i>${this._t("offpeak")}</span>` : ""}</div>`}
        <div class="sh sm"><span>${this._t("timeline")}</span></div>
        ${wk ? this._weekRuns(H) : this._dayRuns(H)}
        <div class="legend"><span><i class="solarr"></i>${this._t("hp")}</span><span><i class="hcr"></i>${this._t("hc")}</span></div>`;
      if (!wk) this._bindTip(H, this._chart === "devices"
        ? (b) => `<b>${this._time(new Date(b.t))}</b>${this._off.has("__prod") ? "" : `<span class="sunt">${this._t("c_prod")} ${this._w(b.P)}</span>`}${H.runs.filter((r) => this._vis(r) && (r.pw.get(b.t) || 0) >= 1).map((r) => `<span style="color:${r.color}">${esc(r.d.name)} ${this._w(r.pw.get(b.t))}</span>`).join("")}`
        : (b) => `<b>${this._time(new Date(b.t))}</b><span class="sunt">${this._t("c_prod")} ${this._w(b.P)}</span><span class="houset">${this._t("c_house")} ${this._w(b.house)}</span><span class="expt">${this._t("c_surplus")} ${this._w(b.exp)}</span>`);
    }
    _devDayChart(H) {
      const { W, Hh, pad } = this._geom();
      this._cg = { W, pl: pad.l, iw: W - pad.l - pad.r };
      const iw = W - pad.l - pad.r, ih = Hh - pad.t - pad.b;
      const bk = H.buckets, runs = H.runs.filter((r) => this._vis(r)), showP = !this._off.has("__prod");
      const stackMax = Math.max(...bk.map((b) => runs.reduce((n, r) => n + (r.pw.get(b.t) || 0), 0)), ...(showP ? bk.map((b) => b.P) : []), 10);
      const max = this._nice(stackMax);
      const x = (t) => pad.l + ((t - H.A) / (H.END - H.A)) * iw;
      const y = (v) => pad.t + ih - (v / max) * ih;
      const cum = bk.map(() => 0);
      const layers = runs.map((r) => {
        const lo = cum.slice();
        bk.forEach((b, i) => { cum[i] += r.pw.get(b.t) || 0; });
        const hi = cum.slice();
        let d = "";
        bk.forEach((b, i) => { d += `${i ? "L" : "M"}${x(b.t + 150000).toFixed(1)},${y(hi[i]).toFixed(1)}`; });
        for (let i = bk.length - 1; i >= 0; i--) d += `L${x(bk[i].t + 150000).toFixed(1)},${y(lo[i]).toFixed(1)}`;
        return `<path d="${d}Z" fill="${r.color}" fill-opacity=".75" stroke="${r.color}" stroke-width="1" vector-effect="non-scaling-stroke"/>`;
      });
      const prod = bk.map((b, i) => `${i ? "L" : "M"}${x(b.t + 150000).toFixed(1)},${y(b.P).toFixed(1)}`).join("");
      const ticks = [0, max / 2, max];
      const now = Date.now();
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="svg">
        ${ticks.map((v) => `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${v >= 1000 ? this._nf(v / 1000, v % 1000 ? 1 : 0) + " kW" : this._nf(v) + " W"}</text>`).join("")}
        ${[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => `<text class="ax" x="${x(H.A + h * 3600000)}" y="${Hh - 6}" text-anchor="${h === 0 ? "start" : h === 24 ? "end" : "middle"}">${h}h</text>`).join("")}
        ${showP ? `<path class="a-sun soft" d="${bk.length ? `M${x(bk[0].t + 150000)},${y(0)}${prod.replace(/^M/, "L")}L${x(bk[bk.length - 1].t + 150000)},${y(0)}Z` : ""}"/>` : ""}
        ${layers.join("")}
        ${showP ? `<path class="l-sun dash" d="${prod}"/>` : ""}
        ${now > H.A && now < H.END ? `<line class="now" x1="${x(now)}" x2="${x(now)}" y1="${pad.t}" y2="${pad.t + ih}"/>` : ""}
        <line class="guide" id="guide" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" style="display:none"/>
        <rect class="hov" id="hov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}"/>
      </svg>`;
    }
    _devWeekChart(H) {
      const { W, Hh, pad } = this._geom();
      const iw = W - pad.l - pad.r, ih = Hh - pad.t - pad.b;
      const keys = []; for (let i = 0; i < 7; i++) { const d = new Date(H.A); keys.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i).getTime()); }
      const runs = H.runs.filter((r) => this._vis(r)), showP = !this._off.has("__prod");
      const max = this._nice(Math.max(...keys.map((k) => Math.max(runs.reduce((n, r) => n + (r.dayKwh[k] || 0), 0), showP ? H.days[k]?.prod || 0 : 0)), 0.1));
      const y = (v) => pad.t + ih - (v / max) * ih;
      const slot = iw / 7, bw = slot * 0.5;
      const fmtD = new Intl.DateTimeFormat(this._hass?.locale?.language || this._l, { weekday: "short", day: "numeric" });
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="svg">
        ${[0, max / 2, max].map((v) => `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${this._nf(v, v < 1 ? 2 : v < 10 && v % 1 ? 1 : 0)} kWh</text>`).join("")}
        ${keys.map((k, i) => {
          const cx = pad.l + slot * i + slot / 2;
          let acc = 0;
          const bars = runs.map((r) => { const v = r.dayKwh[k] || 0; const y0 = y(acc), y1 = y(acc + v); acc += v;
            return v ? `<rect x="${cx - bw / 2}" y="${y1}" width="${bw}" height="${Math.max(0, y0 - y1)}" fill="${r.color}" fill-opacity=".8"><title>${esc(r.d.name)} — ${this._kwh(v)}</title></rect>` : ""; }).join("");
          const pv = showP ? H.days[k]?.prod || 0 : 0;
          return `<g>${bars}${pv ? `<line class="pmark" x1="${cx - bw / 2 - 4}" x2="${cx + bw / 2 + 4}" y1="${y(pv)}" y2="${y(pv)}"><title>${this._t("c_prod")} ${this._kwh(pv)}</title></line>` : ""}
            <text class="ax" x="${cx}" y="${Hh - 6}" text-anchor="middle">${esc(fmtD.format(new Date(k)))}</text></g>`;
        }).join("")}
      </svg>`;
    }
    _devLegend(H) {
      const runs = H.runs;
      if (!runs.length) return "";
      const any = runs.some((r) => r.est && r.kwh > 0);
      const offAny = runs.some((r) => r.kwh > 0 && this._off.has(r.d.id)) || this._off.has("__prod");
      const pOff = this._off.has("__prod");
      return `<div class="dlist" title="${this._t("toggle_hint")}">${runs.map((r) => {
          const off = this._off.has(r.d.id);
          return r.kwh > 0 ? `<button class="dli ${off ? "off" : ""}" data-act="devtoggle" data-id="${esc(r.d.id)}" aria-pressed="${!off}">
          <i style="background:${r.color}"></i><span class="n">${esc(r.d.name)}</span>
          <span class="v">${r.est ? "≈ " : ""}${this._kwh(r.kwh)}</span>
          <span class="s">${this._t("solar_share", { a: this._nf((r.solarKwh / r.kwh) * 100) })}</span></button>`
          : `<div class="dli z"><i style="background:${r.color}"></i><span class="n">${esc(r.d.name)}</span><span class="v">${this._kwh(0)}</span><span class="s">—</span></div>`;
        }).join("")}
        <div class="dfoot">
          <button class="dli prod ${pOff ? "off" : ""}" data-act="devtoggle" data-id="__prod" aria-pressed="${!pOff}"><i class="sunc"></i><span class="n">${this._t("c_prod")}</span></button>
          ${offAny ? `<button class="lnk all" data-act="showall"><ha-icon icon="mdi:eye-outline"></ha-icon>${this._t("show_all")}</button>` : ""}
        </div>
        <div class="legend"><span class="hint">${this._t("toggle_hint")}</span>${any ? `<span class="est">${this._t("estimated")}</span>` : ""}</div></div>`;
    }
    _nice(v) { if (v <= 0) return 1000; const p = Math.pow(10, Math.floor(Math.log10(v))); const n = v / p; return ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => n <= x) || 10) * p; }
    _geom() {
      const el = this.shadowRoot?.getElementById("hist");
      const W = Math.max(260, Math.round((el?.clientWidth || 632) - 32));
      return { W, Hh: W < 480 ? 180 : 210, pad: { l: 46, r: 6, t: 10, b: 22 } };
    }
    _dayChart(H) {
      const { W, Hh, pad } = this._geom();
      this._cg = { W, pl: pad.l, iw: W - pad.l - pad.r };
      const iw = W - pad.l - pad.r, ih = Hh - pad.t - pad.b;
      const max = this._nice(Math.max(...H.buckets.map((b) => Math.max(b.P, b.house)), 100));
      const x = (t) => pad.l + ((t - H.A) / (H.END - H.A)) * iw;
      const y = (v) => pad.t + ih - (v / max) * ih;
      const bk = H.buckets;
      const area = (f) => {
        if (!bk.length) return "";
        let d = `M${x(bk[0].t).toFixed(1)},${y(0).toFixed(1)}`;
        for (const b of bk) d += `L${x(b.t + 150000).toFixed(1)},${y(f(b)).toFixed(1)}`;
        return d + `L${x(bk[bk.length - 1].t + 300000).toFixed(1)},${y(0).toFixed(1)}Z`;
      };
      const line = (f) => bk.map((b, i) => `${i ? "L" : "M"}${x(b.t + 150000).toFixed(1)},${y(f(b)).toFixed(1)}`).join("");
      const ticks = [0, max / 2, max];
      const hrs = [0, 3, 6, 9, 12, 15, 18, 21, 24];
      const now = Date.now();
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="svg">
        ${H.hc.map(([t0, t1]) => `<rect class="hcband" x="${x(t0).toFixed(1)}" y="${pad.t}" width="${Math.max(0, x(t1) - x(t0)).toFixed(1)}" height="${ih}"/>`).join("")}
        ${ticks.map((v) => `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${v >= 1000 ? this._nf(v / 1000, v % 1000 ? 1 : 0) + " kW" : this._nf(v) + " W"}</text>`).join("")}
        ${hrs.map((h) => `<text class="ax" x="${x(H.A + h * 3600000)}" y="${Hh - 6}" text-anchor="${h === 0 ? "start" : h === 24 ? "end" : "middle"}">${h}h</text>`).join("")}
        <path class="a-sun" d="${area((b) => b.P)}"/>
        <path class="a-exp" d="${area((b) => b.exp)}"/>
        <path class="l-sun" d="${line((b) => b.P)}"/>
        <path class="l-house" d="${line((b) => b.house)}"/>
        ${now > H.A && now < H.END ? `<line class="now" x1="${x(now)}" x2="${x(now)}" y1="${pad.t}" y2="${pad.t + ih}"/>` : ""}
        <line class="guide" id="guide" x1="0" x2="0" y1="${pad.t}" y2="${pad.t + ih}" style="display:none"/>
        <rect class="hov" id="hov" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}"/>
      </svg>`;
    }
    _bindTip(H, html) {
      const svg = this.shadowRoot.querySelector("#chart svg"), hov = this.shadowRoot.getElementById("hov"), tip = this.shadowRoot.getElementById("tip"), guide = this.shadowRoot.getElementById("guide");
      if (!svg || !hov) return;
      const { W, pl, iw } = this._cg;
      const move = (ev) => {
        const r = svg.getBoundingClientRect();
        const vx = ((ev.clientX - r.left) / r.width) * W;
        const t = H.A + ((vx - pl) / iw) * (H.END - H.A);
        let best = null, bd = Infinity;
        for (const b of H.buckets) { const d = Math.abs(b.t + 150000 - t); if (d < bd) { bd = d; best = b; } }
        if (!best || bd > 900000) { tip.hidden = true; guide.style.display = "none"; return; }
        const gx = pl + ((best.t + 150000 - H.A) / (H.END - H.A)) * iw;
        guide.setAttribute("x1", gx); guide.setAttribute("x2", gx); guide.style.display = "";
        tip.hidden = false;
        tip.innerHTML = html(best);
        const px = ((gx / W) * r.width);
        tip.style.left = `${Math.min(Math.max(px - tip.offsetWidth / 2, 0), r.width - tip.offsetWidth)}px`;
      };
      hov.addEventListener("pointermove", move);
      hov.addEventListener("pointerdown", move);
      hov.addEventListener("pointerleave", () => { tip.hidden = true; guide.style.display = "none"; });
    }
    _weekChart(H) {
      const { W, Hh, pad } = this._geom();
      const iw = W - pad.l - pad.r, ih = Hh - pad.t - pad.b;
      const keys = []; for (let i = 0; i < 7; i++) { const d = new Date(H.A); keys.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i).getTime()); }
      const max = this._nice(Math.max(...keys.map((k) => Math.max(H.days[k]?.prod || 0, H.days[k]?.house || 0)), 1));
      const y = (v) => pad.t + ih - (v / max) * ih;
      const slot = iw / 7, bw = slot * 0.34;
      const fmtD = new Intl.DateTimeFormat(this._hass?.locale?.language || this._l, { weekday: "short", day: "numeric" });
      const ticks = [0, max / 2, max];
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" class="svg">
        ${ticks.map((v) => `<line class="grid" x1="${pad.l}" x2="${W - pad.r}" y1="${y(v)}" y2="${y(v)}"/><text class="ax" x="${pad.l - 6}" y="${y(v) + 4}" text-anchor="end">${this._nf(v, v < 10 && v % 1 ? 1 : 0)} kWh</text>`).join("")}
        ${keys.map((k, i) => {
          const d = H.days[k] || { prod: 0, self: 0, exp: 0, house: 0, sav: 0 };
          const cx = pad.l + slot * i + slot / 2;
          const x1 = cx - bw - 2, x2 = cx + 2;
          return `<g><title>${fmtD.format(new Date(k))} — ${this._t("c_prod")} ${this._kwh(d.prod)} (${this._t("kpi_self")} ${this._kwh(d.self)}, ${this._t("kpi_sold")} ${this._kwh(d.exp)}) · ${this._t("c_house")} ${this._kwh(d.house)} · ${this._eur(d.sav)}</title>
            <rect class="b-self" x="${x1}" y="${y(d.self)}" width="${bw}" height="${Math.max(0, y(0) - y(d.self))}" rx="3"/>
            <rect class="b-exp" x="${x1}" y="${y(d.self + d.exp)}" width="${bw}" height="${Math.max(0, y(d.self) - y(d.self + d.exp))}" rx="3"/>
            <rect class="b-house" x="${x2}" y="${y(d.house)}" width="${bw}" height="${Math.max(0, y(0) - y(d.house))}" rx="3"/>
            <text class="ax" x="${cx}" y="${Hh - 6}" text-anchor="middle">${esc(fmtD.format(new Date(k)))}</text></g>`;
        }).join("")}
      </svg>`;
    }
    _dayRuns(H) {
      if (!H.runs.length) return `<div class="msg">${this._t("no_devices")}</div>`;
      const span = H.END - H.A;
      return `<div class="runs">${H.runs.map((r) => `<div class="run">
        <span class="rn">${esc(r.d.name)}</span>
        <div class="track">${[6, 12, 18].map((h) => `<i class="tk" style="left:${(h / 24) * 100}%"></i>`).join("")}${r.segs.map((g) => `<i class="sg ${g.hc ? "hc" : ""}" style="left:${(((g.t0 - H.A) / span) * 100).toFixed(2)}%;width:${Math.max(0.3, ((g.t1 - g.t0) / span) * 100).toFixed(2)}%" title="${this._time(new Date(g.t0))} – ${this._time(new Date(g.t1))} · ${this._dur((g.t1 - g.t0) / 1000)}"></i>`).join("")}</div>
        <span class="rt">${r.total ? this._dur(r.total) : "—"}</span></div>`).join("")}</div>`;
    }
    _weekRuns(H) {
      if (!H.runs.length) return `<div class="msg">${this._t("no_devices")}</div>`;
      const keys = []; for (let i = 0; i < 7; i++) { const d = new Date(H.A); keys.push(new Date(d.getFullYear(), d.getMonth(), d.getDate() + i).getTime()); }
      const max = Math.max(3600, ...H.runs.flatMap((r) => keys.map((k) => (r.perDay[k]?.solar || 0) + (r.perDay[k]?.hc || 0))));
      const fmtD = new Intl.DateTimeFormat(this._hass?.locale?.language || this._l, { weekday: "narrow" });
      return `<div class="runs wk">
        <div class="run hd"><span class="rn"></span><div class="cells">${keys.map((k) => `<span>${esc(fmtD.format(new Date(k)))}</span>`).join("")}</div><span class="rt">${this._t("total")}</span></div>
        ${H.runs.map((r) => `<div class="run"><span class="rn">${esc(r.d.name)}</span><div class="cells">${keys.map((k) => {
          const p = r.perDay[k] || { solar: 0, hc: 0 }, t = p.solar + p.hc;
          return `<span class="cell" title="${this._dur(t)}${p.hc ? ` (${this._t("offpeak")} ${this._dur(p.hc)})` : ""}"><i class="cs" style="height:${((p.solar / max) * 100).toFixed(1)}%"></i><i class="ch" style="height:${((p.hc / max) * 100).toFixed(1)}%"></i></span>`;
        }).join("")}</div><span class="rt">${r.total ? this._dur(r.total) : "—"}</span></div>`).join("")}
      </div>`;
    }
  }

  // ───────────────────────── styles ─────────────────────────
  const STYLE = `
    :host { --so-sun: #f5a524; --so-exp: #14b8a6; --so-house: #60a5fa; --so-hc: #a78bfa; --so-warn: #f97316; --so-radius: 14px;
            --so-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent); --so-line: color-mix(in srgb, var(--divider-color) 70%, transparent); }
    ha-card { display: block; padding: 4px 0 14px; container-type: inline-size; overflow: hidden; }
    section { padding: 0 16px; }
    .hdr { display: flex; align-items: center; gap: 10px; padding: 14px 16px 10px; }
    .logo { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; flex: none;
            background: linear-gradient(135deg, color-mix(in srgb, var(--so-sun) 35%, transparent), color-mix(in srgb, var(--so-exp) 30%, transparent)); }
    .logo ha-icon { --mdc-icon-size: 20px; color: var(--primary-text-color); }
    .ttl { flex: 1; font-size: 16px; font-weight: 600; color: var(--primary-text-color); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .price { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; padding: 5px 10px; border-radius: 999px; white-space: nowrap;
             background: color-mix(in srgb, var(--so-sun) 16%, transparent); color: var(--primary-text-color); }
    .price.hc { background: color-mix(in srgb, var(--so-hc) 20%, transparent); }
    .price ha-icon { --mdc-icon-size: 15px; }
    .price:empty { display: none; }
    .msg { padding: 12px 0; color: var(--secondary-text-color); font-size: 14px; }

    /* direct */
    .live { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); gap: 12px; align-items: stretch; }
    .big { border-radius: var(--so-radius); padding: 12px 14px; display: flex; flex-direction: column; justify-content: center;
           background: linear-gradient(140deg, color-mix(in srgb, var(--so-exp) 26%, transparent), color-mix(in srgb, var(--so-exp) 8%, transparent));
           border: 1px solid color-mix(in srgb, var(--so-exp) 35%, transparent); }
    .big.neg { background: linear-gradient(140deg, color-mix(in srgb, var(--so-house) 22%, transparent), color-mix(in srgb, var(--so-house) 6%, transparent));
               border-color: color-mix(in srgb, var(--so-house) 30%, transparent); }
    .big .lbl { font-size: 12px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--secondary-text-color); }
    .big .val { font-size: 30px; font-weight: 700; line-height: 1.15; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }
    .big .sub { display: flex; align-items: center; gap: 4px; font-size: 12px; color: var(--secondary-text-color); }
    .big .sub ha-icon { --mdc-icon-size: 15px; }
    .big.pos .val { color: var(--so-exp); }
    .stats { display: grid; grid-template-rows: repeat(3, 1fr); gap: 6px; }
    .stat { display: flex; align-items: center; gap: 10px; padding: 6px 10px; border-radius: 12px; background: var(--so-soft); }
    .stat ha-icon { --mdc-icon-size: 20px; flex: none; }
    .stat.sun ha-icon { color: var(--so-sun); } .stat.home ha-icon { color: var(--so-house); } .stat.so ha-icon { color: var(--primary-color); }
    .stat div { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; flex: 1; min-width: 0; }
    .stat b { font-size: 15px; font-variant-numeric: tabular-nums; color: var(--primary-text-color); order: 2; white-space: nowrap; }
    .stat span { font-size: 13px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bars { margin-top: 10px; display: grid; gap: 4px; }
    .bl { font-size: 11.5px; color: var(--secondary-text-color); margin-top: 2px; }
    .bar { height: 7px; border-radius: 99px; background: var(--so-soft); overflow: hidden; display: flex; }
    .bar i { display: block; height: 100%; transition: width .8s ease; }
    i.self { background: var(--so-sun); } i.exp { background: var(--so-exp); } i.imp { background: var(--so-house); }
    .legend { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 11.5px; color: var(--secondary-text-color); margin-top: 4px; }
    .legend span { display: inline-flex; align-items: center; gap: 5px; }
    .legend i { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
    .legend i.sunc { background: var(--so-sun); } .legend i.housec { background: var(--so-house); } .legend i.hcc { background: color-mix(in srgb, var(--so-hc) 35%, transparent); }
    .legend i.solarr { background: var(--so-sun); } .legend i.hcr { background: var(--so-hc); }

    /* en-têtes de section */
    .sh { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 18px 0 8px; font-size: 12px; font-weight: 700;
          letter-spacing: .5px; text-transform: uppercase; color: var(--secondary-text-color); }
    .sh.sm { margin-top: 14px; }
    select { font: inherit; color: var(--primary-text-color); background: var(--so-soft); border: 1px solid var(--so-line); border-radius: 999px;
             padding: 4px 24px 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer; appearance: none; -webkit-appearance: none;
             background-image: linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%);
             background-position: calc(100% - 13px) 55%, calc(100% - 9px) 55%; background-size: 4px 4px; background-repeat: no-repeat; text-transform: none; letter-spacing: 0; }
    select option { background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color); }
    .wsel { display: inline-flex; align-items: center; gap: 4px; }
    .wsel ha-icon { --mdc-icon-size: 16px; }

    /* appareils */
    .devs { display: flex; flex-direction: column; gap: 8px; }
    .dev { border-radius: var(--so-radius); background: var(--so-soft); border: 1px solid transparent; transition: border-color .3s, background .3s; }
    .dev.on, .dev.forced, .dev.offpeak { border-color: color-mix(in srgb, var(--so-sun) 40%, transparent); background: color-mix(in srgb, var(--so-sun) 9%, transparent); }
    .dev.offpeak { border-color: color-mix(in srgb, var(--so-hc) 45%, transparent); background: color-mix(in srgb, var(--so-hc) 10%, transparent); }
    .dr { display: flex; align-items: center; gap: 12px; padding: 10px 12px; cursor: pointer; }
    .ic { position: relative; flex: none; width: 40px; height: 40px; border-radius: 12px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--secondary-text-color) 14%, transparent); }
    .ic ha-icon { --mdc-icon-size: 22px; color: var(--secondary-text-color); }
    .ic .dot { position: absolute; right: -2px; bottom: -2px; width: 10px; height: 10px; border-radius: 50%; background: var(--disabled-text-color, #777);
               border: 2px solid var(--ha-card-background, var(--card-background-color, #1c1c1c)); }
    .dev.on .ic, .dev.forced .ic { background: color-mix(in srgb, var(--so-sun) 25%, transparent); }
    .dev.on .ic ha-icon, .dev.forced .ic ha-icon { color: var(--so-sun); }
    .dev.on .dot, .dev.forced .dot { background: var(--so-sun); animation: ping 1.8s ease-out infinite; }
    .dev.offpeak .ic { background: color-mix(in srgb, var(--so-hc) 25%, transparent); } .dev.offpeak .ic ha-icon { color: var(--so-hc); } .dev.offpeak .dot { background: var(--so-hc); }
    .dev.idle .dot, .dev.wait .dot { background: var(--so-exp); }
    .dev.warn .dot { background: var(--so-warn); }
    .dm { flex: 1; min-width: 0; }
    .dn { display: flex; align-items: baseline; gap: 8px; }
    .nm { font-weight: 600; font-size: 14.5px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .pw { font-size: 12px; font-weight: 700; color: var(--so-sun); white-space: nowrap; }
    .ds { font-size: 12.5px; color: var(--secondary-text-color); margin: 1px 0 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dev.warn .ds { color: var(--so-warn); } .dev.forced .ds { color: var(--so-sun); font-weight: 600; }
    .gauge { position: relative; height: 6px; border-radius: 99px; background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
    .gauge .fill { position: absolute; inset: 0 auto 0 0; border-radius: 99px; background: color-mix(in srgb, var(--so-sun) 80%, var(--so-exp)); transition: width .8s ease; }
    .gauge .fill.ok { background: var(--so-exp); }
    .gauge .mk { position: absolute; top: -3px; bottom: -3px; width: 2px; margin-left: -1px; border-radius: 2px; background: var(--primary-text-color); opacity: .55; }
    .dt { display: flex; justify-content: space-between; gap: 8px; font-size: 11.5px; color: var(--secondary-text-color); margin-top: 4px; font-variant-numeric: tabular-nums; }
    .dt b { color: var(--primary-text-color); }
    .dt { flex-wrap: wrap; } .dt span { white-space: nowrap; }
    .da { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex: none; }
    .prio.p4, .prio.p3 { border-color: color-mix(in srgb, var(--so-sun) 50%, transparent); }
    .prio.p0, .prio.p1 { opacity: .8; }
    .btns { display: flex; align-items: center; gap: 8px; }
    .tg { position: relative; width: 38px; height: 22px; border-radius: 99px; border: 0; padding: 0; cursor: pointer; background: color-mix(in srgb, var(--primary-text-color) 22%, transparent); transition: background .25s; }
    .tg i { position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform .25s; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
    .tg.on { background: var(--primary-color); } .tg.on i { transform: translateX(16px); }
    .fb { width: 32px; height: 32px; border-radius: 10px; border: 1px solid var(--so-line); background: transparent; color: var(--so-sun); cursor: pointer; display: grid; place-items: center; }
    .fb ha-icon { --mdc-icon-size: 18px; }
    .fb:hover { background: color-mix(in srgb, var(--so-sun) 15%, transparent); }
    .fb.stop { color: var(--so-warn); border-color: color-mix(in srgb, var(--so-warn) 45%, transparent); }
    .fm { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; padding: 0 12px 10px 64px; font-size: 12.5px; color: var(--secondary-text-color); }
    .fm button, .menu button { font: inherit; font-weight: 600; font-size: 12.5px; border: 1px solid color-mix(in srgb, var(--so-sun) 45%, transparent); color: var(--primary-text-color);
                  background: color-mix(in srgb, var(--so-sun) 12%, transparent); border-radius: 999px; padding: 5px 12px; cursor: pointer; }
    .fm button:hover { background: color-mix(in srgb, var(--so-sun) 25%, transparent); }
    .det { padding: 2px 12px 12px 64px; }
    .kv { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px 14px; }
    .kv div { display: flex; flex-direction: column; min-width: 0; }
    .kv span { font-size: 11px; color: var(--secondary-text-color); }
    .kv b { font-size: 13px; font-weight: 600; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cond { margin-top: 8px; font-size: 11px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; }
    .cond code { font-size: 12px; color: var(--primary-text-color); background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); padding: 4px 8px; border-radius: 8px; overflow-x: auto; white-space: nowrap; }
    .cond.bad code { outline: 1px solid color-mix(in srgb, var(--so-warn) 60%, transparent); }
    .cond em { color: var(--so-warn); font-style: normal; font-size: 12px; }
    .dbtns { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin-top: 10px; }
    button.lnk, button.pri, button.sec, .add { font: inherit; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; border-radius: 999px; font-size: 13px; font-weight: 600; }
    button.lnk { border: 0; background: none; color: var(--secondary-text-color); padding: 4px 0; font-weight: 500; font-size: 12px; }
    button.lnk ha-icon, button.pri ha-icon, .add ha-icon { --mdc-icon-size: 17px; }
    button.pri { border: 0; background: var(--primary-color); color: var(--text-primary-color, #fff); padding: 7px 14px; }
    button.pri:disabled { opacity: .6; cursor: default; }
    button.sec { border: 1px solid var(--so-line); background: none; color: var(--primary-text-color); padding: 7px 14px; }
    .add { margin-top: 10px; padding: 8px 14px; border: 1px dashed var(--so-line); background: none; color: var(--primary-color); }
    .add:hover { background: color-mix(in srgb, var(--primary-color) 10%, transparent); }

    /* éditeur de réglages */
    #editor { margin-top: 10px; }
    .ed { border-radius: var(--so-radius); border: 1px solid color-mix(in srgb, var(--primary-color) 40%, transparent); padding: 14px; background: color-mix(in srgb, var(--primary-color) 5%, transparent); }
    .edh { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
    .edh ha-icon { color: var(--primary-color); }
    .edh div { display: flex; flex-direction: column; }
    .edh b { color: var(--primary-text-color); } .edh span { font-size: 12px; color: var(--secondary-text-color); }
    .edd, .hint { font-size: 12.5px; color: var(--secondary-text-color); margin: 4px 0 10px; }
    .hint { margin-top: 10px; }
    .qw { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; padding: 8px 10px; margin-bottom: 10px; border-radius: 10px; font-size: 12.5px;
          background: color-mix(in srgb, var(--so-warn) 14%, transparent); color: var(--primary-text-color); }
    .qw ha-icon { color: var(--so-warn); --mdc-icon-size: 18px; } .qw span { flex: 1; min-width: 180px; }
    .qw button { font: inherit; font-size: 12px; font-weight: 600; border: 0; border-radius: 999px; padding: 5px 12px; cursor: pointer; background: var(--so-warn); color: #fff; }
    .ederr { margin-top: 8px; padding: 8px 10px; border-radius: 10px; font-size: 13px; background: color-mix(in srgb, var(--error-color, #db4437) 14%, transparent); color: var(--error-color, #db4437); }
    .menu { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0; }
    .edb { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
    .spin { width: 13px; height: 13px; border-radius: 50%; border: 2px solid currentColor; border-right-color: transparent; animation: spin .8s linear infinite; }

    /* historique */
    .seg { display: inline-flex; padding: 2px; border-radius: 999px; background: var(--so-soft); text-transform: none; letter-spacing: 0; }
    .seg button { font: inherit; font-size: 12px; font-weight: 600; border: 0; background: none; color: var(--secondary-text-color); padding: 4px 12px; border-radius: 999px; cursor: pointer; }
    .seg button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    .hh { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin: 12px 0 10px; }
    .nav { display: flex; align-items: center; gap: 4px; font-size: 13.5px; font-weight: 600; color: var(--primary-text-color); }
    .nav button { border: 0; background: none; color: var(--primary-text-color); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: grid; place-items: center; }
    .nav button:disabled { opacity: .25; cursor: default; } .nav button:not(:disabled):hover { background: var(--so-soft); }
    .nav span { min-width: 96px; text-align: center; text-transform: capitalize; }
    .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(104px, 1fr)); gap: 8px; }
    .kpi.imp { border-top-color: var(--so-house); }
    .src { font-size: 10.5px; color: var(--secondary-text-color); opacity: .75; text-align: right; margin-top: 4px; }
    .tabs { display: grid; gap: 4px; margin: 14px 16px 2px; padding: 4px; border-radius: 14px; background: var(--so-soft);
            box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 8%, transparent); }
    .tabs[hidden], .pane[hidden] { display: none; }
    .tabs button { position: relative; display: flex; align-items: center; justify-content: center; gap: 6px; height: 36px; border: 0; border-radius: 11px; background: none;
                   font: inherit; font-size: 12.5px; font-weight: 700; color: var(--secondary-text-color); cursor: pointer; transition: background .25s, color .25s; }
    .tabs button ha-icon { --mdc-icon-size: 17px; }
    .tabs button.on { background: color-mix(in srgb, var(--primary-color) 20%, transparent); color: var(--primary-text-color); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-color) 45%, transparent); }
    .tabs button.on ha-icon { color: var(--primary-color); }
    .tabs .cnt { font-style: normal; font-size: 10.5px; min-width: 16px; height: 16px; line-height: 16px; padding: 0 4px; border-radius: 99px; background: var(--so-sun); color: #111; }
    .sh.top { margin-top: 12px; }
    .seg.ch { display: flex; margin: 14px 0 0; }
    .seg.ch button { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 6px 12px; }
    .seg.ch ha-icon { --mdc-icon-size: 16px; }
    .svg .a-sun.soft { fill: color-mix(in srgb, var(--so-sun) 12%, transparent); }
    .svg .l-sun.dash { stroke-dasharray: 5 4; }
    .svg .pmark { stroke: var(--so-sun); stroke-width: 2.5; stroke-dasharray: 4 3; }
    .dlist { display: flex; flex-direction: column; gap: 5px; margin-top: 8px; }
    .dli { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto 76px; align-items: center; gap: 8px; font-size: 13px; color: var(--primary-text-color);
           font: inherit; font-size: 13px; text-align: left; width: 100%; background: none; border: 0; padding: 4px 6px; margin: 0 -6px; border-radius: 8px; }
    button.dli { cursor: pointer; user-select: none; -webkit-user-select: none; transition: opacity .2s, background .2s; }
    button.dli:hover { background: var(--so-soft); }
    button.dli.off { opacity: .4; } button.dli.off .n { text-decoration: line-through; }
    button.dli.off i { background: transparent !important; box-shadow: inset 0 0 0 2px var(--secondary-text-color); }
    .dli.prod { grid-template-columns: 10px auto; width: auto; }
    .dli.prod i.sunc { background: var(--so-sun); }
    .dfoot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .lnk.all { font-size: 12px; }
    .legend .hint { opacity: .8; }
    .dli i { width: 10px; height: 10px; border-radius: 3px; }
    .dli .n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dli .v { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .dli .s { font-size: 12px; color: var(--secondary-text-color); text-align: right; white-space: nowrap; }
    .dli.z { opacity: .5; }
    .legend .est { font-style: italic; }
    .kpi { border-radius: 12px; padding: 9px 11px; background: var(--so-soft); display: flex; flex-direction: column; min-width: 0; border-top: 3px solid transparent; }
    .kpi.sun { border-top-color: var(--so-sun); } .kpi.self { border-top-color: color-mix(in srgb, var(--so-sun) 60%, var(--so-exp)); } .kpi.exp { border-top-color: var(--so-exp); } .kpi.eur { border-top-color: var(--primary-color); }
    .kpi span { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .kpi b { font-size: 18px; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .kpi small { font-size: 11px; line-height: 1.3; color: var(--secondary-text-color); }
    .chart { position: relative; margin-top: 12px; }
    .svg { display: block; width: 100%; height: auto; overflow: visible; }
    .svg .grid { stroke: var(--so-line); stroke-width: 1; vector-effect: non-scaling-stroke; stroke-dasharray: 3 4; }
    .svg .ax { fill: var(--secondary-text-color); font-size: 11px; }
    .svg .hcband { fill: color-mix(in srgb, var(--so-hc) 13%, transparent); }
    .svg .a-sun { fill: color-mix(in srgb, var(--so-sun) 22%, transparent); }
    .svg .a-exp { fill: color-mix(in srgb, var(--so-exp) 45%, transparent); }
    .svg .l-sun { fill: none; stroke: var(--so-sun); stroke-width: 2; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .svg .l-house { fill: none; stroke: var(--so-house); stroke-width: 1.6; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .svg .now { stroke: var(--primary-color); stroke-width: 1.5; vector-effect: non-scaling-stroke; stroke-dasharray: 2 3; }
    .svg .guide { stroke: var(--primary-text-color); stroke-width: 1; vector-effect: non-scaling-stroke; opacity: .5; }
    .svg .hov { fill: transparent; cursor: crosshair; touch-action: pan-y; }
    .svg .b-self { fill: var(--so-sun); } .svg .b-exp { fill: var(--so-exp); } .svg .b-house { fill: color-mix(in srgb, var(--so-house) 65%, transparent); }
    .tip { position: absolute; top: -4px; pointer-events: none; display: flex; flex-direction: column; gap: 1px; font-size: 12px; padding: 7px 10px; border-radius: 10px;
           background: var(--card-background-color, #222); color: var(--primary-text-color); box-shadow: 0 4px 14px rgba(0,0,0,.25); border: 1px solid var(--so-line); white-space: nowrap; z-index: 2; }
    .tip[hidden] { display: none; }
    .tip .sunt { color: var(--so-sun); } .tip .houset { color: var(--so-house); } .tip .expt { color: var(--so-exp); }
    .runs { display: flex; flex-direction: column; gap: 7px; }
    .run { display: grid; grid-template-columns: minmax(80px, 150px) 1fr 64px; align-items: center; gap: 10px; }
    .rn { font-size: 13px; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .rt { font-size: 12.5px; font-weight: 600; text-align: right; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .track { position: relative; height: 14px; border-radius: 6px; background: var(--so-soft); overflow: hidden; }
    .track .tk { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--so-line); }
    .track .sg { position: absolute; top: 2px; bottom: 2px; border-radius: 4px; background: var(--so-sun); }
    .track .sg.hc { background: var(--so-hc); }
    .cells { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; }
    .run.hd .cells span, .run.hd .rt { font-size: 11px; color: var(--secondary-text-color); text-align: center; font-weight: 600; text-transform: capitalize; }
    .run.hd .rt { text-align: right; }
    .cell { position: relative; height: 24px; border-radius: 6px; background: var(--so-soft); overflow: hidden; display: flex; flex-direction: column-reverse; }
    .cell i { display: block; width: 100%; }
    .cell .cs { background: var(--so-sun); } .cell .ch { background: var(--so-hc); }

    @keyframes ping { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--so-sun) 70%, transparent); } 100% { box-shadow: 0 0 0 7px transparent; } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (prefers-reduced-motion: reduce) { .dot, .spin { animation: none !important; } .bar i, .gauge .fill { transition: none; } }

    @container (max-width: 520px) {
      .live { grid-template-columns: 1fr; }
      .stats { grid-template-rows: none; grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .stat { flex-direction: column; align-items: flex-start; gap: 2px; padding: 8px 10px; }
      .stat div { flex-direction: column; align-items: flex-start; gap: 0; }
      .stat b { order: 0; }
      .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .kpi.eur { grid-column: 1 / -1; }
      .det, .fm { padding-left: 12px; }
      .run { grid-template-columns: 90px 1fr 54px; gap: 8px; }
      .price { font-size: 11px; padding: 4px 8px; }
    }
    @container (max-width: 440px) {
      .hdr { flex-wrap: wrap; row-gap: 6px; }
      .price { order: 3; margin-left: 44px; }
      .dr { flex-wrap: wrap; row-gap: 8px; }
      .dm { flex: 1 1 calc(100% - 56px); }
      .da { flex-direction: row; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; padding-left: 52px; }
      .ttl { flex: 1 1 150px; }
    }
    @container (max-width: 380px) {
      section { padding: 0 12px; }
      .dr { gap: 10px; padding: 10px; }
      .ic { width: 34px; height: 34px; } .ic ha-icon { --mdc-icon-size: 19px; }
      .big .val { font-size: 26px; }
    }`;

  // ───────────────────────── éditeur visuel ─────────────────────────
  class HolmSolarOptimizerCardEditor extends HTMLElement {
    setConfig(c) {
      if (this._last && JSON.stringify(c) === this._last && this.shadowRoot) return;
      this._c = { ...c };
      this._build();
    }
    set hass(h) { this._hass = h; if (this._f) this._f.hass = h; else this._build(); }
    get _l() { return langOf(this._hass, this._c); }
    _build() {
      if (!this._hass || !this._c) return;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const l = this._l;
      const labels = { title: "l_title", language: "l_language", show_live: "l_show_live", show_devices: "l_show_devices", show_history: "l_show_history",
        history_mode: "l_history_mode", history_chart: "l_history_chart", default_tab: "l_default_tab", production_entity: "l_production", grid_entity: "l_grid", price_entity: "l_price", exclude: "l_exclude" };
      this.shadowRoot.innerHTML = "";
      const f = document.createElement("ha-form");
      f.hass = this._hass;
      f.computeLabel = (s) => (labels[s.name] ? tr(l, labels[s.name]) : s.title || s.name);
      f.schema = [
        { name: "title", selector: { text: {} } },
        { type: "grid", name: "", schema: [
          { name: "show_live", selector: { boolean: {} } }, { name: "show_devices", selector: { boolean: {} } }, { name: "show_history", selector: { boolean: {} } },
        ] },
        { type: "grid", name: "", schema: [
          { name: "default_tab", selector: { select: { mode: "dropdown", options: [{ value: "none", label: tr(l, "tab_none") }, { value: "devices", label: tr(l, "tab_devices") }, { value: "history", label: tr(l, "history") }] } } },
          { name: "history_mode", selector: { select: { mode: "dropdown", options: [{ value: "day", label: tr(l, "day") }, { value: "week", label: tr(l, "week") }] } } },
          { name: "history_chart", selector: { select: { mode: "dropdown", options: [{ value: "devices", label: tr(l, "ch_devices") }, { value: "energy", label: tr(l, "ch_energy") }] } } },
          { name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: tr(l, "auto_lang") }, ...Object.entries(LANG_NAMES).map(([value, label]) => ({ value, label }))] } } },
        ] },
        { name: "exclude", selector: { entity: { multiple: true, filter: { integration: DOMAIN, domain: "switch" } } } },
        { type: "expandable", name: "", title: tr(l, "l_sources"), schema: [
          { name: "production_entity", selector: { entity: { domain: "sensor", device_class: "power" } } },
          { name: "grid_entity", selector: { entity: { domain: "sensor", device_class: "power" } } },
          { name: "price_entity", selector: { entity: { domain: ["sensor", "input_number", "number"] } } },
        ] },
      ];
      f.data = { show_live: true, show_devices: true, show_history: true, history_mode: "day", history_chart: "devices", default_tab: "none", language: "", title: tr(l, "title"), ...this._c };
      f.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        const v = { ...this._c, ...e.detail.value };
        for (const k of ["show_live", "show_devices", "show_history"]) if (v[k] === true) delete v[k];
        if (v.history_mode === "day") delete v.history_mode;
        if (!v.default_tab || v.default_tab === "none") delete v.default_tab;
        if (v.history_chart === "devices") delete v.history_chart;
        for (const k of ["language", "production_entity", "grid_entity", "price_entity"]) if (!v[k]) delete v[k];
        if (Array.isArray(v.exclude) && !v.exclude.length) delete v.exclude;
        const relang = (v.language || "") !== (this._c.language || "");
        this._c = v; this._last = JSON.stringify(v);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: v }, bubbles: true, composed: true }));
        if (relang) { this._f = null; this._build(); }
      });
      this.shadowRoot.appendChild(f);
      this._f = f;
    }
  }

  if (!customElements.get("holm-solar-optimizer-card")) customElements.define("holm-solar-optimizer-card", HolmSolarOptimizerCard);
  if (!customElements.get("holm-solar-optimizer-card-editor")) customElements.define("holm-solar-optimizer-card-editor", HolmSolarOptimizerCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "holm-solar-optimizer-card")) {
    const l = langOf(document.querySelector("home-assistant")?.hass);
    window.customCards.push({ type: "holm-solar-optimizer-card", name: tr(l, "card_name"), description: tr(l, "card_desc"), preview: true });
  }
  console.info(`%c HOLM-SOLAR-OPTIMIZER %c ${VERSION} `, "background:#f5a524;color:#111;border-radius:3px 0 0 3px", "background:#123;color:#fff;border-radius:0 3px 3px 0");
})();
