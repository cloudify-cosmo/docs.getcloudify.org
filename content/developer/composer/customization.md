---
layout: bt_wiki
title: Customization
category: Composer
draft: false
weight: 600
userdata_path: "/opt/cloudify-composer/backend/dev"
config_path: "/opt/cloudify-composer/backend/conf"
---

{{< param cfy_composer_name >}} application provides basic support for customizing the layout.
Main features are:

* adding custom logo and setting main application color
* styling the HTML elements
* changing text labels 

When introducing changes described in this page you should be aware that: 

* to see the applied changes you need to restart {{< param cfy_composer_name >}} 
service on the {{< param cfy_manager_name >}} machine by executing: 
```shell script
sudo service cloudify-composer.service restart
```
* in {{< param cfy_manager_name >}} Cluster environment, 
these changes should be applied to every {{< param cfy_manager_name >}} in the cluster


## Theme setup

{{< param cfy_composer_name >}} provides a way to introduce basic theme changes 
(eg. logo URL, main color, header text color) through user configuration file 
residing on the {{< param cfy_manager_name >}}.

To setup theme create `userConfig.json` file in `{{< field "userdata_path" >}}` directory.

All available configuration parameters are described in
`{{< field "config_path" >}}/README.md` file.

Default values of the configuration parameters can be found in
`{{< field "config_path" >}}/userConfig.json` file.

An example file content may look like:
```json
    {
        "theme": {
            "logoUrl": "/composer/backend/userData/static/logo.png",
            "mainColor": "grey"
        }
    }
```

In the example above, `logo.png` should be placed in `{{< field "userdata_path" >}}/static` directory.
 
 
## Style changes 

You can change the styling of HTML elements by supplying custom CSS file.

To do that create `{{< field "userdata_path" >}}/style.css` file.

An example file content may look like:
```css
    .ui.primary.button {
        background-color: grey !important;
    }
```

You can add static files (eg. fonts, images) to `{{< field "userdata_path" >}}/static` directory. 
For example, if you add `image.png` file and would like to make it a background image, 
you can modify your `style.css` this way:
```css
    .ui.primary.button {
        background-image: url("/composer/backend/userData/static/image.png");
    }
```


## Labels overrides

You can override a number of texts and labels used in {{< param cfy_composer_name >}} by supplying a file containing replacements for default texts or labels.

To do that create `{{< field "userdata_path" >}}/overrides.json` file.

An example file content may look like:
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
