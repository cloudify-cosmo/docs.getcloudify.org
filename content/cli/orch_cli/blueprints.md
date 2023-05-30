---
title: blueprints
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/blueprints/
---

The `cfy blueprints` command is used to manage blueprints on a {{< param cfy_manager_name >}} instance.

You can use the command to upload, delete, download, validate and list blueprints and to retrieve information for a specific blueprint.

{{% note title="Note" %}}
Use of spaces is not supported in file names.
{{% /note %}}

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### upload

#### Usage
`cfy blueprints upload [options] BLUEPRINT_PATH`

Upload a blueprint to a {{< param cfy_manager_name >}}.

`BLUEPRINT_PATH` can be either a local blueprint yaml file or blueprint
archive; a url to a blueprint archive or an
`organization/blueprint_repo[:tag/branch]` (to be retrieved from GitHub)
Supported archive types are: zip, tar, tar.gz and tar.bz2

#### Optional flags

* `-b, --blueprint-id=BLUEPRINT_ID` -
                        The unique identifier for the blueprint

* `-i, --icon-path TEXT` -
                        The path to the blueprint's icon file (must
                        be a valid image in PNG format); the file
                        will be saved as `icon.png` in the
                        blueprint's resources and will overwrite any
                        existing file with that name

* `-n, --blueprint-filename TEXT` -
                        The name of the archive's main blueprint
                        file. Only relevant if uploading an
                        archive.

* `-a, --async-upload` -
                        Don't wait for the upload workflow to finish.
                        Upload state can be checked at any time using
                        the `cfy blueprints get` or `cfy blueprints
                        list` commands.

* `--labels` - A labels list of the form `<key>:<value>,<key>:<value>`.
               Any comma and colon in `<value>` must be escaped with `\`.
               The labels' keys are saved in lowercase.

* `--validate` -       Validate the blueprint before uploading it to the
                       manager

* `-t --tenant-name TEXT` -
                        The name of the tenant of the blueprint. If not
                        specified, the current tenant is used.

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].

{{% note title="Note" %}}
When you upload a local blueprint yaml, the CLI compresses the directory that contains the blueprint file and uploads the entire directory to the {{< param cfy_manager_name >}}.

Make sure that:

* Blueprint directory contains all resources required by the blueprint, such as scripts
* Blueprint directory does NOT contain unnecessary files
* All files in the directory are readable by others (at least permission level 404)
{{% /note %}}


&nbsp;
#### Example

{{< highlight  bash  >}}
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
{{< /highlight >}}

### delete

#### Usage
`cfy blueprints delete [OPTIONS] BLUEPRINT_ID`


Delete a blueprint. It's important to note that deleting a blueprint does not delete the deployments created from that blueprint and resources of those deployments.

#### Optional Flags

* `--tenant-name TEXT` -   The name of the tenant of the relevant
                           deployment(s). If not specified, the
                           current tenant is used
* `-f, --force` -    	   Delete the blueprint, even if there are
                           blueprints that are currently using it. [default: `True`]


&nbsp;
#### Example

{{< highlight  bash  >}}

$ cfy blueprints delete simple-python-webserver-blueprint
...

Deleting blueprint simple-python-webserver-blueprint...
Blueprint deleted

...
{{< /highlight >}}

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

{{< highlight  bash  >}}
$ cfy blueprints package simple-python-webserver-blueprint/blueprint.yaml
...

Creating blueprint archive simple-python-webserver-blueprint...
Packaging complete!

...
{{< /highlight >}}

### download

#### Usage
`cfy blueprints download [OPTIONS] BLUEPRINT_ID`

Download a blueprint from {{< param cfy_manager_name >}}.

`BLUEPRINT_ID` -        The ID of the blueprint to download.

#### Optional flags

*  `-o, --output-path TEXT` -
                        The local path to download to

* `-t --tenant-name TEXT` - The name of the tenant of the blueprint. If not
                            specified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy blueprints download simple-python-webserver-blueprint
...

Downloading blueprint simple-python-webserver-blueprint...
 simple-python-web... |################################################| 100.0%
Blueprint downloaded as simple-python-webserver-blueprint.tar.gz

...
{{< /highlight >}}

### validate

#### Usage
`cfy blueprints validate [OPTIONS] BLUEPRINT_PATH`

Validate a blueprint. Checks that the blueprint's syntax is valid and that all imports are accessible.

{{% note title="Note" %}}
Import validation is done only on the client side. That means that if, for some reason, the imports are accessible by the client but not on the manager, this validation will still pass.
{{% /note %}}

`BLUEPRINT_PATH` -      The path of the blueprint to validate.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy blueprints validate simple-python-webserver-blueprint/blueprint.yaml
...

Validating blueprint: simple-python-webserver-blueprint/blueprint.yaml
Blueprint validated successfully

...
{{< /highlight >}}

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

{{< highlight  bash  >}}
$ cfy blueprints create-requirements nodecellar-blueprint/aws-ec2-blueprint.yaml
...

https://github.com/cloudify-cosmo/cloudify-aws-plugin/archive/1.4.1.zip

...
{{< /highlight >}}

### install-plugins

#### Usage
`cfy blueprints install-plugins [OPTIONS] BLUEPRINT_PATH`

Install the necessary plugins for a specific blueprint in the local
environment.

Only supports passing the YAML of the blueprint directly.

`BLUEPRINT_PATH` -      The path to the blueprint to install plugins for.

&nbsp;
#### Example

{{< highlight  bash  >}}
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
{{< /highlight >}}

### list

#### Usage
`cfy blueprints list [OPTIONS]`

List all existing blueprints.

#### Optional flags

* `--filter-id TEXT`    Filter results according to the specified
                        filter (based on the filter ID)

* `-lr, --labels-rule TEXT`    A blueprint labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null,
                               <key> is not null`. `<value>` can be a single string, or a
                               list of strings of the form `[<value1>,<value2>,...]`.
                               Any comma and colon in `<value>` must be escaped with `\`.
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A blueprint attributes' filter rule. Attributes' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>,
                               <key> contains <value>, <key> does-not-contain <value>,
                               <key> starts-with <value>, <key> ends-with <value>,
                               <key> is not empty`. `<value>` can be a single string, or a
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed
                               attributes to filter by are: `[created_by]`.
                               This argument can be used multiple times

