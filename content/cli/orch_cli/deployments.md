---
title: deployments
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/deployments/
---

The `cfy deployments` command is used to manage running deployments on a {{< param cfy_manager_name >}}.

You can use the command to create, delete, update and list deployments and to show the outputs for a specific deployment.

{{% note title="Note" %}}
Use of spaces is not supported in file names.
{{% /note %}}


For more information, see [deployment update process]({{< relref "working_with/manager/update-deployment.md" >}}).

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands

### create

#### Usage
`cfy deployments create [OPTIONS] [DEPLOYMENT_ID]`

Create a deployment on the Manager

`DEPLOYMENT_ID` -       The ID of the deployment to be created.


#### Mandatory flags

*  `-b, --blueprint-id TEXT` -   
                        The unique identifier for the blueprint
                        [required]


#### Optional flags

*  `-d, --deployment-id=DEPLOYMENT_ID` -
                        A unique ID for the deployment
* `-s, --site-name TEXT`    -   Deployment's site name
*  `-i, --inputs=INPUTS` - Inputs for the deployment (Can be provided as wildcard-based paths (`.yaml`, etc..) to YAML files, a JSON          string or as `'key1=value1;key2=value2'`). This argument can be used multiple times.
* `--skip-plugins-validation` - A boolean flag that specifies whether to validate if the required deployment plugins exist on the Manager. [Default: `false`]
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].
* `--runtime-only-evaluation` - If set, all intrinsic functions will only be evaluated at runtime, and no intrinsic functions will be evaluated at parse time (such as get_input, get_property).
* `--labels` - A labels list of the form `<key>:<value>,<key>:<value>`. 
               Any comma and colon in `<value>` must be escaped with `\`.
               The labels' keys are saved in lowercase.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments create -b simple-python-webserver-blueprint
...

Creating new deployment from blueprint simple-python-webserver-blueprint...
Deployment created. The deployment's id is simple-python-webserver-blueprint

...
{{< /highlight >}}

### update

#### Usage
`cfy deployments update [OPTIONS] DEPLOYMENT_ID`

Update a specified deployment according to the specified blueprint.

`DEPLOYMENT_ID` -       is the deployment's ID to update.


#### Mandatory flags

*  `-b, --blueprint-id TEXT` - The unique identifier of the blueprint to use for deployment update.

#### Optional flags

 *  `-i, --inputs TEXT` -
                        Inputs for the deployment (Can be provided as
                        wildcard-based paths (`*.yaml`, `/my_inputs/`,
                        etc.) to YAML files, a JSON string or as
                        `'key1=value1;key2=value2'`). This argument can
                        be used multiple times.
*  `--skip-install` -   Skip install lifecycle operations.
*  `--skip-uninstall` - Skip uninstall lifecycle operations.
*  `--skip-reinstall` - Skip automatic reinstall of node-instances
                                 whose properties are modified in the
                                 deployment update. Node instances
                                 explicitly included in the reinstall
                                 list are not skipped.
*  `-r, --reinstall-list TEXT` - Node instances IDs to reinstall. This argument can
                        be used multiple times.
*  `--ignore-failure` - Pass ignore-failure option to uninstall workflow.
*  `--preview` - If set, does not perform the update and returns the steps this update would make.
*  `-f, --force` -      Force an update to run, in the event that a previous
                        update on this deployment did not complete successfully.
*  `--include-logs / --no-logs` - Include logs in returned events [default: `True`]
*  `--json-output` -   Output events in a consumable JSON format
*  `-t, --tenant-name TEXT` -
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.
* `--runtime-only-evaluation` - `If set, all intrinsic functions will only be evaluated at runtime, and no intrinsic functions will be evaluated at parse time (such as get_input, get_property).`
*  `--auto-correct-types`         - If set, before creating a plan for a new
                                    deployment, an attempt will be made to cast
                                    old inputs' values to the valid types declared
                                    in blueprint.
*  `--reevaluate-active-statuses` - After a failed deployment update the update metadata may get
                                    invalid. Reevaluate will correct the metadata based on the last
                                    known execution.  The statuses of previous active update
                                    operations will be reevaluated based on relevant executions'
                                    statuses. `terminated` executions will be mapped to `successful`
                                    updates, while `failed` and any `*cancel*` statuses will be
                                    mapped to `failed`.
*  `--drift-only` - Run update without changing anything. This will still check drift and run update operations as necessary.
* `--skip-drift-check` - Skip running check_drift during deployment update
* `--skip-heal` - Skip running heal and check_status before the update

For more information, see [deployment update process]({{< relref "working_with/manager/update-deployment.md" >}}).


#### Example

{{< highlight  bash  >}}
$ cfy deployments update simple-python-webserver-blueprint -p simple-python-webserver-blueprint/blueprint.yaml
...

Updating deployment cloudify-nodecellar-example using blueprint cloudify-nodecellar-example/simple-blueprint.yaml
2017-03-30 10:26:12.723  CFY <cloudify-nodecellar-example> Starting 'update' workflow execution
2017-03-30 10:26:13.201  CFY <cloudify-nodecellar-example> 'update' workflow execution succeeded
Finished executing workflow 'update' on deployment 'cloudify-nodecellar-example'
Successfully updated deployment cloudify-nodecellar-example. Deployment update id: cloudify-nodecellar-example-d53a26e8-a10a-4545-956b-8bad45b90966. Execution id: dcf2dc2f-dc4f-4036-85a6-e693196e6331

...
{{< /highlight >}}


### history

#### Usage
`cfy deployments history [OPTIONS]`

List deployment updates history.


#### Optional flags

*  `-d, --deployment-id TEXT` -
                        The ID of the deployment for which you want to show the history of deployment updates.

*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to show the history of deployment updates. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.

*  `-a, --all-tenants`        Include resources from all tenants associated with
                           the user. This option cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search deployments by ID. The returned list will include only deployments that contain the given search pattern.

*  `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource
                                         [default: 0].

