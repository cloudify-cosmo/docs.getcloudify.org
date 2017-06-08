---
layout: bt_wiki
title: Kubernetes Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The Kubernetes Plugin enables you to deploy Kubernetes resources against an existing Kubernetes cluster.
For information about the library, [click here](https://github.com/kubernetes-incubator/client-python/tree/v1.0.2).

# Plugin Requirements

* Python versions:
  * 2.7.x
* Kubernetes Cluster (See example)[https://github.com/cloudify-examples/simple-kubernetes-blueprint/tree/4.0.1].


# Compatibility

* Tested with Cloudify Premium 4.0.1 and Community Version 17.3.31
* Tested with Kubernetes 1.6


# Release History

See [releases](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases).


# Example

Add resource definition in your node template like this:

```yaml
  nginx_pod:
    type: cloudify.kubernetes.resources.Pod
    properties:
      definition:
        apiVersion: v1
        metadata:
          name: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:1.7.9
            ports:
            - containerPort: 80
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master
```
