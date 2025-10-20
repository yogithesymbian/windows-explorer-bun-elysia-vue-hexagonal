<!-- src/presentation/components/FilePreviewModal.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface FileData {
  id: string;
  name: string;
  ext?: string;
  size?: number;
  path?: string;
  modifiedDate?: string;
  type?: 'file' | 'folder';
}

const props = defineProps<{
  show: boolean;
  file: FileData | null;
}>();

const emit = defineEmits<{
  close: [];
  download: [file: FileData];
}>();

const fileTypeInfo = computed(() => {
  const ext = props.file?.ext?.toLowerCase();
  
  const types: Record<string, { label: string; color: string; icon: string }> = {
    pdf: { label: 'PDF Document', color: '#ef4444', icon: '📄' },
    doc: { label: 'Word Document', color: '#3b82f6', icon: '📝' },
    docx: { label: 'Word Document', color: '#3b82f6', icon: '📝' },
    xls: { label: 'Excel Spreadsheet', color: '#10b981', icon: '📊' },
    xlsx: { label: 'Excel Spreadsheet', color: '#10b981', icon: '📊' },
    ppt: { label: 'PowerPoint', color: '#f59e0b', icon: '📽️' },
    pptx: { label: 'PowerPoint', color: '#f59e0b', icon: '📽️' },
    jpg: { label: 'Image', color: '#8b5cf6', icon: '🖼️' },
    jpeg: { label: 'Image', color: '#8b5cf6', icon: '🖼️' },
    png: { label: 'Image', color: '#8b5cf6', icon: '🖼️' },
    gif: { label: 'Animated Image', color: '#8b5cf6', icon: '🖼️' },
    svg: { label: 'Vector Image', color: '#8b5cf6', icon: '🖼️' },
    zip: { label: 'Archive', color: '#6366f1', icon: '🗜️' },
    rar: { label: 'Archive', color: '#6366f1', icon: '🗜️' },
    '7z': { label: 'Archive', color: '#6366f1', icon: '🗜️' },
    txt: { label: 'Text File', color: '#6b7280', icon: '📃' },
  };

  return types[ext || ''] || { label: 'File', color: '#6b7280', icon: '📄' };
});

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown';
  if (bytes < 1024) return bytes + ' B';
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + ' KB';
  const mb = kb / 1024;
  return mb.toFixed(1) + ' MB';
};

