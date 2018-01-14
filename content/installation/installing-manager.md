---
layout: bt_wiki
title: Installing Cloudify Manager
category: Installation
draft: false
weight: 100
---
A Cloudify Manager is a compute host that runs the Cloudify Management service. For version 4.3 and higher, you can install a single RPM file that installs Cloudify Manager with all of its dependencies. You can then install the [Cloudify CLI]({{< relref "installation/installing-cli.md" >}}) on another host to manage your Cloudify Manager remotely.

{{% gsNote title="Prerequisites" %}}

Make sure that you review the [prerequisites]({{< relref "installation/prerequisites.md" >}}) before you install Cloudify Manager.

{{% /gsNote %}}

## Installing Cloudify Manager

_To install Cloudify Manager:_

1. Go to the download page of the [Cloudify website](http://cloudify.co/download/).
1. Copy the link address for the Cloudify Manager rpm file.
1. From the CLI of your target host, run: _sudo yum install \<rpm file link address>_  
   For example: _sudo yum install http://cloudify-release-eu.s3.amazonaws.com/cloudify/4.3.0/release/cloudify-manager-install-4.3ga.x86_64.rpm_
1. To change default configuration settings, edit the _/opt/cloudify/config.yaml_ file.
1. To install Cloudify Manager, run: _cfy_manager install --private-ip <PRIVATE_IP> --public-ip <PUBLIC_IP>_

### Validating the Installation

When the process is complete, you can use _cfy status_ to verify that all of the Cloudify services are running.
Cloudify Premium customers can access the Cloudify Web Interface at: http://\<public_address>

An example output:
{{< gsHighlight  sh  >}}
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

## Other Installation Actions

### Uninstalling Cloudify Manager

To uninstall the Cloudify Manager, run: _cfy_manager remove_

## Next Steps

After Cloudify Manager is installed, you must configure your Cloudify Manager for your environment, including:

* [Upload plugins]({{< relref "plugins/using-plugins.md" >}}) to add functionality to Cloudify Manager
* If you intend to use Cloudify to work with LDAP, setup the [LDAP connection]({{< relref "manager_webui/tenant-management-page.md" >}}).
* Build the [secrets store]({{< relref "manager/using-secrets.md" >}}) for your tenants.

  The secrets store provides tenant-wide storage for data variables that you might not want to expose in plain text in Cloudify, such as login credentials for a platform. When you use secrets, the plugins that you have uploaded use the secrets to give credential values.
