Feature: Accessibility checks
  Run axe-core accessibility checks for configured pages and produce detailed reports

  Scenario: Run accessibility checks for all configured pages
    Given accessibility configuration is loaded
    When I run accessibility checks for each configured page
    Then detailed accessibility reports should be generated
