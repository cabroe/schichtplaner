package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strconv"
	"testing"
	"time"

	"github.com/danhawkins/go-vite-react-example/db"
	"github.com/danhawkins/go-vite-react-example/models"
	"github.com/glebarez/sqlite"
	"github.com/labstack/echo/v4"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func setupTestDB() {
	database, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic("Failed to connect to test database")
	}

	db.DB = database

	// Auto-migrate the models
	err = db.DB.AutoMigrate(
		&models.Message{},
		&models.User{},
		&models.Team{},
		&models.TeamMember{},
		&models.ShiftType{},
	)
	if err != nil {
		panic("Failed to migrate test database")
	}
}

func TestUserAPI(t *testing.T) {
	setupTestDB()
	e := echo.New()
	RegisterHandlers(e)

	// Test Create User
	t.Run("Create User", func(t *testing.T) {
		user := models.User{
			Username: "testuser",
			Name:     "Test User",
			Email:    "test@example.com",
			Color:    "#FF0000",
			Role:     "Mitarbeiter",
		}

		userJSON, _ := json.Marshal(user)
		req := httptest.NewRequest(http.MethodPost, "/api/users", bytes.NewReader(userJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := createUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)

		var response models.User
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, user.Username, response.Username)
		assert.Equal(t, user.Email, response.Email)
	})

	// Test Get All Users
	t.Run("Get All Users", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/users", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getAllUsers(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Contains(t, response, "users")
		assert.Contains(t, response, "count")
	})

	// Test Get User by ID
	t.Run("Get User by ID", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/users/1", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/users/:id")
		c.SetParamNames("id")
		c.SetParamValues("1")

		err := getUserByID(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.User
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, uint(1), response.ID)
	})
}

func TestTeamAPI(t *testing.T) {
	setupTestDB()
	e := echo.New()
	RegisterHandlers(e)

	// Test Create Team
	t.Run("Create Team", func(t *testing.T) {
		team := models.Team{
			Name:        "Test Team",
			Description: "A test team",
			Color:       "#00FF00",
		}

		teamJSON, _ := json.Marshal(team)
		req := httptest.NewRequest(http.MethodPost, "/api/teams", bytes.NewReader(teamJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := createTeam(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)

		var response models.Team
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, team.Name, response.Name)
		assert.Equal(t, team.Description, response.Description)
	})

	// Test Get All Teams
	t.Run("Get All Teams", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/teams", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getAllTeams(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Contains(t, response, "teams")
		assert.Contains(t, response, "count")
	})
}

func TestTeamMemberAPI(t *testing.T) {
	setupTestDB()
	e := echo.New()
	RegisterHandlers(e)

	// Create test user and team first
	user := models.User{
		Username: "member1",
		Name:     "Member One",
		Email:    "member1@example.com",
	}
	db.DB.Create(&user)

	team := models.Team{
		Name: "Test Team",
	}
	db.DB.Create(&team)

	// Test Create TeamMember
	t.Run("Create TeamMember", func(t *testing.T) {
		teamMember := models.TeamMember{
			TeamID:   team.ID,
			UserID:   user.ID,
			Role:     "Mitglied",
			JoinedAt: time.Now(),
		}

		teamMemberJSON, _ := json.Marshal(teamMember)
		req := httptest.NewRequest(http.MethodPost, "/api/team-members", bytes.NewReader(teamMemberJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := createTeamMember(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)

		var response models.TeamMember
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, teamMember.TeamID, response.TeamID)
		assert.Equal(t, teamMember.UserID, response.UserID)
	})

	// Test Get All TeamMembers
	t.Run("Get All TeamMembers", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/team-members", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getAllTeamMembers(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Contains(t, response, "teamMembers")
		assert.Contains(t, response, "count")
	})
}

func TestShiftTypeAPI(t *testing.T) {
	setupTestDB()
	e := echo.New()
	RegisterHandlers(e)

	// Test Create ShiftType
	t.Run("Create ShiftType", func(t *testing.T) {
		shiftType := models.ShiftType{
			Name:        "Morning Shift",
			Description: "Early morning shift",
			Color:       "#0000FF",
			Duration:    480, // 8 hours
			BreakTime:   30,  // 30 minutes
		}

		shiftTypeJSON, _ := json.Marshal(shiftType)
		req := httptest.NewRequest(http.MethodPost, "/api/shift-types", bytes.NewReader(shiftTypeJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := createShiftType(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusCreated, rec.Code)

		var response models.ShiftType
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, shiftType.Name, response.Name)
		assert.Equal(t, shiftType.Duration, response.Duration)
	})

	// Test Get All ShiftTypes
	t.Run("Get All ShiftTypes", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/shift-types", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)

		err := getAllShiftTypes(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]interface{}
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Contains(t, response, "shiftTypes")
		assert.Contains(t, response, "count")
	})
}

func TestInvalidIDHandling(t *testing.T) {
	setupTestDB()
	e := echo.New()

	// Test invalid user ID
	t.Run("Invalid User ID", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/users/invalid", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/users/:id")
		c.SetParamNames("id")
		c.SetParamValues("invalid")

		err := getUserByID(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusBadRequest, rec.Code)
	})

	// Test non-existent user ID
	t.Run("Non-existent User ID", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodGet, "/api/users/999", nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/users/:id")
		c.SetParamNames("id")
		c.SetParamValues("999")

		err := getUserByID(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusNotFound, rec.Code)
	})
}

func TestUpdateAndDelete(t *testing.T) {
	setupTestDB()
	e := echo.New()

	// Create a user for testing
	user := models.User{
		Username: "updatetest",
		Name:     "Update Test",
		Email:    "update@example.com",
	}
	db.DB.Create(&user)

	// Test Update User
	t.Run("Update User", func(t *testing.T) {
		updatedUser := models.User{
			ID:       user.ID,
			Username: "updateduser",
			Name:     "Updated User",
			Email:    "updated@example.com",
		}

		userJSON, _ := json.Marshal(updatedUser)
		req := httptest.NewRequest(http.MethodPut, "/api/users/"+strconv.Itoa(int(user.ID)), bytes.NewReader(userJSON))
		req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/users/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(user.ID)))

		err := updateUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response models.User
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, updatedUser.Username, response.Username)
	})

	// Test Delete User
	t.Run("Delete User", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodDelete, "/api/users/"+strconv.Itoa(int(user.ID)), nil)
		rec := httptest.NewRecorder()
		c := e.NewContext(req, rec)
		c.SetPath("/api/users/:id")
		c.SetParamNames("id")
		c.SetParamValues(strconv.Itoa(int(user.ID)))

		err := deleteUser(c)
		assert.NoError(t, err)
		assert.Equal(t, http.StatusOK, rec.Code)

		var response map[string]string
		err = json.Unmarshal(rec.Body.Bytes(), &response)
		assert.NoError(t, err)
		assert.Equal(t, "User deleted successfully", response["message"])
	})
}
