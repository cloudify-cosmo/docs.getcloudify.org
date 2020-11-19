---
layout: bt_wiki
title: Widget Development Methods
description: Different development methods available for widget creation.
category: Cloudify Console
draft: false
weight: 100
---

## Language

We write our widgets in JavaScript. Rendering part of the widget definition can be created using:

1. **ReactJS** - this is the recommended method and requires to create JS bundle file (you must use the build system described in Building section below). Code must be compatible with [ReactJS](https://reactjs.org/) v16.x.

2. **Plain JavaScript** - enables you to write pure JS code and optionally attach an HTML template file.

See render function in [Widget Definition]({{< relref "developer/writing_widgets/widget-definition.md" >}}) page for details
about how to use those methods.


## Building

To ease widget building, you should use one of the following environments:

1. [Widget Development Environment](https://github.com/cloudify-cosmo/Cloudify-UI-Widget-boilerplate) - it's quick to set it up, but you'll have to upload your widget to the {{< param cfy_manager_name >}} after every code change.
2. [{{< param cfy_console_name >}} Development Environment](https://github.com/cloudify-cosmo/cloudify-stage) - it takes more time to set it up, but once you have it configured, you won't need to upload your widget to the {{< param cfy_manager_name >}} after every change in widget's code, because building tools running in background would update it for you.  

You can find environment configuration description under above mentioned links.
