# CLAUDE.md - AI Assistant Guide for higher-or-pwned

This document provides guidance for AI assistants working on this codebase.

## Project Overview

**higher-or-pwned** is a "Higher or Lower" style guessing game with a security/data breach theme (referencing "pwned" - a term commonly used in security contexts for compromised accounts).

### Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React full-stack framework)
- **Language**: TypeScript (strict mode)
- **Paradigm**: Functional Programming
- **Styling**: CSS/Tailwind (TBD)
- **State Management**: TanStack Router + React Query

### Current State

- **Status**: Newly initialized repository
- **Codebase**: Empty (only `.gitkeep` placeholder)
- **Ready for**: Initial project setup with TanStack Start

## Repository Structure

### Planned Architecture

```
higher-or-pwned/
├── app/
│   ├── routes/                 # TanStack Start file-based routing
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home page
│   │   └── game.tsx            # Game page
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   └── game/               # Game-specific components
│   ├── api/                    # API request functions (separated)
│   │   ├── breaches.api.ts     # Breach data API calls
│   │   ├── scores.api.ts       # Score/leaderboard API calls
│   │   └── index.ts            # API exports
│   ├── services/               # Business logic services
│   │   ├── game.service.ts     # Game logic
│   │   └── score.service.ts    # Scoring logic
│   ├── hooks/                  # Custom React hooks
│   │   ├── useGame.ts          # Game state hook
│   │   └── useBreaches.ts      # Data fetching hook
│   ├── types/                  # TypeScript type definitions
│   │   ├── game.types.ts       # Game-related types
│   │   ├── breach.types.ts     # Breach data types
│   │   └── api.types.ts        # API response types
│   ├── utils/                  # Pure utility functions
│   │   ├── formatters.ts       # Data formatting
│   │   └── validators.ts       # Validation functions
│   ├── constants/              # Application constants
│   │   └── game.constants.ts   # Game configuration
│   └── styles/                 # Global styles
├── public/                     # Static assets
├── tests/                      # Test files
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── .gitignore
├── package.json
├── tsconfig.json
├── app.config.ts               # TanStack Start config
├── README.md
└── CLAUDE.md
```

## Development Guidelines

### TanStack Start Specifics

```bash
# Create new TanStack Start project
npx create-start@latest

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### TypeScript Best Practices

#### Strict Configuration

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Type Definitions

- **Always define explicit types** - avoid `any` at all costs
- **Use interfaces for objects**, types for unions/intersections
- **Export types** from dedicated `.types.ts` files
- **Use generics** for reusable type-safe functions
- **Prefer `readonly`** for immutable data structures

```typescript
// ✅ Good - Explicit types, readonly, well-structured
interface Breach {
  readonly id: string;
  readonly name: string;
  readonly affectedCount: number;
  readonly date: Date;
}

type GameState = 'idle' | 'playing' | 'gameOver';

// ❌ Bad - Implicit any, mutable
const breach = { id: 1, name: 'test' };
```

### Functional Programming Paradigm

#### Core Principles

1. **Pure Functions** - Same input always produces same output, no side effects
2. **Immutability** - Never mutate data, always return new instances
3. **Function Composition** - Build complex logic from simple functions
4. **Declarative Code** - Describe what, not how

#### Examples

```typescript
// ✅ Good - Pure function, immutable
const calculateScore = (streak: number, basePoints: number): number =>
  basePoints * Math.pow(1.5, streak);

const addScore = (scores: readonly number[], newScore: number): readonly number[] =>
  [...scores, newScore];

// ✅ Good - Function composition
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => fns.reduce((acc, fn) => fn(acc), value);

const processBreachData = pipe(
  normalizeData,
  filterInvalid,
  sortByDate
);

// ❌ Bad - Mutates state, impure
let totalScore = 0;
const addToScore = (points: number) => {
  totalScore += points; // Side effect!
};
```

#### Preferred Patterns

- Use `map`, `filter`, `reduce` instead of `for` loops
- Use `const` exclusively (never `let` or `var`)
- Prefer ternary operators over `if/else` for simple conditions
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Destructure objects and arrays

```typescript
// ✅ Good - Declarative, functional
const getTopBreaches = (breaches: readonly Breach[], limit: number): readonly Breach[] =>
  [...breaches]
    .sort((a, b) => b.affectedCount - a.affectedCount)
    .slice(0, limit);

// ❌ Bad - Imperative
function getTopBreaches(breaches, limit) {
  let sorted = [];
  for (let i = 0; i < breaches.length; i++) {
    sorted.push(breaches[i]);
  }
  sorted.sort((a, b) => b.affectedCount - a.affectedCount);
  return sorted.slice(0, limit);
}
```

### API Layer Architecture

**All HTTP requests must be separated into dedicated API files.**

#### Structure

```
app/api/
├── client.ts           # Base HTTP client configuration
├── breaches.api.ts     # Breach-related endpoints
├── scores.api.ts       # Score-related endpoints
└── index.ts            # Centralized exports
```

#### API Client (client.ts)

```typescript
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

