---
layout: bt_wiki
title: Installing Cloudify Manager with an External Database
category: Installation
draft: false
weight: 100
aliases:
  - /installation/installation-overview/
  - /installation/bootstrapping/
  - /installation/from-packages/
  - /installation/installing-manager/
---
Every Cloudify Manager installation requires a PostgreSQL database to store its required data (such as blueprints, deployment, tenants, etc...). By default, Cloudify Manager is installed in an all-in-one topology, but using the regular familiar installation of Cloudify Manager, you can select to have a distributed installation, whether it would be using an existing PostgreSQL external database, or use Cloudify's PostgreSQL package and installation methods.

Similarly to an all-in-one installation, depending on the service you want to install on a particular machine, the installation process installs all of the components that Cloudify depends on.
To select a specific service to install (Manager or Database), you need to update the settings in the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file.

You can install the [Cloudify CLI]({{< relref "install_maintain/installation/installing-cli.md" >}}) on a separate host to manage your Cloudify Manager remotely.

{{% note %}}
 - When using an external database SSL must be configured
{{% /note %}}

# Cloudify Preqrequisites

The minimum requirements are enough for small deployments that only manage a few compute instances. Managers that manage more deployments or large deployments need at least the recommended resources.

Cloudify Manager and the PostgreSQL Database are supported for installation on a 64-bit host with RHEL/CentOS 7.4.

There are specific packages that are commonly included in RHEL/CentOS. You must have these packages installed before you install Cloudify Manager.

### Hardware Requirements

| Cloudify Manager | Minimum | Recommended |
|---|---------|-------------|
| vCPU | 2 | 8 |
| RAM | 4GB | 16GB |
| Storage | 5GB | 64GB |

| PostgreSQL Database | Minimum | Recommended |
|---|---------|-------------|
| vCPU | 2 | 8 |
| RAM | 4GB | 16GB |
| Storage | 5GB | 64GB |

### Software requirements

| Package | Description | Cloudify Manager | PostgreSQL Database |
|---|---------|---------|-------------|
| sudo | Required to run commands with root privileges (note that this is still a requirement even when running with root user) | V | V |
| systemd-sysv | Create Cloudify Services | V | V |
| yum | Install Cloudify's required packages | V | V |
| openssl-1.0.2k | Generate internal/external certificates | V |  |
| openssh-server | Creating SSH keys during the sanity check | V |  |
| logrotate | Rotating Cloudify log files | V |  |
| initscripts | Required by RabbitMQ | V |  |
| sed | Required by the CLI | V |  |
| tar | Untar packages | V |  |
| python-setuptools | Required by Python | V |  |
| python-backports | Required by Python | V |  |
| python-backports-ssl_match_hostname | Required by Python | V |  |

### Other requirements

A total of 3 certificates and 3 keys must be prepared prior to installing the PostgreSQL Client and Server:

| Requirement | Requiring package | Description |
|---|---------|-------------|
| Root/Intermediate CA certificate and key | PostgreSQL Client and Server | Used by both the client and the server to validate each other |
| PostgreSQL Client certificate and key | PostgreSQL Client | Used by the server to validate the client |
| PostgreSQL Server certificate and key | PostgreSQL Server | Used by the client to validate the server |

* **Certificates** - The PostgreSQL Client and Server certificates must be signed with the Root/Intermediate CA certificate supplied.  

### Network Interfaces

Cloudify Manager requires at least two network interfaces:


*   **Private** - Dedicated for communication with other Cloudify components, including agents and cluster members.
*   **Public** - Dedicated for connections to the Cloudify Manager with the Cloudify CLI and Web Interface.

In some cases, it is possible to use only one network interface, but this can lead to security problems.

### Network Ports Requirements
 
