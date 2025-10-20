<!-- src/presentation/components/Breadcrumbs.vue -->
<script setup lang="ts">
import { inject } from 'vue';

const vm = inject<any>('folderVM');
if (!vm) throw new Error('folderVM not provided');

function handleClick(id: string) {
  vm.onBreadcrumbClick(id);
}
</script>

<template>
  <div class="breadcrumbs">
    <div v-if="vm.breadcrumbsLoading.value" class="loading">
      <div class="spinner"></div>
    </div>
    
    <nav v-else class="breadcrumb-nav">
      <template v-for="(bc, index) in vm.breadcrumbItems.value" :key="bc.id">
        <button
          class="breadcrumb-item"
          :class="{ active: index === vm.breadcrumbItems.value.length - 1 }"
          @click="handleClick(bc.id)"
        >
          {{ bc.label }}
        </button>
        
        <svg
          v-if="index < vm.breadcrumbItems.value.length - 1"
          class="separator"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M6 12L10 8L6 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </template>
    </nav>
  </div>
</template>

<style scoped>
.breadcrumbs {
  padding: 12px 16px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 28px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.breadcrumb-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  background: none;
  border: none;
  padding: 6px 10px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  font-weight: 500;
  white-space: nowrap;
}

.breadcrumb-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.breadcrumb-item.active {
  color: #111827;
  cursor: default;
  font-weight: 600;
}

.breadcrumb-item.active:hover {
  background: none;
}

.separator {
  color: #d1d5db;
  flex-shrink: 0;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .spinner {
    border-color: #374151;
    border-top-color: #60a5fa;
  }

  .breadcrumb-item {
    color: #9ca3af;
  }

  .breadcrumb-item:hover {
    background: #1f2937;
    color: #e5e7eb;
  }

  .breadcrumb-item.active {
    color: #f9fafb;
  }

  .separator {
    color: #4b5563;
  }
}
</style>