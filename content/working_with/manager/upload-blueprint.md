---
layout: bt_wiki
title: Uploading a Blueprint
category: Manager Intro
draft: false
weight: 400
aliases: /manager/upload-blueprint/
---

Before you can deploy a blueprint, you must upload the blueprint to the Cloudify Manager. 

You can upload a blueprint using the CLI. You can also upload using the Cloudify Console.

Either use a blueprint that you have written or download an [example blueprint](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) to upload.


## Uploading a Blueprint using the Cloudify Console

You can upload a pre-packaged blueprint archive through the Cloudify Console in tar, tar.gz, tar.bz, or zip formats.

1. On the **Blueprints Catalog** widget in **Cloudify Catalog** page, click **Upload**.  
   ![The blueprint upload button]( /images/manager/ui_upload_blueprint_button.png )
2. Enter an unique name for the blueprint.
   For example, you can upload one instance of the blueprint as `blueprint-template` and another instance as a `blueprint-with-input`.
3. Select the YAML filename of the blueprint.
   This field refers to the .yaml file that contains the application topology.
   ![The blueprint upload dialog]( /images/manager/ui-upload-blueprint.png )
4. Click **Upload** to upload the upload the blueprint package.


## Uploading a Blueprint using the Command Line

From the Cloudify command-line interface, you can upload your blueprint to Cloudify Manager. You must specify the path to a blueprint file.

The syntax of the `upload` command is:
{{< highlight  bash >}}
$ cfy blueprints upload -b BLUEPRINT_ID -n BLUEPRINT_FILENAME PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
{{< /highlight >}}

For example, to upload the cloudify-nodecellar-example from GitHub:

1. Download the [cloudify-nodecellar-example](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) as a ZIP file.
2. Copy the ZIP file to your Cloudify Manager.
3. Extract the ZIP file to a directory.
4. In the CLI of your Cloudify Manager, change directory to the cloudify-nodecellar-example directory.
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

The `-b` flag assigns a unique name to the blueprint on Cloudify Manager. 

You can navigate to the Cloudify Manager URL and see the nodecellar blueprint in your list of local blueprints.

  ![Blueprints table]( /images/manager/blueprints_table.png )

Click the blueprint to view its topology. A topology consists of elements called _nodes_. The nodecellar example, includes these nodes:

  * Two VMs (one for MongoDB and one for Node.js)
  * A Node.js server
  * A MongoDB database
  * A Node.js application called nodecellar (A sample Node.js application)

  ![Nodecellar Blueprint]( /images/manager/nodecellar_local_topology.png )


# Next Steps

You can now [deploy]({{< relref "working_with/manager/create-deployment.md" >}}) your blueprint.
