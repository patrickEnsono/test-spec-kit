# 🎭 Playwright Testing Prompts Documentation

This directory contains comprehensive AI prompts and documentation for generating high-quality Playwright tests.

## 🎯 File Purposes

### 🤖 **AI_ASSISTANT_GUIDELINES.md**

**Purpose**: Primary workflow guide for AI assistants  
**Contains**: Step-by-step test generation process, best practices, MCP server usage patterns  
**Use When**: Setting up AI assistants for test generation work

### 🎯 **SCENARIO_SPECIFIC_PROMPTS.md**

**Purpose**: Ready-to-use prompts for specific testing scenarios  
**Contains**: 11 specialized prompts (forms, search, accessibility, performance, etc.)  
**Use When**: You need tests for a specific scenario and want proven patterns

## 📁 Directory Structure

```
docs/prompts/
├── README.md                           # This file - Overview and index
├── AI_ASSISTANT_GUIDELINES.md         # General AI workflow and best practices
├── SCENARIO_SPECIFIC_PROMPTS.md       # 11 specialized test generation prompts
└── examples/                          # Example implementations (future)
```

## 📋 Available Prompts

### 🎯 **Core Test Generation**

- **[AI_ASSISTANT_GUIDELINES.md](./AI_ASSISTANT_GUIDELINES.md)** - AI workflow, best practices, and test generation guidelines
- **[SCENARIO_SPECIFIC_PROMPTS.md](./SCENARIO_SPECIFIC_PROMPTS.md)** - 11 specialized prompts for different testing scenarios

### 🔧 **Specialized Prompts**

From `SCENARIO_SPECIFIC_PROMPTS.md`, these cover:

1. **General Test Creation** - Basic test structure and patterns
2. **Form Testing** - Comprehensive form validation and submission
3. **Search Integration** - Search functionality and results validation
4. **Error Handling** - Error scenarios and edge cases
5. **Data Integrity** - Data consistency and validation
6. **CI/CD Integration** - Continuous integration patterns
7. **Page Object Model Migration** - Converting to POM patterns
8. **Performance Testing** - Load and performance validation
9. **Mobile/Responsive Testing** - Cross-device testing
10. **End-to-End User Journey** - Complete user workflow testing
11. **WCAG 2.1 AA Accessibility Testing** - Industry-standard accessibility compliance

## 🎯 Quick Start

### For AI Assistants

1. **Start with**: [AI_ASSISTANT_GUIDELINES.md](./AI_ASSISTANT_GUIDELINES.md) for general guidelines
2. **Choose specific prompt**: From [SCENARIO_SPECIFIC_PROMPTS.md](./SCENARIO_SPECIFIC_PROMPTS.md) based on test type needed
3. **Follow workflow**: Navigate → Snapshot → Interact → Generate → Test → Fix

### For Developers

1. **Reference prompts** when working with AI assistants for test generation
2. **Use specialized prompts** for specific testing scenarios
3. **Follow established patterns** from existing test suite

## 🛠️ Integration

These prompts are designed to work with:

- ✅ **Playwright MCP Server** - For site navigation and interaction
- ✅ **TypeScript** - All generated tests use TypeScript
- ✅ **@playwright/test** - Standard Playwright test framework
- ✅ **Existing patterns** - Follows project's established testing practices
- ✅ **Accessibility Tools** - @axe-core/playwright, Pa11y, Lighthouse integration

## 📊 Usage Statistics

- **Total Prompts**: 12 (1 general + 11 specialized)
- **Coverage Areas**: Forms, Search, Errors, Performance, Mobile, CI/CD, Accessibility
- **Generated Tests**: 64 stable tests using these prompts
- **Success Rate**: 100% (all generated tests passing)
- **Accessibility Compliance**: WCAG 2.1 AA standards supported

## 🔗 Related Documentation

- **[../README.md](../README.md)** - Main project documentation
- **[../../README.md](../../README.md)** - Repository overview
- **[../api-documentation.yaml](../api-documentation.yaml)** - API specifications
- **[../../tests/](../../tests/)** - Example test implementations

## 🚀 Contributing

When adding new prompts:

1. Follow the established format in `SCENARIO_SPECIFIC_PROMPTS.md`
2. Include specific selector patterns and best practices
3. Test the prompt with actual test generation
4. Update this README with new prompt descriptions

---

_These prompts are continuously refined based on real-world test generation experience and project requirements._
