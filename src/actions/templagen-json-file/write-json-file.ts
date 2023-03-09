import {
  FolderTemplate,
  FolderTemplateSettingsData,
} from "../../interfaces/template";
import * as fs from "fs";
import {
  folderTemplateSettingsFileName,
  promptForBooleanCreateTemplateFolderDir,
} from "../../utils";
import { window } from "vscode";
import { createDirectory } from "../dir-generator/create-dir";

export async function writeToTemplaGenJson(template: FolderTemplate) {
  try {
    const filePath = `${template.path}\\${folderTemplateSettingsFileName}`;

    const fileContents = await fs.readFileSync(filePath, "utf-8");
    let settings = JSON.parse(fileContents) as FolderTemplateSettingsData;

    const flattenedSettingsDirs = flattenDirs(settings.dirs ?? {});
    settings.dirs = flattenedSettingsDirs;
    console.log(flattenedSettingsDirs);

    const missedPaths: string[] = [];
    for (const path of Object.keys(flattenedSettingsDirs)) {
      if (!fs.existsSync(`${template.path}\\${path}`)) {
        missedPaths.push(path);
      }
    }

    let createMissied: boolean | undefined;
    if (missedPaths.length > 0) {
      createMissied = (
        await promptForBooleanCreateTemplateFolderDir(missedPaths)
      )?.data;
    }

    if (missedPaths.length > 0) {
      // User Miss
      if (createMissied === undefined) {
        window.showWarningMessage(
          "You choose to miss whether to create missied paths or not this can lead to unexpected behaviour"
        );
      }
      // Create
      else if (createMissied) {
        for (const path of missedPaths) {
          createDirectory(`${template.path}\\${path}`);
        }
      }
      // Remove
      else {
        let filteredFlattenedSettingsDirs: Record<string, string[]> = {};
        for (const path of Object.keys(flattenedSettingsDirs)) {
          if (!missedPaths.includes(path)) {
            filteredFlattenedSettingsDirs[path] = [];
          }
        }
        settings.dirs = filteredFlattenedSettingsDirs;
      }
    }

    const paths = await getAllFolderPaths(template.path);
    const dirs: Record<string, string[]> = {};
    for (const folder of paths) {
      dirs[folder] = [];
    }

    settings.dirs = Object.assign({}, dirs, settings.dirs);
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
    flattenDirs[item] = [];

    const list: string[] = dirs[item];
    for (const path of list) {
      flattenDirs[`${item}/${path}`] = [];
    }
  }

  return flattenDirs;
}
