---

title: Upgrading to a newer version


weight: 900

---
## Overview
The Cloudify Manager in-place upgrade process enables the upgrade of all running Manager components to a newer version.
Before starting the manager upgrade, it is important to understand the upgrade process. The following will cover the end to end tasks required for preforming
an in-place upgrade.

{{% gsNote title="Important Note" %}}The Cloudify Manager in-place upgrade is supported for versions 3.4 and above.{{% /gsNote %}}


## Configuration
Upgrading the running Cloudify Manager requires having the latest [simple-manager-blueprint](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint.yaml) at hand.
This blueprint will be used to configure and install the upgraded Cloudify Manager.

### Required Inputs
Executing the Manage upgrade requires specifying the following inputs in the [simple-manager-blueprint-inputs.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint-inputs.yaml):

* `private_ip` - The manager's private IP address. This address will be used when reconfiguring services as part of the upgrade process.
* `ssh_user` - SSH user used to connect to the manager.
* `ssh_key_filename` - SSH key path used to connect to the manager.

These inputs are mandatory when using the CLI used for bootstrapping.

### Node Input Properties

By default, the upgrade process is set to reuse the properties used upon bootstrap or previous upgrade. This behavior can be overridden by setting `use_existing_on_upgrade` property to `false`
in the appropriate service node type specified in the [manager-types.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/types/manager-types.yaml).

Changing node properties is possible for any of the service nodes. A good example would be changing the Elasticsearch port, that is currently set to `9200`, to port `9201`.
This would require the following to be set in the [manager-types.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/types/manager-types.yaml):

{{< gsHighlight  yaml >}}
node_types:
  ...
  manager.nodes.Elasticsearch:
    derived_from: cloudify.nodes.DBMS
    properties:
      use_existing_on_upgrade:
        description: Use existing elasticsearch configuration
        type: string
        default: false
      es_endpoint_port:
        type: integer
        default: { get_input: elasticsearch_endpoint_port }
        ...
{{< /gsHighlight >}}

And in the [simple-manager-blueprint-inputs.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint-inputs.yaml) set the port to `9201`:

{{< gsHighlight  yaml >}}
elasticsearch_endpoint_port: 9201
{{< /gsHighlight >}}

Once the `use_existing_on_upgrade` property is set to `false`, it will apply to all service properties. This will effect two major aspects:

* The new properties stated in the [simple-manager-blueprint-inputs.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint-inputs.yaml) will override the properties used on previous bootstrap or upgrade.
* `user_resource` type resources will also be overridden as will be discussed in the next paragraph.

For reference use, properties and resources can be found under `/opt/cloudify/<SERVICE_NAME>/`on the manager file-system.

### Sources And Resources:
All service node sources such as service RPMs and all Cloudify component packages, along with all resources such as agent packages and configuration files,
will be replaced upon upgrade with the new resources specified in the new [simple-manager-blueprint-inputs.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint-inputs.yaml).
This applies to all except resources of type `user_resource`.

#### User Resources
User resources are resources that should not be replaced as part of the upgrade
process and include the following resources:

{{% table %}}
| Resource Name | Node Name | Usage |
|-----------|-----------|-----------|
| roles_config.yaml | manager-config | Holds security role configuration |
| userstore.yaml | manager-config | Holds the userstore used for authentication/authorization |
| server.crt | Nginx | Nginx server certificate |
| server.key | Nginx | Nginx server key |
| rabbitmq.config-ssl | rabbitmq | Rabbitmq ssl configuration |
| rabbitmq.config-nossl | rabbitmq | Rabbitmq ssl configuration |
 {{% /table %}}

Setting the `use_existing_on_upgrade` flag to `false` for any of the nodes in the above table will result in replacing the user resources related to the node with the new
resources used by the new manager blueprint.


## Upgrade

The following diagram illustrates the upgrade/rollback flow that will be discussed in this document:
![Blueprints table]({{< img "guide/manager-upgrade-flow-diagram.png" >}})

