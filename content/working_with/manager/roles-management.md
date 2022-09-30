---
title: Managing Roles
category: Manager
draft: false
weight: 1400
aliases: /manager/roles-management/
---

## What are {{< param product_name >}} roles?

A role is a group of permissions that are required by a certain type of user to work in {{< param product_name >}}. You can assign roles to a user to give that user the permissions that are defined in the role. You can also assign roles to user groups to give the permissions that are defined in the role to all of the users in the group.
If a user is a member of more than one group, then the user has all of the permissions in the role defined for the user specifically, in addition to all of the permissions defined for all of the roles the user is assigned to via groups.

## System roles

System roles apply the permissions in the role to the user for all of the tenants, and also for actions outside tenants.
Each user must have either:

* sys_admin - This role has all permissions. The `admin` user is created automatically as sys_admin during the installation process.
* default - This role has no permissions specified.

## Tenant roles

Tenant roles apply the permissions in the role to the user or group only in the tenant where the role is assigned to the user or group.
You can assign one of these roles to each user or group:

* manager - Can manage all of the private and public resources on the tenant and can create new resources,
  but cannot create or manage users on the tenant.
* user - Can manage all of the public resources on the tenant and can create new resources.
* operations - Can deploy blueprints and execute workflows, but cannot upload new blueprints or plugins to the tenant.
* viewer - Can view public resources on the tenant.

![User Roles Permissions]( /images/manager/roles.png )
