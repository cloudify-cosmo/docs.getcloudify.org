---
layout: bt_wiki
title: Diamond Plugin
category: Plugins
draft: false
abstract: "Cloudify diamond plugin description and configuration"
weight: 1300

---
{{% gsSummary %}} {{% /gsSummary %}}


# Description

Diamond plugin is used to install & configure a [Diamond](https://github.com/python-diamond/Diamond) monitoring agent (version 3.5) on hosts.

Diamond is a python daemon that collects system metrics and publishes them to multiple destinations. It is capable of collecting cpu, memory, network, i/o, load and disk metrics as well as many other metrics as specified in the [docs](http://diamond.readthedocs.org/).
Additionally, it features an API for implementing custom collectors for gathering metrics from almost any source.


# Plugin Requirements:

* Python Versions:
  * 2.6.x
  * 2.7.x


# Example

The following example shows the configuration options of the plugin.

{{< gsHighlight  yaml  >}}
node_types:
  my_type:
    derived_from: cloudify.nodes.WebServer
    properties:
      collectors_config: {}

node_templates:
  vm:
    type: cloudify.nodes.Compute
    interfaces:
      cloudify.interfaces.monitoring_agent:
        install:
          implementation: diamond.diamond_agent.tasks.install
          inputs:
            diamond_config:
              interval: 10
        start: diamond.diamond_agent.tasks.start
        stop: diamond.diamond_agent.tasks.stop
        uninstall: diamond.diamond_agent.tasks.uninstall

  app:
    type: my_type
    properties:
      collectors_config:
        CPUCollector: {}
        DiskUsageCollector:
          config:
            devices: x?vd[a-z]+[0-9]*$
        MemoryCollector: {}
        NetworkCollector: {}
        ExampleCollector:
          path: collectors/example.py
          config:
              key: value
    interfaces:
      cloudify.interfaces.monitoring:
        start:
          implementation: diamond.diamond_agent.tasks.add_collectors
          inputs:
            collectors_config: { get_propery: [SELF, collectors_config] }
        stop:
          implementation: diamond.diamond_agent.tasks.del_collectors
          inputs:
            collectors_config: { get_propery: [SELF, collectors_config] }
    relationships:
      - type: cloudify.relationships.contained_in
        target: node
{{< /gsHighlight >}}

# Interfaces
Two interfaces are involved in setting up a monitoring agent on a machine:

* `cloudify.interfaces.monitoring_agent` - The interface in charge of installing, starting stopping and uninstalling the agent.
* `cloudify.interfaces.monitoring` - The interface in charge of configuring the monitoring agent.

The example above shows how the Diamond plugin maps to these interfaces.

# Global config
The Diamond agent has a number of configuration sections, some of which are global while other are relevant to specific components.
It is possible to pass a [global config](https://github.com/python-diamond/Diamond/blob/v3.5/conf/diamond.conf.example) setting via the `install` operation:
{{< gsHighlight  yaml  >}}
interfaces:
  cloudify.interfaces.monitoring_agent:
    install:
      implementation: diamond.diamond_agent.tasks.install
      inputs:
        diamond_config:
          interval: 10
{{< /gsHighlight >}}

In the above example we set the [global poll interval](https://github.com/python-diamond/Diamond/blob/v3.5/conf/diamond.conf.example#L176) to 10 seconds
(each collector will be polled for data every 10 seconds).

## Handler
The Handler's job in Diamond is to output the collected data to different destinations. By default, the Diamond plugin will setup a custom handler which will output the collected metrics to Cloudify's manager.

It is possible to set an alternative handler in case you want to output data to a different destination:
{{< gsHighlight  yaml  >}}
interfaces:
  cloudify.interfaces.monitoring_agent:
    install:
      implementation: diamond.diamond_agent.tasks.install
      inputs:
        diamond_config:
          handlers:
            diamond.handler.graphite.GraphiteHandler:
              host: graphite.example.com
              port: 2003
              timeout: 15
{{< /gsHighlight >}}

In the example above we configured a [handler for Graphite](http://diamond.readthedocs.org/en/latest/handlers/GraphiteHandler/).

{{% gsNote %}}
If you wish to add your own handler but maintain Cloudify's default handler, see [this](https://github.com/cloudify-cosmo/cloudify-diamond-plugin/blob/1.3/diamond_agent/tasks.py#L38).
{{% /gsNote %}}

# Collectors config
Collectors are Diamond's data fetchers. Diamond comes with a large number of [built-in collectors](http://diamond.readthedocs.org/en/latest/).

Collectors are added using the `install` operation of the `cloudify.interfaces.monitoring` interface:
{{< gsHighlight  yaml  >}}
interfaces:
  cloudify.interfaces.monitoring:
    start:
      implementation: diamond.diamond_agent.tasks.add_collectors
      inputs:
        collectors_config:
          CPUCollector: {}
          DiskUsageCollector:
            config:
              devices: x?vd[a-z]+[0-9]*$
          MemoryCollector: {}
          NetworkCollector: {}
{{< /gsHighlight >}}

In the example above we configure 4 collectors:

* A [CPUCollector](http://diamond.readthedocs.org/en/latest/collectors/CPUCollector/),
* A [DiskUsageCollector](http://diamond.readthedocs.org/en/latest/collectors/DiskUsageCollector/),
* A [MemoryCollector](http://diamond.readthedocs.org/en/latest/collectors/MemoryCollector/) and
* A [NetworkCollector](http://diamond.readthedocs.org/en/latest/collectors/NetworkCollector/).

It is also possible to add a collector-specific configuration via the `config` dictionary (as with `DiskUsageCollector`). If `config` is not provided, the collector will use its default settings.

{{% gsNote title="Default config values" %}}
Config values are left with their default values unless explicitly overridden.
{{% /gsNote %}}

# Custom Collectors & Handlers
Collectors & Handlers are essentially Python modules that implement specific Diamond interfaces.

It is possible to create your own collectors or handlers and configure them in Diamond. The example below shows how to upload a custom collector:
{{< gsHighlight  yaml  >}}
collectors_config:
  ExampleCollector:
    path: collectors/example.py
      config:
        key: value
{{< /gsHighlight >}}

`path` points to the location of your custom collector (relative location to the blueprint's directory. `ExampleCollector` is the name of the main class inside `example.py` that extends `diamond.collector.Collector`.

Providing a custom handler is done in a similar manner:
{{< gsHighlight  yaml  >}}
diamond_config:
  handlers:
    example_handler.ExampleHandler:
      path: handlers/example_handler.py
      config:
        key: value
{{< /gsHighlight >}}

where `example_handler` is the name of the file and `ExampleHandler` is the name of the class that extends `diamond.handler.Handler`.

Note that handlers are configured as part of the `global config`.

{{% gsNote %}}
Diamond's wide range of collectors, handlers and extensibility possibilities comes with a price - It's not always promised that you'll have all the required dependencies built into your instance.

For example, you might find yourself trying to use the `MongoDBCollector` collector which imports the [pymongo](http://api.mongodb.org/python/current/) module internally.
Since `pymongo` is not a part of the Python standard library, this will fail unless you will install it separately.
See the [nodecellar example](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) for more information.
{{% /gsNote %}}
