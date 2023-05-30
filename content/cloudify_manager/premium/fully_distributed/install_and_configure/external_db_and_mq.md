+++
title = "External DB and MQ"
description = "A guide for installing the luster, the user can use the external PostgreSQL database and RabbitMQ."
weight = 30
alwaysopen = false
+++

## Installing and Configuring External DB and External RabbitMQ within Distributed Cluster

When installing the {{< param product_name >}} cluster, the user can use the external PostgreSQL database and RabbitMQ.
This page is a guide for installing such services.


## Externally Hosted PostgreSQL Database Prerequisites {#externally-hosted-postgresql-database-installation}
 - Make sure the PostgreSQL instance is publicly available and reachable from the local {{< param product_name >}} Management service cluster nodes.
 - Retrieve the PostgreSQL instance CA certificate and save it locally for future use in the {{< param product_name >}} Management service cluster nodes configuration.
 - Keep your PostgreSQL database username and password for the later configuration of the {{< param product_name >}} Management service cluster nodes.
 - Make sure the following ports are open in the firewall/ security group your database is connected to:

 Port      | Description
-----------|------------
 tcp/5432  | PostgreSQL connection port.

- {{< param product_name >}} uses the 9.5.25 PostgreSQL version, make sure your database uses the same version.

## Azure DBaaS for PostgreSQL

