package models

import (
	"time"

	"gorm.io/gorm"
)

// Message represents a message in the database
type Message struct {
	ID        uint           `json:"id" gorm:"primarykey"`
	Content   string         `json:"message" gorm:"not null"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// TableName returns the table name for the Message model
func (Message) TableName() string {
	return "messages"
}
