#!/bin/bash

# TODO-Liste Pflege Skript
# Verwendung: ./scripts/update_todo.sh [status|progress|add|complete|update]
# Parameter-basierte Steuerung ohne Benutzerinteraktion

TODO_FILE="BACKEND_OPTIMIZATION_TODO.md"

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
    
    # Zähle Aufgaben nach Priorität (vereinfacht)
    high_count=$(grep -c "### [1-4]" "$TODO_FILE")
    medium_count=$(grep -c "### [5-8]" "$TODO_FILE")
    low_count=$(grep -c "### [9-9]" "$TODO_FILE")
    # Manuell niedrige Aufgaben zählen
    low_count=$(grep -c "### 9\|### 10\|### 11" "$TODO_FILE")
    
    # Zähle abgeschlossene Aufgaben
    high_done=$(grep -A 10 "## 🚀" "$TODO_FILE" | grep -c "^- \[x\]")
    medium_done=$(grep -A 10 "## 🔧" "$TODO_FILE" | grep -c "^- \[x\]")
    low_done=$(grep -A 10 "## 📈" "$TODO_FILE" | grep -c "^- \[x\]")
    
    echo -e "${YELLOW}Hoch (Sofort):${NC} $high_done/$high_count abgeschlossen"
    echo -e "${YELLOW}Mittel:${NC} $medium_done/$medium_count abgeschlossen"
    echo -e "${YELLOW}Niedrig:${NC} $low_done/$low_count abgeschlossen"
    
    total=$((high_count + medium_count + low_count))
    total_done=$((high_done + medium_done + low_done))
    progress=$((total_done * 100 / total))
    
    echo -e "${GREEN}Gesamtfortschritt: $progress% ($total_done/$total)${NC}"
}

show_progress() {
    echo -e "${BLUE}📈 Detaillierter Fortschritt${NC}"
    echo "================================="
    
    # Zeige alle Aufgaben mit Status
    echo -e "${YELLOW}🚀 Hoch (Sofort):${NC}"
    grep -A 5 "### [1-4]" "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
    
    echo -e "\n${YELLOW}🔧 Mittel:${NC}"
    grep -A 5 "### [5-8]" "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
    
    echo -e "\n${YELLOW}📈 Niedrig:${NC}"
    grep -A 5 "### 9\|### 10\|### 11" "$TODO_FILE" | grep -E "^- \[[ x]\]" || echo "Keine Aufgaben gefunden"
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
    
    # Bestimme nächste Nummer
    case $priority in
        "hoch")
            next_num=$(grep -c "### [1-4]\." "$TODO_FILE" | head -1)
            next_num=$((next_num + 1))
            section="Hoch (Sofort)"
            ;;
        "mittel")
            next_num=$(grep -c "### [5-8]\." "$TODO_FILE" | head -1)
            next_num=$((next_num + 5))
            section="Mittel (Nächste Iteration)"
            ;;
        "niedrig")
            next_num=$(grep -c "### [9-11]\." "$TODO_FILE" | head -1)
            next_num=$((next_num + 9))
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
### $next_num. $title\\
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
### $next_num. $title\\
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
### $next_num. $title\\
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
    line_num=$(grep -n "### [0-9]*\. $title" "$TODO_FILE" | cut -d: -f1)
    
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