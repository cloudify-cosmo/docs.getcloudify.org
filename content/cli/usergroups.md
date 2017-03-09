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

## Commands

### create

Usage: `cfy user-groups create [_group-name_]`

Add a user group.

### delete

Usage: `cfy user groups delete [_group-name_]`

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.

### list

Usage: `cfy user-groups list`

List all users assigned to this users' group.

### get

Usage: `cfy user-groups get [_user-name_]`

Get details for a specific user.