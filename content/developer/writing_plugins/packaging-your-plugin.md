---
layout: bt_wiki
title: Creating Wagons
category: Writing Plugins
draft: false
weight: 10050
aliases: /plugins/packaging-your-plugin/
---


[Wagon](https://github.com/cloudify-cosmo/wagon) is a tool for packaging sets of Python wheels.


# Requirements

- You must use the version of Wagon that is required by the oldest version of Cloudify that your Wagon should support. For example, if you need to support Cloudify 3.4.2, you should use Wagon version 0.3.2. Verify the [Cloudify Agent](https://github.com/cloudify-cosmo/cloudify-agent/blob/master/setup.py) dependencies for the Cloudify versions required.
- Cloudify in your local Python path.
- A zip archive of the plugin package, such as `https://github.com/cloudify-cosmo/cloudify-openstack-plugin/archive/2.2.0.zip`.
- A `constraints.txt` with any specific constraints.

*Example `constraints.txt`*

```
# Contents of contraints.txt

cloudify-plugins-common===3.4.2
```

_Wagons are often specific to the OS/Platform/Distribution/Architecture that they were built on. For example, your build your wagon on Ubuntu 16.04, then the wagon may not work on Centos 6. Make sure to test your wagon on the same kind of machine that you intend to use it on._


# Usage

When using Wagon version 0.3.2:

```
$ wagon create -s path/to/python/project.zip -a '--no-cache-dir -c path/to/constraints.txt'
```


When using Wagon version 0.6.1:

```
$ wagon create path/to/python/project.zip -a '--no-cache-dir -c path/to/constraints.txt'
```


To learn more about how to use wagon, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).
