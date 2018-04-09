---
layout: bt_wiki
title: Installing and Configuring Cloudify Manager
category: Installation
draft: false
weight: 100
---
A Cloudify Manager is a compute host that runs the Cloudify Management service. For version 4.3 and higher, you can install a single RPM file that installs Cloudify Manager with all of its dependencies. The Cloudify Manager RPM file is self-contained and does not require an internet connection during installation.

 To get started with Cloudify in Amazon AWS or OpenStack, you can also use a [Cloudify Manager image]({{< relref "installation/manager-image.md" >}}).

{{% gsNote title="Prerequisites" %}}

Make sure that your environment meets the [prerequisites]({{< relref "installation/prerequisites.md" >}}) before you install Cloudify Manager.

{{% /gsNote %}}

The installation process installs all of the components that Cloudify depends on. You can run the install command again after the initial installation to reinstall and reconfigure the components. The [configure command]({{< relref "installation/installing-manager.md#changing-the-manager-settings" >}}) lets you reconfigure the components without reinstallation. When you install or configure the Cloudify Manager, you can specify the private IP address, public IP address and administrator password as command options, or specify these and other configuration settings in the [config.yaml file]({{< relref "installation/installing-manager.md#additional-cloudify-manager-settings" >}}).

You can install the [Cloudify CLI]({{< relref "installation/installing-cli.md" >}}) on a separate host to manage your Cloudify Manager remotely.

## Installing Cloudify Manager

_To install Cloudify Manager:_

1. Go to the download page on the [Cloudify website](http://cloudify.co/download/) and download the Cloudify Manager RPM file.
1. Copy the RPM file to your target host.
1. From the terminal of your target host, run: ```sudo yum install <RPM file path>```.
   For example: ```sudo yum install /home/centos/cloudify-manager-install-4.3.1ga.x86_64.rpm```
1. To change the default configuration settings, edit the [config.yaml file]({{< relref "installation/installing-manager.md#additional-cloudify-manager-settings" >}}).
    {{% gsNote title="Best Practices" %}}We recommend do not skip validations or sanity checks, and that you review the [security recommendations]({{< relref "installation/installing-manager.md#security-recommendations" >}}).{{% /gsNote %}}

1. To install Cloudify Manager, run: ```sudo cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]```

  * If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
  * If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output when the installation is complete.
  * If you use ```-v``` for the cfy_manager command, you can see additional debugging logs located at: ```/var/log/cloudify/manager/cfy_manager.log```.

## Other Installation Actions

### Validating the Installation

When the installation process is complete, you can use ```cfy status``` to make sure that all of the Cloudify services are running.
Cloudify Premium customers can access the Cloudify Web Interface at:

* By default: ```http://<manager_public_address>```
* If you enable SSL in the config.yaml file: ```https://<manager_public_address>```

An example output:
{{< gsHighlight  sh >}}
$ cfy status

...

Retrieving manager services status... [ip=127.0.0.1]

Services:
   +--------------------------------+---------+
   |            service             |  status |
   +--------------------------------+---------+
   | InfluxDB                       | running |
   | Celery Management              | running |
   | Logstash                       | running |
   | RabbitMQ                       | running |
   | AMQP InfluxDB                  | running |
   | PostgreSQL                     | running |
   | Manager Rest-Service           | running |
   | Cloudify Stage                 | running |
   | Webserver                      | running |
   | Riemann                        | running |
   | Webserver                      | running |
   +--------------------------------+---------+

   ...
   {{< /gsHighlight >}}

### Configuring the Manager Settings

After you install Cloudify Manager, you can change the settings used by the installation without reinstalling the Cloudify components. The configure command accepts the same CLI inputs as the install command, and it reads the same config.yaml file for additional settings.

* To change installation settings:
1. To change the configuration settings, edit the [config.yaml file]({{< relref "installation/installing-manager.md#additional-cloudify-manager-settings" >}}).
1. To configure Cloudify Manager, run: ```cfy_manager configure [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]```

  * If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
  * If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output when the installation is complete.
  * If you use ```-v``` for the cfy_manager command, you can see additional debugging logs located at: ```/var/log/cloudify/manager/cfy_manager.log```.

### Additional Cloudify Manager Settings

In addition to the command line options, the ```/etc/cloudify/config.yaml``` ([View in GitHub](https://github.com/cloudify-cosmo/cloudify-manager-install/blob/master/config.yaml)) contains more advanced configuration settings, including:

* Administrator password (`admin_password`)
* Private and public IP addresses (`private_ip`;`public_ip`)
* External REST communications over HTTPS (`ssl_enabled`)
* Local path replacement for remote resources with a URL (`import_resolver`)
* Multi-network management (`networks`)
* LDAP connection information (`ldap`)
* SSL communication settings (`ssl_inputs`)


The ```/etc/cloudify/config.yaml``` can be validated at any time using the ```cfy_manager validate``` command. This performs the same checks that ```cfy_manager install``` does.


#### Multi-Network Management

If a manager has a multiple interfaces, you must list in the config.yaml all of the interfaces that agents can connect to. You must then specify in each [blueprint]({{< relref "agents/configuration.md#configuration-properties" >}}) the interface that the agent connects to. If no IP address is specified in the blueprint, the agent connects to the interface that is identified as the private IP in the configuration process, specified by --private-ip or specified in the config.yaml file.

The networks are listed in this syntax:

```
agent:
  networks:
    network_a: <ip_address_a>
    network_b: <ip_address_b>
  broker_port: 5671
  min_workers: 2
  max_workers: 5
```

### Security Recommendations

For security considerations, we recommend that you:

* Specify an administrator password according to your security policy
* Set SSL in config.yaml to enabled
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

### Emptying the Cloudify Manager Database

{{% gsWarning %}}

Emptying the Cloudify Manager database is irreversible.

{{% /gsWarning %}}

During both installation and configuration of Cloudify Manager, you can use the ```--clean-db``` option to empty all of the data from the Cloudify Manager database. The initial installation does not require the ```--clean-db``` flag.

### Uninstalling Cloudify Manager

{{% gsWarning %}}

Uninstalling the Cloudify Manager erases all Cloudify data and is irreversible.

{{% /gsWarning %}}

* To uninstall the Cloudify Manager, run: ```sudo cfy_manager remove -f```

* To remove all of the files that the installation process extracted, run: ```sudo yum remove cloudify-manager-install```

## Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "plugins/overview.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "manager_webui/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "manager/using-secrets.md" >}}) for your tenants to store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
