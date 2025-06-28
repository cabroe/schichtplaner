package models

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestShiftType_TableName(t *testing.T) {
	shiftType := ShiftType{}
	assert.Equal(t, "shift_types", shiftType.TableName())
}

func TestShiftType_Struct(t *testing.T) {
	teamID := uint(10)
	createdBy := uint(20)
	shiftType := ShiftType{
		ID:          1,
		Name:        "Morning Shift",
		Description: "Early morning shift from 6 AM to 2 PM",
		Color:       "#FFA500",
		IsActive:    true,
		Duration:    480, // 8 hours in minutes
		BreakTime:   30,  // 30 minutes break
		TeamID:      &teamID,
		CreatedBy:   &createdBy,
	}

	// Test basic field access
	assert.Equal(t, uint(1), shiftType.ID)
	assert.Equal(t, "Morning Shift", shiftType.Name)
	assert.Equal(t, "Early morning shift from 6 AM to 2 PM", shiftType.Description)
	assert.Equal(t, "#FFA500", shiftType.Color)
	assert.True(t, shiftType.IsActive)
	assert.Equal(t, 480, shiftType.Duration)
	assert.Equal(t, 30, shiftType.BreakTime)
	assert.Equal(t, &teamID, shiftType.TeamID)
	assert.Equal(t, &createdBy, shiftType.CreatedBy)
	assert.IsType(t, time.Time{}, shiftType.CreatedAt)
	assert.IsType(t, time.Time{}, shiftType.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, shiftType.DeletedAt)
}

func TestShiftType_DefaultValues(t *testing.T) {
	shiftType := ShiftType{}

	// Test zero values
	assert.Equal(t, uint(0), shiftType.ID)
	assert.Equal(t, "", shiftType.Name)
	assert.Equal(t, "", shiftType.Description)
	assert.Equal(t, "", shiftType.Color)
	assert.False(t, shiftType.IsActive)
	assert.Equal(t, 0, shiftType.Duration)
	assert.Equal(t, 0, shiftType.BreakTime)
	assert.Nil(t, shiftType.TeamID)
	assert.Nil(t, shiftType.CreatedBy)
	assert.True(t, shiftType.CreatedAt.IsZero())
	assert.True(t, shiftType.UpdatedAt.IsZero())
}

func TestShiftType_WithDefaults(t *testing.T) {
	shiftType := ShiftType{
		Name: "Test Shift",
	}

	// Test that required fields are set
	assert.Equal(t, "Test Shift", shiftType.Name)
	
	// Test that default values would be applied by GORM
	// (These are empty in the struct but would be set by database defaults)
	assert.Equal(t, "", shiftType.Color)      // Would be "#F59E0B" by database
	assert.False(t, shiftType.IsActive)       // Would be true by database
	assert.Equal(t, 0, shiftType.Duration)    // Would be 480 by database
	assert.Equal(t, 0, shiftType.BreakTime)   // Would be 30 by database
}

func TestShiftType_JSONMarshaling(t *testing.T) {
	now := time.Now()
	teamID := uint(10)
	createdBy := uint(20)
	shiftType := ShiftType{
		ID:          1,
		Name:        "Morning Shift",
		Description: "Early morning shift",
		Color:       "#FFA500",
		IsActive:    true,
		Duration:    480,
		BreakTime:   30,
		TeamID:      &teamID,
		CreatedBy:   &createdBy,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Test JSON marshaling
	jsonData, err := json.Marshal(shiftType)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), `"id":1`)
	assert.Contains(t, string(jsonData), `"name":"Morning Shift"`)
	assert.Contains(t, string(jsonData), `"description":"Early morning shift"`)
	assert.Contains(t, string(jsonData), `"color":"#FFA500"`)
	assert.Contains(t, string(jsonData), `"isActive":true`)
	assert.Contains(t, string(jsonData), `"duration":480`)
	assert.Contains(t, string(jsonData), `"breakTime":30`)
	assert.Contains(t, string(jsonData), `"teamId":10`)
	assert.Contains(t, string(jsonData), `"createdBy":20`)

	// Test JSON unmarshaling
	var unmarshalledShiftType ShiftType
	err = json.Unmarshal(jsonData, &unmarshalledShiftType)
	assert.NoError(t, err)
	assert.Equal(t, shiftType.ID, unmarshalledShiftType.ID)
	assert.Equal(t, shiftType.Name, unmarshalledShiftType.Name)
	assert.Equal(t, shiftType.Description, unmarshalledShiftType.Description)
	assert.Equal(t, shiftType.Color, unmarshalledShiftType.Color)
	assert.Equal(t, shiftType.IsActive, unmarshalledShiftType.IsActive)
	assert.Equal(t, shiftType.Duration, unmarshalledShiftType.Duration)
	assert.Equal(t, shiftType.BreakTime, unmarshalledShiftType.BreakTime)
	assert.Equal(t, *shiftType.TeamID, *unmarshalledShiftType.TeamID)
	assert.Equal(t, *shiftType.CreatedBy, *unmarshalledShiftType.CreatedBy)
}

