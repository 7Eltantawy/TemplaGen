import { window } from "vscode";
import { FolderTemplateSettingsData } from "../../interfaces/template";
import * as fs from "fs";
import * as _ from "lodash";

export function readTemplaGenJson(path: string): FolderTemplateSettingsData {
  const dummy = {
    needSubDir: false,
    subDirNameCase: "",
  };
  try {
    const fileContents = fs.readFileSync(path, "utf8");
    if (fileContents) {
      const data = JSON.parse(fileContents) as FolderTemplateSettingsData;
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