const formatDate = (date?: string): string => {
  if (!date) return 'Unknown';
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

function handleClose() {
  emit('close');
}

function handleDownload() {
  if (props.file) {
    emit('download', props.file);
  }
}

function handleBackdropClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    handleClose();
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show && file" class="modal-backdrop" @click="handleBackdropClick">
        <div class="modal-container">
          <!-- Close Button -->
          <button class="close-btn" @click="handleClose" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>

          <!-- Header -->
          <div class="modal-header">
            <div class="file-icon-large" :style="{ color: fileTypeInfo.color }">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path 
                  v-if="file.type === 'folder'"
                  d="M3 8L9.00319 2.76351C9.57983 2.28067 10.3597 2 11.1719 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z" 
                  stroke="currentColor" 
                  stroke-width="1.5"
                />
                <path 
                  v-else
                  d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" 
                  stroke="currentColor" 
                  stroke-width="1.5"
                />
                <path 
                  v-if="file.type !== 'folder'"
                  d="M14 2V8H20" 
                  stroke="currentColor" 
                  stroke-width="1.5"
                />
              </svg>
              <div v-if="file.ext" class="ext-badge-large">{{ file.ext }}</div>
            </div>
            
            <div class="header-info">
              <h2 class="file-title">{{ file.name }}<span v-if="file.ext">.{{ file.ext }}</span></h2>
              <p class="file-type">{{ file.type === 'folder' ? 'Folder' : fileTypeInfo.label }}</p>
            </div>
          </div>

          <!-- Preview Area -->
          <div class="preview-area">
            <div class="preview-placeholder">
              <div class="preview-icon">{{ fileTypeInfo.icon }}</div>
              <p class="preview-text">Preview not available</p>
              <p class="preview-subtext">Download to view this file</p>
            </div>
          </div>

          <!-- Details -->
          <div class="details-section">
            <h3 class="details-title">File Details</h3>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Name
                </div>
                <div class="detail-value">{{ file.name }}<span v-if="file.ext">.{{ file.ext }}</span></div>
              </div>

              <div class="detail-item">
                <div class="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Type
                </div>
                <div class="detail-value">{{ file.ext ? file.ext.toUpperCase() : 'Folder' }}</div>
              </div>

              <div class="detail-item">
                <div class="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" stroke-width="2"/>
                    <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Size
                </div>
                <div class="detail-value">{{ formatFileSize(file.size) }}</div>
              </div>

              <div class="detail-item" v-if="file.modifiedDate">
                <div class="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  Modified
                </div>
                <div class="detail-value">{{ formatDate(file.modifiedDate) }}</div>
              </div>

              <div class="detail-item" v-if="file.path">
                <div class="detail-label">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8L9.00319 2.76351C9.57983 2.28067 10.3597 2 11.1719 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  Location
                </div>
                <div class="detail-value detail-path">{{ file.path }}</div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="actions-section">
            <button v-if="file.type !== 'folder'" class="btn btn-primary" @click="handleDownload">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              Download
            </button>
            <button class="btn btn-secondary" @click="handleClose">Close</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

/* Modal Container */
.modal-container {
  background: #ffffff;
  border-radius: 20px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Close Button */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #6b7280;
  z-index: 10;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: rotate(90deg);
}

/* Header */
.modal-header {
  padding: 40px 40px 30px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 20px;
}

.file-icon-large {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ext-badge-large {
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  background: currentColor;
  color: white;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 8px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  min-width: 40px;
  text-align: center;
}

.header-info {
  flex: 1;
  min-width: 0;
}

.file-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
  word-break: break-word;
  line-height: 1.3;
}

.file-type {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

/* Preview Area */
.preview-area {
  padding: 40px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-bottom: 1px solid #e5e7eb;
}

.preview-placeholder {
  text-align: center;
  padding: 40px 20px;
}

.preview-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.preview-text {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 6px 0;
}

.preview-subtext {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* Details Section */
.details-section {
  padding: 30px 40px;
}

.details-title {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin: 0 0 20px 0;
}

.details-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-label svg {
  color: #d1d5db;
}

.detail-value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  padding-left: 24px;
}

.detail-path {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  color: #6b7280;
  word-break: break-all;
}

/* Actions */
.actions-section {
  padding: 20px 40px 40px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    margin: 10px;
    max-height: calc(100vh - 20px);
  }

  .modal-header {
    padding: 30px 24px 24px;
    flex-direction: column;
    text-align: center;
  }

  .file-title {
    font-size: 18px;
  }

  .preview-area {
    padding: 30px 24px;
  }

  .details-section {
    padding: 24px;
  }

  .actions-section {
    padding: 16px 24px 30px;
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .close-btn {
    top: 16px;
    right: 16px;
  }
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .modal-backdrop {
    background: rgba(0, 0, 0, 0.8);
  }

  .modal-container {
    background: #1f2937;
  }

  .close-btn {
    background: #374151;
    color: #9ca3af;
  }

  .close-btn:hover {
    background: #4b5563;
    color: #e5e7eb;
  }

  .modal-header {
    border-bottom-color: #374151;
  }

  .file-title {
    color: #f9fafb;
  }

  .file-type {
    color: #9ca3af;
  }

  .preview-area {
    background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
    border-bottom-color: #374151;
  }

  .preview-text {
    color: #9ca3af;
  }

  .preview-subtext {
    color: #6b7280;
  }

  .details-title {
    color: #9ca3af;
  }

  .detail-label {
    color: #6b7280;
  }

  .detail-label svg {
    color: #4b5563;
  }

  .detail-value {
    color: #e5e7eb;
  }

  .detail-path {
    color: #9ca3af;
  }

  .btn-secondary {
    background: #374151;
    color: #9ca3af;
  }

  .btn-secondary:hover {
    background: #4b5563;
    color: #e5e7eb;
  }

  .ext-badge-large {
    border-color: #1f2937;
  }
}
</style>