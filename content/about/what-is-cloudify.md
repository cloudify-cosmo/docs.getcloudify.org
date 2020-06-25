---
layout: bt_wiki
title: What Is Cloudify?
category: Introduction
draft: false
weight: 100
aliases: /intro/what-is-cloudify/
---

Cloudify is an open source cloud orchestration framework. Cloudify enables you to model applications and services and automate their entire life cycle, including deployment on any cloud or data center environment, monitoring all aspects of a deployed application, detecting issues and failure, manually or automatically remediating such issues, and performing ongoing maintenance tasks.

* **Application Modeling**  
  Application modeling enables you to describe an application, with all its resources (infrastructure, middleware, application code, scripts, tool configuration, metrics, and logs), in a generic, descriptive manner. The Cloudify DSL is based on TOSCA.<br>
* **Orchestration**  
  Orchestration enables you to maintain and run your application. In addition to instantiation, you can perform ongoing operations such as scaling, healing and maintenance.<br>
* **Pluggability**  
  Pluggability is one of the core, unique features of Cloudify. It provides reusable components abstraction for the system.  <br>
  You can model anything that you want in a descriptive language, for example IaaS, clouds, configuration management tools, SDN components, NFV components, and so on.  <br>
  Cloudify includes a number of officially supported out-of-the-box plugins, but you can also build your own.<br>
* **Security**  
  Security, in the context of a Cloudify Manager, means securing communication with the Cloudify Manager and controlling who has permissions to use it to execute various operations. <br>
  Secured communication is achieved using SSL, which enables clients to validate the authenticity of the Cloudify Manager, and to ensure that the data sent to and from it is encrypted.

  For information about Cloudify architecture, [click here]({{< relref "about/manager_architecture/_index.md" >}})
