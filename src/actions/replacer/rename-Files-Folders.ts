import * as fs from "fs";

export async function renameFilesAndFolders(
  rootPath: string,
  nameToReplace: string,
  replaceWith: string
) {
  const files = await fs.promises.readdir(rootPath);
  for (const file of files) {
    const filePath = `${rootPath}/${file}`;
    const fileStats = await fs.promises.stat(filePath);
    if (fileStats.isDirectory()) {
      const newName = file.replace(nameToReplace, replaceWith);
      if (newName !== file) {
        const newPath = `${rootPath}/${newName}`;
        await fs.promises.rename(filePath, newPath);
        await renameFilesAndFolders(newPath, nameToReplace, replaceWith);
      } else {
        await renameFilesAndFolders(filePath, nameToReplace, replaceWith);
      }
    } else {
      const newName = file.replace(nameToReplace, replaceWith);
      if (newName !== file) {
        const newPath = `${rootPath}/${newName}`;
        await fs.promises.rename(filePath, newPath);
      }
    }
  }
}
