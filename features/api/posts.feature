Feature: Posts API
  As a user of the JSONPlaceholder API
  I want to interact with posts
  So that I can create, read, update, and delete posts

  Scenario: Get all posts
    When I request all posts
    Then the response status should be 200
    And the response should contain a list of posts

  Scenario: Get a single post
    When I request post with id 1
    Then the response status should be 200
    And the response should contain post with id 1

  Scenario: Create a post
    When I create a post with title "foo" and body "bar" for user 1
    Then the response status should be 201
    And the response should contain the created post

  Scenario: Update a post
    When I update post with id 1 to title "updated" and body "updated" for user 1
    Then the response status should be 200
    And the response should contain the updated post

  Scenario: Delete a post
    When I delete post with id 1
    Then the response status should be 200
