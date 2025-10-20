<!-- src/presentation/components/SidebarTree.vue -->
<script setup lang="ts">
import { computed, inject } from "vue";
import InfokesTreeNode from "./InfokesTreeNode.vue";
import type { FolderNode } from "../viewmodels/useFolderViewModel";

const vm = inject<any>('folderVM');
if (!vm) throw new Error('folderVM not provided');

const query = defineModel<string>("query", { default: "" });

const filteredRoots = computed<FolderNode[]>(() => {
  console.log("Filtering roots with query:", query.value);
  const q = query.value.trim().toLowerCase();
  if (!q) {
    return vm.treeData.value;
  }

  function filterNode(n: FolderNode): FolderNode | null {
    const match = n.name.toLowerCase().includes(q);
    const children = (n.children ?? [])
      .map(filterNode)
      .filter(Boolean) as FolderNode[];
    if (match || children.length) {
      vm.expandedIds.value.add(n.id)
      return { ...n, children };
    }
    return null;
  }
  console.log("Original roots count:", vm.treeData.length);
  return vm.treeData.value.map(filterNode).filter(Boolean) as FolderNode[];
});

function clearSearch() {
  query.value = "";
}
</script>

<template>
  <div class="sidebar-tree">
    <!-- Search Header -->
    <div class="search-header">
      <div class="search-box">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          v-model="query"
          type="text"
          class="search-input"
          placeholder="Cari folder..."
        />
        <button
          v-if="query"
          class="clear-btn"
          @click="clearSearch"
          aria-label="Clear search"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Tree Content -->
    <div class="tree-content">
      <!-- Loading State -->
      <div v-if="vm.loading.value" class="state-message">
        <div class="spinner"></div>
        <p>Memuat struktur folder...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="vm.error.value" class="state-message error">
        <svg class="error-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M12 8V12M12 16H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>{{ vm.error.value }}</p>
      </div>

      <!-- Empty Search Results -->
      <div v-else-if="query && filteredRoots.length === 0" class="state-message empty">
        <svg class="empty-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <p>Tidak ada folder ditemukan</p>
        <button class="clear-search-btn" @click="clearSearch">
          Hapus pencarian
        </button>
      </div>

      <!-- Tree Nodes -->
      <div v-else class="tree-nodes">
        <InfokesTreeNode
          v-for="root in filteredRoots"
          :key="root.id"
          :node="root"
          :level="0"
          :expanded-ids="vm.expandedIds.value"
          :selected-id="vm.selectedId.value"
          :on-toggle="vm.toggleExpand"
          :on-select="vm.select"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

/* Search Header */
.search-header {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.2s ease;
}

.search-box:focus-within {
  background: #ffffff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #111827;
  padding: 0;
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

/* Tree Content */
.tree-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Custom Scrollbar */
.tree-content::-webkit-scrollbar {
  width: 8px;
}

.tree-content::-webkit-scrollbar-track {
  background: #f9fafb;
}

.tree-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.tree-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* State Messages */
.state-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
  gap: 12px;
}

.state-message p {
  margin: 0;
  font-size: 14px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.state-message.error {
  color: #dc2626;
}

.error-icon {
  color: #dc2626;
}

/* Empty State */
.state-message.empty {
  color: #9ca3af;
}

.empty-icon {
  color: #d1d5db;
}

.clear-search-btn {
  background: #3b82f6;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.clear-search-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.clear-search-btn:active {
  transform: translateY(0);
}

/* Tree Nodes */
.tree-nodes {
  padding: 8px 0;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .sidebar-tree {
    background: #111827;
  }

  .search-header {
    background: #111827;
    border-bottom-color: #374151;
  }

  .search-box {
    background: #1f2937;
    border-color: #374151;
  }

  .search-box:focus-within {
    background: #1f2937;
    border-color: #60a5fa;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.15);
  }

  .search-icon {
    color: #6b7280;
  }

  .search-input {
    color: #f9fafb;
  }

  .search-input::placeholder {
    color: #6b7280;
  }

  .clear-btn {
    color: #9ca3af;
  }

  .clear-btn:hover {
    background: #374151;
    color: #e5e7eb;
  }

  .tree-content::-webkit-scrollbar-track {
    background: #1f2937;
  }

  .tree-content::-webkit-scrollbar-thumb {
    background: #4b5563;
  }

  .tree-content::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }

  .state-message {
    color: #9ca3af;
  }

  .spinner {
    border-color: #374151;
    border-top-color: #60a5fa;
  }

  .state-message.error {
    color: #ef4444;
  }

  .error-icon {
    color: #ef4444;
  }

  .empty-icon {
    color: #4b5563;
  }

  .clear-search-btn {
    background: #60a5fa;
  }

  .clear-search-btn:hover {
    background: #3b82f6;
    box-shadow: 0 4px 12px rgba(96, 165, 250, 0.3);
  }
}
</style>