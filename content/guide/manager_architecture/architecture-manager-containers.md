---
layout: bt_wiki
title: Manager Containers
category: Manager Architecture
publish: false
abstract:
weight: 210
---
{{% gsSummary %}}{{% /gsSummary %}}


Cloudify's Manager comprises of Docker images.

Bootstrapping using Docker provides several advantages:

* The Manager is installable on various Linux distributions running Docker. Note that some distributions require minimal adjustments.
* Users can upgrade containers specific to the service they want to upgrade (Currently, there's only one Application container. In the near future, each container will host one service [e.g. Logstash, Elasticsearch, etc..])
* Using Docker simplifies Cloudify's bootstrap process, and will help in making it much faster in future versions.


The Manager's structure consists of two Docker images:

* Cloudify Application Image - an image running Cloudify's Application Stack.
* Cloudify Data Image - a "data-only" image containing persistent volume paths.

Docker containers, by default, do not persist their data meaning that when a container exits, all of its data is lost.
To prevent losing data in case of a container failure, Cloudify uses a separate data container whose sole purpose is to hold all of the data that should remain persistent. It is run once during bootstrap, during which it creates the required volumes. This means that if the Application container crashes, all data will still be available via the data container's volume.

Additionally, using volumes will increase performance as all data is written directly to the disk instead of using Copy-On-Write.

{{% gsNote title="Note" %}}
Agent packages should be stated under `cloudify_packages` and will be installed upon bootstrap, inside the Docker container.
{{% /gsNote %}}

{{% gsNote title="Note" %}}
Cloudify will attempt to perform an online installation of Docker ***only on Ubuntu 14.04 (Trusty)***, as other images may require kernel upgrades and additional package installations.

If you are using a different distribution, you'll have to make sure that Docker is installed on it prior to bootstrapping.
{{% /gsNote %}}
