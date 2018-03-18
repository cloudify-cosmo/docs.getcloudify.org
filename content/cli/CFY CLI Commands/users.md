---
layout: bt_wiki
title: users
category: Docs
draft: false
weight: 255
---

The `cfy users` command is used to manage users and passwords on Cloudify Manager.<br>
If you choose not to integrate Cloudify Manager with LDAP/AD, you must add each user individually and set a password for them. You can also create groups and add users to them. The users and user groups can be assigned to one or more tenants.

#### Requirements

* To use the command you must have Cloudify `admin` credentials.<br>
* User names and passwords must conform to the following requirements:  

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


### create

#### Usage 
`cfy users create [OPTIONS] USERNAME`

Create a new user on Cloudify Manager.

`USERNAME` is the user name for the user.

#### Required flags
  
* `-p, --password TEXT` - Cloudify Manager password.

#### Optional flags
  
* `-r, --security-role [admin|user]` - A role to specifies the user's permissions
                                  on the manager. (default: default)

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users create sue -p test1
...

User `sue` created

...
{{< /gsHighlight >}}

### set-password

#### Usage 

`cfy users set-password [OPTIONS] USERNAME`

Set the password for a specific user. Use this command in a non-LDAP/AD setup.<br>
 `USERNAME` is the username of the user.

#### Required flags
  
* `-p, --password TEXT` - Cloudify Manager password.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users set-password sue -p new_pass
...

Setting new password for user sue...
New password set

...
{{< /gsHighlight >}}

### set-role

#### Usage 
`cfy users set-role [OPTIONS] USERNAME`

Set a role for a specific user. <br>

`USERNAME` is the username of the user

Users are created with the default system-wide `default` role. This command enables you to change a user's role to a Cloudify Manager administrator.

* An `admin` user can perform all commands on all tenants in the Cloudify Manager instance. 
* Someone with a `user` role has access to all public resources in the tenant(s) to which they are assigned, and to private resources of which they are the owner. 

#### Optional flags

* `-r, --security-role [admin|user]` - A role to specifies the user's permissions
                                  on the manager. (default: user)
                                

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users set-role sue -r admin
...

Setting new role for user sue...
New role `admin` set

...
{{< /gsHighlight >}}


### delete

#### Usage 
` cfy users delete [OPTIONS] USERNAME`

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.
`USERNAME` is the username of the user.


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users delete sue2
...

Deleting user `sue2`...
User removed

...
{{< /gsHighlight >}}

### list

#### Usage 
`cfy users list`

List all users defined in this Cloudify Manager.<br>
By default, when you generate the list of users, only the number of linked resources are displayed. You can retrieve full details with the use of a `--get-data` flag.

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

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]




&nbsp;
#### Example

{{< gsHighlight  bash  >}}
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
{{< /gsHighlight >}}


### get

#### Usage 
` cfy users get [OPTIONS] USERNAME`

Get details for a single user.

`USERNAME` is the username of the user.

#### Optional flags

* `--get-data` - When set to `True`, displays the full list of connected
                  resources (users/tenants/user-groups), for each listed
                  resource. When set to `False` displays the total number of
                  connected resources. (default:False)



&nbsp;
#### Example

{{< gsHighlight  bash  >}}
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
{{< /gsHighlight >}}

### deactivate

#### Usage 
`cfy users deactivate [OPTIONS] USERNAME`

Deactivate a user. Suspends a user's access, without deleting their details.

`USERNAME` is the username of the user.



&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users deactivate assi2
...

Deactivating user `assi2`...
User deactivated

...
{{< /gsHighlight >}}


### activate

#### Usage 
`cfy users activate [OPTIONS] USERNAME`

Activate a user.

`USERNAME` is the username of the user.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy users activate sue2
...

Activating user `sue2`...
User activated

...
{{< /gsHighlight >}}
