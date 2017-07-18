---
layout: bt_wiki
title: Configuring the Web Interface Display
category: Web Interface
draft: false
abstract: Configuring the Web Interface Display Reference
weight: 105
---

Cloudify Web interface pages are comprised of widgets. Widgets are dynamic data units that show up to date information.<br>
You can select which widgets you want to see on each page, and can configure the widgets.

Default pages provide views of the most commonly required data. With the exception of the Dashboard page, you can delete these pages or add your own.

**Sorting Data**<br>
You can sort data in table-style widgets by clicking on a column header. 

**Viewing Additional Data**<br>
You can click on data in most widgets, to drill down to additional context-sensitive information.

## Configuration Processes

This section provides information about the following processes:

* Adding widgets
* Configuring widgets
* Adding pages

### Opening Edit Mode

To make configuration changes, you must enter Edit mode. <br>
Click the dropdown arrow next to your user name and select **Edit Mode**. If you do not see Edit mode in the dropdown menu, you do not have permissions to edit configuration or add pages.<br>

When you have entered Edit mode, the **Add Widget** button appears below your user name. In addition, you can now move widgets already on the page by clicking on their title bar and dragging them to the preferred position. You can also remove them from the page by clicking the **X** in the right corner of the widget (visible when hovering over the widget's title bar), or click the widget configuration button.

### Adding Widgets

A catalog of widgets is available to enable you to select your preferred data display on any page.

1. In Edit mode, click **Add Widget**.   
   The **Add Widget** button is visible on all pages when you are in Edit mode.
2. Select the widget that you want to add and click **Add**.   
   You can enter free text in the search box to find a widget.

 The widget appears on the page. You can drag and drop it in the position that you prefer. You can resize a widget while holding the resize icon in the lower right corner of the widget.

 * To delete a widget, click the **x** icon in the top right corner of the widget.

### Configuring Widgets

Some widgets have configuration option that you can define or edit.<br>
![Configure Widget dialog]({{<img "ui/configure-display/configure-widget.png">}})

 1. In Edit mode, hover over the title bar of the widget you want to configure and click the gear icon ![Gear Icon]({{<img "ui/gear-icon.png">}}).
 2. Make your required changes and click **Save**.   
    The available fields are widget-specific.

{{% gsTip title="Tip" %}}
You can choose to display catalog widget contents as a table.
{{% /gsTip %}}    

### Adding Pages

1. In Edit mode, click **Add Page** at the bottom of the pages list in the left column.
2. Click the Page number field at the top of the page and enter a new title for the page.
3. (Optional) Provide a description for the page.
4. Add your preferred widgets for the page.   
   For more information, see *Adding Widgets* above.