{{< param product_name >}} supports [Microsoft's Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/) as an external database option replacing {{< param product_name >}}'s PostgreSQL deployment.

Azure Database for PostgreSQL is a fully managed Database-as-a-Service (DBaaS) offering that can handle mission-critical workloads with predictable performance, security, high availability, and dynamic scalability. It is available in two deployment options, as a single server and as a Hyperscale (Citus) cluster (preview).

### Setting up Azure Database for PostgreSQL as the {{< param product_name >}} Database
The DBaaS of Azure supports a clustered instance and a single instance available for resizing on demand.
As opposed to other DBaaS vendors, Azure doesn't give access to the `postgres` user with SuperUser privileges, so while working with Azure DBaaS is fully supported, the configuration is a bit different than regular PostgreSQL installations.

Using Azure DBaaS (either the single instance or the clustered instance), requires specific setup changes to the {{< param cfy_manager_name >}} configuration.
The Azure connection string for the users must be in the form of `<username>@<dbhostname>`, so for a DB user named `cloudify` and a DB hostname named `azurepg`, the user that needs to be configured should be: `cloudify@azurepg`.
So, for example, if we created an Azure DBaaS for PostgreSQL instance with the following information:
 - Server name: `azurepg.postgres.database.azure.com`
 - Admin username: `testuser@azurepg`

So the following settings in `/etc/cloudify/config.yaml` need to be configured as follows:
```yaml
postgresql_client:
  host: 'azurepg.postgres.database.azure.com'
  server_db_name: 'postgres'
  server_username: 'testuser@azurepg'
  server_password: 'testuserpassword'
  cloudify_db_name: 'cloudify_db'
  cloudify_username: 'cloudify@azurepg'
  cloudify_password: 'cloudify'
  ssl_enabled: true
  ssl_client_verification: false
postgresql_server:
  ca_path: '/path/to/azure/dbaas/ca/certificate'
```

`server_username` will be used by {{< param product_name >}} to make the initial connection to the DB and create all the resources {{< param product_name >}} needs to operate, which include, among other resources, the `cloudify_username`
`cloudify_username` will be used by {{< param product_name >}} after the installation for day-to-day operations

Note that both `server_username` and `cloudify_username` have the postfix `@azurepg` added to them, as it is required by Azure DBaaS for Postgres

## AWS DBaaS for PostgreSQL (RDS)

{{< param product_name >}} supports [AWS RDS Database for PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html) as an external database option replacing {{< param product_name >}}'s PostgreSQL deployment.

Amazon Relational Database Service (Amazon RDS) is a web service that makes it easier to set up, operate, and scale a relational database in the AWS Cloud. It provides cost-efficient, resizable capacity for an industry-standard relational database and manages common database administration tasks.

### Setting up AWS Database for PostgreSQL as the {{< param product_name >}} Database
The DBaaS of AWS supports a clustered instance(Multi-AZ) and a single instance available for resizing on demand.

Using RDS (either the single instance or the clustered instance), requires specific setup changes to the {{< param cfy_manager_name >}} configuration.
For example, if we created RDS for a PostgreSQL instance with the following information:
 - Endpoint: `mydb.ckvwovtjmf3o.eu-west-1.rds.amazonaws.com`
 - Admin username: `testuser`
 - Initial database name: `postgres`

So the following settings in `/etc/cloudify/config.yaml` need to be configured as follows:
```yaml
postgresql_client:
  host: 'mydb.ckvwovtjmf3o.eu-west-1.rds.amazonaws.com'
  server_db_name: 'postgres'
  server_username: 'testuser'
  server_password: 'testuserpassword'
  cloudify_db_name: 'cloudify_db'
  cloudify_username: 'cloudify'
  cloudify_password: 'cloudify'
  ssl_enabled: true
  ssl_client_verification: false
postgresql_server:
  ca_path: '/path/to/rds/dbaas/ca/certificate'
```

## RabbitMQ Cluster {#externally-hosted-rabbitmq-installation}

The RabbitMQ service is a cluster comprised of any amount of nodes,
whereas {{< param product_name >}}'s best practice is three nodes.

**Note:** Please refer to the [RabbitMQ networking guide - Ports](https://www.rabbitmq.com/networking.html#ports)
to verify the open ports needed for a RabbitMQ cluster installation.


### Externally Hosted RabbitMQ Installation
- Make sure the [management plugin](https://www.rabbitmq.com/management.html) is installed on
  the RabbitMQ instances.
- Retrieve the RabbitMQ instance CA certificate and save it locally for future use in the
  {{< param product_name >}} Management service cluster nodes configuration.
- Keep your RabbitMQ username and password for the later configuration of the
  {{< param product_name >}} Management service cluster nodes.
- Mark RabbitMQ service as external setting `rabbitmq.is_external: true` flag (see the example
  configuration below).
- **Note:** Reverse DNS lookup must be available in your network for the RabbitMQ nodes,
please refer to the [RabbitMQ networking guide - DNS](https://www.rabbitmq.com/networking.html#dns-reverse-dns-lookups)
 for further explanation.


## {{< param product_name >}} Management Service Configuration with External Services

In case of an **externally hosted PostgreSQL database** and **externally hosted RabbitMQ** i.e.
"bring your own", configure the following settings in `/etc/cloudify/config.yaml`:

**Note:** Some of the keys in the `postgresql_client` section are relevant only for a few cloud
services. Make sure you read the comments provided and follow them.


```yaml
manager:
  security:
    ssl_enabled: true
    admin_password: '<strong admin password for {{< param product_name >}}>'
  cloudify_license_path: '<path to {{< param product_name >}} license file>'

rabbitmq:
  username: '<username configured for queue management on rabbit>'
  password: '<strong password configured for queue management on rabbit>'

  # The CA path that was retrieved from the RabbitMQ instance
  ca_path: '<path to ca certificate>'

  # Set this to true if the RabbitMQ is an external service.  This will result in the RabbitMQ
  # service not being internally-monitored by the {{< param product_name >}} cluster status reporter.
  is_external: true

  # In case the connection to the RabbitMQ instance uses one IP address,
  # please specify it as the first cluster node and leave the rest blank
  cluster_members:
    <short host name of rabbit server 1>:
      node_id: <the node`s id> # The node_id can be retrieved by running `cfy_manager node get_id` on the relevant node
      networks:
        default: <private ip of rabbit server 1>
        <other network name>: <address for this node on `other network`>
    <short host name of rabbit server 2>:
      node_id: <the node`s id>
      networks:
        default: <private ip of rabbit server 2>
        <other network name>: <address for this node on `other network`>
    <short host name of rabbit server 3>:
      node_id: <the node`s id>
      networks:
        default: <private ip of rabbit server 3>
        <other network name>: <address for this node on `other network`>

postgresql_server:
  # The CA certificate that was retrieved from the PostgreSQL instance
  ca_path: '<path to ca certificate of external db>'

  # If you are using external db with single entry point, cluster section should be empty.
  cluster:
    nodes: {}

postgresql_client:
  # Host name (or IP address) of the external database.
  host: localhost

  # Server user name (server_username), password (server_password),
  # and DB (server_db_name) to use when connecting to the database for {{< param product_name >}}
  # DB initialization and population.
  #
  # If your database is an Azure DBaaS instance, you must set 'server_username'
  # so it includes the database name as a suffix. For example, if your database
  # name is "mycfydb" and your username is "test", then "server_username"
  # should be "mycfydb@test".
  #
  # THE PASSWORD WILL BE REMOVED FROM THE FILE AFTER THE INSTALLATION FINISHES.
  server_db_name: postgres
  server_username: postgres
  server_password: '<the postgresql database user password>'

  # {{< param product_name >}} DB name, user name and password to be created.
  #
  # The following apply if your database is an Azure DBaaS instance:
  #
  #   * "cloudify_username" must include the database name as a suffix. For example,
  #     if your desired database username is "cloudify" and your database name is
  #     "test", then "cloudify_username" should be "cloudify@test".
  #
  #  * "cloudify_username" must be different from "server_username".
  cloudify_db_name: cloudify_db
  cloudify_username: cloudify
  cloudify_password: cloudify

  ssl_enabled: true

  # If true, client SSL certificates will need to be supplied for database connections
  ssl_client_verification: false

# In case you use a load-balancer, you would need to specify its private IP
# in order for the different agents to connect to it.
networks:
  load-balancer: <load-balancer private IP address>

# For monitoring service(status reporter)
prometheus:
  blackbox_exporter:
    ca_cert_path: <ca path for blackbox exporter>
  credentials:
    username: <monitoring username>
    password: <strong password for monitoring user>

  cert_path: <certificate for prometheus, cert_path of this host can be used>
  key_path: <key for promethus, key_path this host can be used>
  ca_path: <ca for promethus, ca_path this host can be used>'

ssl_inputs:
  internal_cert_path: '<path to this host certificate generated in the first step>'
  internal_key_path: '<path to this host key generated in the first step>'
  external_cert_path: '<can be same as internal_cert_path(for CLI)>'
  external_key_path: '<can be same as internal_key_path(for CLI)>'
  ca_cert_path: '<path to this host ca certificate>'
  external_ca_cert_path: '<path to external ca certificate for this server, can be the same one as ca_cert_path>'
  postgresql_client_cert_path: '<path to cert for this server>'
  postgresql_client_key_path: '<path to key for this server>'

services_to_install:
  - manager_service
  - monitoring_service
```


Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```

