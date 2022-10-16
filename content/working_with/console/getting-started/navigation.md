---
title: Navigation
category: Console
description: Learn what you can see on the screen and how to navigate in the application.
weight: 20
alwaysopen: false
---

In this section you can find general overview on how to navigate in {{< param cfy_console_name >}}.  

![Dashboard page]( /images/ui/pages/dashboard-page.png )

## Left sidebar

The left side of the screen is occupied by a sidebar. The sidebar consist of three sections.

### Header

The topmost section of the sidebar is a header presenting main information about the product. The following elements are presented:

* **Logo**
* **Product name**
* **Product version** - only major an minor digits are presented
* **License status** - on click you are redirected to License Management page. See [License Management]({{< relref "cloudify_manager/premium/aio/install_and_configure/activate.md" >}}) page for more details.

{{% note %}}
You can customize top header bar using white-labelling feature described in [User Configuration]({{< relref "working_with/console/customization/user-configuration.md" >}}).
{{% /note %}}

### Page menu

The **Page menu** is located below the header. The menu shows the available pages. The top level of the menu lists individual page items as well as page groups.

Clicking on the name of the page changes the view.

Clicking on a page group expands the group and reveals list of the pages contained in it.

{{% note %}}
List of available pages can differ between admin and non-admin users.
{{% /note %}}

Detailed description of pages content can be found at [Pages]({{< relref "working_with/console/pages/_index.md" >}}) page.

### System menu

System menu occupies bottom part of the sidebar. It consists of the following elements:

* **Tenants menu** - click the current tenant name to open dropdown selection menu and change the current tenant
* **Help menu** - click the ![Help icon]( /images/ui/icons/help-icon.png ) to open menu with links to support pages
* **System health** - click this option to see more detailed information about system services
* **User menu** - click the username to enter [Edit Mode]({{< relref "working_with/console/customization/edit-mode.md" >}}), open [Template Management]({{< relref "working_with/console/customization/templates-mgmt.md" >}}) or [License Management]({{< relref "cloudify_manager/premium/aio/install_and_configure/activate.md" >}}), change password or log out

{{% note %}}
Set of the available options can differ between admin and non-admin users. The list above presents all the options available for admins.
{{% /note %}}
