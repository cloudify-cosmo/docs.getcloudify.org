---
layout: bt_wiki
title: The Bootstrap Flow
category: Manager Architecture
draft: false
abstract: Describes the flow of bootstrapping a Cloudify Management Environment
weight: 300
---


![Cloudify Bootstrap]({{ c.img("architecture/cloudify_flow_bootstrap.png" ) }})

* This diagram depicts the default (and naive) implementation of the bootstrap method. Since Cloudify's Management Environment is expressed as a blueprint, it can be constructed differently be the user.
* IaaS is a specific case of an environment. A user can decide to bootstrap, for instance, on bare metal server(s).
* Very advanced users can even change the structure of Cloudify itself (not only the infrastructure laid during bootstrap). This will be covered in the future as Cloudify becomes more and more modular.