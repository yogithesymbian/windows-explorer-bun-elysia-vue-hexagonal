<!-- src/presentation/components/Breadcrumbs.vue -->
<script setup lang="ts">
import { inject } from 'vue';
import { NBreadcrumb, NBreadcrumbItem, NSpin } from 'naive-ui';

const vm = inject<any>('folderVM');
if (!vm) throw new Error('folderVM not provided');

function handleClick(id: string) {
  vm.onBreadcrumbClick(id);
}
</script>

<template>
  <div class="breadcrumbs">
    <NSpin :show="vm.breadcrumbsLoading.value">
      <NBreadcrumb>
        <NBreadcrumbItem
          v-for="bc in vm.breadcrumbItems.value"
          :key="bc.id"
          @click="handleClick(bc.id)"
          style="cursor: pointer"
        >
          {{ bc.label }}
        </NBreadcrumbItem>
      </NBreadcrumb>
    </NSpin>
  </div>
</template>

<style scoped>
.breadcrumbs { padding: 8px 12px; }
</style>