# CLAUDE.md - AI Assistant Guide for higher-or-pwned

This document provides guidance for AI assistants working on this codebase.

## Project Overview

**higher-or-pwned** is a new project repository. Based on the name, this appears to be intended as a "Higher or Lower" style guessing game with a security/data breach theme (referencing "pwned" - a term commonly used in security contexts for compromised accounts).

### Current State

- **Status**: Newly initialized repository
- **Codebase**: Empty (only `.gitkeep` placeholder)
- **Ready for**: Initial project setup and implementation

## Repository Structure

```
higher-or-pwned/
├── .git/              # Git version control
├── .gitkeep           # Placeholder file
└── CLAUDE.md          # This file - AI assistant guidelines
```

### Planned Structure (Typical for this type of project)

```
higher-or-pwned/
├── src/               # Source code
│   ├── components/    # UI components (if frontend)
│   ├── services/      # Business logic and API services
│   ├── utils/         # Utility functions
│   └── types/         # Type definitions
├── tests/             # Test files
├── public/            # Static assets (if web app)
├── docs/              # Documentation
├── .gitignore         # Git ignore rules
├── package.json       # Dependencies (if Node.js)
├── README.md          # Project documentation
└── CLAUDE.md          # AI assistant guidelines
```

## Development Guidelines

### Getting Started

When setting up this project, consider:

1. **Choose a tech stack** appropriate for a game application:
   - Frontend: React, Vue, Svelte, or vanilla JS
   - Backend (if needed): Node.js, Python, or similar
   - Data source: API for breach data (e.g., Have I Been Pwned API) or static dataset

2. **Initialize the project** with appropriate tooling:
   - Package manager (npm, yarn, pnpm)
   - Linting (ESLint, Prettier)
   - Testing framework (Jest, Vitest)
   - TypeScript for type safety (recommended)

### Code Conventions

When writing code for this project:

- **Use clear, descriptive names** for variables, functions, and components
- **Follow single responsibility principle** - keep functions focused
- **Write tests** for game logic and scoring systems
- **Handle errors gracefully** - especially for any API calls
- **Keep security in mind** - don't expose sensitive data or API keys

### Commit Message Format

Use conventional commit format:

```
type(scope): description

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(game): add higher/lower comparison logic
fix(score): correct point calculation on streak
docs(readme): add setup instructions
```

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Claude branches: `claude/description-sessionid`

## Game Concept Notes

Based on the project name "higher-or-pwned":

### Potential Game Mechanics

1. **Compare breach data**: Show two data breaches and guess which affected more accounts
2. **Guess the count**: Estimate how many accounts were compromised in a breach
3. **Timeline challenge**: Guess which breach happened first
4. **Company comparison**: Compare security incidents between organizations

### Key Features to Implement

- [ ] Game state management
- [ ] Score tracking and high scores
- [ ] Data source integration (breach statistics)
- [ ] Responsive UI for gameplay
- [ ] Streak/combo system for consecutive correct answers
- [ ] Game over and restart flow

## Testing Guidelines

- Write unit tests for game logic
- Test edge cases (ties, invalid inputs)
- Test scoring calculations
- Integration tests for data fetching (if applicable)

## Common Commands

These will be defined once the project is set up:

```bash
# Install dependencies (example)
npm install

# Run development server (example)
npm run dev

# Run tests (example)
npm test

# Build for production (example)
npm run build

# Lint code (example)
npm run lint
```

## AI Assistant Notes

When working on this project:

1. **Read existing code** before making changes
2. **Follow established patterns** in the codebase
3. **Keep changes minimal** and focused on the task
4. **Don't over-engineer** - start simple, iterate
5. **Test your changes** before committing
6. **Update this CLAUDE.md** as the project evolves

### Files to Update When Project Grows

As the project develops, update this document with:
- Actual project structure
- Real command examples
- Specific coding patterns used
- API documentation
- Environment setup requirements
- Known issues or gotchas

---

*Last updated: 2026-01-28*
*Repository status: Newly initialized*
