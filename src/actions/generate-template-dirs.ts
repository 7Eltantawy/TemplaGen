import * as _ from "lodash";
import { join } from "path";
import { existsSync } from "fs";
import { createDirectory } from "./create-dir";

export async function generateTemplateDirectories(
  subDirName: string | undefined,
  targetDir: string,
  template: Template
) {
  const moduleDirectoryPath = template.needSubDir
    ? `${targetDir}/${subDirName}`
    : `${targetDir}`;

  if (!existsSync(moduleDirectoryPath)) {
    await createDirectory(moduleDirectoryPath);
  }

  let dirs = template.dirs;

  if (dirs) {
    for (const [dirName, subDirs] of Object.entries(dirs)) {
      const dirPath = join(moduleDirectoryPath, dirName);

      if (!existsSync(dirPath)) {
        await createDirectory(dirPath);
      }

      for (const subDirName of subDirs) {
        const subDirPath = join(dirPath, subDirName);

        if (!existsSync(subDirPath)) {
          await createDirectory(subDirPath);
        }
      }
    }
  }
}
