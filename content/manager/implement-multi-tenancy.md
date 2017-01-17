---
layout: bt_wiki
title: Implementing Multi-Tenancy
category: Manager Intro
draft: true
weight: 600

terminology_link: reference-terminology.html
workflows_link: workflows-built-in.html
---

Multi-tenancy is a function that enables you to create multiple independent logical groups as isolated environments, which can be managed by a single Cloudify Manager. A tenant is a logical entity that contains all its resources, for example, blueprint, deployment, workflows and so on. Using multi-tenancy is useful when you want to limit access to a specific set of data (the tenant) to a defined set of users.


Multi-tenancy is implemented when you install Cloudify Manager.

* If you are a **Community user**, a single built-in tenant is created during installation. The tenant is not visible to you and you cannot perform any actions on it such as adding a user or changing a password. There is a single user for the tenant, the `administrator`. When you log into Cloudify Manager, the built-in credentials are used.

* If you are a **Premium user**, you can create new tenants and perform a variety of actions on them, such as adding users and user groups, setting passwords, assigning roles, and more. If you integrate LDAP or your AD into Cloudify Manager, you use the users and user groups defined there for access to the manager. You must have Cloudify Manager administrator permissions to perform user-related actions.

##Multi-Tenancy for Premium Users##
There are two options for using the multi-tenancy function in Cloudify Manager, as a standalone function that is not connected to an existing user managment system (LDAP/AD) or as a function that is integrated with the LDAP/AD user definitions. You must select one option only. If you already have LDAP/AD running in your organization, you probably want to use that, to streamline the process. If you do not use the LDAP/AD option, you must define each user individually.

In the following diagram note that there are three tenants in Cloudify Manager. Tenants can be assigned groups of users, individual users, or a combination of both groups and individuals.

{*Insert graphic here.*}

###Integrating Multi-Tenancy with LDAP/AD###
To connect Cloudify Manager with LDAP/AD, you must know the the URL of the service and have sufficient credentials to perform searches and so on. 

####Connecting to the LDAP/AD Service####
{*Need to add specfic process for what the user needs to do to connect. Omer, please send me the specific command that must be run on a new manager to connect it to an LDAP service.*}

####How Cloudify Manager Works with the LDAP/AD Service####
When a user logs in to Cloudify Manager, their credentials are passed to the LDAP/AD service for authentication. By default, all users in the LDAP/AD service are authenticated to Cloudify Manager, however only users who have specific permissions for a tenant can access it. 

When a user logs into Cloudify Manager, the service authenticates the user and returns a list of any groups to which the user belongs. If a Cloudify Manager instance has specified a group name for a tenant that has the same name as a group specified in LDAP/AD, all users in that group can access the tenant (unless an individual user is specifically suspended.) In addition, individual users can be given access to a tenant. The following graphic indicates how Cloudify Manager interacts with an LDAP/AD service. 

{*Insert graphic here.*}

####Managing Users in the Multi-Tenancy Environment####
There are a number of actions related to user access to tenants that an **`administrator`** user can perform. 

#####User-Related Commands#####
To run these commands, use `cfy users`.

- `add-user` enables you to add an individual user to a tenant
- `add-user-group` enables you to add a group of users to a tenant
- `remove-user` enables you to remove a specific user from a group
- `remove-user-group` enables you to remove a user group from a tenant
- `set-password` enables you to set the password for a user (in the case of a non-LDAP/AD setup)
- `set-role` enables you to set the role for a user. Possible roles are `administrator`, `user`, and `suspended`. An `administrator` user can perform all the commands listed here. A suspended user cannot access a tenant.



#####Tenant-Related Commands#####
To run these tenant-specific commands, use `cfy tenant`.

- `create` enables you to create a tenant
- `delete` enables you to delete a tenant
- `get` enables you to view information about the tenant
- `list` provides a list of all tenants in this instance of Cloudify Manager

####Managing Users in Cloudify Manager outside of LDAP/AD####
If you choose not to integrate Cloudify Manager with LDAP/AD, you must add each user individually and set a password for them. You can also create groups and add users to groups to them. The users and user groups can be assigned to one or more tenants.

