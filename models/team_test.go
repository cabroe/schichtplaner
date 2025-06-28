package models

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestTeam_TableName(t *testing.T) {
	team := Team{}
	assert.Equal(t, "teams", team.TableName())
}

func TestTeam_Struct(t *testing.T) {
	team := Team{
		ID:          1,
		Name:        "Development Team",
		Description: "The main development team",
		Color:       "#00FF00",
		IsActive:    true,
		UserCount:   5,
	}

	// Test basic field access
	assert.Equal(t, uint(1), team.ID)
	assert.Equal(t, "Development Team", team.Name)
	assert.Equal(t, "The main development team", team.Description)
	assert.Equal(t, "#00FF00", team.Color)
	assert.True(t, team.IsActive)
	assert.Equal(t, 5, team.UserCount)
	assert.IsType(t, time.Time{}, team.CreatedAt)
	assert.IsType(t, time.Time{}, team.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, team.DeletedAt)
}

func TestTeam_DefaultValues(t *testing.T) {
	team := Team{}

	// Test zero values
	assert.Equal(t, uint(0), team.ID)
	assert.Equal(t, "", team.Name)
	assert.Equal(t, "", team.Description)
	assert.Equal(t, "", team.Color)
	assert.False(t, team.IsActive)
	assert.Equal(t, 0, team.UserCount)
	assert.True(t, team.CreatedAt.IsZero())
	assert.True(t, team.UpdatedAt.IsZero())
}

func TestTeam_WithDefaults(t *testing.T) {
	team := Team{
		Name: "Test Team",
	}

	// Test that required fields are set
	assert.Equal(t, "Test Team", team.Name)
	
	// Test that default values would be applied by GORM
	// (These are empty in the struct but would be set by database defaults)
	assert.Equal(t, "", team.Color)     // Would be "#10B981" by database
	assert.False(t, team.IsActive)      // Would be true by database
}

func TestTeam_JSONMarshaling(t *testing.T) {
	now := time.Now()
	team := Team{
		ID:          1,
		Name:        "Development Team",
		Description: "The main development team",
		Color:       "#00FF00",
		IsActive:    true,
		UserCount:   5,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	// Test JSON marshaling
	jsonData, err := json.Marshal(team)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), `"id":1`)
	assert.Contains(t, string(jsonData), `"name":"Development Team"`)
	assert.Contains(t, string(jsonData), `"description":"The main development team"`)
	assert.Contains(t, string(jsonData), `"color":"#00FF00"`)
	assert.Contains(t, string(jsonData), `"isActive":true`)
	assert.Contains(t, string(jsonData), `"userCount":5`)

	// Test JSON unmarshaling
	var unmarshalledTeam Team
	err = json.Unmarshal(jsonData, &unmarshalledTeam)
	assert.NoError(t, err)
	assert.Equal(t, team.ID, unmarshalledTeam.ID)
	assert.Equal(t, team.Name, unmarshalledTeam.Name)
	assert.Equal(t, team.Description, unmarshalledTeam.Description)
	assert.Equal(t, team.Color, unmarshalledTeam.Color)
	assert.Equal(t, team.IsActive, unmarshalledTeam.IsActive)
	assert.Equal(t, team.UserCount, unmarshalledTeam.UserCount)
}

func TestTeam_Relationships(t *testing.T) {
	team := Team{
		ID:          1,
		Name:        "Test Team",
		TeamMembers: []TeamMember{},
		ShiftTypes:  []ShiftType{},
	}

	// Test relationships initialization
	assert.NotNil(t, team.TeamMembers)
	assert.Len(t, team.TeamMembers, 0)
	assert.IsType(t, []TeamMember{}, team.TeamMembers)
	
	assert.NotNil(t, team.ShiftTypes)
	assert.Len(t, team.ShiftTypes, 0)
	assert.IsType(t, []ShiftType{}, team.ShiftTypes)
}

func TestTeam_ColorHexValidation(t *testing.T) {
	// Test valid hex colors
	validColors := []string{"#FF0000", "#00FF00", "#0000FF", "#10B981", "#ABCDEF"}
	
	for _, color := range validColors {
		team := Team{Color: color}
		assert.Equal(t, color, team.Color)
		assert.Len(t, team.Color, 7) // # + 6 hex characters
		assert.Equal(t, "#", team.Color[:1])
	}
}

func TestTeam_RequiredFieldsValidation(t *testing.T) {
	// Test that we can create a team with minimal required fields
	team := Team{
		Name: "Required Team",
	}

	assert.Equal(t, "Required Team", team.Name)
	assert.NotEmpty(t, team.Name)
}

func TestTeam_OptionalFields(t *testing.T) {
	// Test team with only required fields
	team := Team{
		Name: "Minimal Team",
	}

	assert.Equal(t, "Minimal Team", team.Name)
	assert.Empty(t, team.Description) // Optional field
	assert.Equal(t, 0, team.UserCount) // Computed field
}

func TestTeam_ComputedFields(t *testing.T) {
	team := Team{
		Name:      "Test Team",
		UserCount: 10, // This is a computed field that shouldn't be stored
	}

	// UserCount is marked with gorm:"-" so it's not stored in DB
	assert.Equal(t, 10, team.UserCount)
	
	// Reset to simulate loading from database (computed fields would be 0)
	team.UserCount = 0
	assert.Equal(t, 0, team.UserCount)
}
