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
} from "../utils";
import * as _ from "lodash";
import { readTemplaGenJson } from "./templagen-json-file";

export function getTemplates(): Array<TemplateBase> {
  let templates: Array<TemplateBase> = [];

  const configTemplates = getTemplatesFromConfigTemplates();
  const templatesFolderPath = getTemplatesFromTemplatesFolderPath();

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

export function getTemplatesFromTemplatesFolderPath(): Array<FolderTemplate> {
  let templates: Array<FolderTemplate> = [];

  try {
    const config = workspace.getConfiguration("templagen");
    const templatesPath: string = config.get("templatesFolderPath") as string;
    if (templatesPath) {
      const foldersName = getFolderNamesInPath(templatesPath);

      templates = foldersName.map((name) => {
        const path: string = `${templatesPath}\\${name}`;
        const settingFilePath: string = `${path}\\${folderTemplateSettingsFileName}`;

        const settings: FolderTemplateSettingsData =
          readTemplaGenJson(settingFilePath);

        let templateName: string = name.trim();
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

function getFolderNamesInPath(path: string): string[] {
  // TODO Imp nested folders
  // Search all paths in folder until get templagen.json
  // Return Name as [Path | SubPath | ... | Template Name]
  const folders = fs
    .readdirSync(path, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) =>
      fs.existsSync(
        `${path}\\${dirent.name}\\${folderTemplateSettingsFileName}`
      )
    )
    .map((dirent) => dirent.name);
  return folders;
}
