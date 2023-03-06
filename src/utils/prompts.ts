import * as _ from "lodash";
import { InputBoxOptions, OpenDialogOptions, window } from "vscode";

export function promptForSelectedTemplate(
  templates: Array<Template>
): Thenable<string | undefined> {
  const names = templates.map((template) => template.name);
  return window.showQuickPick(names);
}

export function promptForSubDirName(): Thenable<string | undefined> {
  const moduleNamePromptOptions: InputBoxOptions = {
    prompt: "SubDir Name",
    placeHolder: "Home",
  };
  return window.showInputBox(moduleNamePromptOptions);
}

export async function promptForTargetDirectory(): Promise<string | undefined> {
  const options: OpenDialogOptions = {
    canSelectMany: false,
    openLabel: "Select a folder to create the Module in",
    canSelectFolders: true,
  };

  return window.showOpenDialog(options).then((uri) => {
    if (_.isNil(uri) || _.isEmpty(uri)) {
      return undefined;
    }
    return uri[0].fsPath;
  });
}
