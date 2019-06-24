+++
title = "Iterative Blueprint Development Guidelines"
description = "Tips and best practices for blueprint agile development"
weight = 95
alwaysopen = false
+++

{{%children style="h2" description="true"%}}

## Overview

A blueprint consists of the following artifacts:

- Main blueprint YAML file. This is the YAML file provided to the "cfy blueprints upload" command.
- Additional YAML file, imported (directly or indirectly) by the main blueprint YAML file via the import statement.
- Resource files, such as scripts, configuration files and so forth.

During the blueprint development lifecycle, often there is a need to:

- Modify blueprint files
- Resume failed executions
- Run arbitrary operations


## The Deployment Update Feature

Cloudify Manager provides a feature called Deployment Update, which provides a feature-rich, comprehensive solution to the challenge of updating existing blueprints. To learn more check the [Cloudify documentation page](https://docs.cloudify.co/4.6/working_with/manager/update-deployment/)

While more complicated than the approaches described in this document, it is the recommended approach to take in production environments as it is more structured, provides for rollback, and avoids the need to deal with Cloudify Manager's file system.

## Development Environment

While it is possible to develop blueprints on a standard Cloudify Manager installation, it may be easier to use Cloudify's official Docker image. A "Getting Started" guide, demonstrating how to initialize a Docker-based environment, is available on [Cloudify's official site](https://cloudify.co/getting-started/#local)

## Modifying Blueprint Files

> Note: At the moment, only the modification of resource files is supported for rapid development (that is: the ability to modify a blueprint without having to teardown its deployments).

All blueprint files are located in the following directory on Cloudify Manager:

/opt/manager/resources/blueprints/<tenant-name>/<blueprint-name>

For example, the files for a blueprint called test-blueprint on the default tenant will be located in:

/opt/manager/resources/blueprints/default_tenant/test-blueprint


## Resuming Failed Executions

A typical use case is the desire to resume an execution of the "install" workflow, after the original execution failed.

This can be done by using the "cfy executions resume" command:

cfy executions resume <execution-id>

## Running Arbitrary Operations

This is possible to do by using the "execute_operation" workflow.

Full documentation is available [here](https://docs.cloudify.co/4.6/working_with/workflows/built-in-workflows/#the-execute-operation-workflow)

For example, running an operation called "test" in an interface called "day2.operations" on a node called "server":

`cfy executions start execute_operation -d deployment_1 -p operation=day2.operations.test -p node_ids=[server]`

****************************

## Examples

Consider the following blueprint YAML:

```
node_templates:
  server:
    type: cloudify.openstack.nodes.Server
  app:
    type: cloudify.nodes.SoftwareComponent
    interfaces:
      cloudify.interfaces.lifecycle:
        create: scripts/create.sh
      day2.operations:
        update: scripts/update.sh
    relationships:
      - target: server
        type: cloudify.relationships.contained_in
```

And the following script located in scripts/create.sh:

```
#!/bin/bash -e

exit 1
```

And the following script located in scripts/update.sh:

```
#!/bin/bash -e
ctx logger info "Updating"
```

The blueprint is then uploaded, a deployment created, and the install workflow invoked:

```
cfy blueprints upload ~/test/blueprint.yaml -b test_bp
cfy deployments create test_dep -b test_bp
cfy executions start install -d test_dep
```

When running the install workflow, a VM will be created (for the server node template), but the execution will eventually fail due to scripts/create.sh failing.

Instead of uninstalling the deployment, uninstalling the blueprint and repeating the install workflow, one could SSH into Cloudify Manager and modify the script in-place:

```cd /opt/manager/resources/blueprints/default_tenant/test_bp
vi scripts/create.sh
# Fix the script so it doesn't return exit code "1"
```

Then, the install execution can be resumed:

```
cfy executions list -d test_dep

# Obtain the "install" execution ID. For example: cwvx7632-s3vmjkv2-b387dfhd

cfy executions resume cwvx7632-s3vmjkv2-b387dfhd
```

This command will resume the install execution from the point it previously failed. The corrected script will be used thereafter.

Next, run the day-2 operation defined in the blueprint:

```
cfy executions start execute_operation -d test_dep -p operation=day2.operations.update -p node_ids=[app]
```

This command will run the update operation in the day2.operations interface, on the node template called app.






Modifying resource files in that directory will result in the changed files taking effect immediately.
