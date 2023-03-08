<div align="center">

<img src="https://raw.githubusercontent.com/HasanEltantawy/TemplaGen/main/assets/icon.png" alt='TemplaGen logo' height=100/>

# TemplaGen

[![version](https://img.shields.io/badge/version-0.0.4-gray.svg)](https://github.com/HasanEltantawy/TemplaGen/)

Configure once create everywhere.

<div align="left">

## How to use?

- Install extension.
- Right click on any folder slecet `TemplaGen | Template Maker`.
  - U can also write `TemplaGen | Template Maker` in command plaettte.
  - Then select the path u want the template to be in.
- Select template u want for example `Flutter clean code`.
- You're done.

## How to setup your own template?

### Folder way

- First
  - Create Folder for templates anywhere on your device.
  - Copy its path.
  - Open vscode settings
  - search for `templagen`
  - Look for `templatesFolderPath` and paste path in it.
- Second

  - Create new Folder with any name you want.
  - Make `templagen.json` inside the Folder
  - ```
        {
          "needSubDir": true,
          "subDirNameCase": "snakeCase",
          "foldersFilesNamesReplacer": [
            {
              "case": "snakeCase",
              "nameToReplace": "key",
              "useSubDirName": true
            }
          ],
          "filesContentReplacer": [
            {
              "case": "snakeCase",
              "nameToReplace": "<{key_sc}>",
              "useSubDirName": true
            },
            {
              "case": "pascalCase",
              "nameToReplace": "<{key}>",
              "useSubDirName": true
            }
          ]
        }

    ```

  - Create any folders or files in the folder as you like.

### Json way

- Open vscode settings
- search for `templagen`
- Dir Templates `edit in settings.json`
- for example:

  ```
  {
    "name": "Flutter Clean Code",
    "needSubDir": true,
    "subDirNameCase": "snakeCase",
    "dirs": {
      "data": [
        "data_source",
        "models",
        "repository"
      ],
      "domain": [
        "entities",
        "use_cases",
        "repository"
      ],
      "presentation": [
        "components",
        "controller",
        "screens"
      ]
    }
  }
  ```

The output dir will be like

```
|- <subDirName>
    |- data
    |  |- data_source
    |  |- models
    |  |- repository
    |- domain
    |  |- entities
    |  |- use_cases
    |  |- repository
    |- presentation
    |  |- components
    |  |- controller
    |  |- screens
```

## Docs

- `name` is the name of template to be select when create template

  - `JsonTemplate` only

  ```
  "name": "Flutter Clean Code"
  ```

- `needSubDir` check wheter the template directories required subDir to created in or not.

  - if `true` you'll be asked for subDir name.
  - if `false` the dirs will be created directly.

  ```
  "needSubDir": true,

  ```

- `subDirNameCase` the name case you want

  ```
  "needSubDir": "snakeCase",
  ```

- `foldersFilesNamesReplacer` define keys in dirs and files name to be replaced later

  - `FolderTemplate` only

  ```
       {
         "foldersFilesNamesReplacer": [
           {
             "case": "snakeCase",
             "nameToReplace": "key",
             "useSubDirName": true
           }
         ]
       }

  ```

- `filesContentReplacer` define keys inside files content to be replaced later

  - `FolderTemplate` only

  ```
       {
         "filesContentReplacer": [
           {
             "case": "snakeCase",
             "nameToReplace": "<{key_sc}>",
             "useSubDirName": true
           },
           {
             "case": "pascalCase",
             "nameToReplace": "<{key}>",
             "useSubDirName": true
           }
         ]
       }

  ```

- `dirs` the dirs which will be created

  - `JsonTemplate` only
  - U can use long path to define folders in folder like:
    - `Fold/01/02/03/04`
    - This will create Directory `Fold` and create `01` in it and create `02` in `01` and so on.

  ```
    "dirs": {
      "data": [
        "data_source",
        "models",
        "repository"
      ]
    }
  ```

### Replacer schema

- `case`the case of the name to replace `nameToReplace` with.
- `nameToReplace`the key you define to be replaced.
- `useSubDirName` choose wheter to use the `subDirName` or not
  - if set to `false` or `needSubDir` set to false you will be asked to enter a name to replace the key with

```
  {
    "case": "snakeCase",
    "nameToReplace": "<{key_sc}>",
    "useSubDirName": true
  },
```

## Available cases

- `camelCase`
- `capitalCase`
- `constantCase`
- `dotCase`
- `headerCase`
- `noCase`
- `paramCase`
- `pascalCase`
- `pathCase`
- `sentenceCase`
- `snakeCase`

<div align="center">

<img src="https://raw.githubusercontent.com/HasanEltantawy/TemplaGen/main/assets/7t.png" alt='Hassan Eltantawy logo' width="200"/>
