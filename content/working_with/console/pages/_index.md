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

* [Dashboard]({{< relref "working_with/console/pages/dashboard-page.md" >}})
* [Blueprints]({{< relref "working_with/console/pages/blueprints-page.md" >}})
* **Deployments** page group:
  * [Services]({{< relref "working_with/console/pages/services-page.md" >}})
  * [Environments]({{< relref "working_with/console/pages/environments-page.md" >}})
* [Executions]({{< relref "working_with/console/pages/executions-page.md" >}})
* **Resources** page group:
  * [Secrets]({{< relref "working_with/console/pages/secrets-page.md" >}})
  * [Plugins]({{< relref "working_with/console/pages/plugins-page.md" >}})
  * [Sites]({{< relref "working_with/console/pages/sites-page.md" >}})
  * [Agents]({{< relref "working_with/console/pages/agents-page.md" >}})
  * [Filters]({{< relref "working_with/console/pages/filters-page.md" >}})
  * [Tokens]({{< relref "working_with/console/pages/tokens-page.md" >}})
* **System Setup** page group:
  * [Users]({{< relref "working_with/console/pages/users-page.md" >}})
  * [Groups]({{< relref "working_with/console/pages/groups-page.md" >}})
  * [Tenants]({{< relref "working_with/console/pages/tenants-page.md" >}})
  * [System Health]({{< relref "working_with/console/pages/system-health-page.md" >}})
  * [System Logs]({{< relref "working_with/console/pages/logs-page.md" >}})
  * [Snapshots]({{< relref "working_with/console/pages/snapshots-page.md" >}})

#### Non-admin users

***main-default*** template applies to all non-admin users in all the tenants to which they have access, and includes the following pages:

* [Dashboard]({{< relref "working_with/console/pages/dashboard-page.md" >}})
* [Blueprints]({{< relref "working_with/console/pages/blueprints-page.md" >}})
* **Deployments** page group:
  * [Services]({{< relref "working_with/console/pages/services-page.md" >}})
  * [Environments]({{< relref "working_with/console/pages/environments-page.md" >}})
* [Executions]({{< relref "working_with/console/pages/executions-page.md" >}})
* **Resources** page group:
  * [Secrets]({{< relref "working_with/console/pages/secrets-page.md" >}})
  * [Plugins]({{< relref "working_with/console/pages/plugins-page.md" >}})
  * [Sites]({{< relref "working_with/console/pages/sites-page.md" >}})
  * [Agents]({{< relref "working_with/console/pages/agents-page.md" >}})
  * [Filters]({{< relref "working_with/console/pages/filters-page.md" >}})

The users permissions to perform actions in these pages depend on the roles they have on the tenant.

### {{< param mgr_community_title >}}

***community*** template includes the following pages:

* [Dashboard]({{< relref "working_with/console/pages/dashboard-page.md" >}})
* [Blueprints]({{< relref "working_with/console/pages/blueprints-page.md" >}})
* **Deployments** page group:
  * [Services]({{< relref "working_with/console/pages/services-page.md" >}})
  * [Environments]({{< relref "working_with/console/pages/environments-page.md" >}})
* [Executions]({{< relref "working_with/console/pages/executions-page.md" >}})
* **Resources** page group:
  * [Secrets]({{< relref "working_with/console/pages/secrets-page.md" >}})
  * [Plugins]({{< relref "working_with/console/pages/plugins-page.md" >}})
  * [Sites]({{< relref "working_with/console/pages/sites-page.md" >}})
  * [Agents]({{< relref "working_with/console/pages/agents-page.md" >}})
  * [Filters]({{< relref "working_with/console/pages/filters-page.md" >}})

## Built-in pages

This section presents set of pages available for `admin` users.

{{%children style="h3" description="true"%}}
