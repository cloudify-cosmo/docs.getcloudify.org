---
layout: bt_wiki
title: Custom Workflow Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# {{< param product_name >}} Utilities: Custom-workflow

## Description
The custom workflow utility allows you to run list of action as separate
workflow.

## The plugin supports:

Plugin supports `cloudify_custom_workflow.cloudify_custom_workflow.tasks.customwf`
workflow with such parameters:
 * `nodes_to_runon`: List of node names for run action on.
 * `operations_to_execute`: List action names for run.

## Steps for writing custom workflow

### define actions in the nodes

For example on this node we defined two actions "sync_config" and "backup_config" with implementations.
```yaml
  CPE_A:
    type: cloudify.nodes.ApplicationModule
    relationships:
    - type: cloudify.relationships.contained_in
      target: fake_node
    interfaces:
      custom:
        sync_config:
          implementation: cpe_sync_config.txt
        backup_config:
          implementation: cpe_backup_config.txt
```

### define the workflow:

```yaml
workflows:
  BackupFlow:
    mapping: cloudify_custom_workflow.cloudify_custom_workflow.tasks.customwf
    parameters:
      nodes_to_runon:
        default:
          - router
          - CPE_A
      operations_to_execute:
        default:
          - custom.sync_config
          - custom.backup_config
```
Here, a BackupFlow workflow defined, when executing the workflow it will execute sync_config, backup_config actions on router, CPE_A nodes.

For examples, see [custom workflow examples](https://github.com/cloudify-community/blueprint-examples/tree/master/utilities-examples/cloudify_custom_workflow).