*  `--sort-by TEXT`     Key for sorting the list

*  `--descending`       Sort list in descending order [default: False]

*  `-t --tenant-name TEXT`     The name of the tenant for which to list the blueprints. If
                          not specified, the current tenant is used. This
                          argument cannot be used simultaneously with the `all-tenants` argument.

*  `-a --all-tenants`       Include resources from all tenants associated with
                          the user. This option cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search blueprints by id. The returned list will include only blueprints that contain the given search pattern.

*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]


&nbsp;
#### Example

{{< highlight  bash  >}}
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
{{< /highlight >}}

### summary

#### Usage
`cfy blueprints summary <field> [optional sub-field] [OPTIONS]`

Summarizes blueprints, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy blueprints summary`

&nbsp;
#### Example

{{< highlight  bash  >}}

$ cfy blueprints summary --all-tenants tenant_name
Retrieving summary of blueprints on field tenant_name

Blueprint summary by tenant_name
+----------------+------------+
|  tenant_name   | blueprints |
+----------------+------------+
|     test1      |     3      |
|     test2      |     3      |
| default_tenant |     3      |
+----------------+------------+

...

$ cfy blueprints summary --all-tenants tenant_name visibility
Retrieving summary of blueprints on field tenant_name

Blueprint summary by tenant_name
+----------------+------------+------------+
|  tenant_name   | visibility | blueprints |
+----------------+------------+------------+
|     test1      |   tenant   |     3      |
|     test1      |   TOTAL    |     3      |
|     test2      |   tenant   |     3      |
|     test2      |   TOTAL    |     3      |
| default_tenant |   tenant   |     3      |
| default_tenant |   TOTAL    |     3      |
+----------------+------------+------------+

...

{{< /highlight >}}

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

{{< highlight  bash  >}}
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
{{< /highlight >}}

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

{{< highlight  bash  >}}
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
{{< /highlight >}}

### set-visibility

#### Usage
`cfy blueprints set-visibility [OPTIONS] BLUEPRINT_ID`

Set the blueprint's visibility

`BLUEPRINT_ID` - The id of the blueprint to update.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global']  [required].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy blueprints set-visibility cloudify-nodecellar-example -l global
...

Blueprint `cloudify-nodecellar-example` was set to global

...
{{< /highlight >}}


### set-icon

#### Usage
`cfy blueprints set-icon [OPTIONS] BLUEPRINT_ID`

Set an icon which will be used to describe/identify the blueprint. In case `-i [ICON_PATH]` is
provided, the `[ICON_PATH]` should point to a valid PNG image. If this parameter is omitted, the
icon will be removed from the blueprint's resources.

`BLUEPRINT_ID` - The id of the blueprint to update.

#### Optional flags

* `-i, --icon-path TEXT` - The path to the blueprint's icon file (must be a valid image in PNG
                           format); the file will be saved as `icon.png` in the blueprint's
                           resources and will overwrite any existing file with that name.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy blueprints set-icon cloudify-nodecellar-example -i ./nodecellar.png
...

Blueprint `cloudify-nodecellar-example` has a new icon set.

...
{{< /highlight >}}

{{< highlight  bash  >}}
$ cfy blueprints set-icon cloudify-nodecellar-example
...

Blueprint `cloudify-nodecellar-example` has its icon removed.

...
{{< /highlight >}}


### set-owner

#### Usage
`cfy blueprints set-owner [OPTIONS] BLUEPRINT_ID`

Change ownership of a blueprint.

`BLUEPRINT_ID` - The id of the blueprint to update.

#### Optional flags

* `-s, --username USERNAME` - The name of the user who will be the new owner of the
                              resource.  [required]
* `-t, --tenant-name TEXT`  - The name of the tenant of the secret. If not specified, the current
                              tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy blueprints set-owner cloudify-nodecellar-example -s admin
...

Blueprint `cloudify-nodecellar-example` is now owned by user `admin`.

...
{{< /highlight >}}


### labels

A blueprint label is a key-value pair that can be assigned with a blueprint.
There can be multiple labels assigned with each blueprint, and one can assign more than one label
with the same key (yet different value) to the same blueprint.

#### labels list

##### Usage

`cfy blueprints labels list [OPTIONS] BLUEPRINT_ID`

List the blueprint's labels.

`BLUEPRINT_ID` is the id of the blueprint to list the labels for


#### labels add

##### Usage

`cfy blueprints labels add [OPTIONS] LABELS_LIST BLUEPRINT_ID`

Add labels to a specific blueprint.

`BLUEPRINT_ID` is the id of the blueprint to update
`LABELS_LIST`: `<key>:<value>,<key>:<value>`. Any comma and colon in `<value>`
               must be escaped with `\`


#### labels delete

##### Usage

`cfy blueprints labels delete [OPTIONS] LABEL BLUEPRINT_ID`

Delete labels from a specific blueprint.

`BLUEPRINT_ID` is the id of the blueprint to update
`LABEL`: A mixed list of labels and keys, i.e. `<key>:<value>,<key>,<key>:<value>`.
If `<key>` is provided, all labels associated with this key will be deleted from the deployment. Any comma
and colon in `<value>` must be escaped with `\`



### Blueprint filters

A filter is defined as a set of filter-rules that can be used to filter a list of blueprints, based on their labels and certain attributes.
At the moment, the supported blueprint attributes to filter by include only `created_by`.
For more information regarding the meaning of each filter rule, please refer to the [filter-rules document]{{< relref "cli/orch_cli/filter-rules.md" >}}.

#### Blueprint filters create

##### Usage

`cfy blueprints filters create [OPTIONS] FILTER_ID`

Create a new blueprints' filter.

`FILTER-ID` is the new filter's ID

##### Optional flags

* `-lr, --labels-rule TEXT`    A blueprint labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null,
                               <key> is not null`. `<value>` can be a single string or a
                               list of strings of the form `[<value1>,<value2>,...]`.
                               Any comma and colon in `<value>` must be escaped with `\`.
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A blueprint attributes' filter rule. Attributes' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>,
                               <key> contains <value>, <key> does-not-contain <value>,
                               <key> starts-with <value>, <key> ends-with <value>,
                               <key> is not empty`. `<value>` can be a single string, or a
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed
                               attributes to filter by are: `[created_by]`.
                               This argument can be used multiple times

