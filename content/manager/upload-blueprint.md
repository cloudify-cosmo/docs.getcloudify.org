---
layout: bt_wiki
title: Uploading a Blueprint
category: Manager Intro
draft: false
weight: 400
---



For the Manager to be able to deploy your blueprint, you need to upload it to the manager.<br/>
You can upload a blueprint using the CLI or the Web UI.

While the CLI handles the packaging for you, and allows you to upload by pointing to the YAML file directly,
packaging a blueprint is useful for scenarios such as:


 * upload blueprint with a url (a.k.a `cfy blueprint publish-archive`)
 * upload blueprint with the UI

If you haven't already written a blueprint, you can either [write one now]({{< relref "intro/blueprints.md" >}}) or you can download an [example blueprint](https://github.com/cloudify-cosmo/cloudify-nodecellar-example) for you to upload.

## Package Your Blueprint

Cloudify supports the following compression formats: tar, tar.gz, zip, tar.bz.<br/>

For the package to be valid, it must include a single top-level directory.<br/>
The blueprint YAML file should reside under that top-level directory. <br/>

{{% gsTip title="Save keystrokes" %}}
By default, the manager looks for file named "blueprint.yaml". You can override this parameter when uploading.
{{% /gsTip %}}


After organizing your files to match the described structure, you can pack the blueprint by running

{{< gsHighlight  bash  >}}
COPYFILE_DISABLE=true tar czf blueprint-name.tar.gz blueprint-folder/
{{< /gsHighlight >}}

{{% gsTip title="avoid hidden files" %}}
The `COPYFILE_DISABLE` variable will prevent unwanted hidden files from being packaged inside the archive (i.e .DS_Store on OSX environment)
{{% /gsTip %}}


## Uploading via the CLI

The Cloudify command-line features two ways of uploading your blueprint to the manager:

 * `publish-archive` allows you to upload a packaged blueprint.
 * `upload` allows you to specify a path to a Blueprint file, and the Cloudify will take care of packaging the blueprint as well.

Here is an example of `publish_archive`:
{{< gsHighlight  bash >}}
cfy blueprints publish-archive \
    --archive-location ARCHIVE_LOCATION \
    --blueprint-id BLUEPRINT_ID \
    --blueprint-filename BLUEPRINT_FILENAME
{{< /gsHighlight >}}

Here is an example of `upload`:

{{< gsHighlight  bash >}}
cfy blueprints upload \
    --blueprint-id BLUEPRINT_ID \
    --blueprint-path BLUEPRINT_FILE_LOCATION
{{< /gsHighlight >}}


## Uploading via the Web UI

Cloudify UI supports uploading packaged blueprints. <br/>
To upload a blueprint, do the following steps:

 * Open the upload blueprint dialog by clicking the "Upload Blueprint" button
 * Fill in details
    * Select blueprint archive by either browsing for the file or typing a url.
    * Give the blueprint name
    * Declare the main blueprint file. (blueprint.yaml by default)
 * Click "Save"

{{< gsThumbnail src="images/ui/ui_upload_blueprint_button.png"  title="The blueprint upload button">}}
{{< gsThumbnail src="images/ui/ui-upload-blueprint.png"  title="The blueprint upload dialog">}}
{{< gsThumbnail src="images/ui/ui-upload-blueprint-with-input.png"  title="The user can enter a custom blueprint name">}}
{{< gsThumbnail src="images/guide/quickstart/blueprints_table.png"  title="Blueprints table">}}
{{< gsThumbnail src="images/guide/quickstart/nodecellar_singlehost_topology.png"  title="Blueprints topology">}}


# What's Next

You should now have a Blueprint ready for you to [deploy]({{< relref "manager/create-deployment.md" >}}).
