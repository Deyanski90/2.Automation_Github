@authentication @teacher @smoke
Feature: Teacher Authentication
  As a teacher
  In order to access the teaching platform
  The teacher needs to authenticate with valid credentials

  Background:
    Given the login page is displayed
    And a valid teacher account exists

  @critical
  Scenario: Teacher logs in successfully with valid credentials
    When the teacher enters valid credentials
    And the teacher submits the login form
    Then the teacher should be redirected to the dashboard
    And the dashboard should display the teacher profile
    And the authentication token should be valid

  @negative
  Scenario: Teacher cannot login with invalid password
    When the teacher enters username with invalid password
    And the teacher submits the login form
    Then the login should fail with error message
    And the teacher should remain on the login page

  @security
  Scenario: Teacher authentication token expires correctly
    Given the teacher is logged in successfully
    When the authentication token expires
    Then the teacher should be logged out automatically
