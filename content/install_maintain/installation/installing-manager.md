---
title: Installing and Configuring a Cloudify Manager
description: Install a single All-In-One Cloudify Manager.
category: Installation
draft: false
weight: 15
aliases:
  - /installation/installation-overview/
  - /installation/bootstrapping/
  - /installation/from-packages/
  - /installation/installing-manager/
---

A {{< param cfy_manager_name >}} is a compute host running {{< param product_name >}} components.

{{% note title="Prerequisites" %}}
* Make sure that your environment meets the [prerequisites]({{< relref "install_maintain/installation/prerequisites.md" >}}) before you install {{< param cfy_manager_name >}}.
* To get started with {{< param product_name >}} in Amazon AWS, OpenStack or Docker, use a [{{< param cfy_manager_name >}} image]({{< relref "install_maintain/installation/manager-image.md" >}}).
{{% /note %}}

You can install the [{{< param cfy_cli_name >}}]({{< relref "install_maintain/installation/installing-cli.md" >}}) on a separate host to manage your {{< param cfy_manager_name >}} remotely.

## Deploying {{< param cfy_manager_name >}} RPM

{{< param cfy_manager_name >}} RPM file includes all {{< param cfy_manager_name >}} components and their dependencies. The RPM is self-contained, the installation preocess does not require Internet connection.

1. [Download]({{< relref "trial_getting_started/set_trial_manager/other-deployments.md" >}}) the {{< param cfy_manager_name >}} RPM file.
1. Copy the RPM file to your target host.
1. From the terminal of your target host, run:
    ```
    sudo yum install <RPM file path>
    ```
