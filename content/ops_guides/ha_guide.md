---
title: Cloudify High Availability Guide
category: Operations Guides
draft: false
weight: 100
---
## Environment

### Hardware prerequisite

Cloudify HA cluster usually builds on three Cloudify managers. Each Cloudify manager requires at least next hardware resources:

|   | Minimum | Recommended |
|---|---------|-------------|
| vCPU | 2 | 8 |
| RAM | 4GB | 16GB |
| Storage | 5GB | 64GB |

The minimum requirements are enough for small deployments that only manage a few compute instances. Managers that manage more deployments or large deployments need at least the recommended resources.

Recommended resource requirements are tested and verified to be dependent on these criteria:

*   Blueprints: The only limit to the number of blueprints is the storage required to store the number and size of the local blueprints.
*   Deployments: Each deployment requires minimal storage.
*   Nodes: Cloudify can orchestrate 12,000 non-monitored nodes (tested with 2000 deployments, each spanning six node instances). Monitored nodes add CPU load to the manager and require storage for the logs, events and metrics.
*   Tenants: You can run up to 1000 tenants on a manager.
*   Workflows & Concurrency: You can run up to 100 concurrent workflows.
*   Logs, events and metrics: You must have enough storage to store the logs, events and metrics sent from the hosts. You can configure [log rotation]({{< relref "working_with/manager/service-logs.md#log-rotation" >}}) to reduce the amount of storage space required.

### Software prerequisite

Cloudify Manager is supported for installation on a 64-bit host with RHEL/CentOS 7.4.

There are specific packages that are commonly included in RHEL/CentOS. You must have these packages installed before you install Cloudify Manager:

*   sudo - Required to run commands with root privileges (note that this is still a requirement even when running with root user)
*   openssl-1.0.2k - Required to generate internal/external certificates
*   openssh-server - Required for creating SSH keys during the sanity check
*   logrotate - Required for rotating Cloudify log files
*   systemd-sysv - Required by PostgreSQL DB
*   initscripts - Required by RabbitMQ
*   which - Required to install Logstash plugins
*   python-setuptools - Required by Python
*   python-backports - Required by Python
*   python-backports-ssl_match_hostname - Required by Python

### Network Interfaces

Cloudify Manager requires at least two network interfaces:

*   Private - This interface dedicated for communication with other Cloudify components, including agents and cluster members.
*   Public - This interface dedicated for connections to the Cloudify Manager with the Cloudify CLI and Web Interface.

In some cases, it is possible to use only one network interface, but this can lead to security problems.

### Network Ports

Cloudify Manager listens on the following ports:

 
| Port | Description |
|------|-------------|
| 80 | REST API and UI. This port must be accessible when SSL is not enabled. |
| 22 | REST API and UI. This port must be accessible when SSL is enabled. |
| 443 | For remote access to the manager from the Cloudify CLI. (Optional) |
| 5671 | RabbitMQ. This port must be accessible from agent VMs. |
| 53229 | File server. This port must be accessible from agent VMs. |
| 53333 | Internal REST communications. This port must be accessible from agent VMs. |

Additionally, when the Manager is a part of a Cloudify Manager cluster, the following ports must be accessible from all the other nodes in the cluster

| Port | Description |
|------|-------------|
| 8300 | Internal port for the distributed key/value store. |
| 8301 | Internal port for TCP and UDP heartbeats. Must be accessible for both TCP and UDP. |
| 8500 | Port used for outage recovery in the event that half of the nodes in the cluster failed. |
| 15432 | Database replication port. |
| 22000 | Filesystem replication port. |

## Create hosts

### Openstack platform

1. Create separated security groups for public and private connections based on tables described below.
1. Create or import key pairs for managers and agents.
1. Create three RHEL/CentOS 7.4 instances with flavors that meet Cloudify requirements described below.
1. Either add private and public networks or only one network to Cloudify manager instances.
1. Associate floating IP if this is needed for every instance.
1. Assign security groups to the instances.

### VMware infrastructure

Create three RHEL/CentOS 7.4 VMs. Add two network interfaces and assign private and public networks, or only one network interface and one network.

## Install Cloudify managers

The following actions should be performed on all servers:

1.  Add the user to the group wheel and install cloudify-manager-install package.

```bash
sudo usermod -a -G wheel $(whoami)
sudo yum install -y  http://repository.cloudifysource.org/cloudify/4.3.1/ga-release/cloudify-manager-install-4.3.1ga.rpm
```

