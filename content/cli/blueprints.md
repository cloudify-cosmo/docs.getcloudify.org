---
layout: bt_wiki
title: blueprints
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 20
---

The `cfy blueprints` command is used to manage blueprints on a Cloudify Manager instance.

You can use the command to upload, delete, download, validate and list blueprints and to retrieve information for a specific blueprint.

{{% gsNote title="Note" %}}
Use of spaces is not supported in file names.
{{% /gsNote %}}

#### Optional flags

These will work on each command

*  `-v, --verbose` -    Show verbose output. You can supply this up to three
                        times (i.e. -vvv)
*  `-h, --help` -       Show this message and exit.

## Commands

### upload

#### Usage 
`cfy blueprints upload [options] BLUEPRINT_PATH`

Upload a blueprint to a Cloudify Manager. 

`BLUEPRINT_PATH` can be either a local blueprint yaml file or blueprint
archive; a url to a blueprint archive or an
`organization/blueprint_repo[:tag/branch]` (to be retrieved from GitHub)

#### Optional flags

* `-b, --blueprint-id=BLUEPRINT_ID` - 
                        The unique identifier for the blueprint

* `-n, --blueprint-filename TEXT` -  
                        The name of the archive's main blueprint
                        file. Only relevant if uploading an
                        archive.

* `--validate` -                                
                        Validate the blueprint before uploading it to the
                        manager

* `-t --tenant-name TEXT` -                                
                        The name of the tenant of the blueprint. If not
                        specified, the current tenant is used.

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprint upload simple-blueprint.yaml 
...

Uploading blueprint simple-blueprint.yaml...
 simple-blueprint.... |################################################| 100.0%
Blueprint uploaded. The blueprint's id is cloudify-nodecellar-example

...

$ cfy blueprints upload simple-python-webserver-blueprint/blueprint.yaml --validate
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
{{< /gsHighlight >}}

### delete

#### Usage 
`cfy blueprints delete [OPTIONS] BLUEPRINT_ID`


Delete a blueprint. It's important to note that deleting a blueprint does not delete the deployments created from that blueprint and resources of those deployments.

#### Optional Flags

* `--tenant-name TEXT` -   The name of the tenant of the relevant  
                           deployment(s). If not specified, the 
                           current tenant is used

&nbsp;
#### Example

{{< gsHighlight  bash  >}}

$ cfy blueprints delete simple-python-webserver-blueprint
...

Deleting blueprint simple-python-webserver-blueprint...
Blueprint deleted

...
{{< /gsHighlight >}}

### package

#### Usage 
`cfy blueprints package [OPTIONS] BLUEPRINT_PATH`

Create a blueprint archive

`BLUEPRINT_PATH` -      The path to the blueprint yaml or to the directory in which the
                        blueprint yaml files resides.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to
*  `--validate` -       Validate the blueprint first

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints package simple-python-webserver-blueprint/blueprint.yaml
...

Creating blueprint archive simple-python-webserver-blueprint...
Packaging complete!

...
{{< /gsHighlight >}}

### download

#### Usage 
`cfy blueprints download [OPTIONS] BLUEPRINT_ID`

Download a blueprint from Cloudify Manager.

`BLUEPRINT_ID` -        The ID of the blueprint to download.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints download simple-python-webserver-blueprint
...

Downloading blueprint simple-python-webserver-blueprint...
 simple-python-web... |################################################| 100.0%
Blueprint downloaded as simple-python-webserver-blueprint.tar.gz

...
{{< /gsHighlight >}}

### validate

#### Usage 
`cfy blueprints validate [OPTIONS] BLUEPRINT_PATH`

Validate a blueprint. Checks that the blueprint's syntax is valid and that all imports are accessible.

{{% gsNote title="Note" %}}
Import validation is done only on the client side. That means that if, for some reason, the imports are accessible by the client but not on the manager, this validation will still pass.
{{% /gsNote %}}

`BLUEPRINT_PATH` -      The path of the blueprint to validate.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints validate simple-python-webserver-blueprint/blueprint.yaml
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
{{< /gsHighlight >}}

### create-requirements

#### Usage 
`cfy blueprints create-requirements [OPTIONS] BLUEPRINT_PATH`

Generate a pip-compliant requirements file for a specific blueprint.

`BLUEPRINT_PATH` -      The path to the blueprint for which the file will be
                        generated.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints create-requirements nodecellar-blueprint/aws-ec2-blueprint.yaml
...

https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip
https://github.com/cloudify-cosmo/cloudify-diamond-plugin/archive/1.3.3.zip

...
{{< /gsHighlight >}}

### install-plugins

#### Usage 
`cfy blueprints install-plugins [OPTIONS] BLUEPRINT_PATH`

Install the necessary plugins for a specific blueprint in the local
environment.

Only supports passing the YAML of the blueprint directly.

