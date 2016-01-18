---
layout: bt_wiki
title: Quickstart
category: Manager Intro
draft: false
weight: 200

quickstart_link: getting-started.html
blueprint_file_link: https://raw.githubusercontent.com/cloudify-cosmo/cloudify-nodecellar-example/3.3.1/singlehost-blueprint.yaml
virtualbox_link: https://www.virtualbox.org/
vagrant_link: http://www.vagrantup.com
vagrant_file_link: http://gigaspaces-repository-eu.s3.amazonaws.com/org/cloudify3/3.3.1/ga-RELEASE/Vagrantfile
terminology_link: reference-terminology.html
workflows_link: workflows-built-in.html
blueprint_guide_link: understanding-blueprints.html
installation_general_link: installation.html
nodecellar_version: 3.3.1
---

{{% gsSummary %}} {{% /gsSummary %}}

This tutorial assumes you are already familiar with terms such as blueprints and deployments.

The following walkthrough shows the same actions done locally, but on a manager.

# Step by Step Walkthrough

## Step 1: Run Cloudify Manager

You'll need to have the following setup in your environment:

* [Oracle VirtualBox]({{< field "virtualbox_link" >}}) (this box has been tested with version 4.3 or higher, but earlier versions should work as well).
* [Vagrant]({{< field "vagrant_link" >}}) (Make sure that you are using version 1.5 or above!).
* At least 2GB of free RAM


{{< gsHighlight  bash >}}
curl -L {{< field "vagrant_file_link" >}} > Vagrantfile
vagrant up
vagrant ssh
{{< /gsHighlight >}}

{{% gsNote title="Windows" %}}
for windows, please download the [Vagrantfile]({{< field "vagrant_file_link" >}}) instead of running `curl` and then proceed as usual
{{%/ gsNote %}}

At the end of this step you are able to:

* run command `cfy help` on virtual machine via ssh.
* browse to http://10.10.1.10 and see cloudify's webui.

## Step 2: Upload a Blueprint

{{< gsHighlight  bash >}}
cfy blueprints publish-archive \
   --blueprint-id nodecellar \
   --blueprint-filename simple-blueprint.yaml  \
   --archive-location https://github.com/cloudify-cosmo/cloudify-nodecellar-example/archive/{{< field "nodecellar_version" >}}.tar.gz
cfy blueprints list
{{< /gsHighlight >}}

The first command will upload our nodecellar example directly into the manager.
The second command will list all blueprints on manager.

{{% gsTip title="Lets have a look at the UI" %}}
Point your browser at the manager's URL again and refresh the screen. You will see the nodecellar blueprint listed there.
Click the blueprint. You can see its topology. A topology consists of elements called nodes.

In our case, we have the following nodes:

* One VM
* A nodejs server
* A MongoDB database
* A nodejs application called nodecellar (which is a nice sample nodejs application backed by mongodb).

{{% /gsTip %}}




<img src="/images/guide/quickstart/blueprints_table.png" href="/images/guide/quickstart/blueprints_table.png" title="Blueprints table" class="ui-thumbnail">
<img src="/images/guide/quickstart/nodecellar_singlehost_topology.png" href="/images/guide/quickstart/nodecellar_singlehost_topology.png" title="Nodecellar Blueprint" class="ui-thumbnail"/>


## Step 3: Create & Install a Deployment

In Cloudify, a deployment represents a virtual environment on your Cloudify Manager with all of the software components
needed to execute the application lifecycle described in a blueprint,
based on the inputs provided in the `cfy deployments create` command.

Lets create a deployment named `nodecellar` based on a blueprint with the same name.

Since the blueprint defines some inputs:

{{< gsHighlight yaml >}}
inputs:

  host_ip:
      description: >
        The ip of the host the application will be deployed on
  agent_user:
      description: >
        User name used when SSH-ing into the started machine
  agent_private_key_path:
      description: >
        Path to a private key that resided on the management machine.
        SSH-ing into agent machines will be done with this key.
{{< /gsHighlight >}}

We will use the following values suitable for the vagrantbox demo:

To create a deployment, type the following command:

{{< gsHighlight  bash >}}
cfy deployments create \
    --blueprint-id nodecellar \
    --deployment-id nodecellar \
    --inputs "agent_private_key_path=/home/vagrant/.ssh/id_rsa;agent_user=vagrant;host_ip=10.10.1.10"
cfy deployments list
{{< /gsHighlight >}}

Now lets install it
{{< gsHighlight  bash >}}
cfy executions start  \
    --workflow install  \
    --deployment-id nodecellar
{{< /gsHighlight >}}


Once installation is done, go to [http://10.10.1.10:8080](http://10.10.1.10:8080) to access it from your web browser


{{% gsThumbnail src="/images/guide/default_dashboard.png" %}}
{{% gsThumbnail src="/images/guide/quickstart/nodecellar.png" %}}
{{% gsThumbnail src="/images/guide/quickstart/nodecellar_deployment.png" %}}
{{% gsThumbnail src="/images/guide/quickstart/events.png" %}}

## Step 4: Uninstall & Remove Everything

Lets first uninstall the app, undeploy it and remove the blueprint.

{{< gsHighlight bash >}}

cfy executions start \
    --workflow uninstall \
    --deployment-id nodecellar
cfy deployments delete \
    --deployment-id nodecellar
cfy blueprints delete \
    --blueprint-id nodecellar

{{< /gsHighlight >}}


This completes the entire app lifecycle.

To complete the demo, exit the ssh console, remove the virtual machine, remove the vagrant box and the Vagrantfile.

{{< gsHighlight  bash >}}
exit
vagrant destroy -f
vagrant box remove cloudify-box
rm Vagrantfile
{{< /gsHighlight >}}

# What's next

In this guide you used a pre-bootstrapped manager on a vagrant box. <br/>
Now, you should read the [prerequisites for bootstrapping ]({{< relref "manager/prerequisites.md" >}}) your own manager <br/>



# Troubleshooting

In case something did not work for you, here are some common problems that might be useful:

* Your Hypervisor must support nested virtualization in order to run Virtualbox inside a VM. Unless you know you can run a VM inside a VM, please run the box from either your laptop or on a bare metal server.
* On Windows
  * Do not run the command prompt as Administrator (privilege escalation).
  * Hyper-V & Virtualbox [do not play nice together](https://docs.vagrantup.com/v2/hyperv/index.html). Disabling Hyper-V is possible by running the `bcdedit /set hypervisorlaunchtype off` command (reboot is needed).
* The DNS address used by cloudify in the getting-started box is set to 8.8.8.8. If you are unable to resolve an address, make sure this ip is reachable from your network.
