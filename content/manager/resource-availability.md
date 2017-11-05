---
layout: bt_wiki
title: Resource Availability
category: Manager
draft: false
weight: 625
---

The resource's availability defines who can access the resource, it can be `private` (creating user only),
`tenant` (current tenant, default availability), or `global` (shared for everyone).


## Global Resources

A global resource is exposed to all users who have access to at least one of the manager's tenants.
Blueprints, secrets, and plugins can be set to global - and an admin role is required to perform this setting.
Once a resource is set to global, its availability level cannot change.

Global resources can only be modified (and removed) by their creating tenant, and can be accessed and used by users in all tenants.
As a best practice, admins could add global resources to a global tenant to which only they belong -
so non-admins will not be able to modify the global resources and affect all system users.

Global resources names must be unique in the entire system, across all tenants. Therefore:

- When setting a resource to global, the operation will fail if any of the tenants includes a resource with the same name.
- When creating a new resource, it must not have the same name as any of the global resources available.


## Private Resources

To separate resources and provide robust access control, Cloudify supports the upload of blueprints, deployments, plugins and snapshots as private resources, using the `--private-resource` flag.
When you specify this flag the uploaded resource, and its related logs and events, are only accessible and visible to its creator, and to Admin users-- who can see all the resources in a tenant, including private ones.

The default for this value is `false`, meaning the resource is accessible to all users who can access the tenant on which it is uploaded.

Using the private resources flag enables you to create internal resource separation--even within the tenants, meaning that not all users of a tenant can necessarily access all of its resources.

In addition, executions of public deployments are public, whereas those of private deployments are private.


### Private Resources in Cloudify UI

In the Cloudify UI, private resources are indicated with a red lock icon in the top right corner, as shown below.

![Private Resources]({{< img "manager/private-resources-1.png" >}})

To upload or create a private resource from the user interface, click the grey lock icon in the top right of the upload/creation dialog box.
