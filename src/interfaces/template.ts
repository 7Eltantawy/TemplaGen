export class TemplateBase {
  constructor(
    public name: string,
    public needSubDir?: boolean,
    public subDirNameCase?: string
  ) {}
}

export class FolderTemplate extends TemplateBase {
  constructor(name: string, needSubDir: boolean, public path: string) {
    super(name, needSubDir);
  }
}

export class JsonTemplate extends TemplateBase {
  constructor(
    name: string,
    needSubDir: boolean,
    public dirs: Record<string, string[]>
  ) {
    super(name, needSubDir);
  }

  static fromJson(json: any): JsonTemplate {
    return new JsonTemplate(json.name, json.needSubDir, json.dirs);
  }
}
