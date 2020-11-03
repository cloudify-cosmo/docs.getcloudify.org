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

- Wagon installed in virtualenv.
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

When using 0.11.0:
 ```
 wagon create -r /path/to/reuierments/file/if/exits -v -f -a '--no-cache-dir -c path/to/constraints.txt' .

```

# Build py2py3 wagon

Currently, Cloudify official plugins are python 2 and python 3 compatible. 
In order to support installation of a wagon on both py2(5.0.5 and older) and py3 managers(5.1 and newer),
py2py3 wagon introduced.

py2py3 wagon is a wagon that contains all the python2 wheels and python3 wheels required for the plugin installation.

From version 0.10.0 `--pip` flag introduced, when adding `--pip` flag to gagon command the wagon code use the specified pip in order to download the wheels.

This way py2py3 wagons can be created.

For example :
```
 wagon create --pip /env2/bin/pip --pip /env3/bin/pip --pyver "27" --pyver "36" -r /path/to/requierments/file -v -f -a '--no-cache-dir -c path/to/constraints.txt' path/to/plugin/source
```

Where `env2` is python 2.7 virtualenv and `env3` is python 3.6 virtualenv.

To learn more about how to use wagon, see the [Wagon documentation](https://github.com/cloudify-cosmo/wagon).


# Build wagons with cloudify wagon builder docker images

In order to build wagons easily on every operation system, wagon builders docker images provided in [cloudifyplatform dockerhub repository](https://hub.docker.com/u/cloudifyplatform).

For example in order to build aws plugin wagon on centos 7 OS run:
```
docker run -v path/to/cloudify-aws-plugin/:/packaging cloudifyplatform/cloudify-centos-7-py2py3-wagon-builder
```

The wagon can be found inside `cloudify-aws-plugin` directory. 