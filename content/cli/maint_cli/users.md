---
title: users
description: The `cfy users` command is used to manage users and passwords on the Cloudify Manager.
category: Docs
draft: false
aliases: /cli/users/
---

The `cfy users` command is used to manage users and passwords on the {{< param cfy_manager_name >}}.<br>
If you choose not to integrate the {{< param cfy_manager_name >}} with LDAP-based user management system, you must add each user individually with a unique username and a password. You can also create user groups and add users to them. The users and user groups can be assigned to one or more tenants, with different roles in each tenant.

#### Requirements

* To use the command you must have {{< param product_name >}} `admin` credentials.<br>
* Usernames must conform to the following requirements:
  * Valid characters are alphanumeric, or `-`, `_`, or `.`.
  * Value must begin with a letter
  * Cannot be empty

* passwords must conform to the following requirements:
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
`cfy users create [OPTIONS] USERNAME`

Create a new user on the {{< param cfy_manager_name >}}.

`USERNAME` is the user name for the user.

#### Required flags

* `-p, --password TEXT` - The password for the user.

#### Optional flags

* `-r, --security-role [sys_admin|default]` - A role that defines the user as a 'sys-admin' (admin user) or 'default' (non-admin user). A 'default' user must be explicitly assigned to tenants in order to perform actions and access resources. (default: default)
* `-t, --tenant-name` - The name of the tenant to add the user to.
* `-l, --user-tenant-role` - The role of the user in the specified tenant.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users create sue -p test1
...

User `sue` created as a non-admin user in the system with password 'test1'.

...
{{< /highlight >}}

### set-password

#### Usage

`cfy users set-password [OPTIONS] USERNAME`

Set the password for a specific user. You can use this command in a non-LDAP setup to change each of the users' passwords, and in LDAP mode to change only the password of the bootstrap-admin (the user created by default upon Manager's installation) .<br>
 `USERNAME` is the username of the user.

#### Required flags

* `-p, --password TEXT` - The new password for the password.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users set-password sue -p new_pass
...

Setting new password for user sue...
New password set

...
{{< /highlight >}}

### set-role

#### Usage
`cfy users set-role [OPTIONS] USERNAME`

Set the system-wide (security) role for a specific user. <br>

`USERNAME` is the username of the user

The system-wide role defines the user as a 'sys-admin' (admin user) or 'default' (non-admin user). To give the user sys-admin permissions, set this role to 'sys_admin'. Otherwise, the user has the system-wide role 'default'. A 'default' user must be explicitly assigned to tenants in order to perform actions and access resources.<br>


#### Optional flags

* `-r, --security-role [sys_admin|default]` - A role to specifies the user's permissions
                                  on the manager. (default: default)


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users set-role sue -r sys_admin
...

Setting new role for user sue...
New role `sys_admin` set

...
{{< /highlight >}}


### delete

#### Usage
` cfy users delete [OPTIONS] USERNAME`

Delete a user from the {{< param cfy_manager_name >}}. You can delete a user only if the user is:

* Not assigned to any tenants
* Not a member of any user groups
* Not the creator of any {{< param cfy_manager_name >}} resources (Blueprint, Deployment, Plugin, Secret).

`USERNAME` is the username of the user.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users delete sue
...

Deleting user `sue`...
User removed

...
{{< /highlight >}}

### list

#### Usage
`cfy users list`

In non-LDAP mode, this command lists all of the users defined in this {{< param cfy_manager_name >}}. In LDAP mode, this command lists all of the users who logged in to {{< param product_name >}} and successfully authenticated with the LDAP system.<br>
By default, when you generate the list of users, only the number of user groups and tenants each user is associated with are displayed. You can retrieve full details with the use of a `--get-data` flag.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` - Sort list in descending order. [default: False]
* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)
*  `--search TEXT`     Search users by username. The returned list will include only users that contain the given search pattern.
*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER` The max number of results to retrieve per page [default: 1000]




&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users list
...

Listing all users...

Users:
+----------+--------+------------------+------------------------------+--------+--------------------------+---------+
| username | groups | system wide role | system wide roles via groups | active |      last_login_at       | tenants |
+----------+--------+------------------+------------------------------+--------+--------------------------+---------+
|  admin   |        |    sys_admin     |                              |  True  | 2018-03-05 16:03:56.726  |    1    |
|   sue    |        |     default      |                              |  True  |                          |         |
+----------+--------+------------------+------------------------------+--------+--------------------------+---------+

...
{{< /highlight >}}


### get

#### Usage
` cfy users get [OPTIONS] USERNAME`

Get details for a single user.

`USERNAME` is the username of the user.

#### Optional flags

* `--get-data` - When set to `True`, displays the full list of tenants and/or user groups the user is associated with.
                 When set to `False` displays only their total number. (default:False)

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users get sue2
...

Getting info for user `sue2`...

Requested user info:
+----------+--------+------------------+------------------------------+--------+---------------+---------+
| username | groups | system wide role | system wide roles via groups | active | last_login_at | tenants |
+----------+--------+------------------+------------------------------+--------+---------------+---------+
|   sue    |        |     default      |                              |  True  |               |         |
+----------+--------+------------------+------------------------------+--------+---------------+---------+

...
{{< /highlight >}}

### deactivate

#### Usage
`cfy users deactivate [OPTIONS] USERNAME`

Deactivate a user. Deactivated users cannot login to {{< param product_name >}}, but are in the list of users. To let the user login to {{< param product_name >}}, reactivate the user.<br>
`USERNAME` is the username of the user.



&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users deactivate assi2
...

Deactivating user `assi2`...
User deactivated

...
{{< /highlight >}}


### activate

#### Usage
`cfy users activate [OPTIONS] USERNAME`

Activate a user.

`USERNAME` is the username of the user.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy users activate sue2
...

Activating user `sue2`...
User activated

...
{{< /highlight >}}
