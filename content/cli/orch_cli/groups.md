---
title: groups
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/groups/
---

The `cfy groups` command is used to view information on the different groups in a deployment.

You can use the command to list all groups.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


## Commands


### list

#### Usage 
`cfy groups list [OPTIONS]`

Lists all groups for a deployment.

`DEPLOYMENT_ID` is the ID of the deployment for which to list groups.

#### Required flags

* `-d, --deployment-id TEXT` - 
						The ID of the deployment for which to list groups.
* `-t,  tenant-name TEXT`  - The name of the tenant on which the deployment is made. If unspecified, the current tenant is used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy groups list -d hello_world
...

Listing groups for deployment hello_world...
No groups defined for deployment hello_world

...
{{< /highlight >}}