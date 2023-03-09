import { window, workspace } from "vscode";
import {
  TemplateBase,
  JsonTemplate,
  FolderTemplate,
  FolderTemplateSettingsData,
} from "../interfaces/template";
import * as fs from "fs";
import {
  configGetDirTemplates,
  folderTemplateSettingsFileName,
  foldersSymbolSepartor,
} from "../utils";
import * as _ from "lodash";
import { readTemplaGenJson } from "./templagen-json-file";
import { getAllFolderPaths } from "../utils/get-folders-paths";
import * as pathUtils from "path";

export async function getTemplates(): Promise<Array<TemplateBase>> {
  let templates: Array<TemplateBase> = [];

  const configTemplates = getTemplatesFromConfigTemplates();
  const templatesFolderPath = await getTemplatesFromTemplatesFolderPath();

  templates = [...configTemplates, ...templatesFolderPath];

  return templates;
}

function getTemplatesFromConfigTemplates(): Array<JsonTemplate> {
  const json = configGetDirTemplates();
  const templates: JsonTemplate[] = json.map((temp) =>
    JsonTemplate.fromJson(temp)
  );

  return templates;
}

export async function getTemplatesFromTemplatesFolderPath(): Promise<
  Array<FolderTemplate>
> {
  let templates: Array<FolderTemplate> = [];

  try {
    const config = workspace.getConfiguration("templagen");
    const templatesPath: string = config.get("templatesFolderPath") as string;
    if (templatesPath) {
      const foldersName = await getFolderNamesInPath(templatesPath);

      templates = foldersName.map((name) => {
        const path: string = pathUtils.join(templatesPath, name);
        const settingFilePath: string = pathUtils.join(
          path,
          folderTemplateSettingsFileName
        );

        const settings: FolderTemplateSettingsData =
          readTemplaGenJson(settingFilePath);

        let templateName: string = name
          .trim()
          .replace(new RegExp("/", "g"), foldersSymbolSepartor);
        if (
          !_.isNil(settings.name) &&
          !_.isEmpty(settings.name) &&
          settings.name.trim()
        ) {
          templateName = settings.name.trim();
        }

        return new FolderTemplate(
          templateName,
          settings.needSubDir,
          settings.subDirNameCase,
          settings.foldersFilesNamesReplacer,
          settings.filesContentReplacer,
          path,
          settings.dirs
        );
      });
    }
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }

  return templates;
}

async function getFolderNamesInPath(path: string): Promise<string[]> {
  const folders = await getAllFolderPaths(path);

  const filteredFolders = folders.filter((dirent) =>
    fs.existsSync(pathUtils.join(path, dirent, folderTemplateSettingsFileName))
  );

  return filteredFolders;
}
