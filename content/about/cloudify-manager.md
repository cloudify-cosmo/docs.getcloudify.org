---
title: Cloudify Manager
category: Introduction
draft: false
weight: 200
aliases: /intro/cloudify-manager/
---

{{< param product_name >}} enables you to deploy applications using two main methods:

* Using the {{< param cfy_cli_name >}}
* Using the {{< param cfy_console_name >}}

The {{< param cfy_manager_name >}} is a dedicated environment comprising an open-source stack that enables you to:

* Utilize plugins (such as Docker, Script, Chef, and Puppet plugins) to manage application hosts
* Keep a directory of your blueprints
* Create multiple deployments for each blueprint and install them
* Execute healing, scaling, and other custom workflows on your installed applications
* Run multiple workflows concurrently
* View an application's topology and perform different tasks using the {{< param cfy_console_name >}}
* View metrics
* Search logs

In addition, the {{< param cfy_manager_name >}}:

* Provides a secure environment for managing applications via multiple authentication mechanisms and customizable authorization
* Retains a history of metrics and events
* Manages agents running on an application's host machines

Although you can use {{< param product_name >}} to provision resources directly from the CLI, use {{< cfy_manager_name >}} to manage production-level applications.

For more information about {{< cfy_manager_name >}}, see the {{< cfy_manager_name >}} section later in this user's guide.
