---
layout: bt_wiki
title: user-groups
category: Docs
draft: false
weight: 250
---

The `cfy user-groups` command is used to define and manage user groups on Cloudify Manager.

To use the command you must have Cloudify `admin` credentials.<br>
If your Cloudify Manager is integrated with LDAP/AD. ensure that the group names that you define exactly match those defined in LDAP.

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
`cfy user-groups add-user [OPTIONS] USERNAME`

Add a user group.
 `USERNAME` is the name of the user to add to the user group

#### Required flags

* `-g, --group-name TEXT` - The name of the user group.


### delete

#### Usage
`cfy user-groups delete [OPTIONS] USER_GROUP_NAME`

Delete a user group from Cloudify Manager.
 `USER_GROUP_NAME` is the name of the user group


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