`BLUEPRINT_PATH` -      The path to the blueprint to install plugins for.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints install-plugins nodecellar-blueprint/aws-ec2-blueprint.yaml
...

Installing plugins...
Collecting https://github...
.
.
.
Installing collected packages: boto, cloudify-aws-plugin
  Running setup.py install for cloudify-aws-plugin ... done
Successfully installed boto-2.38.0 cloudify-aws-plugin-1.4.3

...
{{< /gsHighlight >}}

### list

#### Usage 
`cfy blueprints list [OPTIONS]`

List all existing blueprints.

#### Optional flags

*  `--sort-by TEXT`     Key for sorting the list

*  `--descending`       Sort list in descending order [default: False]

*  `-t --tenant-name TEXT`     The name of the tenant for which to list the blueprints. If
                          not specified, the current tenant is used. This
                          argument cannot be used simultaneously with the `all-tenants` argument.

*  `-a --all-tenants`       Include resources from all tenants associated with
                          the user. This option cannot be used simultaneously with the `tenant-name` argument.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints list
...

Listing all blueprints...

Blueprints:
+------------------------------+----------------------+---------------------------+--------------------------+--------------------------+------------+----------------+------------+
|              id              |     description      |       main_file_name      |        created_at        |        updated_at        | visibility |  tenant_name   | created_by |
+------------------------------+----------------------+---------------------------+--------------------------+--------------------------+------------+----------------+------------+
| cloudify-nodecellar-example  | This Blueprint ins.. |   simple-blueprint.yaml   | 2017-04-04 05:52:32.634  | 2017-04-04 05:52:32.634  |   private  | default_tenant |   admin    |
| cloudify-hello-world-example | This blueprint ins.. | singlehost-blueprint.yaml | 2017-04-04 06:48:53.255  | 2017-04-04 06:48:53.255  |   tenant   | default_tenant |   admin    |
+------------------------------+----------------------+---------------------------+--------------------------+--------------------------+------------+----------------+------------+

...
{{< /gsHighlight >}}

### get

#### Usage 
`cfy blueprints get [OPTIONS] BLUEPRINT_ID`

Retrieve information for a specific blueprint.

`BLUEPRINT_ID` -        The ID of the blueprint for which to retrieve information.

#### Optional flags

*  `-t --tenant-name TEXT`     The name of the tenant for which to retrieve the blueprint information. If
                          not specified, the current tenant is used. 

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints get cloudify-nodecellar-example
...

Blueprint:
+-----------------------------+----------------------------------------------------+-----------------------+--------------------------+--------------------------+------------+----------------+------------+--------------+
|              id             |                    description                     |     main_file_name    |        created_at        |        updated_at        | visibility |  tenant_name   | created_by | #deployments |
+-----------------------------+----------------------------------------------------+-----------------------+--------------------------+--------------------------+------------+----------------+------------+--------------+
| cloudify-nodecellar-example | This Blueprint installs the nodecellar application | simple-blueprint.yaml | 2017-04-04 05:52:32.634  | 2017-04-04 05:52:32.634  |   tenant   | default_tenant |   admin    |      1       |
|                             |                on an existing host.                |                       |                          |                          |            |                |            |              |
|                             |                                                    |                       |                          |                          |            |                |            |              |
+-----------------------------+----------------------------------------------------+-----------------------+--------------------------+--------------------------+------------+----------------+------------+--------------+

Description:
This Blueprint installs the nodecellar application on an existing host.


Existing deployments:
["cloudify-nodecellar-example"]
...
{{< /gsHighlight >}}

### inputs

#### Usage 
`cfy blueprints inputs [OPTIONS] BLUEPRINT_ID`

Retrieve inputs for a specific blueprint

`BLUEPRINT_ID` -        The path of the blueprint for which to retrieve inputs.

#### Optional flags

*  `-t --tenant-name TEXT`     The name of the tenant from which to retrieve the blueprints. If
                          not specified, the current tenant is used. 

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints inputs cloudify-hello-world-example
...

Retrieving inputs for blueprint cloudify-hello-world-example...

Inputs:
+------------------------+------+-------------+-------------+
|          name          | type |   default   | description |
+------------------------+------+-------------+-------------+
|     webserver_port     |  -   |     8080    |      -      |
|       agent_user       |  -   |    centos   |      -      |
|       server_ip        |  -   | 172.16.0.49 |      -      |
| agent_private_key_path |  -   |   /key.pem  |      -      |
+------------------------+------+-------------+-------------+

...
{{< /gsHighlight >}}

### set-visibility

#### Usage
`cfy blueprints set-visibility [OPTIONS] BLUEPRINT_ID`

Set the blueprint's visibility

`BLUEPRINT_ID` - The id of the blueprint to update.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global']  [required].

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy blueprints set-visibility cloudify-nodecellar-example -l global
...

Blueprint `cloudify-nodecellar-example` was set to global

...
{{< /gsHighlight >}}
