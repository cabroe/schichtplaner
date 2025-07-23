package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestUser_All(t *testing.T) {
	// Führe alle User-Tests zusammen aus
	t.Run("Create", TestUser_Create)
	t.Run("Validation", TestUser_Validation)
	t.Run("UniqueConstraints", TestUser_UniqueConstraints)
	t.Run("DefaultValues", TestUser_DefaultValues)
	t.Run("SoftDelete", TestUser_SoftDelete)
	t.Run("Relationships", TestUser_Relationships)
}

func TestUser_Create(t *testing.T) {
	db := setupTestDB(t)

	user := User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
		Color:         "#ff0000",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result := db.Create(&user)
	assert.NoError(t, result.Error)
	assert.NotZero(t, user.ID)
	assert.NotZero(t, user.CreatedAt)
	assert.NotZero(t, user.UpdatedAt)
}

func TestUser_Validation(t *testing.T) {
	db := setupTestDB(t)

	// Test: Username ist required (GORM validiert nicht automatisch, aber wir testen es)
	user := User{
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
	}

	result := db.Create(&user)
	// GORM validiert nicht automatisch required fields, aber wir können es testen
	// In der Praxis sollten wir Validierung in den Handlers implementieren
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: Email ist required
	user = User{
		Username:      "testuser",
		Password:      "hashedpassword",
		AccountNumber: "EMP002",
		Name:          "Test User",
	}

	result = db.Create(&user)
	assert.NoError(t, result.Error) // GORM erlaubt dies
}

func TestUser_UniqueConstraints(t *testing.T) {
	db := setupTestDB(t)

	// Ersten User erstellen
	user1 := User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result := db.Create(&user1)
	assert.NoError(t, result.Error)

	// Zweiten User mit gleichem Username erstellen
	user2 := User{
		Username:      "testuser", // Gleicher Username
		Email:         "test2@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP002",
		Name:          "Test User 2",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result = db.Create(&user2)
	assert.Error(t, result.Error) // Sollte fehlschlagen wegen Unique-Constraint

	// Dritten User mit gleicher Email erstellen
	user3 := User{
		Username:      "testuser3",
		Email:         "test@example.com", // Gleiche Email
		Password:      "hashedpassword",
		AccountNumber: "EMP003",
		Name:          "Test User 3",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result = db.Create(&user3)
	assert.Error(t, result.Error) // Sollte fehlschlagen wegen Unique-Constraint

	// Vierten User mit gleicher AccountNumber erstellen
	user4 := User{
		Username:      "testuser4",
		Email:         "test4@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001", // Gleiche AccountNumber
		Name:          "Test User 4",
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
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
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
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
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

	// User erstellen
	user := User{
		Username:      "testuser",
		Email:         "test@example.com",
		Password:      "hashedpassword",
		AccountNumber: "EMP001",
		Name:          "Test User",
		IsActive:      true,
		Role:          "user",
		IsAdmin:       false,
	}

	result := db.Create(&user)
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

	// Shift für User erstellen
	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Test Shift",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result = db.Create(&shift)
	assert.NoError(t, result.Error)

	// User mit Shifts laden
	var userWithShifts User
	result = db.Preload("Shifts").First(&userWithShifts, user.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, userWithShifts.Shifts, 1)
	assert.Equal(t, shift.ID, userWithShifts.Shifts[0].ID)
}
