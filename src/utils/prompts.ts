import * as _ from "lodash";
import {
  InputBoxOptions,
  OpenDialogOptions,
  QuickPickItem,
  window,
} from "vscode";
import {
  TemplateBase,
  JsonTemplate,
  FolderTemplate,
} from "../interfaces/template";

type QuickPickItemCustom = QuickPickItem & {
  data: TemplateBase;
};

export async function promptForSelectedTemplate(
  templates: Array<TemplateBase>
): Promise<TemplateBase | undefined> {
  const data: QuickPickItemCustom | undefined = await promptForSelected(
    templates
  );

  return data?.data;
}

function promptForSelected(
  templates: Array<TemplateBase>
): Thenable<QuickPickItemCustom | undefined> {
  const items: QuickPickItemCustom[] = templates.map((template) => {
    const item: QuickPickItemCustom = {
      label: template.name,
      data: template,
      detail: detailMaker(template),
    };
    return item;
  });

  return window.showQuickPick(items, {
    placeHolder: "Select template",
    matchOnDescription: true,
    title: "Pick template to start",
  });
}

function detailMaker(template: TemplateBase): string {
  if (template instanceof JsonTemplate) {
    return "JSON";
  } else if (template instanceof FolderTemplate) {
    return `FOLDER | ${template.path}`;
  }
  return "";
}

export function promptForSubDirName(): Thenable<string | undefined> {
  const moduleNamePromptOptions: InputBoxOptions = {
    title: "Write a name for SubDir folder",
    prompt: "SubDir Name",
    placeHolder: "Home",
  };
  return window.showInputBox(moduleNamePromptOptions);
}

export function promptForReplacerName(
  nameToReplace: string
): Thenable<string | undefined> {
  const moduleNamePromptOptions: InputBoxOptions = {
    title: `Write a name to replace ${nameToReplace}`,
    prompt: `Replace ${nameToReplace} with`,
    placeHolder: nameToReplace,
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
