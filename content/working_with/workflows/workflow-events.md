---
layout: bt_wiki
title: Workflow Events
category: Workflows
draft: false
abstract: SNMP Traps for Workflow Events
weight: 550
---
## Overview

Using this option you can configure SNMP Traps that will be sent on every workflow events. For example, workflow started, workflow completed or workflow failed.

## Cloudify MIB

The SNMP Traps will be sent using [Cloudify MIB](https://github.com/cloudify-cosmo/cloudify-common/blob/master/cloudify/snmp/CLOUDIFY-MIB.mib).

## Configuration

To enable this feature edit `/opt/mgmtworker/config/hooks.conf` file with the following parameters:


 Parameter | Description |
---------|---------|
 event_type | The event type you want to hook the SNMP Trap, can be one of the following options `workflow_started`, `workflow_succeeded`, `workflow_failed`, `workflow_cancelled`, `workflow_queued` | 
 implementation | `cloudify.snmp.snmp_trap.send_snmp_trap` | 
 destination_address | The destination address to send the SNMP Trap to |
 destination_port | The port at the destination address to send the SNMP Trap to |
 community_string | The community string to be used in the SNMP Trap


Restart management-worker service with `sudo systemctl restart cloudify-mgmtworker`.


## Example

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

