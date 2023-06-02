+++
title = "About ServiceNow Application"
description = "Overview of ServiceNow application installation and configuration"
weight = 101
alwaysopen = false
+++

{{< param product_name >}} Application is a scoped application that provides ServiceNow users an integration interface to {{< param product_name >}} environments, using Catalog items that will be added to your default service portal under {{< param product_name >}} Resources.

## Application Contents

The Application provides:

* The ability to connect to multiple {{< param cfy_manager_name >}}s with different tenants.
* Admin Tasks for integration with {{< param cfy_manager_name >}}:
    * Upload Blueprint
    * Create Environment
    * Manage Environment
    * Update Environment
    * Delete Environment
    * Resume Execution (>= Version 3)
    * Stop Execution (>= Version 3)
* Setup Cloud Account -AWS/Azure-.
* Certified environments.
* Various Resources.

## Application Prerequisites

ServiceNow version: >= Quebec Release

## Application Installation

The Application can be installed like any other Application - through the official ServiceNow Store :

1.  Log into ServiceNow Store with ServiceNow HI credentials.
2.	Search for {{< param product_name >}} in the search box. Application information appears in the search results.
3.	From the search results, click {{< param product_name >}}.
Information about the application is displayed.
4.	In the right pane of the application window, view the Compatibility section to ensure that the integration application is compatible with the version of ServiceNow that you require.
5.	In the right pane of the application window, click the Get button.
A notice appears.
6.	At the bottom of the notice, click Continue.
7.	On the Purchase of {{< param product_name >}} page, choose the Make available on specific instances radio button and click the Select button.
A Select Instances dialog appears.
8.	In the Available Instances pane, double-click the instance that you want the application to be available on and click OK.
9.	Select the "I accept" check box (to accept terms of use and subscription terms and conditions) and click Get.
10.	Log into the ServiceNow instance where you made the integration application available. (You selected this instance in Step 7).
11.	In the Filter navigator, enter System Applications, and then under System Applications, click Applications.
The Applications list appears.
12.	Click the Downloads tab.
The Downloads list appears.
13.	Scroll to the {{< param product_name >}} application, and click the Install button.
The application now appears in the ServiceNow menu, displayed in the left-hand navigation panel as {{< param product_name >}}.

You can refer to the ServiceNow official support video :

<iframe src="https://www.youtube.com/embed/JlHc-nA3e6Y" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

One more video that demonstrates our application installation :

<iframe src="https://player.vimeo.com/video/664385329" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Application Tables

The application consists of 7 main tables :

* x_clop2_cloudify_configs : this table is used to hold {{< param cfy_manager_name >}} tenants endpoints.
* x_clop2_cloudify_deployments : this table is used to keep track of the deployments created by which users.
* x_clop2_cloudify_executions : this table is used to keep track of deployments executions statuses.
* x_clop2_cloudify_remediation_setups : this table is used to supply dynamic values to remediation subflow and which config record to use. (>= Version 2.5)
* x_clop2_cloudify_custom_catalog_setup : this table is used to supply a dynamic way of linking custom catalog items with their respective blueprints. (>= Version 3)
* x_clop2_cloudify_temp_list_collector : this table is used to hold temporary values for {{< param cfy_manager_name >}} [ >= Version 6.4 ] new list type . (>= Version 3)
* x_clop2_cloudify_rest_requests : this table is used to hold inbound REST requests for {{< param cfy_manager_name >}}. (>= Version 3)


## Application Roles

The application contains 2 main roles that can be assigned to ServiceNow users :

* x_clop2_cloudify.admin : Application admin role where the user will have access to application menu and all of the modules, the ability to select all of the config records despite being customized to be for a specific group , can also see all records in the deployments and executions tables.
* x_clop2_cloudify.user : Application user role where the user will have access to the catalog resources from the service portal and the ability to select the config records that are either assigned to the user group or with no group specified to it.

> **Note** : In the versions >= 3 the user role have been extended to see the application menu where the users will have access to define configs and see their executions progress.

You can watch this video that explains the roles :

<iframe src="https://player.vimeo.com/video/672063393" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

You can watch this video that shows the roles in action :

<iframe src="https://player.vimeo.com/video/672063550" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

You can watch this video that shows the config visibility for users :

<iframe src="https://player.vimeo.com/video/672061131" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>


## Application Getting Started

the following video will help guide you through getting started :

<iframe src="https://player.vimeo.com/video/664385608" width="500" height="300" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

{{%children style="h3" description="true"%}}
