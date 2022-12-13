---
title: tenants
description: The `cfy tenants` command is used to create and manage tenants on the Cloudify Manager.
category: Docs
draft: false
aliases: /cli/tenants/
---

The `cfy tenants` command is used to create and manage tenants on the {{< param cfy_manager_name >}}.<br>
You can run commands on a tenant other than the one that you are logged into by specifying the name of the tenant to which the command applies. For example, `cfy tenants add-user USERNAME -t TENANT_NAME` can be used to add a user to a different tenant.

#### Requirements

* To use the command you must have `sys_admin` credentials.<br>
* Tenant names must conform to the following requirements:

  * Minimum number of characters - 5
  * Maximum number of characters - 255
  * Valid characters are alphanumeric, or `-`, `_`, or `.`.
  * Value must begin with a letter
  * Cannot be empty

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands
Each of the tenants related commands are detailed below in alphabetical order.

### add-user

#### Usage
`cfy tenants add-user [OPTIONS] USERNAME`

Add an individual user to a tenant. <br>
If your system is integrated with LDAP/AD, ensure that the username matches that specified in LDAP.<br>

`USERNAME` is the name of the user to add to the tenant.

#### Required flag
* `-t, --tenant-name TEXT` - The name of the tenant.
* `-r, --role TEXT` - The name of the role.

Valid tenant roles are:

* `manager` - User that can manage tenants
* `operations` - User that can deploy and execute workflows, but cannot manage blueprints or plugins
* `user` - Regular user, can perform actions on tenants resources
* `viewer` - User that can only view tenant resources


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants add-user my-user -t my-tenant -r user
...

User `my-user` added successfully to tenant `my-tenant`

...
{{< /highlight >}}

### add-user-group

#### Usage
`cfy tenants add-user-group [OPTIONS] USER_GROUP_NAME`

Add a user group to a tenant. <br>
`USER_GROUP_NAME` is the name of the user group to add to the tenant.

If your system is integrated with LDAP/AD, ensure that the group name matches that specified in LDAP.<br>

#### Required flags

* `-t, --tenant-name TEXT` - The name of the tenant.
* `-r, --role TEXT` - The name of the role.

Valid tenant roles are:

* `manager` - User that can manage tenants
* `operations` - User that can deploy and execute workflows, but cannot manage blueprints or plugins
* `user` - Regular user, can perform actions on tenants resources
* `viewer` - User that can only view tenant resources


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants add-user-group my-user-group -t my-tenant -r user
...

User group `my-user-group` added successfully to tenant `my-tenant`

...
{{< /highlight >}}

### create

#### Usage
`cfy tenants create [OPTIONS] TENANT_NAME`

Add a tenant to the {{< param cfy_manager_name >}}.<br>
 `TENANT_NAME` is the name of the new tenant

The tenant name must be unique.
#### Required flag
* ` -t, --tenant-name TEXT` - The name of the tenant.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants create my-tenant
...

Tenant `my-tenant` created

...
{{< /highlight >}}

### delete

#### Usage
` cfy tenants delete [OPTIONS] TENANT_NAME`

Delete a tenant from the {{< param cfy_manager_name >}}.
 `TENANT_NAME` is the name of the tenant

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants delete my-tenant
...

Deleting tenant `my-tenant`...
Tenant removed

...
{{< /highlight >}}

### get

#### Usage
` cfy tenants get [OPTIONS] TENANT_NAME`<br>

View information for a specific tenant, including its users. <br>
 `TENANT_NAME` is the name of the tenant

#### Optional flag

* `--get-data` - When set to `True`, displays the full list of connected
                 resources (users/tenants/user-groups), for each listed
                 resource. When set to `False` displays the total number of
                 connected resources. (default:False)


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants get my-tenant
...

Getting info for tenant `my-tenant`...

Requested tenant info:
+-----------+--------+-------+
|    name   | groups | users |
+-----------+--------+-------+
| my-tenant |   1    |   2   |
+-----------+--------+-------+

...
{{< /highlight >}}

### list

#### Usage
`cfy tenants list [OPTIONS]`<br>

Provides a list of all tenants in this {{< param cfy_manager_name >}} instance. <br>
By default, when you generate the list of tenants, only the number of linked resources is displayed. You can retrieve full details with the use of a `--get-data` flag.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` - Sort list in descending order. [default: False]
* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)
*  `--search TEXT`     Search tenants by name. The returned list will include only tenants that contain the given search pattern.
*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]



&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants list
...

Listing all tenants...

Tenants:
+----------------+--------+-------+
|      name      | groups | users |
+----------------+--------+-------+
| default_tenant |        |   1   |
|   my-tenant    |   1    |   2   |
+----------------+--------+-------+

...
{{< /highlight >}}

### remove-user

#### Usage
`cfy tenants remove-user [OPTIONS] USERNAME`<br>

Remove an individual user from a tenant.<br>
`USERNAME` is the name of the user to remove from the tenant.

{{% note title="Note" %}}
if the user is part of one or more user groups that are assigned to the tenant, you need to remove the user from each group, in order for them to be prevented from accessing the tenant.
{{% /note %}}

#### Required flags

*  `-t, --tenant-name TEXT` - The name of the tenant.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants remove-user my-user -t my-tenant
...

User `my-user` removed successfully from tenant `my-tenant`

...
{{< /highlight >}}

### remove-user-group

#### Usage
`cfy tenants remove-user-group [OPTIONS] USER_GROUP_NAME`<br>

Remove a user group from a tenant.<br>
 `USER_GROUP_NAME` is the name of the user group to remove from the tenant.

#### Required flags

*  `-t, --tenant-name TEXT` - The name of the tenant.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy tenants remove-user-group my-user-group -t my-tenant
...

User group `my-user-group` removed successfully from tenant `my-tenant`

...
{{< /highlight >}}

### update-user

#### Usage
`cfy tenants update-user [OPTIONS] USERNAME`

Update the user role in a tenant.

`USERNAME` is the name of the user for which the role needs to be updated.

#### Required flags

* `-t, --tenant-name TEXT` - The name of the tenant.
* `-r, --role TEXT` - The name of the role.

#### Example

{{< highlight  bash  >}}
$ cfy tenants update-user my-user -t my-tenant -r viewer
User `my-user` updated successfully in tenant `my-tenant`
{{< /highlight >}}


### update-user-group

#### Usage
`cfy tenants update-user-group [OPTIONS] USERNAME`

Update the user role in a tenant.

`USERNAME` is the name of the user for which the role needs to be updated.

#### Required flags

* `-t, --tenant-name TEXT` - The name of the tenant.
* `-r, --role TEXT` - The name of the role.

#### Example

{{< highlight  bash  >}}
$ cfy tenants update-user-group my-user-group -t my-tenant -r viewer
Group `my-user-group` updated successfully in tenant `my-tenant`
{{< /highlight >}}
