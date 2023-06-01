+++
title = "Level 7: Multi-Cluster Kubernetes Orchestration"
description = "Learn how to design your service topology such that it is abstracted from the infrastructure layer and can be deployed on AWS using a single, flexible template."
weight = 70
alwaysopen = false
+++

This example demonstrates defining an environment independent Kubernetes workload and deploying it to development and production clusters.  The example runs on Amazon Web Services (AWS) or Microsoft Azure and so requires an account and API credentials.  It available on [github](https://github.com/cloudify-community/eaas-example).

The infrastructure deployment consists of [`ServiceComponent`s](../../../working_with/service_composition) representing:

 * network
 * database
 * object store
 * kubernetes

The implementation of these components is based on the environment type, which is supplied
as an input to the deployment.  For example, if a development environment is selected, <a href="http://minio.io">Minio</a> is used as the object store and <a href="https://minikube.sigs.k8s.io/docs/">Minikube</a> as the Kubernetes provider.  If an AWS production environment is selected, <a href="https://aws.amazon.com/s3">S3</a> and <a href="https://aws.amazon.com/eks">EKS</a> is used for each, respectively, whereas on Azure <a href="https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blobs-introduction">Blob</a> and <a href="https://docs.microsoft.com/en-us/azure/aks/intro-kubernetes">AKS</a> is used.

## Concepts

### Configuration Indirection

Multi-Kubernetes Cluster orchestration is achieved using a combination of the plugins mentioned above, and the design technique introduced in the [Environment as a Service](../eaas) example.  The technique uses a [structured secret](https://github.com/cloudify-community/eaas-example/blob/master/secret.json) (a JSON object) to map the input environment type to component blueprint names.  For example, to retrieve the name of the database blueprint, the following YAML is used in the [main blueprint](https://github.com/cloudify-community/eaas-example/blob/master/app/blueprint.yaml):

```yaml
id: { get_secret: [ eaas_params, { get_input: cloud_type }, { get_input: env_type }, db, blueprint ] }
```
Where

* `eaas_params`: the name of the secret containing the JSON object
* `cloud_type`: a cloud provider (aws, azure)
* `env_type`: one of the valid environment type names (e.g. `dev-small`, `prod`)

### Service Composition

The configuration indirection mentioned above helps with mapping simple identifiers (like 'dev-small') to complex configuration details (like image names/id, flavors, etc..).  This is not sufficient to completely abstract away the different Kubernetes environments required.  To do this requires [service composition](../../../working_with/service_composition).  Service composition allows blueprint nodes to represent entire blueprints themselves, effectively nesting blueprints and enabling a building block approach.  To make it possible to use components in the way required by this example, components of a similar kind (for example, blueprints that represent different kinds of database), all have a consistent interface.  In {{< param product_name >}} DSL, this interface is provided by the `capabilitites` section in the blueprint.  This is analogous to the use of interfaces or protocols in an object oriented programming paradigm.

Looking at the [multi-Kubernetes cluster example](https://github.com/cloudify-community/eaas-example), consider the object storage options [`minio`](https://github.com/cloudify-community/eaas-example/blob/master/infra/dev/minio/blueprint.yaml) and [`S3`](https://github.com/cloudify-community/eaas-example/blob/master/infra/prod/s3/aws-blueprint.yaml).  Both of these are represented by a blueprint that exposes a single `capability`: `bucket_url`.  Because of this standard "interface", the blueprints can be substituted for each other at deploy time.  You will find the same pattern for other elements: [minikube](https://github.com/cloudify-community/eaas-example/blob/master/infra/dev/minikube/blueprint.yaml)/[EKS](https://github.com/cloudify-community/eaas-example/blob/master/infra/prod/eks/blueprint.yaml) (`endpoint`), [`psql`](https://github.com/cloudify-community/eaas-example/blob/master/infra/dev/psql/aws-blueprint.yaml)/[`RDS`](https://github.com/cloudify-community/eaas-example/blob/master/infra/prod/rds_psql/aws-blueprint.yaml) (`host`, `master_username`, `master_password`), and so on.

![Kubernetes Multi-Cluster Use Case]( /images/k8s_multicluster/multik8s.png )

## Running the Example Implementation

### Prerequisites
This example expects the following prerequisites:

* A {{< param cfy_manager_name >}} setup ready. This can be either a [{{< param mgr_hosted_title >}}]({{< param mgr_hosted_link >}}), a [{{< param mgr_premium_title >}}]({{< param mgr_premium_link >}}), or a [{{< param mgr_community_title >}}]({{< param mgr_community_link >}}).

* The following plugins must be uploaded to the {{< param cfy_manager_name >}}
  * If running on AWS:
     * [AWS Plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/aws/) (version 2.5.6+)
  * If running on Azure:
     * [Azure Plugin](https://docs.cloudify.co/latest/working_with/official_plugins/infrastructure/azure/) (version 3.0.10+)
  * Kubernetes Plugin (version 2.9.3+) 
  * Terraform Plugin (version 0.15.0+)
  * Fabric Plugin (version 2.0.7+)
* The following secrets must be defined on the {{< param cfy_manager_name >}}
  * AWS Specific:
     * `aws_access_key_id` - The AWS access key
     * `aws_secret_access_key` - The AWS secret key
  * Azure Specific
     * `azure_tenant_id` - The Azure Tenant ID
     * `azure_subscription_id` - The Azure subscription ID
     * `azure_client_id` - The Azure client ID
     * `azure_client_secret` - The Azure client secret
  * `private_key_content` - The SSH private key contents from the keypair
  * `public_key_content` - The SSH public key contents from the keypair
  * `eaas_params` - See [the example](https://github.com/cloudify-community/eaas-example/blob/master/secret.json) for the structure of this secret.

* Access to the cloud infrastructure you select is required to demonstrate this example.  That can mean ability to allocate the required VMs and networking (ECS), and/or access to S3, RDS, and EKS, or the Azure equivalents.
* These instructions use the CLI to run the example.  Using the CLI requires an addition [installation step](../../../install_maintain/installation/installing-cli.md) unless the example is run on the manager itself, un which case it is pre-installed.

### Install the Example
Our [Environment-as-a-Service example on GitHub](https://github.com/cloudify-community/eaas-example) demonstrates a deploy-time selectable Kubernetes-based environment that includes object and relational storage external to the Kubernetes cluster.  The three selectable environment types representing small and large development environments, and a production environment.

* Download or clone the example to your local system.  If downloaded as an archive, the archive must be extracted.
* Upload each blueprint in the `infra` directory, and use the names from the table below:

| Path | Name | File | Notes |
| ---- | ---- | ---- | ---- |
| infra/dev/minikube | minikube | blueprint.yaml ||
| infra/dev/minio | minio | blueprint.yaml ||
| infra/dev/multi_node | multi_node | aws-blueprint.yaml | AWS only |
| infra/dev/multi_node | multi_node | azure-blueprint.yaml | Azure only |
| infra/dev/psql | psql | aws-blueprint.yaml | AWS only |
| infra/dev/psql | psql | azure-blueprint.yaml | Azure only |
| infra/dev/single_node | single_node | aws-blueprint.yaml | AWS only |
| infra/dev/single_node | single_node | azure-blueprint.yaml | Azure only |
| infra/dev/vm | vm | aws-blueprint.yaml | AWS only |
| infra/dev/vm | vm | azure-blueprint.yaml | Azure only |
| infra/prod/eks | eks | blueprint.yaml | AWS only |
| infra/prod/aks | aks | blueprint.yaml | Azure only |
| infra/prod/prod_network | prod_network | aws-blueprint.yaml | AWS only |
| infra/prod/prod_network | prod_network | azure-blueprint.yaml | Azure only |
| infra/prod/rds_psql | rds_psql | aws-blueprint.yaml | AWS only |
| infra/prod/rds_psql | rds_psql | azure-blueprint.yaml | Azure only |
| infra/prod/s3 | s3 | aws-blueprint.yaml | AWS only |
| infra/prod/s3 | s3 | azure-blueprint.yaml | Azure only |
| infra/vpc | vpc | aws-blueprint.yaml | AWS only |
| infra/rg | vpc | azure-blueprint.yaml | Azure only|

* Upload the application/main blueprint from `app/blueprint.yaml`.
* Create a small development cluster:
  
```
cfy deployments create app_dev_small -b app -i env_type=dev-small
cfy executions start install -d app_dev_small
```

* Create a large development cluster:

```
cfy deployments create app_dev_large -b app -i env_type=dev-large
cfy executions start install -d app_dev_large
```

* Create a production cluster:

```
cfy deployments create app_prod -b app -i env_type=production
cfy executions start install -d app_prod
```




