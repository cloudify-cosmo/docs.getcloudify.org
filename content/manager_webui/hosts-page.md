---
layout: bt_wiki
title: The Hosts Page
category: Web Interface
draft: false
abstract: Hosts Page Reference
weight: 150

terminology_link: reference-terminology.html
---
{{% gsSummary %}}{{% /gsSummary %}}

# Overview
When clicking on the `Hosts` tab, you will be able to view all the hosts that are related to a `Deployment`:<br/>
![Hosts Overview]({{<img "ui/ui-hosts-overview.png">}})


You can control which hosts are displayed by filtering by:

# Blueprints
See the definition [here](/reference-terminology#blueprint).<br/>
![Blueprints]({{<img "ui/ui-hosts-blueprints-selection.png">}})

# Deployments
See the definition [here]({{page.terminology_link}}#deployment).<br/>
This list is affected by the selection of blueprints. <br/>
If the blueprints selection consists only of undeployed blueprints, this dropdown will not be visible.<br/>
Likewise, it will not include a deployment if the blueprint it is based on wasn't selected.<br/>
Not selecting any deployments is equivalent to selecting all deployments in the list.<br/>
![Deployments]({{<img "ui/ui-hosts-deployments-selection.png">}})

# Applying the filter
This page is not filtered live. You should click on the `Show` button to apply the filter.<br/>
![Show]({{<img "ui/ui-hosts-show.png">}})

And the filter results is displayed
![Show Results]({{<img "ui/ui-hosts-show-results.png">}})

# Search hosts
This page allows live search of the hosts list.<br/>
As you type in the search box, the items in the hosts list will be updated to reflect the search criteria.<br/>
*Note, that all fields of the table are searched*
![Search]({{<img "ui/ui-hosts-search.png">}})

