---
layout: bt_wiki
title: Templates Management
category: Cloudify Console
draft: false
abstract: Templates Management
weight: 160
aliases: ["/manager_webui/templates-mgmt/", "/working_with/console/templates-mgmt/"] 
---

In {{< param mgr_premium_title >}}, the {{< param cfy_console_name >}} framework allows `sys-admin` users to define what sets of pages the users see when they log into the system, and which widgets these pages contain. For example, they can define a special template for managers of a specific tenant. Those pre-defined sets of pages are called **UI Templates**.

{{% note %}}
* **UI Template** applies for specific user-roles, in specific tenants.
* {{< param mgr_community_title >}} does not support multiple users or multiple tenants, it also does not support the ability to define custom templates.
{{% /note %}}

In order to see used templates or create new one, sys-admins can choose the **Template Management** option in the user menu:

![Template Management - menu]( /images/ui/customization/templates_menu.png )

Choosing this option will present all the existing templates and pages on the current manager. From here, you can create new templates and pages and edit existing ones.  

![Template Management - main page]( /images/ui/customization/templates_main-page.png )


## Creating a new template

After clicking the **Create template** button, specify the template’s name and choose to which user roles and in which tenants it should apply.
Next, choose the pages you would like to include in the template from the pages’ list on the left, and choose **Create**.

The template will now apply to all users with the relevant roles in the specified tenants.

Templates are applied upon first-time login. Users who already logged into the system must select the **Reset templates** option under the user menu to apply the new template changes to their account.

{{% note %}}
New template will override all changes users manually introduced in [Edit Mode]({{< relref "working_with/console/customization/edit-mode.md" >}}).
{{% /note %}}   

![Template Creation]( /images/ui/customization/templates_create.png )

In case a user fits more than one template in a specific tenant (if the user has more than one role in this tenant), the template which will apply to it will be the first template on the list, from all those it fits.


## Creating a new page

After clicking the **Create page** button and specifying the name of the new page, you will see the new page appear in the page’s list, and a Page Id will be automatically created for it. You will then be able to choose or edit it from the actions menu to its right.

Upon choosing the edit option, the page will be open in **Edit Mode**, in which you can add widgets and edit their properties, order and appearance. You can also change the page name by clicking on the name shown on the top (after **Template management/**).

Once you are happy with your page, choose **Save** in the page management menu, and once back in the Template Management window you can now choose a template and add the page to it.

Once you are done creating and editing the templates and pages, choose **Close** from the top right corner.


## Sharing templates

It's possible to use custom templates and pages across different {{< param mgr_premium_title >}} installations by:

* copying necessary files (located in `/opt/cloudify-stage/userData/templates`) from one installation to another

or
 
* with use of snapshots (as all the templates created by the user are part of the snapshot)
