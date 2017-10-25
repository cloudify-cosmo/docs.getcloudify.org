---
layout: bt_wiki
title: Kubernetes Plugin
category: Plugins
draft: false
weight: 100
---

The Kubernetes plugin enables you to deploy Kubernetes resources to a Kubernetes cluster.
For information about the library, [click here](https://github.com/kubernetes-incubator/client-python/tree/v1.0.2).

# Plugin Requirements

* Python versions:
  * 2.7.x
* Kubernetes Cluster [see example cluster](https://github.com/cloudify-examples/simple-kubernetes-blueprint/tree/4.0.1).


# Compatibility

* Tested with Cloudify Premium 4.0.1 and Community Version 17.3.31
* Tested on Kubernetes 1.6.4, 1.7.5, 1.8.1.


# Release History

The information in this documentation is current for Cloudify Kubernetes Plugin version 1.2.2.

See [releases](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases).


# Example

This example demonstrates how to add resource definition in your node template.

```yaml
  my_application:
    type: cloudify.kubernetes.resources.MultipleFileDefinedResources
    properties:
      files:
        - resource_path: resources/my_app_service.yaml
        - resource_path: resources/my_app_pod.yaml
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: master

  master:
    type: cloudify.kubernetes.nodes.Master
    properties:
      configuration:
        file_content: { get_input: kubernetes_configuration_file_content }
```

**Many more examples are available [here](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/tree/master/examples).**

# Types

## cloudify.kubernetes.nodes.Master
This node represents an existing Kubernetes master.

### Properties:
  * `configuration`: A master config, one of the following:
    1. Kubernetes config file contained by blueprint archive
    2. Kubernetes config file previously uploaded into Cloudify Manager VM
    3. Content of Kubernetes config file (YAML)
    4. Kubernetes API set of properties

## cloudify.kubernetes.resources.FileDefinedResource
This is a Kubernetes resource, such as a pod, service, deployment, which is defined in a file.

### Properties:
  * `file`: The path to the file relative to the blueprint.
  * `target_path`: The path the file should be downloaded to. (Don't use this.)
  * `template_variables` If the file has Jinja template variable references, you may provide the variables as a dictionary here.

## cloudify.kubernetes.resources.MultipleFileDefinedResources

Provide a list of files containing Kubernetes resources.

### Properties:

  * `files` a list of resource_path's.


## cloudify.kubernetes.resources.BlueprintDefinedResource
This is the root type of all Kubernetes resource, such as a pod, service, deployment, which is defined in the blueprint inline.

### Properties:
  * `definition` The resource definition. (The content of a Kubernetes template file.) This may be a string or JSON or YAML.
  * `options` Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.

### Derived resource types:

  Check the [plugin.yaml](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/blob/master/plugin.yaml) for latest additions.

  * `cloudify.kubernetes.resources.Deployment`
  * `cloudify.kubernetes.resources.Pod`
  * `cloudify.kubernetes.resources.Service`
  * `cloudify.kubernetes.resources.ReplicaSet`
  * `cloudify.kubernetes.resources.ReplicationController`
  * `cloudify.kubernetes.resources.PersistentVolume`
  * `cloudify.kubernetes.resources.ConfigMap`
  * `cloudify.kubernetes.resources.CustomBlueprintDefinedResource` (See below).
  * `cloudify.kubernetes.resources.ReplicaSet`
  * `cloudify.kubernetes.resources.ReplicaSet`


## cloudify.kubernetes.resources.CustomBlueprintDefinedResource
This allows you to define a resource type that is supported by the Kubernetes API, but has not yet been incorporated into the Kubneretes plugin.

### Properties:
  * `definition` The resource definition. (The content of a Kubernetes template file.) This may be a string or JSON or YAML.
  * `options` Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.
  * `api_mapping`: The Kubernetes lifecycle mappings for create, read, and delete.

### Example:

This is an example of a custom blueprint defined resource:

```yaml

node_types:

  cloudify.kubernetes.resources.PersistentVolumeClaim:
    derived_from: cloudify.kubernetes.resources.CustomBlueprintDefinedResource
    properties:
      api_mapping:
        default:
          create:
            api: CoreV1Api
            method: create_namespaced_persistent_volume_claim
            payload: V1PersistentVolumeClaim
          read:
            api: CoreV1Api
            method: read_namespaced_persistent_volume_claim
          delete:
            api: CoreV1Api
            method: delete_namespaced_persistent_volume_claim
            payload: V1DeleteOptions
```
