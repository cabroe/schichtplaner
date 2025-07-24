#!/bin/bash

# TODO-Liste Pflege Skript
# Verwendung: ./scripts/update_todo.sh [status|progress|add|complete|update]
# Parameter-basierte Steuerung ohne Benutzerinteraktion

TODO_FILE="TODO.md"

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktionen
show_status() {
    echo -e "${BLUE}📊 TODO-Status Übersicht${NC}"
    echo "================================"
    
    # Zähle Aufgaben nach Priorität (Sektion-basiert)
    high_count=$(sed -n '/^## 🚀/,/^## 🔧/p' "$TODO_FILE" | grep -c "### ")
    medium_count=$(sed -n '/^## 🔧/,/^## 📈/p' "$TODO_FILE" | grep -c "### ")
    low_count=$(sed -n '/^## 📈/,/^## 📊/p' "$TODO_FILE" | grep -c "### ")
    
    # Zähle abgeschlossene Aufgaben (nur die erste Checkbox jeder Aufgabe)
    high_done=$(sed -n '/^## 🚀/,/^## 🔧/p' "$TODO_FILE" | grep -A 1 "### " | grep "^- \[x\]" | wc -l | tr -d ' ')
    medium_done=$(sed -n '/^## 🔧/,/^## 📈/p' "$TODO_FILE" | grep -A 1 "### " | grep "^- \[x\]" | wc -l | tr -d ' ')
    low_done=$(sed -n '/^## 📈/,/^## 📊/p' "$TODO_FILE" | grep -A 1 "### " | grep "^- \[x\]" | wc -l | tr -d ' ')
    
    # Berechne Prozente
    high_percent=$((high_count > 0 ? high_done * 100 / high_count : 0))
    medium_percent=$((medium_count > 0 ? medium_done * 100 / medium_count : 0))
    low_percent=$((low_count > 0 ? low_done * 100 / low_count : 0))
    
    # Zeige übersichtlichen Status
    echo -e "${YELLOW}Hoch (Sofort):${NC} $high_done/$high_count ($high_percent%)"
    echo -e "${YELLOW}Mittel:${NC} $medium_done/$medium_count ($medium_percent%)"
    echo -e "${YELLOW}Niedrig:${NC} $low_done/$low_count ($low_percent%)"
    
    # Gesamtfortschritt
    total=$((high_count + medium_count + low_count))
    total_done=$((high_done + medium_done + low_done))
    total_percent=$((total > 0 ? total_done * 100 / total : 0))
    
    echo -e "${GREEN}Gesamt: $total_done/$total ($total_percent%)${NC}"
}

show_progress() {
    echo -e "${BLUE}📈 Detaillierter Fortschritt${NC}"
    echo "================================="
    
    # Zeige alle Aufgaben mit Status
    echo -e "${YELLOW}🚀 Hoch (Sofort):${NC}"
    awk '/^## 🚀/,/^## 🔧/ {if ($0 ~ /^### /) {print "\n" $0; task=1} else if (task && $0 ~ /^- \[[ x]\]/) {print $0} else if (task && $0 ~ /^$/) {task=0}}' "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
    
    echo -e "\n${YELLOW}🔧 Mittel:${NC}"
    awk '/^## 🔧/,/^## 📈/ {if ($0 ~ /^### /) {print "\n" $0; task=1} else if (task && $0 ~ /^- \[[ x]\]/) {print $0} else if (task && $0 ~ /^$/) {task=0}}' "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
    
    echo -e "\n${YELLOW}📈 Niedrig:${NC}"
    awk '/^## 📈/,/^## 📊/ {if ($0 ~ /^### /) {print "\n" $0; task=1} else if (task && $0 ~ /^- \[[ x]\]/) {print $0} else if (task && $0 ~ /^$/) {task=0}}' "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
}

add_task() {
    # Parameter: add <priority> <title> <file> <description> <estimate>
    if [ $# -lt 5 ]; then
        echo -e "${RED}Fehler: add benötigt 5 Parameter: priority title file description estimate${NC}"
        echo "Beispiel: $0 add mittel 'DB-Tool Tests' 'cmd/db/main.go' 'Umfassende Tests implementieren' 3"
        exit 1
    fi
    
    priority="$2"
    title="$3"
    file="$4"
    description="$5"
    estimate="$6"
    
    echo -e "${BLUE}➕ Neue Aufgabe hinzufügen${NC}"
    echo "================================"
    echo "Priorität: $priority"
    echo "Titel: $title"
    echo "Datei: $file"
    echo "Beschreibung: $description"
    echo "Schätzung: $estimate Stunden"
    
    # Bestimme Sektion
    case $priority in
        "hoch")
            section="Hoch (Sofort)"
            ;;
        "mittel")
            section="Mittel (Nächste Iteration)"
            ;;
        "niedrig")
            section="Niedrig (Langfristig)"
            ;;
        *)
            echo -e "${RED}Ungültige Priorität: $priority${NC}"
            exit 1
            ;;
    esac
    
    # Füge Aufgabe hinzu - verwende sed statt awk für bessere Zeilenumbrruch-Behandlung
    if [ "$section" = "Mittel (Nächste Iteration)" ]; then
        # Füge nach der Mittel-Sektion hinzu
        sed -i '' "/^## 🔧 \*\*Mittel/a\\
