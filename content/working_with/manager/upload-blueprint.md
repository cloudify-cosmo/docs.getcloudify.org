---
title: Uploading a Blueprint
category: Manager Intro
draft: false
weight: 400
aliases: /manager/upload-blueprint/
---

As a first step a blueprint should be uploaded to the {{< param cfy_manager_name >}}. Deployment services and deployment environments are spinned up from uploaded blueprints.

The blueprint can be uploaded to the {{< param cfy_manager_name >}} with {{< param cfy_cli_name >}}, {{< param cfy_console_name >}}, or {{< param cfy_api_name>}}.

The blueprint can be provided as an archive, or a link to github site, or just a YAML file.
> Single blueprint YAML file can be uploaded without packaging them through the {{< param cfy_console_name >}}.

### Uploading a blueprint from Blueprints marketplace

1. On the [Blueprints page]({{< relref "working_with/console/pages/blueprints-page.md" >}}) click **Upload** button and choose **Upload from Marketplace** option.
2. On the Marketplace select a blueprint and click to [the "Upload blueprint" button]( /images/manager/marketplace_upload_blueprint_button.png). After this the blueprint will be uploaded and the service create wizard will be opened.

### Uploading a Blueprint using the {{< param cfy_console_name >}}

> Supported archive formats: TAR, TAR.GZ, TAR.BZ2, ZIP

1. On the [Blueprints page]({{< relref "working_with/console/pages/blueprints-page.md" >}}) click **Upload** button and choose **Upload a blueprint package** option.
2. Select a blueprint package from a local folder or providing URL to the archive.
3. Enter an unique name for the blueprint.
   For example, you can upload one instance of the blueprint as `blueprint-template` and another instance as a `blueprint-with-input`.
4. Select the YAML filename of the blueprint.
   This field refers to the .yaml file that contains the application topology.
5. Click **Upload** to upload the blueprint package.

![The blueprint upload dialog]( /images/manager/ui-upload-blueprint.png )

## Uploading a Blueprint using the {{< param cfy_cli_name >}}

The {{< param cfy_cli_name >}} allows to upload packaged blueprints and unpackaged blueprints.

### The blueprint uploading command examples

**The packaged blueprint:**

```shell
cfy blueprints upload -b BLUEPRINT_ID -n BLUEPRINT_FILENAME PATH_OR_URL_OF_BLUEPRINT_PACKAGE
```

**The unpackaged blueprint:**

```shell
cfy blueprint upload -b BLUEPRINT_ID BLUEPRINT_FILENAME
```

**Additional examples:**

The cloudify-nodecellar-example from GitHub:

1. Download the [cloudify-nodecellar-example](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) as a ZIP file.
2. Enter the command for your IaaS:

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

  **vCloud Air**
  <!-- gsTabContent "vCloud Air" -->
  {{< highlight  bash >}}
  cfy blueprints upload -b nodecellar -n vcloud-blueprint.yaml PATH_OR_URL_OF_BLUEPRINT_ARCHIVE
  {{< /highlight >}}
  <!-- /gsInitContent -->

  <!-- /gsInitTab -->

The `-b` flag assigns a unique name to the blueprint on {{< param cfy_manager_name >}}.

You can navigate to the {{< param cfy_manager_name >}} URL and see the nodecellar blueprint in your list of blueprints.

<img src="/images/manager/blueprints_table.png" alt="Blueprints table" width="250"/>

Click the blueprint to view its topology. A topology consists of elements called _nodes_. The nodecellar example, includes these nodes:

  * Two VMs (one for MongoDB and one for Node.js)
  * A Node.js server
  * A MongoDB database
  * A Node.js application called nodecellar (A sample Node.js application)

  ![Nodecellar Blueprint]( /images/manager/nodecellar_local_topology.png )


# Next Steps

You can now [deploy]({{< relref "working_with/manager/create-deployment.md" >}}) your blueprint.
