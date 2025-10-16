@user-management @regression
Feature: User Account Creation
  As a system administrator
  In order to onboard new users
  The system needs to create user accounts with proper validation

  Background:
    Given the API is accessible
    And the database is in a clean state

  @teacher @smoke
  Scenario: Create new teacher account with valid data
    When a new teacher account is created with valid information
    Then the account should be created successfully
    And the teacher should receive a generated password
    And the teacher should be able to login with generated credentials
    And the teacher role should be assigned correctly

  @student @smoke
  Scenario: Create new student account with valid data
    When a new student account is created with valid information
    Then the account should be created successfully
    And the student should receive a generated password
    And the student should be able to login with generated credentials
    And the student role should be assigned correctly

  @data-driven
  Scenario Outline: Create multiple user accounts with different roles
    When a new "<role>" account is created with valid information
    Then the account should be created successfully
    And the user should have "<role>" permissions

    Examples:
      | role    |
      | teacher |
      | student |
      | admin   |
