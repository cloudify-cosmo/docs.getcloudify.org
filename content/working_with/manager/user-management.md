---
title: Managing Users
description: A user management mechanism is provided, so you can define different users with different permissions, and upon login perform authentication and authorization to control the users’ access to resources.
category: Manager
draft: false
weight: 1400
aliases: /manager/user-management/
---
{{< param product_name >}} provides a user management mechanism, so you can define different users with different permissions, and upon login perform authentication and authorization to control the users’ access to resources.

The users can be either defined and managed in {{< param product_name >}} itself, or you can configure your Manager to integrate with an LDAP-based user-management system.
You must select one of these options, as you cannot do both, and you must configure your manager accordingly upon installation or immediately afterwards, when no actions were performed on it yet.  
User management can be performed using the CLI or the {{< param cfy_console_name >}}.

{{% tip title="User Management Credentials" %}}
You must have {{< param cfy_manager_name >}} administrator permissions to perform user-management related actions.
{{% /tip %}}

## Managing users in {{< param cfy_manager_name >}}
If you choose not to integrate with an external user-management system, you can manage your {{< param product_name >}} users on the manager itself, either by the [CLI commands]({{< relref "cli/maint_cli/users.md" >}}) or the [User Management widget]({{< relref "working_with/console/widgets/userManagement.md" >}}) in the {{< param cfy_console_name >}}. You can create users, add them to user-groups, assign them with tenants under specific roles, deactivate and delete them.

## Managing users by Integrating with an LDAP System
To integrate the {{< param cfy_console_name >}} with an LDAP user repository, please follow [these directions]({{< relref "working_with/manager/ldap-integration.md" >}})



## Adding Users Manually
If you choose not to integrate {{< param cfy_manager_name >}} with LDAP systems, you must add each user individually and set a password for them. You can also create user-groups and add users to them. The users and user groups can be assigned to one or more tenants.

For more information, see the [users]({{< relref "cli/maint_cli/users.md" >}}) and [user-groups]({{< relref "cli/maint_cli/usergroups.md" >}}) commands in the CLI documentation.

#### Tenant-Related Commands

You can add and remove users and user groups to/from a specific tenant. To run these user-related tenant-specific commands, use `cfy tenant`. For more information, see the [tenants]({{< relref "cli/maint_cli/tenants.md" >}}) command in the CLI documentation.

- `add-user` enables you to add an individual user to a tenant
- `add-user-group` enables you to add a user groups to a tenant
- `create` enables you to create a tenant
- `delete` enables you to delete a tenant
- `get` enables you to view information about a tenant, including its users
- `list` displays a list of all tenants in this instance of {{< param cfy_manager_name >}}. By default, when you generate the list of tenants, only the number of linked user-groups and users is displayed. You can retrieve full details with the use of a `--get data` flag.
- `remove-user` enables you to remove a specific user from a tenant
- `remove-user-group` enables you to remove a user group from a tenant

#### How to assign a role to user

When a user is added to a tenant, a Role must be assigned to it by passing a valid value in the `-r/--role` option.

- `cfy tenant add-user -r <role name> ...` adding a user to a tenant, and give him a role.
- `cfy tenant add-user-group -r <role name> ...` adding a user-group to a tenant, and give it a role.
- `cfy users set-role <role-name>` setting the user system role

## User Account Lock

{{< param product_name >}} lets admins enforce an account lock after a user fails for a specified number of login attempts. After an account is locked the user must wait the specified time period before another login attempt, or the admin can unlock the user account.

You can configure the account lock in the {{< param cfy_manager_name >}} either:

* Before you start to use the {{< param cfy_manager_name >}} - [Before you install]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.mdd#installing-cloudify-manager" >}}) the {{< param cfy_manager_name >}} or [after you install]({{< relref "cloudify_manager/premium/aio/install_and_configure/centos_rhel.md#configuring-the-manager-settings" >}}) the {{< param cfy_manager_name >}}, you can set the account lock settings in the config.yaml file. After you install or configure the {{< param cfy_manager_name >}}, the account lock is enforced.

* After you start to use the {{< param cfy_manager_name >}} - Edit the account lock settings in the rest service configuration file at `/opt/manager/rest-security.conf`. To enforce the account lock, restart the {{< param product_name >}} rest service: `supervisorctl restart cloudify-restservice`

### User Lock Settings

In either the config.yaml file or the REST service configuration, set these account lock settings:

* `failed_logins_before_account_lock` - Number of failed logins (bad password) before account lock.
* `account_lock_period` - Account lockout time in minutes. `-1` disables account lockout even when `failed_logins_before_account_lock` has a value.

### Unlocking a user

{{< param product_name >}} admins can unlock a user account with the command: `cfy users unlock <username>`
