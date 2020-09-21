---
layout: bt_wiki
title: User Configuration
category: Cloudify Console
draft: false
weight: 170
aliases: ["/working_with/console/advanced-configuration/"]
---

You can configure more advanced features of {{< param cfy_console_name >}}, including:

* layout changes (style, fonts, etc.)
* allowed external libraries to be used in custom widgets
* access details to maps repositories

by modifying user configuration file residing on Cloudify VM.


To do that:

1. Copy `/opt/cloudify-stage/conf/userConfig.json` file to `/opt/cloudify-stage/dist/userData/userConfig.json`.
1. Apply modifications (you can remove all not modified parts to use default values). 
1. Restart {{< param cfy_console_name >}} service on Cloudify Manager machine by executing: `sudo service cloudify-stage.service restart`.

{{% note %}}
When setting up a Cloudify Management Cluster, these changes should be applied to every Cloudify Manager in the cluster.
{{% /note %}}

Check out the following links to get more information what are the available parameters:

 * [User configuration file format](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/userConfig.json)
 * [User configuration file description](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/README.md#user-userconfigjson) 
