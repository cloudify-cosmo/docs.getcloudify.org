---
layout: bt_wiki
title: users
category: Docs
draft: false
weight: 110
---

The `cfy users` command is used to manage users and passwords on Cloudify Manager.<br>
If you choose not to integrate Cloudify Manager with LDAP/AD, you must add each user individually and set a password for them. You can also create groups and add users to them. The users and user groups can be assigned to one or more tenants.

To use the command you must have Cloudify `admin` credentials.

## Commands
Each of the commands for creating a user are detailed below. Generally, you will use all arguments in a single command, as follows:<br>
`cfy users create [_user-name_] -p [_password_] -r [_role_]`

### create

Usage: `cfy users create [_user-name_]`

Add a user.

### set-password

Usage: `cfy users set-password [_user-name_] -p [_password_]`

Set the password for a specific user. Use this command in a non-LDAP/AD setup.

### set-role

Usage: `cfy users set-role [_user-name_] -r [_role_]`<br>
Options: `user` (default), `admin`, `suspended`

Set a role for a specific user. <br>
Users are created with the default `user` role. This command enables you to specify a user as a Cloudify Manager administrator.  

* An `admin` user can perform all commands on all tenants in the Cloudify Manager instance. 
* Someone with a `user` role has access to all public resources in the tenant(s) to which they are assigned, and to private resources of which they are the owner. 
* A `suspended` user cannot access a tenant.

### delete

Usage: `cfy users delete [_user-name_] `

Delete a user from Cloudify Manager, including from any groups to which they have been assigned.

### list

Usage: `cfy users list`

List all users defined in this Cloudify Manager.

### get

Usage: `cfy users -u [_user-name_] get`

Get details for a specific user.