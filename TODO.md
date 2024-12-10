Abteilungen

id (PK)
name

Benutzer

id (PK)
name
email
abteilung_id (FK → Abteilungen.id)

Schichttyp

id (PK)
bezeichnung (z. B. "Frühschicht")
beschreibung (optional)
dauer (optional, z. B. in Stunden oder Zeitfenster)

Schichtwoche

id (PK)
startdatum (Datum)
enddatum (Datum)
abteilung_id (FK → Abteilungen.id)

Schichttag

id (PK)
datum (Datum)
schichtwoche_id (FK → Schichtwoche.id)
schichttyp_id (FK → Schichttyp.id)
benutzer_id (FK → Benutzer.id)

Abwesenheiten

id (PK)
benutzer_id (FK → Benutzer.id)
startdatum
enddatum
typ (z. B. "Urlaub", "Krankheit", etc.)
beschreibung (optional)
genehmigungsstatus (z. B. "auto", "manuell", "ausstehend")

Beziehungen auf einen Blick:

Abteilungen ← (1-n) → Benutzer
Abteilungen ← (1-n) → Schichtwoche
Schichtwoche ← (1-n) → Schichttag
Schichttyp ← (1-n) → Schichttag (ein Schichttyp kann vielen Schichttagen zugewiesen sein)
Benutzer ← (1-n) → Schichttag (ein Benutzer kann in vielen Schichttagen eingeteilt sein)
Benutzer ← (1-n) → Abwesenheiten (ein Benutzer kann viele Abwesenheiten haben)