Managing Roles
%%%%%%%%%%%%%%

What are Cloudify roles?
------------------------

The Cloudify roles provide sets of permissions, and define the access a
user has in the context of tenants. Each user can get a role in a few
ways – specifically assigned (per tenant), assigned to group (per
tenant) or system level role when the user is created.

System-wide roles and tenant-roles
----------------------------------

System-wide roles are roles that define the access to all the tenants in
the system, typically allowed to do system wide operations. Tenant roles
are roles that define the access in the context of a specific tenant.
User can have one system-wide role, but multiple roles per tenant. When
a user or a group assigned to a tenant, it must assigned with a specific
role.

Differences between the roles
-----------------------------

System wide roles:

-  ``sys_admin`` has permissions to all tenant level APIs in addition to
   system level APIs. The user admin is created automatically as
   sys_admin in the installation process.
-  ``default`` doesn’t have permission for anything until he will be
   assigned to tenant.

Tenant’s Role:

-  ``manager`` has the ability of managing all of the tenant’s resources
   (private and public) and creating new resources, but without the
   ability of creating or managing users.
-  ``user`` has the ability of managing all of the tenant’s resources
   (only public) and creating new resources.
-  ``operations`` has the ability of deploying blueprints and executing
   workflows, but does not allow them to upload new blueprints or
   plugins to the tenant.
-  ``viewer`` has the ability of viewing the public resources of
   explicitly defined tenant (or tenants).

[User Roles Permissions]({{< img “manager/roles.png” >}})
