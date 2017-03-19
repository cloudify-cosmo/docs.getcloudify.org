---
layout: bt_wiki
title: Bootstrap Workflow
category: Manager Architecture
draft: false
abstract: Describes the flow of bootstrapping a Cloudify management environment
weight: 300
---
This section describes the workflow for bootstrapping a Cloudify management environment.

The following diagram depicts the default implementation of the bootstrap method of installing a Cloudify management environment. The Cloudify management environment is expressed as a blueprint, therefore you can construct it differently from how it is shown here.

![Cloudify Bootstrap]({{< img "architecture/cloudify_flow_bootstrap.png" >}})


IaaS is a specific type of environment. You might choose to bootstrap, for example, on bare metal servers. 
If you have very advanced skills, you might choose to change the structure of Cloudify itself, not only the infrastructure defined during bootstrap. 