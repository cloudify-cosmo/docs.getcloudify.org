---
layout: bt_wiki
title: The Nodes Page
category: Web Interface
draft: false
abstract: Nodes Page User Guide
weight: 150

---


# Overview
When clicking on the `Nodes` tab, you will be able to view all nodes that are related to a `Deployment`:

![Nodes Overview]({{ c.img("ui/ui-nodes-overview.png" ) }})

You can control which nodes are displayed by filtering by:

# Blueprints

![Blueprints]({{ c.img("ui/ui-nodes-blueprints-selection.png" ) }})

# Deployments

This list is affected by the selection of blueprints.<br/>
If the blueprints selection consists only of undeployed blueprints, this dropdown will not be visible.<br/>
Likewise, it will not include a deployment if the blueprint it is based on wasn't selected.<br/>
Not selecting any deployments is equivalent to selecting all deployments in the list.<br/>

![Deployments]({{ c.img("ui/ui-nodes-deployments-selection.png" ) }})

#### Types

![Types]({{ c.img("ui/ui-nodes-types-selection.png" ) }})

# Live update
This page is filtered live as you check/uncheck items in dropdowns.

![Show Results]({{ c.img("ui/ui-nodes-results.png" ) }})

# Search nodes
This page allows live search of nodes.<br>
As you type in the search box, the items in the nodes list will be updated to reflect the search criteria.

*Note, that all fields of the table are searched*

![Search]({{ c.img("ui/ui-nodes-search.png" ) }})

