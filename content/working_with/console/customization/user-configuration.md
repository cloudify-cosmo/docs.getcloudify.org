---
layout: bt_wiki
title: User Configuration
category: Console
draft: false
weight: 170
aliases: ["/working_with/console/advanced-configuration/"]
---

You can configure more advanced features of {{< param cfy_console_name >}}, including:

* layout changes (logo, style, fonts, etc.)
* allowed external libraries to be used in custom widgets
* access details to maps repositories

Check out the following links to get more information on the available parameters:

* [User configuration file format](https://github.com/cloudify-cosmo/cloudify-stage/blob/{{< param version >}}-build/conf/userConfig.json)
* [User configuration file description](https://github.com/cloudify-cosmo/cloudify-stage/blob/{{< param version >}}-build/conf/README.md#user-userconfigjson)

## Customizing user configuration 

To customize user configuration file residing on the {{< param cfy_manager_name >}} do the following in your {{< param cfy_manager_name >}} VM:

1. Copy `/opt/cloudify-stage/conf/userConfig.json` file to `/opt/cloudify-stage/dist/userData/userConfig.json`.
2. Apply modifications (you can remove all not modified parts to use default values). 
   See [Changing logo](#changing-logo) or [Changing styling](#changing-styling) sections for details.
3. Restart {{< param cfy_console_name >}} service on the {{< param cfy_manager_name >}} machine 
   by executing: `sudo supervisorctl restart cloudify-stage`.

{{% note %}}
When setting up a {{< param cfy_manager_name >}} Cluster, these changes should be applied to every {{< param cfy_manager_name >}} in the cluster.
{{% /note %}}

### Changing logo

To change product logo, do the following:

1. Copy your logo image file (`logo.png`) to `/opt/cloudify-stage/dist/static/images` directory
2. In `/opt/cloudify-stage/dist/userData/userConfig.json` set `logoUrl` to `/console/static/images/logo.png`
3. Restart {{< param cfy_console_name >}} service to test changes
   (see [Customizing user configuration](#customizing-user-configuration))

### Changing styling 

To apply custom CSS stylesheet, do the following:

1. Create your custom CSS file (`style.css`)
2. Copy `style.css` file to `/opt/cloudify-stage/dist/userData` directory
3. In `/opt/cloudify-stage/dist/userData/userConfig.json` set `customCssPath` to `style.css`
4. Restart {{< param cfy_console_name >}} service to test changes
   (see [Customizing user configuration](#customizing-user-configuration)) 
