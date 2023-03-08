import { window, workspace } from "vscode";
import {
  TemplateBase,
  JsonTemplate,
  FolderTemplate,
  Replacer,
} from "../interfaces/template";
import * as fs from "fs";
import { folderTemplateSettingsFileName } from "../utils";
import * as _ from "lodash";

export function getTemplates(): Array<TemplateBase> {
  let templates: Array<TemplateBase> = [];

  const configTemplates = getTemplatesFromConfigTemplates();
  const templatesFolderPath = getTemplatesFromTemplatesFolderPath();

  templates = [...configTemplates, ...templatesFolderPath];

  return templates;
}

function getTemplatesFromConfigTemplates(): Array<JsonTemplate> {
  const config = workspace.getConfiguration("templagen");

  const json = config.get("dirTemplates") as [];
  const templates: JsonTemplate[] = json.map((temp) =>
    JsonTemplate.fromJson(temp)
  );

  return templates;
}

function getTemplatesFromTemplatesFolderPath(): Array<FolderTemplate> {
  let templates: Array<FolderTemplate> = [];

  try {
    const config = workspace.getConfiguration("templagen");
    const templatesPath: string = config.get("templatesFolderPath") as string;
    if (templatesPath) {
      const foldersName = getFolderNamesInPath(templatesPath);

      templates = foldersName.map((name) => {
        const path: string = `${templatesPath}\\${name}`;
        const settingFilePath: string = `${path}\\${folderTemplateSettingsFileName}`;

        const settings: SettingsData = getTemplateSettings(settingFilePath);

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
          path
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

type SettingsData = {
  name?: string | undefined;
  needSubDir: boolean | undefined;
  subDirNameCase: string | undefined;
  foldersFilesNamesReplacer?: Replacer[] | undefined;
  filesContentReplacer?: Replacer[] | undefined;
};

function getTemplateSettings(path: string): SettingsData {
  const dummy = {
    needSubDir: false,
    subDirNameCase: "",
  };
  try {
    const fileContents = fs.readFileSync(path, "utf8");
    if (fileContents) {
      const data = JSON.parse(fileContents) as SettingsData;
      return data;
    }
    return dummy;
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
    return dummy;
  }
}
