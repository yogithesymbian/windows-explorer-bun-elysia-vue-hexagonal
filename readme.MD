# 🗂️ Windows Explorer Backend + Frontend

Backend API untuk aplikasi Windows Explorer-like berbasis web. Dibangun dengan arsitektur hexagonal (clean architecture), menggunakan Bun + Elysia + PostgreSQL + Redis, dan dioptimalkan untuk scalability.

## 🚀 Tech Stack
- **Runtime**: Bun
- **Framework**: Elysia
- **Architecture**: Hexagonal / Clean Architecture
- **Database**: PostgreSQL + ltree + FTS (GIN index)
- **ORM**: Drizzle ORM
- **Caching**: Redis
- **Connection Pooling**: PgBouncer
- **Testing**: k6, wrk, Spectral, EXPLAIN ANALYZE
- **API Spec**: OpenAPI (Scalar) + Spectral linting
- **Monorepo**: explorer-api & explorer-infrastructure

## 📁 Features

- Hierarchical folder structure with unlimited depth (ltree)
- Full-text search for files (FTS with GIN index)
- REST API with versioning and audit rules
- Redis caching for subtree and search results
- Connection pooling with PgBouncer for high concurrency
- Load testing with k6 and wrk
- Query profiling with EXPLAIN ANALYZE

## 📦 Folder Structure

```
📦backend
 ┗ 📂explorer
 ┃ ┣ 📂api
 ┃ ┃ ┣ 📂docs
 ┃ ┃ ┣ 📂scripts
 ┃ ┃ ┣ 📂src
 ┃ ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┣ 📂di
 ┃ ┃ ┃ ┣ 📂plugins
 ┃ ┃ ┃ ┣ 📂routes
 ┃ ┃ ┣ 📂tests
 ┃ ┃ ┃ ┣ 📂load
 ┃ ┃ ┃ ┃ ┣ 📜k6-tree.js
 ┃ ┃ ┃ ┃ ┗ 📜wrk-tree.sh
 ┃ ┃ ┃ ┣ 📂query
 ┃ ┃ ┃ ┗ 📜e2e.app.test.ts
 ┃ ┃ ┣ 📜.spectral.yaml
 ┃ ┃ ┗ 📜package.json
 ┃ ┣ 📂application
 ┃ ┃ ┗ 📂src
 ┃ ┃ ┃ ┣ 📂dto
 ┃ ┃ ┃ ┣ 📂errors
 ┃ ┃ ┃ ┣ 📂ports
 ┃ ┃ ┃ ┗ 📂usecases
 ┃ ┣ 📂infrastructure
 ┃ ┃ ┣ 📂db
 ┃ ┃ ┣ 📂drizzle
 ┃ ┃ ┣ 📂src
 ┃ ┃ ┃ ┣ 📂adapter
 ┃ ┃ ┃ ┃ ┣ 📜fts.ts
 ┃ ┃ ┃ ┃ ┗ 📜redis.cache.ts
 ┃ ┃ ┃ ┣ 📂mappers
 ┃ ┃ ┃ ┗ 📂repositories
 ┃ ┃ ┣ 📂tests
 ┃ ┣ 📂reports
 ┃ ┃ ┗ 📜junit.xml
📦frontend
 ┗ 📂explorer
 ┃ ┣ 📂src
 ┃ ┃ ┣ 📂application
 ┃ ┃ ┃ ┣ 📂ports
 ┃ ┃ ┃ ┣ 📂stores
 ┃ ┃ ┃ ┗ 📂usecases
 ┃ ┃ ┣ 📂domain
 ┃ ┃ ┣ 📂infrastructure
 ┃ ┃ ┃ ┣ 📂api
 ┃ ┃ ┃ ┗ 📂core
 ┃ ┃ ┃ ┃ ┗ 📜api-client.ts
 ┃ ┃ ┣ 📂presentation
 ┃ ┃ ┃ ┣ 📂components
 ┃ ┃ ┃ ┗ 📂pages
 ┃ ┃ ┗ 📂shared
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜README.md
 ┃ ┣ 📜bun.lock
 ┃ ┣ 📜index.ts
 ┃ ┣ 📜package.json
 ┃ ┗ 📜tsconfig.json
 ┃ ┣ 📜.env
 ┃ ┣ 📜.gitignore
 ┃ ┣ 📜README.md
 ┃ ┣ 📜bunfig.toml
 ┃ ┗ 📜tsconfig.json
```

## 📄 API Spec

OpenAPI spec tersedia di `api/docs/openapi.json`, dilint dengan Spectral untuk memastikan standar REST (versioning, naming, method, etc).

## 🧪 Load Testing

- `tests/load/k6-subtree.js`
- `tests/load/k6-search.js`
- `tests/load/wrk-subtree.sh`

## 📊 Query Profiling

- `tests/query/explain-subtree.sql`

## 📌 Setup


##  🧠 Author
Yogi Arif Widodo