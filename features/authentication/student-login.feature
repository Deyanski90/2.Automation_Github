@authentication @student @smoke
Feature: Student Authentication
  As a student
  In order to access the learning platform
  The student needs to authenticate with valid credentials

  Background:
    Given the login page is displayed
    And a valid student account exists

  @critical
  Scenario: Student logs in successfully with valid credentials
    When the student enters valid credentials
    And the student submits the login form
    Then the student should be redirected to the dashboard
    And the dashboard should display the student profile
    And the authentication token should be valid

  @negative
  Scenario: Student cannot login with invalid password
    When the student enters username with invalid password
    And the student submits the login form
    Then the login should fail with error message
    And the student should remain on the login page

  @security
  Scenario: Student authentication token expires correctly
    Given the student is logged in successfully
    When the authentication token expires
    Then the student should be logged out automatically
