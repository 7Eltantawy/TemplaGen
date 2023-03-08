# v0.0.5

- Change `nameToReplcae` to `nameToReplace`

# v0.0.4

- `[foldersFilesNamesReplacer]`: Define keys in folders and files to be replaced with subDir name or with a name you choose.
  - Available for both `JsonTemplate` and `FolderTemplate`.
- `[filesContentReplacer]`: Define keys inside file content to be replaced with subDir name or with a name you choose.
  - Only available for `FolderTemplate`.

```
  "foldersFilesNamesReplacer": [
    {
      "case": "snakeCase",
      "nameToReplcae": "key",
      "useSubDirName": true
    }
  ],
  "filesContentReplacer": [
    {
      "case": "snakeCase",
      "nameToReplcae": "<{key_sc}>",
      "useSubDirName": true
    },
    {
      "case": "pascalCase",
      "nameToReplcae": "<{key}>",
      "useSubDirName": true
    }
  ]

```

# v0.0.3

- Define path to generate templates from Local folder.

# v0.0.2

- `[BUG FIX]` Not working in production.
  - `extension.template-maker not found`

# v0.0.1

- Initial Version of the Extension.

Configure once create everywhere.
