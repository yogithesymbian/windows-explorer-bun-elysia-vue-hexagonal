<!-- src/presentation/components/SidebarTree.vue -->
<script setup lang="ts">
import { computed, inject } from "vue";
import { NInput, NScrollbar, NCard } from "naive-ui";
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
</script>

<template>
  <NCard size="small" content-style="padding: 8px">
    <NInput v-model:value="query" placeholder="Cari folder..." size="small" clearable />
  </NCard>

  <NScrollbar style="height: calc(100vh - 120px)">
    <div v-if="vm.loading.value" class="p-2">Memuat struktur folder...</div>
    <div v-else-if="vm.error.value" class="p-2 text-error">Error: {{ vm.error }}</div>
    <div v-else>
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
  </NScrollbar>
</template>

<style scoped>
.p-2 { padding: 8px; }
.text-error { color: #d03050; }
</style>