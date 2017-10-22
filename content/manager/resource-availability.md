---
layout: bt_wiki
title: Resource Availability
category: Manager
draft: false
weight: 625
---

The resource's availability defines who can consume the resource, it can be `private` (creating user only),
`tenant` (current tenant, default availability), or `global` (shared for everyone).


#### Global Resources

A global resource is exposed to all users who have access to at least one of the manager's tenants.
Blueprints, secrets, and plugins can be set to global only by an admin.
Once a resource is global, it cannot become tenant-specific or private except by being deleted.

Global resources can be interacted with normally by users in the tenant that owns them, but only consumed (not modified) by those in other tenants.
For example, a secret shared from TenantA can be used but not modified by a user in TenantB; blueprints shared by TenantA can be used to create deployments (but not updated) by other tenants, etc.
TenantA users can still update, use or delete these resources.

The name of a global resource must be unique, therefore :
* Any resource an admin is attempting to set global may not have the same name as an existing resource.
* When attempting to create a new resource, that resource must not exist in the current tenant or as a currently global resource.


#### Private Resources

To separate resources and provide robust access control, Cloudify supports the upload of blueprints, deployments, plugins and snapshots as private resources, using the `--private-resource` flag.
When you specify this flag the uploaded resource, and its related logs and events, are only accessible and visible to its creator, and to Admin users-- who can see all the resources in a tenant, including private ones.

The default for this value is `false`, meaning the resource is accessible to all users who can access the tenant on which it is uploaded.

Using the private resources flag enables you to create internal resource separation--even within the tenants, meaning that not all users of a tenant can necessarily access all of its resources.

In addition, executions of public deployments are public, whereas those of private deployments are private.


## Private Resources in Cloudify UI

In the Cloudify UI, private resources are indicated with a red lock icon in the top right corner, as shown below.

![Private Resources]({{< img "manager/private-resources-1.png" >}})

To upload or create a private resource from the user interface, click the grey lock icon in the top right of the upload/creation dialog box.
