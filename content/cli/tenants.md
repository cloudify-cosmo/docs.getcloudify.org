---
layout: bt_wiki
title: tenants
category: Docs
draft: false
weight: 110
---

The `cfy tenants` command is used to create and manage tenants on Cloudify Manager.<br>
You can run commands on a tenant other than the one that you are logged into by specifying the name of the tenant to which the command applies. For example, `cfy tenants add-user USERNAME -t TENANTNAME` can be used to add a user on a different tenant.

#### Requirements

* To use the command you must have Cloudify `admin` credentials.<br>
* Tenant names must conform to the following requirements:  

  * Minimum number of characters - 5
  * Maximum number of characters - 255
  * Valid characters are alphanumeric, or `-`, `_`, or `.`.
  * Value must begin with a letter
  * Cannot be empty

## Commands
Each of the commands for creating a user are detailed below.

### create

Usage: `cfy tenants create TENANTNAME`

Add a tenant.<br>
The tenant name must be unique in Cloudify Manager.

### add-user

Usage: `cfy tenants add-user USERNAME`

Add an individual user to a tenant. <br>
If your system is integrated with LDAP/AD, ensure that the username matches that specified in LDAP.<br>

### add-user-group

Usage: `cfy tenants add-user-group GROUPNAME`

Add a user group to a tenant. <br>
If your system is integrated with LDAP/AD, ensure that the group name matches that specified in LDAP.<br>

### get

Usage: `cfy tenants get`<br>

View information about the tenant, including its users. <br>

### list

Usage: `cfy tenants list`<br>

Provides a list of all tenants in this instance of Cloudify Manager. <br>
By default, when you generate the list of tenants, only the number of linked resources is displayed. You can retrieve full details with the use of a `--get-data` flag.

### remove-user

Usage: `cfy tenants remove-user USERNAME`<br>

Remove an individual user from a tenant.<br>
Note that if the user is part of one or more user groups that are assigned to the tenant, you need to remove the user from each group, in order for them to be prevented from accessing the tenant.<br>

### remove-user-group

Usage: `cfy tenants remove-user-group GROUPNAME`<br>

Remove a user group from a tenant.<br>

### delete

Usage: `cfy tenants delete TENANTNAME`

Delete a tenant from Cloudify Manager

