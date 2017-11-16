---
layout: bt_wiki
title: Resource Availability
category: Manager
draft: false
weight: 625
---

The resource's availability defines who can access the resource. It can have one of the following values:
* **tenant** - The resource is available to all users in the current tenant. This is the default availability. 
* **private** - The resource is available to the owner (the creating user), the tenant’s managers and the system’s admins. No one else will be able to see or use this resource. 
* **global** - The resource is available to all users in all tenants across the manager.

The actions the users can perform on the resources depend on their roles, so even if a resources is available to them they will not necessarily be able to perform all actions on it. For example, a user with the role “viewer” in a specific tenant will be able to see the blueprints with the availability value ‘tenant’ which are uploaded to this specific tenant, but will not be able to deploy them. You can find more about the different roles in Cloudify under **roles-management**. 

## Global Resources

A global resource is exposed to all users who have access to at least one of the manager's tenants.
In Cloudify 4.2, A resource has to be created first with either private or tenant availability. Then, it can be set to global using the set-global command. 
The resources which can be set to global are Blueprints, secrets and plugins - and an admin role is required to perform this setting.
Once a resource is set to global, its availability level cannot be changed.

To modify or delete a global resource, you need to be logged in to the tenant the resource was created at. Please notice that users with roles that permit them to perform actions on resources in this tenant will be able to perform those actions on the global resource as well. 
**As a best practice, we recommend the admins to create a “global-resources tenant” to which they would add only global resources - so non-admins will not be able to modify the global resources and affect all system users.**

Global resources names must be unique in the entire system, across all tenants. Therefore:

- When setting a resource to global, the operation will fail if any of the tenants includes a resource with the same name.
- When creating a new resource, it must not have the same name as any of the global resources available.


## Private Resources

To separate resources and provide robust access control, Cloudify supports the upload of blueprints, deployments, plugins and snapshots as private resources, using the `--private-resource` flag.
When you specify this flag, the uploaded resource and its related logs and events are only accessible and visible to its creator, the tenant’s managers and SysAdmin users. 

The default for this value is `false`, meaning the resource will be uploaded/created as accessible to all users who can access the tenant to which it was uploaded. We refer to this availability as ‘tenant-wide’. 

Using the private resources flag enables you to create internal resource separation even within the tenants, meaning that not all users of a tenant can necessarily access all of its resources.

The availability of executions is derived from the deployment’s one:  Executions of public deployments are public, whereas those of private deployments are private.


### Private Resources in Cloudify UI

In the Cloudify UI, private resources are indicated with a red lock icon in the top right corner, as shown below.

![Private Resources]({{< img "manager/private-resources-1.png" >}})

To upload or create a private resource from the user interface, click the grey lock icon in the top right of the upload/creation dialog box.
