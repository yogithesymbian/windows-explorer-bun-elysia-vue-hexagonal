// scripts/generate-env.ts
import { writeFileSync } from "fs";

console.log("Infokes: Generated backend & frontend .env files");

const backendEnv = `
NODE_ENV=development
PORT=8080
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/explorer
DATABASE_URL=postgres://yogi:password@localhost:5432/explorer_db
REDIS_URL=redis://localhost:6379
CACHE_SUBTREE_TTL_SECONDS=300
ROOT_PATH=root
TREE_MAX_DEPTH_DEFAULT=2
CORS_ORIGIN=http://localhost:5173
`;
writeFileSync("backend/explorer/.env", backendEnv.trim());
console.log("│ ✅ backend/explorer/.env generated");



const frontendEnv = `
VITE_API_URL=http://localhost:8080/api
VITE_API_VERSION=/v1
VITE_PORT=5173
VITE_APP_NAME=Explorer (Dev)
VITE_ENV=development
`;
writeFileSync("frontend/explorer/.env", frontendEnv.trim());
console.log("│ ✅ frontend/explorer/.env generated");

console.log("│ 🦊 dont forget to adjustment value by your secret environtment");
console.log("└─ completed.....");
