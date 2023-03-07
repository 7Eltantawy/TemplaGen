export class TemplateBase {
  constructor(
    public name: string,
    public needSubDir: boolean | undefined,
    public subDirNameCase: string | undefined,
    public foldersFilesNamesReplacer?: Replacer[] | undefined
  ) {}
}

export class FolderTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean | undefined,
    subDirNameCase: string | undefined,
    foldersFilesNamesReplacer: Replacer[] | undefined,
    public path: string
  ) {
    super(name, needSubDir, subDirNameCase, foldersFilesNamesReplacer);
  }
}

export class JsonTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean | undefined,
    subDirNameCase: string | undefined,
    public dirs: Record<string, string[]>
  ) {
    super(name, needSubDir, subDirNameCase);
  }

  static fromJson(json: any): JsonTemplate {
    return new JsonTemplate(
      json.name,
      json.needSubDir,
      json.subDirNameCase,
      json.dirs
    );
  }
}

export interface Replacer {
  case?: string | undefined;
  nameToReplcae: string;
  useSubDirName?: boolean | undefined;
}
