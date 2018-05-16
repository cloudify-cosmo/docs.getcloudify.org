---
layout: bt_wiki
title: Utilities Plugin
category: Official Plugins
draft: false
weight: 100
aliases: /plugins/utilities/
---
The Utilities plugin contains several utilities for extending the use of Cloudify.

# Plugin Requirements

* Python versions:
  * 2.7.x
* Pip 9.0.1


# Compatibility

* Tested with Cloudify 4.0.1, Cloudify 4.2, and Cloudify 4.3.


# Release History

See [releases](https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases).


# Types

### **cloudify.nodes.DeploymentProxy**
  Derived from node type: cloudify.nodes.Root.

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

This node type provides support for running shell commands one by one. It will save the result of each command to runtime properties.


### **configuration_loader**
  Derived from node type: cloudify.nodes.ApplicationServer.

Create a list of parameters that take part in your deployment,
Map between the parameters you have listed and nodes you have, several parameters are going
to be used by almost every node and others are going to just be used by 2 or 3 nodes.


### **cloudify.keys.nodes.RSAKey**
  Derived from node type: cloudify.nodes.Root.

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

The purpose of this plugin is to provide a generic type in a blueprint in order to intergate with REST based systems. Plugin is suitable for REST API's which expose relatively high level of abstraction. General concept is to use JINJA powered templates in which we can collect number of independent REST calls in order to reflect provisioning intent. Very often it happens that certian intent requires several REST calls - therefore we can put them in a single template to make blueprint much cleaner to read.


### **cloudify.nodes.CloudInit.CloudConfig**
  Derived from node type: cloudify.nodes.Root.

Cloud-Init is the standard for configuration of cloud instances. See [examples](http://cloudinit.readthedocs.io/en/latest/topics/examples.html).


### **cloudify.nodes.File**
  Derived from node type: cloudify.nodes.Root.

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


# Examples

Deployment Proxy:

```yaml
  deployment_proxy:
    type: cloudify.nodes.DeploymentProxy
    properties:
      resource_config:
        blueprint:
          id: deployment_proxy
          blueprint_archive: { get_input: bp_dep_archive }
          main_file_name: blueprint.yaml
        deployment:
          id: deployment_proxy
          outputs:
            key: deployment_proxy_output
```

Key:

```yaml
  agent_key:
    type: cloudify.keys.nodes.RSAKey
    properties:
      resource_config:
        public_key_path: ~/.ssh/id_rsa.pub
        private_key_path:~/.ssh/id_rsa
        openssh_format: true
      use_secret_store: false
      key_name: id_rsa
    interfaces:
      cloudify.interfaces.lifecycle:
        create:
          implementation: keys.cloudify_ssh_key.operations.create
          inputs:
            store_private_key_material: true
```
