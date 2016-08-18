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

#### Optional flags

These will work on each command

*  `-v, --verbose` -    Show verbose output. You can supply this up to three
                        times (i.e. -vvv)
*  `-h, --help` -       Show this message and exit.

## Commands

### upload

Usage: `cfy blueprints upload [options] BLUEPRINT_ID`

Upload a blueprint to a manager. 

`BLUEPRINT_PATH` can be either a local blueprint yaml file or blueprint
archive; a url to a blueprint archive or an
`organization/blueprint_repo[:tag/branch]` (to be retrieved from GitHub)

#### Optional flags

* `-b, --blueprint-id=BLUEPRINT_ID` - 
                        A user provided blueprint ID

* `-n, --blueprint-filename TEXT` -  
                        The name of the archive's main blueprint
                        file. This is only relevant if uploading an
                        archive

* `--validate` -                                
                        Validate the blueprint before uploading it to the
                        manager

&nbsp;
#### Example

```markdown
$ cfy blueprints upload simple-python-webserver-blueprint/blueprint.yaml
...

blueprint.yaml 
Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint uploaded. The blueprint's id is simple-python-webserver-blueprint

...

$ cfy blueprints upload simple-python-webserver-blueprint/blueprint.yaml --validate
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully
Uploading blueprint simple-python-webserver-blueprint/blueprint.yaml...
 blueprint.yaml |######################################################| 100.0%
Blueprint uploaded. The blueprint's id is simple-python-webserver-blueprint

...
```

### delete

Usage: `cfy blueprints delete [OPTIONS] BLUEPRINT_ID`

Delete a blueprint. It's important to note that deleting a blueprint does not mean deleting the deployments created from that blueprint and resources of those deployments.


&nbsp;
#### Example

```markdown
$ cfy blueprints delete simple-python-webserver-blueprint
...

Deleting blueprint simple-python-webserver-blueprint...
Blueprint deleted

...
```

### package

Usage: `cfy blueprints package [OPTIONS] BLUEPRINT_PATH`

Create a blueprint archive

`BLUEPRINT_PATH` -      is either the path to the blueprint yaml itself or to the directory in which the
                        blueprint yaml files resides.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to
*  `--validate` -       Validate the blueprint first

&nbsp;
#### Example

```markdown
$ cfy blueprints package simple-python-webserver-blueprint/blueprint.yaml
...

Creating blueprint archive simple-python-webserver-blueprint...
Packaging complete!

...
```

### download

Usage: `cfy blueprints download [OPTIONS] BLUEPRINT_ID`

Download a blueprint from the manager.

`BLUEPRINT_ID` -        is the id of the blueprint to download.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to

&nbsp;
#### Example

```markdown
$ cfy blueprints download simple-python-webserver-blueprint
...

Downloading blueprint simple-python-webserver-blueprint...
 simple-python-web... |################################################| 100.0%
Blueprint downloaded as simple-python-webserver-blueprint.tar.gz

...
```

### validate

Usage: `cfy blueprints validate [OPTIONS] BLUEPRINT_PATH`

Validate a blueprint. This checks that the blueprint's syntax is valid and that all imports are accessible.

{{% gsNote title="Note" %}}
Import validation is done only on the client side. That means that if, for some reason, the imports are accessible by the client but not on the manager, this validation will still pass.
{{% /gsNote %}}

`BLUEPRINT_PATH` -      is the path of the blueprint to validate.

&nbsp;
#### Example

```markdown
$ cfy blueprints validate simple-python-webserver-blueprint/blueprint.yaml
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
```

### create-requirements

Usage: `cfy blueprints create-requirements [OPTIONS] BLUEPRINT_PATH`

Generate a pip-compliant requirements file for a given blueprint

`BLUEPRINT_PATH` -      is the path to the blueprint for which the file will be
                        generated.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to

&nbsp;
#### Example

```markdown
$ cfy blueprints create-requirements nodecellar-blueprint/aws-ec2-blueprint.yaml
...

https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip

...
```

### install-plugins

Usage: `cfy blueprints install-plugins [OPTIONS] BLUEPRINT_PATH`

Install the necessary plugins for a given blueprint in the local
environment.

Currently only supports passing the YAML of the blueprint directly.

`BLUEPRINT_PATH` -      is the path to the blueprint to install plugins for.

&nbsp;
#### Example

```markdown
$ cfy blueprints install-plugins nodecellar-blueprint/aws-ec2-blueprint.yaml
...

Collecting https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (from -r /var/folders/p3/xrjr1c953yv5fnk719ndljnr0000gn/T/requirements_OFhCHL.txt (line 1))
  Downloading https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip (124kB)
.
.
.
Installing collected packages: ConfigObj, psutil, diamond, cloudify-diamond-plugin
  Running setup.py install for cloudify-diamond-plugin ... done
Successfully installed ConfigObj-5.0.6 cloudify-diamond-plugin-1.3.3 diamond-3.5.0 psutil-2.1.1

...
```

### list

Usage: `cfy blueprints list [OPTIONS]`

List all existing blueprints.

#### Optional flags

*  `--sort-by TEXT`     Key for sorting the list

*  `--descending`       Sort list in descending order [default: False]

&nbsp;
#### Example

```markdown
$ cfy blueprints list
...

Listing all blueprints...

Blueprints:
+-----------------------------------+-------------+----------------+--------------------------+--------------------------+
|                 id                | description | main_file_name |        created_at        |        updated_at        |
+-----------------------------------+-------------+----------------+--------------------------+--------------------------+
|               simple              |             | blueprint.yaml | 2016-08-02 11:02:51.562  | 2016-08-02T11:02:51.562Z |
| simple-python-webserver-blueprint |             | blueprint.yaml | 2016-08-02 11:10:15.527  | 2016-08-02T11:10:15.527Z |
+-----------------------------------+-------------+----------------+--------------------------+--------------------------+

...
```

### get

Usage: `cfy blueprints get [OPTIONS] BLUEPRINT_ID`

Retrieve information for a specific blueprint

`BLUEPRINT_ID` -        is the id of the blueprint to get information on.

&nbsp;
#### Example

```markdown
$ cfy blueprints get simple-python-webserver-blueprint
...

Retrieving blueprint simple-python-webserver-blueprint...

Blueprint:
+-----------------------------------+----------------+--------------------------+--------------------------+--------------+
|                 id                | main_file_name |        created_at        |        updated_at        | #deployments |
+-----------------------------------+----------------+--------------------------+--------------------------+--------------+
| simple-python-webserver-blueprint | blueprint.yaml | 2016-08-02 11:19:02.177  | 2016-08-02T11:19:02.177Z |      1       |
+-----------------------------------+----------------+--------------------------+--------------------------+--------------+

Description:


Existing deployments:
["simple-python-webserver-blueprint"]
...
```

### inputs

Usage: `cfy blueprints inputs [OPTIONS] BLUEPRINT_ID`

Retrieve inputs for a specific blueprint

`BLUEPRINT_ID` -        is the path of the blueprint to get inputs for.

&nbsp;
#### Example

```markdown
$ cfy blueprints inputs simple-python-webserver-blueprint
...

Retrieving inputs for blueprint simple-python-webserver-blueprint...

Inputs:
+----------------+------+-----------+---------------------------+
|      name      | type |  default  |        description        |
+----------------+------+-----------+---------------------------+
| webserver_port |  -   |    8000   | The HTTP web server port. |
|                |      |           |                           |
|    host_ip     |  -   | localhost |             -             |
+----------------+------+-----------+---------------------------+

...
```