\\
### $title\\
- [ ] **Datei**: \`$file\`\\
- [ ] **Aufgabe**: $description\\
- [ ] **Schätzung**: $estimate Stunden\\
- [ ] **Status**: Offen\\
\\
" "$TODO_FILE"
    elif [ "$section" = "Niedrig (Langfristig)" ]; then
        # Füge nach der Niedrig-Sektion hinzu
        sed -i '' "/^## 📈 \*\*Niedrig/a\\
\\
### $title\\
- [ ] **Datei**: \`$file\`\\
- [ ] **Aufgabe**: $description\\
- [ ] **Schätzung**: $estimate Stunden\\
- [ ] **Status**: Offen\\
\\
" "$TODO_FILE"
    else
        # Füge nach der Hoch-Sektion hinzu
        sed -i '' "/^## 🚀 \*\*Hoch/a\\
\\
### $title\\
- [ ] **Datei**: \`$file\`\\
- [ ] **Aufgabe**: $description\\
- [ ] **Schätzung**: $estimate Stunden\\
- [ ] **Status**: Offen\\
\\
" "$TODO_FILE"
    fi
    
    echo -e "${GREEN}✅ Aufgabe hinzugefügt!${NC}"
}

complete_task() {
    # Parameter: complete <line_number>
    if [ $# -lt 2 ]; then
        echo -e "${RED}Fehler: complete benötigt Zeilennummer${NC}"
        echo "Beispiel: $0 complete 15"
        exit 1
    fi
    
    line_num="$2"
    
    echo -e "${BLUE}✅ Aufgabe als abgeschlossen markieren${NC}"
    echo "============================================="
    echo "Markiere Zeile $line_num als abgeschlossen"
    
    # Markiere als abgeschlossen (macOS-kompatibel)
    sed -i '' "${line_num}s/^- \[ \]/- [x]/" "$TODO_FILE"
    
    echo -e "${GREEN}✅ Aufgabe als abgeschlossen markiert!${NC}"
}

complete_by_title() {
    # Parameter: complete-title <title>
    if [ $# -lt 2 ]; then
        echo -e "${RED}Fehler: complete-title benötigt Titel${NC}"
        echo "Beispiel: $0 complete-title 'DB-Tool Tests'"
        exit 1
    fi
    
    title="$2"
    
    echo -e "${BLUE}✅ Aufgabe als abgeschlossen markieren${NC}"
    echo "============================================="
    echo "Suche nach Aufgabe: $title"
    
    # Finde Zeile mit dem Titel und markiere als abgeschlossen
    line_num=$(grep -n "### $title" "$TODO_FILE" | cut -d: -f1)
    
    if [ -z "$line_num" ]; then
        echo -e "${RED}❌ Aufgabe '$title' nicht gefunden${NC}"
        exit 1
    fi
    
    # Markiere alle Checkboxen der Aufgabe als abgeschlossen
    sed -i '' "${line_num},$((line_num + 5))s/^- \[ \]/- [x]/" "$TODO_FILE"
    
    echo -e "${GREEN}✅ Aufgabe '$title' als abgeschlossen markiert!${NC}"
}

update_progress() {
    echo -e "${BLUE}📊 Fortschritt aktualisieren${NC}"
    echo "================================"
    
    # Aktualisiere Datum (macOS-kompatibel)
    sed -i '' "s/\*Letzte Aktualisierung: .*\*/*Letzte Aktualisierung: $(date)*/" "$TODO_FILE"
    
    echo -e "${GREEN}✅ Fortschritt aktualisiert!${NC}"
}

# Hauptlogik
case "${1:-status}" in
    "status")
        show_status
        ;;
    "progress")
        show_progress
        ;;
    "add")
        add_task "$@"
        ;;
    "complete")
        complete_task "$@"
        ;;
    "complete-title")
        complete_by_title "$@"
        ;;
    "update")
        update_progress
        ;;
    *)
        echo -e "${BLUE}📋 TODO-Liste Pflege Tool${NC}"
        echo "================================"
        echo "Verwendung: $0 [status|progress|add|complete|complete-title|update]"
        echo ""
        echo "Befehle:"
        echo "  status                    - Zeige Übersicht"
        echo "  progress                  - Zeige detaillierten Fortschritt"
        echo "  add <priority> <title> <file> <description> <estimate>"
        echo "                            - Neue Aufgabe hinzufügen"
        echo "  complete <line_number>    - Aufgabe als abgeschlossen markieren (per Zeile)"
        echo "  complete-title <title>    - Aufgabe als abgeschlossen markieren (per Titel)"
        echo "  update                    - Fortschritt aktualisieren"
        echo ""
        echo "Beispiele:"
        echo "  $0 add mittel 'DB-Tool Tests' 'cmd/db/main.go' 'Umfassende Tests implementieren' 3"
        echo "  $0 complete-title 'DB-Tool Tests'"
        echo "  $0 complete 15"
        echo ""
        show_status
        ;;
esac 