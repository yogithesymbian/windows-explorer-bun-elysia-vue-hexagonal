<!-- src/presentation/components/InfokesTreeNode.vue -->
<script setup lang="ts">
import { computed } from "vue";
import type { FolderNode } from "../viewmodels/useFolderViewModel";

const props = defineProps<{
  node: FolderNode;
  level: number;
  expandedIds: Set<string>;
  selectedId: string | null;
  onToggle: (id: string) => void | Promise<void>;
  onSelect: (id: string) => void;
}>();

const isExpanded = computed(() => props.expandedIds.has(props.node.id));
const isSelected = computed(() => props.selectedId === props.node.id);

// Tampilkan caret jika kita yakin punya anak, atau kita "belum tahu" (biar bisa lazy)
const showCaret = computed(() => {
  if (props.node.hasChildren === true) return true;
  if (props.node.hasChildren === false) return false;
  // unknown (undefined) -> tampilkan caret untuk coba lazy expand
  return true;
});

function handleToggle(e: MouseEvent) {
  e.stopPropagation();
  if (showCaret.value) props.onToggle(props.node.id);
}

function handleSelect() {
  props.onSelect(props.node.id);
}
</script>

<template>
  <div class="tree-node-wrapper">
    <div
      class="tree-node"
      :style="{ paddingLeft: `${level * 16 + 8}px` }"
      :class="{ selected: isSelected, 'has-children': showCaret }"
      @click="handleSelect"
    >
      <!-- Toggle Button -->
      <button
        class="toggle-btn"
        :class="{ expanded: isExpanded, hidden: !showCaret }"
        @click="handleToggle"
        :disabled="!showCaret"
        :aria-label="isExpanded ? 'Collapse' : 'Expand'"
      >
        <svg
          v-if="showCaret"
          class="chevron-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span v-else class="no-children-dot"></span>
      </button>

      <!-- Folder Icon -->
      <div class="folder-icon" :class="{ expanded: isExpanded, selected: isSelected }">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            v-if="isExpanded"
            d="M5 19C4.44772 19 4 18.5523 4 18V9C4 8.44772 4.44772 8 5 8H9.58579C9.851 8 10.1054 8.10536 10.2929 8.29289L11.7071 9.70711C11.8946 9.89464 12.149 10 12.4142 10H19C19.5523 10 20 10.4477 20 11V18C20 18.5523 19.5523 19 19 19H5Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            v-else
            d="M3 8L9.00319 2.76351C9.57983 2.28067 10.3597 2 11.1719 2H19C20.1046 2 21 2.89543 21 4V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V8Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Folder Name -->
      <span class="folder-name" :title="node.name">{{ node.name }}</span>

      <!-- Child Count Badge -->
      <span v-if="node.childCount != null" class="count-badge">
        {{ node.childCount }}
      </span>
    </div>

    <!-- Children -->
    <div v-if="isExpanded && node.children?.length" class="children">
      <InfokesTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :level="level + 1"
        :expanded-ids="expandedIds"
        :selected-id="selectedId"
        :on-toggle="onToggle"
        :on-select="onSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.tree-node-wrapper {
  position: relative;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px 6px 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  margin: 1px 8px 1px 0;
  transition: all 0.15s ease;
  position: relative;
}

.tree-node:hover {
  background: #f3f4f6;
}

.tree-node.selected {
  background: #dbeafe;
  color: #1e40af;
}

.tree-node.selected:hover {
  background: #bfdbfe;
}

/* Toggle Button */
.toggle-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  color: #6b7280;
  padding: 0;
}

.toggle-btn:hover:not(:disabled) {
  background: #e5e7eb;
  color: #374151;
}

.toggle-btn:disabled {
  cursor: default;
  opacity: 0.3;
}

.toggle-btn.hidden {
  visibility: hidden;
}

.chevron-icon {
  transition: transform 0.2s ease;
}

.toggle-btn.expanded .chevron-icon {
  transform: rotate(90deg);
}

.no-children-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d1d5db;
}

/* Folder Icon */
.folder-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #3b82f6;
  transition: all 0.2s ease;
}

.tree-node:hover .folder-icon {
  color: #2563eb;
}

.folder-icon.selected {
  color: #1e40af;
}

.folder-icon.expanded {
  color: #f59e0b;
}

/* Folder Name */
.folder-name {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.15s ease;
}

.tree-node.selected .folder-name {
  color: #1e40af;
  font-weight: 600;
}

/* Count Badge */
.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 18px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.tree-node:hover .count-badge {
  background: #e5e7eb;
  color: #374151;
}

.tree-node.selected .count-badge {
  background: #93c5fd;
  color: #1e40af;
}

/* Children Container */
.children {
  position: relative;
}

/* Connecting Lines (Optional - Uncomment if you want) */
/*
.children::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 8px;
  width: 1px;
  background: #e5e7eb;
}
*/

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .tree-node:hover {
    background: #1f2937;
  }

  .tree-node.selected {
    background: #1e3a5f;
    color: #93c5fd;
  }

  .tree-node.selected:hover {
    background: #1e40af;
  }

  .toggle-btn {
    color: #9ca3af;
  }

  .toggle-btn:hover:not(:disabled) {
    background: #374151;
    color: #e5e7eb;
  }

  .no-children-dot {
    background: #4b5563;
  }

  .folder-icon {
    color: #60a5fa;
  }

  .tree-node:hover .folder-icon {
    color: #3b82f6;
  }

  .folder-icon.selected {
    color: #93c5fd;
  }

  .folder-icon.expanded {
    color: #fbbf24;
  }

  .folder-name {
    color: #e5e7eb;
  }

  .tree-node.selected .folder-name {
    color: #93c5fd;
  }

  .count-badge {
    color: #9ca3af;
    background: #374151;
  }

  .tree-node:hover .count-badge {
    background: #4b5563;
    color: #d1d5db;
  }

  .tree-node.selected .count-badge {
    background: #2563eb;
    color: #dbeafe;
  }

  /*
  .children::before {
    background: #374151;
  }
  */
}

/* Animation for children expand/collapse */
.children {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>