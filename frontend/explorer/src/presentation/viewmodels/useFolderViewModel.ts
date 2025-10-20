// src/presentation/viewmodels/useFolderViewModel.ts
import { ref, computed } from "vue";
import type { FolderPort } from "../../application/ports/folder.port";
import type { FolderEntity } from "@/application/domain/folder.entity";

type ID = string;

// Node khusus presentasi (tidak mengubah domain)
export type FolderNode = FolderEntity & {
  children?: FolderNode[];
  hasChildren?: boolean;   // unknown -> true untuk allow lazy
  childCount?: number;
};

export function useFolderViewModel(folderPort: FolderPort) {
  const treeData = ref<FolderNode[]>([]);
  const searchResults = ref<FolderEntity[]>([]);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const expandedIds = ref<Set<ID>>(new Set());
  const selectedId = ref<ID | null>(null);

  // index cepat id -> node (dari treeData)
  const idToNode = ref<Map<ID, FolderNode>>(new Map());
  const loadingIds = ref<Set<ID>>(new Set()); // agar tidak double fetch saat expand cepat-cepat
  function buildIndex(nodes: FolderNode[]) {
    const map = new Map<ID, FolderNode>();
    const stack = [...nodes];
    while (stack.length) {
      const n = stack.pop()!;
      map.set(n.id, n);
      if (n.children?.length) stack.push(...n.children);
    }
    idToNode.value = map;
  }

  /** Normalisasi flat array -> pohon (children[]). 
   *  Kita juga coba hitung childCount & hasChildren dari flat list yang tersedia. */
  function buildTreeFromFlat(flat: FolderEntity[]): FolderNode[] {
    const nodeMap = new Map<ID, FolderNode>();
    const childCountMap = new Map<ID, number>();

    // siapkan node dasar
    for (const it of flat) {
      nodeMap.set(it.id, { ...it, children: [] });
      if (it.parentId) {
        childCountMap.set(it.parentId, (childCountMap.get(it.parentId) ?? 0) + 1);
      }
    }

    // assign childCount & hasChildren sementara
    for (const [id, node] of nodeMap) {
      const count = childCountMap.get(id) ?? 0;
      node.childCount = count;
      // jika `maxDepth` membatasi, childCount bisa 0 padahal masih punya anak real.
      // Di kasus ini, kita tidak tahu. Biarkan undefined -> UI tetap boleh expand (lazy).
      node.hasChildren = count > 0 ? true : undefined;
    }

    // bangun tree
    const roots: FolderNode[] = [];
    for (const node of nodeMap.values()) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async function loadRoot(rootPath: string, maxDepth = 1) {
    loading.value = true;
    error.value = null;
    try {
      const flat = await folderPort.getSubTree(rootPath, maxDepth);
      console.debug('[loadRoot] flat len =', flat.length, flat);
      const tree = buildTreeFromFlat(flat);
      console.debug('[loadRoot] tree roots =', tree.length, tree);
      treeData.value = tree;
      buildIndex(tree);
      selectedId.value = null;
      // [breadcrumbs] reset jika pindah root
      breadcrumbs.value = [];
      breadcrumbsError.value = null;
    } catch (err: any) {
      error.value = err.message || 'Failed to load root folders';
    } finally {
      loading.value = false;
    }
  }

  async function loadChildren(folderId: ID) {
    try {
      console.log("Loading children for folderId=", folderId);
      const children = await folderPort.getChildren(folderId); // direct children (flat/ direct)
      const normalized: FolderNode[] = children.map((c) => ({
        ...c,
        children: [],
        hasChildren: undefined,
        childCount: undefined,
      }));
      return normalized;
    } catch (err: any) {
      error.value = err.message || "Failed to load children";
      console.error("Failed to load children for folderId=", folderId, err);
      return [];
    }
  }

  function findNodeById(id: ID): FolderNode | null {
    return idToNode.value.get(id) ?? null;
  }

  function attachChildren(parentId: ID, children: FolderNode[]) {
    const parent = findNodeById(parentId);
    if (!parent) return;
    parent.children = children;
    parent.childCount = children.length;
    parent.hasChildren = children.length > 0;
    buildIndex(treeData.value);
  }

  async function toggleExpand(id: ID) {
    if (expandedIds.value.has(id)) {
      expandedIds.value.delete(id);
      return;
    }
    const node = findNodeById(id);
    if (!node) return;

    if ((!node.children || node.children.length === 0) && !loadingIds.value.has(id)) {
      try {
        loadingIds.value.add(id);
        const children = await loadChildren(id);
        attachChildren(id, children);
      } finally {
        loadingIds.value.delete(id);
      }
    }
    expandedIds.value.add(id);
  }

  function select(id: ID) {
    selectedId.value = id;
    // auto-load direct children untuk panel kanan bila belum ada (non-blocking)
    const node = findNodeById(id);
    if (node && (!node.children || node.children.length === 0)) {
      loadChildren(id).then((chs) => attachChildren(id, chs));
    }
    // [breadcrumbs] refresh (non-blocking)
    refreshBreadcrumbs(id);
  }

  async function search(keyword: string) {
    loading.value = true;
    error.value = null;
    try {
      const result = await folderPort.search(keyword);
      searchResults.value = result;
    } catch (err: any) {
      error.value = err.message || "Search failed";
    } finally {
      loading.value = false;
    }
  }

  const rightPanelChildren = computed<FolderNode[]>(() => {
    if (!selectedId.value) return [];
    const node = findNodeById(selectedId.value);
    return node?.children ?? [];
  });

  // ============================
  // [breadcrumbs] STATE & ACTION
  // ============================
  const breadcrumbs = ref<FolderEntity[]>([]);
  const breadcrumbsLoading = ref(false);
  const breadcrumbsError = ref<string | null>(null);
  const breadcrumbsCache = ref<Map<ID, FolderEntity[]>>(new Map());

  // untuk mencegah race condition (klik cepat di tree)
  let lastBreadcrumbRequestFor: ID | null = null;

  async function loadBreadcrumbs(folderId: ID, opts: { useCache?: boolean } = {}) {
    const { useCache = true } = opts;
    breadcrumbsLoading.value = true;
    breadcrumbsError.value = null;

    try {
      if (useCache && breadcrumbsCache.value.has(folderId)) {
        breadcrumbs.value = breadcrumbsCache.value.get(folderId)!;
        return breadcrumbs.value;
      }

      lastBreadcrumbRequestFor = folderId;
      const list = await folderPort.getBreadcrumbs(folderId);
      // Pastikan urutan root -> current
      const ordered = list
        .slice() // copy
        .sort((a, b) => (a.depth ?? 0) - (b.depth ?? 0));

      // jika respons terakhir bukan untuk id ini (race), abaikan
      if (lastBreadcrumbRequestFor !== folderId) return breadcrumbs.value;

      breadcrumbs.value = ordered;
      breadcrumbsCache.value.set(folderId, ordered);
      return ordered;
    } catch (e: any) {
      breadcrumbsError.value = e?.message ?? 'Failed to load breadcrumbs';
      // fallback: coba compute lokal dari tree bila memungkinkan
      const fallback = computeLocalBreadcrumbs(folderId);
      breadcrumbs.value = fallback;
      return fallback;
    } finally {
      breadcrumbsLoading.value = false;
    }
  }

  function computeLocalBreadcrumbs(folderId: ID): FolderEntity[] {
    const path: FolderEntity[] = [];
    let cur = findNodeById(folderId);
    const guard = new Set<ID>();
    while (cur && !guard.has(cur.id)) {
      guard.add(cur.id);
      path.push({
        id: cur.id,
        name: cur.name,
        parentId: cur.parentId ?? null,
        path: cur.path,
        depth: cur.depth,
      } as FolderEntity);
      cur = cur.parentId ? findNodeById(cur.parentId) : null;
    }
    return path.reverse();
  }

  async function refreshBreadcrumbs(folderId: ID) {
    await loadBreadcrumbs(folderId, { useCache: true });
  }

  // Expand tree sepanjang breadcrumbs lalu select target.
  async function ensureExpandedAlongBreadcrumbs(list: FolderEntity[]) {
    for (const bc of list) {
      // expand node sesuai urutan
      if (!expandedIds.value.has(bc.id)) {
        await toggleExpand(bc.id);
      }
    }
  }

  async function onBreadcrumbClick(folderId: ID) {
    // kalau breadcrumbs saat ini memuat id tersebut, expand sampai sana
    const list = breadcrumbs.value;
    const idx = list.findIndex(b => b.id === folderId);
    if (idx >= 0) {
      await ensureExpandedAlongBreadcrumbs(list.slice(0, idx + 1));
      select(folderId);
      return;
    }
    // jika tidak ada di list (misal cache), tetap select dan refresh
    select(folderId);
  }

  const breadcrumbItems = computed(() => {
    return breadcrumbs.value.map(b => ({
      id: b.id,
      label: b.name,
      path: b.path,
      depth: b.depth,
    }));
  });

  return {
    // state
    treeData,
    searchResults,
    loading,
    error,
    expandedIds,
    selectedId,
    rightPanelChildren,

    // [breadcrumbs] state
    breadcrumbs,
    breadcrumbsLoading,
    breadcrumbsError,
    breadcrumbItems,

    // actions
    loadRoot,
    toggleExpand,
    select,
    search,

    // [breadcrumbs] actions
    loadBreadcrumbs,
    refreshBreadcrumbs,
    onBreadcrumbClick,
    ensureExpandedAlongBreadcrumbs,
  };
}