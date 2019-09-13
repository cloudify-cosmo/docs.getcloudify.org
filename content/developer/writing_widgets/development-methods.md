---
layout: bt_wiki
title: Widget Development Methods
description: Different development methods available for widget creation.
category: Cloudify Console
draft: false
weight: 100
---

### Language

We write our widgets in JavaScript. They can be created using:

1. **ReactJS** is the recommended method and requires a build operation. 
You must use the build system described in [Building]({{< relref "developer/writing_widgets/development-methods.md#building" >}}) section.
Code must be compatible with [ReactJS](https://reactjs.org/) v16.x. ES6 is supported in that method.

2. **Plain JavaScript** enables you to attach an HTML template file. The callbacks for this method are described later in this topic. 
You must create a widget package yourself. No ES6 is supported in that method.

 
### Building

To ease widget building, you should use one of the following environments:

1. [Widget Development Environment](https://github.com/cloudify-cosmo/Cloudify-UI-Widget-boilerplate) - it's quick to set it up, but you'll have to upload your widget to Cloudify Manager after every code change.
2. [Cloudify Console Development Environment](https://github.com/cloudify-cosmo/cloudify-stage) - it takes more time to set it up, but once you have it configured, you won't need to upload your widget to Cloudify Manager after every change in widget's code, because building tools running in background would update it for you.  

You can find environment configuration description under above mentioned links. 