package models

import (
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

func TestSchicht_Duration(t *testing.T) {
	schicht := &Schicht{
		StartTime: time.Date(2025, 1, 1, 8, 0, 0, 0, time.UTC),
		EndTime:   time.Date(2025, 1, 1, 16, 0, 0, 0, time.UTC),
	}

	duration := schicht.Duration()
	expected := 8 * time.Hour

	assert.Equal(t, expected, duration)
}

func TestSchicht_IsOverlapping(t *testing.T) {
	date := time.Date(2025, 1, 1, 0, 0, 0, 0, time.UTC)
	
	schicht1 := &Schicht{
		Date:      date,
		StartTime: time.Date(2025, 1, 1, 8, 0, 0, 0, time.UTC),
		EndTime:   time.Date(2025, 1, 1, 16, 0, 0, 0, time.UTC),
	}

	// Test overlapping shift
	schicht2 := &Schicht{
		Date:      date,
		StartTime: time.Date(2025, 1, 1, 14, 0, 0, 0, time.UTC),
		EndTime:   time.Date(2025, 1, 1, 22, 0, 0, 0, time.UTC),
	}

	// Test non-overlapping shift
	schicht3 := &Schicht{
		Date:      date,
		StartTime: time.Date(2025, 1, 1, 16, 0, 0, 0, time.UTC),
		EndTime:   time.Date(2025, 1, 1, 24, 0, 0, 0, time.UTC),
	}

	// Test different date
	schicht4 := &Schicht{
		Date:      time.Date(2025, 1, 2, 0, 0, 0, 0, time.UTC),
		StartTime: time.Date(2025, 1, 2, 10, 0, 0, 0, time.UTC),
		EndTime:   time.Date(2025, 1, 2, 18, 0, 0, 0, time.UTC),
	}

	assert.True(t, schicht1.IsOverlapping(schicht2), "Should detect overlapping shifts")
	assert.False(t, schicht1.IsOverlapping(schicht3), "Should not detect non-overlapping shifts")
	assert.False(t, schicht1.IsOverlapping(schicht4), "Should not detect overlap on different dates")
}

func TestSchicht_AssignedCount(t *testing.T) {
	schicht := &Schicht{
		Assignments: []SchichtAssignment{
			{Status: "assigned"},
			{Status: "confirmed"},
			{Status: "cancelled"},
			{Status: "assigned"},
		},
	}

	count := schicht.AssignedCount()
	assert.Equal(t, 3, count, "Should count only assigned and confirmed assignments")
}

func TestSchicht_IsFull(t *testing.T) {
	schicht := &Schicht{
		MaxWorkers: 2,
		Assignments: []SchichtAssignment{
			{Status: "assigned"},
			{Status: "confirmed"},
		},
	}

	assert.True(t, schicht.IsFull(), "Shift should be full when assigned count equals max workers")

	// Add one more assignment
	schicht.Assignments = append(schicht.Assignments, SchichtAssignment{Status: "assigned"})
	assert.True(t, schicht.IsFull(), "Shift should still be full when assigned count exceeds max workers")

	// Remove one assignment
	schicht.Assignments = schicht.Assignments[:1]
	assert.False(t, schicht.IsFull(), "Shift should not be full when assigned count is less than max workers")
}

func TestSchicht_HasMinimumStaffing(t *testing.T) {
	schicht := &Schicht{
		MinWorkers: 2,
		Assignments: []SchichtAssignment{
			{Status: "assigned"},
			{Status: "confirmed"},
		},
	}

	assert.True(t, schicht.HasMinimumStaffing(), "Should meet minimum staffing when assigned count equals min workers")

	// Remove one assignment
	schicht.Assignments = schicht.Assignments[:1]
	assert.False(t, schicht.HasMinimumStaffing(), "Should not meet minimum staffing when assigned count is less than min workers")

	// Add cancelled assignment (should still not meet minimum)
	schicht.Assignments = append(schicht.Assignments, SchichtAssignment{Status: "cancelled"})
	assert.False(t, schicht.HasMinimumStaffing(), "Cancelled assignments should not count towards minimum staffing")
}

func TestSchichtAssignment_TableName(t *testing.T) {
	assignment := SchichtAssignment{}
	assert.Equal(t, "schicht_assignments", assignment.TableName())
}

func TestSchicht_TableName(t *testing.T) {
	schicht := Schicht{}
	assert.Equal(t, "schichten", schicht.TableName())
}

func TestSchicht_DefaultValues(t *testing.T) {
	// This test would typically be run with a database to verify GORM default values
	// For now, we just test the struct initialization
	schicht := Schicht{
		Name:      "Test Shift",
		StartTime: time.Now(),
		EndTime:   time.Now().Add(8 * time.Hour),
		Date:      time.Now(),
	}

	assert.Equal(t, "Test Shift", schicht.Name)
	assert.NotZero(t, schicht.StartTime)
	assert.NotZero(t, schicht.EndTime)
	assert.NotZero(t, schicht.Date)
}
