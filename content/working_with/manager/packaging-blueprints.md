---
layout: bt_wiki
title: Packaging a Blueprint
category: Blueprints
draft: false
weight: 350
aliases: /manager/packaging-blueprints/
---

A blueprint can contain multiple files. These files can reside under a single directory with subdirectories or in an archive. Although the Cloudify CLI can manage the archiving process for you during [upload]({{< relref "working_with/manager/upload-blueprint.md" >}}), you might want to create archives prior to uploading the blueprint, so that you can keep them in a fileserver, upload them via the {{< param cfy_console_name >}}, or send them to others. 

{{% tip title="Single YAML file blueprints" %}}
{{< param cfy_console_name >}} supports single YAML file blueprints. They can be uploaded without packaging them.
{{% /tip %}}

There are two methods for uploading a blueprint:

* Specify the directory in which the blueprint YAML file resides, which will create a tar.gz archive from the parent folder and upload it.
* Manually create a package, prior to uploading it (according to the following steps).


**Manually Creating a Blueprint Package**

When you create a package, your blueprint's archive must include a folder containing the blueprint's resources, together with a main blueprint YAML file (defaults to `blueprint.yaml`).

1. When your blueprint folder is ready, with the main blueprint inside it, use the following command to create a blueprint archive:

   {{< highlight  bash  >}}
   export COPYFILE_DISABLE=true
   tar czf blueprint-name.tar.gz blueprint-folder/
   {{< /highlight >}}

   * The `export` command prevents unwanted hidden files from being packaged inside the archive (i.e .DS_Store on OSX environment).
   * You can customize the file and folder names.

   The output file of the tar command above will be `blueprint-name.tar.gz`.

## Supported Archive Formats

The following archive formats are supported for uploading a blueprint via the CLI or {{< param cfy_console_name >}}:

* tar
* tar.gz
* zip
* tar.bz.
