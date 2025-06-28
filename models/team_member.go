package models

import (
	"time"

	"gorm.io/gorm"
)

// TeamMember represents the relationship between users and teams
type TeamMember struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	TeamID    uint           `json:"teamId" gorm:"not null;index"`
	UserID    uint           `json:"userId" gorm:"not null;index"`
	Role      string         `json:"role" gorm:"size:50;default:Mitglied"` // z.B. "Mitglied", "Leiter"
	JoinedAt  time.Time      `json:"joinedAt" gorm:"default:CURRENT_TIMESTAMP"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`

	// Relationships
	Team *Team `json:"team,omitempty" gorm:"foreignKey:TeamID"`
	User *User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// TableName returns the table name for the TeamMember model
func (TeamMember) TableName() string {
	return "team_members"
}
