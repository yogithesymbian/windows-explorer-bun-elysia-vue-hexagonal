<!-- src/presentation/components/RightPanel.vue -->
<script setup lang="ts">
import { inject } from "vue";
import { NEmpty, NGrid, NGridItem, NCard } from "naive-ui";
import InfokesBreadCrumbs from "./InfokesBreadCrumbs.vue";

const vm = inject<any>('folderVM');
if (!vm) throw new Error('folderVM not provided');
</script>

<template>
  <div class="right-panel">
    <div v-if="!vm.selectedId.value" class="placeholder">
      <NEmpty description="Pilih folder di panel kiri untuk melihat subfolder" />
    </div>
    <div v-else>
      <InfokesBreadCrumbs/>
      <!-- :title="vm.selectedId.value + vm.selectedId.value" size="small" -->
      <NCard>
        <NGrid cols="12" x-gap="8" y-gap="8">
          <NGridItem v-for="child in vm.rightPanelChildren.value" :key="child?.id" :span="3">
            <div class="tile">
              <div class="icon">📁</div>
              <div class="name" :title="child?.name">{{ child?.name }}</div>
            </div>
          </NGridItem>
        </NGrid>
      </NCard>
    </div>
  </div>
</template>

<style scoped>
.right-panel { padding: 12px; }
.tile { border: 1px solid #eee; border-radius: 8px; padding: 10px; text-align: center; background: #fff; }
.icon { font-size: 28px; margin-bottom: 6px; }
.name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>