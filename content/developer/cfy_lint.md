+++
title = "CFY-Lint CLI"
description = "A blueprint linter for identifying and fixing stylistic and syntactical DSL issues."
weight = 80
alwaysopen = false
+++

## About CFY-Lint

CFY-Lint is a command line tool that can identify and fix stylistic and syntactical issues in {{< param product_name >}} blueprints, for example:

 - YAML stylistic conventions
 - {{< param product_name >}} DSL conventions
 - Deprecated node types and relationship types
 - Unimported node types and relationship types
 - Node and relationship dependencies
 - Un-typed inputs
 - Incorrect usage

## Installing the CFY-Lint CLI

CFY-Lint can be installed using pip:

```bash
pip install cfy-lint
```

## Usage

```bash
Usage: cfy-lint [OPTIONS]

Options:
  -b, --blueprint-path PATH     Path to the blueprint file that you want to
                                lint.  [default: (blueprint.yaml)]

  -c, --config PATH             ability to use configuration file or options.
  -v, --verbose                 show full verbose logs
  -f, --format TEXT             toggle format, options empty or "json".
  -xs, --skip-suggestions TEXT  Remove suggested values for supported
                                sections.

  -af, --autofix                Fix changes in place.
  --help                        Show this message and exit.
```

## Blueprint Path

```bash
-b, --blueprint-path
```

Provide the relative or absolute path to a {{< param product_name >}} DSL file, such as a blueprint or a plugin YAML.

__NOTE:__ The `CWD` must be the same directory as the file, if you want to use relative imports to other YAML files.

## Config

```bash
-c, --config
```

Provide a YAMLLint config file to disable specific rules, such as `indentation` or `truthy-ness`.

## Verbosity

```bash
-v, --verbose
```

By default, we suppress the error trace stack when Python exceptions are raised and provide only the error message. Verbosity provides the full error stack trace.

## Format

```bash
-f, --format
```

By default, format is line-by-line standard logger format. Toggle ```-f=json``` in order to consume linting messages in JSON format.

## Skip Suggestions

```bash
-xs, --skip-suggestions
```

CFY-Lint will sometimes attempt to suggest a solution. These solutions are not always applicable. For example, CFY-Lint might suggest to provide a `type: boolean` for  an input if the default value is `True`. However, perhaps you intended that this will be a string.

## Autofix

```bash
-af, --autofix
```

CFY-Lint can fix certain issues during linting. This is turned off by default.

