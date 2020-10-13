---
layout: bt_wiki
title: Helm 3 Plugin
category: Official Plugins
draft: false
weight: 100
aliases: ["/plugins/helm/", "/developer/official_plugins/helm/"]
---

Helm is the first application package manager running on top of Kubernetes. It allows describing the application structure through convenient helm-charts and managing it with simple commands.
Helm uses three main concepts:

* Charts

* Repository

* Release

A Chart is a Helm package. It contains all of the resource definitions necessary to run an application, tool, or service inside of a Kubernetes cluster. Think of it like the Kubernetes equivalent of a Homebrew formula, an Apt pkg, or a Yum RPM file.

A Repository is a place where charts can be collected and shared. It's like Perl's CPAN archive or the Fedora package Database, but for Kubernetes packages.

A Release is an instance of a chart running in a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new release is created. Consider a MySQL chart. If you want two databases running in your cluster, you can install that chart twice. Each one will have it's own release, which will in turn have it's own release name.

With cloudify Helm 3 plugin you can add repositories and create releases on Kubernetes cluster.


# Plugin Requirements

* Python versions:
  * 2.7.x/3.6.x
* Kubernetes Cluster, see [example cluster](https://github.com/cloudify-community/blueprint-examples/tree/master/kubernetes).

In order to know which versions of Kubernetes Helm supports,see [Helm version support policy](https://helm.sh/docs/topics/version_skew/)


## Authentication
In order helm can interact with Kubernetes cluster, Authentication is needed.
There is only single authentication method which is kube config authentication.

### Kube Config Authentication

To configure authentication with Kubernetes, use "client_config.configuration" section in "cloudify.nodes.helm.Release" node type. The config should be a [Kube Config style](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#define-clusters-users-and-contexts) object.

One of three methods options can be used to provide the configuration:

* Kubernetes config file contained by blueprint archive.
* Kubernetes config file previously uploaded into Cloudify Manager VM.
* Content of Kubernetes config file (YAML).

Moreover, **`api_options`** can be used in addition to one of the three above (under `configuration`).  
`api_options` contains `host` (kubernetes endpoint) and `api_key` (service account token for authentication with cluster).
If provided, they will override `kubeconfig` configuration (will attach `--kube-apiserver`,`--kube-token` flags to helm install/uninstall commands).

**Example 1:**

This is an example for authentication with kubeconfig file content:

{{< highlight  yaml  >}}
 inputs:

  configuration_file_content:
    type: string

node_templates:
  
  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          file_content: {get_input: configuration_file_content } # secret also can be used.


{{< /highlight >}}


**Example 2:**

This is another example for authentication with kubeconfig file content,as a dict:

{{< highlight  yaml  >}}
 
 node_templates:
  
  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          file_content:
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

**Example 3:**

This is an example for authentication with kubeconfig file path (the file is in the blueprint archive):

{{< highlight  yaml  >}}

node_templates:
  
  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          blueprint_file_name: path/to/kubeconfig

{{< /highlight >}}

**Example 4:**

This is an example for authentication with kubeconfig file path and token:

{{< highlight  yaml  >}}

node_templates:
  
  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          blueprint_file_name: path/to/kubeconfig
          api_options:
            api_key: 'put token here (secret is recommended)'
{{< /highlight >}}

## GKE OAuth2 Tokens Authentication
 
While using gcp, an OpenID Connect Token can be generated from gcp service account in order to authenticate with kubernetes(see [kubernetes docs](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens)).
In order to refresh the token that resides in kubeconfig (or create one) from 
gcp service account before invoking helm commands, add gcp service account to the blueprint under `authentication`:
 
{{< highlight  yaml  >}}

node_templates:
  
  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          file_content: {get_secret: kube_config }
        authentication:
          gcp_service_account: { get_secret: gcp_credentials }
          
{{< /highlight >}}


**While using GKE if Kubernetes service account token isn't used it's recommended to add `authentication` section.**

# Node Types

## cloudify.nodes.helm.Binary

This node type responsible for installing helm (move the given binary to the default location).

Moreover, in order to allow different environment for every binary, this node will create 3 temporary folders for: cache, data and configuration files of Helm. It will save those paths in runtime properties.

Actually, those paths are going to override HELM_CACHE_HOME,HELM_CONFIG_HOME and HELM_DATA_HOME environment variables in each helm command we will execute.

### Properties:
  * `helm_config` - Represents Helm configuration.
    
    *type:* cloudify.types.helm.HelmConfig
    
    *required:* False
    
    Currently contains `executable_path` with default value of ''.
    
    It's not recommended use this property,
    by default Helm plugin will extract the executable to the deployment directory which safe to use.
  
  * `use_existing_resource` - If true, use an existing helm installation rather than installing it.
    
    *type:* boolean
    
    *default:* False
  * `installation_source` - Location to download the Helm installation from. Ignored if `use_existing_resource` is true.
    
    *type:* string
    
    *default:* ''
    
    You can see helm releases [here](https://github.com/helm/helm/releases) please use helm 3.X.X version.

Helm plugin uses `curl` on  `installation_source` and unzip it, then move it to `executable_path` or to default location (deployment directory) if `executable_path` is not provided.

### Example:

{{< highlight  yaml  >}}

node_templates:

  helm_install:
    type: cloudify.nodes.helm.Binary
    properties:
      use_existing_resource: false
      installation_source: <link to helm binary release zip> # e.g: 'https://get.helm.sh/helm-v3.3.1-linux-amd64.tar.gz'

{{< /highlight >}}


## cloudify.nodes.helm.Repo

This node type responsible for adding repositories to Helm client using `helm repo add` command.

### Properties
  * `helm_config` - Represents helm configuration.
  
    *type:* cloudify.types.helm.HelmConfig
    
    *required:* False
    
    Currently contains `executable_path` with default value of ''.
    
    It's not recommended use this property,
    by default Helm plugin will extract the executable to the deployment directory which safe to use.
  
  * `use_external_resource` - Indicate whether the resource exists or if Cloudify should create the resource,
    true if you are bringing an existing resource, false if you want cloudify to create it.
    In this case it means cloudify will use a repo that already exists on helm client.
    
    *type*: boolean
    
    *default*: false
  * `resource_config` - dictionary represents repo configuration.
    
    Contains:
    
     * `name` - Name of the repo that added/removed.
     
        *type*: string
     
        *required*: true
     * `repo_url` - URL of the repo to add.
     
        *type*: string
     
        *required*: true
     * `flags` -  list of flags add to both "helm repo add" and "helm repo remove" commands. For example:
{{< highlight  yaml  >}}      
- name: namespace
  value: my_namespace
{{< /highlight >}}

      If the flag not requires value, omit "value" and specify only the name as element in the list.
        *default*: []
        
**Notes**:

* On install workflow `helm repo add <name> <repo_url> <flags>` will be executed.

* On uninstall workflow `helm repo remove <name> <flags>` will be executed.

* `flags` on resource_config are common to helm repo add and helm repo remove operation.

* For adding additional flags  only to  add/remove  operation, provide flags input to start/delete operation via interface.

* All flags are helm flags. can be found in helm repo add /remove commands [documentation](https://helm.sh/docs/helm/helm_repo_add/).


### Example:

{{< highlight  yaml  >}}

node_templates:

  repo:
    type: cloudify.nodes.helm.Repo
    properties:
      resource_config:
        name: { get_input: repo_name }
        repo_url: { get_input: repo_url }
    relationships:
      - target: helm_install
        type: cloudify.helm.relationships.run_on_host

{{< /highlight >}}

## cloudify.nodes.helm.Release
This node type responsible for create release on Kubernetes cluster.

In this note type `client_config.configuration` is required in order to interact with Kubernetes Cluster.
### Properties
  * `helm_config` - Represents helm configuration.
      
    *type:* cloudify.types.helm.HelmConfig
    
   *required:* False
    
   Currently contains `executable_path` with default value of ''.
    
   It's not recommended use this property,
   by default Helm plugin will extract the executable to the deployment directory which safe to use.
  
  * `use_external_resource` - Indicate whether the resource exists or if Cloudify should create the resource,
    true if you are bringing an existing resource, false if you want cloudify to create it.
    In this case it means cloudify will use a release that already exists on helm client.
    
    *type*: boolean
    
    *default*: false
  * `client_config`:
      
    *type*: cloudify.types.helm.ClientConfig
    
    *required*: true
    
    In this section under `configuration` kubeconfig authentication will be provided as described in [Kube Config Authentication section](#kube-config-authentication).   
    One of three methods options can be used to provide the configuration:

        * Kubernetes config file contained by blueprint archive
        * Kubernetes config file previously uploaded into Cloudify Manager VM
        * Content of Kubernetes config file (YAML)
        
    Moreover, **`api_options`** can be used in addition to one of the three above (under `configuration`).  
    `api_options` contains `host` (kubernetes endpoint) and `api_key` (service account token for authentication with cluster)
    If provided, they will override `kubeconfig` configuration (will attach `--kube-apiserver`,`--kube-token` flags to helm install/uninstall commands).
  
  * `resource_config` - dictionary represents release configuration.
  
  Contains:
   
   * *name* - Name of the created release.
   
     *type*: string
        
     *required*: true
   * *chart* - Name of the chart to install.For example: stable/mysql.
   
     *type*: string
        
     *required*: true
   * *values_file* - Path to values files (in blueprint archive).
   
     *type*: string
        
     *required*: false
   * *set_values* - List of variables names and values to set. For example:

{{< highlight  yaml  >}}      
- name: namespace
  value: my_namespace
{{< /highlight >}}

Equals to --set x=y --set a=b in helm command.
    
   * *flags* - List of flags add to both `helm install` and `helm uninstall` commands. For example:
{{< highlight  yaml  >}}      
- name: namespace
  value: my_namespace
{{< /highlight >}}
      
    If the flag not requires value, omit "value" and specify only the name as element in the list.
    *default*: []
        
    *required*: false
        
**Notes**:

* `flags` are flags that common to install and uninstall.

* All the install commands will run with --wait flag in order to wait that the resources will take place in the Kubernetes cluster.

* All the install commands will run with -o=json flag in order to save the output to runtime properties (and use the manifest if needed in the future).

* Optional flags to add for install operation: --timeout, --namespace and many more.

* The operations on the release node will be installed and uninstall.

* The output of the install command will be stored in runtime properties (the output is in JSON format and includes the manifest).

Way to pass more flags to start and delete is to add interface inputs, like :
```yaml
    interfaces:
      cloudify.interfaces.lifecycle:
        start:
          implementation: helm.cloudify_helm.tasks.install_release
          inputs:
            flags:
              - name: debug
```

### Example:

{{< highlight  yaml  >}}
node_templates:

  release:
    type: cloudify.nodes.helm.Release
    properties:
      client_config:
        configuration:
          file_content: {get_secret: kube_config }
      resource_config:
        name: "myrelease"
        chart: { concat: [ { get_input: repo_name },'/', { get_input: chart_name } ] }
    relationships:
      - target: helm_install
        type: cloudify.helm.relationships.run_on_host
      - target: repo
        type: cloudify.relationships.depends_on

{{< /highlight >}}



# Relationships

**cloudify.relationships.helm.run_on_host** relationship:

This relationship job is to inject helm environment variables locations to release/repo nodes.
Target node is cloudify.nodes.helm.Binary which creates temporary environment for each binary.

The relationship is derived from the `cloudify.relationships.connected_to` relationship type.

**Every Release/Repo node in the blueprint need to use this relationship in order to interact with helm client!.**

## Example:

{{< highlight  yaml  >}}

node_templates:
  
  helm_install:
    type: cloudify.nodes.helm.Binary
    properties:
      use_existing_resource: false
      installation_source: { get_input: helm_installation_source }

  repo:
    type: cloudify.nodes.helm.Repo
    properties:
      resource_config:
        name: { get_input: repo_name }
        repo_url: { get_input: repo_url }
    relationships:
      - target: helm_install
        type: cloudify.helm.relationships.run_on_host

{{< /highlight >}}


# Workflows

## update_repositories workflow

This workflow provides the ability to update all the repositories for a Helm client.

**Parameters:**

* `node_instance_id` - Node instance ID of the cloudify.nodes.helm.Repo node type which its helm client repos will be updated.
* `flags` - Flags to add for `helm repo updade` command. The format is the same as "flags" property.


### Example of using update_repositories workflow 

Assuming the repository node type is :

{{< highlight  yaml  >}}

node_templates:

  bitnami_repo:
    type: cloudify.nodes.helm.Repo
    properties:
      resource_config:
        name: bitnami
        repo_url: https://charts.bitnami.com/bitnami
    relationships:
      - target: helm_install
        type: cloudify.helm.relationships.run_on_host

{{< /highlight >}}

`update_repositories` can triggered this way:

`cfy executions start update_repositories -d <deployment_name> -p node_instance_id=bitnami_repo_rnudof -p ./inputs.yaml`

Where `inputs.yaml` contains `flags` parameter:

{{< highlight  yaml  >}}

flags:
  - name: debug

{{< /highlight >}}



# General Notes:

* There are five different ways you can express the chart you want to install:

1. By chart reference: helm install mymaria example/mariadb.

1. By a path to a packaged chart: helm install mynginx ./nginx-1.2.3.tgz

1. By path to an unpacked chart directory: helm install mynginx ./nginx

1. By absolute URL: helm install mynginx https://example.com/charts/nginx-1.2.3.tgz

1. By chart reference and repo URL: helm install – repo https://example.com/charts/ mynginx nginx

Currently, the plugin support only the first option.

* There are helm flags that use files and not specified like: `--ca-file`, if provided under `flags` the path should be a valid path in the manager machine (and not in the blueprint archive).