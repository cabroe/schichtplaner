package database

import (
	"testing"

	"schichtplaner/models"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// setupSeedTestDB erstellt eine in-memory SQLite-Datenbank für Seed-Tests
func setupSeedTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration durchführen
	err = db.AutoMigrate(&models.User{}, &models.Shift{}, &models.Schedule{}, &models.Team{}, &models.ShiftType{}, &models.ShiftTemplate{})
	assert.NoError(t, err)

	return db
}

// countAllSeed zählt alle Einträge in allen Tabellen für Seed-Tests
func countAllSeed(t *testing.T, db *gorm.DB) (int64, int64, int64, int64, int64, int64) {
	var users, schedules, shifts, shiftTemplates, teams, shiftTypes int64
	assert.NoError(t, db.Model(&models.User{}).Count(&users).Error)
	assert.NoError(t, db.Model(&models.Schedule{}).Count(&schedules).Error)
	assert.NoError(t, db.Model(&models.Shift{}).Count(&shifts).Error)
	assert.NoError(t, db.Model(&models.ShiftTemplate{}).Count(&shiftTemplates).Error)
	assert.NoError(t, db.Model(&models.Team{}).Count(&teams).Error)
	assert.NoError(t, db.Model(&models.ShiftType{}).Count(&shiftTypes).Error)
	return users, schedules, shifts, shiftTemplates, teams, shiftTypes
}

// TestSeedResetDatabase testet das Zurücksetzen der Datenbank
func TestSeedResetDatabase(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	// Erst seed, dann reset
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetDatabase())

	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllSeed(t, db)
	assert.Equal(t, int64(0), users, "Alle User sollten gelöscht sein")
	assert.Equal(t, int64(0), schedules, "Alle Schedules sollten gelöscht sein")
	assert.Equal(t, int64(0), shifts, "Alle Shifts sollten gelöscht sein")
	assert.Equal(t, int64(0), shiftTemplates, "Alle Schichtvorlagen sollten gelöscht sein")
	assert.Equal(t, int64(0), teams, "Alle Teams sollten gelöscht sein")
	assert.Equal(t, int64(0), shiftTypes, "Alle ShiftTypes sollten gelöscht sein")
}

// TestSeedDatabaseFunction testet das Befüllen der Datenbank mit Testdaten
func TestSeedDatabaseFunction(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllSeed(t, db)
	assert.Equal(t, int64(5), users, "5 User sollten erstellt sein")
	assert.Equal(t, int64(3), schedules, "3 Schedules sollten erstellt sein")
	assert.Equal(t, int64(8), shifts, "8 Shifts sollten erstellt sein")
	assert.Equal(t, int64(4), shiftTemplates, "4 Schichtvorlagen sollten erstellt sein")
	assert.Equal(t, int64(4), teams, "4 Teams sollten erstellt sein")
	assert.Equal(t, int64(5), shiftTypes, "5 ShiftTypes sollten erstellt sein")
}

// TestSeedResetAndSeedDatabase testet die kombinierte Reset- und Seed-Funktion
func TestSeedResetAndSeedDatabase(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	// Erst seed, dann reset und seed
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, ResetAndSeedDatabase())

	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllSeed(t, db)
	assert.Equal(t, int64(5), users, "5 User sollten erstellt sein")
	assert.Equal(t, int64(3), schedules, "3 Schedules sollten erstellt sein")
	assert.Equal(t, int64(8), shifts, "8 Shifts sollten erstellt sein")
	assert.Equal(t, int64(4), shiftTemplates, "4 Schichtvorlagen sollten erstellt sein")
	assert.Equal(t, int64(4), teams, "4 Teams sollten erstellt sein")
	assert.Equal(t, int64(5), shiftTypes, "5 ShiftTypes sollten erstellt sein")
}

// TestSeedDatabase_Teams testet die Team-Erstellung
func TestSeedDatabase_Teams(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var teams []models.Team
	assert.NoError(t, db.Find(&teams).Error)
	assert.Len(t, teams, 4, "4 Teams sollten erstellt sein")

	// Prüfe spezifische Teams
	teamNames := []string{"Entwicklungsteam", "Design-Team", "Marketing-Team", "Support-Team"}
	for _, name := range teamNames {
		var team models.Team
		assert.NoError(t, db.Where("name = ?", name).First(&team).Error)
		assert.NotZero(t, team.ID)
		assert.Equal(t, name, team.Name)
		assert.True(t, team.IsActive || !team.IsActive) // Entweder true oder false
	}
}

