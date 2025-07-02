package models

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestShift_TableName(t *testing.T) {
	shift := Shift{}
	assert.Equal(t, "shifts", shift.TableName())
}

func TestShift_Struct(t *testing.T) {
	teamID := uint(10)
	shiftTypeID := uint(20)
	userID := uint(30)
	start := time.Now()
	end := start.Add(8 * time.Hour)
	shift := Shift{
		ID:          1,
		TeamID:      teamID,
		ShiftTypeID: shiftTypeID,
		UserID:      userID,
		StartTime:   start,
		EndTime:     end,
		Notes:       "Testschicht",
		IsActive:    true,
	}

	assert.Equal(t, uint(1), shift.ID)
	assert.Equal(t, teamID, shift.TeamID)
	assert.Equal(t, shiftTypeID, shift.ShiftTypeID)
	assert.Equal(t, userID, shift.UserID)
	assert.Equal(t, start, shift.StartTime)
	assert.Equal(t, end, shift.EndTime)
	assert.Equal(t, "Testschicht", shift.Notes)
	assert.True(t, shift.IsActive)
	assert.IsType(t, time.Time{}, shift.CreatedAt)
	assert.IsType(t, time.Time{}, shift.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, shift.DeletedAt)
}

func TestShift_DefaultValues(t *testing.T) {
	shift := Shift{}

	assert.Equal(t, uint(0), shift.ID)
	assert.Equal(t, uint(0), shift.TeamID)
	assert.Equal(t, uint(0), shift.ShiftTypeID)
	assert.Equal(t, uint(0), shift.UserID)
	assert.True(t, shift.StartTime.IsZero())
	assert.True(t, shift.EndTime.IsZero())
	assert.Equal(t, "", shift.Notes)
	assert.False(t, shift.IsActive)
	assert.True(t, shift.CreatedAt.IsZero())
	assert.True(t, shift.UpdatedAt.IsZero())
}

func TestShift_JSONMarshaling(t *testing.T) {
	now := time.Now()
	shift := Shift{
		ID:          1,
		TeamID:      10,
		ShiftTypeID: 20,
		UserID:      30,
		StartTime:   now,
		EndTime:     now.Add(8 * time.Hour),
		Notes:       "Testschicht",
		IsActive:    true,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	jsonData, err := json.Marshal(shift)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), `"id":1`)
	assert.Contains(t, string(jsonData), `"teamId":10`)
	assert.Contains(t, string(jsonData), `"shiftTypeId":20`)
	assert.Contains(t, string(jsonData), `"userId":30`)
	assert.Contains(t, string(jsonData), `"notes":"Testschicht"`)
	assert.Contains(t, string(jsonData), `"isActive":true`)

	var unmarshalled Shift
	err = json.Unmarshal(jsonData, &unmarshalled)
	assert.NoError(t, err)
	assert.Equal(t, shift.ID, unmarshalled.ID)
	assert.Equal(t, shift.TeamID, unmarshalled.TeamID)
	assert.Equal(t, shift.ShiftTypeID, unmarshalled.ShiftTypeID)
	assert.Equal(t, shift.UserID, unmarshalled.UserID)
	assert.Equal(t, shift.Notes, unmarshalled.Notes)
	assert.Equal(t, shift.IsActive, unmarshalled.IsActive)
}

func TestShift_Relationships(t *testing.T) {
	team := &Team{ID: 10, Name: "Test Team"}
	shiftType := &ShiftType{ID: 20, Name: "Frühschicht"}
	user := &User{ID: 30, Username: "max"}
	shift := Shift{
		ID:          1,
		TeamID:      10,
		ShiftTypeID: 20,
		UserID:      30,
		Team:        team,
		ShiftType:   shiftType,
		User:        user,
	}

	assert.NotNil(t, shift.Team)
	assert.NotNil(t, shift.ShiftType)
	assert.NotNil(t, shift.User)
	assert.Equal(t, uint(10), shift.Team.ID)
	assert.Equal(t, "Test Team", shift.Team.Name)
	assert.Equal(t, uint(20), shift.ShiftType.ID)
	assert.Equal(t, "Frühschicht", shift.ShiftType.Name)
	assert.Equal(t, uint(30), shift.User.ID)
	assert.Equal(t, "max", shift.User.Username)
}

func TestShift_RequiredFieldsValidation(t *testing.T) {
	shift := Shift{
		TeamID:      1,
		ShiftTypeID: 2,
		UserID:      3,
		StartTime:   time.Now(),
		EndTime:     time.Now().Add(8 * time.Hour),
	}
	assert.Equal(t, uint(1), shift.TeamID)
	assert.Equal(t, uint(2), shift.ShiftTypeID)
	assert.Equal(t, uint(3), shift.UserID)
	assert.False(t, shift.StartTime.IsZero())
	assert.False(t, shift.EndTime.IsZero())
}

func TestShift_OptionalFields(t *testing.T) {
	shift := Shift{
		TeamID:      1,
		ShiftTypeID: 2,
		UserID:      3,
	}
	assert.Equal(t, "", shift.Notes)
	assert.False(t, shift.IsActive)
	assert.True(t, shift.StartTime.IsZero())
	assert.True(t, shift.EndTime.IsZero())
	assert.True(t, shift.CreatedAt.IsZero())
	assert.True(t, shift.UpdatedAt.IsZero())
}

func TestShift_WithDefaults(t *testing.T) {
	shift := Shift{
		TeamID:      1,
		ShiftTypeID: 2,
		UserID:      3,
	}

	assert.Equal(t, uint(1), shift.TeamID)
	assert.Equal(t, uint(2), shift.ShiftTypeID)
	assert.Equal(t, uint(3), shift.UserID)
	assert.Equal(t, "", shift.Notes) // Would be set by DB default
	assert.False(t, shift.IsActive)  // Would be true by DB default
	assert.True(t, shift.StartTime.IsZero())
	assert.True(t, shift.EndTime.IsZero())
}

func TestShift_FieldTypes(t *testing.T) {
	shift := Shift{}
	assert.IsType(t, uint(0), shift.ID)
	assert.IsType(t, uint(0), shift.TeamID)
	assert.IsType(t, uint(0), shift.ShiftTypeID)
	assert.IsType(t, uint(0), shift.UserID)
	assert.IsType(t, time.Time{}, shift.StartTime)
	assert.IsType(t, time.Time{}, shift.EndTime)
	assert.IsType(t, "", shift.Notes)
	assert.IsType(t, bool(false), shift.IsActive)
	assert.IsType(t, time.Time{}, shift.CreatedAt)
	assert.IsType(t, time.Time{}, shift.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, shift.DeletedAt)
}
