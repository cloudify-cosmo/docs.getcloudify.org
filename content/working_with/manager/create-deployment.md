---
title: Creating a Deployment
category: Manager Intro
draft: false
weight: 500
aliases: /manager/create-deployment/

terminology_link: reference-terminology.html
---

In order for {{< param product_name >}} to deploy your application, it reads the uploaded blueprint YAML (the logical representation) and manifests a model called a _deployment_. A deployment is a "technical" drilled-down representation of your application. For example, if a blueprint describes a single server node that is defined to deploy multiple instances, the deployment will comprise the instances themselves, together with their unique identifiers.

Creating a deployment does not actually create any resources, it simply generates a "physical" representation of your application from a "logical" (blueprint) representation and stores it in the database. Technically, it is a virtual environment on {{< param cfy_manager_name >}}.

## Creating a Deployment via the {{< param cfy_console_name >}}

1. On the [Blueprints widget]({{< relref "working_with/console/widgets/blueprints.md" >}}), select the required blueprint and click **Deploy**.

1. Enter the name of the deployment

1. Specify environment on which the blueprint should be deployed on - this option is presented only when the blueprint is using [get_environment_capability]({{< relref "developer/blueprints/spec-intrinsic-functions#get_environment_capability" >}}) intrinsic function

1. Specify the input parameters or enter the location of a file that contains the input parameters

1. Click **Install** to create and install deployment or select **Deploy** in the dropdown to just create deployment.

After creating the deployment, you will be automatically redirected to a page with details about deployment status.
For information about deployment states, see the [Services Page]({{< relref "working_with/console/pages/services-page.md" >}}) documentation.


After initialization is complete, you can start using the deployment and executing workflows.


## Creating a Deployment via the CLI

To create a deployment using the {{< param cfy_cli_name >}} execute:

{{< highlight  bash >}}
cfy deployments create -b <BLUEPRINT_NAME> <DEPLOYMENT_NAME> --inputs </path/to/your/inputs.yaml​>
{{< /highlight >}}


#### Example: Creating a Deployment

This example shows how a deployment can be created for a blueprint, using the command line. For more information about creating deployments using the command line, [click here]({{< relref "cli/orch_cli/deployments.md" >}}).

First create an inputs file (in a similar way to the Manager blueprint's inputs dialog):

  <!-- gsTabContent "OpenStack" -->

  {{< highlight  yaml >}}
  inputs:
    image:
      description: >
        Image to be used when launching agent VM's
    flavor:
      description: >
        Flavor of the agent VM's
    agent_user:
      description: >
        User for connecting to agent VM's
  {{< /highlight >}}


Make a copy of the inputs template already provided and edit it:

  {{< highlight  bash  >}}
  cd cloudify-nodecellar-example/inputs/openstack.yaml.template
  cp openstack.yaml.template inputs.yaml
  {{< /highlight >}}
  The inputs.yaml file should look somewhat like this:
  {{< highlight  yaml >}}
  image: 8c096c29-a666-4b82-99c4-c77dc70cfb40
  flavor: 102
  agent_user: ubuntu
  {{< /highlight >}}

  <!-- /gsInitContent -->


All inputs have default values so no input file is needed.

To specify different values for one or more inputs, create an inputs.yaml file with the required inputs, for example:

 <!-- gsTabContent "SoftLayer"  -->

  {{< highlight  bash  >}}
  echo -e "domain: 'my_domain.org'\nlocation: '168642'" > inputs.yaml
  {{< /highlight >}}

  The inputs.yaml file will look like this:
  {{< highlight  yaml  >}}
  domain: 'my_domain.org'
  location: '168642'
  {{< /highlight >}}

  <!-- /gsInitContent -->

  <!-- gsTabContent "AWS EC2" -->

  {{< highlight  yaml >}}
  inputs:
    image:
      description: >
        Image to be used when launching agent VM's
    flavor:
      description: >
        Flavor of the agent VM's
    agent_user:
      description: >
        User for connecting to agent VM's
  {{< /highlight >}}

Make a copy of the inputs template already provided and edit it:

  {{< highlight  bash  >}}
  cd cloudify-nodecellar-example/inputs
  cp aws-ec2.yaml.template inputs.yaml
  {{< /highlight >}}
  The inputs.yaml file should look somewhat like this:
  {{< highlight  yaml >}}
    image: ''
    size: ''
    agent_user: ''
  {{< /highlight >}}

The image is again the AMI image ID. The size is the instance_type, and the agent user is the default user agent on the image type.

  <!-- /gsInitContent -->

  <!-- gsTabContent "vCloud" -->

  {{< highlight  yaml >}}
  inputs:
    vcloud_username:
        type: string
    vcloud_password:
        type: string
    vcloud_url:
        type: string
    vcloud_service:
        type: string
    vcloud_vcd:
        type: string
    catalog:
      type: string
    template:
      type: string
    agent_user:
      type: string
      default: ubuntu
    management_network_name:
      type: string
    floating_ip_gateway:
      type: string
    nodecellar_public_ip:
      type: string
  {{< /highlight >}}

Make a copy of the inputs template already provided and edit it:

  {{< highlight  bash  >}}
  cd cloudify-nodecellar-example/inputs
  cp vcloud.yaml.template inputs.yaml
  {{< /highlight >}}
  The inputs.yaml file should look somewhat like this:
  {{< highlight  yaml >}}
   vcloud_username: your_vcloud_username
   vcloud_password: your_vcloud_password
   vcloud_url: https://vchs.vmware.com
   vcloud_service: service_name
   vcloud_vdc: virtual_datacenter_name
   manager_server_name: your_manager
   manager_server_catalog: templates_catalog
   manager_server_template: template
   edge_gateway: gateway_name
   floating_ip_public_ip: ''
   management_network_name: management
   manager_private_key_path: "~/.ssh/vcloud_template.pem"
   agent_private_key_path: "~/.ssh/vcloud_template.pem"
  {{< /highlight >}}

  <!-- /gsInitContent -->

  <!-- /gsInitTab -->

Now that you have an inputs file, type the following command:

{{< highlight  bash >}}

cfy deployments create -b nodecellar nodecellar --inputs inputs.yaml

{{< /highlight >}}

You have created a deployment named `nodecellar`, based on a blueprint of the same name.

This deployment is not yet activated, because you have not yet executed an installation command.

If you open the [Services Page]({{< relref "working_with/console/pages/services-page.md" >}}) in the {{< param cfy_console_name >}}, you can see that all node instances are not yet initialized.


# Next Steps

After creating a deployment, you can [execute it]({{< relref "working_with/manager/execute-workflow.md" >}}).
