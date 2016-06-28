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

Usage: `cfy blueprints upload [options] -b BLUEPRINT_ID`

Upload a blueprint to a manager. 

#### Required flags

*  `-p, --blueprint-path=BLUEPRINT_PATH` -
                        The path to the application's blueprint file.
                        (default: blueprint.yaml)
*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID

#### Optional flags

*  `--validate` -           Validate the blueprint before uploading it to the
                        manager


### publish-archive

Usage: `cfy blueprints publish-archive [options] -b BLUEPRINT_ID`

Upload a blueprint achive to a manager. The difference between this and `upload` is that `upload` is done directly from a directory containing a blueprint, not a blueprint archive (e.g. `zip`, `tar.gz`).

#### Required flags

*  `-l, --archive-location=ARCHIVE_LOCATION` -
                        The path or URL to the application's blueprint archive
*  `-b, --blueprint-id=BLUEPRINT_ID` -
                        A user provided blueprint ID


#### Optional flags

*  `-n, --blueprint-filename=BLUEPRINT_FILENAME` -
                        The name of the archive's main blueprint file


### delete

Usage: `cfy blueprints delete -b BLUEPRINT_ID` 

Delete a blueprint. It's important to note that deleting a blueprint does not mean deleting the deployments created from that blueprint and resources of those deployments.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - A user provided blueprint ID


### download

Usage: `cfy blueprints download [options] -b BLUEPRINT_ID`

Download a blueprint from the manager.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

#### Optional flags

*  `-o, --output=OUTPUT` -
                        The local path of the downloaded blueprint


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


### list

Usage: `cfy blueprints list`

List all existing blueprints.


### get

Usage: `cfy blueprints get -b BLUEPRINT_ID`

Retrieve information for a single blueprint.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID


### inputs

Usage: `cfy blueprints inputs -b BLUEPRINT_ID`

Lists all inputs for a blueprint. Note that not every blueprint has inputs.

#### Required flags

*  `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

