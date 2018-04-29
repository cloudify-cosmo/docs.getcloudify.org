---
layout: bt_wiki
title: Blueprints Catalog Page
category: Web Interface
draft: false

weight: 125
---

The Blueprints Catalog widget retrieves data from Github repositories and presents it as a catalog.
![blueprints-catalog]( /images/ui/widgets/blueprints-catalog.png )

By default, the widget is configured to retrieve the Cloudify Blueprint examples from the `cloudify-examples` repository. You can change the repository from the widget's configuration by specifying the username for another open GitHub repository from which you want to retrieve data. You can also define filters for the data query in the **Optional blueprints filter** field, to retrieve only specific types of blueprints.
![configure-blueprints-catalog]( /images/ui/widgets/configure-blueprints-catalog.png )

You can configure the widget to display data in either catalog or table view. If the Github repository contains a `blueprint.png` file, then this file will appear as the icon of the blueprint in the catalog.


To initiate uploading a blueprint in the catalog to the current tenant in Cloudify Manager, click **Upload** on the required blueprint. The uploaded blueprint appears in the Local Blueprints page. 

