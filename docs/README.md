# 📚 API Documentation

This directory contains comprehensive API documentation for the Ensono QA Team Management system.

## 📋 Available Documentation Formats

### 🌐 Interactive HTML Documentation

- **File**: `index.html`
- **Description**: Interactive Swagger UI documentation that you can open in your browser
- **Features**:
  - Try out API endpoints directly
  - View request/response examples
  - Explore data models
  - Copy curl commands

### 📄 OpenAPI Specification Files

- **YAML**: `api-documentation.yaml` - Human-readable OpenAPI 3.0.3 specification
- **JSON**: `api-documentation.json` - Machine-readable OpenAPI 3.0.3 specification

## 🚀 How to View the Documentation

### Option 1: Interactive HTML (Recommended)

1. Start your local server:
   ```bash
   cd /Users/patrickhendron/Projects/test-spec-kit
   python3 -m http.server 3000 --directory docs
   ```
2. Open your browser and navigate to: `http://localhost:3000`
3. Explore the interactive API documentation

### Option 2: Import into Swagger Editor

1. Go to [Swagger Editor](https://editor.swagger.io/)
2. Copy the contents of `api-documentation.yaml`
3. Paste into the editor for interactive viewing

### Option 3: Import into Postman

1. Open Postman
2. Click "Import" → "File" → Select `api-documentation.json`
3. Generate a collection from the OpenAPI specification

## 🛠️ API Overview

The Ensono QA Team Management API provides the following functionality:

### 👥 Team Members Management

- **GET** `/team-members` - Retrieve all team members
- **POST** `/team-members` - Add a new team member
- **GET** `/team-members/{id}` - Get specific team member by ID

### 🔍 Search Functionality

- **GET** `/team-members/search?q={query}` - Search team members by name, title, skills, or projects

## 📊 Key Features

### 🎯 Smart Search

- Search across multiple fields (name, title, skills, projects)
- Match type indicators (name, title, skill, project)
- Handles both exact and partial matches

### ✅ Data Validation

- Required field validation
- Email format validation
- Duplicate email prevention
- Unique ID enforcement

### 🔄 Error Handling

- Comprehensive error responses
- HTTP status codes
- Detailed error messages
- Error type classification

### 📁 Data Models

- **TeamMember**: Complete profile information
- **Project**: Project details and technologies
- **SearchResponse**: Search results with metadata
- **Error**: Standardized error format

## 🛡️ Response Codes

| Code | Description                    |
| ---- | ------------------------------ |
| 200  | Success                        |
| 201  | Created                        |
| 400  | Bad Request / Validation Error |
| 404  | Not Found                      |
| 409  | Conflict (Duplicate Data)      |
| 500  | Internal Server Error          |

## 💾 Data Storage

The API uses **localStorage** for data persistence in the frontend application. This provides:

- Persistent data across browser sessions
- Fast data access
- No server-side database required
- Easy testing and development

## 🔗 Related Files

- **Source Code**: `../src/api/mockApiService.js`
- **Mock Data**: `../src/api/mockData.js`
- **Tests**: `../tests/add-profile-search-integration.spec.ts`

## 📝 Example Usage

### Search for Team Members

```bash
curl "http://localhost:3000/api/team-members/search?q=QA%20Engineer"
```

### Get All Team Members

```bash
curl "http://localhost:3000/api/team-members"
```

### Add New Team Member

```bash
curl -X POST "http://localhost:3000/api/team-members" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-member-123",
    "name": "Jane Smith",
    "title": "QA Engineer",
    "email": "jane.smith@ensono.com",
    "skills": ["Manual Testing", "API Testing"]
  }'
```

---

📞 **Need Help?**
Contact the Ensono QA Team at qa-team@ensono.com
