## Tasks

### T-1: Populate files under `packages\todo-contracts`

- Author: D. Stamatakis
- Date: 19 April 2026

- [ ] `packages\todo-contracts\src\http\todos\complete`
- [ ] `packages\todo-contracts\src\http\todos\create`
- [ ] `packages\todo-contracts\src\http\todos\list`

- [ ] `packages\todo-contracts\src\index.ts` (Blocked by `RS-1`)
- [ ] `packages\todo-contracts\package.json` (Blocked by `RS-1`)

### T-2: Populate files under `packages\todo-core`

- Author: D. Stamatakis
- Date: 19 April 2026

- [ ] `packages\todo-core\src\application`
  - [ ] `packages\todo-core\src\application\todos\complete`
  - [ ] `packages\todo-core\src\application\todos\create`
  - [ ] `packages\todo-core\src\application\todos\list`

- [ ] `packages\todo-core\src\domain`
  - [ ] `packages\todo-core\src\domain\todo`

- [ ] `packages\todo-core\src\ports\`
  - [ ] `packages\todo-core\src\ports\in`
    - [ ] `packages\todo-core\src\ports\in\todos`
  - [ ] `packages\todo-core\src\ports\out`
    - [ ] `packages\todo-core\src\ports\out\todos`

- [ ] `packages\todo-core\src\index.ts` (Blocked by `RS-1`)
- [ ] `packages\todo-core\package.json` (Blocked by `RS-1`)

### T-3: Populate files under `packages\todo-persistence-drizzle`

- Author: D. Stamatakis
- Date: 19 April 2026

- [ ] `packages\todo-persistence-drizzle\src\client`
- [ ] `packages\todo-persistence-drizzle\src\shared`
- [ ] `packages\todo-persistence-drizzle\src\todos`
  - [ ] `packages\todo-persistence-drizzle\src\todos\dto`
  - [ ] `packages\todo-persistence-drizzle\src\todos\repositories`
  - [ ] `packages\todo-persistence-drizzle\src\todos\mappers`
  - [ ] `packages\todo-persistence-drizzle\src\todos\schema`

  - [ ] `packages\todo-persistence-drizzle\src\index.ts` (Blocked by `RS-1`)
  - [ ] `packages\todo-persistence-drizzle\package.json` (Blocked by `RS-1`)

## Research

### RS-1: Monorepo package.json file

- Author: D. Stamatakis
- Date: 19 April 2026

- [ ] When using a monorepo, what is the purpose of a package's `package.json` file? What should I export from it and how should I do it to allow tree shaking and code splitting?
      **Answer**: Not answered yet...

### RS-2: Does current architecture allow for easy Tech swapping?

- Author: D. Stamatakis
- Date: 19 April 2026

- [ ] What would I need to change if I wanted to change ORM? (e.g. from Drizzle to Prisma or Sequelize)
      **Answer**: Not answered yet...

- [ ] What would I need to change if I wanted to change the frontend framework? (e.g. from Next.js to SvelteKit)
      **Answer**: Not answered yet...

- [ ] What would I need to change if I wanted to change the backend framework? (e.g. from Elysia to Fastify or Express)
      **Answer**: Not answered yet...

- [ ] What would I need to change if I wanted to change the Database? (e.g. from Supabase/Postgres to MongoDB or MySQL)
      **Answer**: Not answered yet...

- [ ] What would I need to change if I wanted to change the Auth system? (e.g. from Supabase to BetterAuth)
      **Answer**: Not answered yet...
