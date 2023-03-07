import * as _ from "lodash";
import * as changeCase from "change-case";
import { lstatSync } from "fs";
import { Uri, window } from "vscode";
import {
  keyCaseConvertor,
  promptForSelectedTemplate,
  promptForSubDirName,
  promptForTargetDirectory,
} from "../utils";
import { generateJsonTemplateDirectories, getTemplates } from "../actions";
import {
  TemplateBase,
  JsonTemplate,
  FolderTemplate,
} from "../interfaces/template";
import { generateFolderTemplateDirectories } from "../actions/generate-folder-template-dirs";

export const templateMaker = async (uri: Uri) => {
  const templates: TemplateBase[] = getTemplates();

  const selectedTemplate: TemplateBase | undefined =
    await promptForSelectedTemplate(templates);

  if (!selectedTemplate) {
    window.showErrorMessage("Template must not be empty");
    return;
  }

  let rawSubDirName: string | undefined = "";
  if (selectedTemplate.needSubDir) {
    rawSubDirName = await promptForSubDirName();
    if (_.isNil(rawSubDirName) || rawSubDirName.trim() === "") {
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

  let subDirName = rawSubDirName;
  //TODO depend on subDirCase
  if (selectedTemplate.subDirNameCase) {
    subDirName = keyCaseConvertor(selectedTemplate.subDirNameCase, subDirName);
  }

  try {
    if (selectedTemplate instanceof JsonTemplate) {
      await generateJsonTemplateDirectories(
        subDirName,
        targetDirectory,
        selectedTemplate
      );
    } else if (selectedTemplate instanceof FolderTemplate) {
      await generateFolderTemplateDirectories(
        subDirName,
        targetDirectory,
        selectedTemplate
      );
    }

    window.showInformationMessage(
      `${subDirName} Successfully Generated | Template: ${selectedTemplate.name}`
    );
  } catch (error) {
    window.showErrorMessage(
      `Error:
        ${error instanceof Error ? error.message : JSON.stringify(error)}`
    );
  }
};
