Diamond Plugin
%%%%%%%%%%%%%%

The Diamond plugin is used to install & configure a
`Diamond <https://github.com/BrightcoveOS/Diamond>`__ monitoring agent
(version 3.5) on hosts.

Diamond is a Python daemon that collects system metrics and publishes
them to multiple destinations. It can collect CPU, memory, network, I/O,
load and disk metrics, and many other metrics, as specified in the
`documentation <https://github.com/BrightcoveOS/Diamond/wiki/Collectors>`__.
Additionally, it features an API for implementing custom collectors for
gathering metrics from almost any source.

Plugin Requirements:
====================

-  Python versions:

   -  2.6.x
   -  2.7.x

Example
=======

The following example shows the configuration options of the plugin.

.. code:: yaml

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

Interfaces
==========

Two interfaces are involved in setting up a monitoring agent on a
machine:

-  ``cloudify.interfaces.monitoring_agent`` - The interface that manages
   installing, starting, stopping, and uninstalling the agent.
-  ``cloudify.interfaces.monitoring`` - The interface that manages
   configuring the monitoring agent.

The example above shows how the Diamond plugin maps to these interfaces.

Global config
=============

The Diamond agent has a number of configuration sections, some of which
are global while other are relevant to specific components. It is
possible to pass a `global
config <https://github.com/BrightcoveOS/Diamond/blob/v3.5/conf/diamond.conf.example>`__
setting via the ``install`` operation:

.. code:: yaml

        interfaces:
          cloudify.interfaces.monitoring_agent:
            install:
              implementation: diamond.diamond_agent.tasks.install
              inputs:
                diamond_config:
                  interval: 10

In the above example we set the `global poll
interval <https://github.com/BrightcoveOS/Diamond/blob/v3.5/conf/diamond.conf.example#L176>`__
to 10 seconds (each collector will be polled for data every 10 seconds).

Handler
-------

The Handler’s job in Diamond is to output the collected data to
different destinations. By default, the Diamond plugin will setup a
custom handler which will output the collected metrics to Cloudify’s
manager.

It is possible to set an alternative handler in case you want to output
data to a different destination:

.. code:: yaml

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

In the example above we configured a `handler for
Graphite <https://github.com/BrightcoveOS/Diamond/wiki/handler-GraphiteHandler>`__.

.. note::
    :class: summary

    If you wish to add your own handler but maintain    Cloudify’s default handler, see
    `this <https://github.com/cloudify-cosmo/cloudify-diamond-plugin/blob/1.2/diamond_agent/tasks.py#L38>`__.

Collectors Configuration
========================

Collectors are Diamond’s data fetchers. Diamond comes with a large
number of `built-in
collectors <https://github.com/BrightcoveOS/Diamond/wiki/Collectors>`__.

Collectors are added using the ``install`` operation of the
``cloudify.interfaces.monitoring`` interface:

.. code:: yaml

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
         

In the example above we configure 4 collectors:

A
`CPUCollector <https://github.com/BrightcoveOS/Diamond/wiki/collectors-CPUCollector>`__,
A
`DiskUsageCollector <https://github.com/BrightcoveOS/Diamond/wiki/collectors-DiskUsageCollector>`__,
A
`MemoryCollector <https://github.com/BrightcoveOS/Diamond/wiki/collectors-MemoryCollector>`__
and A
`NetworkCollector <https://github.com/BrightcoveOS/Diamond/wiki/collectors-NetworkCollector>`__.

It is also possible to add a collector-specific configuration via the
``config`` dictionary (as with ``DiskUsageCollector``). If ``config`` is
not provided, the collector will use its default settings.

.. note::
    :class: summary
    :name: Default config values

        
    Config values are left with their default values unless explicitly

Custom Collectors & Handlers
============================

Collectors and handlers are essentially Python modules that implement
specific Diamond interfaces.

You can create your own collectors or handlers and configure them in
Diamond. The example below shows how to upload a custom collector.

.. code:: yaml

        collectors_config:
          ExampleCollector:
            path: collectors/example.py
              config:
                key: value

``path`` points to the location of your custom collector (the relative
location to the blueprint’s directory). ``ExampleCollector`` is the name
of the main class inside ``example.py`` that extends
``diamond.collector.Collector``.

Providing a custom handler is processed in a similar manner:

.. code:: yaml

        diamond_config:
          handlers:
            example_handler.ExampleHandler:
              path: handlers/example_handler.py
              config:
                key: value

where ``example_handler`` is the name of the file and ``ExampleHandler``
is the name of the class that extends ``diamond.handler.Handler``.

Note that handlers are configured as part of the ``global config``.

.. note::
    :class: summary

    Not all the required dependencies for    Diamond’s wide range of collectors, handlers and extensibility
    possibilities are part of the Python standard library, so might not be
    built into your instance. For example, if you try to use the
    ``MongoDBCollector`` collector, which imports the
    `pymongo <http://api.mongodb.org/python/current/>`__ module internally,
    the call will fail unless you have installed ``pymongo``\ because
    ``pymongo`` is not a part of the Python standard library. See the
    `nodecellar
    example <https://github.com/cloudify-cosmo/cloudify-nodecellar-example>`__
