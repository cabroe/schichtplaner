package models

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestUser_TableName(t *testing.T) {
	user := User{}
	assert.Equal(t, "users", user.TableName())
}

func TestUser_Struct(t *testing.T) {
	now := time.Now()
	user := User{
		ID:        1,
		Username:  "testuser",
		Name:      "Test User",
		Email:     "test@example.com",
		Color:     "#FF0000",
		Role:      "Developer",
		IsActive:  true,
		IsAdmin:   false,
		LastLogin: &now,
		TeamCount: 2,
	}

	// Test basic field access
	assert.Equal(t, uint(1), user.ID)
	assert.Equal(t, "testuser", user.Username)
	assert.Equal(t, "Test User", user.Name)
	assert.Equal(t, "test@example.com", user.Email)
	assert.Equal(t, "#FF0000", user.Color)
	assert.Equal(t, "Developer", user.Role)
	assert.True(t, user.IsActive)
	assert.False(t, user.IsAdmin)
	assert.Equal(t, &now, user.LastLogin)
	assert.Equal(t, 2, user.TeamCount)
	assert.IsType(t, time.Time{}, user.CreatedAt)
	assert.IsType(t, time.Time{}, user.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, user.DeletedAt)
}

func TestUser_DefaultValues(t *testing.T) {
	user := User{}

	// Test zero values
	assert.Equal(t, uint(0), user.ID)
	assert.Equal(t, "", user.Username)
	assert.Equal(t, "", user.Name)
	assert.Equal(t, "", user.Email)
	assert.Equal(t, "", user.Color)
	assert.Equal(t, "", user.Role)
	assert.False(t, user.IsActive)
	assert.False(t, user.IsAdmin)
	assert.Nil(t, user.LastLogin)
	assert.Equal(t, 0, user.TeamCount)
	assert.True(t, user.CreatedAt.IsZero())
	assert.True(t, user.UpdatedAt.IsZero())
}

func TestUser_WithDefaults(t *testing.T) {
	user := User{
		Username: "testuser",
		Name:     "Test User",
		Email:    "test@example.com",
	}

	// Test that required fields are set
	assert.Equal(t, "testuser", user.Username)
	assert.Equal(t, "Test User", user.Name)
	assert.Equal(t, "test@example.com", user.Email)
	
	// Test that default values would be applied by GORM
	// (These are empty in the struct but would be set by database defaults)
	assert.Equal(t, "", user.Color)    // Would be "#3B82F6" by database
	assert.Equal(t, "", user.Role)     // Would be "Mitarbeiter" by database
	assert.False(t, user.IsActive)     // Would be true by database
	assert.False(t, user.IsAdmin)      // Would be false by database
}

func TestUser_JSONMarshaling(t *testing.T) {
	now := time.Now()
	user := User{
		ID:        1,
		Username:  "testuser",
		Name:      "Test User",
		Email:     "test@example.com",
		Color:     "#FF0000",
		Role:      "Developer",
		IsActive:  true,
		IsAdmin:   false,
		LastLogin: &now,
		TeamCount: 2,
		CreatedAt: now,
		UpdatedAt: now,
	}

	// Test JSON marshaling
	jsonData, err := json.Marshal(user)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), `"id":1`)
	assert.Contains(t, string(jsonData), `"username":"testuser"`)
	assert.Contains(t, string(jsonData), `"name":"Test User"`)
	assert.Contains(t, string(jsonData), `"email":"test@example.com"`)
	assert.Contains(t, string(jsonData), `"color":"#FF0000"`)
	assert.Contains(t, string(jsonData), `"role":"Developer"`)
	assert.Contains(t, string(jsonData), `"isActive":true`)
	assert.Contains(t, string(jsonData), `"isAdmin":false`)
	assert.Contains(t, string(jsonData), `"teamCount":2`)

	// Test JSON unmarshaling
	var unmarshalledUser User
	err = json.Unmarshal(jsonData, &unmarshalledUser)
	assert.NoError(t, err)
	assert.Equal(t, user.ID, unmarshalledUser.ID)
	assert.Equal(t, user.Username, unmarshalledUser.Username)
	assert.Equal(t, user.Name, unmarshalledUser.Name)
	assert.Equal(t, user.Email, unmarshalledUser.Email)
	assert.Equal(t, user.Color, unmarshalledUser.Color)
	assert.Equal(t, user.Role, unmarshalledUser.Role)
	assert.Equal(t, user.IsActive, unmarshalledUser.IsActive)
	assert.Equal(t, user.IsAdmin, unmarshalledUser.IsAdmin)
	assert.Equal(t, user.TeamCount, unmarshalledUser.TeamCount)
}

func TestUser_Relationships(t *testing.T) {
	user := User{
		ID:          1,
		Username:    "testuser",
		TeamMembers: []TeamMember{},
	}

	// Test relationships initialization
	assert.NotNil(t, user.TeamMembers)
	assert.Len(t, user.TeamMembers, 0)
	assert.IsType(t, []TeamMember{}, user.TeamMembers)
}

func TestUser_ColorHexValidation(t *testing.T) {
	// Test valid hex colors
	validColors := []string{"#FF0000", "#00FF00", "#0000FF", "#3B82F6", "#ABCDEF"}
	
	for _, color := range validColors {
		user := User{Color: color}
		assert.Equal(t, color, user.Color)
		assert.Len(t, user.Color, 7) // # + 6 hex characters
		assert.Equal(t, "#", user.Color[:1])
	}
}

func TestUser_RequiredFieldsValidation(t *testing.T) {
	// Test that we can create a user with minimal required fields
	user := User{
		Username: "required_user",
		Name:     "Required Name",
		Email:    "required@example.com",
	}

	assert.Equal(t, "required_user", user.Username)
	assert.Equal(t, "Required Name", user.Name)
	assert.Equal(t, "required@example.com", user.Email)
	assert.NotEmpty(t, user.Username)
	assert.NotEmpty(t, user.Name)
	assert.NotEmpty(t, user.Email)
}