1.  To change the default configuration settings, edit the `/etc/cloudify/config.yaml` file.
    Next parameters can be changed:
    * Administrator password (`admin_password`) 

        _If you do not specify an administrator password in the command options or the config.yaml file, the installation process generates a random password and shows it as output when the installation is complete._

    * Private and public IP addresses (`private_ip;public_ip`)
        
        _In case of only one assigned IP address, `public_ip` and `private_ip` parameters should have the same IP address._

    * External REST communications over HTTPS (`ssl_enabled`)
    * Local path replacement for remote resources with a URL (`import_resolver`)
    * Multi-network management (`networks`)
        
        _If a manager has a multiple interfaces, you must list in the config.yaml all of the interfaces that agents can connect to. You must then specify in each blueprint the interface that the agent connects. If no IP address is specified in the blueprint, the agent connects to the interface that is identified as the private IP in the configuration process, specified by –private-ip or specified in the config.yaml file._
        
        ```
        agent:
         networks:
         network_a: <ip_address_a>
         network_b: <ip_address_b>
        ```

    * LDAP connection information (`ldap`)
        Descriptions of parameters can be found by link [http://docs.getcloudify.org/4.3.0/cli/ldap/](http://docs.getcloudify.org/4.3.0/cli/ldap/)
        
        Example:
        
        ```
        ldap:
         server: "ldap://<ldap server>:389"
         username: "Administrator"
         password: "Password"
         domain: "domain.com"
        ```

    * SSL communication settings (`ssl_inputs`)
1.  Run: `cfy_manager install`
1.  For security reasons, we recommend that you:
    * Specify an administrator password according to your security policy
    * Set SSL in config.yaml to enabled
    * Set gunicorn to bind to localhost To set gunicorn to listen on localhost only:
        1.  Edit the `/usr/lib/systemd/system/cloudify-restservice.service` file.
        1.  Find this line: `-b 0.0.0.0:${REST_PORT} \`
        1.  Replace the line with: `-b localhost:${REST_PORT} \`
        1.  To restart the dependent services, run next commands:
        
        ```
        sudo systemctl daemon-reload
        sudo systemctl restart cloudify-restservice
        ```

## Build Cloudify HA cluster

Create a cluster when you completed installing your Cloudify Managers. When you run the `cfy cluster start` command on a first Cloudify Manager, high availability is configured automatically. Use the `cfy cluster join` command, following installation, to add more Cloudify Managers to the cluster. The Cloudify Managers that you join to the cluster must be in an empty state, otherwise the operation will fail.

1.  Add profiles of all three Cloudify managers on Cloudify cli:
    ```
       cfy profiles use <Leader IP> -t default_tenant -u admin -p <admin password>
       cfy profiles use <Replica1 IP> -t default_tenant -u admin -p <admin password>
       cfy profiles use <Replica2 IP> -t default_tenant -u admin -p <admin password>
    ```
1.  Start cluster:

    ```
       cfy profiles use <Leader IP>
       cfy cluster start --cluster-node-name <Leader name>
    ```
1.  Switch to second profile:

    ```
       cfy profiles use <Replica1 IP>
    ```
1.  Join the manager to the cluster

    ```
       cfy cluster join --cluster-node-name <Replica1 name> <Leader IP>
    ```
1.  Switch to third profile

    ```
       cfy profiles use <Replica2 IP>
    ```
1.  Join the manager to the cluster

    ```
       cfy cluster join --cluster-node-name <Replica2 name> <Leader IP>
    ```

## Create VIP for Cloudify HA cluster

1.  Install HAproxy

    ```
    sudo yum install haproxy
    ```
1.  Make folder: `/etc/haproxy/certs.d/`
1.  Creating a Combined PEM SSL Certificate/Key File

    ```
    cat example.com.crt example.com.key >/etc/haproxy/certs.d/example.com.pem
    ```
1.  Configure `/etc/haproxy/haproxy.cfg`

    Obtain the base64 representation for the authorization header:
    ```
     echo -n "admin:admin" | base64
    ```
    Example for SSL REST:
    ```
     frontend https_front
        bind *:443 ssl crt /etc/haproxy/certs.d/second_all.pem no-sslv3
        option http-server-close
        option forwardfor
        reqadd X-Forwarded-Proto:\ https
        reqadd X-Forwarded-Port:\ 443

        # set HTTP Strict Transport Security (HTST) header
        rspadd  Strict-Transport-Security:\ max-age=15768000
        default_backend https_back

     backend https_back
        balance roundrobin
        option httpchk GET /api/v3.1/status HTTP/1.0\r\nAuthorization:\ Basic\ YWRtaW46YWRtaW4=
        http-check expect status 200
        server server_name_1 10.1.1.41:443 check ssl verify none
        server server_name_2 10.1.1.42:443 check ssl verify none
    ```
    Example for non-SSL REST:

    ```
     frontend http_front
        bind *:80
        default_backend http_back
 
     backend http_back
        balance roundrobin
        option httpchk GET /api/v3.1/status HTTP/1.0\r\nAuthorization:\ Basic\ YWRtaW46YWRtaW4=
        http-check expect status 200
        server server_name_1 10.1.1.41:80 check
        server server_name_2 10.1.1.42:80 check
    ```
    In this examples, 10.1.1.41 and 10.1.1.42 are the public IP addresses of the Cloudify Manager cluster nodes and "YWRtaW46YWRtaW4=" is the result of the command above.

## Cloudify HA cluster management

Cloudify HA cluster manages in the same way as a single Cloudify manager, but there are small differences when a leader changing. 

Cloudify CLI profile contains all information about managers of the HA Cluster and if the leader manager does not answer Cloudify CLI starts finding new leader.

If new profile is created for existing cluster, or new nodes joined to the cluster the command should be run to retrieve the information about all cluster managers and upgrade the profile:
```
cfy cluster update-profile
```

When using Cloudify WEB UI -  Cloudify HA cluster does not provide out of the box mechanism to update the WEB UI  to switch to a new leader due to Security limitations. Cloudify WEB UI User should make sure to have a mechanism to be aware which Cloudify Manager is the current leader. There are several well known mechanisms to achieve this, for example using a Load Balancer, using a Proxy such as HAProxy and configure it to poll the cluster IPs,  or using a CNAME instead of explicit IPs.

You can also implement a [load balancer health check]({{< relref "working_with/manager/high-availability-clusters.md#implementing-a-load-balancer-health-check" >}}).