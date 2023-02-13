---
title: Kubernetes Plugin
category: Official Plugins
description: With the Kubernetes Plugin you can define Kubernetes resources in your blueprints.
draft: false
weight: 100
aliases: ["/plugins/kubernetes/", "/developer/official_plugins/kubernetes/", "/working_with/official_plugins/configuration/kubernetes/"]
---

With the {{< param product_name >}} Kubernetes Plugin you can define Kubernetes resources in your blueprints.


# Plugin Requirements

* Python versions:
  * 2.7.x
* Kubernetes Cluster, see [example cluster](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes).


# Compatibility

* {{< param cfy_manager_name >}}, v5.0.5 and higher.
* Kubernetes, v1.13 and higher.
* Supports GKE.
* Supports EKS.
* Supports AKS.
* Supports Openshift.
* Supports Kubespray.

## Authentication

There are two authentication methods:

  * token-based
  * config-based

### Token-Based Authentication

{{< param product_name >}} Kubernetes Plugin [v2.1.0+](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/releases) includes support for token-based authentication.

_Note: Kubernetes client certificates are based on the private IP Address of the cluster node. You must use token-based authentication to manage a remote cluster via the public IP address._

#### Generate Authentication Token

_Note: If you install the [example cluster](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes), then this is set up for you ._

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
4. Copy this token and create a secret on your {{< param cfy_manager_name >}} with it:
{{< highlight  bash  >}}
$ cfy secrets create kubernetes_token -s eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJkZWZhdWx0Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZWNyZXQubmFtZSI6InJlZ3VsYXItdXNlci10b2tlbi1qeHhoNSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJyZWd1bGFyLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMGE3MzBiOC0yMTM5LTExZTgtODAxZC00MjAxMGEwYjBjMDQiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6ZGVmYXVsdDpyZWd1bGFyLXVzZXIifQ.m06FHyC8TbKZ1bcnxIV_JKpKrADIOYDN4BqEcTMR947fzzfTzU8QiVjYJQF4kCgAR1rC3dNYcQI8rtmwLJg3ttmAoFi_myi38Mb6JyW19vMjxUx3BK8xuiXhcReQyEt0X50koSminwQbqFqMNbtGtODqIyjfe-ePfbdbTV57n16YdtKrhpHuifkWhD26Vyskj1BWs7jmfzPmb8Q7ttKHEIsEgxjTjFxhRPMzp-UxeH1pLnd36tnfUxU9v-6dHCzJUIlYpu-IahhQmTvf5sK5eClT2h3bGJzMtDA2oji_0kFWJ0yemeJuOXX4fNNSeRo9lPPCQIlz1gBNPvSHQngwgQ
Secret `kubernetes_token` created
{{< /highlight >}}


#### Reference Authentication Token in a Blueprint

The client config-configuration-api_option dictionary supports the following values:

  - `host`: The Kubernetes API Server.
  - `api_key`: Your Kubernetes bearer token.
  - `ssl_ca_cert`: Your Kubernetes bearer token CA cert file path, or file content.
  - `cert_file`: Your certificate file path, or the file content.
  - `key_file`: Your certificate file path, or the file content.
  - `verify_ssl`: Whether to secure. (Must provide CA.)
  - `debug`: Client debug level.

The following is an example blueprint using token-based authentication:

```yaml
  nginx_deployment:
    type: cloudify.kubernetes.resources.Deployment
    properties:
      client_config:
        configuration:
          api_options:
           host: { get_input: kubernetes_api_server }
           api_key: { get_secret: kubernetes_token }
           debug: false
           verify_ssl: false
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

```

The following is an example of secure token based authentication:

```yaml

  nginx_deployment:
    type: cloudify.kubernetes.resources.Deployment
    properties:
      client_config:
        configuration:
          api_options:
            host: { get_input: kubernetes_api_server }
            api_key: { get_secret: kubernetes_token }
            ssl_ca_cert: { get_input: kubernetes_token_ca_cert }
            debug: true
            verify_ssl: true
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
```

You can then provide and input from an inputs file like this:

```yaml
kubernetes_token_ca_cert: |
    -----BEGIN CERTIFICATE-----
    MIIDKzCCAhOgAwIBAgIRALyDoSRzP4gCM2ni3NhJD/wwDQYJKoZIhvcNAQELBQAw
    ...
    ...
    -----END CERTIFICATE-----
```

