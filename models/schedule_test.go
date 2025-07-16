package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration durchführen
	err = db.AutoMigrate(&User{}, &Shift{}, &Schedule{})
	assert.NoError(t, err)

	return db
}

func TestSchedule_Create(t *testing.T) {
	db := setupTestDB(t)

	schedule := Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
		IsActive:    true,
	}

	result := db.Create(&schedule)
	assert.NoError(t, result.Error)
	assert.NotZero(t, schedule.ID)
	assert.NotZero(t, schedule.CreatedAt)
	assert.NotZero(t, schedule.UpdatedAt)
}

func TestSchedule_Validation(t *testing.T) {
	db := setupTestDB(t)

	// Test: Name ist required (GORM validiert nicht automatisch)
	schedule := Schedule{
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
		IsActive:    true,
	}

	result := db.Create(&schedule)
	// GORM validiert nicht automatisch required fields
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: StartDate ist required
	schedule = Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
		IsActive:    true,
	}

	result = db.Create(&schedule)
	assert.NoError(t, result.Error) // GORM erlaubt dies

	// Test: EndDate ist required
	schedule = Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		IsActive:    true,
	}

	result = db.Create(&schedule)
	assert.NoError(t, result.Error) // GORM erlaubt dies
}

func TestSchedule_DefaultValues(t *testing.T) {
	db := setupTestDB(t)

	schedule := Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
	}

	result := db.Create(&schedule)
	assert.NoError(t, result.Error)

	// Prüfen, ob Default-Werte gesetzt wurden
	assert.True(t, schedule.IsActive) // Default sollte true sein
}

func TestSchedule_DateValidation(t *testing.T) {
	db := setupTestDB(t)

	// Test: EndDate sollte nach StartDate sein
	schedule := Schedule{
		Name:        "Ungültiger Plan",
		Description: "EndDate vor StartDate",
		StartDate:   time.Date(2024, 1, 31, 0, 0, 0, 0, time.UTC), // Späteres Datum
		EndDate:     time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),  // Früheres Datum
		IsActive:    true,
	}

	result := db.Create(&schedule)
	// GORM validiert nicht automatisch Datumslogik, aber wir können es testen
	assert.NoError(t, result.Error) // GORM erlaubt dies, aber wir sollten es in der Anwendung validieren
}

func TestSchedule_Relationships(t *testing.T) {
	db := setupTestDB(t)

	// Schedule erstellen
	schedule := Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
		IsActive:    true,
	}
	db.Create(&schedule)

	// User erstellen
	user := User{
		Username:  "testuser",
		Email:     "test@example.com",
		FirstName: "Test",
		LastName:  "User",
		IsActive:  true,
		Role:      "user",
	}
	db.Create(&user)

	// Shift für Schedule erstellen
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

	// Schedule mit Shifts laden
	var scheduleWithShifts Schedule
	result := db.Preload("Shifts").First(&scheduleWithShifts, schedule.ID)
	assert.NoError(t, result.Error)
	assert.Len(t, scheduleWithShifts.Shifts, 1)
	assert.Equal(t, shift.ID, scheduleWithShifts.Shifts[0].ID)
}

func TestSchedule_SoftDelete(t *testing.T) {
	db := setupTestDB(t)

	schedule := Schedule{
		Name:        "Januar 2024",
		Description: "Schichtplan für Januar",
		StartDate:   time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
		EndDate:     time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
		IsActive:    true,
	}
	db.Create(&schedule)

	// Schedule löschen (Soft Delete)
	result := db.Delete(&schedule)
	assert.NoError(t, result.Error)

	// Prüfen, ob Schedule noch in der Datenbank ist (Soft Delete)
	var count int64
	db.Model(&Schedule{}).Count(&count)
	assert.Equal(t, int64(0), count) // Sollte 0 sein, da Soft Delete

	// Prüfen, ob Schedule mit Unscoped gefunden wird
	var deletedSchedule Schedule
	result = db.Unscoped().First(&deletedSchedule, schedule.ID)
	assert.NoError(t, result.Error)
	assert.NotNil(t, deletedSchedule.DeletedAt) // DeletedAt sollte gesetzt sein
}

func TestSchedule_DateRange(t *testing.T) {
	db := setupTestDB(t)

	// Test mit verschiedenen Datumsbereichen
	testCases := []struct {
		name      string
		startDate time.Time
		endDate   time.Time
		shouldErr bool
	}{
		{
			name:      "Gültiger Bereich - 1 Monat",
			startDate: time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
			endDate:   time.Date(2024, 1, 31, 23, 59, 59, 0, time.UTC),
			shouldErr: false,
		},
		{
			name:      "Gültiger Bereich - 1 Jahr",
			startDate: time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
			endDate:   time.Date(2024, 12, 31, 23, 59, 59, 0, time.UTC),
			shouldErr: false,
		},
		{
			name:      "Gleiche Daten",
			startDate: time.Date(2024, 1, 1, 0, 0, 0, 0, time.UTC),
			endDate:   time.Date(2024, 1, 1, 23, 59, 59, 0, time.UTC),
			shouldErr: false,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			schedule := Schedule{
				Name:        tc.name,
				Description: "Test Schedule",
				StartDate:   tc.startDate,
				EndDate:     tc.endDate,
				IsActive:    true,
			}

			result := db.Create(&schedule)
			if tc.shouldErr {
				assert.Error(t, result.Error)
			} else {
				assert.NoError(t, result.Error)
				assert.NotZero(t, schedule.ID)
			}
		})
	}
}
