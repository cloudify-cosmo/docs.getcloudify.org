---
title: Dry Run Workflow Execution
category: Workflows
draft: false
abstract: Explanation of running workflows without side effects
weight: 550


types_yaml_link: reference-types.html

default_workflows_source_link: https://github.com/cloudify-cosmo/cloudify-common/blob/5.0.0/cloudify/plugins/workflows.py
---
## Overview

In a dry-run execution, you can execute a workflow so that the entire flow of the execution (all the operations that are executed in an actual run) is shown, but no actual code is executed and there are no side effects.

A dry-run is useful in the process when you write complex blueprints with potentially long executions. The dry-run helps you to configure relationships between node templates, and operations that depend on those relationships.

## Example

For example, the output of a dry-run of the
[hello world](https://github.com/cloudify-cosmo/cloudify-hello-world-example/blob/master/singlehost-blueprint.yaml)
blueprint is:

```
(cloudify) ➜  ~ cfy executions start install -d dep --dry-run
Executing workflow install on deployment dep [timeout=900 seconds]
2018-03-18 07:25:18.059  CFY <dep> Starting 'install' workflow execution (dry run)
2018-03-18 07:25:18.672  CFY <dep> [vm_xu6d4u] Creating node
2018-03-18 07:25:19.678  CFY <dep> [vm_xu6d4u] Configuring node
2018-03-18 07:25:19.678  CFY <dep> [vm_xu6d4u] Starting node
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u] Creating Agent
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.create] Sending task 'cloudify_agent.installer.operations.create'
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.create] Task started 'cloudify_agent.installer.operations.create'
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.create] Task succeeded 'cloudify_agent.installer.operations.create (dry run)'
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.install] Sending task 'diamond_agent.tasks.install'
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.install] Task started 'diamond_agent.tasks.install'
2018-03-18 07:25:20.694  CFY <dep> [vm_xu6d4u.install] Task succeeded 'diamond_agent.tasks.install (dry run)'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Sending task 'diamond_agent.tasks.start'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Task started 'diamond_agent.tasks.start'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Task succeeded 'diamond_agent.tasks.start (dry run)'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Sending task 'diamond_agent.tasks.add_collectors'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Task started 'diamond_agent.tasks.add_collectors'
2018-03-18 07:25:21.698  CFY <dep> [vm_xu6d4u.start] Task succeeded 'diamond_agent.tasks.add_collectors (dry run)'
2018-03-18 07:25:22.703  CFY <dep> [http_web_server_mb2qu9] Creating node
2018-03-18 07:25:23.722  CFY <dep> [http_web_server_mb2qu9] Configuring node
2018-03-18 07:25:23.722  CFY <dep> [http_web_server_mb2qu9.configure] Sending task 'script_runner.tasks.run'
2018-03-18 07:25:23.722  CFY <dep> [http_web_server_mb2qu9.configure] Task started 'script_runner.tasks.run'
2018-03-18 07:25:23.722  CFY <dep> [http_web_server_mb2qu9.configure] Task succeeded 'script_runner.tasks.run (dry run)'
2018-03-18 07:25:24.727  CFY <dep> [http_web_server_mb2qu9] Starting node
2018-03-18 07:25:24.727  CFY <dep> [http_web_server_mb2qu9.start] Sending task 'script_runner.tasks.run'
2018-03-18 07:25:24.727  CFY <dep> [http_web_server_mb2qu9.start] Task started 'script_runner.tasks.run'
2018-03-18 07:25:24.727  CFY <dep> [http_web_server_mb2qu9.start] Task succeeded 'script_runner.tasks.run (dry run)'
2018-03-18 07:25:25.734  CFY <dep> 'install' workflow execution succeeded (dry run)
Finished executing workflow install on deployment dep
```

The only result of this execution is a list of all of the operations that are executed in a real run of the workflow. `(dry run)` is shown at the end of each success event, and each workflow start and end message.
