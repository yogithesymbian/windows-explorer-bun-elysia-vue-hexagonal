# Elysia with Bun runtime

## Getting Started
To get started with this template, simply paste this command into your terminal:
```bash
bun create elysia ./elysia-example
```

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.


```
bun create elysia api
bun add drizzle-orm
bun add -D drizzle-kit
bun add dotenv

```

# Generate migration first
```
bunx drizzle-kit generate
```

```
bun run src/db/migrate.ts
```