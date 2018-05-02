---
layout: bt_wiki
title: Creating Wagons
category: Writing Plugins
draft: false
weight: 10050

---


[Wagon](https://github.org/cloudify-cosmo/wagon) is a tool for packaging sets of Python wheels.


# Requirements

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

Run the following command to create the wagon:

```
$ wagon create -s path/to/python/project.zip -a '--no-cache-dir -c path/to/constraints.txt'
```


To learn more about how to use wagon, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).
