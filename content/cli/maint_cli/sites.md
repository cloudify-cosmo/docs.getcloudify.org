---
title: sites
description: The `cfy sites` command is used to manage sites and their location.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/sites/
---

The `cfy sites` command is used to manage sites and their location.

#### Optional flags
`cfy sites` commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### List

#### Usage
`cfy sites list [OPTIONS]`

List all sites

#### Optional flags

*  `--sort-by TEXT` - 	Key for sorting the list.
*  `--descending` - 	Sort list in descending order. [default: False]
*  `-t, --tenant-name TEXT` -  The name of the tenant from which to list the sites. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.  

*  `--search TEXT`     Search sites by name. The returned list will include only sites that contain the given search pattern.

*  `-o, --pagination-offset INTEGER`       The number of resources to skip;
                                  --pagination-offset=1 skips the first resource [default: 0]

*  `-s, --pagination-size INTEGER`       The max number of results to retrieve per page [default: 1000]

#### Example

{{< highlight  bash  >}}

$ cfy sites list
Listing all sites...

Sites:
+----------+------------------------+------------+----------------+--------------------------+------------+
|   name   |        location        | visibility |  tenant_name   |        created_at        | created_by |
+----------+------------------------+------------+----------------+--------------------------+------------+
| Chicago  | 41.8333925,-88.0121478 |   tenant   | default_tenant | 2019-05-19 12:00:20.843  |   admin    |
|  Miami   | 25.7823404,-80.3695441 |   tenant   | default_tenant | 2019-05-19 12:00:52.143  |   admin    |
| Tel-Aviv | 32.0879122,34.7272058  |   tenant   | default_tenant | 2019-05-19 12:00:12.073  |   admin    |
+----------+------------------------+------------+----------------+--------------------------+------------+

Showing 3 of 3 sites
{{< /highlight >}}


### Create

#### Usage
`Usage: cfy sites create [OPTIONS] NAME`

  Create a new site

  `NAME` is the new site's name

#### Optional flags

*  `--location TEXT` -          The location of the site, expected format:
                          latitude,longitude such as 32.071072,34.787274

*  `-l, --visibility TEXT` -    Defines who can see the resource, can be set to one
                          of ['private', 'tenant', 'global'] [default: tenant]
*  `-t, --tenant-name TEXT` -   The name of the tenant of the site. If not
                          specified, the current tenant will be used

#### Example

{{< highlight  bash  >}}

$ cfy sites create --location 32.0879122,34.7272058 --visibility global Tel-Aviv
...

{{< /highlight >}}


### Get

#### Usage

`cfy sites get [OPTIONS] NAME`

  Get details for a single site

  `NAME` is the site's name

#### Optional flags
*  `-t, --tenant-name TEXT` - The name of the tenant of the site. If not
                          specified, the current tenant will be used


#### Example

{{< highlight  bash  >}}

$ cfy sites get Tel-Aviv
...

{{< /highlight >}}


### Delete

#### Usage

`cfy site delete [OPTIONS] NAME`

  Delete a site

  `NAME` is the site's name

#### Optional flags

*  `-t, --tenant-name TEXT` - The name of the tenant of the secret. If not
                          specified, the current tenant will be used

#### Example

{{< highlight  bash  >}}

$ cfy sites delete Tel-Aviv
...

{{< /highlight >}}



### Update

#### Usage
`cfy sites update [OPTIONS] NAME`

  Update an existing site

  `NAME` is the site's name

#### Optional flags
*  `--location TEXT`   -     The location of the site, expected format:
                          latitude,longitude such as 32.071072,34.787274
*  `-l, --visibility TEXT`  - Defines who can see the resource, can be set to one
                          of ['private', 'tenant', 'global']
*  `-n, --new-name TEXT`  -   The new name of the site


#### Example

{{< highlight  bash  >}}

$ cfy sites update --location 32.0879122,34.7272058 --visibility global --new-name Tel-Aviv-Yafo Tel-Aviv
...

{{< /highlight >}}
