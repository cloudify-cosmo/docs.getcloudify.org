---
layout: bt_wiki
title: Customization
category: Composer
draft: false
weight: 600
---

{{< param cfy_composer_name >}} application provides basic support for customizing the layout.
The main features are:

* adding custom logo and setting main application color
* styling the HTML elements
* changing text labels 

When introducing changes described in this page you should be aware that: 

* To see the applied changes you need to restart {{< param cfy_composer_name >}} 
service on the {{< param cfy_manager_name >}} machine by executing: 
```shell script
sudo service cloudify-composer.service restart
```
* In {{< param cfy_manager_name >}} Cluster environment, 
these changes should be applied to every {{< param cfy_manager_name >}} in the cluster


## Theme setup

{{< param cfy_composer_name >}} provides a way to introduce basic theme changes 
(eg. logo URL, main color, header text color) through user configuration file 
residing on the {{< param cfy_manager_name >}}.

To setup theme:

1. Create `userConfig.json` file in `/opt/cloudify-composer/backend/dev` directory.

1. An example file content may look like:
```json
    {
        "theme": {
            "logoUrl": "/composer/backend/userData/static/logo.png",
            "mainColor": "grey"
        }
    }
```

Default configuration file is available at
`/opt/cloudify-composer/backend/conf/userConfig.json`.

All parameters description is available in 
`/opt/cloudify-composer/backend/conf/README.md` file.
 
 
## Style changes 

You can change the styling of HTML elements by supplying custom CSS file.

To do that:

1. Create `/opt/cloudify-composer/backend/dev/style.css` file.

1. An example file content may look like:
```css
    .ui.primary.button {
        background-color: grey !important;
    }
```


## Labels overrides

You can override a number of texts and labels used in {{< param cfy_console_name >}} by supplying a file containing replacements for default texts or labels.

To do that:

1. Create `/opt/cloudify-composer/backend/dev/overrides.json` file.

1. An example file content may look like:
```json
    {
        "composer" : {
            "title": "Cloudify Composer",
            "header": {
                "documentationLink": "http://docs.mycompany.com/composer"
            }
        }
    }
```
