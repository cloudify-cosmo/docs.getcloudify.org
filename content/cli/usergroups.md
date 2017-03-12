---
layout: bt_wiki
title: user groups
category: Docs
draft: false
weight: 110
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

## Commands

### create

Usage: `cfy user-groups create GROUPNAME`

Add a user group.

### delete

Usage: `cfy user groups delete GROUPNAME`

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.

### list

Usage: `cfy user-groups list`

List all users assigned to this users' group.<br>
By default, when you generate the list of user groups, only the number of linked resources are displayed. You can retrieve full details with the use of a `--get-data` flag.

### get

Usage: `cfy user-groups get USERNAME`

Get details for a specific user.