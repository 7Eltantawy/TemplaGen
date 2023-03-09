import * as _ from "lodash";
import {
  FolderTemplate,
  ReplacerBody,
  TemplateBase,
} from "../../interfaces/template";
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
        replaceWith = (await promptForReplacerName(item.nameToReplace)) ?? "";
      }

      if (replaceWith && item.case) {
        replaceWith = keyCaseConvertor(item.case, replaceWith);
      }

      await renameFilesAndFolders(
        moduleDirectoryPath,
        item.nameToReplace,
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
    const replacers: ReplacerBody[] = [];

    for (const item of template.filesContentReplacer) {
      let replaceWith = "";
      if (item.useSubDirName && template.needSubDir) {
        replaceWith = subDirName ?? "";
      } else {
        replaceWith = (await promptForReplacerName(item.nameToReplace)) ?? "";
      }

      if (replaceWith && item.case) {
        replaceWith = keyCaseConvertor(item.case, replaceWith);
      }

      replacers.push({
        nameToReplace: item.nameToReplace,
        replaceWith: replaceWith,
      });
    }

    await renameFilesContent(moduleDirectoryPath, replacers);
  }
}
