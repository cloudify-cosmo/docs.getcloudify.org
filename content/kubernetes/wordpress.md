---
layout: bt_wiki
title: Kubernetes Wordpress Example
category: Kubernetes
draft: false
weight: 200

---
## Overview

The Cloudify Kubernetes Plugin Wordpress example demonstrates Cloudify Orchestrating the deployment of a Wordpress blog.

## Prerequisites

* A Kubernetes Cluster - Use the Kubernetes Provider to set up your Kubernetes Cluster
* Cloudify Kubernetes Plugin 2.2.0
* Secrets:
  * kubernetes_master_ip
  * kubernetes_master_port
  * kubernetes_token

## Installation

To install the Wordpress blueprint example from the Cloudify CLI:

{{< gsHighlight bash >}}
cfy install https://github.com/cloudify-incubator/cloudify-kubernetes-plugin/archive/2.2.1.zip --blueprint-filename examples/wordpress-blueprint.yaml --blueprint-id wordpress
{{< /gsHighlight >}}

## Review the installation

List the node-instance to see that the installation succeeded.

{{< gsHighlight  bash  >}}
$ cfy node-instances list -d wordpress
Listing instances for deployment wordpress...

Node-instances:
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|               id              | deployment_id | host_id |        node_id         |  state  | availability |  tenant_name   | created_by |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
|    kubernetes_master_0tyrlp   |   wordpress   |         |   kubernetes_master    | started |    tenant    | default_tenant |   admin    |
|       local_pv_1_n2vpd2       |   wordpress   |         |       local_pv_1       | started |    tenant    | default_tenant |   admin    |
|       local_pv_2_096d08       |   wordpress   |         |       local_pv_2       | started |    tenant    | default_tenant |   admin    |
|     mysql_pv_claim_zv4ef5     |   wordpress   |         |     mysql_pv_claim     | started |    tenant    | default_tenant |   admin    |
|    wordpress_deploy_9jlbyz    |   wordpress   |         |    wordpress_deploy    | started |    tenant    | default_tenant |   admin    |
| wordpress_mysql_deploy_o3ntox |   wordpress   |         | wordpress_mysql_deploy | started |    tenant    | default_tenant |   admin    |
|   wordpress_mysql_svc_gy9d4a  |   wordpress   |         |  wordpress_mysql_svc   | started |    tenant    | default_tenant |   admin    |
|      wordpress_svc_n7heyj     |   wordpress   |         |     wordpress_svc      | started |    tenant    | default_tenant |   admin    |
|       wp_pv_claim_qw9fmz      |   wordpress   |         |      wp_pv_claim       | started |    tenant    | default_tenant |   admin    |
+-------------------------------+---------------+---------+------------------------+---------+--------------+----------------+------------+
{{< /gsHighlight >}}

You can copy the node ID for your `wordpress_svc` node and get the runtime properties for it:

{{< gsHighlight  bash  >}}
$ cfy node-instances get wordpress_svc_n7heyj
Retrieving node instance wordpress_svc_n7heyj

Node-instance:
+----------------------+---------------+---------+---------------+---------+--------------+----------------+------------+
|          id          | deployment_id | host_id |    node_id    |  state  | availability |  tenant_name   | created_by |
+----------------------+---------------+---------+---------------+---------+--------------+----------------+------------+
| wordpress_svc_n7heyj |   wordpress   |         | wordpress_svc | started |    tenant    | default_tenant |   admin    |
+----------------------+---------------+---------+---------------+---------+--------------+----------------+------------+

Instance runtime properties:
  kubernetes: {'status': {'load_balancer': {'ingress': None}}, 'kind': 'Service', 'spec': {'cluster_ip': '10.110.128.65', 'publish_not_ready_addresses': None, 'external_i_ps': None, 'load_balancer_ip': None, 'external_name': None, 'session_affinity_config': None, 'load_balancer_source_ranges': None, 'selector': {'tier': 'frontend', 'app': 'wordpress'}, 'external_traffic_policy': 'Cluster', 'health_check_node_port': None, 'type': 'LoadBalancer', 'ports': [{'protocol': 'TCP', 'node_port': 30080, 'target_port': 80, 'port': 80, 'name': None}], 'session_affinity': 'None'}, 'api_version': 'v1', 'metadata': {'name': 'wordpress', 'owner_references': None, 'generation': None, 'namespace': 'default', 'labels': {'app': 'wordpress'}, 'generate_name': None, 'deletion_timestamp': None, 'cluster_name': None, 'finalizers': None, 'deletion_grace_period_seconds': None, 'initializers': None, 'self_link': '/api/v1/namespaces/default/services/wordpress', 'resource_version': '195210', 'creation_timestamp': '2018-03-26 08:22:19+00:00', 'annotations': None, 'uid': 'ccc4a0c3-30ce-11e8-9e16-065a1d79e428'}}

{{< /gsHighlight >}}

Take note of the `spec.cluster_ip` value.

## Update the installation

Now, you can update the installation. For example, try to expose the `wordpress_svc` on a different IP.

{{< gsHighlight bash >}}
$ cfy executions start update_resource_definition -d wordpress -vv -p resource_definition_changes="
{
  'metadata': {'resourceVersion': '0'},
  'spec': {
    'clusterIP': '10.110.97.242',
    'ports': [
        {'port': 80, 'nodePort': 30081}
    ]
  }
}" -p node_instance_id=wordpress_svc_8s2vq1
{{< /gsHighlight >}}

## Get the IP of the Wordpress Application

At any point, you can execute `cfy deployments outputs` to get the Load Balancer IP of the Wordpress service:

{{< gsHighlight bash >}}
cfy deployments outputs wordpress
Retrieving outputs for deployment wordpress...
 - "wordpress":
     Description: 
     Value: 10.10.5.155
{{< /gsHighlight >}}
