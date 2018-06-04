---
layout: bt_wiki
title: Nodes Page
category: Cloudify Console
draft: true
abstract:
weight: 150

---


The `Nodes` page displays a list of all the nodes that are related to a `Deployment`.

![Nodes Overview]( /images/ui/ui-nodes-overview.png )

##Filtering Data
You can filter the nodes data in the table by:

* Deployed Blueprint
* Deployments
* Types
* Free text search

You can use more than one filter to focus your view. The page updates dynamically as you make your selections.

**To filter `Deployed Blueprints`, `Deployments`, and `Types`**<br>
Select one or more items from the relevant dropdown list.<br>
* The `Deployments` list is affected by the selections that you make in the `Deployed Blueprints` list. If the `Deployed Blueprints` selection consists only of undeployed blueprints, the `Deployments` list is not displayed. If the blueprint on which a deployment is based is not selected in the `Deployed Blueprints` list, that deployment will not appear in the `Deployments` list. If you do not select any deployments, it is equivalent to selecting all deployments in the list.

**To filter by free text**<br>
You can free type text in the **Free Text** field. The displayed data automatically changes to match the filter. All fields in the table are included in the free text search.<br/>

