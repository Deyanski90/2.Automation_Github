# Test Automation Framework

## Overview
BDD test automation framework using Playwright and Cucumber for testing user authentication and management.

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
npx playwright install
```

### Configuration
1. Copy `.env.example` to `.env`
2. Update environment variables with your values

## Running Tests
```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run teacher tests
npm run test:teacher

# Run specific feature
npx cucumber-js features/authentication/teacher-login.feature
```

## Project Structure
- `features/` - BDD feature files
- `step-definitions/` - Step implementations
- `pages/` - Page Object Model
- `support/` - Helper functions and hooks
- `test-data/` - Test data factories
- `reports/` - Test execution reports

## Best Practices Followed
- Single Responsibility per test
- Page Object Pattern
- Independent test scenarios
- Proper setup and teardown
- Environment-based configuration
- Automated cleanup

## Reports
After test execution, view reports:
```bash
npm run report
```
