---
layout: bt_wiki
title: Labels Overrides
category: Console
draft: false
weight: 180
---

You can override a number of texts and labels used in {{< param cfy_console_name >}} by supplying a file containing replacements for default texts or labels.

To do that:

1. Create `/opt/cloudify-stage/dist/userData/overrides.json` file.

2. Go to [translations file](https://github.com/cloudify-cosmo/cloudify-stage/blob/{{< param version >}}-build/app/translations/en.json), 
   choose configurations parts to modify (you can omit all unmodified parts to use default values) and save them to 
   the created file. An example file content may look like:

```json
{
      "login": {
        "header": "WELCOME",
        "message": "Welcome to the Management Console, Please log in"
      },
      "pageTitle": "Management Console",
      "productName": "Any product name"
}
```

3. In the browser reload {{< param cfy_console_name >}} to see the changes.

{{% note %}}
When setting up a {{< param cfy_manager_name >}} Cluster, these changes should be applied to every 
{{< param cfy_manager_name >}} in the cluster.
{{% /note %}}
