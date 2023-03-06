import * as _ from "lodash";
import * as changeCase from "change-case";
import * as mkdirp from "mkdirp";
import { join } from "path";
import { existsSync, lstatSync } from "fs";
import { Uri, window, workspace } from "vscode";
import {
  promptForSelectedTemplate,
  promptForSubDirName,
  promptForTargetDirectory,
} from "../utils";

export const templateMaker = async (uri: Uri) => {
  const config = workspace.getConfiguration("templagen");
  const templates = config.get("dirTemplates") as Array<Template>;

  const selectedTemplateName = await promptForSelectedTemplate(templates);
  if (_.isNil(selectedTemplateName) || selectedTemplateName.trim() === "") {
    window.showErrorMessage("Template must not be empty");
    return;
  }

  const selectedTemplate: Template = templates.find(
    (template: Template) => template.name === selectedTemplateName
  )!;

  let subDirName: string | undefined = "";
  if (selectedTemplate.needSubDir) {
    subDirName = await promptForSubDirName();
    if (_.isNil(subDirName) || subDirName.trim() === "") {
      window.showErrorMessage("The sub dir name must not be empty");
      return;
    }
  }

  let targetDirectory;
  if (_.isNil(_.get(uri, "fsPath")) || !lstatSync(uri.fsPath).isDirectory()) {
    targetDirectory = await promptForTargetDirectory();
    if (_.isNil(targetDirectory)) {
      window.showErrorMessage("Please select a valid directory");
      return;
    }
  } else {
    targetDirectory = uri.fsPath;
  }

  const snakeCaseSubDirName = changeCase.snakeCase(subDirName);
  try {
    await generateTemplateDirectories(
      snakeCaseSubDirName,
      targetDirectory,
      selectedTemplate
    );
    window.showInformationMessage(
      `${snakeCaseSubDirName} Successfully Generated | Template: ${selectedTemplateName}`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};

async function generateTemplateDirectories(
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

function createDirectory(targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    mkdirp(targetDirectory, (error) => {
      if (error) {
        return reject(error);
      }
      resolve();
    });
  });
}
