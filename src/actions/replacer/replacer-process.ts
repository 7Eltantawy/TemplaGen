import * as _ from "lodash";
import { FolderTemplate, TemplateBase } from "../../interfaces/template";
import { keyCaseConvertor, promptForReplacerName } from "../../utils";
import { renameFilesContent } from "./rename-files-content";
import { renameFilesAndFolders } from "./rename-Files-Folders";

export async function processReplacer(
  subDirName: string | undefined,
  moduleDirectoryPath: string,
  template: FolderTemplate
) {
  if (template.foldersFilesNamesReplacer) {
    await processFolderFilesNames(subDirName, moduleDirectoryPath, template);
  }
  if (template.filesContentReplacer) {
    await processFilesContentNames(subDirName, moduleDirectoryPath, template);
  }
}

export async function processFolderFilesNames(
  subDirName: string | undefined,
  moduleDirectoryPath: string,
  template: TemplateBase
) {
  if (template.foldersFilesNamesReplacer) {
    await template.foldersFilesNamesReplacer.forEach(async (item) => {
      let replaceWith: string = "";

      if (item.useSubDirName && template.needSubDir) {
        replaceWith = subDirName ?? "";
      } else {
        replaceWith = (await promptForReplacerName(item.nameToReplcae)) ?? "";
      }

      if (replaceWith && item.case) {
        replaceWith = keyCaseConvertor(item.case, replaceWith);
      }

      await renameFilesAndFolders(
        moduleDirectoryPath,
        item.nameToReplcae,
        replaceWith
      );
    });
  }
}

async function processFilesContentNames(
  subDirName: string | undefined,
  moduleDirectoryPath: string,
  template: FolderTemplate
) {
  if (template.filesContentReplacer) {
    for (const item of template.filesContentReplacer) {
      let replaceWith = "";
      if (item.useSubDirName && template.needSubDir) {
        replaceWith = subDirName ?? "";
      } else {
        replaceWith = (await promptForReplacerName(item.nameToReplcae)) ?? "";
      }

      if (replaceWith && item.case) {
        replaceWith = keyCaseConvertor(item.case, replaceWith);
      }

      await renameFilesContent(
        moduleDirectoryPath,
        item.nameToReplcae,
        replaceWith
      );
    }
  }
}
