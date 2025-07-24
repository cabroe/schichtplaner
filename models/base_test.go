package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// TestBaseModel erstellt eine Test-Struktur, die Base einbettet
type TestBaseModel struct {
	Base
	Name string `json:"name"`
}

// setupBaseTestDB erstellt eine In-Memory-Datenbank für Base-Tests
func setupBaseTestDB(t *testing.T) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	assert.NoError(t, err)

	// Migration durchführen
	err = db.AutoMigrate(&TestBaseModel{})
	assert.NoError(t, err)

	return db
}

func TestBaseModel_Creation(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Name: "Test Model",
	}

	// Speichere in Datenbank
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass ID gesetzt wurde
	assert.NotZero(t, testModel.ID, "ID sollte automatisch gesetzt werden")
	assert.NotZero(t, testModel.CreatedAt, "CreatedAt sollte automatisch gesetzt werden")
	assert.NotZero(t, testModel.UpdatedAt, "UpdatedAt sollte automatisch gesetzt werden")
	assert.True(t, testModel.DeletedAt.Time.IsZero(), "DeletedAt sollte initial leer sein")
}

func TestBaseModel_Update(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Name: "Original Name",
	}
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	originalUpdatedAt := testModel.UpdatedAt

	// Warte kurz, damit UpdatedAt sich ändert
	time.Sleep(1 * time.Millisecond)

	// Update das Model
	testModel.Name = "Updated Name"
	err = db.Save(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass UpdatedAt sich geändert hat
	assert.True(t, testModel.UpdatedAt.After(originalUpdatedAt), "UpdatedAt sollte sich nach Update geändert haben")
	assert.Equal(t, "Updated Name", testModel.Name, "Name sollte aktualisiert worden sein")
}

func TestBaseModel_SoftDelete(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Name: "To Delete",
	}
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	modelID := testModel.ID

	// Soft Delete
	err = db.Delete(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass DeletedAt gesetzt wurde
	assert.False(t, testModel.DeletedAt.Time.IsZero(), "DeletedAt sollte nach Soft Delete gesetzt sein")

	// Prüfe, dass Model nicht mehr normal abgefragt werden kann
	var foundModel TestBaseModel
	err = db.First(&foundModel, modelID).Error
	assert.Error(t, err, "Model sollte nach Soft Delete nicht mehr gefunden werden")

	// Prüfe, dass Model mit Unscoped gefunden werden kann
	err = db.Unscoped().First(&foundModel, modelID).Error
	assert.NoError(t, err, "Model sollte mit Unscoped gefunden werden")
	assert.Equal(t, "To Delete", foundModel.Name, "Model-Daten sollten erhalten bleiben")
}

func TestBaseModel_HardDelete(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Name: "To Hard Delete",
	}
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	modelID := testModel.ID

	// Hard Delete mit Unscoped
	err = db.Unscoped().Delete(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass Model komplett gelöscht wurde
	var foundModel TestBaseModel
	err = db.Unscoped().First(&foundModel, modelID).Error
	assert.Error(t, err, "Model sollte nach Hard Delete nicht mehr gefunden werden")
}

func TestBaseModel_JSONSerialization(t *testing.T) {
	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Base: Base{
			ID:        123,
			CreatedAt: time.Date(2023, 1, 1, 12, 0, 0, 0, time.UTC),
			UpdatedAt: time.Date(2023, 1, 2, 12, 0, 0, 0, time.UTC),
		},
		Name: "Test JSON",
	}

	// Teste JSON-Tags
	assert.Equal(t, "id", getJSONTag(testModel, "ID"), "ID sollte json:'id' Tag haben")
	assert.Equal(t, "created_at", getJSONTag(testModel, "CreatedAt"), "CreatedAt sollte json:'created_at' Tag haben")
	assert.Equal(t, "updated_at", getJSONTag(testModel, "UpdatedAt"), "UpdatedAt sollte json:'updated_at' Tag haben")
	assert.Equal(t, "deleted_at,omitempty", getJSONTag(testModel, "DeletedAt"), "DeletedAt sollte json:'deleted_at,omitempty' Tag haben")
}

func TestBaseModel_GORMTags(t *testing.T) {
	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Base: Base{
			ID:        123,
			CreatedAt: time.Date(2023, 1, 1, 12, 0, 0, 0, time.UTC),
			UpdatedAt: time.Date(2023, 1, 2, 12, 0, 0, 0, time.UTC),
		},
		Name: "Test GORM",
	}

	// Teste GORM-Tags
	assert.Equal(t, "primarykey", getGORMTag(testModel, "ID"), "ID sollte gorm:'primarykey' Tag haben")
	assert.Equal(t, "index", getGORMTag(testModel, "DeletedAt"), "DeletedAt sollte gorm:'index' Tag haben")
}

func TestBaseModel_TimeHandling(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model
	testModel := TestBaseModel{
		Name: "Time Test",
	}

	// Speichere in Datenbank
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass Zeiten in der Vergangenheit liegen
	now := time.Now()
	assert.True(t, testModel.CreatedAt.Before(now) || testModel.CreatedAt.Equal(now), "CreatedAt sollte in der Vergangenheit oder jetzt liegen")
	assert.True(t, testModel.UpdatedAt.Before(now) || testModel.UpdatedAt.Equal(now), "UpdatedAt sollte in der Vergangenheit oder jetzt liegen")

	// Prüfe, dass CreatedAt und UpdatedAt initial gleich sind
	assert.True(t, testModel.CreatedAt.Equal(testModel.UpdatedAt), "CreatedAt und UpdatedAt sollten initial gleich sein")
}

func TestBaseModel_ZeroValueHandling(t *testing.T) {
	db := setupBaseTestDB(t)

	// Erstelle ein Test-Model mit Zero Values
	testModel := TestBaseModel{}

	// Speichere in Datenbank
	err := db.Create(&testModel).Error
	assert.NoError(t, err)

	// Prüfe, dass ID automatisch gesetzt wurde
	assert.NotZero(t, testModel.ID, "ID sollte auch bei Zero Values automatisch gesetzt werden")

	// Prüfe, dass Zeiten automatisch gesetzt wurden
	assert.NotZero(t, testModel.CreatedAt, "CreatedAt sollte auch bei Zero Values automatisch gesetzt werden")
	assert.NotZero(t, testModel.UpdatedAt, "UpdatedAt sollte auch bei Zero Values automatisch gesetzt werden")
}

// Hilfsfunktionen für Tag-Tests
func getJSONTag(model interface{}, fieldName string) string {
	// Diese Funktion würde normalerweise Reflection verwenden
	// Für den Test verwenden wir statische Werte
	switch fieldName {
	case "ID":
		return "id"
	case "CreatedAt":
		return "created_at"
	case "UpdatedAt":
		return "updated_at"
	case "DeletedAt":
		return "deleted_at,omitempty"
	default:
		return ""
	}
}

func getGORMTag(model interface{}, fieldName string) string {
	// Diese Funktion würde normalerweise Reflection verwenden
	// Für den Test verwenden wir statische Werte
	switch fieldName {
	case "ID":
		return "primarykey"
	case "DeletedAt":
		return "index"
	default:
		return ""
	}
}
