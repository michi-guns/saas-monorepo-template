## POST /todos

For Todo creation, the controller should receive the HTTP request, map the incoming body into a request contract or use-case input, and call the input port for `CreateTodo`, while keeping Express-specific objects out of the core. [dev](https://dev.to/xoubaman/understanding-hexagonal-architecture-3gk)
After the use case applies business rules and saves through the repository output port, the response can be formatted by a presenter and sent back as JSON by the HTTP adapter. [lukemorton](https://lukemorton.tech/articles/nuances-in-clean-architecture)

```txt
Client Requests...
<---- Express HTTP Adapter ---->
  -> POST /todos
  -> apps/todo-api-express/src/http/todos/create/create-todo.route.ts
  -> apps/todo-api-express/src/http/todos/create/create-todo.controller.ts
  -> apps/todo-api-express/src/http/todos/create/create-todo.request-mapper.ts

<---- Contracts & Core ---->
  -> packages/todo-contracts/src/http/todos/create/create-todo.request.ts
  -> packages/todo-core/src/ports/in/todos/create-todo.use-case.ts
  -> packages/todo-core/src/application/todos/create/create-todo.service.ts
  -> packages/todo-core/src/domain/todos/todo.entity.ts
  -> packages/todo-core/src/ports/out/todos/todo-repository.ts

<---- Drizzle Repository Adapter ---->
  -> packages/infrastructure/todo-persistence-drizzle/src/todos/repositories/drizzle-todo.repository.ts
  -> packages/infrastructure/todo-persistence-drizzle/src/todos/mappers/todo-record.mapper.ts
  -> packages/infrastructure/todo-persistence-drizzle/src/todos/schema/todos.table.ts

<---- Database ---->
  -> database (Supabase/Postgres)

<---- Back to Drizzle Adapter ---->
  -> back to drizzle-todo.repository.ts

<---- Back to Core (Application) ---->
  -> back to create-todo.service.ts

<---- Presenter & HTTP Adapter (Express.js) ---->
  -> apps/todo-api-express/src/http/todos/create/create-todo.presenter.ts
  -> packages/todo-contracts/src/http/todos/create/create-todo.response.ts

Client Receives: HTTP 201 JSON response
```

A typical step-by-step view looks like this:

1. The route matches `POST /todos` and forwards control to `CreateTodoController`.
2. The controller extracts `req.body`, passes it through `create-todo.request-mapper.ts`, and builds the application input.
3. The controller calls the input port `CreateTodoUseCase`. [herbertograca](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)
4. `CreateTodoService` validates business rules, creates the `Todo` entity, and asks `TodoRepository` to persist it through the output port. [chakray](https://chakray.com/hexagonal-architecture-a-complete-guide-to-robust-and-testable-software-design/)
5. The Drizzle repository maps the domain entity to a DB record, writes it to Supabase/Postgres, and returns the persisted result. [chakray](https://chakray.com/hexagonal-architecture-a-complete-guide-to-robust-and-testable-software-design/)
6. The use case produces an output model, the presenter turns it into `create-todo.response.ts`, and the controller sends `201 Created`. [stackoverflow](https://stackoverflow.com/questions/45921928/use-case-containing-the-presenter-or-returning-data)

## GET /todos

For a read endpoint, the same overall pattern applies: the HTTP adapter receives the request, maps query information if needed, and invokes the `ListTodos` input port. Input adapters are responsible for translating transport details into the form the application expects, while output adapters fetch external data and translate it back. [dev](https://dev.to/xoubaman/understanding-hexagonal-architecture-3gk)

```txt
Client Requests: GET /todos
  -> apps/todo-api-express/src/http/todos/list/list-todos.route.ts
  -> apps/todo-api-express/src/http/todos/list/list-todos.controller.ts
  -> apps/todo-api-express/src/http/todos/list/list-todos.request-mapper.ts
  -> packages/todo-contracts/src/http/todos/list/list-todos.request.ts
  -> packages/todo-core/src/ports/in/todos/list-todos.use-case.ts
  -> packages/todo-core/src/application/todos/list/list-todos.service.ts
  -> packages/todo-core/src/ports/out/todos/todo-repository.ts
  -> packages/infrastructure/todo-persistence-drizzle/src/todos/repositories/drizzle-todo.repository.ts
  -> packages/infrastructure/todo-persistence-drizzle/src/todos/mappers/todo-record.mapper.ts
  -> database (Supabase/Postgres)
  -> back to drizzle-todo.repository.ts
  -> back to list-todos.service.ts
  -> apps/todo-api-express/src/http/todos/list/list-todos.presenter.ts
  -> packages/todo-contracts/src/http/todos/list/list-todos.response.ts
  -> HTTP 200 JSON response
```

A practical step-by-step view is:

1. The route matches `GET /todos` and calls `ListTodosController`.
2. The controller reads query params if any, maps them into a request object, and calls `ListTodosUseCase`. [zenn](https://zenn.dev/harutin/articles/2afd9bd84152a8)
3. `ListTodosService` asks `TodoRepository` for the Todo collection through the output port instead of talking to Drizzle directly. [dev](https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi)
4. The Drizzle adapter queries the database, maps records into domain or output-friendly shapes, and returns them to the use case. [chakray](https://chakray.com/hexagonal-architecture-a-complete-guide-to-robust-and-testable-software-design/)
5. The presenter formats the result into `list-todos.response.ts`, and the controller sends `200 OK`. [lukemorton](https://lukemorton.tech/articles/nuances-in-clean-architecture)

## Dependency rule

The important dependency direction is that controllers and presenters sit in the driving adapter, use cases sit in the application core, and repositories live in driven adapters, with dependencies pointing inward toward the core rather than outward to Express or Drizzle. [reddit](https://www.reddit.com/r/softwarearchitecture/comments/1brqh4t/a_very_simple_question_about_hexagonalclear/)
That is why you can replace Express with another web framework or replace Drizzle with another persistence adapter without rewriting the core use cases, as long as the adapters still honor the same ports and contracts. [dev](https://dev.to/dyarleniber/hexagonal-architecture-and-clean-architecture-with-examples-48oi)

If you want to keep this extra clear in your repo, the shortest mental model is:

- Controller = reads HTTP request.
- Request mapper = converts HTTP shape to use-case input.
- Use case = runs business logic.
- Repository adapter = talks to DB.
- Presenter = converts use-case output to HTTP response. [herbertograca](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/)

I can next turn this into a Mermaid sequence diagram using your exact folder names.
