---
layout: bt_wiki
title: Installing Cloudify Manager
category: Manager Intro
draft: false
weight: 300
---

Cloudify Manager comprises Cloudify's code and [several underlying open-source tools]({{< relref "manager_architecture/components.md" >}}), which have been integrated to create a dynamic environment, and will support the different operational flows that you might be interested in when deploying and managing your application.

Using different Cloudify plugins, the bootstrap process will create the infrastructure (servers, networks, security groups and rules, etc..) required for Cloudify's Manager to run in that environment.

# Manager Blueprints

Bootstrapping a Cloudify Manager, much like deploying any other application, means installing a blueprint. This blueprint, while not functionally different from any other blueprints, is designed to create the infrastructure for Cloudify's Manager and deploy its applicative requirements.

By utilizing blueprints, users can potentially design their own Cloudify Managers for additional scalability or functionality.

`Manager blueprints` for different IaaS providers are provided by the Cloudify Team. You can find these blueprints in the [cloudify-manager-blueprints repo](https://github.com/cloudify-cosmo/cloudify-manager-blueprints).

To bootstrap a Cloudify Manager:

{{% gsNote title="Note" %}}
If you're bootstrapping in an environment where there is no internet access, please also refer to the [offline page]({{< relref "manager/offline.md" >}}) before bootstrapping.
{{% /gsNote %}}

# Initialize a Working Directory

Navigate to a directory of your choosing, and initialize it as a Cloudify working directory using this command:

{{< gsHighlight  sh  >}}
$ cfy init
Initialization completed successfully

...
{{< /gsHighlight >}}

This will create a folder in the current directory named `.cloudify`.

# Prepare the Bootstrap Configuration

{{% gsNote title="Note" %}}
Please verify the [prerequisites]({{< relref "manager/bootstrapping.md" >}}) before bootstrapping.
{{% /gsNote %}}

If you installed Cloudify using one of the premade packages, the manager blueprints should already be available to you.

* On Linux under /opt/cfy/cloudify-manager-blueprints
* On Windows under c:\Program Files (x86)\Cloudify\cloudify-manager-blueprints-commercial

If you didn't install using premade packages, download and extract the [cloudify-manager-blueprints](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/3.3.1.tar.gz) repository from GitHub.

{{< gsHighlight  bash  >}}
$ mkdir -p ~/cloudify-manager
$ cd ~/cloudify-manager
$ curl -L https://github.com/cloudify-cosmo/cloudify-manager-blueprints/archive/3.3.1.tar.gz -o cloudify-manager-blueprints.tar.gz
$ tar -xzvf cloudify-manager-blueprints.tar.gz
$ cd cloudify-manager-blueprints-3.3.1
$ ls -l
...

-rw-r--r--  1 nir0s users  15K Jan  4 13:32 aws-ec2-manager-blueprint-inputs.yaml
-rw-r--r--  1 nir0s users  27K Jan  4 13:32 aws-ec2-manager-blueprint.yaml
-rw-r--r--  1 nir0s users  15K Jan  4 13:32 openstack-manager-blueprint-inputs.yaml
-rw-r--r--  1 nir0s users  29K Jan  4 13:32 openstack-manager-blueprint.yaml
-rw-r--r--  1 nir0s users  13K Jan  4 13:32 simple-manager-blueprint-inputs.yaml
-rw-r--r--  1 nir0s users  23K Jan  4 13:32 simple-manager-blueprint.yaml
-rw-r--r--  1 nir0s users  14K Jan  4 13:32 vcloud-manager-blueprint-inputs.yaml
-rw-r--r--  1 nir0s users  32K Jan  4 13:32 vcloud-manager-blueprint.yaml
-rw-r--r--  1 nir0s users  16K Jan  4 13:32 vsphere-manager-blueprint-inputs.yaml
-rw-r--r--  1 nir0s users  29K Jan  4 13:32 vsphere-manager-blueprint.yaml
...

{{< /gsHighlight >}}

As you can see there are manager blueprints for different environments. Each of these blueprints provisions resources (like a vm, security groups, ip's, etc..) required for the manager to run and installs the different components on the vm.

Now let's move on to configuration.

Each manager blueprint has an `inputs.yaml` file associated with it. That inputs file is the configuration for the environment the manager should be bootstrapped on and general configuration for the manager itself.

While defaults are provided for most inputs, some inputs are required since they relate to your specific provider's account like credentials for example.

The inputs file contains a description of each input. You should modify the inputs file to contain the relevant information for your environment.

For example, for AWS:

{{< gsHighlight  yaml  >}}
# Credentials and identification in order to connect to ec2
aws_access_key_id: my_access_key_id
aws_secret_access_key: my_secret_access_key

# This is the Amazon AMI that you will run and install the manager components on.
# The default value is matched to the default instance_type and ec2_region_name.
# This may also vary by account.
image_id: 'ami-61bbf104'

# This is the Amazon instance type.
# The default value is matched to the default image_id and ec2_region_name.
# This may also vary by account.
instance_type: 'm4.xlarge'

...
{{< /gsHighlight >}}

After providing all required inputs, you can no go on to bootstrap your manager.

# Bootstrap the Manager

Finally, run the `cfy bootstrap` command, pointing it to the manager blueprint file and the inputs YAML file, like so:

{{< gsHighlight  sh  >}}
$ cfy bootstrap --install-plugins -p /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, this should take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` will create the management VM, related networks and security groups, download the relevant packages and install all of the components.
At the end of this process you should see the following message:

{{< gsHighlight  bash  >}}
...

bootstrapping complete
management server is up at <YOUR MANAGER IP ADDRESS>

...
{{< /gsHighlight >}}

To validate this installation, point your web browser to the manager IP address (port 80) and you should see Cloudify's Web UI.
At this point there's nothing much to see since you haven't uploaded any blueprints yet.

When the process is complete, you'll have an operational Cloudify manager on the desired provider. You can verify this by making a *status* call.

An example output:

{{< gsHighlight  sh  >}}
$ cfy status
...

Getting management services status... [ip=46.137.95.124]

Services:
+--------------------------------+---------+
|            service             |  status |
+--------------------------------+---------+
| InfluxDB                       | running |
| Celery Management              | running |
| Logstash                       | running |
| RabbitMQ                       | running |
| AMQP InfluxDB                  | running |
| Manager Rest-Service           | running |
| Cloudify UI                    | running |
| Webserver                      | running |
| Riemann                        | running |
| Elasticsearch                  | running |
+--------------------------------+---------+

...
{{< /gsHighlight >}}


# What's Next

Now that you have a manager running, you can [upload your blueprint]({{< relref "manager/upload-blueprint.md" >}}).
