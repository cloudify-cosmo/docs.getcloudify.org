---
layout: bt_wiki
title: Uploading a Blueprint
category: Manager Intro
draft: false
weight: 400
---

Before Cloudify Manager can deploy your blueprint, you must upload it. You can upload a blueprint using the CLI or (for Premium users) the Cloudify Web interface.

Either use a blueprint that you have written or download an [example blueprint](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) to upload.

## Uploading via the CLI

When you upload your blueprint to Cloudify Manager from the Cloudify CLI, you must specify a path to a blueprint file or the blueprint archive. If you specify the path to the blueprint archive, you must also specify the blueprint filename.

**Example of Blueprint Archive Upload**
{{< gsHighlight  bash >}}
$ cfy blueprints upload -b BLUEPRINT_ID -n BLUEPRINT_FILENAME PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
{{< /gsHighlight >}}

**Example of Blueprint File Upload**
{{< gsHighlight  bash >}}
$ cfy blueprints upload -b BLUEPRINT_ID PATH_TO_BLUEPRINT_FILE
{{< /gsHighlight >}}

## Uploading a Blueprint via the Cloudify Web Interface

If you are a Premium version user, you can upload a pre-packaged blueprint archive, such as *.tar, *.tar.gz, *.tar.bz, *.zip., using the Cloudify Manager UI.

1. On the **Blueprints** widget, click **Upload**.   
   ![The blueprint upload button]({{< img "manager/ui_upload_blueprint_button.png" >}})
2. In the Upload blueprint dialog, either specify the URL of the blueprint archive, or select it from the filesystem.  
   ![The blueprint upload dialog]({{< img "manager/ui-upload-blueprint.png" >}})
3. Specify a distinguishing name for the blueprint.   
   For example, you might want to specify one instance of the blueprint upload as `blueprint-template` and another as a `blueprint-with-input`.
4. (Optional) Specify the YAML filename.   
   This field refers to to the *.yaml file that contains the application topology. If left blank, the default `blueprint.yaml` file is used. 
5. Click **Upload** to upload the upload the blueprint package.


## Uploading a Blueprint via the Command Line

The following scenario describes how to use the CLI to upload the Nodecellar blueprint.

If you have downloaded cloudify-nodecellar-example from github and want to use that blueprint for your specific IaaS, the appropriate command from the following:

  {{% gsInitTab %}}
  **OpenStack**

  {{% gsTabContent "OpenStack" %}}
  {{< gsHighlight  bash >}}
  cfy blueprints upload -b nodecellar -n openstack-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /gsHighlight >}}
  {{% /gsTabContent %}}

  **SoftLayer**
  {{% gsTabContent "SoftLayer" %}}
  {{< gsHighlight  bash >}}
  cfy blueprints upload -b nodecellar -n softlayer-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /gsHighlight >}}
  {{% /gsTabContent %}}

  **Amazon Web Service**
  {{% gsTabContent "AWS EC2" %}}
  {{< gsHighlight  bash >}}
  cfy blueprints upload -b nodecellar -n aws-ec2-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /gsHighlight >}}
  {{% /gsTabContent %}}

  **vCloud**
  {{% gsTabContent "vCloud " %}}
  {{< gsHighlight  bash >}}
  cfy blueprints upload -b nodecellar -n vcloud-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /gsHighlight >}}
  {{% /gsTabContent %}}

  {{% /gsInitTab %}}


<br/>
The `-b` flag assigns a unique name to the blueprint on Cloudify Manager. Before creating a deployment, review this blueprint.

Navigate to the Cloudify Manager URL and refresh the screen. The nodecellar blueprint widget is displayed.

  ![Blueprints table]({{< img "manager/blueprints_table.png" >}})

Click the blueprint to view its topology.<br>
A topology consists of elements called _nodes_.

In this case, the following nodes exist:

  * Two VM's (one for mongo and one for nodejs)
  * A nodejs server
  * A MongoDB database
  * A nodejs application called nodecellar (which is a sample nodejs application backed by mongodb).

  ![Nodecellar Blueprint]({{< img "manager/nodecellar_openstack_topology.png" >}})


# What's Next

You can now [deploy]({{< relref "manager/create-deployment.md" >}}) your blueprint.