1. Customize [{{< param cfy_manager_name >}}'s settings] ({{< relref "install_maintain/installation/installing-manager.md#cloudify-manager-configuration" >}}).
1. {{< param product_name >}} License can applied [before installation] ({{< relref "install_maintain/installation/installing-manager.md#cloudify-manager-configuration" >}}) or [after installation] ({{< relref "install_maintain/installation/manager-license" >}})
1. Install on a single [All-In-One] ({{< relref "install_maintain/installation/installing-manager.md#all-in-one-installation" >}}) host or [install {{< param product_name >}} cluster] ({{< relref "install_maintain/installation/installing-cluster.md" >}})
1. {{< param cfy_manager_name >}} is ready for use at `http(s)://<manager_public_address>`


## {{< param cfy_manager_name >}} Configuration

Once RPM is deployed, file `/etc/cloudify/config.yaml` ([View in GitHub](https://github.com/cloudify-cosmo/cloudify-manager-install/blob/master/config.yaml)) contain all installation options, including:


Setting | Description

 Setting       | Description | Comments |
---------|---------|-------------|
 `admin_password`   | Administrator password       | Recommended. If you do not specify an administrator password in the command-line or the config.yaml file, the installation process generates a random password and shows it as output in the installation logs. |
 `private_ip`;`public_ip`     | Private and public IP addresses    | Can be set in `config.yaml` or as command line argument to `cfy_manager install`        |
 `ssl_enabled` | External REST communications over HTTPS     | Recommended.        |
 `import_resolver` | Local path replacement for remote resources with a URL     |         |
 `skip_sanity` | Skip sanity check after installation     | Not recommended.        |
 `extra_env` | Additional environment varviables (see below)   |         |
 `ssl_inputs` | SSL communication settings     |         |
 `cloudify_license_path` | Path to {{< param product_name >}} license file     |         |
 `task_retries` | Maximum number of retries for a task. `-1` means infinite retries | This applies to all workflows. |
 `task_retry_interval` | Minimum wait time (in seconds) between task retries | This applies to all workflows. |



You can validate the configurations are valid using `cfy_manager validate` command.



#### Adding Environment Variables

In certain cases, it may be required to add environment variables to the processes that run {{< param cfy_manager_name >}}.
For example, certain organizations impose restrictions on the installation-default temporary files directory (usually
`/tmp`), requiring the adjustment of the `TEMP` / `TMP` / `TMPDIR` environment variables accordingly.

This can be achieved by providing additional settings in `config.yaml`:

* The `extra_env` key under the `restservice` category contains a dictionary of environment variables to be added
to {{< param product_name >}}'s REST Service.

* The `extra_env` key under the `mgmtworker` category is read as dictionary of environment variables to be added
to {{< param product_name >}}'s Management Workers Service.

For example, to override the `TEMP` environment variable with `/var/tmp`:

```yaml
mgmtworker:
  extra_env:
    TEMP: /var/tmp

restservice:
  extra_env:
    TEMP: /var/tmp
```


#### Multi-Network Management

{{< param cfy_manager_name >}} uses [Cloudify Agents]({{< relref "about/manager_architecture/_index.md#cloudify-agents" >}}) to execute tasks and collect information about the resources that it manages. You must specify the {{< param cfy_manager_name >}} IP addresses or DNS names that your agents will use to communicate with it.

{{% note %}}
* You cannot configure multi-network management on [{{< param cfy_manager_name >}} images]({{< relref "install_maintain/installation/manager-image.md" >}}).
* If no manager network interface is specified in the blueprint, the agent connects to the `default` interface, which is configured with the `private_ip` flag during the RPM installation process.
{{% /note %}}

Multi-network management can be configured before installing a new Manager and after.

##### Option 1: Configure multi-network management before installing a new Manager:

The {{< param cfy_manager_name >}} networks are configured in the `networks` section of the `/etc/cloudify/config.yaml` file, for example:

```yaml
networks:
    default: <privately_routable_ip>
    external: <externally_routable_ip>
```

You must specify the name of the {{< param cfy_manager_name >}} network for each agent that deployed in your [blueprint]({{< relref "install_maintain/agents/configuration.md#configuration-properties" >}}) with this syntax:

```yaml
  host:
    type: cloudify.nodes.Compute
    properties:
      agent_config:
        network: external
        install_method: remote
        user: { get_input: username }
        key: { get_secret: agent_key_private }
        port: 22
      ip: { get_input: host_ip }
```

##### Option 2: Add  new networks to a running Manager:
* In order to add networks to a running Manager use the `cfy_manager add-networks` command.
* New networks should be supplied as a JSON string. It is possible to add multiple new networks using one command (as shown in the example below).
* Please note that you can only add networks with unique names, otherwise an error will be raised.
* If using a {{< param cfy_manager_name >}} cluster, the command will add the network only for the node it is run on. The command needs to be run separately on each node in the cluster, for the newly-installed agents to be able to contact all nodes in the cluster.
```
cfy_manager add-networks --networks '{"<network-name>": "<ip>", "<network-name>":"<ip>"}'
```


## All In One Installation

To install {{< param cfy_manager_name >}}, run:


    cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]


{{% note title="Prerequisites" %}}
The arguments are optional if already configured in `config.yaml` (see [{{< param cfy_manager_name >}}'s settings] ({{< relref "install_maintain/installation/installing-manager.md#cloudify-manager-configuration" >}}))
{{% /note %}}


## Additional Resources

* [Upload plugins]({{< relref "working_with/official_plugins/_index.md" >}}) to add functionality to {{< param cfy_manager_name >}}
* Manage [tenants]({{< relref "working_with/console/pages/tenants-page.md" >}}) and [users]({{< relref "working_with/console/pages/users-page.md" >}}).
* Build the [secrets store]({{< relref "working_with/manager/using-secrets.md" >}}) for your tenants.
    The secrets store lets you store data variables that you do not want to expose in plain text in {{< param product_name >}}, such as login credentials for a platform.


## First Deployment
Check out your new {{< param cfy_manager_name >}} by installing the [Local Hello-World Example Deployment]({{< relref "trial_getting_started/examples/local/local_hello_world_example.md" >}}).    
This example demonstrates how you can use {{< param product_name >}} to easily install a local HTTP server with a hello-world page on it.


## Uninstalling {{< param cfy_manager_name >}}

{{% warning title="Data Loss" %}}
Uninstalling the {{< param cfy_manager_name >}} erases all {{< param product_name >}} data and is irreversible.
{{% /warning %}}

* To uninstall the {{< param cfy_manager_name >}}, run: `sudo cfy_manager remove -f`

* To remove all of the files that the installation process extracted, run: `sudo yum remove cloudify-manager-install`
