---
layout: bt_wiki
title: Edit Mode
category: Console
draft: false
weight: 105
aliases: ["/manager_webui/configure-display/", "/working_with/console/configure-display/"]
---


{{< param cfy_console_name >}} pages are comprised of widgets.
Widgets are dynamic data units that show up to date information. They are grouped in containers. 
There are two types of containers: regular widget containers, which are sets of freely arranged widgets, and tab containers, which allow grouping widgets into switchable tabs.

You can select which widgets you want to see on each page, and configure the widgets.
Default pages provide views of the most commonly required data. You can delete these pages or add your own.


**Edit Mode** enables you to create new dashboard pages, add or remove widgets and manage how widgets are displayed on a page.

{{% note %}}
If you have a `user` role, your ability to create dashboard pages and manage widgets depends on the configuration permissions that have been set by the administrator.
{{% /note %}}


## Entering Edit Mode

Click the dropdown arrow next to your user name and select **Edit Mode**.

![Edit Mode - menu]( /images/ui/customization/edit-mode_menu.png )

{{% note %}}
If you do not see **Edit Mode** in the dropdown menu, you do not have permissions to edit configuration or add pages.
{{% /note %}}

Once in edit mode, a number of edit buttons appear on the screen:

* **Add/Insert Widgets Container**
* **Add/Insert Tabs Container**
* **Add Widget**
* **Add Page**
* **Add Page Group**
* **Exit**

See [Adding Widgets](#adding-widgets), [Working with tabs containers](#working-with-tabs-containers), [Adding Pages](#adding-pages) and [Adding Page Groups](#adding-page-groups) for details.

In addition, you can now move widgets already on the page by clicking on their title bar and dragging them to the preferred position inside their containers.
You can also remove them from the page by clicking the **X** in the upper right corner of the widget (visible when hovering over the widget's title bar), or open widget configuration window by clicking the gear icon ![Gear Icon]( /images/ui/icons/gear-icon.png ).

![Edit Mode - menu]( /images/ui/customization/edit-mode_overview.png )


## Configuring Widgets

Some widgets have configuration option that you can define or edit.

![Configure Widget dialog]( /images/ui/customization/configure-widget.png )

 1. In **Edit Mode**, hover over the title bar of the widget you want to configure and click the gear icon ![Gear Icon]( /images/ui/icons/gear-icon.png ).
 2. Make your required changes and click **Save**.   

The available fields are widget-specific.

{{% tip title="Tip" %}}
You can choose to display Blueprints Catalog widget contents as a table.
{{% /tip %}}


## Adding Widgets

A catalog of widgets is available to enable you to select your preferred data display on any page.

1. In **Edit Mode**, choose a desired container (or create a new one) and click **Add Widget**.   
   The **Add Widget** button is visible in all containers when you are in **Edit Mode**.  
2. Select the widget that you want to add and click **Add selected widgets**.   
   You can enter free text in the search box to find a widget.

![Edit Mode - Add widget modal]( /images/ui/customization/edit-mode_add-widget-modal.png )

{{% tip title="Tip" %}}
Click on widget thumbnail to see it full-sized.
{{% /tip %}}

The widget appears on the page. You can drag and drop it in the position that you prefer.
You can resize a widget while holding the resize icon in the lower right corner of the widget.

To delete a widget, click the **X** icon in the top right corner of the widget.


## Working with tabs containers


1. Enter the **Edit Mode**
2. If not already present add a new tabs container by clicking **Add/Insert Tabs Container**  
3. By default a newly created tabs container has 2 empty tabs 


![Edit Mode - Add widget modal]( /images/ui/customization/edit-mode_tabs.png )

You can add a new tab with the **+** icon and remove a tab using the **X** icon nearby the unwanted tab.
You can change the name of the tab by clicking edit icon and filling the input field in the modal window.
In that modal window you can also change the default tab (the one that will be active by default when entering the page).


## Adding Pages

1. In **Edit Mode**, click **Add Page** in the sidebar.
2. Click the Page title at the top of the page and enter a new title for the page. You can also hover the page name in the sidebar and click the edit icon ![Edit icon]( /images/ui/icons/edit-icon.png ) to change the name.
3. (Optional) Provide a description for the page at the top, below the title.
4. (Optional) Set custom icon for the page by clicking the icon prior to the page name and selecting an icon from a dropdown.
5. Add your preferred widgets for the page.   
   For more information, see *Adding Widgets* above.


## Adding Page Groups

1. In **Edit Mode**, click **Add Page Group** in the sidebar.
2. Hover the page group name in the sidebar and click the edit icon ![Edit icon]( /images/ui/icons/edit-icon.png ) to change the name.
3. (Optional) Set custom icon for the page group by clicking the icon prior to the page group name and selecting an icon from a dropdown.
4. In the sidebar drag the pages to add them to/remove them from the group.