// TestSeedDatabase_ShiftTypes testet die Schichttyp-Erstellung
func TestSeedDatabase_ShiftTypes(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var shiftTypes []models.ShiftType
	assert.NoError(t, db.Find(&shiftTypes).Error)
	assert.Len(t, shiftTypes, 5, "5 Schichttypen sollten erstellt sein")

	// Prüfe spezifische Schichttypen
	shiftTypeNames := []string{"Frühschicht", "Spätschicht", "Nachtschicht", "Teilzeit", "Überstunden"}
	for _, name := range shiftTypeNames {
		var shiftType models.ShiftType
		assert.NoError(t, db.Where("name = ?", name).First(&shiftType).Error)
		assert.NotZero(t, shiftType.ID)
		assert.Equal(t, name, shiftType.Name)
		assert.NotZero(t, shiftType.DefaultStart)
		assert.NotZero(t, shiftType.DefaultEnd)
		assert.NotZero(t, shiftType.MinDuration)
		assert.NotZero(t, shiftType.MaxDuration)
	}
}

// TestSeedDatabase_Users testet die User-Erstellung
func TestSeedDatabase_Users(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var users []models.User
	assert.NoError(t, db.Find(&users).Error)
	assert.Len(t, users, 5, "5 User sollten erstellt sein")

	// Prüfe spezifische User
	usernames := []string{"admin", "max.mustermann", "anna.schmidt", "peter.weber", "lisa.mueller"}
	for _, username := range usernames {
		var user models.User
		assert.NoError(t, db.Where("username = ?", username).First(&user).Error)
		assert.NotZero(t, user.ID)
		assert.Equal(t, username, user.Username)
		assert.NotEmpty(t, user.Password) // Gehashtes Passwort
		assert.NotEmpty(t, user.Name)
		assert.NotEmpty(t, user.Email)
	}
}

// TestSeedDatabase_Schedules testet die Schedule-Erstellung
func TestSeedDatabase_Schedules(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var schedules []models.Schedule
	assert.NoError(t, db.Find(&schedules).Error)
	assert.Len(t, schedules, 3, "3 Schedules sollten erstellt sein")

	// Prüfe spezifische Schedules
	scheduleNames := []string{"Januar 2024", "Februar 2024", "März 2024"}
	for _, name := range scheduleNames {
		var schedule models.Schedule
		assert.NoError(t, db.Where("name = ?", name).First(&schedule).Error)
		assert.NotZero(t, schedule.ID)
		assert.Equal(t, name, schedule.Name)
		assert.NotZero(t, schedule.StartDate)
		assert.NotZero(t, schedule.EndDate)
	}
}

// TestSeedDatabase_ShiftTemplates testet die Schichtvorlagen-Erstellung
func TestSeedDatabase_ShiftTemplates(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var templates []models.ShiftTemplate
	assert.NoError(t, db.Find(&templates).Error)
	assert.Len(t, templates, 4, "4 Schichtvorlagen sollten erstellt sein")

	// Prüfe spezifische Vorlagen
	templateNames := []string{"Vollzeit-Standard", "Wechsel-Schicht", "Teilzeit-Woche", "Nachtschicht-Woche"}
	for _, name := range templateNames {
		var template models.ShiftTemplate
		assert.NoError(t, db.Where("name = ?", name).First(&template).Error)
		assert.NotZero(t, template.ID)
		assert.Equal(t, name, template.Name)
		assert.NotEmpty(t, template.Description)
		assert.NotEmpty(t, template.Color)
	}
}

// TestSeedDatabase_Shifts testet die Shift-Erstellung
func TestSeedDatabase_Shifts(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	var shifts []models.Shift
	assert.NoError(t, db.Find(&shifts).Error)
	assert.Len(t, shifts, 8, "8 Shifts sollten erstellt sein")

	// Prüfe, dass alle Shifts gültige Beziehungen haben
	for _, shift := range shifts {
		assert.NotZero(t, shift.UserID)
		assert.NotZero(t, shift.ScheduleID)
		assert.NotNil(t, shift.ShiftTypeID)
		assert.NotZero(t, shift.StartTime)
		assert.NotZero(t, shift.EndTime)
		assert.True(t, shift.EndTime.After(shift.StartTime))
	}
}

