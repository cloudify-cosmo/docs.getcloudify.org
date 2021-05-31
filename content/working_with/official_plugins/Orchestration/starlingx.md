---
layout: bt_wiki
title: StarlingX Plugin
category: Official Plugins
draft: false
weight: 100
aliases:
    - /plugins/starlingx/
    - /developer/official_plugins/starlingx/
---

The StarlingX plugin enables you to discover StarlingX systems and manager resources on StarlingX systems.

Start out by providing the credentials for an existing StarlingX controller. The install workflow will gather information from the system controller.

Then execute the `discover_and_deploy` workflow. This workflow performs the following tasks:
  - Discover all subclouds that are managed by the system controller (parent).
  - Create a deployment group.
  - Create a deployment for each discovered subcloud. Add the subcloud deployment to the deployment group.
  - Execute batch install on the deployment group.


# Requirements

* Python versions:
  * 3.6.x

# Labels

The following are possible for a StarlingX system deployment:

  - `csys-obj-type`
  - `csys-env-type`
  - `csys-obj-parent`
  - `csys-location-name`
  - `csys-location-lat`
  - `csys-location-long`
  - `csys-wrcp-services`

# Node Types

## **cloudify.nodes.starlingx.WRCP**

This node represents a StarlingX System. A system can be a System Controller or a Subcloud.

**Properties**

  * `use_external_resource`: Always true. This parameters indicates that the resource already exists.

  * `client_config`: A dictionary containing the following keys:
    * `auth_url`: The StarlingX system endpoint, including the protocol, IP, port, and path, e.g. `https://172.20.0.1:5000/v3`.
    * `username`: The StarlingX username.
    * `api_key`: The StarlingX passport.
    * `project_name`: The client project name, default: `admin`.
    * `user_domain_name`: The client user domain name, default: `Default`.
    * `project_domain_name`: The client project domain name, default: `Default`.
    * `region_name`: The region name, either `RegionOne` for a system controller, or the subcloud name in the case that the system is a subcloud.
    * `insecure`: Whether to ignore certification validation when using `https` as the protocol..
    * `cacert`: The content of a Certificate Authority when using `https` as the protocol.

  * `resource_config`: Parameters that describe the system in the StarlingX API. Currently, there is no need to provide these parameters.

**Runtime Properties**:

  * `subclouds`: A dictionary of subclouds if the node is a system controller that has subclouds.
    * A key containing a number representing the subcloud number:
      * `external_id`: The number representing the subcloud number.
      * `name`: The subcloud name.
      * `description`: The subcloud descriptions.
      * `location`: The subcloud location, for example an address.
      * `group_id`: The subcloud's group ID.
      * `group_name`: The subcloud's group name.
      * `oam_floating_ip`: The IP of the subcloud.
      * `management_state`: The subcloud's management state.
  * `resource_config`:
    * `external_id`: The system's ID.
    * `name`: The system's name.
    * `description`: The system's description.
    * `location`: The system's location, for example an address.
    * `system_type`: The system type, for example, "all-in-one".
    * `system_mode`: The system mode, for example, "simplex".
    * `region_name`: The region name, for example "RegionOne", or if a subcloud, the subcloud name.
    * `latitude`: The latitude of the system.
    * `longitude`: The longitude of the system.
    * `distributed_cloud_role`: The distributed_cloud_role, for example "subcloud".
  * `hosts`:
    * A key containing an UUID representing the host ID.
      * `hostname`: The host's hostname.
      * `personality`: The host's personality, for example "controller".
      * `capabilities`: The host's capabilities.
      * `subfunctions`: The host's subfunctions.
  * `kube_clusters`: The API response for the system's kube_cluster object.
  * `k8s_cluster_name`: If the system has a Kubernetes cluster, the kube cluster's name.
  * `k8s_ip`: The IP of the Kubernetes cluster, if the system has one.
  * `k8s_service_account_token`: The service account token, if the system has a Kubernetes Cluster.
  * `k8s_cacert`: The Kubernetes Cluster certificate authority if the system has a Kubernetes Cluster.
  * `k8s_admin_client_cert`: The Kubernetes Cluster client certificate if the system has a Kubernetes Cluster.
  * `k8s_admin_client_key`: The Kubernetes Cluster client key if the system has a Kubernetes Cluster.
  * `openstack_ip`: The system's Openstack IP if it hosts an Openstack system.
  * `openstack_key`:  The system's Openstack key if it hosts an Openstack system.

**Workflows**

  * `discover_and_deploy`: Discover a System's subclouds and create deployments for all of the subclouds. One should use default values for all workflow parameters. The workflow will create a deployment group. It will then create deployments for all of the subclouds that are discovered. It will put all of the those subclouds in the group. It will then execute batch install on all of the subcloud deployments.