| Source | <-> | Target | Port | Description |
|--------|-----------|--------|------|-------------|
| CLI Client | -> | Cloudify Manager | 80 | REST API and UI. This port must be accessible when SSL is not enabled. |
| CLI Client | -> | Cloudify Manager | 22 | REST API and UI. This port must be accessible when SSL is enabled. |
| CLI Client | -> | Cloudify Manager | 443 | For remote access to the manager from the Cloudify CLI. (Optional) |
| Cloudify Agent | -> | Cloudify Manager | 5671 | RabbitMQ. This port must be accessible from agent VMs. |
| Cloudify Agent | -> | Cloudify Manager | 53333 | Internal REST communications. This port must be accessible from agent VMs. |
| Cloudify Manager | -> | PostgreSQL Server | *PORT* | Port required to communicate with the external database (usually 5432). This port can be changed after the installation. |

# Installing Cloudify Manager

The Cloudify Manager services are installed from an RPM file. The installation can be customized with command-line flags and the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file. The [Cloudify Manager installation FAQ](https://cloudify.co/knowledge-base/manager-installation-faq/) includes more information about troubleshooting and advanced scenarios.

Since Cloudify Manager relies on a PostgreSQL database to store its data on, you would need to have a database ready before you install it. To achieve that you can either:

1. Have an existing PostgreSQL 9.5 server ready.
1. Use Cloudify Manager's installation rpm to install a new PostgreSQL 9.5 server with everything configured.

In case you chose **1**, jump over to [Installing Cloudify Manager service]({{< relref "install_maintain/installation/installing-manager-with-an-external-db.md#installing-cloudify-manager-service" >}})

### Installing Cloudify Manager database service

_To install Cloudify Manager database service:_

1. [Download](http://cloudify.co/download/) the Cloudify Manager RPM file.
2. Copy the RPM file to your target host.
3. From the terminal of your target host, run:

    ```
    sudo yum install <RPM file path>
    ```
        
    For example:
    ```
    sudo yum install /home/centos/cloudify-manager-install-4.5.1ga.x86_64.rpm
    ```

4. Update the following sections in the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file as below:

```yaml
postgresql_server:
  enable_remote_connections: true
  postgres_password: '<postgres user password to configure on the server>'
  ssl_enabled: true
.
.
.
ssl_inputs:
  postgresql_client_cert_path: '<PostgreSQL server certificate path>'
  postgresql_client_key_path: '<PostgreSQL server key path>'
  ca_cert_path: '<Root/Intermediate CA certificate path>'
  ca_key_path: '<Root/Intermediate CA certificate path>'
.
.
.
services_to_install:
  -  'database_service' 
```
{{% note %}}
 - The database will listen for connections on the **PRIVATE_IP** you will choose later
{{% /note %}}

6. To install Cloudify Manager database, run:
    ```
    cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
    ```

{{% note %}}
* If you specify the private and public IP addresses in the config.yaml file, do not specify them in the command options.
* If you use `-v` for the cfy_manager command, you can see additional debugging logs located at: `/var/log/cloudify/manager/cfy_manager.log`
{{% /note %}}

Once the installation is complete, feel free to move on and install the Cloudify Manager service

### Installing Cloudify Manager service

_To install Cloudify Manager:_

1. [Download](http://cloudify.co/download/) the Cloudify Manager RPM file.
2. Copy the RPM file to your target host.
3. From the terminal of your target host, run:
    ```
    sudo yum install <RPM file path>
    ```
    
    For example: `sudo yum install /home/centos/cloudify-manager-install-4.5.1ga.x86_64.rpm`
4. Update the following sections in the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file as below:

```yaml
postgresql_client:
  host: '<External database host[:<External database port>]>'
  postgres_password: '<postgres password configured on the external PostgreSQL server>'
  ssl_enabled: true
.
.
.
ssl_inputs:
  postgresql_client_cert_path: '<PostgreSQL server certificate path>'
  postgresql_client_key_path: '<PostgreSQL server key path>'
  ca_cert_path: '<Root/Intermediate CA certificate path>'
  ca_key_path: '<Root/Intermediate CA certificate path>'
.
.
.
services_to_install:
  -  'composer_service' 
  -  'queue_service' 
  -  'manager_service' 
```
{{% note %}}
 - If you do not specify a `<database port>` 5432 will be used
{{% /note %}}

5. Review other configuration settings in the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file and make any necessary changes.
6. To install Cloudify Manager, run:
    ```
    cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]
    ```

{{% note %}}
* If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
* If you do not specify an administrator password in the command-line or the config.yaml file, the installation process generates a random password and shows it as output in the installation logs.
* If you use `-v` for the cfy_manager command, you can see additional debugging logs located at: `/var/log/cloudify/manager/cfy_manager.log`
{{% /note %}}

{{% warning title="Best Practices" %}}
We recommend that you do not skip validations or sanity checks, and that you review the [security recommendations]({{< relref "install_maintain/installation/installing-manager.md#security-recommendations" >}}).
{{% /warning %}}

# Other Installation Actions


### License Activation

From version 4.6 on, in order to activate a Cloudify Premium Manager, a valid license is required. Before the Cloudify Manager is activated, most of the Cloudify REST APIs are blocked, and neither Cloudify CLI nor Cloudify Console is operational. Cloudify community version does not require a license, hence no activation is needed.
[Learn more about license activation]({{< relref "install_maintain/installation/manager-license.md" >}})


### Validating the Installation

When the installation process is complete, you can use `cfy status` to make sure that all of the Cloudify services are running.
Cloudify Premium customers can access the Cloudify Console at:

* By default: `http://<manager_public_address>`
* If you enable SSL in the config.yaml file: `https://<manager_public_address>`

An example output:
{{< highlight  sh >}}
$ cfy status

...

Retrieving manager services status... [ip=127.0.0.1]

Services:
   +--------------------------------+---------+
   |            service             |  status |
   +--------------------------------+---------+
   | InfluxDB                       | running |
   | Management Worker              | running |
   | AMQP-Postgres                  | running |
   | RabbitMQ                       | running |
   | AMQP InfluxDB                  | running |
   | PostgreSQL                     |  remote |
   | Manager Rest-Service           | running |
   | Cloudify Stage                 | running |
   | Webserver                      | running |
   | Riemann                        | running |
   | Webserver                      | running |
   +--------------------------------+---------+

   ...
   {{< /highlight >}}

### Configuring the Manager Settings

After you install Cloudify Manager, you can change the settings used by the installation without reinstalling the Cloudify components. The configure command accepts the same CLI inputs as the install command, and it reads the same config.yaml file for additional settings.

{{% note %}}
* If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
* If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output in the installation logs.
* If you use `-v` for the cfy_manager command, you can see additional debugging logs located at: `/var/log/cloudify/manager/cfy_manager.log`
{{% /note %}}

_To change the Cloudify Manager installation settings:_

1. Edit the [config.yaml]({{< relref "install_maintain/installation/installing-manager.md#additional-cloudify-manager-settings" >}}) file.
1. To configure Cloudify Manager, run:
    ```
    cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]
    ```

### Additional Cloudify Manager Settings

In addition to the command line options, the `/etc/cloudify/config.yaml` ([View in GitHub](https://github.com/cloudify-cosmo/cloudify-manager-install/blob/master/config.yaml)) contains more advanced configuration settings, including:

* Administrator password (`admin_password`)
* Private and public IP addresses (`private_ip`;`public_ip`)
* External REST communications over HTTPS (`ssl_enabled`)
* Local path replacement for remote resources with a URL (`import_resolver`)
* Multi-network management (`networks`)
* LDAP connection information (`ldap`)
* SSL communication settings (`ssl_inputs`)

The `/etc/cloudify/config.yaml` file can be validated at any time using the `cfy_manager validate` command. This performs the same checks that `cfy_manager install` does.

#### Multi-Network Management

Cloudify Manager uses [Cloudify Agents]({{< relref "about/manager_architecture/_index.md#cloudify-agents" >}}) to execute tasks and collect information about the resources that it manages. You must specify the Cloudify Manager IP addresses or DNS names that your agents will use to communicate with it.

{{% note %}}
* You cannot configure multi-network management on [Cloudify Manager images]({{< relref "install_maintain/installation/manager-image.md" >}}).
* [Cloudify Examples]( https://github.com/cloudify-examples ) require that the externally-routable network is called `external`.
* If no manager network interface is specified in the blueprint, the agent connects to the `default` interface, which is configured with the `private_ip` flag during the RPM installation process.
{{% /note %}}

Multi-network management can be configured both before installing a new Manager and after.

##### Option 1: Configure multi-network management before installing a new Manager:

The Cloudify Manager networks are configured in the `agent:networks` section of the `/etc/cloudify/config.yaml` file, for example:

```yaml
agent:
  networks:
    default: <privately_routable_ip>
    external: <externally_routable_ip>
  broker_port: 5671
  min_workers: 2
  max_workers: 5
```

You must specify the name of the Cloudify Manager network for each agent that deployed in your [blueprint]({{< relref "install_maintain/agents/configuration.md#configuration-properties" >}}) with this syntax:

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
* If using a Cloudify Manager cluster, the command will add the network only for the node it is run on. The command needs to be run separately on each node in the cluster, for the newly-installed agents to be able to contact all nodes in the cluster.
```
cfy_manager add-networks --networks '{"<network-name>": "<ip>", "<network-name>":"<ip>"}'
```


### Security Recommendations

For security considerations, we recommend that you:

* Specify an administrator password according to your security policy
* Set SSL in the config.yaml file to `enabled`
* Set gunicorn to bind to localhost
    To set gunicorn to listen on localhost only:
    1. Edit the `/usr/lib/systemd/system/cloudify-restservice.service` file.
    1. Find this line: `-b 0.0.0.0:${REST_PORT} \`
    1. Replace the line with: `-b localhost:${REST_PORT} \`
    1. To restart the dependent services, run:
        ```
        sudo systemctl daemon-reload
        sudo systemctl restart cloudify-restservice
        ```

### Adding Environment Variables

In certain cases, it may be required to add environment variables to the processes that run Cloudify Manager.
For example, certain organizations impose restrictions on the installation-default temporary files directory (usually
`/tmp`), requiring the adjustment of the `TEMP` / `TMP` / `TMPDIR` environment variables accordingly.

This can be achieved by providing additional settings in `config.yaml`:

* The `extra_env` key under the `restservice` category contains a dictionary of environment variables to be added
to Cloudify's REST Service.

* The `extra_env` key under the `mgmtworker` category is read as dictionary of environment variables to be added
to Cloudify's Management Workers Service.

For example, to override the `TEMP` environment variable with `/var/tmp`:

```yaml
mgmtworker:
  extra_env:
    TEMP: /var/tmp

restservice:
  extra_env:
    TEMP: /var/tmp
```

### Additional Cloudify Console Settings

You can customize Cloudify Console by [modifying userConfig.json file]({{< relref "working_with/console/_index.md#advanced-configuration" >}}).

### Emptying the Cloudify Manager Database

{{% warning title="Data Loss" %}}
Emptying the Cloudify Manager database erases Cloudify data and is irreversible.
{{% /warning %}}

During both installation and configuration of Cloudify Manager, you can use the `--clean-db` option to empty all of the data from the Cloudify Manager database. The initial installation does not require the `--clean-db` flag.

This should be run from the Cloudify Manager machine, not the database machine.

### Uninstalling Cloudify Manager

{{% warning title="Data Loss" %}}
Uninstalling the Cloudify Manager erases all Cloudify data and is irreversible.
{{% /warning %}}

* To uninstall the Cloudify Manager, run: `sudo cfy_manager remove -f`

* To remove all of the files that the installation process extracted, run: `sudo yum remove cloudify-manager-install`

# Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "working_with/official_plugins/_index.md" >}}) to add functionality to Cloudify Manager
* To use Cloudify with LDAP users, setup the [LDAP connection]({{< relref "working_with/console/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "working_with/manager/using-secrets.md" >}}) for your tenants.
  
    The secrets store lets you store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
