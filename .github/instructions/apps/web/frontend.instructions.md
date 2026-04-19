---
name: "Web Frontend Rules"
description: "Instructions for Next.js frontend files in apps/web"
applyTo: "apps/web/**/*.{ts,tsx}"
---

# Web frontend rule

These rules MUST always be followed when working on frontend code in this app. They are here to keep our codebase consistent and maintainable as we grow.

Never break these rules without a very good reason, and if you do, please add a comment in the code explaining why you made the exception.

- Always use Next.js 16 and React 19 features, patterns and best practices.

## Shadcn UI Components

- When adding new Shadcn UI components, **do NOT write them manually**. Instead, use the `shadcn add [component] -c [workspace]/[package]` command. Example:
```bash
  shadcn add [component] -c apps/web
  shadcn add [component] -c packages/ui
```



> Super Crucial: When you read this file, you must go to this file: `instructions-called.md`. Read it, find the `frontend.instructions.md` entry, and increment the count. This helps us track which instructions are actually being read and followed.