*  `-s, --pagination-size INTEGER` -    The max number of results to retrieve per page [default: 1000]


### get-update

#### Usage
`cfy dep get-up [OPTIONS] DEPLOYMENT_UPDATE_ID`

List deployment update details.


#### Optional flags

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to show the history of deployment updates. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.


### delete

#### Usage
`cfy deployments delete [OPTIONS] DEPLOYMENT_ID`

Delete a deployment from {{< param cfy_manager_name >}}.

{{% note title="Note" %}}
Deleting a deployment does not delete the resources of an application. To delete the resources, run the `uninstall` workflow (unless a custom uninstall workflow is provided).
{{% /note %}}


`DEPLOYMENT_ID` -       The ID of the deployment to delete

#### Optional flags

*  `-f, --force` -      Delete the deployment even if there are existing live nodes for it, or existing installations which depend on it
* `-l, --with-logs` -        If set, then the deployment's management workers
                          logs are deleted as well [default: False]
*  `-t, --tenant-name TEXT` -
                        The name of the tenant of the deployment. If unspecified, the current tenant is
                                 used.
&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments delete simple-python-webserver-blueprint
...

Deleting deployment simple-python-webserver-blueprint...
Deployment deleted

...
{{< /highlight >}}

### list

#### Usage
`cfy deployments list [OPTIONS]`

List deployments.

If `--blueprint-id` is provided, list deployments for that blueprint.
  Otherwise, list deployments for all blueprints.

#### Optional flags

*  `-b, --blueprint-id TEXT` -
                        The ID of the blueprint for which you want to list deployments.
   
* `--filter-id TEXT`    Filter results according to the specified
                        filter (based on the filter ID)
  
* `-lr, --labels-rule TEXT`    A deployment labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null, 
                               <key> is not null`. `<value>` can be a single string, or a
                               list of strings of the form `[<value1>,<value2>,...]`. 
                               Any comma and colon in <value> must be escaped with `\`. 
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A deployment attributes' filter rule. Attributes' filter rules 
                               must be one of:  `<key>=<value>, <key>!=<value>, 
                               <key> contains <value>, <key> does-not-contain <value>, 
                               <key> starts-with <value>, <key> ends-with <value>, 
                               <key> is not empty`. `<value>` can be a single string, or a 
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed 
                               attributes to filter by are: `[blueprint_id, created_by, site_name, schedules]`. 
                               This argument can be used multiple times


*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list deployments. If
                           unspecified, the current tenant is used.
                           This argument cannot be used simultaneously with the `all-tenants` argument.

*  `-a, --all-tenants`        Include resources from all tenants associated with
                           the user. This option cannot be used simultaneously with the `tenant-name` argument.

*  `--search TEXT`     Search deployments by id. The returned list will include only deployments that contain the given search pattern.

* `--search-name TEXT`            Search deployments by their display name. The returned list will include only
                                  deployments that contain the given search pattern.

* `--dependencies-of TEXT`        List only deployments on which the given deployment ID depends.

*  `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource
                                         [default: 0].

*  `-s, --pagination-size INTEGER` -    The max number of results to retrieve per page [default: 1000]

* `-g, --group-id TEXT` - Show deployments belonging to this group


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments list
...

Listing all deployments...

Deployments:
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+
|              id             |         blueprint_id        |        created_at        |        updated_at        | visibility |  tenant_name   | created_by |
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+
| cloudify-nodecellar-example | cloudify-nodecellar-example | 2017-03-30 10:14:40.556  | 2017-03-30 10:14:40.556  |   tenant   | default_tenant |   admin    |
+-----------------------------+-----------------------------+--------------------------+--------------------------+------------+----------------+------------+

...
{{< /highlight >}}
### status-list

#### Usage
`cfy deployments status-list [OPTIONS]`

Show deployment statuses

Show a grid of various deployment statuses, allowing an at-a-glance insight
of the state of the system.

This command allows the same filtering that `cfy deployments list` does.

### Options

* `-s, --pagination-size INTEGER` - The max number of results to retrieve per
                                    page [default: 1000]
* `-o, --pagination-offset INTEGER` - The number of resources to skip;
                                      --pagination-offset=1 skips the first
                                  resource [default: 0]
* `--dependencies-of TEXT` - List only deployments on which the given
                             deployment ID depends.
* `--search-name TEXT` - Search deployments by their display name.
                         The returned list will include only
                         deployments that contain the given search pattern
* `--search TEXT` - Search resources by id. The returned list
                    will include only resources that contain the
                    given search pattern
* `-a, --all-tenants` - Include resources from all tenants
                        associated with the user. You cannot use
                        this argument with arguments: [tenant_name].
* `-t, --tenant-name TEXT` - The name of the tenant to list deployments
                             from. If not specified, the current tenant
                             will be used. You cannot use this argument
                             with arguments: [all_tenants]