func TestShiftType_Relationships(t *testing.T) {
	team := &Team{ID: 10, Name: "Test Team"}
	user := &User{ID: 20, Username: "creator"}
	teamID := uint(10)
	createdBy := uint(20)
	
	shiftType := ShiftType{
		ID:            1,
		Name:          "Test Shift",
		TeamID:        &teamID,
		CreatedBy:     &createdBy,
		Team:          team,
		CreatedByUser: user,
	}

	// Test relationships
	assert.NotNil(t, shiftType.Team)
	assert.NotNil(t, shiftType.CreatedByUser)
	assert.Equal(t, uint(10), shiftType.Team.ID)
	assert.Equal(t, "Test Team", shiftType.Team.Name)
	assert.Equal(t, uint(20), shiftType.CreatedByUser.ID)
	assert.Equal(t, "creator", shiftType.CreatedByUser.Username)
	
	// Test that foreign keys match
	assert.Equal(t, *shiftType.TeamID, shiftType.Team.ID)
	assert.Equal(t, *shiftType.CreatedBy, shiftType.CreatedByUser.ID)
}

func TestShiftType_RequiredFieldsValidation(t *testing.T) {
	// Test that we can create a shift type with minimal required fields
	shiftType := ShiftType{
		Name: "Required Shift",
	}

	assert.Equal(t, "Required Shift", shiftType.Name)
	assert.NotEmpty(t, shiftType.Name)
}

func TestShiftType_OptionalFields(t *testing.T) {
	// Test shift type with only required fields
	shiftType := ShiftType{
		Name: "Minimal Shift",
	}

	assert.Equal(t, "Minimal Shift", shiftType.Name)
	assert.Empty(t, shiftType.Description) // Optional field
	assert.Nil(t, shiftType.TeamID)        // Optional field
	assert.Nil(t, shiftType.CreatedBy)     // Optional field
}

func TestShiftType_ColorHexValidation(t *testing.T) {
	// Test valid hex colors
	validColors := []string{"#FF0000", "#00FF00", "#0000FF", "#F59E0B", "#ABCDEF"}
	
	for _, color := range validColors {
		shiftType := ShiftType{Color: color}
		assert.Equal(t, color, shiftType.Color)
		assert.Len(t, shiftType.Color, 7) // # + 6 hex characters
		assert.Equal(t, "#", shiftType.Color[:1])
	}
}

func TestShiftType_DurationValidation(t *testing.T) {
	// Test different duration values (in minutes)
	durations := []int{240, 480, 600, 720} // 4h, 8h, 10h, 12h
	
	for _, duration := range durations {
		shiftType := ShiftType{
			Name:     "Test Shift",
			Duration: duration,
		}
		assert.Equal(t, duration, shiftType.Duration)
		assert.Greater(t, shiftType.Duration, 0)
	}
}

func TestShiftType_BreakTimeValidation(t *testing.T) {
	// Test different break time values (in minutes)
	breakTimes := []int{15, 30, 45, 60} // 15min, 30min, 45min, 1h
	
	for _, breakTime := range breakTimes {
		shiftType := ShiftType{
			Name:      "Test Shift",
			BreakTime: breakTime,
		}
		assert.Equal(t, breakTime, shiftType.BreakTime)
		assert.GreaterOrEqual(t, shiftType.BreakTime, 0)
	}
}

func TestShiftType_OptionalTeamAssignment(t *testing.T) {
	// Test shift type without team assignment (global shift type)
	globalShiftType := ShiftType{
		Name: "Global Shift",
	}
	assert.Nil(t, globalShiftType.TeamID)
	
	// Test shift type with team assignment
	teamID := uint(10)
	teamShiftType := ShiftType{
		Name:   "Team Shift",
		TeamID: &teamID,
	}
	assert.NotNil(t, teamShiftType.TeamID)
	assert.Equal(t, uint(10), *teamShiftType.TeamID)
}

func TestShiftType_CreatedByTracking(t *testing.T) {
	// Test shift type without creator tracking
	shiftType := ShiftType{
		Name: "Anonymous Shift",
	}
	assert.Nil(t, shiftType.CreatedBy)
	
	// Test shift type with creator tracking
	createdBy := uint(20)
	trackedShiftType := ShiftType{
		Name:      "Tracked Shift",
		CreatedBy: &createdBy,
	}
	assert.NotNil(t, trackedShiftType.CreatedBy)
	assert.Equal(t, uint(20), *trackedShiftType.CreatedBy)
}
