# Render doesnt support BUN, let me try with Docker on Render.com | Gunakan image resmi Bun. Versi 'latest' atau '1.0' bisa digunakan.
FROM oven/bun:latest

ARG APP_DIR=backend/explorer/api

# Set working directory di dalam container
WORKDIR /app

# --- Manajemen Dependensi ---
# Copy file dependensi dari root dan dari folder backend
# Ini penting untuk memanfaatkan cache Docker
# COPY package.json bun.lockb ./
COPY ${APP_DIR}/package.json ./${APP_DIR}/

# Install *hanya* dependensi produksi untuk menjaga image tetap kecil
RUN bun install --production

# --- Copy Source Code ---
# Copy sisa source code dari root monorepo
COPY . .

# --- Konfigurasi Akhir ---
# Set working directory ke folder backend spesifik Anda
WORKDIR /app/${APP_DIR}

# (Opsional) Jika Anda punya 'build' script di package.json
# Hapus tanda # di bawah jika Anda perlu build TypeScript ke JavaScript
# RUN bun run build

# Expose port yang digunakan server Anda
EXPOSE 8080

# Perintah default untuk menjalankan server Anda
# GANTI 'src/index.ts' JIKA ENTRY FILE ANDA BERBEDA
CMD ["bun", "run", "src/index.ts"]
