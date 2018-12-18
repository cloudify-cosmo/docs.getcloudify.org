---
layout: bt_wiki
title: summary
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/summary/
---

The `cfy summary` command is used to view a summary of information about different entities on the manager.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).


#### Usage 
`cfy summary <entity type> <target field> [optional sub-field] [OPTIONS]`

Gives a summary of entities of the given type based on the target field and an optional sub-field.

For valid entity names, invoke `cfy summary --help`

For valid field names, invoke `cfy summary <entity type> --help`

#### Optional flags

  -t, --tenant-name TEXT  The name of the tenant of the summary. If not
                          specified, the current tenant will be used
  -a, --all-tenants       Include resources from all tenants associated with
                          the user. You cannot use this argument with
                          arguments: [tenant_name]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy summary nodes deployment_id
...

Retrieving summary of nodes on field deployment_id

Node summary by deployment_id
+---------------+-------+
| deployment_id | nodes |
+---------------+-------+
|      sga1     |   5   |
|      sga3     |   5   |
|      sga2     |   5   |
|       s3      |   1   |
|       s2      |   1   |
|       s1      |   1   |
|       s5      |   1   |
|       s4      |   1   |
|      sg1      |   2   |
+---------------+-------+

...

$ cfy summary deployments tenant_name blueprint_id --all-tenants
...

Retrieving summary of deployments on field tenant_name

Deployment summary by tenant_name
+----------------+--------------+-------------+
|  tenant_name   | blueprint_id | deployments |
+----------------+--------------+-------------+
|     test1      |      s       |      1      |
|     test1      |      sg      |      3      |
|     test1      |     sga      |      5      |
|     test1      |    TOTAL     |      9      |
|     test2      |     sga      |      1      |
|     test2      |      s       |      3      |
|     test2      |      sg      |      5      |
|     test2      |    TOTAL     |      9      |
| default_tenant |     sga      |      3      |
| default_tenant |      s       |      5      |
| default_tenant |      sg      |      1      |
| default_tenant |    TOTAL     |      9      |
+----------------+--------------+-------------+

...

{{< /highlight >}}
