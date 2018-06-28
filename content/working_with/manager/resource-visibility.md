---
layout: bt_wiki
title: Resource Visibility
category: Manager
draft: false
weight: 625
aliases:
    - /manager/resource-availability/
    - /manager/resource-visibility/
---

The visibility of the resource defines who can see the resource. It can have one of the following values:

- **private** - The resource is visible to the user that created the resource, the tenant’s managers and the system’s admins. Only these users can see or use this resource.
- **tenant** - The resource is visible to all users in the current tenant. (Default value)
- **global** - The resource is visible to all users in all tenants across the manager.

When uploading or creating a resource you can specify its visibility by using the `--visibility` attribute with one of the values `private`, `tenant` or `global`.
The default value for `--visibility` is `tenant`.
After a resource is created its visibility can be changed, but only to a wider visibility.

The actions the users can perform on the resources depend on their roles, so even if a resource is available to them they will not necessarily be able to perform all actions on it. For example, a user with the role `viewer` in a specific tenant will be able to see the blueprints with the visibility value `tenant` which are uploaded to this specific tenant, but will not be able to deploy them. You can find more about the different roles in Cloudify under **[MANAGING ROLES]**({{< relref "working_with/manager/roles-management.md" >}})**.


## Tenant Resources

By default, all the resources are being created with tenant visibility.
This means that all users who can access the tenant can also see the resource.
We refer to this visibility as “tenant-wide”.


## Private Resources

To separate resources and provide robust access control, Cloudify supports the upload of blueprints, deployments, plugins and secrets as private resources.
A private resource and its related logs and events are only accessible and visible to its creator, the tenant’s managers and the system’s admins users.

It enables you to create internal resource separation even within the tenants, meaning that not all users of a tenant can necessarily access all of its resources.

The visibility of executions is derived from the deployment’s one: executions of tenant deployments are tenant, whereas those of private deployments are private.


## Global Resources

A global resource is shown to all users who have access to at least one of the manager's tenants.
Starting from Cloudify 4.3, a resource can be created with global visibility.
The resources which can be set to global are blueprints, secrets and plugins - and an admin role is required to perform this setting.
Once a resource is set to global, its visibility level cannot be changed.

To modify or delete a global resource, you need to be logged in to the tenant the resource was created at. Please notice that users with roles that permit them to perform actions on resources in this tenant will be able to perform those actions on the global resource as well. 

{{% tip title="Tip" %}}
As a best practice, we recommend the admins to create a “global-resources tenant” to which they add only global resources - so non-admins will not be able to modify the global resources and affect all system users.
{{% /tip %}}    

Names of global resources must be unique in the entire system, across all tenants. Therefore:

- When setting a resource to global, the operation will fail if any of the tenants includes a resource with the same name.
- When creating a new resource, it must not have the same name as any of the global resources available.


### Resource Visibility in Cloudify UI

In the Cloudify UI, the resource visibility is indicated with an icon in the top right corner.
As shown below, private resources are indicated with a red lock icon,
tenant resources are indicated with a green man icon and global resources are indicated with a blue world icon.

![Resource Visibility]( /images/manager/blueprints_visibility.png )

When you create or update a resource from the user interface, click the visibility icon and select the visibility for the resource.
