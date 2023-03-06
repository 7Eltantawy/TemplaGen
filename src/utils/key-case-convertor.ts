import * as changeCase from "change-case";

export function keyCaseConvertor(keyCase: string, value: string): string {
  switch (keyCase) {
    case "camelCase":
      return changeCase.camelCase(value);
    case "capitalCase":
      return changeCase.capitalCase(value);
    case "constantCase":
      return changeCase.constantCase(value);
    case "dotCase":
      return changeCase.dotCase(value);
    case "noCase":
      return changeCase.noCase(value);
    case "paramCase":
      return changeCase.paramCase(value);
    case "pascalCase":
      return changeCase.pascalCase(value);
    case "pathCase":
      return changeCase.pathCase(value);
    case "sentenceCase":
      return changeCase.sentenceCase(value);
    case "snakeCase":
      return changeCase.snakeCase(value);

    default:
      return value;
  }
}