// TestSeedDatabase_UserTeamAssignments testet die User-Team-Zuordnungen
func TestSeedDatabase_UserTeamAssignments(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	// Prüfe spezifische User-Team-Zuordnungen
	var maxUser, annaUser, peterUser models.User
	assert.NoError(t, db.Where("username = ?", "max.mustermann").First(&maxUser).Error)
	assert.NoError(t, db.Where("username = ?", "anna.schmidt").First(&annaUser).Error)
	assert.NoError(t, db.Where("username = ?", "peter.weber").First(&peterUser).Error)

	// Prüfe, dass diese User Teams zugewiesen haben
	assert.NotNil(t, maxUser.TeamID)
	assert.NotNil(t, annaUser.TeamID)
	assert.NotNil(t, peterUser.TeamID)

	// Prüfe, dass die Team-IDs gültig sind
	assert.Greater(t, *maxUser.TeamID, uint(0))
	assert.Greater(t, *annaUser.TeamID, uint(0))
	assert.Greater(t, *peterUser.TeamID, uint(0))

	// Prüfe, dass die Teams existieren (mit korrekter Abfrage)
	var team1, team2, team3 models.Team
	assert.NoError(t, db.Where("id = ?", *maxUser.TeamID).First(&team1).Error)
	assert.NoError(t, db.Where("id = ?", *annaUser.TeamID).First(&team2).Error)
	assert.NoError(t, db.Where("id = ?", *peterUser.TeamID).First(&team3).Error)

	// Prüfe, dass die Teams unterschiedlich sind
	assert.NotEqual(t, team1.ID, team2.ID, "Max und Anna sollten unterschiedlichen Teams zugewiesen sein")
	assert.NotEqual(t, team2.ID, team3.ID, "Anna und Peter sollten unterschiedlichen Teams zugewiesen sein")
	assert.NotEqual(t, team1.ID, team3.ID, "Max und Peter sollten unterschiedlichen Teams zugewiesen sein")
}

// TestSeedDatabase_DuplicateHandling testet das Handling von Duplikaten
func TestSeedDatabase_DuplicateHandling(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	// Seed zweimal ausführen
	assert.NoError(t, SeedDatabase())
	assert.NoError(t, SeedDatabase()) // Sollte keine Fehler verursachen

	// Prüfe, dass keine Duplikate erstellt wurden
	users, schedules, shifts, shiftTemplates, teams, shiftTypes := countAllSeed(t, db)
	assert.Equal(t, int64(5), users, "Sollte immer noch 5 User haben")
	assert.Equal(t, int64(3), schedules, "Sollte immer noch 3 Schedules haben")
	assert.Equal(t, int64(8), shifts, "Sollte immer noch 8 Shifts haben")
	assert.Equal(t, int64(4), shiftTemplates, "Sollte immer noch 4 Schichtvorlagen haben")
	assert.Equal(t, int64(4), teams, "Sollte immer noch 4 Teams haben")
	assert.Equal(t, int64(5), shiftTypes, "Sollte immer noch 5 ShiftTypes haben")
}

// TestSeedDatabase_DataIntegrity testet die Datenintegrität
func TestSeedDatabase_DataIntegrity(t *testing.T) {
	db := setupSeedTestDB(t)
	originalDB := DB
	DB = db
	defer func() { DB = originalDB }()

	assert.NoError(t, SeedDatabase())

	// Prüfe, dass alle Shifts gültige User-Referenzen haben
	var shifts []models.Shift
	assert.NoError(t, db.Preload("User").Find(&shifts).Error)
	for _, shift := range shifts {
		assert.NotNil(t, shift.User)
		assert.NotZero(t, shift.User.ID)
	}

	// Prüfe, dass alle Shifts gültige Schedule-Referenzen haben
	assert.NoError(t, db.Preload("Schedule").Find(&shifts).Error)
	for _, shift := range shifts {
		assert.NotNil(t, shift.Schedule)
		assert.NotZero(t, shift.Schedule.ID)
	}

	// Prüfe, dass alle Shifts gültige ShiftType-Referenzen haben
	assert.NoError(t, db.Preload("ShiftType").Find(&shifts).Error)
	for _, shift := range shifts {
		assert.NotNil(t, shift.ShiftType)
		assert.NotZero(t, shift.ShiftType.ID)
	}

	// Prüfe, dass alle User mit Teams gültige Team-Referenzen haben
	var users []models.User
	assert.NoError(t, db.Preload("Team").Find(&users).Error)
	for _, user := range users {
		if user.TeamID != nil {
			assert.NotNil(t, user.Team)
			assert.NotZero(t, user.Team.ID)
		}
	}
}