Once the new [simple-manager-blueprint](https://github.com/cloudify-cosmo/cloudify-manager-blueprints) is configured along with all of the required resources,
the Manager upgrade process may begin. The upgrade process will use `install` workflow to preform the Manager upgrade process.
This workflow can be divided into three main steps as can also be seen in the diagram above:

1. Create Upgrade Snapshot - The upgrade snapshot will hold all of elasticsearch and influxdb data prior to the upgrade. A failure in this part of the upgrade process will not require running the `cfy rollback` command.
2. Upgrade Services - Upgrade the Manager services using the new sources and resources.
3. Restore Upgrade Snapshot - Once all services have been installed and configured and the Cloudify Manager is up, the upgrade snapshot will be restored to the new Manager.

A failure in any of these steps can either be handled by running the `cfy upgrade` command again, or by running the `cfy rollback` command as addressed later in the document.

{{% gsNote title="Note" %}}
The upgrade scripts are designed to be idempotent and so there is no risk of running the `cfy upgrade` command consecutively.
This can be useful in-case of failures due to power/network issues or in case of failures related to the new input properties provided.
{{% /gsNote %}}


### Upgrade Execution
Starting the upgrade process requires having the Cloudify Manager in [maintenance-mode]({{< relref "manager/maintenance-mode.md" >}}). This will prevent having running executions during the upgrade process.
To activate maintenance-mode, run:
{{< gsHighlight  bash  >}}
cfy maintenance-mode activate
{{< /gsHighlight >}}
The Cloudify Manager upgrade will be possible only once the manager enters maintenance mode.
Once in maintenance-mode, using the pre-configured [simple-manager-blueprint-inputs.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint-inputs.yaml)
execute the following CLI command to initiate the upgrade process:
{{< gsHighlight  bash  >}}
cfy upgrade --install-plugins --blueprint-path simple-manager-blueprint.yaml --inputs simple-manager-blueprint-inputs.yaml
{{< /gsHighlight >}}

The following is an example of the expected output:

{{< gsHighlight  bash  >}}
$ cfy use -t xx.zz.253.243
  Using manager xx.zz.253.243 with port 80
$ cfy maintenance-mode activate
  Activating maintenance mode...
  Run 'cfy maintenance-mode status' to check the maintenance modes status.
$ cfy upgrade --blueprint-path simple-manager-blueprint.yaml --inputs simple-manager-blueprint-inputs.yaml -v
  Processing inputs source: simple-manager-blueprint-inputs.yaml
  Processing inputs source: {"public_ip": "xx.zz.253.243", "agents_user": "", "ssh_user": "centos", "private_ip": "10.7.207.41", "ssh_key_filename": "cloudify-manager-kp.pem"}
  Upgrading manager...
  Executing upgrade validations...
  CFY <manager-upgrade> Starting 'execute_operation' workflow execution
  CFY <manager-upgrade> [webui_1ef39] Starting operation cloudify.interfaces.validation.creation
  ...
  Upgrade validation completed successfully
  Executing manager upgrade...
  CFY <manager-upgrade> Starting 'install' workflow execution
  CFY <manager-upgrade> [manager_host_a8906] Creating node
  ...
{{< /gsHighlight >}}

Once the upgrade process is complete, exit maintenance-mode to allow access the new Manager using the following command.
{{< gsHighlight  bash  >}}
cfy maintenance-mode deactivate
{{< /gsHighlight >}}

## Rollback
The upgrade process supports rollback, meaning a Manager can be rolled back to it's previous version.
Manager rollback should be done in-case of failure in the upgrade process or simply due to dissatisfaction from the upgraded version.
Similarly to the upgrade process, the rollback process also uses the `install` workflow to execute and can be divided into two steps as can also be seen in the diagram above:

1. Rollback Services - Rollback Manager services using the sources and resources used on prior bootstrap/upgrade. This will restore all services and previously used configuration resources.
2. Restore Upgrade Snapshot - Restore the snapshot created during the upgrade process.

Since preforming rollback is also possible after the upgrade command executed successfully, it's important to be aware that rolling back from this state will
result in loosing all of the new data collected after the upgrade ended.

{{% gsNote title="Note" %}}
Similarly to the upgrade command, the rollback command is also idempotent and can run consecutively without concern.
This can be useful in-case of failures due to power/network issues.
{{% /gsNote %}}

### Recover From Failure
Recovering from an upgrade failure can be handled in two ways:
1. Rerunning the `cfy upgrade` command again. Try running it with a different configuration. Since the upgrade process is idempotent, it will not have any harmful effect.
2. Running the `cfy rollback` command. This will result in having all services reinstalled in their old version.

{{% gsNote title="Note" %}}
The snapshot used for the upgrade process should not be deleted until it certain rollback will not be used though it is advised to keep it anyways.
{{% /gsNote %}}

### Rollback Execution:
Again, in a similar fashion to the upgrade process, set Manager to [maintenance-mode](http://??).
This command should not be invoked in-case the upgrade process failed since the Manager should still be in maintenance-mode.

{{< gsHighlight  bash  >}}
cfy maintenance-mode activate
{{< /gsHighlight >}}

Run the rollback command using the [simple-manager-blueprint.yaml](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/blob/3.3.1/simple-manager-blueprint.yaml) used for the upgrade process:
{{< gsHighlight  bash  >}}
cfy rollback --blueprint-path simple-manager-blueprint.yaml --inputs simple-manager-blueprint-inputs.yaml
{{< /gsHighlight >}}

And Once the rollback process is complete, exit maintenance-mode:
{{< gsHighlight  bash  >}}
cfy maintenance-mode deactivate
{{< /gsHighlight >}}


{{% gsNote title="Important Note" %}}
Once a Manager upgrade has been executed, Manager recovery will no longer be functional and should not be used.
This issue will be solved in future versions.
{{% /gsNote %}}


## Pre-Upgrade Validations
Prior to performing the actual upgrade, a `cloudify.interfaces.validation.creation` operation is executed. It's purpose is to validate the new inputs and spot any
invalid states to prevent them from turning up at runtime. This section will describe the validations preformed for each of the services prior to the upgrade workflow
execution.

### General Validations

* The Manager service components must be in status ‘running’.
* The Manager file-system must hold all sources and resources used by the previous installation/upgrade under `/opt/cloudify/<NODE_NAME>/resources/`. These resources will be used to allow rollback.
* The Manager file-system must hold the input properties used by the previous installation/upgrade under `/opt/cloudify/<NODE_NAME>/node_proprties/properties.json` to allow rollback.

### Node Specific Validations

* Elasticsearch
    * `es_heap_size` property must be atr least the size of the current memory size.
    * Elasticsearch must be available on the specified port.
    * Elasticsearch must hold a `provider_context` index.
* Rabbitmq
    * Broker configuration may not change. Specifically:
      `broker_user`, `broker_pass`, `broker_ip`, `broker_ssl_enabled` and `broker_ssl_cert`
* Manager Config
    * SSL communication configuration may not change. Specifically `ssl`, `security` and `ssh_user`
