---
layout: bt_wiki
title: Secrets Plugin
category: Official Plugins
draft: false
weight: 100
---
<<<<<<< HEAD
=======

{{%children style="h3" description="true"%}}

>>>>>>> master
{{% note %}}
These features are part of the **utilities plugin**.
{{% /note %}}

# Cloudify Utilities: Secrets

## Description

This plugin adds support for create, read, update and delete operation for complex secrets from the blueprint level.

It is often needed to switch between few DCs during resources provisioning.
For instance we may have to provision the same blueprint as 3 deployment in 3 different data centers with Openstack.
So far we needed to e.g. add prefix or suffix to each of secrets being a parts of *openstack_config*.
To change credentials (data center location) and make new deployment we needed to change secret key prefix / suffix manually in the blueprint (*get_secret* intrinsic function invocations).

*Secrets plugin* can do this automatically - you need only to specify name of DC location.

With *secrets plugin* you can:

* Perform CRUD operation on secrets from the blueprint.
* Read / write complex structures (dictionaries) as one secret (JSON serialization).
* Switch dynamically between few variants of the same secret (credentials, data center locations related params etc.).

## Node types

#### cloudify.nodes.secrets.Writer

Node responsible for performing CUD operations on the set of secrets.

Properties:

* ***entries*** - dictionary with keys being secret names and values being secret value.
Secret value may be: *dict, list, string, boolean, integer*
Complex types as: *dict* and *list* will be serialized to JSON.
* ***variant*** - *[OPTIONAL]* suffix used to determine variant of secrets (e.g. DC location for credentials secret).
* ***separator*** - *[OPTIONAL]* characters used to separate proper secret name and its variant.
* ***do_not_delete*** - *[OPTIONAL]* it set to *true* - already created secrets won't be deleted on uninstall.

Runtime properties:

* ***data*** - dictionary containing Secrets API responses for each already created secret.
<<<<<<< HEAD
* ***do_not_delete*** 
=======
* ***do_not_delete***
>>>>>>> master

#### cloudify.nodes.secrets.Reader

Node responsible for performing R operation on the set of secrets.

Properties:

* ***keys*** - list of secrets names which values will be retrieved.
* ***variant*** - *[OPTIONAL]* suffix used to determine variant of secrets (e.g. DC location for credentials secret).
* ***separator*** - [OPTIONAL]* characters used to separate proper secret name and its variant.

Runtime properties:

* ***data*** - dictionary containing Secrets API responses for each secret name specified in *keys* property.


## Examples

[Write Example](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_secrets/write-secret-blueprint.yaml)

[Read Example](https://github.com/cloudify-community/blueprint-examples/blob/master/utilities-examples/cloudify_secrets/read-secret-blueprint.yaml)

Both examples show how plugin works:

1) List current secrets:

    ```
    cfy secrets list
    ```
<<<<<<< HEAD
    
=======

>>>>>>> master
2) Install write example blueprint:

    ```
    cfy install write-secret-blueprint.yaml -b write_secrets_test
    ```

3) Check already created secrets:

    ```
    cfy secrets list
    ```

    For each secret execute:
<<<<<<< HEAD
    
=======

>>>>>>> master
    ```
    cfy secrets get <secret name>
    ```

<<<<<<< HEAD
4) Install read example blueprint 
=======
4) Install read example blueprint
>>>>>>> master

    ```
    cfy install read-secret-blueprint.yaml -b read_secrets_test -vv
    ```

5) Check outputs of read example deployment (should contain some secrets dump)

    ```
    cfy deployments outputs read_secrets_test
    ```
<<<<<<< HEAD
    
=======

>>>>>>> master
6) Uninstall read example deployment

    ```
    cfy uninstall read_secrets_test
    ```
<<<<<<< HEAD
    
=======

>>>>>>> master
7) Uninstall read example deployment

    ```
    cfy uninstall write_secrets_test
    ```
<<<<<<< HEAD
    
=======

>>>>>>> master
8) Check secrets - notice that secrets with *do_not_delete* flag set should still be present

    ```
    cfy secrets list
    ```
<<<<<<< HEAD
    
=======

>>>>>>> master
9) Delete these secrets

    ```
    cfy secrets delete openstack_config__lab1_tenantA
    cfy secrets delete openstack_config__lab1_tenantB    
    cfy secrets delete openstack_config__lab2_tenantA
<<<<<<< HEAD
    ``` 
=======
    ```
>>>>>>> master
