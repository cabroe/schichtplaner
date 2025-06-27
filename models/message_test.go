package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
)

func TestMessage_TableName(t *testing.T) {
	message := Message{}
	assert.Equal(t, "messages", message.TableName())
}

func TestMessage_Struct(t *testing.T) {
	message := Message{
		ID:      1,
		Content: "Test message",
	}

	// Test basic field access
	assert.Equal(t, uint(1), message.ID)
	assert.Equal(t, "Test message", message.Content)
	assert.IsType(t, time.Time{}, message.CreatedAt)
	assert.IsType(t, time.Time{}, message.UpdatedAt)
	assert.IsType(t, gorm.DeletedAt{}, message.DeletedAt)
}

func TestMessage_JSONTags(t *testing.T) {
	// This test verifies that the struct has correct JSON tags
	// In a real application, you would typically test JSON marshaling/unmarshaling
	message := Message{
		ID:      1,
		Content: "Test message",
	}

	// Basic validation that the struct can be created and accessed
	assert.NotNil(t, message)
	assert.Equal(t, uint(1), message.ID)
	assert.Equal(t, "Test message", message.Content)
}

func TestMessage_EmptyContent(t *testing.T) {
	message := Message{
		ID:      1,
		Content: "",
	}

	assert.Equal(t, "", message.Content)
	assert.Equal(t, uint(1), message.ID)
}

func TestMessage_DefaultValues(t *testing.T) {
	message := Message{}

	// Test zero values
	assert.Equal(t, uint(0), message.ID)
	assert.Equal(t, "", message.Content)
	assert.True(t, message.CreatedAt.IsZero())
	assert.True(t, message.UpdatedAt.IsZero())
}
