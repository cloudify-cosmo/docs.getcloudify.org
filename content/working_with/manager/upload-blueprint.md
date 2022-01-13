---
layout: bt_wiki
title: Uploading a Blueprint
category: Manager Intro
draft: false
weight: 400
aliases: /manager/upload-blueprint/
---

Before you can deploy a blueprint, you must upload the blueprint to the {{< param cfy_manager_name >}}. 

You can upload a blueprint using the CLI. You can also upload using the {{< param cfy_console_name >}}.

Either use a blueprint that you have written or download an [example blueprint](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) to upload.


## Uploading a Blueprint using the {{< param cfy_console_name >}}

You can upload a pre-packaged blueprint archive through the {{< param cfy_console_name >}} in tar, tar.gz, tar.bz, or zip formats.

1. On the [Local Blueprints page]({{< relref "working_with/console/pages/blueprints-page.md" >}}) click **Upload** button.
1. Provide blueprint archive from your computer or by providing URL.
1. Enter an unique name for the blueprint.
   For example, you can upload one instance of the blueprint as `blueprint-template` and another instance as a `blueprint-with-input`.
1. Select the YAML filename of the blueprint.
   This field refers to the .yaml file that contains the application topology.
1. Click **Upload** to upload the blueprint package.

![The blueprint upload dialog]( /images/manager/ui-upload-blueprint.png )

## Uploading a Blueprint using the Command Line

From the {{< param cfy_cli_name >}}, you can upload your blueprint to {{< param cfy_manager_name >}}. You must specify the path to a blueprint file.

The syntax of the `upload` command is:
{{< highlight  bash >}}
$ cfy blueprints upload -b BLUEPRINT_ID -n BLUEPRINT_FILENAME PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
{{< /highlight >}}

For example, to upload the cloudify-nodecellar-example from GitHub:

1. Download the [cloudify-nodecellar-example](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) as a ZIP file.
2. Copy the ZIP file to your {{< param cfy_manager_name >}}.
3. Extract the ZIP file to a directory.
4. In the CLI of your {{< param cfy_manager_name >}}, change directory to the cloudify-nodecellar-example directory.
5. Enter the command for your IaaS:

  <!-- gsInitTab -->
  **OpenStack**

  <!-- gsTabContent "OpenStack" -->
  {{< highlight  bash >}}
  cfy blueprints upload -b nodecellar -n openstack-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /highlight >}}
  <!-- /gsInitContent -->

  **SoftLayer**
  <!-- gsTabContent "SoftLayer" -->
  {{< highlight  bash >}}
  cfy blueprints upload -b nodecellar -n softlayer-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /highlight >}}
  <!-- /gsInitContent -->

  **Amazon Web Service**
  <!-- gsTabContent "AWS EC2" -->
  {{< highlight  bash >}}
  cfy blueprints upload -b nodecellar -n aws-ec2-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /highlight >}}
  <!-- /gsInitContent -->

  **vCloud**
  <!-- gsTabContent "vCloud " -->
  {{< highlight  bash >}}
  cfy blueprints upload -b nodecellar -n vcloud-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /highlight >}}
  <!-- /gsInitContent -->

  <!-- /gsInitTab -->

The `-b` flag assigns a unique name to the blueprint on {{< param cfy_manager_name >}}.

You can navigate to the {{< param cfy_manager_name >}} URL and see the nodecellar blueprint in your list of local blueprints.

  ![Blueprints table]( /images/manager/blueprints_table.png )

Click the blueprint to view its topology. A topology consists of elements called _nodes_. The nodecellar example, includes these nodes:

  * Two VMs (one for MongoDB and one for Node.js)
  * A Node.js server
  * A MongoDB database
  * A Node.js application called nodecellar (A sample Node.js application)

  ![Nodecellar Blueprint]( /images/manager/nodecellar_local_topology.png )


# Next Steps

You can now [deploy]({{< relref "working_with/manager/create-deployment.md" >}}) your blueprint.
