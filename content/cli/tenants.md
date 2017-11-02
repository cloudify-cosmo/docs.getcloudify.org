---
layout: bt_wiki
title: tenants
category: Docs
draft: false
weight: 225
---

The `cfy tenants` command is used to create and manage tenants on Cloudify Manager.<br>
You can run commands on a tenant other than the one that you are logged into by specifying the name of the tenant to which the command applies. For example, `cfy tenants add-user -t TENANT_NAME USERNAME` can be used to add a user to a different tenant.

#### Requirements

* To use the command you must either have Cloudify `sys_admin` credentials.<br>
* Tenant names must conform to the following requirements:  

  * Minimum number of characters - 5
  * Maximum number of characters - 255
  * Valid characters are alphanumeric, or `-`, `_`, or `.`.
  * Value must begin with a letter
  * Cannot be empty

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

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

{{< gsHighlight  bash  >}}
$ cfy tenants add-user -t test1 -r user sue
...

User `sue` added successfully to tenant `test1`

...
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy tenants add-user-group -t test1 -r user users
...

User group `users` added successfully to tenant `test1`

...
{{< /gsHighlight >}}

### create

#### Usage
`cfy tenants create [OPTIONS] TENANT_NAME`

Add a tenant to Cloudify Manager.<br>
 `TENANT_NAME` is the name of the new tenant

The tenant name must be unique in Cloudify Manager.
#### Required flag
* ` -t, --tenant-name TEXT` - The name of the tenant.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy tenants create test1
...

Tenant `test1` created

...
{{< /gsHighlight >}}

### delete

#### Usage
` cfy tenants delete [OPTIONS] TENANT_NAME`

Delete a tenant from Cloudify Manager.
 `TENANT_NAME` is the name of the tenant

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy tenants delete test2
...

Deleting tenant `test2`...
Tenant removed

...
{{< /gsHighlight >}}

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

{{< gsHighlight  bash  >}}
$ cfy tenants get test1
...

Getting info for tenant `test1`...

Requested tenant info:
+-------+--------+-------+
|  name | groups | users |
+-------+--------+-------+
| test1 |   1    |   2   |
+-------+--------+-------+

...
{{< /gsHighlight >}}

### list

#### Usage
`cfy tenants list [OPTIONS]`<br>

Provides a list of all tenants in this instance of Cloudify Manager. <br>
By default, when you generate the list of tenants, only the number of linked resources is displayed. You can retrieve full details with the use of a `--get-data` flag.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` - Sort list in descending order. [default: False]
* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy tenants list
...

Listing all tenants...

Tenants:
+----------------+--------+-------+
|      name      | groups | users |
+----------------+--------+-------+
| default_tenant |        |   1   |
|     test1      |   1    |   2   |
+----------------+--------+-------+

...
{{< /gsHighlight >}}

### remove-user

#### Usage
`cfy tenants remove-user [OPTIONS] USERNAME`<br>

Remove an individual user from a tenant.<br>
`USERNAME` is the name of the user to remove from the tenant.

{{% gsNote title="Note" %}}
if the user is part of one or more user groups that are assigned to the tenant, you need to remove the user from each group, in order for them to be prevented from accessing the tenant.
{{% /gsNote %}}

#### Required flags

*  `-t, --tenant-name TEXT` - The name of the tenant.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy tenants remove-user sue -t test1
...

User `sue` removed successfully from tenant `test1`

...
{{< /gsHighlight >}}

### remove-user-group

#### Usage
`cfy tenants remove-user-group [OPTIONS] USER_GROUP_NAME`<br>

Remove a user group from a tenant.<br>
 `USER_GROUP_NAME` is the name of the user group to remove from the tenant.

#### Required flags

*  `-t, --tenant-name TEXT` - The name of the tenant.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy ten remove-user-group users -t test1
...

User group `users` removed successfully from tenant `test1`

...
{{< /gsHighlight >}}
