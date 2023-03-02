<div align="center">

<img src="https://raw.githubusercontent.com/HasanEltantawy/TemplaGen/assets/icon.png" alt='TemplaGen logo'/>

# TemplaGen

[![version](https://img.shields.io/badge/version-0.0.1-gray.svg)](https://github.com/HasanEltantawy/TemplaGen/)

Configure once create everywhere.

<div align="left">

## How to use?

- Install extension.
- Open vscode settings
- search for `templagen`
- Dir Templates `edit in json`

## How to setup your own template?

- for example:

  ```
  {
    "name": "Flutter Clean Code",
    "needSubDir": true,
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
