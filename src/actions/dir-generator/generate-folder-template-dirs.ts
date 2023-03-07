import * as _ from "lodash";
import { existsSync } from "fs";
import { createDirectory } from "./create-dir";
import { FolderTemplate } from "../../interfaces/template";
import ncp = require("ncp");
import path = require("path");
import { folderTemplateSettingsFileName } from "../../utils";
import { processReplacer } from "../replacer/replacer-process";

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
    return path.basename(source) !== folderTemplateSettingsFileName;
  };

  await ncp(
    template.path,
    moduleDirectoryPath,
    { filter: filterFunc },
    async (_) => {
      await processReplacer(subDirName, moduleDirectoryPath, template);
    }
  );

  console.log(template.foldersFilesNamesReplacer);
}
