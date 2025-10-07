# Test-Spec-Kit

A team profile management application with comprehensive search functionality, built with vanilla JavaScript and tested with Playwright.

## Features

👥 **Team Profile Management** - Create and view detailed team member profiles  
🔍 **Advanced Search** - Search by name, title, skills, and projects with intelligent matching  
� **Local Persistence** - Profiles persist in browser localStorage across sessions  
� **E2E Testing** - Comprehensive test coverage using Playwright  
� **Responsive Design** - Works seamlessly across devices  
✨ **Clean UI** - Modern, accessible interface with proper semantic markup

## Live Demo

Start the development server to explore the application:

```bash
npm run serve
```

Then visit `http://localhost:3000` to:

- Browse existing team member profiles
- Create new profiles with skills and projects
- Search for team members using various criteria
- View detailed profile pages with complete information

## Quick Start

### 1. Install Dependencies

```bash
npm install
npx playwright install
```

### 2. Start the Application

```bash
npm run serve
# or
npm start
```

Visit `http://localhost:3000` to use the application.

### 3. Run Tests

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Debug tests
npm run test:debug
```

### 4. View Test Reports

```bash
npm run report
```

## Application Structure

```
src/
├── api/
│   ├── mockApiService.js  # Data persistence & API layer
│   └── mockData.js        # Initial team member data
├── scripts/
│   ├── add-profile.js     # Profile creation functionality
│   ├── profile.js         # Profile page rendering
│   └── search.js          # Search functionality
├── styles/
│   ├── main.css          # Global styles
│   └── add-profile.css   # Profile form styles
├── *.html                # Application pages
└── images/               # Assets

tests/
├── add-profile-search-integration.spec.ts  # Comprehensive integration tests
└── simple-test.spec.ts                     # Basic functionality tests
```

## Core Functionality

### 🔍 **Search Features**

- **Name Search**: Find team members by first or last name
- **Title Search**: Search by job title or role
- **Skills Search**: Match individual skills or skill combinations
- **Project Search**: Find by project names or involvement
- **Smart Matching**: Displays match type badges (Name, Title, Skills, Projects)

### 👤 **Profile Management**

- **Complete Profiles**: Name, title, email, location, bio, avatar
- **Skills Management**: Add multiple skills with dynamic UI
- **Project Portfolio**: Add projects with technologies, descriptions, and links
- **Data Persistence**: All data saved to localStorage
- **Profile Navigation**: Direct links from search results

### 🧪 **Testing**

- **Integration Tests**: Complete user workflows from profile creation to search
- **Data Integrity**: Validates all information persists correctly
- **Cross-Page Navigation**: Tests seamless navigation between pages
- **Search Validation**: Confirms all search types work accurately

## Test Coverage

The test suite includes comprehensive coverage of:

✅ **Profile Creation**: Complete form validation and submission  
✅ **Data Persistence**: localStorage integration and data retention  
✅ **Search Functionality**: All search types (name, title, skills, projects)  
✅ **Navigation**: Search results to profile page workflows  
✅ **Data Integrity**: Verification all profile data displays correctly  
✅ **Edge Cases**: Empty search results, multiple matches, data cleanup

### Test Examples

```typescript
// Test profile creation and immediate search
test('should create profile and find it immediately', async ({ page }) => {
  // Create a new profile
  await page.goto('/add-profile.html');
  await page.fill('[data-testid="name-input"]', 'Test User');
  // ... fill form and submit

  // Search for the profile
  await page.goto('/');
  await page.fill('[data-testid="search-input"]', 'Test User');
  await page.click('[data-testid="search-button"]');

  // Verify it's found
  await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
});
```

## 🤖 AI Test Generation

The project includes comprehensive AI prompts for generating Playwright tests:

📋 **[docs/prompts/](docs/prompts/)** - Complete prompt documentation including:

- **[Test Generation Guide](docs/prompts/PLAYWRIGHT_TEST_GENERATION.md)**: Primary AI assistant prompt with best practices
- **[Specialized Prompts](docs/prompts/PLAYWRIGHT_PROMPTS.md)**: 10 focused prompts covering:
  - **Form Testing**: Validation, submission, error handling patterns
  - **Search Integration**: All search types with result verification
  - **Error Handling**: Comprehensive edge case and failure scenarios
  - **Data Integrity**: End-to-end data validation workflows
  - **CI/CD Integration**: Optimized tests for automated pipelines
  - **Page Object Model**: Migration patterns for better maintainability
  - **Performance Testing**: Load handling and response time validation
  - **Mobile/Responsive**: Cross-device and viewport testing
  - **End-to-End Journeys**: Complete user workflow validation

These prompts are based on our established testing patterns and generate tests that follow the same reliability practices used in this project (manual form submission, proper waits, comprehensive error handling).

## Scripts

| Command               | Description                        |
| --------------------- | ---------------------------------- |
| `npm start`           | Start development server           |
| `npm run serve`       | Start development server (alias)   |
| `npm test`            | Run all tests                      |
| `npm run test:headed` | Run tests with visible browser     |
| `npm run test:ui`     | Interactive UI test mode           |
| `npm run test:debug`  | Debug mode with DevTools           |
| `npm run report`      | Show HTML test report              |
| `npm run test:app`    | Start server + run tests + cleanup |

## Development

### Local Development

1. Run `npm run serve` to start the development server
2. Make changes to files in the `src/` directory
3. The server auto-refreshes, but you may need to clear localStorage for data changes

### Adding Features

1. Update the relevant JavaScript files in `src/scripts/`
2. Add corresponding styles in `src/styles/`
3. Create integration tests in `tests/`
4. Run tests to ensure functionality works end-to-end

### Data Model

Profiles are stored in localStorage with this structure:

```javascript
{
  id: "generated-id",
  name: "Full Name",
  title: "Job Title",
  email: "email@example.com",
  location: "City, Country",
  bio: "Bio text",
  skills: ["Skill1", "Skill2"],
  projects: [{
    name: "Project Name",
    role: "Developer",
    description: "Project description",
    technologies: ["Tech1", "Tech2"]
  }],
  avatar: "/images/default-avatar.svg",
  joinedDate: "2025-01-01"
}
```

## Browser Support

Tested and supported in:

- **Chrome/Chromium** (primary development)
- **Firefox** (cross-browser validation)
- **Safari/WebKit** (macOS/iOS support)
- **Mobile browsers** (responsive design)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT
