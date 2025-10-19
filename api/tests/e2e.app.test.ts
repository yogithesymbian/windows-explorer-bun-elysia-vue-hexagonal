import { beforeAll, afterAll, test, expect } from 'bun:test';
import { createApp } from '../src/server';
import type { IFoldersRepository, FolderRow } from '@application/ports/folder-repo.port';
import type { IFilesRepository, FileRow } from '@application/ports/file-repo.port';

// --- In-memory data ---
const foldersData: FolderRow[] = [
  { id: 'root-id', name: 'root', parent_id: null, path: 'root', depth: 0 },
  { id: 'proj-id', name: 'projects', parent_id: 'root-id', path: 'root.projects', depth: 1 },
  { id: 'mob-id',  name: 'mobile',   parent_id: 'proj-id', path: 'root.projects.mobile', depth: 2 },
  { id: 'web-id',  name: 'web',      parent_id: 'proj-id', path: 'root.projects.web',    depth: 2 }
];

const filesData: FileRow[] = [
  { id: 'f1', folder_id: 'mob-id', name: 'README', ext: 'md', size: 1000 },
  { id: 'f2', folder_id: 'mob-id', name: 'logo',   ext: 'png', size: 2048 }
];

// --- In-memory repos implementing ports ---
class MemFoldersRepo implements IFoldersRepository {
  async getSubtreeByPath(rootPath: string, maxDepth: number): Promise<FolderRow[]> {
    const root = foldersData.find(f => f.path === rootPath);
    if (!root) return [];
    return foldersData.filter(f => f.path.startsWith(root.path) && f.depth <= root.depth + maxDepth)
                      .sort((a, b) => a.path.localeCompare(b.path));
  }
  async getChildren(parentId: string, paging: { limit: number; offset: number }): Promise<FolderRow[]> {
    const results = foldersData.filter(f => f.parent_id === parentId).sort((a,b) => a.name.localeCompare(b.name));
    return results.slice(paging.offset, paging.offset + paging.limit);
  }
  async getBreadcrumbs(id: string): Promise<FolderRow[]> {
    const node = foldersData.find(f => f.id === id); if (!node) return [];
    const parts = node.path.split('.');
    const paths: string[] = [];
    for (let i=0;i<parts.length;i++) paths.push(parts.slice(0,i+1).join('.'));
    return foldersData.filter(f => paths.includes(f.path)).sort((a,b) => a.depth - b.depth);
  }
  async searchFolders(q: string, paging: { limit: number; offset: number }): Promise<FolderRow[]> {
    const results = foldersData.filter(f => f.name.toLowerCase().includes(q.toLowerCase()))
                               .sort((a,b) => a.name.localeCompare(b.name));
    return results.slice(paging.offset, paging.offset + paging.limit);
  }
}

class MemFilesRepo implements IFilesRepository {
  async listByFolder(folderId: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    const results = filesData.filter(f => f.folder_id === folderId).sort((a,b)=>a.name.localeCompare(b.name));
    return results.slice(paging.offset, paging.offset + paging.limit);
  }
  async searchFiles(q: string, paging: { limit: number; offset: number }): Promise<FileRow[]> {
    const results = filesData.filter(f => (f.name + ' ' + (f.ext ?? '')).toLowerCase().includes(q.toLowerCase()))
                             .sort((a,b)=>a.name.localeCompare(b.name));
    return results.slice(paging.offset, paging.offset + paging.limit);
  }
}

let baseUrl = '';
const app = createApp({ foldersRepo: new MemFoldersRepo(), filesRepo: new MemFilesRepo() });

beforeAll(() => {
  app.listen(0); // ephemeral port
  baseUrl = `http://localhost:${app.server?.port}`;
});

afterAll(async () => {
  await app.stop();
});

test('GET /api/v1/tree returns subtree JSON', async () => {
  const res = await fetch(`${baseUrl}/api/v1/tree?rootPath=root.projects&maxDepth=1`);
  expect(res.ok).toBe(true);
  expect((res.headers.get('content-type') ?? '').includes('application/json')).toBe(true);
  const data = await res.json();
  expect(Array.isArray(data)).toBe(true);
  // subtree root.projects dengan depth 1 harus berisi projects + (mobile, web)
  const names = data.map((d: any) => d.name);
  expect(names).toContain('projects');
  expect(names).toContain('mobile');
  expect(names).toContain('web');
});

test('GET /api/v1/folders/:id/children', async () => {
  const res = await fetch(`${baseUrl}/api/v1/folders/proj-id/children`);
  expect(res.ok).toBe(true);
  const data = await res.json();
  expect(data.length).toBe(2);
  expect(data[0]).toHaveProperty('id');
  expect(data[0]).toHaveProperty('name');
});

test('GET /api/v1/folders/:id/breadcrumbs', async () => {
  const res = await fetch(`${baseUrl}/api/v1/folders/mob-id/breadcrumbs`);
  const data = await res.json();
  expect(data.map((d: any) => d.name)).toEqual(['root', 'projects', 'mobile']);
});

test('GET /api/v1/folders/:id/files', async () => {
  const res = await fetch(`${baseUrl}/api/v1/folders/mob-id/files`);
  const data = await res.json();
  expect(data.length).toBe(2);
  expect(data[0]).toHaveProperty('ext');
});

test('GET /api/v1/search type=folder', async () => {
  const res = await fetch(`${baseUrl}/api/v1/search?type=folder&q=pro`);
  const data = await res.json();
  expect(data.some((d: any) => d.name === 'projects')).toBe(true);
});

test('GET /api/v1/search type=file', async () => {
  const res = await fetch(`${baseUrl}/api/v1/search?type=file&q=readme`);
  const data = await res.json();
  expect(data.some((d: any) => d.name === 'README')).toBe(true);
});