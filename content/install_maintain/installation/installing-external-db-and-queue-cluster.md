---
layout: bt_wiki
title: Installing and Configuring External DB And Rabbitmq Within Distributed Cluster
description: Install and Configure External DB And Rabbitmq within Distributed Cluster . 
category: Installation
draft: false
weight: 5
---


# Installing and Configuring External DB And Rabbitmq Within Distributed Cluster

When installing the Cloudify cluster, the user can use externally PostgreSQL database and RabbitMQ.
This page is a guide for installing such services.

### PostgreSQL Database Cluster

The PostgreSQL database high-availability cluster is comprised of 3 nodes (Cloudify best-practice) or more.

**Note** Make sure the following ports are open for each node:

 Port      | Description
-----------|------------
 tcp/2379  | etcd port.
 tcp/2380  | etcd port.
 tcp/5432  | PostgreSQL connection port.
 tcp/8008  | Patroni control port.


#### Externally Hosted PostgreSQL Database Installation
 - Make sure the PostgreSQL instance is publicly available and reachable from the local Cloudify Management service cluster nodes.
 - Retrieve the PostgreSQL instance CA certificate and save it locally for future use in the Cloudify Management service cluster nodes configuration.
 - Keep your PostgreSQL database username and password for the later configuration of the Cloudify Management service cluster nodes. 

##### Azure DBaaS for Postgres

Cloudify supports [Microsoft's Azure Database for PostgreSQL](https://docs.microsoft.com/en-us/azure/postgresql/) as an external database option replacing Cloudify's PostgreSQL deployment.  

Azure Database for PostgreSQL is a fully managed database-as-a-service offering that can handle mission-critical workloads with predictable performance, security, high availability, and dynamic scalability. It is available in two deployment options, as a single server and as a Hyperscale (Citus) cluster (preview).  

###### Setting up Azure database for PostgreSQL as the Cloudify database  
The DBaaS of Azure supports a clustered instance and a single instance available for resizing on demand.  
As opposed to other DBaaS vendors, Azure doesn't give access to the `postgres` user with SuperUser privileges, so while working with Azure DBaaS is fully supported, the configuration is a bit different than regular Postgres installations.  

Using Azure DBaaS (either the single instance or the clustered instance), requires specific setup changes to the Cloudify manager configuration.    
Azure connection string for the users must be in the form of `<username>@<dbhostname>`, so for a DB user named `cloudify` and a db hostname named `azurepg`, the user that needs to be configured should be: `cloudify@azurepg`.  
So, for example, if we created an Azure DBaaS for Postgres instance with the following information:  
- Server name: `azurepg.postgres.database.azure.com`  
- Admin username: `testuser@azurepg`

So the following settings in `/etc/cloudify/config.yaml` need to be configured as follows:
```yaml
postgresql_client:
  host: 'azurepg.postgres.database.azure.com'
  ca_path: '/path/to/azure/dbaas/ca/certificate'
  server_db_name: 'postgres'
  server_username: 'testuser@azurepg'
  server_password: 'testuserpassword'
  cloudify_db_name: 'cloudify_db'
  cloudify_username: 'cloudify@azurepg'
  cloudify_password: 'cloudify'
  ssl_enabled: true
  ssl_client_verification: false
```
`server_username` will be used by Cloudify to make the initial connection to the DB and create all the resources Cloudify needs to operate, which include, among other resources, the `cloudify_username`  
`cloudify_username` will be used by Cloudify after the installation for day-to-day operations  

Note that both `server_username` and `cloudify_username` have the postfix `@azurepg` added to them, as it is required by Azure DBaaS for Postgres
 

Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```

On one node, verify that everything looks healthy with: `cfy_manager dbs list`.


### RabbitMQ Cluster
  
The RabbitMQ service is a cluster comprised of any amount of nodes, 
whereas Cloudify best-practice is three nodes. 

**Note** Please refer to the [RabbitMQ networking guide - Ports](https://www.rabbitmq.com/networking.html#ports) 
to verify the open ports needed for a RabbitMQ cluster installation. 
  
  
#### Externally Hosted RabbitMQ Installation
- Make sure the [management plugin](https://www.rabbitmq.com/management.html) is installed on the RabbitMQ instances.
- Retrieve the RabbitMQ instance CA certificate and save it locally for future use in the 
 Cloudify Management service cluster nodes configuration.  
- Keep your RabbitMQ username and password for the later configuration of the Cloudify Management service cluster nodes. 
- **Note** Reverse DNS lookup must be available in your network for the RabbitMQ nodes, 
please refer to  [RabbitMQ networking guide - DNS](https://www.rabbitmq.com/networking.html#dns-reverse-dns-lookups)
 for further explanation.  


#### Cloudify Management Service configuration with external services

* In case of an **externally hosted PostgreSQL database** and **externally hosted RabbitMQ** i.e. "bring your own",configure the following settings in `/etc/cloudify/config.yaml`:
   * **Notice** Some of the keys in the 'postgresql_client' section are relevant only for a few cloud services. Make sure you read the comments
   provided and follow them.


```yaml
manager:
    security:
        ssl_enabled: true
        admin_password: '<strong admin password for cloudify>'

    cloudify_license_path: '<path to cloudify license file>'

rabbitmq:
    username: '<username configured for queue management on rabbit>'
    password: '<strong password configured for queue management on rabbit>'

    # The CA path that was retrieved from the RabbitMQ instance
    ca_path: '<path to ca certificate>'

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
    # If you are not using a PostgreSQL cluster the 'cluster' section should not be filled.
    cluster:
        nodes:
            <first postgresql instance-name>:
                ip: <private ip of postgres server 1>
                node_id: <the node`s id> # The node_id can be retrieved by running `cfy_manager node get_id` on the relevant node
            <second postgresql instance-name>:
                ip: <private ip of postgres server 2>
                node_id: <the node`s id>
            <third postgresql instance-name>:
                ip: <private ip of postgres server 3>
                node_id: <the node`s id>

postgresql_client:
    # Host name (or IP address) of the external database.
    host: localhost

    # The CA certificate that was retrieved from the PostgreSQL instance
    ca_path: '<path to ca certificate>'

    # Server user name (server_username), password (server_password),
    # and DB (server_db_name) to use when connecting to the database for Cloudify
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
    server_password: '<the postgresql server password>'

    # Cloudify DB name, user name and password to be created.
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

ssl_inputs:
    ca_cert_path: '<path to ca certificate>'
    external_ca_cert_path: '<path to external ca certificate for this server, can be the same one as ca_cert_path>'
    internal_cert_path: '<path to the certificate generated in the first step>'
    internal_key_path: '<path to the key generated in the first step>'
    
    #If you set 'ssl_client_verification' under 'postgresql_client' to true
    postgresql_client_cert_path: '<path to cert for this server>'
    postgresql_client_key_path: '<path to key for this server>'

services_to_install:
    - manager_service
```


Execute on each node **sequentially** (i.e. do not start installing next manager unless the previous has been successfully installed):
```bash
cfy_manager install [--private-ip <PRIVATE_IP>] [--public-ip <PUBLIC_IP>] [-v]
```
