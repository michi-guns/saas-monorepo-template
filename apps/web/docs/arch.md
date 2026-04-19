Title: Architecture for Large Next.js Applications
Original Author: [Abisoye Alli-Balogun](https://www.freecodecamp.org/news/author/AbisoyeAlli/)
Created Date: 2024-06-01
Document Maintainer: D. Stamtakis
References:

- [Architecture for Large Next.js Applications](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/)

---

# Layer 1: The App Router and Colocation

## Colocation

Consider a /dashboard route. In the App Router model, its folder might look like this:

```plaintext
app/
  dashboard/
    page.tsx              # The route entry point
    layout.tsx            # Dashboard-specific shell/navigation
    loading.tsx           # Streaming loading state
    error.tsx             # Error boundary
    components/
      StatsCard.tsx       # Used only within dashboard
      ActivityFeed.tsx
    lib/
      queries.ts          # Data fetching for this route only
      formatters.ts       # Dashboard-specific transforms
```

The key insight: StatsCard.tsx and queries.ts don't belong to your whole application, they belong to /dashboard. When you delete or refactor the dashboard, you delete or refactor one folder. Nothing else breaks.

This is colocation. It's not a new idea, but the App Router makes it idiomatic in Next.js for the first time.

## The Rule of Proximity

A good heuristic: a file should live as close as possible to where it's used. If it's used in one route, it lives in that route's folder. If it's used by two routes under the same parent segment, it moves up one level. If it's used across the entire app, it belongs in a shared layer (more on that shortly).

```plaintext
app/
  (marketing)/          # Route group , no URL segment
    layout.tsx          # Shared layout for marketing pages
    page.tsx
    about/
      page.tsx
  (dashboard)/
    layout.tsx          # Different shell for app routes
    dashboard/
      page.tsx
    settings/
      page.tsx
```

Route groups (folders wrapped in parentheses) let you share layouts across segments without polluting the URL. This is a clean way to separate concerns, marketing pages and app pages can have entirely different shells without any URL trickery.

# Layer 2: Feature-Based Folder Structure

Colocation handles the route level. But large applications have cross-cutting concerns – things that don't belong to any single route but aren't generic utilities either.

This is where most projects fall apart: the /components folder becomes a dumping ground, /lib becomes a junk drawer, and nobody agrees on where useAuth should live.

Feature-based folder structure brings order to this chaos.

Organising by Domain, Not by File Type
Instead of grouping files by what they are (components, hooks, utils), group them by what they do.

```plaintext
src/
  features/
    auth/
      components/
        LoginForm.tsx
        AuthGuard.tsx
      hooks/
        useAuth.ts
        useSession.ts
      lib/
        tokenStorage.ts
        validators.ts
      types.ts
      index.ts            # Public API , only export what others need

    billing/
      components/
        PricingTable.tsx
        SubscriptionBadge.tsx
      hooks/
        useSubscription.ts
      lib/
        stripe.ts
      types.ts
      index.ts

    notifications/
      ...
```

Each feature folder is a self-contained unit. It has its own components, hooks, utilities, and types. **Crucially, it has a barrel file** (index.ts) that defines its public API, the things other parts of the app are allowed to import.

## Enforcing Boundaries with Barrel Exports

```typescript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { AuthGuard } from './components/AuthGuard';
export { useAuth } from './hooks/useAuth';
export type { AuthUser, AuthState } from './types';

// NOT exported, internal implementation detail:
// tokenStorage.ts, validators.ts
```

Now, the rest of your app imports from @/features/auth, never from @/features/auth/lib/tokenStorage. If you refactor how tokens are stored internally, nothing outside the feature breaks. This is the essence of encapsulation, not just as a theoretical principle, but as a structural one enforced by your folder layout.

## Shared vs. Feature

Not everything belongs in a feature. Truly generic utilities: a cn() classname helper, a date formatter, or a base HTTP client, for example, belong in a shared layer:

```plaintext
src/
  shared/
    components/
      Button.tsx
      Modal.tsx
      Spinner.tsx
    hooks/
      useDebounce.ts
      useMediaQuery.ts
    lib/
      http.ts
      dates.ts
    ui/              # shadcn/ui or design system components
```

The rule: shared/ has zero knowledge of any feature. Features can import from shared/. shared/ never imports from a feature.

# Layer 3: Monorepo with Turborepo (Sharing Logic Across Apps)

Single-repo architecture gets you far, but most teams eventually end up with multiple apps: a customer-facing Next.js app, an admin panel, a separate marketing site, maybe a set of API services.

The question becomes: how do you share code between them without copy-pasting?

The answer is a monorepo with shared packages, and Turborepo is currently the best tool for Next.js teams doing this.

## The Monorepo Shape

A well-structured Turborepo looks like this:

```plaintext
my-platform/
  apps/
    web/              # Customer-facing Next.js app
    admin/            # Internal admin panel (also Next.js)
    marketing/        # Marketing site
  packages/
    ui/               # Shared component library
    config/           # Shared ESLint, TypeScript, Tailwind configs
    auth/             # Shared auth utilities and types
    database/         # Prisma client + query helpers
    utils/            # Generic utilities
  turbo.json
  package.json        # Root workspace config
```

`apps/` contains deployable applications. `packages/` contains shared code that apps depend on. Neither app imports directly from the other, all sharing flows through `packages/`.

## Setting Up a Shared Package

A package is just a folder with a package.json that other workspace members can depend on.

```json
// packages/ui/package.json
{
  "name": "@my-platform/ui",
  "version": "0.0.1",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

```ts
// packages/ui/src/index.ts
export { Button } from './Button';
export { Modal } from './Modal';
export { Card } from './Card';
```

Now your apps consume it like any npm package:

```json
// apps/web/package.json
{
  "dependencies": {
    "@my-platform/ui": "*"
  }
}
```

```tsx
// apps/web/app/dashboard/page.tsx
import { Card, Button } from '@my-platform/ui';
```

Change Card once in `packages/ui`, and every app that uses it gets the update, no copy-pasting, no drift.

**IMPORTANT**: Because the package points directly at TypeScript source files (not compiled output), each consuming Next.js app must tell the bundler to transpile it. Add this to your Next.js config:

```ts
// apps/web/next.config.ts
const config: import('next').NextConfig = {
  transpilePackages: ['@my-platform/ui', '@my-platform/auth', '@my-platform/utils'],
};

export default config;
```

Without this, the build fails with syntax errors, Next.js doesn't transpile packages from node_modules or workspace dependencies by default. The alternative is compiling each package to dist/ and pointing exports there, but that adds a build step to every package and slows down the dev feedback loop. For internal monorepo packages, transpilePackages is the simpler tradeoff.

## The `turbo.json` Pipeline

Turborepo's real power is its build pipeline. It understands the dependency graph between your packages and apps, caches build outputs, and runs tasks in parallel where possible.

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

The `^build` syntax means: before building this package, build all its dependencies first. So if `apps/web` depends on `packages/ui`, Turborepo ensures `packages/ui` is built before `apps/web` starts. Remote caching means if `packages/ui` hasn't changed, Turborepo skips rebuilding it entirely, even across CI runs and team members' machines.

## What Goes in a Package vs. an App

A useful litmus test:

| Lives in `packages/`          | Lives in `apps/`            |
| ----------------------------- | --------------------------- |
| Design system / UI primitives | Route definitions           |
| Auth utilities and types      | App-specific layouts        |
| Database client and queries   | Feature-specific pages      |
| Shared TypeScript configs     | API route handlers          |
| Analytics abstractions        | Environment-specific config |
| Generic hooks (useDebounce)   | App-specific business logic |

If two apps need the same logic, it goes in a package. If only one app needs it, it stays in that app, even if you think the other app might need it someday. Premature abstraction is just as damaging as none at all.

# Layer 4: Server Components and Data-Fetching Boundaries

[To be continued...]