* `--descending` - Sort list in descending order [default: False]
* `--sort-by TEXT` - Key for sorting the list
* `-lr, --labels-rule TEXT` - A labels' filter rule. Labels' filter rules
                              must be one of: <key>=<value>,
                              <key>!=<value>, <key> is-not <value>, <key>
                              is null, <key> is not null. <value> can be a
                              single string or a list of strings of the
                              form [<value1>,<value2>,...]. Any comma and
                              colon in <value> must be escaped with `\`.
                              The labels' keys specified in the filter
                              rules will be saved in lower case.
* `-ar, --attrs-rule TEXT` - An attributes' filter rule. Attributes'
                             filter rules must be one of: <key>=<value>,
                             <key>!=<value>, <key> contains <value>,
                             <key> does-not-contain <value>, <key>
                             starts-with <value>, <key> ends-with
                             <value>, <key> is not empty. <value> can be
                             a single string or a list of strings of the
                             form [<value1>,<value2>,...]. Allowed
                             attributes to filter by are: [blueprint_id,
                             created_by, site_name, schedules]. This
                             argument can be used multiple times
* `--filter-id TEXT` - Filter results according to the specified filter
* `-g, --group-id TEXT` - Show deployments belonging to this group
* `-b, --blueprint-id TEXT` - Show deployments created from this blueprint

#### Example

{{< highlight  bash  >}}
$ cfy dep status-list
Listing all deployments...

Deployments:
+---------------------------------------+---------------------------------------+-------------------+---------------------+-----------------------+-------------------+
|                   id                  |              display_name             | deployment_status | installation_status | unavailable_instances | drifted_instances |
+---------------------------------------+---------------------------------------+-------------------+---------------------+-----------------------+-------------------+
| d973d4e3e-702b-45d4-a0a2-2f3917b338b8 | d973d4e3e-702b-45d4-a0a2-2f3917b338b8 |    in_progress    |       inactive      |           2           |         0         |
+---------------------------------------+---------------------------------------+-------------------+---------------------+-----------------------+-------------------+

Showing 1 of 1 deployments
{{< /highlight >}}

### summary

#### Usage
`cfy deployments summary <field> [optional sub-field] [OPTIONS]`

Summarizes deployments, giving a count of elements with each distinct value for the selected field.
If a sub-field is selected then a count will be given for each distinct field and sub-field combination, as well as totals for each field.

For valid field/sub-field names, invoke `cfy deployments summary`

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments summary blueprint_id
Retrieving summary of deployments on field blueprint_id

Deployment summary by blueprint_id
+--------------+-------------+
| blueprint_id | deployments |
+--------------+-------------+
|     sga      |      3      |
|      s       |      5      |
|      sg      |      1      |
+--------------+-------------+

...

$ cfy deployments summary --all-tenants tenant_name blueprint_id
Retrieving summary of deployments on field tenant_name

Deployment summary by tenant_name
+----------------+--------------+-------------+
|  tenant_name   | blueprint_id | deployments |
+----------------+--------------+-------------+
|     test1      |      s       |      1      |
|     test1      |      sg      |      3      |
|     test1      |     sga      |      5      |
|     test1      |    TOTAL     |      9      |
|     test2      |     sga      |      1      |
|     test2      |      s       |      3      |
|     test2      |      sg      |      5      |
|     test2      |    TOTAL     |      9      |
| default_tenant |     sga      |      3      |
| default_tenant |      s       |      5      |
| default_tenant |      sg      |      1      |
| default_tenant |    TOTAL     |      9      |
+----------------+--------------+-------------+

...

{{< /highlight >}}

### inputs

#### Usage
` cfy deployments inputs [OPTIONS] DEPLOYMENT_ID`

Retrieve inputs for a specific deployment

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list inputs.

#### Optional flags

*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list inputs. If
                           unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments inputs cloudify-nodecellar-example
...

Retrieving inputs for deployment cloudify-nodecellar-example...
 - "agent_private_key_path":
     Value: /key.pem
 - "agent_user":
     Value: centos
 - "host_ip":
     Value: 172.16.0.7

...
{{< /highlight >}}

### outputs

#### Usage
`cfy deployments outputs [OPTIONS] DEPLOYMENT_ID`

Lists all outputs for a deployment. Note that not every deployment has outputs and it depends on whether or not outputs were defined in the blueprint from which the deployment was created

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list outputs.


#### Optional flags


*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list outputs. If
                           unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments outputs cloudify-nodecellar-example
...

Retrieving outputs for deployment cloudify-nodecellar-example...
 - "endpoint":
     Description: Web application endpoint
     Value: {u'ip_address': u'172.16.0.7', u'port': 8080}

...
{{< /highlight >}}

### capabilities

#### Usage
`cfy deployments capabilities [OPTIONS] DEPLOYMENT_ID`

Lists all capabilities for a deployment. Note that not every deployment has capabilities and it depends on whether or not capabilities were defined in the blueprint from which the deployment was created

`DEPLOYMENT_ID` -       The ID of the deployment for which you want to list capabilities.


#### Optional flags


*  `-t, --tenant-name TEXT` -   The name of the tenant for which you want to list capabilities. If
                           unspecified, the current tenant is used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments capabilities cloudify-nodecellar-example
...

Retrieving capabilities for deployment cloudify-nodecellar-example...
 - "endpoint":
     Description: Web application endpoint
     Value: {u'ip_address': u'172.16.0.7', u'port': 8080}

...
{{< /highlight >}}

### set-visibility

#### Usage
`cfy deployments set-visibility [OPTIONS] DEPLOYMENT_ID`

Set the deployment's visibility to tenant

`DEPLOYMENT_ID` - The id of the deployment to update.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global'] [required].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments set-visibility cloudify-nodecellar-example -l tenant
...

Deployment `cloudify-nodecellar-example` was set to tenant

...
{{< /highlight >}}


### set-site

#### Usage

`cfy deployments set-site [OPTIONS] DEPLOYMENT_ID`

  Set the deployment's site

  `DEPLOYMENT_ID` is the id of the deployment to update


#### Optional flags

*  `-s, --site-name TEXT` -  Deployment's site name
*  `-d, --detach-site`  -    If set, detach the current site, making the
                         deployment siteless [default: False]. You cannot use
                         this argument with arguments: [site_name]


### set-owner

#### Usage
`cfy deployments set-owner [OPTIONS] DEPLOYMENT_ID`

Change ownership of a deployment.

`DEPLOYMENT_ID` - The id of the deployment to update.

#### Optional flags

* `-s, --username USERNAME` - The name of the user who will be the new owner of the
                              resource.  [required]
* `-t, --tenant-name TEXT`  - The name of the tenant of the secret. If not specified, the current
                              tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy deployments set-owner cloudify-nodecellar-example -s admin
...

Deployment `cloudify-nodecellar-example` is now owned by user `admin`.

...
{{< /highlight >}}


### labels

A deployment label is a key-value pair that can be assigned with a deployment. 
There can be multiple labels assigned with each deployment, and one can assign more than one label 
with the same key (yet different value) to the same deployment.

#### labels list

##### Usage

`cfy deployments labels list [OPTIONS] DEPLOYMENT_ID` 

List the deployment's labels.

`DEPLOYMENT_ID` is the id of the deployment to list the labels for


#### labels add

##### Usage

`cfy deployments labels add [OPTIONS] LABELS_LIST DEPLOYMENT_ID` 

Add labels to a specific deployment.

`DEPLOYMENT_ID` is the id of the deployment to update  
`LABELS_LIST`: `<key>:<value>,<key>:<value>`. Any comma and colon in `<value>`
               must be escaped with `\`


#### labels delete

##### Usage

`cfy deployments labels delete [OPTIONS] LABEL DEPLOYMENT_ID` 

Delete labels from a specific deployment.

`DEPLOYMENT_ID` is the id of the deployment to update  
`LABEL`: A mixed list of labels and keys, i.e. `<key>:<value>,<key>,<key>:<value>`. 
If `<key>` is provided, all labels associated with this key will be deleted from the deployment. Any comma
and colon in `<value>` must be escaped with `\`


### schedule

A deployment schedule, a.k.a. execution schedule, allows the user to set a 
scheduling rule for the execution of a particular workflow, such as install 
or uninstall, on a deployment. This allows both single-use, i.e. postponed 
executions, and recurrent executions (e.g. running each Sunday at 19:30).


#### schedule list

##### Usage

`cfy deployments schedule list [OPTIONS] [DEPLOYMENT_ID]` 

List all deployment schedules on the manager. If `DEPLOYMENT_ID` is provided, list only schedules of this deployment.

##### Optional flags

Regular optional flags for `list` commands:
*  `--sort-by TEXT`         -  Key for sorting the list
*  `--descending`           -  Sort list in descending order [default: False]
*  `-t --tenant-name TEXT`  -  The name of the tenant for which to list the deployment schedules. If
                               not specified, the current tenant is used. This
                               argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a --all-tenants`       -  Include resources from all tenants associated with
                               the user. This option cannot be used simultaneously with the `tenant-name` argument.
