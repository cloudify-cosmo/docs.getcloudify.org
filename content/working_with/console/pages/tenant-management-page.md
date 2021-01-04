---
layout: bt_wiki
title: Tenant Management Page
category: Console
draft: false
weight: 140
aliases: ["/manager_webui/tenant-management-page/", "/working_with/console/tenant-management-page/"]
---

The default Tenant Management page provides widgets to enable you to add users and user groups to a tenant, and to add a user to a non-LDAP user group. In case of LDAP user groups, users are not managed through {{< param product_name >}}, but in the LDAP management system.

Additional information about security related to users and tenants is available on the [Security page]({{< relref "install_maintain/manager_architecture/security.md" >}}).

{{% note %}}
Tenant management actions are only visible and available to `admin` users.
{{% /note %}}

![Tenant Management Page]( /images/ui/pages/tenant-mgmt-page.png )


For more information check documentation pages for widgets used in this page:

* [User Management]({{< relref "working_with/console/widgets/userManagement.md" >}})
* [User Groups Management]({{< relref "working_with/console/widgets/userGroups.md" >}})
* [Tenant Management]({{< relref "working_with/console/widgets/tenants.md" >}})
