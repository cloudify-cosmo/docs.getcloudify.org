---
title: secrets providers
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/secrets-providers/
---

The `cfy secrets providers` command is used to manage {{< param product_name >}} Secrets Providers.

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### create

#### Usage
`cfy secrets providers create [OPTIONS] SECRETS_PROVIDER_NAME`

Create a new Secrets Provider.

`SECRETS_PROVIDER_NAME` is the new Secrets Provider's name.

#### Required flags

One of these flags:

* `-y, --type TEXT` - Secrets Provider's type.

#### Optional flags:

* `-c, --connection-parameters TEXT` - Secrets Provider's connection parameters in stringify JSON format.
* `-t, --tenant-name TEXT` - The name of the tenant of the Secrets Provider. If not specified, the current tenant will be used.
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets providers create test-provider --type local
...

Secrets Provider `test-provider` created
Connected to the Secrets Provider successfully

...
{{< /highlight >}}

### delete

#### Usage
`cfy secrets providers delete [OPTIONS] SECRETS_PROVIDER_NAME`

Delete a Secrets Provider.

`SECRETS_PROVIDER_NAME` is the Secrets Provider's name.

#### Optional flags:

* `-t, --tenant-name TEXT` - The name of the tenant of the Secrets Provider. If not specified, the current tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets providers delete test-provider
...

Deleting Secrets Provider `test-provider`...
Secrets Provider removed

...
{{< /highlight >}}

### get

#### Usage
`cfy secrets providers get [OPTIONS] SECRETS_PROVIDER_NAME`

Get details for a single Secrets Provider.

`SECRETS_PROVIDER_NAME` is the Secrets Provider's name.

#### Optional flags:

* `-t, --tenant-name TEXT` - The name of the tenant of the Secrets Provider. If not specified, the current tenant will be used.


&nbsp;
#### Example

{{< highlight  bash  >}}
cfy secrets providers get test-provider

...

Getting info for Secrets Provider `test-provider`...
Requested Secrets Provider info:
created_at:                2022-12-22 13:52:04.116 
id:                        test-provider
visibility:                tenant
name:                      test-provider
type:                      local
connection_parameters:     None
updated_at:                None
tenant_name:               default_tenant
created_by:                admin
resource_availability:     tenant
private_resource:          False


...
{{< /highlight >}}

### list

#### Usage
`cfy secrets providers list [OPTIONS]`

List all Secrets Providers.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets providers list
...

Listing all Secrets Providers...

Secrets Providers:
+---------------+-------+------------+----------------+------------+--------------------------+
|      name     |  type | visibility |  tenant_name   | created_by |        created_at        |
+---------------+-------+------------+----------------+------------+--------------------------+
| test-provider | local |   tenant   | default_tenant |   admin    | 2022-12-22 13:52:04.116  |
+---------------+-------+------------+----------------+------------+--------------------------+

Showing 1 of 1 Secrets Providers
...
{{< /highlight >}}

### update

#### Usage
`cfy secrets providers update [OPTIONS] SECRETS_PROVIDER_NAME`

Update an existing Secrets Provider.

`SECRETS_PROVIDER_NAME` is the Secrets Provider's name.

#### Optional flags:

* `-y, --type TEXT` - Secrets Provider's type.
* `-c, --connection-parameters TEXT` - Secrets Provider's connection parameters in stringify JSON format.
* `-t, --tenant-name TEXT` - The name of the tenant of the Secrets Provider. If not specified, the current tenant will be used.
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets providers update test-provider --type vault
...

Secrets Provider `test-provider` updated

...
{{< /highlight >}}


### test

#### Usage
`cfy secrets providers test [OPTIONS] SECRETS_PROVIDER_NAME`

Test a Secrets Provider connectivity.

`SECRETS_PROVIDER_NAME` is the Secrets Provider's name.

#### Optional flags:

* `-y, --type TEXT` - Secrets Provider's type.
* `-c, --connection-parameters TEXT` - Secrets Provider's connection parameters in stringify JSON format.
* `-t, --tenant-name TEXT` - The name of the tenant of the Secrets Provider. If not specified, the current tenant will be used.
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets providers test test-provider
...

Connected to the Secrets Provider successfully

...
{{< /highlight >}}
