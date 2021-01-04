---
layout: bt_wiki
title: User Configuration
category: Console
draft: false
weight: 170
aliases: ["/working_with/console/advanced-configuration/"]
---

You can configure more advanced features of {{< param cfy_console_name >}}, including:

* layout changes (style, fonts, etc.)
* allowed external libraries to be used in custom widgets
* access details to maps repositories

by modifying a user configuration file residing on the {{< param cfy_manager_name >}}.


To do that:

1. Copy `/opt/cloudify-stage/conf/userConfig.json` file to `/opt/cloudify-stage/dist/userData/userConfig.json`.
1. Apply modifications (you can remove all not modified parts to use default values).
1. Restart {{< param cfy_console_name >}} service on the {{< param cfy_manager_name >}} machine by executing: `sudo service cloudify-stage.service restart`.

{{% note %}}
When setting up a {{< param cfy_manager_name >}} Cluster, these changes should be applied to every {{< param cfy_manager_name >}} in the cluster.
{{% /note %}}

Check out the following links to get more information on the available parameters:

 * [User configuration file format](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/userConfig.json)
 * [User configuration file description](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/README.md#user-userconfigjson)
