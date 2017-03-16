---
layout: bt_wiki
title: Tenant Management Page
category: Web Interface
draft: false
weight: 140
---


## Managing Users

In Edit mode, click **Add** in the User Management widget.
2. Enter a name for the user.
3. If the user is part of a connected LDAP system, enter the LDAP Group Distinguished Name (DN).   
   The format must be `cn=LDAP_USER_1,ou=people,dc=example,dc=com`, for example `CN=janeBrown,OU=engineers,DC=example,DC=com`.
4. Click **Add**.<br>
The user is added to the table.

## Managing User Groups

You can create user groups, including user groups that are configured in your LDAP/AD system, and add them to tenants. You can also add individual users to the group.

### Adding a User Group

1. In Edit mode, click **Add** in the User Groups Management widget.
2. Enter a name for the group.
3. If the group is linked to an LDAP group, enter the LDAP Group Distinguished Name (DN).   
   The format must be `CN=GroupName,OU=OUName,DC=Domaincomponent,DC= DomainComponent`, for example `CN=ldapwiki,OU=groups,DC=example,DC=com`.
4. Click **Add**.<br>
The group is added to the table.

### Adding a User Group to a Tenant



### Adding a User to a User Group


