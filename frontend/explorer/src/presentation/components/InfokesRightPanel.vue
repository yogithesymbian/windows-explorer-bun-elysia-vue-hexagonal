<!-- src/presentation/components/RightPanel.vue -->
<script setup lang="ts">
import { inject } from "vue";
import { ref } from 'vue';
import FilePreviewModal from './InfokesFilePreviewModal.vue';

const showPreviewModal = ref(false);
const selectedFile = ref<any>(null);

function handleFileClick(file: any) {
  selectedFile.value = file;
  showPreviewModal.value = true;
}

function handleCloseModal() {
  showPreviewModal.value = false;
  selectedFile.value = null;
}

function handleDownload(file: any) {
  // Tambahkan logika download sesuai kebutuhan
  console.log('Download file:', file);
}


import InfokesBreadCrumbs from "./InfokesBreadCrumbs.vue";

const vm = inject<any>('folderVM');
if (!vm) throw new Error('folderVM not provided');

function handleFolderClick(child: any) {
  // Tambahkan logic untuk handle click folder jika perlu
  console.log('Folder clicked:', child);
  vm.onBreadcrumbClick(child.id);
  selectedFile.value = child;
  showPreviewModal.value = true;
}
</script>

<template>
  <div class="right-panel">
    <div v-if="!vm.selectedId.value" class="placeholder">
      <div class="empty-state">
        <svg class="empty-icon" width="64" height="64" viewBox="0 0 24 24" fill="none">
          <path d="M3 8L9.00319 2.76351C9.57983 2.28067 10.3597 2 11.1719 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <p class="empty-text">Pilih folder di panel kiri</p>
        <p class="empty-subtext">untuk melihat isi subfolder</p>
      </div>
    </div>
    
    <div v-else class="content">

    <FilePreviewModal
      :show="showPreviewModal"
      :file="selectedFile"
      @close="handleCloseModal"
      @download="handleDownload"
    />

      <InfokesBreadCrumbs />
      
      <div class="folders-grid">
        <button
          v-for="child in vm.rightPanelChildren.value"
          :key="child?.id"
          class="folder-tile"
          @click="handleFolderClick(child)"
          :title="child?.name"
        >
          <div class="folder-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 8L9.00319 2.76351C9.57983 2.28067 10.3597 2 11.1719 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="folder-name">{{ child?.name }}</div>
        </button>
      </div>

      <!-- Files Section -->
      <div v-if="vm.rightPanelFiles?.value?.length" class="section">
        <h3 class="section-title">Files</h3>
        <div class="files-grid">
          <button
            v-for="file in vm.rightPanelFiles.value"
            :key="file.id"
            class="file-tile"
            @click="handleFileClick(file)"
            :title="`${file.name}${file.ext ? '.' + file.ext : ''}`"
          >
            <div class="file-icon" :class="`ext-${file.ext?.toLowerCase() || 'unknown'}`">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 2V8H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-if="file.ext" class="ext-badge">{{ file.ext }}</span>
            </div>
            <div class="file-info">
              <div class="file-name">
                {{ file.name }}<span v-if="file.ext">.{{ file.ext }}</span>
              </div>
              <div v-if="file.size" class="file-meta">
                <!-- {{ formatFileSize(file.size) }} -->
                {{ file.size }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.right-panel {
  padding: 16px;
  height: 100%;
  overflow-y: auto;
}

/* Empty State */
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.empty-subtext {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* Content */
.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Folders Grid */
.folders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.folder-tile {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 110px;
}

.folder-tile:hover {
  border-color: #3b82f6;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.folder-tile:active {
  transform: translateY(0);
}

.folder-icon {
  color: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.folder-tile:hover .folder-icon {
  transform: scale(1.1);
}

.folder-name {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-word;
  line-height: 1.4;
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .folders-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .folder-tile {
    padding: 12px 8px;
    min-height: 100px;
  }

  .folder-name {
    font-size: 12px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .empty-icon {
    color: #4b5563;
  }

  .empty-text {
    color: #9ca3af;
  }

  .empty-subtext {
    color: #6b7280;
  }

  .folder-tile {
    background: #1f2937;
    border-color: #374151;
  }

  .folder-tile:hover {
    border-color: #60a5fa;
    background: #1e3a5f;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }

  .folder-icon {
    color: #60a5fa;
  }

  .folder-name {
    color: #e5e7eb;
  }
}
</style>

<!-- file section enhance -->
<style scoped>
/* Files Section */
.section {
  margin-top: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.file-tile {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 120px;
  text-align: center;
}

.file-tile:hover {
  border-color: #3b82f6;
  background: #f8faff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.file-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  font-size: 24px;
  color: #6b7280;
}

.file-tile:hover .file-icon {
  transform: scale(1.1);
  color: #3b82f6;
}

/* File Name & Meta */
.file-info {
  width: 100%;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.file-meta {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
}

.ext-badge {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 6px;
  font-weight: 600;
}


@media (max-width: 768px) {
  .files-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .file-tile {
    min-height: 100px;
    padding: 10px 8px;
  }

  .file-name {
    font-size: 12px;
  }

  .file-meta {
    font-size: 11px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .section-title {
    color: #e5e7eb;
  }

  .file-tile {
    background: #1f2937;
    border-color: #374151;
  }

  .file-tile:hover {
    border-color: #60a5fa;
    background: #1e3a5f;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.2);
  }

  .file-icon {
    color: #9ca3af;
  }

  .file-name {
    color: #e5e7eb;
  }

  .file-meta {
    color: #9ca3af;
  }
}
</style>