import {
  FolderTemplate,
  FolderTemplateSettingsData,
} from "../../interfaces/template";
import * as fs from "fs";
import { folderTemplateSettingsFileName } from "../../utils";

export async function writeToTemplaGenJson(template: FolderTemplate) {
  try {
    const filePath = `${template.path}\\${folderTemplateSettingsFileName}`;

    const fileContents = await fs.readFileSync(filePath, "utf-8");
    let settings = JSON.parse(fileContents) as FolderTemplateSettingsData;

    const paths = await getAllFolderPaths(template.path);
    const dirs: Record<string, string[]> = {};
    for (const folder of paths) {
      dirs[folder] = [];
    }

    const result = Object.assign({}, dirs, flattenDirs(settings.dirs ?? {}));
    settings.dirs = result;

    const newFileContent = JSON.stringify(settings, null, 2);

    await fs.writeFileSync(filePath, newFileContent, "utf8");
  } catch (_) {
    console.log(_);
  }
}

async function getAllFolderPaths(
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

function flattenDirs(dirs: Record<string, string[]>): Record<string, string[]> {
  const flattenDirs: Record<string, string[]> = {};

  for (const item of Object.keys(dirs)) {
    const list: string[] = dirs[item];
    for (const path of list) {
      flattenDirs[`${item}/${path}`] = [];
    }
  }

  return flattenDirs;
}
