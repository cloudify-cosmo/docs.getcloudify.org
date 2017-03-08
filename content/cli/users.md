---
layout: bt_wiki
title: users
category: Docs
draft: false
weight: 110
---

The `cfy users` command is used to manage users and passwords on Cloudify Manager.

To use the command you must have Cloudify `admin` credentials.

## Commands

### create

Usage: `cfy users create`

Add a user.

### set-password

Usage: `cfy users -u [_user-name_] set-password [_password_]`

Set the password for a specific user. Use this command in a non-LDAP/AD setup.

### set-role

Usage: `cfy users -u [_user-name_] set-role [_role_]`<br>
Options: `user` (default), `admin`, `suspended`

Set a role for a specific user. <br>
Users are created with the default `user` role. This command enables you to specify the user as a Cloudify Manager administrator.  An `administrator` user can perform all commands on all tenants in the Cloudify Manager. Someone with a `user` role has access to all public resources in the tenant(s) to which they are assigned, and to private resources of which they are the owner. A suspended user cannot access a tenant.

### delete

Usage: `cfy users -u [_user-name_] delete`

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.

### list

Usage: `cfy users list`

List all users defined in this Cloudify Manager.

### get

Usage: `cfy users -u [_user-name_] get`

Get details for a specific user.