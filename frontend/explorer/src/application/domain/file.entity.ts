export class FileEntity {
  constructor(
    public readonly id: string,
    public readonly folderId: string,
    public readonly name: string,
    public readonly ext: string,
    public readonly size: number
  ) {}

//   isImage(): boolean {
//     const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'];
//     return imageExtensions.includes(this.ext.toLowerCase());
//   }
}