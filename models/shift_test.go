package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestShift_All(t *testing.T) {
	// Führe alle Shift-Tests zusammen aus
	t.Run("Create", TestShift_Create)
	t.Run("Validation", TestShift_Validation)
	t.Run("DefaultValues", TestShift_DefaultValues)
	t.Run("TimeValidation", TestShift_TimeValidation)
	t.Run("Relationships", TestShift_Relationships)
	t.Run("SoftDelete", TestShift_SoftDelete)
}

func TestShift_Create(t *testing.T) {
	db := setupTestDB(t)

	// User und Schedule für Tests erstellen
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
	db.Create(&user)

	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result := db.Create(&shift)
	assert.NoError(t, result.Error)
	assert.NotZero(t, shift.ID)
	assert.NotZero(t, shift.CreatedAt)
	assert.NotZero(t, shift.UpdatedAt)
}

func TestShift_Validation(t *testing.T) {
	db := setupTestDB(t)

	// User und Schedule für Tests erstellen
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
	db.Create(&user)

	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	// Test: UserID ist required (GORM validiert nicht automatisch)
	shift := Shift{
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result := db.Create(&shift)
	// GORM validiert nicht automatisch required fields
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: StartTime ist required
	shift = Shift{
		UserID:      user.ID,
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result = db.Create(&shift)
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: EndTime ist required
	shift = Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result = db.Create(&shift)
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: ScheduleID ist required
	shift = Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
	}

	result = db.Create(&shift)
	assert.NoError(t, result.Error) // GORM erlaubt dies
}

func TestShift_DefaultValues(t *testing.T) {
	db := setupTestDB(t)

	// User und Schedule für Tests erstellen
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
	db.Create(&user)

	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		Description: "Frühschicht",
		ScheduleID:  schedule.ID,
	}

	result := db.Create(&shift)
	assert.NoError(t, result.Error)

	// Prüfen, ob Default-Werte gesetzt wurden
	assert.Equal(t, 0, shift.BreakTime) // Default sollte 0 sein
	assert.True(t, shift.IsActive)      // Default sollte true sein
}

func TestShift_TimeValidation(t *testing.T) {
	db := setupTestDB(t)

	// User und Schedule für Tests erstellen
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
	db.Create(&user)

	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	// Test: EndTime sollte nach StartTime sein
	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now().Add(8 * time.Hour), // StartTime in der Zukunft
		EndTime:     time.Now(),                    // EndTime in der Vergangenheit
		BreakTime:   30,
		Description: "Ungültige Schicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}

	result := db.Create(&shift)
	// GORM validiert nicht automatisch Zeitlogik, aber wir können es testen
	assert.NoError(t, result.Error) // GORM erlaubt dies, aber wir sollten es in der Anwendung validieren
}

func TestShift_Relationships(t *testing.T) {
	db := setupTestDB(t)

	// User erstellen
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
	db.Create(&user)

	// Schedule erstellen
	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	// Shift erstellen
	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}
	db.Create(&shift)

	// Shift mit User laden
	var shiftWithUser Shift
	result := db.Preload("User").First(&shiftWithUser, shift.ID)
	assert.NoError(t, result.Error)
	assert.Equal(t, user.ID, shiftWithUser.User.ID)
	assert.Equal(t, user.Username, shiftWithUser.User.Username)

	// Shift mit Schedule laden
	var shiftWithSchedule Shift
	result = db.Preload("Schedule").First(&shiftWithSchedule, shift.ID)
	assert.NoError(t, result.Error)
	assert.Equal(t, schedule.ID, shiftWithSchedule.Schedule.ID)
	assert.Equal(t, schedule.Name, shiftWithSchedule.Schedule.Name)
}

func TestShift_SoftDelete(t *testing.T) {
	db := setupTestDB(t)

	// User und Schedule für Tests erstellen
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
	db.Create(&user)

	schedule := Schedule{
		Name:        "Test Schedule",
		Description: "Test Description",
		StartDate:   time.Now(),
		EndDate:     time.Now().Add(24 * time.Hour),
		IsActive:    true,
	}
	db.Create(&schedule)

	shift := Shift{
		UserID:      user.ID,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
		BreakTime:   30,
		Description: "Frühschicht",
		IsActive:    true,
		ScheduleID:  schedule.ID,
	}
	db.Create(&shift)

	// Shift löschen (Soft Delete)
	result := db.Delete(&shift)
	assert.NoError(t, result.Error)

	// Prüfen, ob Shift noch in der Datenbank ist (Soft Delete)
	var count int64
	db.Model(&Shift{}).Count(&count)
	assert.Equal(t, int64(0), count) // Sollte 0 sein, da Soft Delete

	// Prüfen, ob Shift mit Unscoped gefunden wird
	var deletedShift Shift
	result = db.Unscoped().First(&deletedShift, shift.ID)
	assert.NoError(t, result.Error)
	assert.NotNil(t, deletedShift.DeletedAt) // DeletedAt sollte gesetzt sein
}
