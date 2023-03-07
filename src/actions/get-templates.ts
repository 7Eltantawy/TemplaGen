import { window, workspace } from "vscode";
import {
  TemplateBase,
  JsonTemplate,
  FolderTemplate,
} from "../interfaces/template";
import * as fs from "fs";

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

      templates = foldersName.map(
        (name) => new FolderTemplate(name, false, `${templatesPath}\\${name}`)
      );
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
      fs.existsSync(`${path}\\${dirent.name}\\templagen.json`)
    )
    .map((dirent) => dirent.name);
  return folders;
}
