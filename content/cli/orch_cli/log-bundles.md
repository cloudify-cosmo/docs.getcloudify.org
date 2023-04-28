---
title: log-bundles
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/log-bundles/
---

The `cfy log-bundles` command is used to handle manager log bundles.

You can use the command to create, download, delete and list log-bundles.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### create

#### Usage
`cfy log-bundles create [OPTIONS] [LOG_BUNDLE_ID]`

Create a log bundle on the manager.

The log bundle will contain all cloudify logs it was able to retrieve from
all managers, brokers, and database nodes it was able to reach.

`LOG_BUNDLE_ID` is the id to attach to the log bundle. Not required. If not provided, will be generated automatically.

#### Optional flags

* `--queue` - If set, log-bundle-creation-workflows that can`t currently run will be queued and run automatically when possible.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy log-bundles create test
...

Creating log_bundle test...
Started workflow execution. The execution's id is f284c5cf-00b6-4d58-91a4-fd1975931ecb.

...
{{< /highlight >}}

### delete

#### Usage
`cfy log-bundles delete [OPTIONS] LOG_BUNDLE_ID`

Delete a log_bundle from the manager.

`LOG_BUNDLE_ID` is the id of the log bundle to delete.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy log-bundles delete test
...

Deleting log_bundle test...
Log bundle deleted successfully

...
{{< /highlight >}}

### download

#### Usage
`cfy log-bundles download [OPTIONS] LOG_BUNDLE_ID`

Download a log bundle from the manager.

`LOG_BUNDLE_ID` is the id of the log bundle to download.

#### Optional flags

* `-o, --output-path TEXT` - The local path to download to.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy log-bundles download test
...

Downloading log_bundle test...
 test |################################################################| 100.0%
Log bundle downloaded as test.zip

...
{{< /highlight >}}

### list

#### Usage
`cfy log-bundles list [OPTIONS]`

List all log bundles on the manager.
You can use this command to retrieve the IDs of the log-bundles you want to download or delete.

#### Optional flags

* `--sort-by TEXT` - Key for sorting the list.
* `--descending` -  Sort list in descending order. [default: False]
*  `--search TEXT` - Search resources by id. The returned list will include only resources that contain the given search pattern.
*  `-o, --pagination-offset INTEGER` - The number of resources to skip; --pagination-offset=1 skips the first resource. [default: 0]
*  `-s, --pagination-size INTEGER` - The max number of results to retrieve per page. [default: 1000]
*  `-x, --extended-view` - Display results in a vertical table format.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy log-bundles list
...

Listing log_bundles...

Log bundles:
+------+--------------------------+---------+-------+------------+----------------+------------+
|  id  |        created_at        |  status | error | visibility |  tenant_name   | created_by |
+------+--------------------------+---------+-------+------------+----------------+------------+
| test | 2023-04-28 08:19:18.148  | created |       |  private   | default_tenant |   admin    |
+------+--------------------------+---------+-------+------------+----------------+------------+

Showing 1 of 1 log_bundles

...
{{< /highlight >}}
