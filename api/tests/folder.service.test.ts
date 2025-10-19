import { expect, test } from 'bun:test';
import { FolderService } from '../api/src/services/folder.service';

test('FolderService exists', () => {
  const svc = new FolderService();
  expect(typeof svc.getChildren).toBe('function');
});
