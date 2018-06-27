---
layout: bt_wiki
title: Kubernetes Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
  - /plugins/kubernetes/
  - /developer/official_plugins/kubernetes/
---

With the Cloudify Kubernetes Plugin you can define Kubernetes resources in your blueprints.


# Plugin Requirements

* Python versions:
  * 2.7.x
* Kubernetes Cluster [see example cluster](https://github.com/cloudify-examples/simple-kubernetes-blueprint/tree/8e131bed1e146fb83a3888387869a0e4bf72ed88). GKE is also supported.


# Compatibility

* Tested with Cloudify Premium 4.0.1, 4.1, 4.2, 4.3.0 and Community Versions 17.3.31 and 17.11.22
* Tested on Kubernetes 1.6.4, 1.7.5, 1.8.1, 1.8.3, 1.8.3-gke.0, 1.8.4, 1.9.3.
* Tested with GKE.

## Authentication

There are two authentication methods: token-based and config-based

_Note: Kubernetes client certificates are based on the private IP Address of the cluster node. You must use token-based authentication to manage a remote cluster via the public IP address._


### Token-Based Authentication

Cloudify Kubernetes Plugin [v2.1.0+](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases) includes support for token-based authentication.

#### Generate Authentication Token

To generate your authentication token, you must: 

1. Create a Service Account and Cluster Role Binding:
  
  a.  Create a _sa-crb.yaml_ file on your Kubernetes Master.
    {{< highlight  yaml  >}}
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: examples-user
      namespace: default
    ---
    apiVersion: rbac.authorization.k8s.io/v1beta1
    kind: ClusterRoleBinding
    metadata:
      name: examples-user
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: ClusterRole
      name: cluster-admin
    subjects:
    - kind: ServiceAccount
      name: examples-user
      namespace: default
    {{< /highlight >}}
  b. Install the Service Account and Cluster Role Binding:
    {{< highlight  bash  >}}
    $ kubectl create -f sa-crb.yaml
    ...
    {{< /highlight >}}
3. Now extract the token:
{{< highlight  bash  >}}
$ kubectl -n default describe secret $(kubectl -n default get secret | grep examples-user | awk '{print $1}') | grep 'token:' | awk '{print $2}'
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InJlZ3VsYXItdXNlci10b2tlbi1qeHhoNSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJyZWd1bGFyLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMGE3MzBiOC0yMTM5LTExZTgtODAxZC00MjAxMGEwYjBjMDQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpyZWd1bGFyLXVzZXIifQ.m06FHyC8TbKZ1bcnxIV_JKpKrADIOYDN4BqEcTMR947fzzfTzU8QiVjYJQF4kCgAR1rC3dNYcQI8rtmwLJg3ttmAoFi_myi38Mb6JyW19vMjxUx3BK8xuiXhcReQyEt0X50koSminwQbqFqMNbtGtODqIyjfe-ePfbdbTV57n16YdtKrhpHuifkWhD26Vyskj1BWs7jmfzPmb8Q7ttKHEIsEgxjTjFxhRPMzp-UxeH1pLnd36tnfUxU9v-6dHCzJUIlYpu-IahhQmTvf5sK5eClT2h3bGJzMtDA2oji_0kFWJ0yemeJuOXX4fNNSeRo9lPPCQIlz1gBNPvSHQngwgQ
{{< /highlight >}}
4. Copy this token and create a secret on your cloudify manager with it:
{{< highlight  bash  >}}
$ cfy secrets create kubernetes_token -s eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InJlZ3VsYXItdXNlci10b2tlbi1qeHhoNSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJyZWd1bGFyLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMGE3MzBiOC0yMTM5LTExZTgtODAxZC00MjAxMGEwYjBjMDQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpyZWd1bGFyLXVzZXIifQ.m06FHyC8TbKZ1bcnxIV_JKpKrADIOYDN4BqEcTMR947fzzfTzU8QiVjYJQF4kCgAR1rC3dNYcQI8rtmwLJg3ttmAoFi_myi38Mb6JyW19vMjxUx3BK8xuiXhcReQyEt0X50koSminwQbqFqMNbtGtODqIyjfe-ePfbdbTV57n16YdtKrhpHuifkWhD26Vyskj1BWs7jmfzPmb8Q7ttKHEIsEgxjTjFxhRPMzp-UxeH1pLnd36tnfUxU9v-6dHCzJUIlYpu-IahhQmTvf5sK5eClT2h3bGJzMtDA2oji_0kFWJ0yemeJuOXX4fNNSeRo9lPPCQIlz1gBNPvSHQngwgQ
Secret `kubernetes_token` created
{{< /highlight >}}


#### Reference Authentication Token in a Blueprint

The following is an example blueprint using token-based authentication:

{{< highlight  yaml  >}}

tosca_definitions_version: cloudify_dsl_1_3

imports:
  - http://www.getcloudify.org/spec/cloudify/4.3/types.yaml
  - http://www.getcloudify.org/spec/kubernetes-plugin/2.3.1/plugin.yaml

inputs:

  kubernetes_master_configuration:
    default:
      host: { concat: [ 'https://', { get_secret: kubernetes_master_ip}, ':', { get_secret: kubernetes_master_port } ] }
      api_key: { get_secret: kubernetes_token }
      debug: false
      verify_ssl: false

  kubernetes_api_options:
    description: >
      kubernetes api options
    default: { get_input: kubernetes_master_configuration }

node_templates:

  kubernetes_master:
    type: cloudify.kubernetes.nodes.Master
    properties:
      configuration:
        api_options: { get_input: kubernetes_api_options }

  nginx_deployment:
    type: cloudify.kubernetes.resources.Deployment
    properties:
      definition:
        apiVersion: extensions/v1beta1
        kind: Deployment
        metadata:
          name: nginx-deployment
        spec:
          selector:
            matchLabels:
              app: nginx
          replicas: 2
          template:
            metadata:
              labels:
                app: nginx
            spec:
              containers:
              - name: nginx
                image: nginx:1.7.9
                ports:
                - containerPort: 80
      options:
        grace_period_seconds: 5
        propagation_policy: 'Foreground'
        namespace: 'default'
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master

{{< /highlight >}}


### Kube Config Authentication

Authentication with the Kubernetes Plugin is via a node that represents the Kubernetes master. The config should be a [Kube Config style](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#define-clusters-users-and-contexts) object. 

One of four methods options can be used to provide the configuration:

* Kubernetes config file contained by blueprint archive
* Kubernetes config file previously uploaded into Cloudify Manager VM
* Content of Kubernetes config file (YAML)
* Kubernetes API set o properties

* With GKE it is best to use legacy cluster certificate authentication. See [here](https://cloud.google.com/kubernetes-engine/docs/how-to/iam-integration#using_legacy_cluster_certificate_or_user_credentials). 

**Example:**

{{< highlight  yaml  >}}
  kubernetes_master:
    type: cloudify.kubernetes.nodes.Master
    properties:
      configuration:
        apiVersion: v1
        kind: Config
        preferences: {}
        current-context: kubernetes-admin@kubernetes
        clusters:
        - name: kubernetes
          cluster:
            certificate-authority-data: { get_input: kubernetes_certificate_authority_data }
            server: { concat: [ 'https://', { get_input: kubernetes_master_ip}, ':', { get_input: kubernetes_master_port } ] }
        contexts:
        - name: kubernetes-admin@kubernetes
          context:
            cluster: kubernetes
            user: kubernetes-admin
        users:
        - name: kubernetes-admin
          user:
            client-certificate-data: { get_input: kubernetes-admin_client_certificate_data }
            client-key-data:{ get_input: kubernetes-admin_client_key_data }
{{< /highlight >}}

When you deploy Kubernetes Cluster with Cloudify [Simple Kubernetes Blueprint](https://github.com/cloudify-examples/simple-kubernetes-blueprint) or [Cloudify Kubernetes Provider](https://github.com/cloudify-incubator/cloudify-kubernetes-provider/tree/master/examples/cluster_blueprint), secrets containing the configuration are created.


# Release History

The information in this documentation is current for Cloudify Kubernetes Plugin version 2.3.1.

See [releases](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases).


# Example

This example demonstrates demonstrates a basic node template usage.

{{< highlight  yaml  >}}
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
{{< /highlight >}}

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
  * `cloudify.kubernetes.resources.StorageClass`
  * `cloudify.kubernetes.resources.DaemonSet`
  * `cloudify.kubernetes.resources.Node`
  * `cloudify.kubernetes.resources.ServiceAccount`
  * `cloudify.kubernetes.resources.Secret`
  * `cloudify.kubernetes.resources.ClusterRole`
  * `cloudify.kubernetes.resources.Role`
  * `cloudify.kubernetes.resources.RoleBinding`
  * `cloudify.kubernetes.resources.ClusterRoleBinding`




### Deletion Propagation

Some Kubernetes resources create other Kubernetes resources. If you delete them, the default behavior of the Kubernetes Python library is to orphan those resources. To prevent this, create a propagation policy:

{{< highlight  yaml  >}}

  nginx_deployment:
    type: cloudify.kubernetes.resources.Deployment
    properties:
      ...
      options:
        grace_period_seconds: 5
        propagation_policy: 'Foreground'
        namespace: 'default'
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master

{{< /highlight >}}


## cloudify.kubernetes.resources.CustomBlueprintDefinedResource
This allows you to define a resource type that is supported by the Kubernetes API, but has not yet been incorporated into the Kubneretes plugin.

### Properties:
  * `definition` The resource definition. (The content of a Kubernetes template file.) This may be a string or JSON or YAML.
  * `options` Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.
  * `api_mapping`: The Kubernetes lifecycle mappings for create, read, and delete.

### Example:

The plugin can be easily extended by referencing create, read, and delete api mappings for these supported [APIs](https://github.com/kubernetes-incubator/client-python/tree/v1.0.2/kubernetes/client/apis).

This is an example of a custom blueprint defined resource:

{{< highlight  yaml  >}}
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
{{< /highlight >}}


# Workflows

In addition to support for [built-in workflows]({{< relref "working_with/workflows/built-in-workflows.md" >}}), the Kubernetes Plugin supports the following additional workflows:

## update_resource_definition

Updates the resource definition of a **cloudify.kubernetes.resources.BlueprintDefinedResource**.

### Parameters

  * `node_instance_id`: The ID of the Node Instance that you want to update.
  * `resource_definition_changes`: A dict with the changes to the sections of the resource definition that you want to make.

### Update Resource Definition Example

Let's say that you created an `nginx` pod with the following blueprint resource definition:

{{< highlight  yaml  >}}
  nginx:
    type: cloudify.kubernetes.resources.Pod
    properties:
      definition:
        apiVersion: v1
        kind: Pod
        metadata:
          name: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:stable
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: master
{{< /highlight >}}

You specified "stable" as the version. Let's say that you want to update the version.

You would do so like this:

{{< highlight  bash  >}}
cfy executions start update_resource_definition -d pod -vv -p resource_definition_changes="
{
  'spec': {
    'containers': [{
      'name': 'nginx',
      'image': 'nginx:latest',
    }],
  }
}" -p node_instance_id=nginx_9pqgdu
{{< /highlight >}}

# Further reading

The plugin is based on the Kubernetes [Python Client](https://github.com/kubernetes-client/python/tree/v4.0.0) library.
