---
layout: bt_wiki
title: A Guide To Cloudify Container Support For Kubernetes And Docker
category: Plugins
draft: false
weight: 1450
---

## Overview


Cloudify supports integrations with Docker and Docker-based container managers, such as Kubernetes. When orchestrating container orchestrators, Cloudify focuses on the infrastructure layer, managing lifecycle events between the container and the non-container worlds.


### Infrastructure Orchestration


Cloudify can be used to deploy, heal, scale, and tear down container clusters.

Cloudify can orchestrate bare metal, virtual platforms, such as Libvirt and Vsphere, and cloud platforms, such as AWS, Openstack, Azure, GCP, etc. This can include networking and storage infrastructure, both virtual and physical.


#### Cloudify Kubernetes Provider


Kubernetes manages IaaS-resource provisioning via Cloud Providers. The [Cloudify Kubernetes Provider](https://github.com/cloudify-incubator/cloudify-kubernetes-provider) enables Kubernetes to use Cloudify as the Iaas. This enables a single cluster to span a number of topologies. For example a Kubernetes cluster may contain Nodes any number of various cabilities, including multiple clouds.


Requirements:


* Cloudify 4.2 or above.
* Environment secrets (credentials, required resource IDs).
* cloudify-kubernetes-plugin, version 1.3.1.
* cloudify-utilities-plugin, version 1.4.1.
* One of the following:
  - cloudify-aws-plugin, version 1.5.1.2.
  - cloudify-openstack-plugin, version 2.4.1.1.
  - cloudify-azure-plugin, version 1.4.3.
  - cloudify-gcp-plugin, version 1.1.0.
  - cloudify-vsphere-plugin, version 2.3.0.


**Setup:**

* If you have not already setup your Cloudify Manager, follow [these instructions](https://github.com/cloudify-examples/cloudify-environment-setup/blob/latest/README.md).

* Create null secrets:

```shell
for i in kubernetes_master_ip \
         kubernetes_certificate_authority_data \
         kubernetes_master_port \
         kubernetes-admin_client_key_data \
         kubernetes-admin_client_certificate_data;
do cfy secrets create -s null $i;
done
```

* Find the [latest release](https://github.com/cloudify-incubator/cloudify-kubernetes-provider/releases) of the Provider. Save the URL of the source code in zip format, as well as the URLs of the Cloudify Provider Binaries (`cfy-kubernetes`, and `cfy-autoscale`).

* Download the zip source code:

```shell
wget https://github.com/cloudify-incubator/cloudify-kubernetes-provider/archive/0.0.0%2B12.zip
```

* Unzip the zip archive of the source code:

```shell
unzip 0.0.0%2B12.zip
```

* Download the Cloudify Kubernetes Provider Binaries to the `examples/cluster_blueprint/resources` directory:

```shell
wget https://github.com/cloudify-incubator/cloudify-kubernetes-provider/releases/download/0.0.0%2B12/cfy-kubernetes cloudify-kubernetes-provider-0.0.0%2B12/examples/cluster_blueprint/resources/
```

```shell
wget https://github.com/cloudify-incubator/cloudify-kubernetes-provider/releases/download/0.0.0%2B12/cfy-autoscale cloudify-kubernetes-provider-0.0.0%2B12/examples/cluster_blueprint/resources/
```

__Note: At this point, you are ready to deploy your cluster. Note that by default the number of Kubernetes Nodes to be deployed, in addition to the master Node, is `1`. To change that, toggle the "kubernetes_node_vms_scaling_policy" `default_instances` in your IaaS blueprint.__

* Deploy the cluster:

```shell
cfy install cloudify-kubernetes-provider-0.0.0%2B12/examples/cluster_blueprint/openstack.yaml
```

__Note: The cluster blueprint IaaS examples cover Vsphere, GCP, Azure, Openstack, and AWS. Get in touch to learn about support for other platforms.__


At this point, if you execute `cfy secrets get kubernetes_master_ip`, you will see the IP of your Kubernetes Master.


### Service Orchestration


Independently from the orchestration of infrastructure, Cloudify provides the ability to orchestrate heterogenous services across platforms. By leveraging the strength of TOSCA modeling, Cloudify can manage the instantiation and configuration of service chains, regardless of the target platform. 


#### Cloudify Kubernetes Plugin


The Cloudify Kubernetes Plugin enables you to interact with the Kubernetes API through blueprints.

Kubernetes manifests can be packages with your blueprint via Cloudify node templates. Include the manifest file in a resources directory, or include the text of the manifest inline.

**Examples:**

Referencing a manifest file in a node template:

```yaml
  my_pod:
    type: cloudify.kubernetes.resources.FileDefinedResource
    properties:
      file:
        resource_path: resources/pod.yaml
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master
```

Referencing multiple manifest files in one node template:

```yaml
  my_kubernetes_application:
    type: cloudify.kubernetes.resources.MultipleFileDefinedResources
    properties:
      files:
        - resource_path: resources/pod.yaml
        - resource_path: resources/service.yaml
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master
```

Using an inline manifest:

```yaml
  nginx_service:
    type: cloudify.kubernetes.resources.Service
    properties:
      definition:
        apiVersion: v1
        kind: Service
        metadata:
          labels:
            app: nginx
          name: nginx
        spec:
          ports:
            - port: { get_input: nginx_port }
          selector:
            app: nginx
            tier: frontend
          type: LoadBalancer
    relationships:
      - type: cloudify.kubernetes.relationships.managed_by_master
        target: kubernetes_master
      - type: cloudify.relationships.depends_on
        target: nginx_deployment
```

__Note: See the [Kubernetes Plugin docs]({{< relref "plugins/kubernetes.md" >}}) for more information on the plugin.__

With the plugin, you can create Cloudify deployments that include both container and non-container resources:


```yaml

  aws_centos_vm:
    type: cloudify.aws.nodes.Instance
    properties:
      image_id: { get_secret: centos_image_id }
      instance_type: { get_secret: centos_instance_type }
      name: { get_secret: centos_computer_name }
      agent_config:
         install_method: none
      aws_config: *aws_config
    relationships:
      - type: cloudify.aws.relationships.connected_to_elastic_ip
        target: kubeinstance_port_elastic_ip

  kubernetes_app_service:
      type: cloudify.kubernetes.resources.Service
      properties:
        definition:
          apiVersion: v1
          kind: Service
          metadata:
            labels:
              app: hello-app
            name: hello-app
          spec:
            ports:
              - port: 80
            selector:
              app: hello-app
              tier: frontend
            type: LoadBalancer
      relationships:
        - type: cloudify.kubernetes.relationships.managed_by_master
          target: kubernetes_master

```

__For a detailed, demo of the above orchestration, contact us.__
