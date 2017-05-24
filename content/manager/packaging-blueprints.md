---
layout: bt_wiki
title: Packaging a Blueprint
category: Blueprints
draft: false
weight: 350
---

A Blueprint can contain multiple files. These files can reside under a single directory with subdirectories or an archive. While Cloudify's CLI can take care of archiving process for you during the [upload process]({{< relref "manager/upload-blueprint.md" >}}), you might want to create archives prior to uploading the blueprint so that you can keep them in a fileserver, upload them via Cloudify's Web UI or send them to others.


There are 2 methods for uploading a blueprint:

* Provide the directory in which the blueprint YAML file resides - which will create a tar.gz from the parent folder and upload it.
* Create a package manually prior to uploading it (steps described below).


When creating a package, the blueprint's archive must include a folder containing the blueprint's resources along with a main blueprint YAML file (defaults to `blueprint.yaml`).

Once the user has the blueprint folder ready with the main blueprint inside it, the user can create a blueprint archive by using the command line:

{{< gsHighlight  bash  >}}
export COPYFILE_DISABLE=true
tar czf blueprint-name.tar.gz blueprint-folder/
{{< /gsHighlight >}}

* The `export` command will prevent unwanted hidden files from being packaged inside the archive (i.e .DS_Store on OSX environment)
* The file and folder names are customizable.

The output file of the tar command above will be `blueprint-name.tar.gz`.

## CLI Archive Formats Support

Currently uploading a blueprint via the CLI supports the following blueprint archive formats:

* tar
* tar.gz
* zip
* tar.bz

## UI Archive Formats Support

Currently, the only supported file extension is tar.gz.
