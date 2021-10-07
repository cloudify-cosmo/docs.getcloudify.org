+++
title = "Level 6: Environment as a Service"
description = "Learn how to use the Service Components feature to create dynamic topologies based on business-related inputs."
weight = 60
alwaysopen = false
+++

# Level 6: Environment as a Service

This example demonstrate how to use {{< param product_name >}}  [Service Component]({{< relref "working_with/service_composition/" >}}) to manage development and production environments.

The [Service Component]({{< relref "working_with/service_composition/" >}}) is a node template that encapsulates a different deployment. The blueprint from which the Service Component deployment is created, as well as the new deployment's inputs, can be determined dynamically, during runtime.

In this example, we use a stack based on Kubernetes, Postgress as the DB, and S3 as the storage system. Each of those services is referenced by a separate service component.  The exact blueprint per component is determined at runtime based on the environment type.

In the case of a development environment, we are using a single instance per service and can also run all those services in a single VM. In the production case, we are using a fully managed version of those services with EKS as the Kubernetes cluster, RDS as the managed DB, and S3 as the managed storage services as illustrated in the diagram below.

![Development Production EaaS Use Case]( /images/trial_getting_started/level-6-dev-pord-eaas.png )


Our [Environment-as-a-Service example on GitHub](https://github.com/cloudify-community/eaas-example) shows
how to design a blueprint that creates a completely different topology based on an input of "environment type" (development
vs. production).

{{%children style="h2" description="true"%}}
