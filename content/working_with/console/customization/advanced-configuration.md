---
layout: bt_wiki
title: Advanced Configuration
category: Cloudify Console
draft: false
abstract: Advanced Configuration of Cloudify Console
weight: 170
aliases: ["/working_with/console/advanced-configuration/"]
---

You can configure more advanced customization of {{< param cfy_console_name >}} by modifing user configuration file residing on Cloudify Manager machine.

To do that:

1. Copy `/opt/cloudify-stage/conf/userConfig.json` file to `/opt/cloudify-stage/dist/userData/userConfig.json`.
1. Apply modifications (optionally remove all not modified parts). 
1. Restart {{< param cfy_console_name >}} service on Cloudify Manager machine by executing: `sudo service cloudify-stage.service restart`.

Check out the following links to get more information:

 * [User configuration file format](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/userConfig.json)
 * [User configuration file description](https://github.com/cloudify-cosmo/cloudify-stage/blob/master/conf/README.md#user-userconfigjson) 
