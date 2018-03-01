---
layout: bt_wiki
title: Dashboard Page
category: Web Interface
draft: false
abstract: Dashboard Page Reference
weight: 120
---

The Dashboard page is the landing page when you log into the Cloudify Web interface. 

By default, the page displays the most commonly used widgets, including the number of deployments, plugins and node instances that are being managed by this Cloudify Manager. In addition, other widgets provide an overview of the current and recent processes related to Cloudify Manager. The first widget is execution that by default present all the executions on cloudify manager but there a option to choose a specific blueprint or deployment and then the widget will present the execution for the relevant blueprint. The second widget is events/logs that present all the logs on cloudify manager. That widget is similar to the previous one by the option to choose one blueprint or deployment.


The widgets that appear on this page and their position on the page are fully customizable by an `admin` user, as with other pages.

If you are an `admin` user, you have the option of enabling other users to customize pages by toggling the **Configure** option in the dropdown menu adjacent to your user name.

![Delete blueprint]({{< img "manager/dashbord1.png" >}})
![Delete blueprint]({{< img "manager/dashbord2.png" >}})
s