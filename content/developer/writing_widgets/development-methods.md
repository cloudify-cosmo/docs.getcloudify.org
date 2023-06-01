---
title: Widget Development Methods
description: Different development methods available for widget creation.
category: Console
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

To ease widget building, you should use 
[{{< param cfy_console_name >}} Development Environment](https://github.com/cloudify-cosmo/cloudify-stage). 

Once you setup the project, check **Custom widgets** section in 
[widgets README file](https://github.com/cloudify-cosmo/cloudify-stage/tree/master/widgets#readme) 
to learn more about how to create, build and test your widget.   
