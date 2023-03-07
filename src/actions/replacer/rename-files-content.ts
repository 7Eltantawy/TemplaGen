import { RelativePattern, workspace } from "vscode";

import * as fs from "fs";

export async function renameFilesContent(
  rootPath: string,
  nameToReplace: string,
  replaceWith: string
): Promise<void> {
  const files = await workspace.findFiles(
    new RelativePattern(rootPath, "**/*")
  );

  const searchPromises = files.map(async (fileUri) => {
    const document = await workspace.openTextDocument(fileUri);
    let text = document.getText();
    text = text.replace(new RegExp(nameToReplace, "g"), replaceWith);
    return fs.writeFileSync(fileUri.fsPath, text);
  });

  await Promise.all(searchPromises || []);
}
