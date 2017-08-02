---
layout: bt_wiki
title: Diamond Plugin
category: Plugins
draft: false
abstract: "Cloudify diamond plugin description and configuration"
weight: 1300

---

The Diamond plugin is used to install & configure a [Diamond](https://github.com/BrightcoveOS/Diamond) monitoring agent (version 3.5) on hosts.

Diamond is a Python daemon that collects system metrics and publishes them to multiple destinations. It can collect CPU, memory, network, I/O, load and disk metrics, and many other metrics, as specified in the [documentation](https://github.com/BrightcoveOS/Diamond/wiki/Collectors).
Additionally, it features an API for implementing custom collectors for gathering metrics from almost any source.


# Plugin Requirements:

* Python versions:
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

* `cloudify.interfaces.monitoring_agent` - The interface that manages installing, starting, stopping, and uninstalling the agent.
* `cloudify.interfaces.monitoring` - The interface that manages configuring the monitoring agent.

The example above shows how the Diamond plugin maps to these interfaces.

# Custom Collectors & Handlers
Collectors and handlers are essentially Python modules that implement specific Diamond interfaces.

You can create your own collectors or handlers and configure them in Diamond. The example below shows how to upload a custom collector.
{{< gsHighlight  yaml  >}}
collectors_config:
  ExampleCollector:
    path: collectors/example.py
      config:
        key: value
{{< /gsHighlight >}}

`path` points to the location of your custom collector (the relative location to the blueprint's directory). `ExampleCollector` is the name of the main class inside `example.py` that extends `diamond.collector.Collector`.

Providing a custom handler is processed in a similar manner:
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

{{% gsNote title="Note" %}}
Not all the required dependencies for Diamond's wide range of collectors, handlers and extensibility possibilities are part of the Python standard library, so might not be built into your instance. For example, if you try to use the `MongoDBCollector` collector, which imports the [pymongo](http://api.mongodb.org/python/current/) module internally, the call will fail unless you have installed `pymongo`because `pymongo` is not a part of the Python standard library. See the [nodecellar example](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) for more information.
{{% /gsNote %}}
