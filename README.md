<div align="center">

<img src="https://raw.githubusercontent.com/HasanEltantawy/TemplaGen/main/assets/icon.png" alt='TemplaGen logo' height=100/>

# TemplaGen

[![version](https://img.shields.io/badge/version-0.0.3-gray.svg)](https://github.com/HasanEltantawy/TemplaGen/)

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
      "needSubDir": false,
      "subDirNameCase":"snakeCase"
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

- `name` is the name of template to be select when create template

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

- `dirs` the dirs which will be created
  ```
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

## Note

- U can use long path to define folders in folder like:
  - `Fold/01/02/03/04`
  - This will create Directory `Fold` and create `01` in it and create `02` in `01` and so on.

<div align="center">

<img src="https://raw.githubusercontent.com/HasanEltantawy/TemplaGen/main/assets/7t.png" alt='Hassan Eltantawy logo' width="200"/>
