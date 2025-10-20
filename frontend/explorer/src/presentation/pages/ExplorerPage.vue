<!-- src/presentation/pages/ExplorerPage.vue -->
<script setup lang="ts">
import { inject, onMounted, provide } from "vue";
import { NLayout, NLayoutSider, NLayoutContent } from "naive-ui";
import { useFolderViewModel } from "../viewmodels/useFolderViewModel";
import SidebarTree from "../components/SidebarTree.vue";
import RightPanel from "../components/RightPanel.vue";

const container = inject<any>('container');
if (!container) throw new Error('DI container not found');

const folderVM = useFolderViewModel(container.folderPort);
// provide agar anak-anak bisa inject tanpa bikin instance baru
provide('folderVM', folderVM);

onMounted(() => {
  // Sesuaikan rootPath & depth preferensimu.
  //  - Requirement minta "kiri memuat semua folder saat load": pakai depth besar (mis. 10)
  //  - Atau realistis (2) + lazy expand (lebih scalable)
  folderVM.loadRoot('root', 2);
});
</script>

<template>
  <NLayout has-sider>
    <NLayoutSider width="320" bordered content-style="padding: 8px">
      <SidebarTree />
    </NLayoutSider>
    <NLayoutContent>
      <RightPanel />
    </NLayoutContent>
  </NLayout>
</template>