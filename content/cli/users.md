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
                                  on the manager. (default: user)

&nbsp;
#### Example

```markdown
$ cfy users create assi -p test1
...

User `assi` created

...
```

### set-password

#### Usage 

`cfy users set-password [OPTIONS] USERNAME`

Set the password for a specific user. Use this command in a non-LDAP/AD setup.<br>
 `USERNAME` is the username of the user.

#### Required flags
  
* `-p, --password TEXT` - Cloudify Manager password.


&nbsp;
#### Example

```markdown
$ cfy users set-password assi -p new_pass
...

Setting new password for user assi...
New password set

...
```

### set-role

#### Usage 
`cfy users set-role [OPTIONS] USERNAME`

Set a role for a specific user. <br>

`USERNAME` is the username of the user

Users are created with the default `user` role. This command enables you to change a user's role to a Cloudify Manager administrator.  

* An `admin` user can perform all commands on all tenants in the Cloudify Manager instance. 
* Someone with a `user` role has access to all public resources in the tenant(s) to which they are assigned, and to private resources of which they are the owner. 

#### Optional flags

* `-r, --security-role [admin|user]` - A role to specifies the user's permissions
                                  on the manager. (default: user)
                                

&nbsp;
#### Example

```markdown
$ cfy users set-role assi -r admin
...

Setting new role for user assi...
New role `admin` set

...
```


### delete

#### Usage 
` cfy users delete [OPTIONS] USERNAME`

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.
`USERNAME` is the username of the user.


&nbsp;
#### Example

```markdown
$ cfy users delete assi2
...

Deleting user `assi2`...
User removed

...
```

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



&nbsp;
#### Example

```markdown
$ cfy users list
...

Listing all users...

Users:
+----------+--------+-------+---------+--------+--------------------------+
| username | groups |  role | tenants | active |      last_login_at       |
+----------+--------+-------+---------+--------+--------------------------+
|  admin   |        | admin |    1    |  True  | 2017-04-04 10:20:34.171  |
|   assi   |        | admin |    1    |  True  |                          |
|  assi2   |   1    |  user |         |  True  |                          |
+----------+--------+-------+---------+--------+--------------------------+

...
```


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

```markdown
$ cfy users get assi2
...

Getting info for user `assi2`...

Requested user info:
+----------+--------+------+---------+--------+---------------+
| username | groups | role | tenants | active | last_login_at |
+----------+--------+------+---------+--------+---------------+
|  assi2   |   1    | user |         |  True  |               |
+----------+--------+------+---------+--------+---------------+

...
```

### deactivate

#### Usage 
`cfy users deactivate [OPTIONS] USERNAME`

Deactivate a user. Suspends a user's access, without deleting their details.

`USERNAME` is the username of the user.



&nbsp;
#### Example

```markdown
$ cfy users deactivate assi2
...

Deactivating user `assi2`...
User deactivated

...
```


### activate

#### Usage 
`cfy users activate [OPTIONS] USERNAME`

Activate a user.

`USERNAME` is the username of the user.

&nbsp;
#### Example

```markdown
$ cfy users activate assi2
...

Activating user `assi2`...
User activated

...
```
