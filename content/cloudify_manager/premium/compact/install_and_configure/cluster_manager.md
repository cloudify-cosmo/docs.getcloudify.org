+++
title = "Automated Install"
description = "The following article will guide you through the different steps of easily installing a Cloudify cluster on either 3 or 9 VMs."
weight = 10
alwaysopen = false
+++

## Cluster Manager
The purpose of the Cluster Manager package is to automate the procedure of installing a {{< param product_name >}}
cluster on existing VMs. The following article will guide you through the different steps of
easily installing a {{< param product_name >}} cluster on either three or nine VMs.

## Installation

### Choosing a Cluster Configuration
Before using the  Cluster Manager package you must prepare a set of VMs for your cluster.
The Cluster Manager package supports all cloud providers and the following configurations:

* Fully distributed cluster (9 VMs)
* Compact cluster (3 VMs)
* Fully distributed cluster with an external DB (6 VMs)
* Compact cluster with an external DB (3 VMs)

{{% note %}}
* The Cluster Manager package is currently supported by CentOS and RHEL.
* Please follow the [prerequisites and sizing guidelines]({{< relref "cloudify_manager/premium/fully_distributed/requirments/capacity_and_planning.md#cloudify-cluster" >}})
and generate the required number of VMs according to the mentioned spec.
* A load balancer is required for load distribution over the managers. The setup will expect a load balancer address. The Cluster Manager package does not install the load balancer.
{{% /note %}}


### Installing the Cluster Manager Package
You can run the Cluster Manager package from one of the cluster's VMs, or from a different host in the
cluster network. You can install the package either by using an RPM or by using `pip install`:

#### Installing Using an RPM
Run the following command:
```bash
sudo yum install -y http://repository.cloudifysource.org/cloudify/cloudify-cluster-manager/1.0.13/ga-release/cloudify-cluster-manager-1.0.13-ga.el7.x86_64.rpm
```

#### Installing Using pip Install
```bash
pip install cloudify-cluster-manager
```

## Using the Cluster Manager Package
Once the VMs are ready, using the Cluster Manager package to build the cluster consists of three steps:

1. Generating a cluster configuration file template based on the cluster topology you wish to deploy.
2. Fill in the generated file with the relevant information.
3. Running the cluster installation based on the completed configuration file.

### Generating a Configuration File
Generating the configuration file is done using the command:

```bash
cfy_cluster_manager generate-config [OPTIONS]
```

#### Options

* `-o, --output-path` - The local path to save the cluster install configuration file to.
                        Default: ./cfy_cluster_config.yaml
* `--three-nodes` - Using a three nodes cluster.
* `--nine-nodes` - Using a nine nodes cluster. In the case of using an
                   external DB, Only 6 nodes will need to be provided.
* `--external-db` - Using an external DB.
* `-v, --verbose` - Show verbose output.
* `-h, --help` - Show this help message and exit.

{{% note %}}
Note:`--three-nodes` or `--nine-nodes` must be specified, and they cannot be specified together.
{{% /note %}}

### Filling in the Configuration File

#### General Note
Fill in the information according to the comments in the file itself.
NOTE! Do not delete anything from the file.

#### Load Balancer
As mentioned before, a load balancer is not installed as part of the cluster installation.
The `load_balancer_ip` value is used in the different config.yaml files for the instances' connection.

#### Certificates
* If you wish to use your own certificates:
    * Fill in the `ca_cert_path` value and the `cert_path` and `key_path` values for each VM (all of them).
    * In case a VM's certificate's SAN includes the VM host-name, please specify this host-name as the value
      of the `hostname` key.

* Otherwise: {{< param product_name >}}-signed certificates will be generated and used automatically.

#### config.yaml Files
* If you wish to use your own config.yaml files for the different instances, you may
do so by specifying their path as the value of the `config_path` in each one of the instances (all of them).

* Otherwise, preconfigured config.yaml files will be generated and used automatically.

* **Note**: If you use your own config files, you cannot specify the certificates' paths for the different instances.
Moreover, the external_db and credentials sections in the configuration file will be ignored.

#### Credentials
* If you wish to use your own credentials, you can specify them in the `credentials` section.

* Unfilled credentials will be generated and used by the Cluster Manager package. The generated credentials
are random.

* **WARNING:** At the end of the installation, a file named `secret_credentials_file.yaml` will be created in the current directory.
This file includes the credentials in clear text. Please, remove it after reviewing it or store it in a safe location.   

### Installing a {{< param product_name >}} Cluster
Now that the configuration file is completed, we can move on to the cluster installation using the
following command:

```bash
cfy_cluster_manager install [OPTIONS]
```

#### Options
* `--config-path` - The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
* `--override` - If specified, any previous installation of {{< param product_name >}} on the instances will be removed.
* `--validate` - Validate the provided configuration file.
* `-v, --verbose` - Show verbose output.
* `-h, --help` - Show this help message and exit.

### Removing a {{< param product_name >}} Cluster
The created {{< param product_name >}} cluster can be removed using the following command:

```bash
cfy_cluster_manager remove [OPTIONS]
```

#### Options
* `--config-path` - The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
* `-v, --verbose` - Show verbose output.
* `-h, --help` - Show this help message and exit.

### Upgrading a {{< param product_name >}} Cluster
The {{< param product_name >}} cluster can be upgraded from v5.1.0 (or any later release) to a more recent version using the following command:

```bash
cfy_cluster_manager upgrade [OPTIONS]
```

#### Options
* `--config-path` - The completed cluster configuration file path. Default: ./cfy_cluster_config.yaml
* `--upgrade-rpm` - Path to a Cloudify Manager install RPM. This can be either a local or remote path.  
* `-v, --verbose` - Show verbose output.
* `-h, --help` - Show this help message and exit.

## Fault Tolerance Mechanisms
The Cluster Manager package has a few mechanisms to handle errors:

* The configuration file is validated before it is used.
* The connection to each instance is tested before the installation starts.
* The `cfy_manager install` command is run using `systemd-run` on the different instances. I.e. if the SSH connection is interrupted, the installation keeps on running because it's configured as a child process of the init process.
* In case of a recoverable error during the installation, you can just run the `cfy_cluster_manager install` command again. The installation process would:
 * Go over the instances and check if they were installed successfully.
 * Once it gets to the failed instance, it would remove the failed installation, and continue the installation from there.
* In case of an unrecoverable error during the installation, you can run it again using: `cfy_manager install --override`. This command would:
 * Go over the instances and remove {{< param product_name >}} from them (including the RPM).
 * Run the installation process from the start.
