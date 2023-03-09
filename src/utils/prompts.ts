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

type QuickPickItemCustom<T> = QuickPickItem & {
  data: T;
};

export async function promptForSelectedTemplate(
  templates: Array<TemplateBase>
): Promise<TemplateBase | undefined> {
  const data: QuickPickItemCustom<TemplateBase> | undefined =
    await promptForSelected(templates);

  return data?.data;
}

function promptForSelected(
  templates: Array<TemplateBase>
): Thenable<QuickPickItemCustom<TemplateBase> | undefined> {
  const items: QuickPickItemCustom<TemplateBase>[] = templates.map(
    (template) => {
      const item: QuickPickItemCustom<TemplateBase> = {
        label: template.name,
        data: template,
        detail: detailMaker(template),
      };
      return item;
    }
  );

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

export function promptForBooleanCreateTemplateFolderDir(
  missedPath: string[]
): Thenable<QuickPickItemCustom<boolean> | undefined> {
  const items: QuickPickItemCustom<boolean>[] = [
    {
      label: "Create the missing folders",
      data: true,
      detail:
        "All missied paths defined in templagen.json dirs will be created.",
    },
    {
      label: "Remove missied paths from templagen.json",
      data: false,
      detail:
        "All missing paths defined in templagen.json dirs will be removed.",
    },
  ];

  return window.showQuickPick(items, {
    title: "There are paths defined in templagen.json dirs which not exsit",
    placeHolder: "Missied Paths: " + missedPath.join(" | "),
    matchOnDescription: true,
  });
}