*  `--search TEXT`          -  Search schedules by id. The returned list will include only schedules that contain the given search pattern.
*  `-o, --pagination-offset INTEGER`  -  The number of resources to skip;
                                         --pagination-offset=1 skips the first resource [default: 0]
*  `-s, --pagination-size INTEGER`    -  The max number of results to retrieve per page [default: 1000]

Additionally:
*  `-s, --since TEXT`   -  List only schedules which have occurrences after this time. Supported formats: 
                           `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
*  `-u, --until TEXT`   -  List only schedules which have occurrences before this time. Supported formats: 
                           `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
*  `--tz TEXT`          -  The timezone to be used for scheduling, e.g. `EST` or `Asia/Jerusalem`. By default, the local timezone will be used. 
                           Supports any timezone in the [tz database](en.wikipedia.org/wiki/List_of_tz_database_time_zones)

Valid relative time expressions are of the form `+<integer> minutes|hours|days|weeks|months|years` or a concatenation of several such, e.g. `+1 year +3 months`. 
These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`. 


#### schedule get

##### Usage

`cfy deployments schedule get [OPTIONS] DEPLOYMENT_ID SCHEDULE_ID`

Retrieve information for a specific deployment schedule.

`DEPLOYMENT_ID` is the ID of the deployment to which the schedule belongs.
`SCHEDULE_ID` is the ID of the deployment schedule for which to retrieve information.

##### Optional flags

*  `--preview INTEGER`       -  Preview the N next dates for the workflow execution to run.
*  `-t, --tenant-name TEXT`  -  The name of the tenant of the deployment schedule.
                                If not specified, the current tenant will be used

#### schedule create

##### Usage

`cfy deployments schedule create [OPTIONS] DEPLOYMENT_ID WORKFLOW_ID`

Schedule the execution of a workflow on a given deployment.

`DEPLOYMENT_ID` is the ID of the deployment for which to create the schedule. 
`WORKFLOW_ID` is the ID of the workflow the schedule will run.

##### Mandatory flags

*  `-s, --since TEXT`           -  The earliest possible time to run. Supported formats:
                                   `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.

##### Optional flags

*  `-n, --schedule-name TEXT`   -  A name for the schedule. If not provided, defaults to `{deployment-id}_{workflow-id}`.
*  `-p, --parameters TEXT`      -  Parameters for the workflow 
                                   (Can be provided as wildcard based paths (*.yaml, /my_inputs/ etc.) to YAML files, a JSON string or as `'key1=value1;key2=value2'`). This argument can be used multiple times.
