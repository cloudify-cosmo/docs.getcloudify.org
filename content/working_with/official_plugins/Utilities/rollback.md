---
layout: bt_wiki
title: Rollback Plugin
category: Official Plugins
draft: false
weight: 100
---
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# Cloudify Utilities: Rollback Workflow

## Description
Add rollback support for node instances in [unresolved states](#rollback-workflow) due to a failure in the install workflow.
Also, wrappers workflows for {{< param product_name >}} lifecycle operations introduced.

## Prerequisites
* Tested with Cloudify 5.1.1.

{{% warning title="Deprecation Warning" %}}
  On {{< param product_name >}} 5.2 (future version), the Rollback Workflow will be deprecated in the Utilities plugin and will be replaced by a built-in workflow. 
{{% /warning %}}
  
## Supported workflows

### Rollback workflow

Rollback workflow will look at each node state, decide if the node state
is unresolved, and for those that are, execute the corresponding node
operation that will get us back to a resolved node state.

Unresolved node instance states are:

* creating.
* configuring.
* starting.


After rollback, `creating` and `configuring` node instances become `uninitialized`.
`starting` node instances become `uninitialized`. 
 

Parameters:


* `type_names`: A list of type names. The operation will be executed
  only on node instances which are of these types or of types which
  (recursively) derive from them. An empty list means no filtering
  will take place and all type names are valid (Default: []). 
* `param node_ids`: A list of node ids. The operation will be executed only
  on node instances which are instances of these nodes. An empty list
  means no filtering will take place and all nodes are valid (Default: []).
* `node_instance_ids`: A list of node instance ids. The operation will
  be executed only on the node instances specified. An empty list
  means no filtering will take place and all node instances are valid (Default: []). 
* `full_rollback`: Whether to rollback to resolved state or full uninstall.

**Notes**:

* All lifecycle operations(like: `cloudify.interfaces.lifecycle.delete`) performed during rollback of an unresolved instance
  are performed while ignoring failures for this node instance.
  If `full_rollback` chosen, after rollback of unresolved nodes the rest of the nodes will be uninstalled without ignoring failures.
* Known issue(only if full_rollback is false) - While performing  uninstall workflow after rollback node instance from `starting` state to `configured` state,
  `cloudify.interfaces.lifecycle.stop` operation will be executed, which can cause failure of uninstall.
  Set `full_rollback ` to `true` If after rollback an uninstall should be performed.

### Example

[Example](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_rollback_workflow/examples/rollback-to-configured-and-uninitialized.yaml) demonstrates rollback of two node instances.



#### Install the example blueprint 

Install [blueprint](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_rollback_workflow/examples/rollback-to-configured-and-uninitialized.yaml).
```shell
[root@9fbb5f2b0d4b offcial_examples]# cfy install rollback-to-configured-and-uninitialized.yaml  -b rollback-example -d rollback-example
Uploading blueprint rollback-to-configured-and-uninitialized.yaml...
 rollback-to-confi... |################################################| 100.0%
Blueprint uploaded. The blueprint's id is rollback-example
Creating new deployment from blueprint rollback-example...
Deployment created. The deployment's id is rollback-example
Executing workflow `install` on deployment `rollback-example` [timeout=900 seconds]
Deployment environment creation is pending...
2021-01-13 07:59:05.353  CFY <rollback-example> Starting 'create_deployment_environment' workflow execution
2021-01-13 07:59:05.354  LOG <rollback-example> INFO: Creating deployment work directory
2021-01-13 07:59:05.389  CFY <rollback-example> 'create_deployment_environment' workflow execution succeeded
2021-01-13 07:59:08.956  CFY <rollback-example> Starting 'install' workflow execution
2021-01-13 07:59:09.103  CFY <rollback-example> [node_three_j9y2wc] Validating node instance before creation: nothing to do
2021-01-13 07:59:09.104  CFY <rollback-example> [node_three_j9y2wc] Precreating node instance: nothing to do
2021-01-13 07:59:09.105  CFY <rollback-example> [node_three_j9y2wc] Creating node instance: nothing to do
2021-01-13 07:59:09.106  CFY <rollback-example> [node_three_j9y2wc] Configuring node instance: nothing to do
2021-01-13 07:59:09.107  CFY <rollback-example> [node_three_j9y2wc] Starting node instance
2021-01-13 07:59:09.375  CFY <rollback-example> [node_three_j9y2wc.start] Sending task 'script_runner.tasks.run'
2021-01-13 07:59:09.927  LOG <rollback-example> [node_three_j9y2wc.start] INFO: Downloaded resources/install.py to /tmp/M5HA0/install.py
2021-01-13 07:59:09.927  LOG <rollback-example> [node_three_j9y2wc.start] INFO: log without fail during install
2021-01-13 07:59:10.193  CFY <rollback-example> [node_three_j9y2wc.start] Task succeeded 'script_runner.tasks.run'
2021-01-13 07:59:10.194  CFY <rollback-example> [node_three_j9y2wc] Poststarting node instance: nothing to do
2021-01-13 07:59:10.195  CFY <rollback-example> [node_three_j9y2wc] Node instance started
2021-01-13 07:59:10.362  CFY <rollback-example> [node_one_ivbz80] Validating node instance before creation: nothing to do
2021-01-13 07:59:10.363  CFY <rollback-example> [node_one_ivbz80] Precreating node instance: nothing to do
2021-01-13 07:59:10.363  CFY <rollback-example> [node_one_ivbz80] Creating node instance: nothing to do
2021-01-13 07:59:10.365  CFY <rollback-example> [node_one_ivbz80] Configuring node instance: nothing to do
2021-01-13 07:59:10.367  CFY <rollback-example> [node_one_ivbz80] Starting node instance
2021-01-13 07:59:10.410  CFY <rollback-example> [node_two_wrbed2] Validating node instance before creation: nothing to do
2021-01-13 07:59:10.412  CFY <rollback-example> [node_two_wrbed2] Precreating node instance: nothing to do
2021-01-13 07:59:10.419  CFY <rollback-example> [node_two_wrbed2] Creating node instance
2021-01-13 07:59:10.653  CFY <rollback-example> [node_one_ivbz80.start] Sending task 'script_runner.tasks.run'
2021-01-13 07:59:10.963  CFY <rollback-example> [node_two_wrbed2.create] Sending task 'script_runner.tasks.run'
2021-01-13 07:59:11.241  LOG <rollback-example> [node_one_ivbz80.start] INFO: Downloaded resources/install_fail.py to /tmp/UURZS/install_fail.py
2021-01-13 07:59:11.241  LOG <rollback-example> [node_one_ivbz80.start] INFO: log and fail during install!
2021-01-13 07:59:11.440  CFY <rollback-example> [node_one_ivbz80.start] Task failed 'script_runner.tasks.run'
Traceback (most recent call last):
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 793, in main
    payload = handler.handle()
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 456, in handle
    result = self._run_operation_func(ctx, kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 509, in _run_operation_func
    return self.func(*self.args, **kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 80, in run
    script_result = process_execution(script_func, script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 156, in process_execution
    script_func(script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 323, in eval_script
    exec(compile(open(script_path).read(), script_path, 'exec'), eval_globals)
  File "/tmp/UURZS/install_fail.py", line 4, in <module>
    raise Exception
Exception

2021-01-13 07:59:11.498  LOG <rollback-example> [node_two_wrbed2.create] INFO: Downloaded resources/install_fail.py to /tmp/L0VUJ/install_fail.py
2021-01-13 07:59:11.499  LOG <rollback-example> [node_two_wrbed2.create] INFO: log and fail during install!
2021-01-13 07:59:11.753  CFY <rollback-example> [node_two_wrbed2.create] Task failed 'script_runner.tasks.run'
Traceback (most recent call last):
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 793, in main
    payload = handler.handle()
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 456, in handle
    result = self._run_operation_func(ctx, kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 509, in _run_operation_func
    return self.func(*self.args, **kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 80, in run
    script_result = process_execution(script_func, script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 156, in process_execution
    script_func(script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 323, in eval_script
    exec(compile(open(script_path).read(), script_path, 'exec'), eval_globals)
  File "/tmp/L0VUJ/install_fail.py", line 4, in <module>
    raise Exception
Exception

2021-01-13 07:59:26.673  CFY <rollback-example> [node_one_ivbz80.start] Sending task 'script_runner.tasks.run' [retry 1/60]


```
Cancel the `install` workflow (or wait until it will fail).

Check node instances states:

```shell
[root@9fbb5f2b0d4b offcial_examples]# cfy node-instances list
Listing all instances...

Node-instances:
+-------------------+------------------+---------+------------+----------+------------+----------------+------------+
|         id        |  deployment_id   | host_id |  node_id   |  state   | visibility |  tenant_name   | created_by |
+-------------------+------------------+---------+------------+----------+------------+----------------+------------+
|  node_one_ivbz80  | rollback-example |         |  node_one  | starting |   tenant   | default_tenant |   admin    |
| node_three_j9y2wc | rollback-example |         | node_three | started  |   tenant   | default_tenant |   admin    |
|  node_two_wrbed2  | rollback-example |         |  node_two  | creating |   tenant   | default_tenant |   admin    |
+-------------------+------------------+---------+------------+----------+------------+----------------+------------+

Showing 3 of 3 node-instances

```

See that `node_one_ivbz80` state is `starting` and  `node_two_wrbed2` state is `creating`.

#### Run rollback workflow

```shell
[root@9fbb5f2b0d4b offcial_examples]# cfy executions start rollback -d rollback-example
Executing workflow `rollback` on deployment `rollback-example` [timeout=900 seconds]
2021-01-13 08:02:25.044  CFY <rollback-example> Starting 'rollback' workflow execution
2021-01-13 08:02:25.142  CFY <rollback-example> [node_two_wrbed2] Validating node instance after deletion: nothing to do
2021-01-13 08:02:25.172  CFY <rollback-example> [node_one_ivbz80] Stopping node instance
2021-01-13 08:02:25.173  CFY <rollback-example> [node_two_wrbed2] Rollback Stop: nothing to do, instance state is creating
2021-01-13 08:02:25.176  CFY <rollback-example> [node_two_wrbed2] Deleting node instance
2021-01-13 08:02:25.425  CFY <rollback-example> [node_two_wrbed2.delete] Sending task 'script_runner.tasks.run'
2021-01-13 08:02:25.478  CFY <rollback-example> [node_one_ivbz80] Validating node instance after deletion: nothing to do
2021-01-13 08:02:25.678  CFY <rollback-example> [node_one_ivbz80.stop] Sending task 'script_runner.tasks.run'
2021-01-13 08:02:26.023  LOG <rollback-example> [node_two_wrbed2.delete] INFO: Downloaded resources/uninstall_fail.py to /tmp/HCURA/uninstall_fail.py
2021-01-13 08:02:26.024  LOG <rollback-example> [node_two_wrbed2.delete] INFO: log and fail during uninstall!
2021-01-13 08:02:26.313  CFY <rollback-example> [node_two_wrbed2.delete] Task failed 'script_runner.tasks.run'
Traceback (most recent call last):
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 793, in main
    payload = handler.handle()
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 456, in handle
    result = self._run_operation_func(ctx, kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 509, in _run_operation_func
    return self.func(*self.args, **kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 80, in run
    script_result = process_execution(script_func, script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 156, in process_execution
    script_func(script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 323, in eval_script
    exec(compile(open(script_path).read(), script_path, 'exec'), eval_globals)
  File "/tmp/HCURA/uninstall_fail.py", line 4, in <module>
    raise Exception
Exception

2021-01-13 08:02:26.314  CFY <rollback-example> [node_two_wrbed2] Ignoring task script_runner.tasks.run failure
2021-01-13 08:02:26.374  LOG <rollback-example> [node_one_ivbz80.stop] INFO: Downloaded resources/uninstall_fail.py to /tmp/1CWIY/uninstall_fail.py
2021-01-13 08:02:26.374  LOG <rollback-example> [node_one_ivbz80.stop] INFO: log and fail during uninstall!
2021-01-13 08:02:26.386  CFY <rollback-example> [node_two_wrbed2] Rollbacked node instance
2021-01-13 08:02:26.714  CFY <rollback-example> [node_one_ivbz80.stop] Task failed 'script_runner.tasks.run'
Traceback (most recent call last):
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 793, in main
    payload = handler.handle()
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 456, in handle
    result = self._run_operation_func(ctx, kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 509, in _run_operation_func
    return self.func(*self.args, **kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 80, in run
    script_result = process_execution(script_func, script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 156, in process_execution
    script_func(script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 323, in eval_script
    exec(compile(open(script_path).read(), script_path, 'exec'), eval_globals)
  File "/tmp/1CWIY/uninstall_fail.py", line 4, in <module>
    raise Exception
Exception

2021-01-13 08:02:26.714  CFY <rollback-example> [node_one_ivbz80] Ignoring task script_runner.tasks.run failure
2021-01-13 08:02:26.714  CFY <rollback-example> [node_one_ivbz80] Stopped node instance
2021-01-13 08:02:26.801  CFY <rollback-example> [node_one_ivbz80] Rollback Delete: nothing to do, instance state is starting
2021-01-13 08:02:26.804  CFY <rollback-example> [node_one_ivbz80] Rollbacked node instance
2021-01-13 08:02:26.946  CFY <rollback-example> 'rollback' workflow execution succeeded
Finished executing workflow rollback on deployment rollback-example
* Run 'cfy events list 31c4189b-6404-430f-8839-5c933e058769' to retrieve the execution's events/logs

```
See that even though `node_one_ivbz80.stop` and `node_two_wrbed2.delete` still the rollback succeeded (ignore failures during rollback as explained above).

Check node instances states:

```shell
[root@9fbb5f2b0d4b offcial_examples]# cfy node-instances list
Listing all instances...

Node-instances:
+-------------------+------------------+---------+------------+---------------+------------+----------------+------------+
|         id        |  deployment_id   | host_id |  node_id   |     state     | visibility |  tenant_name   | created_by |
+-------------------+------------------+---------+------------+---------------+------------+----------------+------------+
|  node_one_ivbz80  | rollback-example |         |  node_one  |   configured  |   tenant   | default_tenant |   admin    |
| node_three_j9y2wc | rollback-example |         | node_three |    started    |   tenant   | default_tenant |   admin    |
|  node_two_wrbed2  | rollback-example |         |  node_two  | uninitialized |   tenant   | default_tenant |   admin    |
+-------------------+------------------+---------+------------+---------------+------------+----------------+------------+

Showing 3 of 3 node-instances

```
See that rollback handled unresolved node instances. 

### Wrapper workflows

Nine workflows introduced:


* alt_start.
* alt_stop.
* alt_precreate.
* alt_create.
* alt_configure.
* alt_poststart.
* alt_prestop.
* alt_delete.
* alt_postdelete.


Wrapper workflows are workflows that wrap execution of the corresponding lifecycle operation with `ignore_failure` option.

For example, `alt_create` workflow will execute `cloudify.interfaces.lifecycle.create`.

All the wrapper workflows share the same parameters:


* `operation_parms`: A dictionary of keyword arguments that will be passed to
  the operation invocation (Default: {}).
* `run_by_dependency_order`: A boolean describing whether the operation should
  execute on the relevant nodes according to the order of their relationships
  dependencies or rather execute on all relevant nodes in parallel (Default: true).
* `type_names`: A list of type names. The operation will be executed only on node
  instances which are of these types or of types which (recursively)
  derive from them. An empty list means no filtering will take place
  and all type names are valid (Default: []).
* `node_ids`: A list of node ids. The operation will be executed only on node
  instances which are instances of these nodes. An empty list means
  no filtering will take place and all nodes are valid (Default: []).
* `node_instance_ids`: A list of node instance ids. The operation will be
  executed only on the node instances specified. An empty list means no
  filtering will take place and all node instances are valid (Default: []).
* `ignore_failure`: Whether to ignore failure during execution of the operation.

### Example

This example demonstrates how to call `alt_stop` workflow.

```shell
[root@9fbb5f2b0d4b offcial_examples]# cfy executions start alt_stop -d rollback-example -p node_instance_ids=[node_one_ivbz80] -p ignore_failure=true
Executing workflow `alt_stop` on deployment `rollback-example` [timeout=900 seconds]
2021-01-13 08:40:47.049  CFY <rollback-example> Starting 'alt_stop' workflow execution
2021-01-13 08:40:47.163  CFY <rollback-example> [node_one_ivbz80] Starting operation cloudify.interfaces.lifecycle.stop
2021-01-13 08:40:47.353  CFY <rollback-example> [node_one_ivbz80.stop] Sending task 'script_runner.tasks.run'
2021-01-13 08:40:48.015  LOG <rollback-example> [node_one_ivbz80.stop] INFO: Downloaded resources/uninstall_fail.py to /tmp/TQ3V7/uninstall_fail.py
2021-01-13 08:40:48.016  LOG <rollback-example> [node_one_ivbz80.stop] INFO: log and fail during uninstall!
2021-01-13 08:40:48.241  CFY <rollback-example> [node_one_ivbz80.stop] Task failed 'script_runner.tasks.run'
Traceback (most recent call last):
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 793, in main
    payload = handler.handle()
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 456, in handle
    result = self._run_operation_func(ctx, kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/cloudify/dispatch.py", line 509, in _run_operation_func
    return self.func(*self.args, **kwargs)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 80, in run
    script_result = process_execution(script_func, script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 156, in process_execution
    script_func(script_path, ctx, process)
  File "/opt/mgmtworker/env/lib64/python3.6/site-packages/script_runner/tasks.py", line 323, in eval_script
    exec(compile(open(script_path).read(), script_path, 'exec'), eval_globals)
  File "/tmp/TQ3V7/uninstall_fail.py", line 4, in <module>
    raise Exception
Exception

2021-01-13 08:40:48.242  CFY <rollback-example> [node_one_ivbz80] Ignoring task script_runner.tasks.run failure
2021-01-13 08:40:48.242  CFY <rollback-example> [node_one_ivbz80] Finished operation cloudify.interfaces.lifecycle.stop
2021-01-13 08:40:48.303  CFY <rollback-example> 'alt_stop' workflow execution succeeded

```
See that `cloudify.interfaces.lifecycle.stop` operation executed on the node instance, which was given as a parameter,
failed, but the whole workflow didn't.
