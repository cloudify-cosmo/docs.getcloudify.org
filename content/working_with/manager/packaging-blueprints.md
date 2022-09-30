---
title: Packaging a Blueprint
category: Blueprints
draft: false
weight: 350
aliases: /manager/packaging-blueprints/
---

A structure of blueprint can be simple with one YAML file only, or complex with multiple YAML files, subfolders and other resources. The blueprint should be archived before [uploading]({{< relref "working_with/manager/upload-blueprint.md" >}}) them to {{< param cfy_manager_name >}} via {{< param cfy_console_name >}}. The {{< param cfy_cli_name >}} can manage the archiving process for you during [upload]({{< relref "working_with/manager/upload-blueprint.md" >}}), or upload existing archive. Also the archive is needed to upload the blueprint to a marketplace, or a storage cloud.

{{% tip title="Single YAML file blueprints" %}}
{{< param cfy_console_name >}} supports single YAML file blueprints. They can be uploaded without packaging them.
{{% /tip %}}

### The archive structure

> Supported archive formats: TAR, TAR.GZ, TAR.BZ2, ZIP

The archive should contains a folder with the blueprint resources. The default name of the main YAML file is `blueprint.yaml`. Other names are allowed also, but should be specified on the blueprint uploading.

**Simple blueprint archive example:**

```shell
  test_blueprint.tar.gz
    test_blueprint
      blueprint.yaml
```

**Creating a Blueprint Package example:**

The commands bellow create TAR.GZ archive:

```shell
export COPYFILE_DISABLE=true
tar czvf test_blueprint.tar.gz test_blueprint/
```

> The command `export COPYFILE_DISABLE=true` prevents unwanted hidden files from being packaged inside the archive (i.e .DS_Store on OSX environment). The file and folder names can be customized.

The output file of the tar command above will be `test_blueprint.tar.gz`.