interface RequestConfig {
  readonly headers?: Record<string, string>;
  readonly signal?: AbortSignal;
}

const createRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  config: RequestConfig = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers,
    },
    signal: config.signal,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }

  return response.json();
};

export const apiClient = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    createRequest<T>(endpoint, { method: 'GET' }, config),

  post: <T>(endpoint: string, data: unknown, config?: RequestConfig) =>
    createRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(data) }, config),
} as const;
```

#### API Module Example (breaches.api.ts)

```typescript
import { apiClient } from './client';
import type { Breach, BreachListResponse } from '../types/breach.types';

export const breachesApi = {
  getAll: (): Promise<BreachListResponse> =>
    apiClient.get('/breaches'),

  getById: (id: string): Promise<Breach> =>
    apiClient.get(`/breaches/${id}`),

  getRandom: (count: number): Promise<readonly Breach[]> =>
    apiClient.get(`/breaches/random?count=${count}`),
} as const;
```

#### Using with TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { breachesApi } from '../api';

export const useBreaches = () =>
  useQuery({
    queryKey: ['breaches'],
    queryFn: breachesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

export const useRandomBreaches = (count: number) =>
  useQuery({
    queryKey: ['breaches', 'random', count],
    queryFn: () => breachesApi.getRandom(count),
  });
```

### Component Architecture

#### Component Structure

```typescript
// ComponentName.tsx
import type { FC } from 'react';

interface ComponentNameProps {
  readonly title: string;
  readonly onAction: () => void;
}

export const ComponentName: FC<ComponentNameProps> = ({ title, onAction }) => (
  <div>
    <h1>{title}</h1>
    <button onClick={onAction}>Action</button>
  </div>
);
```

#### Component Guidelines

- **One component per file** - named exports preferred
- **Props interface** - always define with `readonly` properties
- **Functional components only** - use hooks for state/effects
- **Composition over inheritance** - build complex UIs from simple components
- **Colocation** - keep related files close (component + styles + tests)

### Code Conventions

#### Naming

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `GameBoard.tsx` |
| Files (utilities) | camelCase | `formatters.ts` |
| Files (types) | camelCase.types | `game.types.ts` |
| Files (api) | camelCase.api | `breaches.api.ts` |
| Components | PascalCase | `GameBoard` |
| Functions | camelCase | `calculateScore` |
| Constants | SCREAMING_SNAKE | `MAX_SCORE` |
| Types/Interfaces | PascalCase | `GameState` |
| Type props | PascalCase + Props | `GameBoardProps` |

#### Imports Order

```typescript
// 1. React/Framework
import { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal - API/Services
import { breachesApi } from '../api';

// 4. Internal - Components
import { Button } from '../components/ui';

// 5. Internal - Hooks
import { useGame } from '../hooks';

// 6. Internal - Utils/Constants
import { formatNumber } from '../utils';

// 7. Internal - Types (use 'import type')
import type { Breach } from '../types';

// 8. Styles
import './GameBoard.css';
```

### Error Handling

```typescript
// Custom error types
class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Result type pattern for error handling
type Result<T, E = Error> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: E };

const safeParseJson = <T>(json: string): Result<T> => {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
};
```

### Commit Message Format

```
type(scope): description

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat(game): add higher/lower comparison logic
fix(api): handle network errors in breaches endpoint
refactor(hooks): extract game logic into useGame hook
```

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Claude branches: `claude/description-sessionid`

## Testing Guidelines

### Test Structure

```typescript
// game.service.test.ts
import { describe, it, expect } from 'vitest';
import { calculateScore, compareBreaches } from './game.service';

describe('calculateScore', () => {
  it('should return base points for streak of 0', () => {
    expect(calculateScore(0, 100)).toBe(100);
  });

  it('should multiply points by 1.5 for each streak level', () => {
    expect(calculateScore(2, 100)).toBe(225);
  });
});
```

### Testing Priorities

1. **Unit tests** for pure functions (services, utils)
2. **Integration tests** for hooks with API calls
3. **Component tests** for user interactions
4. **E2E tests** for critical user flows

## Common Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type checking
npm run typecheck

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## AI Assistant Notes

When working on this project:

1. **Read existing code** before making changes
2. **Follow functional programming** patterns strictly
3. **Separate API calls** into the `api/` directory
4. **Define types** in dedicated `.types.ts` files
5. **Keep components pure** - extract logic into hooks/services
6. **Write tests** for all business logic
7. **Use TanStack patterns** - Router for navigation, Query for data fetching

### Anti-patterns to Avoid

- ❌ Using `any` type
- ❌ Mutating state directly
- ❌ Mixing API calls with component logic
- ❌ Using `let` or `var`
- ❌ Class components
- ❌ Imperative loops when functional alternatives exist
- ❌ Inline API URLs in components

---

*Last updated: 2026-01-28*
*Framework: TanStack Start*
*Language: TypeScript (Strict)*
*Paradigm: Functional Programming*
