---
title: license
description: The `cfy license` command is used to manage the Cloudify Manager license.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/license/
---

The `cfy license` command is used to manage the {{< param cfy_manager_name >}} license.

#### Optional flags
`cfy license` commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### Upload

#### Usage
`cfy license upload [OPTIONS] <license-path>`

Upload a license to a Manager.


#### Example

{{< highlight  bash  >}}
$ cfy license upload license.yaml
...

Uploading Cloudify License `license.yaml` to the Manager...
Cloudify license successfully uploaded.

...
{{< /highlight >}}


### list

#### Usage
`cfy license list [OPTIONS]`

List the details of the {{< param product_name >}} license.

#### Example

{{< highlight  bash  >}}
$ cfy license list
...

Retrieving Cloudify License
...
Cloudify License

+--------------+--------------------------+-----------------+-------+------------------+--------------+---------+
| customer_id  |     expiration_date      | license_edition | trial | cloudify_version | capabilities | expired |
+--------------+--------------------------+-----------------+-------+------------------+--------------+---------+
| My-customer  | 2019-05-27 00:00:00.000  |      Spire      |  True |       4.6        | Mock1,Mock2  |  False  |
+--------------+--------------------------+-----------------+-------+------------------+--------------+---------+

...
{{< /highlight >}}


### remove

#### Usage
`cfy license remove [OPTIONS]`

Remove a {{< param product_name >}} license from the Manager.

#### Example

{{< highlight  bash  >}}
$ cfy license remove
...

Removing Cloudify License from the Manager...
Cloudify license successfully removed.

...
{{< /highlight >}}


### environments list

#### Usage
`cfy license environments list [OPTIONS]`

List all licensed environments on the manager.

#### Optional flags

*  `--sort-by TEXT` -   Key for sorting the list

*  `--descending` -     Sort list in descending order [default: False]

*  `-o, --pagination-offset INTEGER` -    The number of resources to skip; --pagination-offset=1 skips the first resource
                                         [default: 0].

*  `-s, --pagination-size INTEGER` -    The max number of results to retrieve per page [default: 1000]



#### Example

{{< highlight  bash  >}}
$ cfy license environments list

Listing all licensed environments...

Environments:
+--------------------------------------+-----------------+----------------+
|            deployment_id             | deployment_name |  tenant_name   |
+--------------------------------------+-----------------+----------------+
| 78d88659-cf4a-4a1e-a05e-10bf3af22e19 |       app       | default_tenant |
| 8a333574-7eae-4a7b-b8e6-ba78e8823e6f |        i1       |       t        |
| 80784712-d620-4b7d-9bc9-dd53af3921e1 |        i2       |       t        |
+--------------------------------------+-----------------+----------------+

Showing 3 of 3 environments


### environments count

#### Usage
`cfy license environments count [OPTIONS]`

Print the count of licensed environments on the manager.

#### Example

{{< highlight  bash  >}}
$ cfy license environments count

Licensed environments count: 3
