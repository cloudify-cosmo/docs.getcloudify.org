---
layout: bt_wiki
title: Bootstrapping
category: Manager Intro
publish: true
pageord: 200
---

A Manager comprises Cloudify's code and [several underlying open-source tools](overview-components.html), which have been integrated to create a dynamic environment, and will support the different operational flows that you might be interested in when deploying and managing your application.

Using different Cloudify plugins, the bootstrap process will create the infrastructure (servers, networks, security groups and rules, etc..) required for Cloudify's Manager to run in that environment.

# Manager Blueprints

Bootstrapping a Cloudify Manager, much like deploying any other application, means installing a blueprint. This blueprint, while not functionally different from any other blueprints, is designed to create the infrastructure for Cloudify's Manager and deploy its applicative requirements.

By utilizing blueprints, users can potentially design their own Cloudify Managers for additional scalability or functionality.

`Manager blueprints` for different IaaS providers are provided by the Cloudify Team. You can find these blueprints in the [cloudify-manager-blueprints repo](https://github.com/cloudify-cosmo/cloudify-manager-blueprints).

To bootstrap a Cloudify Manager:

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
Please verify the [prerequisites](manager-prerequisites.html) before bootstrapping.
{{% /gsNote %}}

If you installed Cloudify using one of the premade packages, the manager blueprints should already be available to you.

FILL HERE!

If you didn't install using premade packages, clone the [cloudify-manager-blueprints](https://github.com/cloudify-cosmo/cloudify-manager-blueprints) repository from GitHub.

{{< gsHighlight  bash  >}}
$ mkdir -p ~/cloudify-manager
$ cd ~/cloudify-manager
$ git clone https://github.com/cloudify-cosmo/cloudify-manager-blueprints
$ cd cloudify-manager-blueprints
$ git checkout -b cloudify <tag>
...

{{< /gsHighlight >}}


{{% gsNote title="Note" %}}
Make sure you use a tag from [cloudify-manager-blueprints](https://github.com/cloudify-cosmo/cloudify-manager-blueprints/releases) that matches your Cloudify version. Blueprints taken from the master branch might not work for you.
{{% /gsNote %}}

Now let's move on to configuration.

Each manager blueprint has an `inputs` file associated with it. That input file is the configuration for the environment the manager should be bootstrapped on and general configuration for the manager itself.

While defaults are provided for most inputs, some inputs are required since they relate to your specific provider's account like credentials for example.


# Bootstrap the Manager

Finally, run the `cfy bootstrap` command, pointing it to the manager blueprint file and the inputs YAML file, like so:

{{< gsHighlight  sh  >}}
$ cfy bootstrap --install-plugins -p /path/to/manager/blueprint/file -i /path/to/inputs/yaml/file
...

{{< /gsHighlight >}}

Depending on the cloud environment and the server specifications you provided, this should take between 10 to 20 minutes to complete.
After validating the configuration, `cfy` will create the management VM, related
networks and security groups, download the relevant packages and install all of the components.
At the end of this process you should see the following message:

{{< gsHighlight  bash  >}}
...

bootstrapping complete
management server is up at <YOUR MANAGER IP ADDRESS>

...
{{< /gsHighlight >}}

To validate this installation, point your web browser to the manager IP address (port 80) and you should see Cloudify's Web UI.
At this point there's nothing much to see since you haven't uploaded any blueprints yet.

When the command is done executing, you'll have an operational Cloudify manager on the desired provider. You may verify this by making a *status* call.

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

Now that you have a manager running, you can [upload your blueprint](manager-upload-blueprint.html).