import * as fs from "fs";

export async function getAllFolderPaths(
  rootPath: string,
  currentPath?: string
): Promise<string[]> {
  const folderPaths: string[] = [];
  currentPath = currentPath || "";
  const dirEntries = await fs.promises.readdir(`${rootPath}/${currentPath}`, {
    withFileTypes: true,
  });
  for (const entry of dirEntries) {
    if (entry.isDirectory()) {
      const folderPath = `${currentPath}${currentPath ? "/" : ""}${entry.name}`;
      folderPaths.push(folderPath);
      const subfolderPaths = await getAllFolderPaths(rootPath, folderPath);
      folderPaths.push(...subfolderPaths);
    }
  }
  return folderPaths;
}
