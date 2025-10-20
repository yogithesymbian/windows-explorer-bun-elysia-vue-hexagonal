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
  <div
    class="infokes-tree-node"
    :style="{ paddingLeft: `${level * 12}px` }"
    :class="{ selected: isSelected }"
    @click="handleSelect"
  >
    <button class="caret" @click="handleToggle" :disabled="!showCaret">
      <span v-if="showCaret">{{ isExpanded ? '▾' : '▸' }}</span>
      <span v-else class="placeholder">•</span>
    </button>
    <span class="folder-icon">📁</span>
    <span class="name" :title="node.name">{{ node.name }}</span>
    <span v-if="node.childCount != null" class="count">({{ node.childCount }})</span>
  </div>

  <div v-if="isExpanded && node.children?.length">
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
</template>

<style scoped>
.infokes-tree-node { display: flex; align-items: center; line-height: 26px; cursor: pointer; user-select: none; }
.infokes-tree-node:hover { background: rgba(0,0,0,0.05); }
.selected { background: rgba(24,160,88,0.15); }
.caret { width: 22px; margin-right: 4px; border: none; background: transparent; cursor: pointer; }
.placeholder { opacity: 0.3; }
.folder-icon { margin-right: 6px; }
.name { margin-right: 6px; }
.count { color: #888; font-size: 12px; }
</style>