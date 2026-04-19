# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Contributing

### Units of work

- Prefer to create small, focused issues that can be completed in a reasonable amount of time (e.g. 2 hours to 16 days or 2 Days).
- If a issue is larger than 8h, it must be broken down into sub-issues.
- For very big Features, create an Epic issue that describes the overall feature and its value proposition, and link the smaller issues to it.
  - A good rule:
    - Level 1: feature or epic, for example Auth system
    - Level 2: deliverables, for example Session management
    - Level 3: implementation tasks only when needed
