+++
title = "Level 6: Environment as a Service"
description = "Learn how to use Cloudify's Service Components feature to create dynamic topologies based on business-related inputs."
weight = 50
alwaysopen = false
+++

In Cloudify, a Service Component is a node template that encapsulates a different Cloudify deployment. The blueprint
from which the Service Component deployment is created, as well as the new deployment's inputs, can be
determined dynamically, during runtime.

Our [Environment-as-a-Service example on GitHub](https://github.com/cloudify-community/eaas-example) shows
how to design a blueprint that creates a completely different topology based on an input of "environment type" (development
vs. production).

{{%children style="h2" description="true"%}}
