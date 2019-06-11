---
layout: bt_wiki
title: Utilities Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
  - /plugins/utilities/
  - /developer/official_plugins/utilities/
---
The Utilities plugin contains several utilities for extending the use of Cloudify.

# Plugin Requirements

* Python versions:
  * 2.7.x
* Pip 9.0.1


# Compatibility

* Tested with Cloudify 4.0+


# Release History

See [releases](https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases).


# Types

### **cloudify.nodes.DeploymentProxy**
  Derived from node type: cloudify.nodes.Root.

{{% warning title="Depreciation Warning" %}}
Due to it's depreciation this feature will be supported on maintenance mode , please visit [Service Composition]({{< relref "working_with/service_composition/_index.md" >}}).

For detailed information on configuration "plugin" features, see [deployment proxy]({{< relref "working_with/official_plugins/Configuration/utilities/deploymentproxy.md" >}})

This node type enables a user to connect a deployment to another deployment, in effect enabling "chains" of applications or service.
Upload provided blueprint to manager and create deployment based on such blueprint with run install workflow.
In runtime properties will be provided outputs from deployment.

Properties:

  * `blueprint`:
    - Type: cloudify.datatypes.Blueprint
  * `deployment`:
    - Type: cloudify.datatypes.Deployment
  * `reexecute`:
    - Description: Reexecte workflows, on external deployment
  * `executions_start_args`:
    - Description: Optional parems for executions


### **cloudify.nodes.NodeInstanceProxy**
  Derived from node type: cloudify.nodes.DeploymentProxy.

For detailed information on configuration "plugin" features, see [deployment proxy]({{< relref "working_with/official_plugins/Configuration/utilities/deploymentproxy.md" >}})

This node type enables a user to connect a deployment to another deployment, in effect enabling "chains" of applications or service.
Upload provided blueprint to manager and create deployment based on such blueprint with run install workflow.
In runtime properties will be provided runtime properties from node instance.

Properties:

  * `blueprint`:
    - Type: cloudify.datatypes.Blueprint
  * `deployment`:
    - Type: cloudify.datatypes.Deployment
  * `reexecute`:
    - Description: Reexecte workflows, on external deployment
  * `executions_start_args`:
    - Description: Optional params for executions
  * `node_instance`:
    - Type: cloudify.datatypes.NodeInstance


### **cloudify.terminal.raw**
  Derived from node type: cloudify.nodes.Root.

For detailed information on configuration "plugin" features, see [terminal plugin]({{< relref "working_with/official_plugins/Configuration/utilities/terminal.md" >}})

This node type provides support for running shell commands one by one. It will save the result of each command to runtime properties.


### **configuration_loader**
  Derived from node type: cloudify.nodes.ApplicationServer.

For detailed information on configuration "plugin" features, see [ssh key plugin]({{< relref "working_with/official_plugins/Configuration/utilities/configuration.md" >}})

Create a list of parameters that take part in your deployment,
Map between the parameters you have listed and nodes you have, several parameters are going
to be used by almost every node and others are going to just be used by 2 or 3 nodes.


### **cloudify.keys.nodes.RSAKey**
  Derived from node type: cloudify.nodes.Root.

For detailed information on configuration "plugin" features, see [rest plugin]({{< relref "working_with/official_plugins/Configuration/utilities/key.md" >}})

This node type enables a user to create a private and public key.

Properties:
  * `comment`:
    - Type: string
  * `unvalidated`:
    - Description: Unvalidated parameters.
  * `passphrase`:
    - Type: string
  * `algorithm`:
    - Type: string
    - Default: RSA
  * `key_name`:
    - Type: string
  * `openssh_format`:
    - Type: boolean
  * `public_key_path`:
    - Type: string
    - Default: ~/.ssh/id_rsa.pub
  * `private_key_path`:
    - Type: string
  * `bits`:
    - Type: integer
    - Default: 2048


### **cloudify.rest.Requests**
  Derived from node type: cloudify.nodes.Root.

For detailed information on configuration "plugin" features, see [rest plugin]({{< relref "working_with/official_plugins/Configuration/utilities/rest.md" >}})

The purpose of this plugin is to provide a generic type in a blueprint in order to intergate with REST based systems. Plugin is suitable for REST API's which expose relatively high level of abstraction. General concept is to use JINJA powered templates in which we can collect number of independent REST calls in order to reflect provisioning intent. Very often it happens that certian intent requires several REST calls - therefore we can put them in a single template to make blueprint much cleaner to read.


### **cloudify.nodes.CloudInit.CloudConfig**
  Derived from node type: cloudify.nodes.Root.

For detailed information on configuration "plugin" features, see [cloud init plugin]({{< relref "working_with/official_plugins/Configuration/utilities/cloudinit.md" >}})

Cloud-Init is the standard for configuration of cloud instances. See [examples](http://cloudinit.readthedocs.io/en/latest/topics/examples.html).


### **cloudify.nodes.File**
  Derived from node type: cloudify.nodes.Root.

For detailed information on configuration "plugin" features, see [files plugin]({{< relref "working_with/official_plugins/Configuration/utilities/files.md" >}})

The files utility allows you to package a file with a blueprint and move it onto a managed Cloudify Compute node.

Properties:
  * `template_variables`:
    - Description: Variables to render Jinja templates.
  * `resource_path`:
    - Type: string
    - Description: The path relative to the blueprint where the file is stored. Currently this must be packaged in the blueprint. An external URI is not valid.
  * `mode`:
    - Type: integer
    - Description: The file permissions, such as 777. Must be provided as an integer. "0777" and 0777 are not valid. Only 777.
  * `owner`:
    - Type: string
    - Description: The owner string, such as "centos:wheel"
  * `use_sudo`:
    - Type: boolean
    - Description: Whether or not to use sudo to move, rename, delete, chown, chmod, the file.
  * `allow_failure`:
    - Type: boolean
    - Description: If the download fails, log the error and continue.
  * `file_path`:
    - Type: string
    - Description: The path on the machine where the file should be saved.
