---
title: Cloudify Composer
description: Building and Viewing Graphical Blueprints
weight: 50
alwaysopen: false
aliases: /composer/overview/
---

{{< param cfy_composer_name >}} is an editor for creating Blueprint YAML files dynamically, using a drag and drop interface. It enables you to model topology for complex applications, and to add relevant lifecycle operations implementation by importing plugins and scripts, or packaging them with the blueprint itself. 

Among its drag-and-drop components are platform and network items such as `compute` node, `database`, `web server`, and so on. You can also add your own custom node type components, custom plugins and interfaces. 

The generated output from {{< param cfy_composer_name >}} is a downloadable TGZ or ZIP archive containing a blueprint.yaml *file* that provides a TOSCA-based description for the application topology and its lifecycle management. In addition to YAML artifacts, the blueprint archive includes a blueprint *package* that contains multiple resources such as configuration and installation scripts, code, and basically any other resource you require for running your application.

{{%children style="h2" description="true"%}}

