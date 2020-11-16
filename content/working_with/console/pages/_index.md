---
title: Pages
description:
weight: 60
alwaysopen: false
---

The user interface displays a predefined set of dashboard pages, each of which contains a set of widgets. The widgets are organized on each page to optimize the display of that page's relevant data. The dashboard pages that you see depend on the user role you have.

Admin users can customize each page, including which widgets are shown and their position on the page. More details on how to do that can be found in the [Customization]({{< relref "working_with/console/customization/_index.md" >}}) section. More details about available built-in widgets can be found in the [Widgets]({{< relref "working_with/console/widgets/_index.md" >}}) section.


## Built-in templates

Below are the default set of pages (templates) presented per {{< param product_name >}} version and user role.


### {{< param mgr_premium_title >}}

#### Admin users

***main-sys_admin*** template applies to `sys-admin` users in all the tenants, and includes the following pages:

* **Dashboard** - An overview of the existing executions and system statistics.
* **Cloudify Catalog** - Contains Plugins Catalog showing available {{< param product_name >}} plugins and Blueprints Catalog presenting blueprint examples.
* **Local Blueprints** - A list of all the blueprints which were uploaded to the current tenant and access to [{{< param cfy_composer_name >}}]({{< param cfy_composer_link >}}). From this page you can access the Blueprint drill-down page, by clicking on a specific blueprint.
* **Site Management** - A list of all sites created in the current tenant and possibility to manage the sites.
* **Deployments** - A list of all deployments created in the current tenant, and the statuses of their nodes. From this page you can access the Deployment drill-down page, by clicking on a specific deployment.
* **Tenant Management** - Users, User-Groups and Tenants Management.
* **Admin Operations** - Maintenance Mode switch, a view-only presentation of the system’s cluster status and Snapshots management.
* **System Resources** - Plugins, Secrets and Agents management.
* **Logs** - Events/Logs table with multiple filters.


#### Non-admin users

***main-default*** template applies to all non-admin users in all the tenants to which they have access, and includes the following pages:

* **Dashboard**
* **{{< param product_name >}} Catalog**
* **Local Blueprints**
* **Deployments**
* **Site Management**
* **System Resources**
* **Logs**

The users permissions to perform actions in these pages depend on the roles they have on the tenant.


### {{< param mgr_community_title >}}

***community*** template includes the following pages:

* **Dashboard**
* **{{< param product_name >}} Catalog**
* **Local Blueprints** (without access to [{{< param cfy_composer_name >}}]({{< param cfy_composer_link >}}))   
* **Deployments**
* **System Resources**
* **Logs**


## Built-in pages

This section presents set of pages available for `admin` users.

{{% note %}}
These pages can also exist for non-admin users, but can have different set of widgets.
{{% /note %}}

{{%children style="h3" description="true"%}}
