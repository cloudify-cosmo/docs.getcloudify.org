---
title: user-groups
description: The `cfy user-groups` command is used to define and manage user groups on the Cloudify Manager.
category: Docs
draft: false
aliases: /cli/user-groups/
---

The `cfy user-groups` command is used to define and manage user groups on the {{< param cfy_manager_name >}}.

To use the command you must have {{< param product_name >}} `admin` credentials.<br>
If your {{< param cfy_manager_name >}} is integrated with LDAP/AD. ensure that the group names that you define exactly match those defined in LDAP.

#### Requirements

* To use the command you must have {{< param product_name >}} `admin` credentials.<br>
* User names and passwords must conform to the following requirements:

  * Minimum number of characters - 5
  * Maximum number of characters - 255
  * Valid characters are alphanumeric, or `-`, `_`, or `.`.
  * Value must begin with a letter
  * Cannot be empty

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### create

#### Usage

`cfy user-group create [OPTIONS] USER_GROUP_NAME`

Create a new user group on the manager

`USER_GROUP_NAME` is the name of the new user group

#### Optional flags

*  `-l, --ldap-distinguished-name TEXT` -
                                  The ldap group's distinguished name. This
                                  option is required when using ldap.
                                  The format must be CN=GroupName, OU=OUName,DC=Domaincomponent, DC= DomainComponent.
                                  for example: CN=ldapwiki,OU=groups,DC=example,DC=com.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy user-groups create users
...

Group `users` created

...
{{< /highlight >}}

### add-user

#### Usage

`cfy user-groups add-user [OPTIONS] USERNAME`

Add a user group.
 `USERNAME` is the name of the user to add to the user group

#### Required flags

* `-g, --group-name TEXT` - The name of the user group.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy user-groups add-user sue -g users
...

User `sue` added successfully to user group `users`

...
{{< /highlight >}}

### delete

#### Usage
`cfy user-groups delete [OPTIONS] USER_GROUP_NAME`

Delete a user group from the {{< param product_name >}}.
 `USER_GROUP_NAME` is the name of the user group


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy user-group del users2
...

Deleting user group `users2`...
User group removed

...
{{< /highlight >}}


### list

#### Usage
` cfy user-groups list [OPTIONS]`

List all users assigned to this users' group.<br>
By default, when you generate the list of user groups, only the number of linked resources are displayed. You can retrieve full details with the use of a `--get-data` flag.

#### Optional flags

* `--sort-by TEXT` -  Key for sorting the list.
* `--descending` -  Sort list in descending order. [default: False]
* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)
*  `--search TEXT`     Search user-groups by name. The returned list will include only user-groups that contain the given search pattern.
*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]



&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy user-group list
...

Listing all user groups...

User groups:
+-------+---------+-------+
|  name | tenants | users |
+-------+---------+-------+
| users |         |   2   |
+-------+---------+-------+

...
{{< /highlight >}}

### get

#### Usage
` cfy user-groups get [OPTIONS] USER_GROUP_NAME`

Get details for a specific user group.
 `USER_GROUP_NAME` is the name of the user group.

#### Optional flags


* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy user-group get users
...

Getting info for user group `users`...

Requested user group info:
+-------+---------+-------+
|  name | tenants | users |
+-------+---------+-------+
| users |         |   2   |
+-------+---------+-------+

...
{{< /highlight >}}
