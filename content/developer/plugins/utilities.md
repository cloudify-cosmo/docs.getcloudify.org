---
layout: bt_wiki
title: Utilities Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The Utilities plugin contains several utilities for extending the use of Cloudify.


# Plugin Requirements

* Python versions:
  * 2.7.x
* Pip 9.0.1


# Compatibility

* Tested with Cloudify Premium 4.0.1 and Community Version 17.3.31


# Release History

See [releases](https://github.com/cloudify-incubator/cloudify-utilities-plugin/releases).


# Features

- [Deployment Proxy](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_deployment_proxy/README.md)
- [SSH Key](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_ssh_key/README.md)
- [Configuration](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_configuration/README.md)
- [Terminal](https://github.com/cloudify-incubator/cloudify-utilities-plugin/blob/master/cloudify_terminal/README.md)


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


Node Instance Proxy:

```yaml
  node_instance_proxy:
    type: cloudify.nodes.NodeInstanceProxy
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
        node_instance:
          node:
            id: some_node_template
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


