---
layout: bt_wiki
title: Cloudify Solution for the VMware stack
category: Manager Architecture
draft: false
abstract: Cloudify Solution for the VMware stack
weight: 500
aliases: /manager_architecture/create-deployment-flow/
---
 
# {{< param product_name >}} Solution for the VMware stack
{{< param product_name >}}'s integration with the VMware infrastructure is consistent with all other {{< param product_name >}} cloud infrastructure environments. It is aimed not just as a means to automate the VMware environment resources (such as vSphere, vCloud, NSX-T)  but also to manage it in a consistent way with other cloud infrastructure supported by {{< param product_name >}}. 
 
![vmware_stack]( /images/vmware_stack/vmware_stack.png )
 
 To achieve this, {{< param product_name >}} provides the following features and interfaces:
 
 
* [vSphere plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/vsphere/) - maps the vSphere API into the {{< param product_name >}} DSL.
* [vCloud plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/vcloud/) - maps the vCLoud API into the {{< param product_name >}} DSL.
* [NSX-T plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/nsx-t/) - maps the NSX-T API into the {{< param product_name >}} DSL.
* [REST Plugin](https://docs.cloudify.co/latest/working_with/official_plugins/utilities/rest/) - provides generic mapping support to other services such as VRO, vRA, etc. through their REST API.
* [Catalog](https://docs.cloudify.co/latest/working_with/console/pages/cloudify-catalog-page/) - Enable simple and open provisioning of pre templatized services (similar to VRA).
* [Self Service Portal](https://docs.cloudify.co/latest/working_with/console/customization/) -  Provide a fully open and customizable portal framework that includes white-labeling (logo, skin), Custom Widgets, JavaScript library, back-end support based on {{< param product_name >}} clustering, security, user management, and RBAC.

Combined with the rest of the [{{< param product_name >}} Plugins](https://docs.cloudify.co/latest/working_with/official_plugins/) it allows users to unlock their VMware environment and provide simple integration with the best of breed DevOps and cloud-native ecosystem.

# Live Examples 
* [vSphere and VRO](https://vimeo.com/448587029)
* [vSphere and NSX-T](https://vimeo.com/457711864)
