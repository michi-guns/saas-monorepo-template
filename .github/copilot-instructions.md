## Coding Principles

Follow established software engineering principles to produce clean, readable, maintainable, and scalable code.

### Principles

- DRY (Don't Repeat Yourself): Avoid duplicating logic, behavior, or knowledge. Extract reusable code where it improves clarity and maintenance.
- KISS (Keep It Simple, Stupid): Prefer simple solutions over complex ones. Do not introduce unnecessary abstractions.
- YAGNI (You Aren't Gonna Need It): Do not build for hypothetical future requirements. Implement only what is needed now.
- SOLID:
  - Single Responsibility Principle: Each module, class, or function should have one clear purpose.
  - Open/Closed Principle: Code should be open for extension but closed for modification.
  - Liskov Substitution Principle: Derived types should be replaceable without breaking expected behavior.
  - Interface Segregation Principle: Prefer small, focused interfaces over large, general-purpose ones.
  - Dependency Inversion Principle: Depend on abstractions, not concretions.

### Additional Guidance

- Prefer composition over inheritance.
- Favor readability over cleverness.
- Keep functions small and focused.
- Use clear, descriptive naming.
- Reduce coupling and improve cohesion.
- Separate concerns between UI, business logic, data access, and infrastructure.
- Handle errors explicitly.
- Write code that is easy to test and refactor.
- Avoid premature optimization.
- Refactor when duplication or complexity becomes noticeable.

### Output Expectations

When generating code:
- Apply these principles pragmatically, not dogmatically.
- Prioritize maintainability and readability.
- Match the conventions of the existing codebase.
- Briefly mention tradeoffs when relevant.