*  `--allow-custom-parameters`  -  Allow passing custom parameters (which were not defined in the workflow's schema in the blueprint) to the execution.
*  `-f, --force`                -  Execute the workflow even if there is an ongoing execution for the given deployment.
*  `--dry-run`                  -  If set, no actual operations will be performed. This only prints the executed tasks, without side effects.
*  `--wait-after-fail INTEGER`  -  When a task fails, wait this many seconds for already-running tasks to return [default: 600].
*  `-u, --until TEXT`           -  The latest possible time to run. Supported formats: 
                                   `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
*  `--tz TEXT`                  -  The timezone to be used for scheduling, e.g. `EST` or `Asia/Jerusalem`. By default, the local timezone will be used. 
                                   Supports any timezone in the [tz database](en.wikipedia.org/wiki/List_of_tz_database_time_zones)
*  `-r, --recurrence TEXT`      -  Recurrence on the scheduled execution. e.g. `2 weeks`, `30 min` or `1d`. You cannot use this argument with arguments: [rrule]
*  `-c, --count INTEGER`        -  Maximum number of times to run the execution. If left empty, there's no limit on repetition. You cannot use this argument with arguments: [rrule]
*  `--weekdays TEXT`            -  Weekdays on which to run the execution, e.g. `su,mo,tu`. If left empty, runs on any weekday. You cannot use this argument with arguments: [rrule]
*  `--rrule TEXT`               -  A scheduling rule in the iCalendar format, e.g. `RRULE:FREQ=DAILY;INTERVAL=3`, which means run every 3 days. You cannot use this argument with arguments: [count, recurrence, weekdays]
*  `--slip INTEGER`             -  Maximum time window after the target time has passed, in which the scheduled execution can run [in minutes, default=0]
*  `--stop-on-fail`             -  Whether to stop scheduling the execution in case it failed.
*  `-t, --tenant-name TEXT`     -  The name of the tenant of the deployment schedule.
                                   If not specified, the current tenant will be used

Valid **relative time** expressions are of the form `+<integer> minutes|hours|days|weeks|months|years` or a concatenation of several such, e.g. `+1 year +3 months`. 
These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`. 

Valid **recurrence** expressions are of the form `<integer> minutes|hours|days|weeks|months|years`. These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`. 

Valid **weekdays** expressions are any of `su|mo|tu|we|th|fr|sa`, or a comma-separated list of them. 
These may be optionally prefixed by `1` to `4` or `l-` (for "last") signifying a "complex weekday", e.g. `2mo` for "the 2nd Monday of a month" or `l-fr` for "the last Friday of a month". Complex weekdays can only be used in tandem with a `months` or `years` recurrence. 


#### schedule update

##### Usage

`cfy deployments schedule update [OPTIONS] DEPLOYMENT_ID SCHEDULE_ID`

Update an existing schedule for a workflow execution.

`DEPLOYMENT_ID` is the ID of the deployment to which the schedule belongs.
`SCHEDULE_ID` is the ID of the deployment schedule to update.

##### Optional flags

*  `-s, --since TEXT`           -  The earliest possible time to run. Supported formats:
                                   `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
*  `-u, --until TEXT`           -  The latest possible time to run. Supported formats: 
                                   `YYYY-MM-DD HH:MM`, `HH:MM`, or a relative time expression such as `+2 weeks` or `+1day+10min`.
*  `--tz TEXT`                  -  The timezone to be used for scheduling, e.g. `EST` or `Asia/Jerusalem`. By default, the local timezone will be used. 
                                   Supports any timezone in the [tz database](en.wikipedia.org/wiki/List_of_tz_database_time_zones)
*  `-r, --recurrence TEXT`      -  Recurrence on the scheduled execution. e.g. `2 weeks`, `30 min` or `1d`. You cannot use this argument with arguments: [rrule]
*  `-c, --count INTEGER`        -  Maximum number of times to run the execution. If left empty, there's no limit on repetition. You cannot use this argument with arguments: [rrule]
*  `--weekdays TEXT`            -  Weekdays on which to run the execution, e.g. `su,mo,tu`. You cannot use this argument with arguments: [rrule]
*  `--rrule TEXT`               -  A scheduling rule in the iCalendar format, e.g. `RRULE:FREQ=DAILY;INTERVAL=3`, which means run every 3 days. You cannot use this argument with arguments: [count, recurrence, weekdays]
*  `--slip INTEGER`             -  Maximum time window after the target time has passed, in which the scheduled execution can run [in minutes, default=0]
*  `--stop-on-fail`             -  Whether to stop scheduling the execution in case it failed.
*  `-t, --tenant-name TEXT`     -  The name of the tenant of the deployment schedule.
                                   If not specified, the current tenant will be used

Valid **relative time** expressions are of the form `+<integer> minutes|hours|days|weeks|months|years` or a concatenation of several such, e.g. `+1 year +3 months`. 
These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`. 

Valid **recurrence** expressions are of the form `<integer> minutes|hours|days|weeks|months|years`. These can be also written without a space after the number, without the final `s`, or using the short forms `min|h|d|w|mo|y`. 

Valid **weekdays** expressions are any of `su|mo|tu|we|th|fr|sa`, or a comma-separated list of them.
These may be optionally prefixed by `1` to `4` or `l-` (for "last") signifying a "complex weekday", e.g. `2mo` for "the 2nd Monday of a month" or `l-fr` for "the last Friday of a month". Complex weekdays can only be used in tandem with a `months` or `years` recurrence.


#### schedule delete

##### Usage

`cfy deployments schedule delete [OPTIONS] NAME`

Delete a schedule for a workflow execution.

`DEPLOYMENT_ID` is the ID of the deployment to which the schedule belongs.
`SCHEDULE_ID` is the ID of the deployment schedule to delete.

##### Optional flags

*  `-t, --tenant-name TEXT`  -  The name of the tenant of the deployment schedule.
                                If not specified, the current tenant will be used

#### schedule enable

##### Usage

`cfy deployments schedule enable [OPTIONS] DEPLOYMENT_ID SCHEDULE_ID`

Enable a previously-disabled schedule for a workflow execution.

`DEPLOYMENT_ID` is the ID of the deployment to which the schedule belongs.
`SCHEDULE_ID` is the ID of the deployment schedule to enable.

##### Optional flags

*  `-t, --tenant-name TEXT`  -  The name of the tenant of the deployment schedule.
                                If not specified, the current tenant will be used


#### schedule disable

##### Usage

`cfy deployments schedule disable [OPTIONS] DEPLOYMENT_ID SCHEDULE_ID`

Disable a schedule for a workflow execution.

`DEPLOYMENT_ID` is the ID of the deployment to which the schedule belongs.
`SCHEDULE_ID` is the ID of the deployment schedule to disable.

##### Optional flags

*  `-t, --tenant-name TEXT`  -  The name of the tenant of the deployment schedule.
                                If not specified, the current tenant will be used


#### schedule summary

##### Usage

`cfy deployments schedule summary [OPTIONS] [deployment_id|workflow_id|tenant_name|visibility]`

Retrieve summary of deployment schedules, e.g. a count of schedules with the same deployment ID.

`TARGET_FIELD` is the field to summarise deployment schedules on.

##### Optional flags

*  `-t, --tenant-name TEXT`  -  The name of the tenant of the deployment schedule.
                                If not specified, the current tenant will be used

##### Example

{{< highlight  bash  >}}
$ cfy deployments schedule summary deployment_id
Retrieving summary of deployment schedules on field deployment_id

Deployment schedules summary by deployment_id
+---------------+------------+---------------------+
| deployment_id | recurrence | execution_schedules |
+---------------+------------+---------------------+
|       a       | recurring  |          3          |
|       a       |   single   |          1          |
|       a       |   TOTAL    |          4          |
+---------------+------------+---------------------+

{{< /highlight >}}


### modifications

A modification is a specification of changes that are scheduled for a deployment.  It is a result of
running [a scaling workflow]({{< relref "/working_with/workflows/built-in-workflows#the-scale-workflow" >}})
on a deployment.

#### modifications list

##### Usage

`cfy deployments modifications list [OPTIONS] DEPLOYMENT_ID`

List the deployment's modifications.

`DEPLOYMENT_ID` is the id of the deployment to list the modifications for

##### Example

{{< highlight bash  >}}
$ cfy deployments modifications list openstack
Listing modifications of the deployment openstack...

Deployment modifications:
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+
|                  id                  | workflow_id |             execution_id             |  status  |  tenant_name   |        created_at        | visibility |
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+
| 57924e3c-f317-4604-a52b-c28abba90b64 |    scale    | f87c13d2-a6cd-4b5a-8d05-46193fe818bd | finished | default_tenant | 2021-01-22 10:18:22.101  |   tenant   |
| 05b0b0d5-9ed6-4f84-b3a9-3bd33ddc34ef |    scale    | ad9773e2-7018-49c9-8f02-93a4f8895637 | started  | default_tenant | 2021-01-22 10:25:47.087  |   tenant   |
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+

Showing 2 of 2 deployment modifications
{{< /highlight >}}


#### modifications get

##### Usage

`cfy deployments modifications get [OPTIONS] DEPLOYMENT_MODIFICATION_ID`

Show summary of the the deployment's modification.

`DEPLOYMENT_MODIFICATION_ID` is the id of the deployment modification to detrieve

##### Example

{{< highlight bash >}}
$ cfy deployments modifications get 57924e3c-f317-4604-a52b-c28abba90b64
Retrieving deployment modification 57924e3c-f317-4604-a52b-c28abba90b64...

Deployment Modification:
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+
|                  id                  | workflow_id |             execution_id             |  status  |  tenant_name   |        created_at        | visibility |
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+
| 57924e3c-f317-4604-a52b-c28abba90b64 |    scale    | f87c13d2-a6cd-4b5a-8d05-46193fe818bd | finished | default_tenant | 2021-01-22 10:18:22.101  |   tenant   |
+--------------------------------------+-------------+--------------------------------------+----------+----------------+--------------------------+------------+

Modified nodes:
        - vm1

Node instances before modifications:
        - net_5vywa3 (net)
        - subnet_331f8n (subnet)
        - sec_group_evub21 (sec_group)
        - vm1_hjh3jp (vm1)

Added node instances:
        - vm1_sp6iar (vm1)

{{< /highlight >}}


#### modifications rollback

##### Usage

`cfy deployments modifications rollback [OPTIONS] DEPLOYMENT_MODIFICATION_ID`

Rollback the broken (e.g. stalled) deployment's modification.

`DEPLOYMENT_MODIFICATION_ID` is the id of the deployment modification to be rolled back

##### Example

{{< highlight bash >}}
$ cfy deployments modifications rollback bfcfd57e-814c-4de2-acc6-373d6e1ed232
Rolling back a deployment modification bfcfd57e-814c-4de2-acc6-373d6e1ed232...

Deployment Modification:
+--------------------------------------+-------------+--------------------------------------+------------+----------------+--------------------------+------------+
|                  id                  | workflow_id |             execution_id             |   status   |  tenant_name   |        created_at        | visibility |
+--------------------------------------+-------------+--------------------------------------+------------+----------------+--------------------------+------------+
| bfcfd57e-814c-4de2-acc6-373d6e1ed232 |    scale    | 1ffef87b-f10a-493c-8087-d5f8055938d0 | rolledback | default_tenant | 2021-01-22 11:46:55.390  |   tenant   |
+--------------------------------------+-------------+--------------------------------------+------------+----------------+--------------------------+------------+

Modified nodes:
        - vm1

Node instances before modifications:
        - net_5vywa3 (net)
        - subnet_331f8n (subnet)
        - sec_group_evub21 (sec_group)

Node instances before rollback:
        - net_5vywa3 (net)
        - subnet_331f8n (subnet)
        - sec_group_evub21 (sec_group)
        - vm1_b0kgj5 (vm1)

Added node instances:
        - vm1_b0kgj5 (vm1)
{{< /highlight >}}


### Deployment filters

A filter is defined as a set of filter-rules that can be used to filter a list of deployments, based on their labels and certain attributes.
Deployments can be filtered by the following attributes: `blueprint_id`, `created_by`, `site_name`, and `schedules`.

For more information regarding the meaning of each filter rule, please refer to the [filter-rules document]{{< relref "cli/orch_cli/filter-rules.md" >}}.

#### Deployment filters create

##### Usage

`cfy deployments filters create [OPTIONS] FILTER_ID` 

Create a new deployments' filter.

`FILTER-ID` is the new filter's ID

##### Optional flags

* `-lr, --labels-rule TEXT`    A deployment labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null, 
                               <key> is not null`. `<value>` can be a single string or a
                               list of strings of the form `[<value1>,<value2>,...]`. 
                               Any comma and colon in `<value>` must be escaped with `\`. 
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A deployment attributes' filter rule. Attributes' filter rules 
                               must be one of: `<key>=<value>, <key>!=<value>, 
                               <key> contains <value>, <key> does-not-contain <value>, 
                               <key> starts-with <value>, <key> ends-with <value>, 
                               <key> is not empty`. `<value>` can be a single string or a 
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed 
                               attributes to filter by are: `[blueprint_id, created_by, site_name, schedules]`. 
                               This argument can be used multiple times
  
* `-l, --visibility TEXT`   Defines who can see the resource, can be set to one
                            of ['private', 'tenant', 'global'] [default: tenant]
  
* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used


#### Deployment filters delete

##### Usage

`cfy deployments filters delete [OPTIONS] FILTER_ID` 

Delete a deployments' filter.

`FILTER-ID` is the filter's ID


##### Optional flags

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used


#### Deployment filters get

##### Usage

`cfy deployments filters get [OPTIONS] FILTER_ID` 

Get details for a single deployments' filter.

`FILTER-ID` is the filter's ID


##### Optional flags

* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used
  
#### Example

{{< highlight bash  >}}
$ cfy deployments filters get new_filter
Getting info for deployments' filter `new_filter`...
Requested deployments' filter info:
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


#### Deployment filters list

##### Usage

`cfy deployments filters list [OPTIONS]` 

List all deployments' filters.

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


#### Deployment filters update

##### Usage

`cfy deployments filters update [OPTIONS] FILTER_ID` 

Update an existing deployments' filter's filter rules or visibility.
Any flag provided as part of the update (labels' filter-rulea / attributes' filter-rulea / visibility) overrides only the corresponding value.   
E.g. if only the flag `--labels-rule` is provided, the labels' filter-rules will be overridden, but the visibility and attributes' filter-rules of the filter 
will stay the same. 

`FILTER-ID` is the filter's ID

##### Optional flags

* `-lr, --labels-rule TEXT`    A deployment labels' filter rule. Labels' filter rules
                               must be one of: `<key>=<value>, <key>!=<value>, <key> is-not <value>, <key> is null, 
                               <key> is not null`. `<value>` can be a single string or a
                               list of strings of the form `[<value1>,<value2>,...]`. 
                               Any comma and colon in `<value>` must be escaped with `\`. 
                               The labels' keys specified in the filter rules will be saved in lower case.

* `-ar, --attrs-rule TEXT`     A deployment attributes' filter rule. Attributes' filter rules 
                               must be one of: `<key>=<value>, <key>!=<value>, 
                               <key> contains <value>, <key> does-not-contain <value>, 
                               <key> starts-with <value>, <key> ends-with <value>, 
                               <key> is not empty`. `<value>` can be a single string, or a 
                               list of strings of the form `[<value1>,<value2>,...]`. Allowed 
                               attributes to filter by are: `[blueprint_id, created_by, site_name, schedules]`. 
                               This argument can be used multiple times
  
* `-l, --visibility TEXT`   Defines who can see the resource, can be set to one
                            of ['private', 'tenant', 'global'] [default: tenant]
  
* `-t, --tenant-name TEXT`  The name of the tenant of the filter. If not
                            specified, the current tenant will be used


### Deployment groups

A deployment group allows organizing multiple deployments together, in order to run executions in batch on all of them.


#### Deployment groups list

##### Usage
`cfy deployments groups list`

List all deployment groups.

##### Example

{{< highlight  bash  >}}
$ cfy dep gro list

Deployment groups:
+----+-------------+-------------+----------------------+
| id | deployments | description | default_blueprint_id |
+----+-------------+-------------+----------------------+
| g1 |      0      |   group 1   |                      |
+----+-------------+-------------+----------------------+
{{< /highlight >}}


#### Deployment groups create

##### Usage
`cfy deployments groups create [OPTIONS] DEPLOYMENT_GROUP_NAME`

Create a deployment group.

The provided inputs will be used as default inputs for new deployments
created using `cfy deployments groups extend --count`.

##### Optional flags

* `-i, --inputs TEXT` - Inputs for the deployment
* `-b, --default-blueprint TEXT` - Default blueprint for this deployment group
* `--description TEXT` - Description of this deployment group

#### Deployment groups delete

##### Usage
`cfy deployments groups delete [OPTIONS] DEPLOYMENT_GROUP_NAME`

Delete a deployment group

This deletes a deployment group, which by default only removes the
grouping, the deployments in the group are still left intact.
To delete all deployments, pass `--delete-deployments`.

##### Optional flags

* `--delete-deployments` - Delete all deployments belonging to this group
* `-l, --with-logs` - If set, then the deployment's management workers logs
                      are deleted as well [default: False]
* `-f, --force` - Delete the deployment even if there are existing live
                  nodes for it, or existing installations which depend on it


#### Deployment groups extend

##### Usage
`cfy deployments groups extend [OPTIONS] DEPLOYMENT_GROUP_NAME`

Add deployments to an existing group

This adds deployments from a filter, or from another group, or creates new
deployments, using this group's default blueprint and inputs.

##### Optional flags
* `-d, --deployment-id TEXT` - Deployment ID to add or remove from the group
* `--count INTEGER` - Create this many deployments in the group
* `--filter-id TEXT` - Use deployments selected by this filter
* `-lr, --labels-rule TEXT` - A labels' filter rule. Labels' filter rules must
                              be one of: <key>=<value>, <key>!=<value>, <key>
                              is-not <value>, <key> is null, <key> is not null.
                              <value> can be a single string or a list of
                              strings of the form [<value1>,<value2>,...]. Any
                              comma and colon in <value> must be escaped with
                              `\`. The labels' keys specified in the filter
                              rules will be saved in lower case.
* `-ar, --attrs-rule TEXT` - An attributes' filter rule. Attributes' filter
                             rules must be one of: <key>=<value>,
                             <key>!=<value>, <key> contains <value>, <key>
                             does-not-contain <value>, <key> starts-with
                             <value>, <key> ends-with <value>, <key> is not
                             empty. <value> can be a single string or a list of
                             strings of the form [<value1>,<value2>,...].
                             Allowed attributes to filter by are:
                             [blueprint_id, created_by, site_name, schedules].
                             This argument can be used multiple times
* `--from-group TEXT` - Use deployments belonging to this group
* `--into-environments TEXT` - Add created deployments to the environments
                               already existing in this group.. You cannot use
                               this argument with arguments: [count]


#### Deployment groups shrink

##### Usage
`cfy deployments groups shrink [OPTIONS] DEPLOYMENT_GROUP_NAME`

Shrink a group, removing deployments from it

##### Optional flags
* `-d, --deployment-id TEXT` - Deployment ID to add or remove from the group
* `--filter-id TEXT` - Use deployments selected by this filter
* `-lr, --labels-rule TEXT` - A labels' filter rule. Labels' filter rules must
                              be one of: <key>=<value>, <key>!=<value>, <key>
                              is-not <value>, <key> is null, <key> is not null.
                              <value> can be a single string or a list of
                              strings of the form [<value1>,<value2>,...]. Any
                              comma and colon in <value> must be escaped with
                              `\`. The labels' keys specified in the filter
                              rules will be saved in lower case.
* `-ar, --attrs-rule TEXT` - An attributes' filter rule. Attributes' filter
                             rules must be one of: <key>=<value>,
                             <key>!=<value>, <key> contains <value>, <key>
                             does-not-contain <value>, <key> starts-with
                             <value>, <key> ends-with <value>, <key> is not
                             empty. <value> can be a single string or a list of
                             strings of the form [<value1>,<value2>,...].
                             Allowed attributes to filter by are:
                             [blueprint_id, created_by, site_name, schedules].
                             This argument can be used multiple times
* `--from-group TEXT` - Use deployments belonging to this group



#### Deployment groups update

##### Usage
`cfy deployments groups update [OPTIONS] DEPLOYMENT_GROUP_NAME`

Update a deployment group

This changes the group's attributes; for updating deployments belonging
to this group, see `update-deployments`.

##### Optional flags
* `-i, --inputs TEXT` - Inputs for the deployment
* `-b, --default-blueprint TEXT` - Default blueprint for this deployment group
* `--description TEXT` - Description of this deployment group


#### Deployment groups update deployments

##### Usage
`cfy deployments groups update [OPTIONS] DEPLOYMENT_GROUP_NAME`

Update all deployments in the given group.

If updating with a new blueprint, the blueprint must already be uploaded.
Arguments have the same meaning as in single-deployment update, except that
preview is not supported. This creates an execution-group with an update
workflow for each deployment in the group.

For available options, see deployment update.


#### Deployment groups list labels

##### Usage
`cfy deployments groups labels list [OPTIONS] DEPLOYMENT_GROUP_NAME`

List labels of a group


#### Deployment groups add label

##### Usage
`cfy deployments groups labels add [OPTIONS] LABELS_LIST DEPLOYMENT_GROUP_NAME`

Add labels to the deployment group.

Dpeloyments added to this group will have the group labels added to them.
LABELS_LIST: <key>:<value>,<key>:<value>


#### Deployment groups remove label

##### Usage
`cfy deployments groups labels delete [OPTIONS] LABEL DEPLOYMENT_GROUP_NAME`

Remove a label from the deployment group.

Deployments added to this group will no longer have the label
added to them.

LABEL: Can be either <key>:<value> or <key>. If <key> is provided,
all labels associated with this key will be deleted from the group.
