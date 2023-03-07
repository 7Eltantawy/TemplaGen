import * as _ from "lodash";
import { existsSync } from "fs";
import { createDirectory } from "./create-dir";
import { FolderTemplate } from "../interfaces/template";
import ncp = require("ncp");
import path = require("path");

export async function generateFolderTemplateDirectories(
  subDirName: string | undefined,
  targetDir: string,
  template: FolderTemplate
) {
  const moduleDirectoryPath = template.needSubDir
    ? `${targetDir}/${subDirName}`
    : `${targetDir}`;

  if (!existsSync(moduleDirectoryPath)) {
    await createDirectory(moduleDirectoryPath);
  }

  const filterFunc = (source: string): boolean => {
    return path.basename(source) !== "templagen.json";
  };

  ncp(template.path, moduleDirectoryPath, { filter: filterFunc }, (_) => {});
}
