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
import {
  configGetShowTemplatesGrouped,
  configGetTemplatesFolderPath,
} from "./config";
// import { foldersSymbolSepartor } from "./constance";
import * as pathUtils from "path";

type QuickPickItemCustom<T> = QuickPickItem & {
  data: T;
  groupName?: string;
};

export async function promptForSelectedTemplate(
  templates: Array<TemplateBase>
): Promise<TemplateBase | undefined> {
  if (configGetShowTemplatesGrouped()) {
    try {
      const data: QuickPickItemCustom<TemplateBase> | undefined =
        await promptForSelectedGroupedList(templates);

      return data?.data;
    } catch (_) {
      console.log(_);
    }
  } else {
    const data: QuickPickItemCustom<TemplateBase> | undefined =
      await promptForSelectedSeparetedList(templates);

    return data?.data;
  }
}

function promptForSelectedSeparetedList(
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

async function promptForSelectedGroupedList(
  templates: Array<TemplateBase>,
  currentFolder?: string
): Promise<QuickPickItemCustom<TemplateBase> | undefined> {
  const grouped: Record<string, TemplateBase[]> = {};

  // Group
  templates.map((template) => {
    if (template instanceof FolderTemplate) {
      let relativeTo = configGetTemplatesFolderPath();

      if (currentFolder) {
        relativeTo = currentFolder;
      }

      const real = pathUtils.relative(relativeTo, template.path);
      const splitted = real.split("\\");

      if (splitted.length > 0) {
        const keyExist = Object.keys(grouped).includes(splitted[0]);
        if (keyExist) {
          grouped[splitted[0]].push(template);
        } else {
          grouped[splitted[0]] = [];
          grouped[splitted[0]].push(template);
        }
      } else {
        grouped[template.name] = [];
      }
    } else if (template instanceof JsonTemplate) {
      grouped[template.name] = [template];
    }
  });

  // Generate items
  const items: QuickPickItemCustom<TemplateBase | TemplateBase[]>[] =
    Object.keys(grouped).map((groupName) => {
      const templatesList: TemplateBase[] = grouped[groupName];
      if (templatesList.length > 1) {
        const item: QuickPickItemCustom<TemplateBase | TemplateBase[]> = {
          label: groupName,
          data: templatesList,
          detail: "Group",
          groupName: groupName,
        };
        return item;
      } else {
        const item: QuickPickItemCustom<TemplateBase> = {
          label: templatesList[0].name,
          data: templatesList[0],
          detail: detailMaker(templatesList[0]),
        };
        return item;
      }
    });

  // Await for result
  const result: QuickPickItemCustom<TemplateBase | TemplateBase[]> | undefined =
    await window.showQuickPick(items, {
      placeHolder: "Select template",
      matchOnDescription: true,
      title: "Pick template to start",
    });

  // Check result
  if (result === undefined) {
    return;
  } else if (result.data instanceof TemplateBase) {
    return result as QuickPickItemCustom<TemplateBase>;
  } else if (
    Array.isArray(result.data) &&
    result.data.every((item) => item instanceof TemplateBase)
  ) {
    if (_.isNil(currentFolder)) {
      return promptForSelectedGroupedList(
        result.data,
        pathUtils.join(configGetTemplatesFolderPath(), result.groupName ?? "")
      );
    } else {
      return promptForSelectedGroupedList(
        result.data,
        pathUtils.join(currentFolder!, result.groupName!)
      );
    }
  }
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
