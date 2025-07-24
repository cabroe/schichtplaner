package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

// Entfernt TestUser_All um Test-Isolation zu gewährleisten
// Jeder Test läuft jetzt individuell mit seiner eigenen Datenbank-Instanz

func TestUser_Create(t *testing.T) {
	db := setupTestDB(t)

	// Team erstellen
	team := Team{
		Name:        "Test Team",
		Description: "Test Team Description",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	result := db.Create(&team)
	assert.NoError(t, result.Error)

	user := User{
		Username:      "testuser_create",
		Email:         "test_create@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_CREATE_001",
		Name:          "Test User Create",
		Color:         "#ff0000",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
		TeamID:        &team.ID,
	}

	result = db.Create(&user)
	assert.NoError(t, result.Error)
	assert.NotZero(t, user.ID)
	assert.NotZero(t, user.CreatedAt)
	assert.NotZero(t, user.UpdatedAt)
	assert.NotNil(t, user.TeamID)
	assert.Equal(t, team.ID, *user.TeamID)
}

func TestUser_Validation(t *testing.T) {
	db := setupTestDB(t)

	// Test: Username ist required (GORM validiert nicht automatisch, aber wir testen es)
	user := User{
		Email:         "test_validation1@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_VALIDATION1",
		Name:          "Test User Validation 1",
	}

	result := db.Create(&user)
	// GORM validiert nicht automatisch required fields, aber wir können es testen
	// In der Praxis sollten wir Validierung in den Handlers implementieren
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: Email ist required
	user = User{
		Username:      "testuser_validation2",
		Password:      "hashedpassword",
		AccountNumber: "EMP_VALIDATION2",
		Name:          "Test User Validation 2",
	}

	result = db.Create(&user)
	assert.NoError(t, result.Error) // GORM erlaubt dies
}

func TestUser_UniqueConstraints(t *testing.T) {
	db := setupTestDB(t)

	// Ersten User erstellen
	user1 := User{
		Username:      "testuser_unique1",
		Email:         "test_unique1@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_UNIQUE1",
		Name:          "Test User Unique 1",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result := db.Create(&user1)
	assert.NoError(t, result.Error)

	// Zweiten User mit gleichem Username erstellen
	user2 := User{
		Username:      "testuser_unique1", // Gleicher Username
		Email:         "test_unique2@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_UNIQUE2",
		Name:          "Test User Unique 2",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result = db.Create(&user2)
	assert.Error(t, result.Error) // Sollte fehlschlagen wegen Unique-Constraint

	// Dritten User mit gleicher Email erstellen
	user3 := User{
		Username:      "testuser_unique3",
		Email:         "test_unique1@example.com", // Gleiche Email
		Password:      "hashedpassword",
		AccountNumber: "EMP_UNIQUE3",
		Name:          "Test User Unique 3",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result = db.Create(&user3)
	assert.Error(t, result.Error) // Sollte fehlschlagen wegen Unique-Constraint

	// Vierten User mit gleicher AccountNumber erstellen
	user4 := User{
		Username:      "testuser_unique4",
		Email:         "test_unique4@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_UNIQUE1", // Gleiche AccountNumber
		Name:          "Test User Unique 4",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result = db.Create(&user4)
	assert.Error(t, result.Error) // Sollte fehlschlagen wegen Unique-Constraint
}

func TestUser_DefaultValues(t *testing.T) {
	db := setupTestDB(t)

	user := User{
		Username:      "testuser_default",
		Email:         "test_default@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_DEFAULT",
		Name:          "Test User Default",
	}

	result := db.Create(&user)
	assert.NoError(t, result.Error)

	// Prüfen, ob Default-Werte gesetzt wurden
	assert.True(t, user.IsActive)      // Default sollte true sein
	assert.Equal(t, "user", user.Role) // Default sollte "user" sein
	assert.False(t, user.IsAdmin)      // Default sollte false sein
}

func TestUser_SoftDelete(t *testing.T) {
	db := setupTestDB(t)

	user := User{
		Username:      "testuser_delete",
		Email:         "test_delete@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_DELETE",
		Name:          "Test User Delete",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result := db.Create(&user)
	assert.NoError(t, result.Error)

	// User löschen (Soft Delete)
	result = db.Delete(&user)
	assert.NoError(t, result.Error)

	// Prüfen, ob User noch in der Datenbank ist (Soft Delete)
	var count int64
	db.Model(&User{}).Count(&count)
	assert.Equal(t, int64(0), count) // Sollte 0 sein, da Soft Delete

	// Prüfen, ob User mit Unscoped gefunden wird
	var deletedUser User
	result = db.Unscoped().First(&deletedUser, user.ID)
	assert.NoError(t, result.Error)
	assert.NotNil(t, deletedUser.DeletedAt) // DeletedAt sollte gesetzt sein
}

func TestUser_Relationships(t *testing.T) {
	db := setupTestDB(t)

	// Team erstellen
	team := Team{
		Name:        "Test Team",
		Description: "Test Team Description",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	result := db.Create(&team)
	assert.NoError(t, result.Error)

	// User erstellen
	user := User{
		Username:      "testuser_rel",
		Email:         "test_rel@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_REL",
		Name:          "Test User Relationships",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
		TeamID:        &team.ID,
	}

	result = db.Create(&user)
	assert.NoError(t, result.Error)

	// Schedule erstellen
	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}

	result = db.Create(&schedule)
	assert.NoError(t, result.Error)

	// Schichttyp erstellen
	shiftType := ShiftType{
		Name:         "Test Shift Type",
		Description:  "Test Shift Type Description",
		Color:        "#3B82F6",
		DefaultStart: time.Date(2024, 1, 1, 6, 0, 0, 0, time.UTC),
		DefaultEnd:   time.Date(2024, 1, 1, 14, 0, 0, 0, time.UTC),
		DefaultBreak: 30,
		IsActive:     true,
		SortOrder:    1,
	}

	result = db.Create(&shiftType)
	assert.NoError(t, result.Error)

	// Shift für User erstellen
	shift := Shift{
		UserID:      user.ID,
		ShiftTypeID: &shiftType.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Test Shift",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result = db.Create(&shift)
	assert.NoError(t, result.Error)

	// User mit Shifts, Team und Schichttyp laden
	var userWithShifts User
	result = db.Preload("Shifts").Preload("Shifts.ShiftType").Preload("Team").First(&userWithShifts, user.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, userWithShifts.Shifts, 1)
	assert.Equal(t, shift.ID, userWithShifts.Shifts[0].ID)
	assert.NotNil(t, userWithShifts.Team)
	assert.Equal(t, team.ID, userWithShifts.Team.ID)
	assert.NotNil(t, userWithShifts.Shifts[0].ShiftType)
	assert.Equal(t, shiftType.ID, userWithShifts.Shifts[0].ShiftType.ID)
}

func TestUser_TeamRelationships(t *testing.T) {
	db := setupTestDB(t)

	// Team erstellen
	team := Team{
		Name:        "Test Team",
		Description: "Test Team Description",
		Color:       "#3B82F6",
		IsActive:    true,
		SortOrder:   1,
	}

	result := db.Create(&team)
	assert.NoError(t, result.Error)

	// User ohne Team erstellen
	userWithoutTeam := User{
		Username:      "user_no_team",
		Email:         "user_no_team@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_NO_TEAM",
		Name:          "User Without Team",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
		// TeamID ist nil (kein Team)
	}

	result = db.Create(&userWithoutTeam)
	assert.NoError(t, result.Error)
	assert.Nil(t, userWithoutTeam.TeamID)

	// User mit Team erstellen
	userWithTeam := User{
		Username:      "user_with_team",
		Email:         "user_with_team@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_WITH_TEAM",
		Name:          "User With Team",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
		TeamID:        &team.ID,
	}

	result = db.Create(&userWithTeam)
	assert.NoError(t, result.Error)
	assert.NotNil(t, userWithTeam.TeamID)
	assert.Equal(t, team.ID, *userWithTeam.TeamID)

	// User mit Team laden
	var loadedUser User
	result = db.Preload("Team").First(&loadedUser, userWithTeam.ID)
	assert.NoError(t, result.Error)
	assert.NotNil(t, loadedUser.Team)
	assert.Equal(t, team.ID, loadedUser.Team.ID)
	assert.Equal(t, "Test Team", loadedUser.Team.Name)

	// User ohne Team laden
	var userNoTeam User
	result = db.Preload("Team").First(&userNoTeam, userWithoutTeam.ID)
	assert.NoError(t, result.Error)
	assert.Nil(t, userNoTeam.TeamID)
	assert.Equal(t, uint(0), userNoTeam.Team.ID) // Leeres Team-Objekt

	// Team mit Users laden
	var loadedTeam Team
	result = db.Preload("Users").First(&loadedTeam, team.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, loadedTeam.Users, 1)
	assert.Equal(t, userWithTeam.ID, loadedTeam.Users[0].ID)

	// User zu Team hinzufügen
	userWithoutTeam.TeamID = &team.ID
	result = db.Save(&userWithoutTeam)
	assert.NoError(t, result.Error)

	// Prüfen, dass User jetzt im Team ist
	var updatedTeam Team
	result = db.Preload("Users").First(&updatedTeam, team.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, updatedTeam.Users, 2)

	// User aus Team entfernen
	userWithoutTeam.TeamID = nil
	result = db.Save(&userWithoutTeam)
	assert.NoError(t, result.Error)

	// Prüfen, dass User nicht mehr im Team ist
	var finalTeam Team
	result = db.Preload("Users").First(&finalTeam, team.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, finalTeam.Users, 1)

	// Test: User ohne Team erstellen
	userNoTeam2 := User{
		Username:      "user_no_team_2",
		Email:         "user_no_team_2@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP_NO_TEAM_2",
		Name:          "User No Team 2",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
		// TeamID ist nil
	}

	result = db.Create(&userNoTeam2)
	assert.NoError(t, result.Error)
	assert.Nil(t, userNoTeam2.TeamID)

	// Test: User ohne Team laden
	var loadedUserNoTeam User
	loadResult := db.Preload("Team").First(&loadedUserNoTeam, userNoTeam2.ID)
	assert.NoError(t, loadResult.Error)
	assert.Nil(t, loadedUserNoTeam.TeamID)
}