* `-l, --visibility TEXT`   Defines who can see the resource, can be set to one
                            of ['private', 'tenant', 'global'] [default: tenant]

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used


#### Blueprint filters delete

##### Usage

`cfy blueprints filters delete [OPTIONS] FILTER_ID`

Delete a blueprints' filter.

`FILTER-ID` is the filter's ID


##### Optional flags

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used


#### Blueprint filters get

##### Usage

`cfy blueprints filters get [OPTIONS] FILTER_ID`

Get details for a single blueprints' filter.

`FILTER-ID` is the filter's ID


##### Optional flags

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used

#### Example

{{< highlight bash  >}}
$ cfy blueprints filters get new_filter
Getting info for blueprints' filter `new_filter`...
Requested blueprints' filter info:
	id:                        new_filter
	visibility:                tenant
	created_at:                2021-04-07 15:34:39.410
	updated_at:                2021-04-07 15:34:39.410
	is_system_filter:          False
	tenant_name:               default_tenant
	created_by:                admin
	resource_availability:     tenant
	private_resource:          False
	labels_filter_rules:       "os=windows"
	attrs_filter_rules:        "created_by starts-with bob"
{{< /highlight >}}


#### Blueprint filters list

##### Usage

`cfy blueprints filters list [OPTIONS]`

