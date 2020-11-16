---
layout: bt_wiki
title: Actionable Events (Hooks)
category: Manager
draft: false
abstract: Configure what action is triggered by an event
weight: 550
---
## Overview
Actionable Events (or Hooks) allow you to register actions that will be triggered after certain {{< param product_name >}} events.
The hooks are defined in a configuration file, no hooks are handled by default.
When the specified event occurs, the specified action will be triggered.

## Configuration
To enable this feature edit `/opt/mgmtworker/config/hooks.conf` file with the following parameters:

 Parameter | Description |
---------|---------|
 event_type | The event type you want to hook the action, can be one of the following: `workflow_started`, `workflow_succeeded`, `workflow_failed`, `workflow_cancelled`, `workflow_queued` |
 implementation | A path to plugin task or an importable function |
 inputs | The arguments to be passed to the function |

When the `implementation` is a plugin task, the plugin should be uploaded to the manager (managed plugin) and with `central_deployment_agent` executor.<br/>
After editing the configuration file, restart management-worker service with `sudo systemctl restart cloudify-mgmtworker`.

### Example

Configure one or more hooks:

```
hooks:
  - event_type: workflow_started
    implementation: cloudify-fabric-plugin.fabric_plugin.tasks.run_task
    inputs:
      tasks_file: /tmp/fabric_test/tasks.py
      task_name: test_started_task
    description: A test task for workflow_started
  - event_type: workflow_succeeded
    implementation: cloudify-fabric-plugin.fabric_plugin.tasks.run_task
    inputs:
      tasks_file: /tmp/fabric_test/tasks.py
      task_name: test_succeeded_task
    description: A test task for workflow_succeeded
  ...
```


## SNMP Traps
SNMP Traps are a built-in option to use with hooks. <br/>
Using this option you can configure SNMP Traps that will be sent on every workflow event. For example, workflow started, workflow completed or workflow failed.

### {{< param product_name >}} MIB

The SNMP Traps will be sent using [{{< param product_name >}} MIB](https://github.com/cloudify-cosmo/cloudify-common/blob/master/cloudify/snmp/CLOUDIFY-MIB.mib).

### Configuration

To enable this feature edit `/opt/mgmtworker/config/hooks.conf` file with the following parameters:


 Parameter | Description |
---------|---------|
 event_type | The event type you want to hook the SNMP Trap, can be one of the following: `workflow_started`, `workflow_succeeded`, `workflow_failed`, `workflow_cancelled`, `workflow_queued` |
 implementation | `cloudify.snmp.snmp_trap.send_snmp_trap` |
 destination_address | The destination address to send the SNMP Trap to |
 destination_port | The port at the destination address to send the SNMP Trap to |
 community_string | The community string to be used in the SNMP Trap


Restart management-worker service with `sudo systemctl restart cloudify-mgmtworker`.


### Example

Configure one or more hooks:


```
hooks:
  - event_type: workflow_started
    implementation: cloudify.snmp.snmp_trap.send_snmp_trap
    inputs:
      destination_address: 10.239.0.109
      destination_port: 162
      community_string: testcommunity
    description: Sends a SNMP trap when a workflow started
  - event_type: workflow_succeeded
    implementation: cloudify.snmp.snmp_trap.send_snmp_trap
    inputs:
      destination_address: 10.239.0.109
      destination_port: 162
      community_string: testcommunity
    description: Sends a SNMP trap when a workflow succeeded
  - event_type: workflow_failed
    implementation: cloudify.snmp.snmp_trap.send_snmp_trap
    inputs:
      destination_address: 10.239.0.109
      destination_port: 162
      community_string: testcommunity
    description: Sends a SNMP trap when a workflow failed

```
