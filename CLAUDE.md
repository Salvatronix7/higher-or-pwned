# CLAUDE.md - AI Assistant Guide for higher-or-pwned

This document provides guidance for AI assistants working on this codebase.

## Project Overview

**higher-or-pwned** is a "Higher or Lower" style guessing game with a security/data breach theme (referencing "pwned" - a term commonly used in security contexts for compromised accounts).

### Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) (React full-stack framework)
- **Rendering**: Static Site Generation (SSG) / Server-Side Rendering (SSR)
- **Data Fetching**: [TanStack Query](https://tanstack.com/query) (server state management)
- **Routing**: [TanStack Router](https://tanstack.com/router) (type-safe routing)
- **Language**: TypeScript (strict mode)
- **Paradigm**: Functional Programming
- **Styling**: CSS (vanilla CSS with CSS Modules)

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
│   │   ├── client.ts           # HTTP client configuration
│   │   ├── breaches.api.ts     # Breach data API calls
│   │   ├── scores.api.ts       # Score/leaderboard API calls
│   │   └── index.ts            # API exports
│   ├── queries/                # TanStack Query hooks
│   │   ├── keys.ts             # Query key factory
│   │   ├── breaches.queries.ts # Breach query hooks
│   │   ├── scores.queries.ts   # Score query hooks
│   │   └── index.ts            # Query exports
│   ├── services/               # Business logic services
│   │   ├── game.service.ts     # Game logic
│   │   └── score.service.ts    # Scoring logic
│   ├── hooks/                  # Custom React hooks (non-query)
│   │   └── useGame.ts          # Game state hook
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

## TanStack Query - Data Fetching

### Query Client Configuration

```typescript
// app/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,           // 1 minute
        gcTime: 5 * 60 * 1000,          // 5 minutes (formerly cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: 'always',
      },
      mutations: {
        retry: 1,
      },
    },
  });
```

### Query Key Factory Pattern

**Always use a query key factory for type-safe, consistent keys.**

```typescript
// app/queries/keys.ts
export const queryKeys = {
  // Breaches
  breaches: {
    all: ['breaches'] as const,
    lists: () => [...queryKeys.breaches.all, 'list'] as const,
    list: (filters: BreachFilters) => [...queryKeys.breaches.lists(), filters] as const,
    details: () => [...queryKeys.breaches.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.breaches.details(), id] as const,
    random: (count: number) => [...queryKeys.breaches.all, 'random', count] as const,
  },

  // Scores
  scores: {
    all: ['scores'] as const,
    leaderboard: () => [...queryKeys.scores.all, 'leaderboard'] as const,
    user: (userId: string) => [...queryKeys.scores.all, 'user', userId] as const,
  },
} as const;
```

### Query Hooks Structure

```typescript
// app/queries/breaches.queries.ts
import { useQuery, useSuspenseQuery, useQueryClient } from '@tanstack/react-query';
import { breachesApi } from '../api';
import { queryKeys } from './keys';
import type { Breach, BreachFilters } from '../types';

// Standard query hook
export const useBreaches = (filters?: BreachFilters) =>
  useQuery({
    queryKey: queryKeys.breaches.list(filters ?? {}),
    queryFn: () => breachesApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });

// Suspense query (for use with React Suspense)
export const useBreachesSuspense = (filters?: BreachFilters) =>
  useSuspenseQuery({
    queryKey: queryKeys.breaches.list(filters ?? {}),
    queryFn: () => breachesApi.getAll(filters),
  });

// Query with select for data transformation
export const useBreachById = (id: string) =>
  useQuery({
    queryKey: queryKeys.breaches.detail(id),
    queryFn: () => breachesApi.getById(id),
    enabled: Boolean(id), // Only fetch when id exists
  });

// Random breaches for game
export const useRandomBreaches = (count: number) =>
  useQuery({
    queryKey: queryKeys.breaches.random(count),
    queryFn: () => breachesApi.getRandom(count),
    staleTime: 0, // Always fetch fresh for game
    gcTime: 0,    // Don't cache game data
  });
```

### Mutations

```typescript
// app/queries/scores.queries.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scoresApi } from '../api';
import { queryKeys } from './keys';
import type { ScoreSubmission } from '../types';

export const useSubmitScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (score: ScoreSubmission) => scoresApi.submit(score),
    onSuccess: () => {
      // Invalidate leaderboard to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.leaderboard(),
      });
    },
    onError: (error) => {
      console.error('Failed to submit score:', error);
    },
  });
};

// Optimistic update example
export const useUpdateScore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: scoresApi.update,
    onMutate: async (newScore) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.scores.user(newScore.userId),
      });

      // Snapshot previous value
      const previousScore = queryClient.getQueryData(
        queryKeys.scores.user(newScore.userId)
      );

      // Optimistically update
      queryClient.setQueryData(
        queryKeys.scores.user(newScore.userId),
        newScore
      );

      return { previousScore };
    },
    onError: (_err, newScore, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.scores.user(newScore.userId),
        context?.previousScore
      );
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: queryKeys.scores.user(variables.userId),
      });
    },
  });
};
```

### Prefetching

```typescript
// Prefetch in route loaders (TanStack Start)
export const Route = createFileRoute('/game')({
  loader: ({ context }) => {
    // Prefetch breach data before component renders
    context.queryClient.prefetchQuery({
      queryKey: queryKeys.breaches.random(10),
      queryFn: () => breachesApi.getRandom(10),
    });
  },
});

// Prefetch on hover
export const useBreachPrefetch = () => {
  const queryClient = useQueryClient();

  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.breaches.detail(id),
      queryFn: () => breachesApi.getById(id),
      staleTime: 60 * 1000,
    });
  };
};
```

### Query Best Practices

| Practice | Description |
|----------|-------------|
| Use query key factory | Consistent, type-safe keys |
| Set appropriate `staleTime` | Reduce unnecessary refetches |
| Use `enabled` option | Control when queries run |
| Implement `select` | Transform data at query level |
| Use `placeholderData` | Show cached data while fetching |
| Prefetch critical data | Improve perceived performance |
| Invalidate strategically | Only invalidate what changed |

## React Performance Optimization

### Preventing Unnecessary Re-renders

#### 1. React.memo for Pure Components

```typescript
import { memo } from 'react';
import type { FC } from 'react';

interface BreachCardProps {
  readonly breach: Breach;
  readonly onSelect: (id: string) => void;
}

// Memoize components that receive stable props
export const BreachCard: FC<BreachCardProps> = memo(({ breach, onSelect }) => (
  <div onClick={() => onSelect(breach.id)}>
    <h3>{breach.name}</h3>
    <p>{breach.affectedCount.toLocaleString()} accounts</p>
  </div>
));

BreachCard.displayName = 'BreachCard';
```

#### 2. useMemo for Expensive Calculations

```typescript
import { useMemo } from 'react';

export const useGameStats = (scores: readonly number[]) => {
  // Memoize expensive calculations
  const stats = useMemo(() => ({
    total: scores.reduce((acc, score) => acc + score, 0),
    average: scores.length > 0
      ? scores.reduce((acc, score) => acc + score, 0) / scores.length
      : 0,
    highest: Math.max(...scores, 0),
    streak: calculateStreak(scores), // Expensive calculation
  }), [scores]);

  return stats;
};

// In components - memoize filtered/sorted data
const GameBoard: FC<GameBoardProps> = ({ breaches, filter }) => {
  const filteredBreaches = useMemo(
    () => breaches.filter((b) => b.affectedCount >= filter.minCount),
    [breaches, filter.minCount]
  );

  return <BreachList breaches={filteredBreaches} />;
};
```

#### 3. useCallback for Stable Function References

```typescript
import { useCallback, useState } from 'react';

export const useGame = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Stable reference - won't cause child re-renders
  const handleCorrectGuess = useCallback(() => {
    setScore((prev) => prev + 100 * (streak + 1));
    setStreak((prev) => prev + 1);
  }, [streak]);

  const handleWrongGuess = useCallback(() => {
    setStreak(0);
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setStreak(0);
  }, []);

  return {
    score,
    streak,
    handleCorrectGuess,
    handleWrongGuess,
    resetGame,
  };
};
```

#### 4. State Colocation

```typescript
// ❌ Bad - State too high, causes unnecessary re-renders
const GamePage: FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div>
      <Header /> {/* Re-renders when hoveredCard changes! */}
      <GameBoard hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
      <Footer /> {/* Re-renders when hoveredCard changes! */}
    </div>
  );
};

// ✅ Good - State colocated where it's used
const GamePage: FC = () => (
  <div>
    <Header />
    <GameBoard /> {/* Manages its own hover state */}
    <Footer />
  </div>
);

const GameBoard: FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  // ... rest of component
};
```

#### 5. Component Splitting

```typescript
// ❌ Bad - One large component
const GamePage: FC = () => {
  const { data: breaches } = useBreaches();
  const { data: scores } = useScores();
  const [gameState, setGameState] = useState<GameState>('idle');

  return (
    <div>
      {/* All children re-render when any state changes */}
      <ScoreDisplay score={scores?.current} />
      <BreachComparison breaches={breaches} />
      <GameControls state={gameState} />
    </div>
  );
};

// ✅ Good - Split into isolated components
const GamePage: FC = () => (
  <div>
    <ScoreSection />      {/* Has its own query */}
    <GameSection />       {/* Has its own state */}
    <ControlsSection />   {/* Has its own state */}
  </div>
);

const ScoreSection: FC = () => {
  const { data: scores } = useScores(); // Isolated query
  return <ScoreDisplay score={scores?.current} />;
};
```

### Optimization Patterns Summary

| Pattern | When to Use |
|---------|-------------|
| `React.memo` | Component receives same props frequently |
| `useMemo` | Expensive calculations, filtered/sorted arrays |
| `useCallback` | Functions passed to memoized children |
| State colocation | State only used by one subtree |
| Component splitting | Different update frequencies |
| `key` prop | Lists, force remount on data change |

### Performance Anti-patterns to Avoid

```typescript
// ❌ Creating new objects/arrays in render
<Component style={{ color: 'red' }} />
<Component items={items.filter(x => x.active)} />

// ✅ Memoize or define outside
const activeItemsStyle = { color: 'red' };
const activeItems = useMemo(() => items.filter(x => x.active), [items]);

// ❌ Inline arrow functions for event handlers (when child is memoized)
<MemoizedChild onClick={() => handleClick(id)} />

// ✅ Use useCallback or pass data via data attributes
const handleChildClick = useCallback((id: string) => { ... }, []);
<MemoizedChild onClick={handleChildClick} itemId={id} />

// ❌ Deriving state that could be computed
const [filteredItems, setFilteredItems] = useState([]);
useEffect(() => {
  setFilteredItems(items.filter(x => x.active));
}, [items]);

// ✅ Compute during render with useMemo
const filteredItems = useMemo(() => items.filter(x => x.active), [items]);

// ❌ Not using key properly in lists
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ Use stable, unique keys
{items.map((item) => <Item key={item.id} {...item} />)}
```

### React DevTools Profiler

Use React DevTools Profiler to identify:
- Components that re-render too often
- Expensive renders (long render times)
- Cascading updates from state changes

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

### Static/Server-Side Rendering Strategy

This application uses **Static Site Generation (SSG)** with **Server-Side Rendering (SSR)** for optimal performance and SEO.

#### Configuration

```typescript
// app.config.ts
import { defineConfig } from '@tanstack/start/config';

export default defineConfig({
  server: {
    preset: 'static', // Generate static HTML at build time
  },
});
```

#### Route-level SSR/SSG

```typescript
// app/routes/index.tsx
export const Route = createFileRoute('/')({
  // Data loaded on server, HTML pre-rendered
  loader: async () => {
    return {
      breaches: await breachesApi.getFeatured(),
    };
  },
  // Static params for SSG
  staticData: {
    prerender: true,
  },
});
```

#### Benefits

| Benefit | Description |
|---------|-------------|
| **SEO** | Pre-rendered HTML for search engines |
| **Performance** | Fast initial page load (no JS required for content) |
| **Caching** | Static assets cached at CDN edge |
| **Reliability** | Works without JavaScript enabled |

#### Best Practices

- Pre-render all public pages at build time
- Use SSR for dynamic/personalized content
- Implement proper loading states for client-side hydration
- Leverage route loaders for data fetching before render

### CSS Styling Guidelines

This project uses **vanilla CSS with CSS Modules** for component styling.

#### File Structure

```
app/
├── components/
│   ├── GameBoard/
│   │   ├── GameBoard.tsx
│   │   ├── GameBoard.module.css    # Component styles
│   │   └── index.ts
│   └── ui/
│       ├── Button/
│       │   ├── Button.tsx
│       │   └── Button.module.css
│       └── Card/
│           ├── Card.tsx
│           └── Card.module.css
├── styles/
│   ├── globals.css                 # Global styles, CSS reset
│   ├── variables.css               # CSS custom properties
│   └── utils.css                   # Utility classes
```

#### CSS Modules Usage

```typescript
// GameBoard.tsx
import styles from './GameBoard.module.css';

export const GameBoard: FC<GameBoardProps> = ({ breaches }) => (
  <div className={styles.container}>
    <h2 className={styles.title}>Choose wisely</h2>
    <div className={styles.cardsWrapper}>
      {breaches.map((breach) => (
        <BreachCard key={breach.id} breach={breach} />
      ))}
    </div>
  </div>
);
```

```css
/* GameBoard.module.css */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-lg);
}

.title {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.cardsWrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}
```

#### CSS Custom Properties (variables.css)

```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-background: #0f0f0f;
  --color-surface: #1a1a1a;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a1a1aa;
  --color-success: #22c55e;
  --color-error: #ef4444;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}
```

#### CSS Best Practices

| Practice | Description |
|----------|-------------|
| Use CSS Modules | Scoped styles, no class name collisions |
| CSS Custom Properties | Consistent theming, easy dark mode |
| Mobile-first | Start with mobile styles, add breakpoints |
| BEM-like naming | Clear, descriptive class names in modules |
| Avoid `!important` | Specificity should be managed properly |
| Logical properties | Use `margin-inline`, `padding-block` for RTL support |

#### Responsive Design

```css
/* Mobile-first approach */
.card {
  width: 100%;
  padding: var(--spacing-md);
}

/* Tablet and up */
@media (min-width: 768px) {
  .card {
    width: 50%;
    padding: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    width: 33.333%;
  }
}
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

### Component Architecture

#### Component Structure

```typescript
// ComponentName.tsx
import { memo } from 'react';
import type { FC } from 'react';

interface ComponentNameProps {
  readonly title: string;
  readonly onAction: (id: string) => void;
}

export const ComponentName: FC<ComponentNameProps> = memo(({ title, onAction }) => (
  <div>
    <h1>{title}</h1>
    <button onClick={() => onAction('123')}>Action</button>
  </div>
));

ComponentName.displayName = 'ComponentName';
```

#### Component Guidelines

- **One component per file** - named exports preferred
- **Props interface** - always define with `readonly` properties
- **Functional components only** - use hooks for state/effects
- **Use `memo`** for components that receive stable props
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
| Files (queries) | camelCase.queries | `breaches.queries.ts` |
| Components | PascalCase | `GameBoard` |
| Functions | camelCase | `calculateScore` |
| Constants | SCREAMING_SNAKE | `MAX_SCORE` |
| Types/Interfaces | PascalCase | `GameState` |
| Query keys | camelCase nested | `queryKeys.breaches.all` |

#### Imports Order

```typescript
// 1. React/Framework
import { useState, useMemo, useCallback, memo } from 'react';

// 2. Third-party libraries
import { useQuery, useMutation } from '@tanstack/react-query';

// 3. Internal - Queries
import { useBreaches, useSubmitScore } from '../queries';

// 4. Internal - API/Services
import { breachesApi } from '../api';

// 5. Internal - Components
import { Button } from '../components/ui';

// 6. Internal - Hooks
import { useGame } from '../hooks';

// 7. Internal - Utils/Constants
import { formatNumber } from '../utils';

// 8. Internal - Types (use 'import type')
import type { Breach } from '../types';

// 9. Styles
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

// Error boundary for queries
const GamePage: FC = () => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} fallback={<ErrorFallback />}>
        <Suspense fallback={<Loading />}>
          <GameContent />
        </Suspense>
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);
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
refactor(queries): implement query key factory pattern
perf(components): memoize BreachCard to prevent re-renders
```

### Branch Naming

- Feature branches: `feature/description`
- Bug fixes: `fix/description`
- Performance: `perf/description`
- Claude branches: `claude/description-sessionid`

## Testing Guidelines

### Test Structure

```typescript
// breaches.queries.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useBreaches } from './breaches.queries';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useBreaches', () => {
  it('should fetch breaches successfully', async () => {
    const { result } = renderHook(() => useBreaches(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });
});
```

### Testing Priorities

1. **Unit tests** for pure functions (services, utils)
2. **Hook tests** for TanStack Query hooks
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
4. **Use TanStack Query** for all server state
5. **Implement query key factory** for consistent keys
6. **Optimize renders** with memo, useMemo, useCallback
7. **Define types** in dedicated `.types.ts` files
8. **Keep components pure** - extract logic into hooks/services
9. **Write tests** for all business logic and queries

### Anti-patterns to Avoid

- ❌ Using `any` type
- ❌ Mutating state directly
- ❌ Mixing API calls with component logic
- ❌ Using `let` or `var`
- ❌ Class components
- ❌ Imperative loops when functional alternatives exist
- ❌ Inline API URLs in components
- ❌ Fetching data in useEffect instead of TanStack Query
- ❌ Creating new objects/functions in render without memoization
- ❌ Not using query key factory
- ❌ Over-memoizing simple components

---

*Last updated: 2026-01-28*
*Framework: TanStack Start*
*Rendering: Static (SSG) / Server-Side (SSR)*
*Data Fetching: TanStack Query*
*Styling: CSS Modules*
*Language: TypeScript (Strict)*
*Paradigm: Functional Programming*