For more information on generating a token and authorizing a service account, please review the following pages in Kubernetes documentation:
  * [Generate a token](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#service-account-tokens)
  * [Provide RBAC for API user](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#rolebinding-and-clusterrolebinding).


### Kube Config Authentication

Authentication with the Kubernetes Plugin is via a node that represents the Kubernetes master. The config should be a [Kube Config style](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#define-clusters-users-and-contexts) object.

One of four methods options can be used to provide the configuration:

* Kubernetes config file contained by blueprint archive
* Kubernetes config file previously uploaded into the {{< param cfy_manager_name >}} VM
* Content of Kubernetes config file (YAML)
* Kubernetes API set of properties

* With GKE it is best to use legacy cluster certificate authentication. See [here](https://cloud.google.com/kubernetes-engine/docs/how-to/iam-integration#using_legacy_cluster_certificate_or_user_credentials).

The token may have expired, in which case it will access the file "/etc/cloudify/.kube/config" if the file exists it will return an error.
**Example1:**

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

When you deploy Kubernetes Cluster with {{< param product_name >}} [Simple Kubernetes Blueprint](https://github.com/cloudify-examples/simple-kubernetes-blueprint) or [{{< param product_name >}} Kubernetes Provider](https://github.com/cloudify-incubator/cloudify-kubernetes-provider/tree/master/examples/cluster_blueprint), secrets containing the configuration are created.

**Example2:**

This is an example for authentication with kubeconfig file content:

{{< highlight  yaml  >}}
 inputs:

  configuration_file_content:
    type: string

node_templates:

  sanity_pod:
    type: cloudify.kubernetes.resources.Pod
    properties:
      client_config:
        configuration:
            file_content: { get_input: configuration_file_content }
      definition:
        apiVersion: v1
        kind: Pod
        metadata:
          name: nginx
        spec:
          containers:
          - name: nginx
            image: nginx:stable

{{< /highlight >}}

From version 2.7.0 of kubernetes plugin, every kubernetes resource can have "client_config" property, with the configuration and authentication credentials. Therefore, it's recommended to remove the "managed_by_master" relationship in the last example and add the client_config property to the storage class resource. In order to get a sense of how using this is been done you can view our [kubernetes examples](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes). On future releases of the kubernetes plugin the "managed_by_master" relationship will be removed.


# Release History

The information in this documentation is current for {{< param product_name >}} Kubernetes Plugin version 2.7.0.

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
    2. Kubernetes config file previously uploaded into the {{< param cfy_manager_name >}} VM
    3. Content of Kubernetes config file (YAML)
    4. Kubernetes API set of properties

 * `authentication`: Authentication properties of Kubernetes Cloud providers. Optional. Currently supported providers: Google Cloud Platform.    

## cloudify.kubernetes.resources.SharedCluster

**Derived from [cloudify.nodes.SharedResource]({{< relref "working_with/service_composition/shared-resource" >}}).**

Enables Kubernetes node templates in the current deployment to authenticate with an existing Kubernetes Cluster in another deployment.

The other deployment should meet the following requirements:

  * The deployment should have a node template of one of the supported Kubernetes cluster node types:
      * `cloudify.nodes.aws.eks.Cluster`
  * The deployment should expose a deployment capability named `kubernetes_configuration`, which should contain the Kubernetes cluster's kube config.

**Note**: Node templates that are connected to this node template for authentication do so with the **cloudify.relationships.kubernetes.connected_to_shared_cluster** relationship. This will refresh the Kube Config when it is called.

### Properties:
  * `resource_config`: A dictionary of type `cloudify.datatypes.SharedResource`, which accepts one key, `id`, which is the ID of the deployment containing the Kubernetes cluster. 
  * `client_config`: A dictionary with the authentication and configuration credentials of the resource. Provide the kube config content using the get_capability intrinsic function. (See example.)
  * `options`: Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.

### Example:

```yaml
  Pod:
    type: cloudify.kubernetes.resources.FileDefinedResource
    properties:
      file:
        resource_path: resources/pod.yaml
    relationships:
      - type: cloudify.relationships.kubernetes.connected_to_shared_cluster
        target: token

  token:
    type: cloudify.kubernetes.resources.SharedCluster
    properties:
      client_config:
        configuration: { get_capability: [ { get_input: deployment }, connection_details ] }
      resource_config:
        deployment:
          id: { get_input: deployment }
```


## cloudify.kubernetes.resources.ResourceBase
This is the base type of kubernetes resource.

### Properties:
  * `client_config`: A dictionary with the authentication and configuration credentials of the resource.
  * `options`: Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.

**Note**: Not required if "managed_by_master" relationship is being used.
It's not recommended to use this relationship because on next releases it will be deprecated.

## cloudify.kubernetes.resources.ResourceWithValidateStatus
This is the base type of kubernetes resource with validate_resource_status property.

derived_from cloudify.kubernetes.resources.ResourceBase.

### Properties:

 *`validate_resource_status`

       If this property set to "true" {{< param product_name >}} will wait that the resource will be in ready state before moving on.
       If the resouce isnt ready {{< param product_name >}} will validate its state again(operation retry).


        **type:** boolean

        **default:** false

## cloudify.kubernetes.resources.FileDefinedResource

This is a Kubernetes resource, such as a pod, service, deployment, which is defined in a file.

derived_from cloudify.kubernetes.resources.ResourceBase.

### Properties:

  * `file`: A dictionary with the resource definition file details.

   has these keys:

    1. `resource_path`: The path to the file relative to the blueprint.
    2. `target_path`: The path the file should be downloaded to. (Don't use this.)
    3. `template_variables` If the file has Jinja template variable references, you may provide the variables as a dictionary here.

You can look at example [here](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/blob/master/examples/file-test.yaml).

## cloudify.kubernetes.resources.MultipleFileDefinedResources

Provide a list of files containing Kubernetes resources.

derived_from cloudify.kubernetes.resources.ResourceBase.

### Properties:

  * `files`: A list of paths to YAML files containing the resources definition.


## cloudify.kubernetes.resources.BlueprintDefinedResource
This is the root type of all Kubernetes resource, such as a pod, service, deployment, which is defined in the blueprint inline.
derived_from cloudify.kubernetes.resources.ResourceWithValidateStatus.

### Properties:

  * `use_external_resource`: Indicates that you want to use an existing resource in Kubernetes if it exists.
  * `definition`: The resource definition. (The content of a Kubernetes template file.) This may be a string or JSON or YAML.
  * `options`: Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.

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
  * `cloudify.kubernetes.resources.CustomResourceDefinition`
  * `cloudify.kubernetes.resources.DaemonSet`
  * `cloudify.kubernetes.resources.Namespace`
  * `cloudify.kubernetes.resources.Node`
  * `cloudify.kubernetes.resources.ServiceAccount`
  * `cloudify.kubernetes.resources.Secret`
  * `cloudify.kubernetes.resources.ClusterRole`
  * `cloudify.kubernetes.resources.Role`
  * `cloudify.kubernetes.resources.RoleBinding`
  * `cloudify.kubernetes.resources.ClusterRoleBinding`


## More kubernetes resources node types

All the resources in the list are derive from "cloudify.kubernetes.resources.ResourceBase" node type and are "inline style" resources.

  * `cloudify.kubernetes.resources.StorageClass`
  * `cloudify.kubernetes.resources.StatefulSet`
  * `cloudify.kubernetes.resources.PodSecurityPolicy`
  * `cloudify.kubernetes.resources.NetworkPolicy`
  * `cloudify.kubernetes.resources.Ingress`
  * `cloudify.kubernetes.resources.PersistentVolumeClaim`

For more information, check [plugin.yaml](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/blob/master/plugin.yaml).

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
This allows you to define a resource type that is supported by the Kubernetes API, but has not yet been incorporated into the Kubernetes plugin.

### Properties:
  * `client_config`: A dictionary with the authentication and configuration credentials of the resource.

  **Note**: Not required if "managed_by_master" relationship is being used.
    It`s not recommended to use this relationship because on next releases it will be deprecated.
  * `use_external_resource`: Indicates that you want to use an existing resource in Kubernetes(if it exist).
  * `definition`: The resource definition. (The content of a Kubernetes template file.) This may be a string or JSON or YAML.
  * `options`: Kubernetes API mappings, such as ```{ 'namespace': 'default' }```.
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

# Using file defined resources
Kubernetes plugin supports define resources from type : "cloudify.kubernetes.resources.FileDefinedResource".
This option allows the user to write the kubernetes resource definition in a template yaml file and refer to it from the blueprint.
like in this [example](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/blob/master/examples/file-test.yaml).

We are strongly recommend to define your kubernetes resources in that way and not in the "inline" defenition style(our plugin supports both methods).
Here is an inline style resource defenition [example](https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/blob/master/examples/test-resource.yaml).



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

## refresh_and_store_token
    
Some Kubernetes clusters, e.g. EKS, may have a TTL on the lifetime of a token. Use this workflow to refresh the token that is stored in a secret.

### Parameters

  * `kubernetes_cluster_node_instance_id`: The ID of the eks_cluster Node-instances.
  * `deployment_capability_name`:  The default is connection_details
  * `service_account_node_instance_id`: The ID of the new_service_account Node-instances
  * `secret_token_node_instance_id`: The ID of the secret Node-instances
  * `store_token_and_kubeconfig_id`: The ID of the store_token_and_kubeconfig Node-instances
 
### refresh and store token command Example

cfy executions start refresh_and_store_token -d eks -p kubernetes_cluster_node_instance_id=eks_cluster_fa7cbe -p deployment_capability_name=connection_details -p service_account_node_instance_id=new_service_account_qzpvr7 -p secret_token_node_instance_id=secret_akvafl -p store_token_and_kubeconfig_id=store_token_and_kubeconfig_jvnp1h

# Using the kubernetes plugin with EKS, AKS, GKE
The kubernetes plugin works with EKS, AKS, GKE.

## EKS cluster

On blueprint examples repository, there is an example of [deploying an EKS cluster.](https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/aws-eks/README.md)

this example demonstrates a deployment of eks cluster with one node group.
We will explain how we used the AWS plugin alongside kubernetes plugin on this example in order to deploy the cluster.

Firstly, in order to create an eks cluster, the blueprint creates all necessary infrastructure, i.e. VPC, subnets, security groups, etc.
After creating the cluster, Cloudify stores the kube config in runtime properties.
For more information about those aws instances see [AWS plugin documentation]({{< relref "working_with/official_plugins/Infrastructure/aws.md" >}}).

After we have the eks cluster and the node group deployed,
the blueprint defines service account and token node types whose purpose is to generate a token that can be used for simpler plugin authentication.
Then, create a sanity_master node instance:

{{< highlight  yaml  >}}

 sanity_master:
    type: cloudify.kubernetes.nodes.Master
    properties:
      configuration: &sanity_master_configuration
        api_options:
          host:  { get_attribute: [eks_cluster, kubeconf, clusters, 0, cluster, server ] }
          api_key: { get_secret: kubernetes_token }
          debug: false
          verify_ssl: false
    relationships:
      - type: cloudify.relationships.depends_on
        target: store_token

{{< /highlight >}}

The authentication is done with the api options using the service account token.

And now,using the kubernetes plugin it creates resources in the cluster like pods :

{{< highlight  yaml  >}}

  sanity_pod:
    type: cloudify.kubernetes.resources.Pod
    properties:
      client_config:
        configuration: *sanity_master_configuration
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
      - type: cloudify.relationships.depends_on
        target: sanity_master

{{< /highlight >}}



## GKE cluster

On examples repository, there is an example of [deploying GKE cluster.](https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/gcp-gke/blueprint.yaml)

This example demonstrates a deployment of kubernetes cluster consists of one node pool(with 2 nodes) and one pod.

In order to deploy the cluster, GCP plugin alongside kubernetes plugin used.

On gcp, the cluster creation is done by using the cloudify.gcp.nodes.KubernetesCluster node type:

This node type defined on gcp plugin, for more details see [gcp plugin doumentation]({{< relref "working_with/official_plugins/Infrastructure/gcp.md" >}}).

Here is how it is done on the example blueprint:

{{< highlight  yaml  >}}
  kubernetes-cluster:
    type: cloudify.gcp.nodes.KubernetesCluster
    properties:
      name: { concat: [ { get_input: resource_prefix }, '-cluster']}
      gcp_config: *gcp_config
{{< /highlight >}}

After the cluster and node pool created, using the kubernetes plugin the blueprint
defines a master node and authenticate to gcp using the gcp service account:

{{< highlight  yaml  >}}

  sanity_master:
    type: cloudify.kubernetes.nodes.Master
    properties:
      authentication: &client_config_authentication
        gcp_service_account: { get_input: gcp_credentials }
      configuration: &client_config_configuration
        api_options:
          host: { concat: [ 'https://', { get_attribute: [kubernetes-cluster-attributes, endpoint] }]}
          verify_ssl: false
          debug: false
    relationships:
      - type: cloudify.relationships.depends_on
        target: kubernetes-cluster-attributes
      - type: cloudify.relationships.depends_on
        target: kubernetes-cluster-node-pool

{{< /highlight >}}

Then, with the same credentials it creates a pod.


## AKS cluster

On blueprints examples repository, there is an example of [deploying an AKS cluster.](https://github.com/cloudify-community/blueprint-examples/blob/master/kubernetes/azure-aks/blueprint.yaml)

This example demonstrates a deployment of aks cluster with one node pool and three nodes inside the nodepool.
In order to deploy the cluster, Azure plugin alongside kubernetes plugin used.

Firstly, in order to create an AKS cluster the blueprint creates resource group on azure.
Then, it creates the aks managed cluster and save the kubeconfig content in its runtime properties.
you can read more about those Azure instances in our [Azure plugin documentation]({{< relref "working_with/official_plugins/Infrastructure/azure.md" >}}).

After AKS cluster and the node pool deployed, the blueprint defines service account and token node types whose purpose is to generate a token that can be used for simpler plugin authentication.
Then it creates a sanity_master node instance:

{{< highlight  yaml  >}}

sanity_master:
type: cloudify.kubernetes.nodes.Master
properties:
  configuration: &sanity_master_configuration
    api_options:
      host:  { get_attribute: [managed_cluster, kubeconf, clusters, 0, cluster, server ] }
      api_key: { get_secret: kubernetes_token }
      debug: false
      verify_ssl: false
relationships:
  - type: cloudify.relationships.depends_on
    target: store_token


{{< /highlight >}}

The authentication is done with the api options using the service account token.

and now, using the kubernetes plugin it creates resource in the cluster(pod):

{{< highlight  yaml  >}}

  sanity_pod:
    type: cloudify.kubernetes.resources.Pod
    properties:
      client_config:
        configuration: *sanity_master_configuration
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
      - type: cloudify.relationships.depends_on
        target: sanity_master

{{< /highlight >}}

## CustomResourceDefinition and Custom Objects

The Cloudify Kubernetes Plugin supports creating and using [CustomResourceDefinition](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)s.

To create a **CustomResourceDefinition**, create a new Kubernetes Resource Node, like you would with any other supported resource type, by providing the path to a Kubernetes resource template in your node template:

```yaml
  resource:
    type: cloudify.kubernetes.resources.FileDefinedResource
    properties:
      client_config: { get_input: **client_config }
      file:
        resource_path: resources/crd.yaml
```

In your `crd.yaml` file, provide the definition for your **CustomDefinedResource**.

You can also use **CustomDefinedResource**s with the Kubernetes plugin. Usages of **CustomDefinedResource**s are referred to as [Custom Objects](https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#create-custom-objects).

### When using **Custom Objects**, you must add specific `annotations` to the `metadata` section of the resource.

Specify the following keys in your `metadata:annotations` section:

 - cloudify-crd-group
 - cloudify-crd-plural
 - cloudify-crd-version

Cloudify needs these keys in order to identify the resource as a usage of a **CustomDefinedResource**.
_An alternative method of providing these keys is available when using the **cloudify.kubernetes.resources.CustomObject** node type. See the **cloudify.kubernetes.resources.CustomObject** example below._

Define a **CustomDefinedResource** and use it in the same Kubernetes template:

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  # This value is used in the cloudify-crd-group annotation in the usage of the CRD.
  group: stable.example.com
  versions:
  # This value is used in the cloudify-crd-version annotation in the usage of the CRD.
    - name: v1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  scope: Namespaced
  names:
  # This value is used in the cloudify-crd-plural annotation in the usage of the CRD.
    plural: crontabs
    singular: crontab
    kind: CronTab
    shortNames:
    - ct
---
apiVersion: "stable.example.com/v1"
kind: CronTab
metadata:
  name: my-new-cron-object
  annotations:
    # See comments in the CRD defintion above for where to find these values.
    cloudify-crd-group: stable.example.com
    cloudify-crd-plural: crontabs
    cloudify-crd-version: v1
spec:
  cronSpec: "* * * * */5"
  image: my-awesome-cron-image
```

Using the **cloudify.kubernetes.resources.CustomObject** node type:

```yaml
  resource:
    type: cloudify.kubernetes.resources.CustomObject
    properties:
      client_config: { get_input: **client_config }
      options:
        group: stable.example.com
        plural: crontabs
        version: v1
      definition:
        apiVersion: "stable.example.com/v1"
        kind: CronTab
        metadata:
          name: my-new-cron-object
          annotations:
            # See comments in the CRD defintion above for where to find these values.
            cloudify-crd-group: stable.example.com
            cloudify-crd-plural: crontabs
            cloudify-crd-version: v1
        spec:
          cronSpec: "* * * * */5"
          image: my-awesome-cron-image

```


# Relationship

## cloudify.relationships.kubernetes.connected_to_shared_cluster

Connect Kubernetes resource node templates to an existing Kubernetes cluster. Target node type must be **cloudify.kubernetes.resources.SharedCluster**.



