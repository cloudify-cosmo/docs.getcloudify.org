---
layout: bt_wiki
title: secrets
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
weight: 185
---

The `cfy secrets` command is used to manage Cloudify secrets (key-value pairs). 

#### Optional flags

These will work on each command:

* `-v, --verbose` - Show verbose output. You can supply this up to three times (i.e. -vvv)
* `-h, --help` - Show this message and exit.

## Commands

### create

#### Usage 
`cfy snapshots create [OPTIONS] [SNAPSHOT_ID]`
 
Create a new secret (key-value pair)

`KEY` is the new secret's key

#### Required flags

*  `-s, --secret_value TEXT` - The secret's value to be set. 


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy secret create test -s test_value
...

Secret `test` created

...
{{< /gsHighlight >}}

### delete

#### Usage 
`cfy snapshots delete [OPTIONS] SNAPSHOT_ID`

Delete a secret.

`KEY` is the secret's key.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy secr del test
...

Deleting secret `test`...
Secret removed

...
{{< /gsHighlight >}}

### get

#### Usage 
`cfy snapshots download [OPTIONS] SNAPSHOT_ID`

Get details for a single secret

`KEY` is the secret's key


&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy secrets get test
...

Getting info for secret `test`...
Requested secret info:
created_by:     admin
key:            test
permission:     creator
tenant_name:    default_tenant
created_at:     2017-04-04 08:36:06.746 
updated_at:     2017-04-04 08:39:49.926 
value:          test_value2

...
{{< /gsHighlight >}}

### list

#### Usage 
`cfy snapshots list [OPTIONS]`

List all secrets.

#### Optional flags

*  `--sort-by TEXT` - Key for sorting the list.
*  `--descending` - Sort list in descending order. [default: False]
*  `-t, --tenant-name TEXT` -  The name of the tenant from which to list secrets. If unspecified, the current tenant is
                            used. This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` -    Include resources from all tenants associated with
                            the user. This argument cannot be used simultaneously with the `tenant-name` argument.  

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy secret list
...

Listing all secrets...

Secrets:
+------+--------------------------+--------------------------+------------+----------------+------------+
| key  |        created_at        |        updated_at        | permission |  tenant_name   | created_by |
+------+--------------------------+--------------------------+------------+----------------+------------+
| test | 2017-04-04 08:36:06.746  | 2017-04-04 08:36:06.746  |  creator   | default_tenant |   admin    |
+------+--------------------------+--------------------------+------------+----------------+------------+

...
{{< /gsHighlight >}}

### update

#### Usage 
`cfy snapshots restore [OPTIONS] SNAPSHOT_ID --tenant-name`

Update an existing secret.

`KEY` is the secret's key.

#### Required flags

*  `-s, --secret_value TEXT` - The secret's value to be set.

&nbsp;
#### Example

{{< gsHighlight  bash  >}}
$ cfy secret update test -s test_value2
...

Secret `test` updated

...
{{< /gsHighlight >}}
