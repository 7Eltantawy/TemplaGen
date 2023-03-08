import { RelativePattern, workspace } from "vscode";

import * as fs from "fs";
import { ReplacerBody } from "../../interfaces/template";

export async function renameFilesContent(
  rootPath: string,
  replacers: ReplacerBody[]
): Promise<void> {
  const files = await workspace.findFiles(
    new RelativePattern(rootPath, "**/*")
  );

  for (const fileUri of files) {
    let fileContents = await fs.readFileSync(fileUri.fsPath, "utf8");

    for (const replacer of replacers) {
      fileContents = fileContents.replace(
        RegExp(replacer.nameToReplace, "g"),
        replacer.replaceWith
      );
    }

    await fs.writeFileSync(fileUri.fsPath, fileContents, "utf8");
  }
}
