---
layout: bt_wiki
title: Tenant Management Page
category: Web Interface
draft: false
weight: 140
---

The default Tenant Management page provides widgets to enable you to add users and user groups to a tenant, and to add a user to a non-LDAP user group. (In the case of LDAP user groups, users are not managed through Cloudify, but in the LDAP management system.) Additional information about security related to users and tenants is available on the [Security page]({{< relref "manager_architecture/security.md" >}}).

{{% gsNote title="Advanced Process" %}}
Tenant management actions are only visible and available to `admin` users.
{{% /gsNote %}}

## Adding Users

The following sections provide two methods for adding users and user groups. The first describes how to add users and user groups through Cloudify. The second describes how to add users and user groups when working with a LDAP-based user management system.

### User Management in Cloudify

Use the processes described in this section if you are not working with an LDAP system. You must have an `admin` role to create users in the User Management widget.

#### Adding Users

1. In Edit mode, click **Add** in the User Management widget.
2. Specify a name for the user.   
   The name must contain at least five alphanumeric characters and begin with a letter. It can also include the following characters `-`, `_`, or `.`. 
3. Specify a password for the user, then confirm it.   
   The password must contain at least five alphanumeric characters and begin with a letter. It can also include the following characters `-`, `_`, or `.`. 
4. Select a role for the user. A user can have either a `user` role or an `admin` role. The default is `user`.   

   * An `admin` has permissions to all tenants, and can see both private and public resources.   
   * A `user` can only access the tenants to which they are assigned, and can only see public resources that they are the owners of. In addition, some features and widgets might not be available to non-admin users, such as the ability to create other users.
5. Click **Add**.   
   The user is added to the table.


#### Performing other Actions on User Profiles

1. Click the List icon on the far right of the user entry in the table to view other actions, including changing a password or role, adding the user to groups or tenants, or deleting them from the system. 

![User options]({{<img "ui/tenant-management/user-options.png">}})

#### Adding a User Group

Users groups are not mandatory when you manage users in Cloudify, however creating groups might enable you to manage your users more efficiently. You can create groups of users and assign them to one or more tenants.

1. In Edit mode, click **Add** in the User Groups Management widget.
2. Enter a name for the group.   
   The name must contain at least five alphanumeric characters and begin with a letter. It can also include the following characters `-`, `_`, or `.`. 
3. Click **Add**.<br>
The group is added to the table.

### User Management via an LDAP System

To integrate with an external user management system, you must first ensure that Cloudify Manager is configured accordingly. This can be achieved during the [bootstrapping process]({{< relref "installation/from-source.md" >}}), or you can run the following command on a Cloudify Manager instance on which no actions have been performed (a clean machine.)

**Usage**

```cfy ldap set [OPTIONS]```

**Options**

```-s, --ldap-server TEXT```          The LDAP server address to authenticate against  [required]<br>
```-u, --ldap-username TEXT```        The LDAP admin username to be set on the Cloudify manager  [required]<br>
```-p, --ldap-password TEXT```        The LDAP admin password to be set on the Cloudify manager  [required]<br>
```-d, --ldap-domain TEXT```          The LDAP domain to be used by the server [required]<br>
```-a, --ldap-is-active-directory```  Specify whether the LDAP used for authentication is Active-Directory<br>
```-e, --ldap-dn-extra TEXT```        Extra LDAP DN options<br>
```-h, --help```                      Show this message and exit<br>


**Example**

```cfy ldap set -a -s ldap://<LDAP SERVER IP>:389 -u <LDAP ADMIN USER> -p <LDAP ADMIN USER PASSWORD> -d <DOMAIN.com>```


After you have configured Cloudify to work with LDAP, you can only manage users through the LDAP-based system, to avoid conflicts between the systems. You cannot directly create or delete users, edit their passwords, add them to groups, or assign them to tenants in Cloudify. However, you can edit user roles.

You create the connection between the LDAP system and Cloudify through user-groups. You must create user-groups in Cloudify that represent your LDAP user groups. You then assign those Cloudify groups to tenants in Cloudify Manager. When a user logs into Cloudify, a request is sent to the LDAP system for authentication and identification of the groups to which the user belongs. Cloudify then identifies the tenants that the Cloudify groups (that represent the LDAP groups) can access, and allows user access.

After a user has logged in to Cloudify, they are visible in the users list, but you cannot perform any management actions on their profile, other than editing their user role. The default role is `user`.

#### Adding a User Group
You can create user groups that are configured in your LDAP/AD system, and add them to tenants. 

1. In Edit mode, click **Add** in the User Groups Management widget.
2. Enter a name for the group.
3. Enter the LDAP Group Distinguished Name (DN).   
   The format must be `CN=GroupName,OU=OUName,DC=Domaincomponent,DC= DomainComponent`, for example `CN=ldapwiki,OU=groups,DC=example,DC=com`.
4. Click **Add**.<br>

The group is added to the table. You can perform actions on a group profile, such as assigning a group to a tenant or deleting the group,  using the dropdown menu on the right of their entry in the table.

## Adding User Groups to a Tenant

1. In the User Groups Management widget, click the List icon on the far right of the user group entry in the table that you want to add to a tenant.
2. Click **Add group to tenant**.
3. Select one or more tenants from the dropdown list and click **save**..
4. The user group is added to the specified tenants.   
   All users within the group, unless they have a deactivated status, can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

## Adding Users to a Tenant

1. In the User Management widget, click the List icon on the far right of the user entry in the table that you want to add to a tenant.
2. Click **Add to tenant**.
3. Select one or more tenants from the dropdown list and click **save**..
4. The user is added to the specified tenants.   
   Unless the user has a deactivated status, they can perform actions on the tenant according to their role and the configuration privileges specified by the `admin`.

## Removing a User from a Group or Tenant

You can remove a user from a group or a tenant, without deleting them from the system. There are two ways in which a user can be removed.

* In the User Management widget, click the List icon of the user that you want to remove and select **Edit user's groups** and click **Save**.
* In the Tenant's Management widget, click the List icon of the tenant from which you want to remove a user and select **Edit users**. Select the user to remove and click **Save**.

The user is removed. If a user is a member of one or more user groups that are still assigned to a tenant, that user remains active on the tenant.

## Deleting Tenants, Users and User Groups

A user can only be deleted from the system if they are not assigned to a group or to a tenant, and if they do not own resources in the system. User groups can be deleted if they have no users. Tenants can be deleted if they have no resources or users.

1. In widget that contains the entity that you want to delete, click the List icon on the far right of the entry and select the entity to delete.
2. Click **Delete**.   

 








