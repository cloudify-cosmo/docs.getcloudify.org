+++
title = "Level 7: Multi-Cluster Kubernetes Orchestration"
description = "Learn how to design your service topology such that it is abstracted from the infrastructure layer and can be deployed on AWS using a single, flexible template."
weight = 70
alwaysopen = false
+++

This example demonstrates defining an environment independent Kubernetes workload and deploying it to development and production clusters.  The example runs on Amazon Web Services (AWS) and so requires and account and API credentials.

The infrastructure deployment consists of [`ServiceComponent`s](../../../working_with/service_composition) representing:

 * network
 * database
 * object store
 * kubernetes

The implementation of these components is based on the environment type, which is supplied
as an input to the deployment.  For example, if a development environment is selected, <a href="http://minio.io">Minio</a> is used as the object store and <a href="https://minikube.sigs.k8s.io/docs/">Minikube</a> as the Kubernetes provider.  If a production environment is selected, <a href="https://aws.amazon.com/s3">S3</a> and <a href="https://aws.amazon.com/eks">EKS</a> is used for each, respectively.


## Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).
* The following plugins must be uploaded to the {{< param cfy_manager_name >}}
  * AWS Plugin (version 2.5.6+)
  * Kubernetes Plugin (version 2.9.3+) 
  * Terraform Plugin (version 0.15.0+)
  * Fabric Plugin (version 2.0.7+)
* The following secrets must be defined on the {{< param cfy_manager_name >}}
  * `aws_access_key_id` - The AWS access key
  * `aws_secret_access_key` - The AWS secret key
  * `aws_keypair` - The name of an AWS keypair to associate with virtual machines.  The key must be created on AWS prior to running the example.
  * `private_key_content` - The SSH private key contents from the keypair
  
* Access to the cloud infrastructure you select is required to demonstrate this example.

## Concepts

### Configuration Indirection

Multi-Kubernetes Cluster orchestration is achieved using a combination of the plugins mentioned above, and the design technique introduced in the [Environment as a Service](../eaas) example.  The technique uses a blueprint node as the source of cluster configuration.  This configuration is populated by a script which takes the kind of environment desired as an input.  The particulars of the configuration are then looked up and stored in runtime properties on the node.  Other nodes then use this configuration via the `get_attribute` intrinsic function.

### Service Composition

The configuration indirection helps with mapping simple identifiers (like 'dev-small') to complex configuration details (like image names/id, flavors, etc..).  This is not sufficient to completely abstract away the different Kubernetes environments required.  To do this requires [service composition](../../../working_with/service_composition).  Service composition allows blueprint nodes to represent entire blueprints themselves, effectively nesting blueprints and enabling a building block approach.  The main requirement to be able to use components in the way required by this example is that components of a similar kind (for example, blueprints that represent different kinds of database), all have a consistent interface.  In Cloudify DSL, this interface is provided by the `capabilitites` section in the blueprint.

Looking at the [multi-Kubernetes cluster example](https://github.com/cloudify-community/eaas-example), consider the object storage options `minio` and `S3`.  Both of these are represented by a blueprint that exposes a single `capability`: `bucket_url`.  Because of this standard "interface", the blueprints can be substituted for each other at deploy time.  You will find the same pattern for other elements: minikube/EKS (`endpoint`), psql/RDS (`host`, `master_username`, `master_password`), and so on.

### Example Implementation

Our [Environment-as-a-Service example on GitHub](https://github.com/cloudify-community/eaas-example) demonstrates a deploy-time selectable Kubernetes-based environment that includes object and relational storage external to the Kubernetes cluster.  The three selectable environment types representing small and large development environments, and a production environment.  The example README provides implementation details.




