---
layout: bt_wiki
title: Installing and Configuring Cloudify Manager
category: Installation
draft: false
weight: 100
---
A Cloudify Manager is a compute host that runs the Cloudify Management service. For version 4.3 and higher, you can install a single RPM file that installs Cloudify Manager with all of its dependencies. The Cloudify Manager RPM file is self-contained and does not require an internet connection during installation.

{{% gsNote title="Prerequisites" %}}

Make sure that your environment meets the [prerequisites]({{< relref "installation/prerequisites.md" >}}) before you install Cloudify Manager.

{{% /gsNote %}}

When you install Cloudify Manager, you can specify the private IP address, public IP address and administrator password as command parameters. You can also specify installation parameters in the [config.yaml file]({{< relref "installation/installing-manager.md#changing-the-manager-parameters" >}}).

You can install the [Cloudify CLI]({{< relref "installation/installing-cli.md" >}}) on a separate host to manage your Cloudify Manager remotely.

## Installing Cloudify Manager

_To install Cloudify Manager:_

1. Go to the download page of the [Cloudify website](http://cloudify.co/download/).
1. Copy the link address for the Cloudify Manager rpm file.
1. From the CLI of your target host, run: ```sudo yum install \<rpm file link address>```
   For example: ```sudo yum install http://cloudify-release-eu.s3.amazonaws.com/cloudify/4.3.0/release/cloudify-manager-install-4.3ga.x86_64.rpm```
1. To change the default configuration settings, edit the ```/etc/cloudify/config.yaml``` file.
1. To install Cloudify Manager, run: ```cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]```

  * If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
  * If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output when the installation is complete.
  * If you use ```-v``` for the cfy_manager command, you can see additional debugging logs located at: ```/var/log/cloudify/manager/cfy_manager.log```.
  * Each time you run ```cfy_manager install```, the installation process installs and configures the Cloudify components but does not delete the Cloudify data.

{{% gsNote title="Best Practice" %}}

We recommend that you specify an administrator password according to your security policy. 

{{% /gsNote %}}


## Other Installation Actions

### Validating the Installation

When the installation process is complete, you can use ```cfy status``` to make sure that all of the Cloudify services are running.
Cloudify Premium customers can access the Cloudify Web Interface at: ```http://<manager_public_address>```

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

### Changing the Manager Parameters

After you install Cloudify Manager, you can change the parameters used by the installation. The configure command accepts the same CLI parameters as the install command, and it reads the config.yaml file for additional parameters.

* To change installation parameters:
1. To change the default configuration settings, edit the ```/etc/cloudify/config.yaml``` file.
1. To configure Cloudify Manager, run: ```cfy_manager configure [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [--admin-password <password>] [-v]```

  * If you specify the private and public IP addresses and the administrator password in the config.yaml file, do not specify them in the command options.
  * If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output when the installation is complete.
  * If you use ```-v``` for the cfy_manager command, you can see additional debugging logs located at: ```/var/log/cloudify/manager/cfy_manager.log```.

The config.yaml ([View in GitHub](https://github.com/cloudify-cosmo/cloudify-manager-install)) contains more advanced configuration parameters, including:

* Administrator password
* Private and public IP address
* External REST communication over HTTPS
* Local path replacement for remote resources with a URL
* Networks for Cloudify agents
* LDAP connection information
* SSL communication settings

### Uninstalling Cloudify Manager

* To uninstall the Cloudify Manager, run: ```cfy_manager remove```

* To remove all of the files that the installation process extracted, run: ```yum remove cloudify-manager-install```

## Next Steps

After Cloudify Manager is installed, you can configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "plugins/using-plugins.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "manager_webui/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "manager/using-secrets.md" >}}) for your tenants to store data variables that you do not want to expose in plain text in Cloudify, such as login credentials for a platform.
