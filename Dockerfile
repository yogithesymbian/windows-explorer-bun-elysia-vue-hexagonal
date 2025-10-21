# Render doesnt support BUN, let me try with Docker on Render.com
FROM oven/bun:latest

# --- Variabel ---
ARG APP_DIR=backend/explorer/api
ARG APP_DIR_INFRA=backend/explorer/infrastructure
ARG APP_DIR_FE=frontend/explorer/

# --- TAHAP 1: SETUP DEPENDENSI ---

# 1. Buat direktori kerja UTAMA
WORKDIR /app

# 2. Copy SEMUA file package.json & lockfile
#    Ini PENTING agar Bun bisa memvalidasi struktur monorepo.
# COPY package.json bun.lockb ./
COPY package.json ./
COPY ${APP_DIR}/package.json ./${APP_DIR}/
COPY ${APP_DIR_INFRA}/package.json ./${APP_DIR_INFRA}/
COPY ${APP_DIR_FE}/package.json ./${APP_DIR_FE}/

# 3. Jalankan 'bun install' DARI ROOT ('/app')
#    Kita pakai '--filter' agar HANYA meng-install dependensi API
RUN bun install --production --filter=explorer-api
RUN bun install --production --filter=explorer-infrastructure


# --- TAHAP 2: COPY KODE & RUN ---

# 4. Setelah dependensi ter-install, baru copy sisa source code
#    Ini memanfaatkan Docker cache. 
#    Jika kode berubah tapi dependensi tidak, build akan jauh lebih cepat.
COPY . .

# 5. Pindah ke folder API
#    Kita lakukan ini di akhir, HANYA untuk perintah CMD
WORKDIR /app/${APP_DIR}

# 6. Expose port dan jalankan server
EXPOSE 8080
CMD ["bun", "run", "src/index.ts"]