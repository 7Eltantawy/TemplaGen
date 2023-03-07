export class TemplateBase {
  constructor(
    public name: string,
    public needSubDir: boolean | undefined,
    public subDirNameCase: string | undefined
  ) {}
}

export class FolderTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean | undefined,
    subDirNameCase: string | undefined,
    public path: string
  ) {
    super(name, needSubDir, subDirNameCase);
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