List all blueprints' filters.

##### Optional flags

* `--sort-by TEXT`  Key for sorting the list

* `--descending`    Sort list in descending order [default: False]

* `-t, --tenant-name TEXT`  The name of the tenant to list filters from.
                            If not specified, the current tenant will be
                            used. You cannot use this argument with
                            arguments: [all_tenants]

* `-a, --all-tenants`   Include resources from all tenants
                        associated with the user. You cannot use
                        this argument with arguments: [tenant_name].

* `--search TEXT`   Search resources by name/id. The returned list will include
                    only resources that contain the given search pattern

* `-o, --pagination-offset INTEGER`     The number of resources to skip;
                                        --pagination-offset=1 skips the first resource [default: 0]

* `-s, --pagination-size INTEGER`   The max number of results to retrieve per page [default: 1000]


#### Blueprint filters update

##### Usage

`cfy blueprints filters update [OPTIONS] FILTER_ID`

Update an existing blueprints' filter's filter rules or visibility.
Any flag provided as part of the update (labels' filter-rules / attrbiutes' filter-rules / visibility) overrides only the corresponding value.
E.g. if only the flag `--labels-rule` is provided, the labels' filter-rules will be overridden, but the visibility and attributes' filter-rules of the filter
will stay the same.

`FILTER-ID` is the filter's ID

##### Optional flags

* `-lr, --labels-rule TEXT`    A blueprint labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null,
                               <key> is not null`. `<value>` can be a single string or a
                               list of strings of the form `[<value1>,<value2>,...]`.
                               Any comma and colon in `<value>` must be escaped with `\`.
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A blueprint attributes' filter rule. Attributes' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>,
                               <key> contains <value>, <key> does-not-contain <value>,
                               <key> starts-with <value>, <key> ends-with <value>,
                               <key> is not empty`. `<value>` can be a single string, or a
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed
                               attributes to filter by are: `[created_by]`.
                               This argument can be used multiple times

* `-l, --visibility TEXT`   Defines who can see the resource, can be set to one
                            of ['private', 'tenant', 'global'] [default: tenant]

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used
