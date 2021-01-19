---
layout: bt_wiki
title: Cloudify Solution for VMware stack [ Vsphere, vCloud, NSX-T..]
category: Manager Architecture
draft: false
abstract: Cloudify Solution for VMware stack [ Vsphere, vCloud, NSX-T..]
weight: 500
aliases: /manager_architecture/create-deployment-flow/
---
 
# Cloudify Solution for VMware stack [ Vsphere, vCloud, NSX-T..]
Cloudify integration with VMware infrastructure is consistent with all other Cloudify cloud infrastructure environments. It is aimed not just as a means to automate the VMware environment resources (vSphere, vCloud, NSX-T)  but also to manage it in a consistent way with other cloud infrastructure supported by Cloudify. 
 
![vmware_stack]( /images/vmware_stack/vmware_stack.png )
 
* [vSphere plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/vsphere/) - maps the vSphere API into Cloudify DSL.
* [vCloud plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/vcloud/) - maps the vCLoud API into Cloudify DSL.
* [NSX-T plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/nsx-t/) - maps the NSX-T API into Cloudify DSL.
* [REST Plugin](https://docs.cloudify.co/latest/working_with/official_plugins/utilities/rest/) - provides generic mapping support to other services such as VRO, vRA etc.. etc through their REST API.
* [Catalog](https://docs.cloudify.co/latest/working_with/console/pages/cloudify-catalog-page/) - Enable simple and open provisioning of pre templatized services (similar to VRA).
* [Self Service Portal](https://docs.cloudify.co/latest/working_with/console/customization/) -  Provide a fully open and customizable portal framework that includes white-labeling (logo, schene), Custom Widget, JavaScript library, back-end support based on Cloudify clustering, security, user management, and RBAC, etc.

Combined with the rest of the [Cloudify Plugins](https://docs.cloudify.co/latest/working_with/official_plugins/) it allows users to unlock their VMware environment and provide simple integration with the best of breed DevOps and cloud-native ecosystem.

# Live Examples 
* [Cloudify example with vSphere and VRO](https://vimeo.com/448587029)
* [Cloudify example with vSphere and NSX-T](https://vimeo.com/457711864)
