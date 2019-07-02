---
layout: bt_wiki
title: license
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/license/
---

The `cfy license` command is used to manage Cloudify license on the Manager.

#### Optional flags
`cfy license` commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### Upload

#### Usage
`cfy license upload [OPTIONS] <license-path>`

Upload a Cloudify license to a Manager.


#### Example

{{< highlight  bash  >}}
$ cfy license upload cloudify_license.yaml
...

Uploading Cloudify License `cloudify_license.yaml` to the Manager...
Cloudify license successfully uploaded.

...
{{< /highlight >}}


### list

#### Usage
`cfy license list [OPTIONS]`

List details of the Cloudify license.

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
| CloudifyMock | 2019-05-27 00:00:00.000  |      Spire      |  True |       4.6        | Mock1,Mock2  |  False  |
+--------------+--------------------------+-----------------+-------+------------------+--------------+---------+

...
{{< /highlight >}}


