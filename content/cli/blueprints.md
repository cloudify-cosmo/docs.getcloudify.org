---
layout: bt_wiki
title: blueprints
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 20
---

The `cfy blueprints` command is used to manage blueprints on a Cloudify manager.

You can use the command to upload, delete, download, validate and list blueprints and to retrieve information for a specific blueprint.


## Commands

### upload

Usage: `cfy blueprints upload [options] -p BLUEPRINT_PATH -b BLUEPRINT_ID`

Upload a blueprint to a manager. 

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)
*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID

#### Optional flags

*  `--validate` -           Validate the blueprint before uploading it to the
                        manager

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints upload -p simple-python-webserver-blueprint/blueprint.yaml -b simple
...

Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
Blueprint uploaded. The blueprint's id is simple

...

$ cfy blueprints upload --validate -p simple-python-webserver-blueprint/blueprint.yaml -b simple
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully
Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
Blueprint uploaded. The blueprint's id is simple

...
{{< /gsHighlight >}}


### publish-archive

Usage: `cfy blueprints publish-archive [options] -l ARCHIVE_LOCATION -b BLUEPRINT_ID`

Upload a blueprint archive to a manager. The difference between this and `upload` is that `upload` is done directly from a directory containing a blueprint, not a blueprint archive (e.g. `zip`, `tar.gz`).

#### Required flags

*  `-l, --archive-location=ARCHIVE_LOCATION` -
                        The path or URL to the application's blueprint archive
*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID


#### Optional flags

*  `-n, --blueprint-filename=BLUEPRINT_FILENAME` -
                        The name of the archive's main blueprint file

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints publish-archive -l simple.tar.gz -b simple
...

Publishing blueprint archive from path simple.tar.gz...
Blueprint archive published. The blueprint's id is simple

...
{{< /gsHighlight >}}

### delete

Usage: `cfy blueprints delete -b BLUEPRINT_ID` 

Delete a blueprint. It's important to note that deleting a blueprint does not mean deleting the deployments created from that blueprint and resources of those deployments.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints delete -b simple
...

Deleting blueprint simple...
Blueprint deleted

...
{{< /gsHighlight >}}


### download

Usage: `cfy blueprints download [options] -b BLUEPRINT_ID`

Download a blueprint from the manager.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

#### Optional flags

*  `-o, --output=OUTPUT` -
                        The local path of the downloaded blueprint

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints download -b simple
...

Downloading blueprint simple...
Blueprint downloaded as simple.tar.gz

...
{{< /gsHighlight >}}


### validate

Usage: `cfy blueprints validate -p BLUEPRINT_PATH` 

Validate a blueprint. This checks that the blueprint's syntax is valid and that all imports are accessible.

{{% gsNote title="Note" %}}
Import validation is done only on the client side. That means that if, for some reason, the imports are accessible by the client but not on the manager, this validation will still pass.
{{% /gsNote %}}

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH`
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints validate -p simple-python-webserver-blueprint/blueprint.yaml
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
{{< /gsHighlight >}}

### list

Usage: `cfy blueprints list`

List all existing blueprints.

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints list
...

Listing all blueprints...

Available blueprints:
+------------+----------------------+------------------------+----------------------------+----------------------------+
|     id     |     description      |     main_file_name     |         created_at         |         updated_at         |
+------------+----------------------+------------------------+----------------------------+----------------------------+
| nodecellar | This blueprint ins.. | aws-ec2-blueprint.yaml | 2016-06-27 10:30:37.698852 | 2016-06-27 10:30:37.698852 |
|   simple   | This blueprint dep.. |     blueprint.yaml     | 2016-06-27 10:41:07.374311 | 2016-06-27 10:41:07.374311 |
+------------+----------------------+------------------------+----------------------------+----------------------------+

...
{{< /gsHighlight >}}

### get

Usage: `cfy blueprints get -b BLUEPRINT_ID`

Retrieve information for a single blueprint.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints get -b simple
...

Retrieving blueprint simple...

Blueprint:
+--------+----------------+----------------------------+----------------------------+--------------+
|   id   | main_file_name |         created_at         |         updated_at         | #deployments |
+--------+----------------+----------------------------+----------------------------+--------------+
| simple | blueprint.yaml | 2016-06-27 10:41:07.374311 | 2016-06-27 10:41:07.374311 |      1       |
+--------+----------------+----------------------------+----------------------------+--------------+

Description:
This blueprint deploys a simple web site


Existing deployments:
["simple_website"]

...
{{< /gsHighlight >}}

### inputs

Usage: `cfy blueprints inputs -b BLUEPRINT_ID`

List all inputs for a blueprint. Note that not every blueprint has inputs.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

&nbsp;
#### Example

{{< gsHighlight  markdown  >}}
$ cfy blueprints inputs -b simple
...

Retrieving inputs for blueprint simple...

Inputs:
+----------------+------+-----------+---------------------------+
|      name      | type |  default  |        description        |
+----------------+------+-----------+---------------------------+
| webserver_port |  -   |    8000   | The HTTP web server port. |
|                |      |           |                           |
|    host_ip     |  -   | localhost |             -             |
+----------------+------+-----------+---------------------------+

...
{{< /gsHighlight >}}
