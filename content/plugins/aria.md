---
layout: bt_wiki
title: ARIA Plugin
category: Plugins
draft: false
weight: 100
---
{{% gsSummary %}} {{% /gsSummary %}}

The ARIA plugin enables to use TOCSA-based service templates for deploying services and applications.



# Plugin Requirements

* Python version 2.7.x


# Compatibility


This version of Cloudify is only compatible with ARIA Plugin version 1.0. 

The ARIA plugin uses ARIA version 0.1.1.



      

# Terminology
* **Service-Template** - A TOSCA equivalent to Cloudify's blueprint concept. 
For additional info please refer to the TOSCA [spec](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725224).  
* **Service** - A TOSCA equivaltent to Cloudify's deployment concept. An 
instance of the Service-template, where all [requirements and capabilities](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725207) 
were satisfied and transformed into relationships. 
* **CSAR** - Cloud Service Archive. An archive file which holds the 
service template (and any of its artifacts) and the meta data. For additional
 info please refer to the TOSCA [spec](http://docs.oasis-open.org/tosca/TOSCA-Simple-Profile-YAML/v1.0/os/TOSCA-Simple-Profile-YAML-v1.0-os.html#_Toc471725246)

# Types

This section describes the [node type]({{< relref "blueprints/spec-node-types.md" >}}) definitions. Nodes describe resources in your Cloud infrastructure. For more information, see [node type]({{< relref "blueprints/spec-node-types.md" >}}).


# Relationships

See the [relationships]({{< relref "blueprints/spec-relationships.md" >}}) section.

# Examples
