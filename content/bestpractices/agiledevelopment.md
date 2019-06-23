+++
title = "Iterative Blueprint Development Guidelines"
description = "Tips and best practices for blueprint agile development"
weight = 95
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Iterative Blueprint Development Guidelines

A blueprint consists of the following artifacts:

- Main blueprint YAML file. This is the YAML file provided to the "cfy blueprints upload" command.
- Additional YAML file, imported (directly or indirectly) by the main blueprint YAML file via the import statement.
- Resource files, such as scripts, configuration files and so forth.

During the blueprint development lifecycle, often there is a need to:

- Modify blueprint files
- Resume failed executions
- Run arbitrary operations
