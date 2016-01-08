---
layout: bt_wiki
title: Psutil Plugin
category: Plugins
draft: false
abstract: "Cloudify Psutil plugin description and configuration"
weight: 1150

---
{{% gsSummary %}} {{% /gsSummary %}}


# Description

The Psutil plugin can be used to collect metrics from Windows hosts in a similar way the Diamond plugin does on Linux hosts. It uses [psutil](https://github.com/giampaolo/psutil) underneath and can be configured to run arbitrary psutil functions. The source code is [here](https://github.com/cloudify-cosmo/cloudify-psutil-plugin).


# Plugin Requirements:

* Python 2.7.x
* Windows 2008+


# Usage

The only necessary configuration has to be done in `node_templates`. Each node, which has to be monitored, should map:

- `cloudify.interfaces.monitoring.start` to `psutil.psutil_agent.tasks.start` and
- `cloudify.interfaces.monitoring.stop` to `psutil.psutil_agent.tasks.stop`.

The first operation (`start`) accepts an input called `psutil_config` which contains the declarations of which psutil methods should be invoked and how. This input should be a list of dictionaries. Those dictionaries should have following keys:

- `method` - the name of the psutil method to invoke.
- `args` - a dictionary containing the arguments passed to the method (optional).
- `result_argument` - the name of the attribute which should be taken from the result of the method invocation (optional).
- `interval` - the number of seconds between consecutive method calls.
- `alias` - the name under which the metric will be sent to the manager.

The last operation (`stop`) doesn't accept any inputs.

## Example

`blueprint.yaml`
{{< gsHighlight  yaml  >}}
node_templates:
  vm:
    ...
    interfaces:
      cloudify.interfaces.monitoring:
        start:
          implementation: psutil.psutil_agent.tasks.start
          inputs:
            psutil_config:
              - method: virtual_memory
                result_argument: free
                interval: 5
                alias: memory_MemFree
              - method: cpu_times_percent
                args:
                  interval: 1
                  percpu: false
                interval: 5
                result_argument: user
                alias: cpu_total_user
              - method: cpu_times_percent
                args:
                  interval: 1
                  percpu: false
                interval: 5
                result_argument: system
                alias: cpu_total_system
        stop: psutil.psutil_agent.tasks.stop
{{< /gsHighlight >}}

In this example, two metrics will be collected for the node `vm`:

- free virtual memory (psutil method `virtual_memory` and result argument `free`) every 5 seconds and will be sent as `memory_MemFree`,
- user CPU usage in percent (psutil method `cpu_times_percent` and result argument `user` invoked with arguments `interval=1` and `percpu=False`) every 5 seconds and will be sent as `cpu_total_user`.

Keep in mind that each parameter will be converted to the corresponding Python type (in particular `false` in YAML will be converted to `False` in Python).


# Implementation
The plugin is divided into two files:

- `tasks.py` - it contains two methods, `start()` and `stop()` which are the `psutil.psutil_agent.tasks.start` and `psutil.psutil_agent.tasks.stop` operations, respectively,
- `loop.py` - it contains one method, `collect_metrics()` which handles actual metric collection.

## tasks.py

### start()

First, this method retrieves all of the necessary data from the context (like deployment ID or broker credentials). Then it takes the configuration from the blueprint and serializes it all to JSON. After that it creates a service using NSSM with those parameters. Lastly, it starts the service.

### stop()
This method stops the service and then deletes it.

## loop.py
This file is the actual service responsible for collecting metrics. It has one method, `collect_metrics()`, which accepts as arguments the whole configuration passed from the previous file. Those arguments are passed as command line arguments to the service.

### collect_metrics()

This method creates a set of methods which are run periodically using the built-in module `sched`.

## Logging
Logs can be found in the file `psutil.log` in the directory denoted by the environmental variable `CELERY_WORK_DIR`. In general it is `<node_id>\work` in the home directory.