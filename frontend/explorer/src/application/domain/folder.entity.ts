export class FolderEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly parentId: string | null,
    public readonly path: string,
    public readonly depth: number
  ) {}

  // isRoot(): boolean {
  //   return this.parentId === null;
  // }
}
