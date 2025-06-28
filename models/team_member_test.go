package models

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestTeamMember_TableName(t *testing.T) {
	teamMember := TeamMember{}
	assert.Equal(t, "team_members", teamMember.TableName())
}

func TestTeamMember_Struct(t *testing.T) {
	joinedAt := time.Now()
	teamMember := TeamMember{
		ID:       1,
		TeamID:   10,
		UserID:   20,
		Role:     "Leiter",
		JoinedAt: joinedAt,
	}

	// Test basic field access
	assert.Equal(t, uint(1), teamMember.ID)
	assert.Equal(t, uint(10), teamMember.TeamID)
	assert.Equal(t, uint(20), teamMember.UserID)
	assert.Equal(t, "Leiter", teamMember.Role)
	assert.Equal(t, joinedAt, teamMember.JoinedAt)
	assert.IsType(t, time.Time{}, teamMember.CreatedAt)
	assert.IsType(t, time.Time{}, teamMember.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, teamMember.DeletedAt)
}

func TestTeamMember_DefaultValues(t *testing.T) {
	teamMember := TeamMember{}

	// Test zero values
	assert.Equal(t, uint(0), teamMember.ID)
	assert.Equal(t, uint(0), teamMember.TeamID)
	assert.Equal(t, uint(0), teamMember.UserID)
	assert.Equal(t, "", teamMember.Role)
	assert.True(t, teamMember.JoinedAt.IsZero())
	assert.True(t, teamMember.CreatedAt.IsZero())
	assert.True(t, teamMember.UpdatedAt.IsZero())
}

func TestTeamMember_WithDefaults(t *testing.T) {
	teamMember := TeamMember{
		TeamID: 10,
		UserID: 20,
	}

	// Test that required fields are set
	assert.Equal(t, uint(10), teamMember.TeamID)
	assert.Equal(t, uint(20), teamMember.UserID)
	
	// Test that default values would be applied by GORM
	// (These are empty in the struct but would be set by database defaults)
	assert.Equal(t, "", teamMember.Role)         // Would be "Mitglied" by database
	assert.True(t, teamMember.JoinedAt.IsZero()) // Would be CURRENT_TIMESTAMP by database
}

func TestTeamMember_JSONMarshaling(t *testing.T) {
	now := time.Now()
	teamMember := TeamMember{
		ID:        1,
		TeamID:    10,
		UserID:    20,
		Role:      "Leiter",
		JoinedAt:  now,
		CreatedAt: now,
		UpdatedAt: now,
	}

	// Test JSON marshaling
	jsonData, err := json.Marshal(teamMember)
	assert.NoError(t, err)
	assert.Contains(t, string(jsonData), `"id":1`)
	assert.Contains(t, string(jsonData), `"teamId":10`)
	assert.Contains(t, string(jsonData), `"userId":20`)
	assert.Contains(t, string(jsonData), `"role":"Leiter"`)

	// Test JSON unmarshaling
	var unmarshalledTeamMember TeamMember
	err = json.Unmarshal(jsonData, &unmarshalledTeamMember)
	assert.NoError(t, err)
	assert.Equal(t, teamMember.ID, unmarshalledTeamMember.ID)
	assert.Equal(t, teamMember.TeamID, unmarshalledTeamMember.TeamID)
	assert.Equal(t, teamMember.UserID, unmarshalledTeamMember.UserID)
	assert.Equal(t, teamMember.Role, unmarshalledTeamMember.Role)
}

func TestTeamMember_Relationships(t *testing.T) {
	team := &Team{ID: 10, Name: "Test Team"}
	user := &User{ID: 20, Username: "testuser"}
	
	teamMember := TeamMember{
		ID:     1,
		TeamID: 10,
		UserID: 20,
		Team:   team,
		User:   user,
	}

	// Test relationships
	assert.NotNil(t, teamMember.Team)
	assert.NotNil(t, teamMember.User)
	assert.Equal(t, uint(10), teamMember.Team.ID)
	assert.Equal(t, "Test Team", teamMember.Team.Name)
	assert.Equal(t, uint(20), teamMember.User.ID)
	assert.Equal(t, "testuser", teamMember.User.Username)
	
	// Test that foreign keys match
	assert.Equal(t, teamMember.TeamID, teamMember.Team.ID)
	assert.Equal(t, teamMember.UserID, teamMember.User.ID)
}

func TestTeamMember_RequiredFieldsValidation(t *testing.T) {
	// Test that we can create a team member with minimal required fields
	teamMember := TeamMember{
		TeamID: 10,
		UserID: 20,
	}

	assert.Equal(t, uint(10), teamMember.TeamID)
	assert.Equal(t, uint(20), teamMember.UserID)
	assert.NotEqual(t, uint(0), teamMember.TeamID)
	assert.NotEqual(t, uint(0), teamMember.UserID)
}

func TestTeamMember_RoleValidation(t *testing.T) {
	// Test different role values
	roles := []string{"Mitglied", "Leiter", "Administrator", "Beobachter"}
	
	for _, role := range roles {
		teamMember := TeamMember{
			TeamID: 10,
			UserID: 20,
			Role:   role,
		}
		assert.Equal(t, role, teamMember.Role)
		assert.NotEmpty(t, teamMember.Role)
	}
}

func TestTeamMember_JoinedAtTime(t *testing.T) {
	now := time.Now()
	teamMember := TeamMember{
		TeamID:   10,
		UserID:   20,
		JoinedAt: now,
	}

	assert.Equal(t, now, teamMember.JoinedAt)
	assert.False(t, teamMember.JoinedAt.IsZero())
	
	// Test that JoinedAt can be set to past time
	pastTime := now.AddDate(-1, 0, 0) // 1 year ago
	teamMember.JoinedAt = pastTime
	assert.Equal(t, pastTime, teamMember.JoinedAt)
	assert.True(t, teamMember.JoinedAt.Before(now))
}

func TestTeamMember_ForeignKeyConstraints(t *testing.T) {
	teamMember := TeamMember{
		TeamID: 10,
		UserID: 20,
	}

	// Test that foreign key fields are properly set
	assert.Greater(t, teamMember.TeamID, uint(0))
	assert.Greater(t, teamMember.UserID, uint(0))
	
	// Test that we can create relationships
	teamMember.Team = &Team{ID: teamMember.TeamID}
	teamMember.User = &User{ID: teamMember.UserID}
	
	assert.Equal(t, teamMember.TeamID, teamMember.Team.ID)
	assert.Equal(t, teamMember.UserID, teamMember.User.ID)
}
