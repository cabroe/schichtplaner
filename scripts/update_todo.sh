#!/bin/bash

# TODO-Liste Pflege Skript
# Verwendung: ./scripts/update_todo.sh [status|progress|add|complete]

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
    echo -e "${BLUE}➕ Neue Aufgabe hinzufügen${NC}"
    echo "================================"
    
    read -p "Priorität (hoch/mittel/niedrig): " priority
    read -p "Titel: " title
    read -p "Datei: " file
    read -p "Beschreibung: " description
    read -p "Schätzung (Stunden): " estimate
    
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
            echo -e "${RED}Ungültige Priorität${NC}"
            exit 1
            ;;
    esac
    
    # Füge Aufgabe hinzu
    task_entry="### $next_num. $title
- [ ] **Datei**: \`$file\`
- [ ] **Aufgabe**: $description
- [ ] **Schätzung**: $estimate Stunden
- [ ] **Status**: Offen

"
    
    # Finde die richtige Stelle und füge hinzu
    awk -v task="$task_entry" -v section="$section" '
    /^## 🔧 \*\*Mittel/ && section == "Mittel (Nächste Iteration)" {
        print task
        print
    }
    /^## 📈 \*\*Niedrig/ && section == "Niedrig (Langfristig)" {
        print task
        print
    }
    { print }
    ' "$TODO_FILE" > "${TODO_FILE}.tmp" && mv "${TODO_FILE}.tmp" "$TODO_FILE"
    
    echo -e "${GREEN}✅ Aufgabe hinzugefügt!${NC}"
}

complete_task() {
    echo -e "${BLUE}✅ Aufgabe als abgeschlossen markieren${NC}"
    echo "============================================="
    
    # Zeige alle offenen Aufgaben
    echo "Offene Aufgaben:"
    grep -n "^- \[ \]" "$TODO_FILE" | head -20
    
    read -p "Zeile der abzuschließenden Aufgabe: " line_num
    
    # Markiere als abgeschlossen (macOS-kompatibel)
    sed -i '' "${line_num}s/^- \[ \]/- [x]/" "$TODO_FILE"
    
    echo -e "${GREEN}✅ Aufgabe als abgeschlossen markiert!${NC}"
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
        add_task
        ;;
    "complete")
        complete_task
        ;;
    "update")
        update_progress
        ;;
    *)
        echo -e "${BLUE}📋 TODO-Liste Pflege Tool${NC}"
        echo "================================"
        echo "Verwendung: $0 [status|progress|add|complete|update]"
        echo ""
        echo "Befehle:"
        echo "  status    - Zeige Übersicht"
        echo "  progress  - Zeige detaillierten Fortschritt"
        echo "  add       - Neue Aufgabe hinzufügen"
        echo "  complete  - Aufgabe als abgeschlossen markieren"
        echo "  update    - Fortschritt aktualisieren"
        echo ""
        show_status
        ;;
esac 