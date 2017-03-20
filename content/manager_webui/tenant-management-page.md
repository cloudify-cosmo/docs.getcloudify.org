---
layout: bt_wiki
title: Tenant Management Page
category: Web Interface
draft: false
weight: 140
---



The default Tenant Management page provides widgets to enable you add users and user groups to a tenant, and to add a user to a non-LDAP user group. (In the case of LDAP user groups, users are added through the LDAP process, not through Cloudify Manager.)

{{% gsNote title="Advanced Process" %}}
Tenant management actions are only visisble and available to `admin` users.
{{% /gsNote %}}

## Adding Users

In Edit mode, click **Add** in the User Management widget.

2. Enter a name for the user.
3. If the user is part of a connected LDAP system, enter the LDAP Group Distinguished Name (DN).   
   The format must be `cn=LDAP_USER_1,ou=people,dc=example,dc=com`, for example `CN=janeBrown,OU=engineers,DC=example,DC=com`.
4. Click **Add**.   
   The user is added to the table.
5. Click the List icon on the far right of the user entry in the table and select **Set password** to specify a password for the user. 

You can also perform other actions, such as changing the user's role from `user` (the default) to `admin`, add them to groups or tenants, or delete them.

## Managing User Groups

You can create user groups, including user groups that are configured in your LDAP/AD system, and add them to tenants. You can also add individual users to the group.

### Adding a User Group

1. In Edit mode, click **Add** in the User Groups Management widget.
2. Enter a name for the group.
3. If the group is linked to an LDAP group, enter the LDAP Group Distinguished Name (DN).   
   The format must be `CN=GroupName,OU=OUName,DC=Domaincomponent,DC= DomainComponent`, for example `CN=ldapwiki,OU=groups,DC=example,DC=com`.
4. Click **Add**.<br>
The group is added to the table.

### Adding User Groups to a Tenant

1. In the User Groups Management widget, click the List icon on the far right of the user group entry in the table that you want to add to a tenant.
2. Click **Add group to tenant**.
3. Select one or more tenants from the dropdown list and click **save**..
4. The user group is added to the specified tenants.   
   All users within the group, unless they have a deactivated status, can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

### Adding Users to a Tenant

1. In the User Management widget, click the List icon on the far right of the user entry in the table that you want to add to a tenant.
2. Click **Add to tenant**.
3. Select one or more tenants from the dropdown list and click **save**..
4. The user is added to the specified tenants.   
   Unless the user has a deactivated status, they can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

### Deleting Users and User Groups from a Tenant

1. In either the User Management widget or User Groups Management widget, click the List icon on the far right of the entry that you want to delete from a tenant.
2. Click **Delete**.   
   The user or user group is removed from the tenant. Note that they are not deleted as from the users or user groups.<br>
   If a user is a member of more than one user group that is still assigned to a tenant, that user remains active on the tenant. 








