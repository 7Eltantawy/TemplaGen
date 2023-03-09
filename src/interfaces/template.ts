export class TemplateBase {
  constructor(
    public name: string,
    public needSubDir: boolean | undefined,
    public subDirNameCase: string | undefined,
    public foldersFilesNamesReplacer: Replacer[] | undefined,
    public dirs: Record<string, string[]> | undefined
  ) {}
}

export class FolderTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean | undefined,
    subDirNameCase: string | undefined,
    foldersFilesNamesReplacer: Replacer[] | undefined,
    public filesContentReplacer: Replacer[] | undefined,
    public path: string,
    dirs: Record<string, string[]> | undefined
  ) {
    super(name, needSubDir, subDirNameCase, foldersFilesNamesReplacer, dirs);
  }
}

export class JsonTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean | undefined,
    subDirNameCase: string | undefined,
    foldersFilesNamesReplacer: Replacer[] | undefined,
    dirs: Record<string, string[]>
  ) {
    super(name, needSubDir, subDirNameCase, foldersFilesNamesReplacer, dirs);
  }

  static fromJson(json: any): JsonTemplate {
    return new JsonTemplate(
      json.name,
      json.needSubDir,
      json.subDirNameCase,
      json.foldersFilesNamesReplacer,
      json.dirs
    );
  }
}

export interface Replacer {
  case?: string | undefined;
  nameToReplace: string;
  useSubDirName?: boolean | undefined;
}

export interface ReplacerBody {
  nameToReplace: string;
  replaceWith: string;
}

export type FolderTemplateSettingsData = {
  name?: string | undefined;
  needSubDir: boolean | undefined;
  subDirNameCase: string | undefined;
  foldersFilesNamesReplacer?: Replacer[] | undefined;
  filesContentReplacer?: Replacer[] | undefined;
  dirs?: Record<string, string[]> | undefined;
};
