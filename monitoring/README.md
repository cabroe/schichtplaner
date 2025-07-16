# Monitoring Setup

Dieses Verzeichnis enthält die Konfiguration für das Monitoring der Schichtplaner-Anwendung mit Prometheus und Grafana.

## Struktur

```
monitoring/
├── prometheus.yml              # Prometheus-Konfiguration
├── grafana/
│   ├── dashboards/
│   │   ├── dashboard.yml       # Dashboard-Provider-Konfiguration
│   │   └── schichtplaner.json # Schichtplaner-Dashboard
│   └── datasources/
│       └── prometheus.yml      # Prometheus-Datenquelle
└── README.md                   # Diese Datei
```

## Verwendung

### 1. Monitoring starten

```bash
# Alle Services starten (Schichtplaner, Prometheus, Grafana)
docker-compose up -d

# Nur Monitoring-Services starten
docker-compose up -d prometheus grafana
```

### 2. Zugriff auf die Services

- **Schichtplaner Anwendung**: http://localhost:3000
- **Prometheus**: http://localhost:9090
- **Grafana**: http://localhost:3001 (admin/admin)

### 3. Metriken anzeigen

- **Prometheus Metriken**: http://localhost:3000/metrics
- **Health Check**: http://localhost:3000/api/health

## Dashboard

Das Schichtplaner-Dashboard in Grafana zeigt:

1. **Request Rate**: Anzahl der HTTP-Requests pro Sekunde
2. **95th Percentile Response Time**: 95%-Perzentil der Antwortzeiten
3. **Requests by Status Code**: Requests nach HTTP-Status-Codes
4. **Response Size Rate**: Durchschnittliche Antwortgröße

## Metriken

Die Echo Prometheus Middleware sammelt automatisch:

- `echo_requests_total`: Gesamtzahl der HTTP-Requests
- `echo_request_duration_seconds`: Antwortzeiten
- `echo_request_size_bytes`: Request-Größen
- `echo_response_size_bytes`: Response-Größen

## Konfiguration

### Prometheus

- **Scrape Interval**: 10s für Schichtplaner, 15s global
- **Retention**: 200 Stunden
- **Target**: `schichtplaner:3000/metrics`

### Grafana

- **Admin**: admin/admin
- **Dashboard**: Automatisch geladen
- **Datenquelle**: Prometheus (automatisch konfiguriert)

## Troubleshooting

### Prometheus kann keine Metriken sammeln

1. Prüfe, ob Schichtplaner läuft: `curl http://localhost:3000/api/health`
2. Prüfe Metriken: `curl http://localhost:3000/metrics`
3. Prüfe Prometheus Targets: http://localhost:9090/targets

### Grafana zeigt keine Daten

1. Prüfe Datenquelle: http://localhost:3001/datasources
2. Prüfe Prometheus-Verbindung
3. Warte auf erste Metriken (kann einige Minuten dauern)

### Container-Logs

```bash
# Alle Logs anzeigen
docker-compose logs

# Spezifische Service-Logs
docker-compose logs schichtplaner
docker-compose logs prometheus
docker-compose logs grafana
```

## Erweiterte Konfiguration

### Alerts hinzufügen

Füge Alert-Regeln in `prometheus.yml` hinzu:

```yaml
rule_files:
  - "alerts.yml"
```

### Custom Metriken

Erweitere die Prometheus Middleware in `main.go`:

```go
e.Use(echoprometheus.NewMiddlewareWithConfig(echoprometheus.MiddlewareConfig{
    AfterNext: func(c echo.Context, err error) {
        // Custom Metriken hier hinzufügen
    },
}))
```

### Backup

Prometheus-Daten werden in einem Docker-Volume gespeichert:

```bash
# Backup erstellen
docker run --rm -v schichtplaner_prometheus_data:/data -v $(pwd):/backup alpine tar czf /backup/prometheus_backup.tar.gz -C /data .

# Backup wiederherstellen
docker run --rm -v schichtplaner_prometheus_data:/data -v $(pwd):/backup alpine tar xzf /backup/prometheus_backup.tar.gz -C /data
``` 