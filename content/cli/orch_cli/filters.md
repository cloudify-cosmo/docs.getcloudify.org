---
layout: bt_wiki
title: filters
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/filters/
---

The `cfy filters` command is used to manage Cloudify filters.
A filter is defined as a set of filter-rules that can be used to filter a list of objects, based on their labels.
Filter-rules can be of the following forms:

* `x=y`: All objects with the label `x:y`. 

* `x=[y,z]`: All objects with the label `x:y or x:z`.

* `x!=y`: All objects with the label `x:<any value other than y>`.  

* `x!=[y,z]`: All objects with the label `x:<any value other than y and z>`.

* `x is null`: All objects that don’t have the label `x:<any value>`.

* `x is not null`: All objects that have the label `x:<any value>`.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### create

#### Usage
`cfy filters create [OPTIONS] FILTER_ID FILTER_RULES`

Create a new filter

`FILTER-ID` is the new filter's ID

`FILTER-RULES` are a list of filter rules separated with "and". Filter rules 
must be one of: `<key>=<value>`, `<key>=[<value1>,<value2>,...]`, 
`<key>!=<value>`, `<key>!=[<value1>,<value2>,...]`, `<key> is null`, `<key> is not null`. 
E.g. `"a=b and c!=[d,e] and f is not null"`. The filter rules will be saved in lower case.


#### Optional flags:

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].
* `-t, --tenant-name` - The name of the tenant of the filter. If not specified, the current tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy filters create gcp-london "env=gcp and location=london"
...

Filter `gcp-london` created

...
{{< /highlight >}}


### delete

#### Usage
`cfy filters delete [OPTIONS] FILTER_ID`

Delete a filter

`FILTER-ID` is the filter's ID

#### Optional flags:

* `-t, --tenant-name` - The name of the tenant of the filter. If not specified, the current tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy filters delete gcp-london
...

Deleting filter `gcp-london`...
Filter removed

...
{{< /highlight >}}


### get

#### Usage
`cfy filters get [OPTIONS] FILTER_ID`

Get details for a single filter

`FILTER-ID` is the filter's ID

#### Optional flags:

* `-t, --tenant-name` - The name of the tenant of the filter. If not specified, the current tenant will be used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy filters get gcp-london
...

Getting info for filter `gcp-london`...
Requested filter info:
	id:              gcp-london
	visibility:      tenant
	created_at:      2021-01-25 12:09:05.740 
	updated_at:      2021-01-25 12:09:05.740 
	tenant_name:     default_tenant
	created_by:      admin
	resource_availability: tenant
	private_resource: False
	filter_rules:    "env=gcp and location=london"

...
{{< /highlight >}}


### list

#### Usage
`cfy filters list [OPTIONS]`

List all Filters

#### Optional flags

*  `--sort-by TEXT` - Key for sorting the list.
*  `--descending` - Sort list in descending order. [default: False]
*  `-t, --tenant-name TEXT` - The name of the tenant from which to list filters.
                              If unspecified, the current tenant is used.
                              This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` - Include resources from all tenants associated with the user.
                         This argument cannot be used simultaneously with the `tenant-name` argument.
*  `--search TEXT` - Search resources by name/id. The returned list will include only resources that contain the given search pattern
*  `-o, --pagination-offset INTEGER` - The number of resources to skip;
                                       --pagination-offset=1 skips the first resource [default: 0]
*  `-s, --pagination-size INTEGER` - The max number of results to retrieve per page [default: 1000]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy filters list
...

Listing all filters...

Filters:
+------------+-------------------------------+--------------------------+--------------------------+------------+----------------+------------+
|     id     |          filter_rules         |        created_at        |        updated_at        | visibility |  tenant_name   | created_by |
+------------+-------------------------------+--------------------------+--------------------------+------------+----------------+------------+
| gcp-london | "env=gcp and location=london" | 2021-01-25 12:09:05.740  | 2021-01-25 12:09:05.740  |   tenant   | default_tenant |   admin    |
+------------+-------------------------------+--------------------------+--------------------------+------------+----------------+------------+

Showing 1 of 1 filters

...
{{< /highlight >}}


### update

#### Usage
` cfy filters update [OPTIONS] FILTER_ID`

Update an existing filter's filter rules or visibility

`FILTER-ID` is the filter's ID

Either a new visibility or new filter rules must be specified.

#### Optional flags:

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'].
* `--filter-rules TEXT` - a list of filter rules separated with "and". Filter rules must be one 
  of: `<key>=<value>`, `<key>=[<value1>,<value2>,...]`, `<key>!=<value>`, `<key>!=[<value1>,<value2>,...]`, 
  `<key> is null`, `<key> is not null`. E.g. `"a=b and c!=[d,e] and f is not null"`. 
  The filter rules will be saved in lower case.  
* `-t, --tenant-name TEXT` - The name of the tenant of the filter. If not specified, the current tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy filters update gcp-london --filter-rules "env=gcp and location=london and arch!=k8s"
...

Filter `gcp-london` updated

...
{{< /highlight >}}
