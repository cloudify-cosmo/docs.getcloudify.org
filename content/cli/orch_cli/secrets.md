---
title: secrets
category: Docs
draft: false
abstract: Cloudify's Command-Line Interface
aliases: /cli/secrets/
---

The `cfy secrets` command is used to manage Cloudify secrets (key-value pairs).

#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### create

#### Usage
`cfy secrets create [OPTIONS] KEY`

Create a new secret (key-value pair)

`KEY` is the new secret's key

#### Required flags

One of these flags:

* `-s, --secret-string TEXT` - The string to use as the secret's value.
* `-f, --secret-file TEXT` - The file with the contents of the secret.

#### Optional flags:

* `-u, --update-if-exists` - Update secret value if secret key already exists. [This option is deprecated; use cfy secrets update command instead]. You cannot use this argument with arguments: [visibility, hidden_value]
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'] [default: tenant].
* `--hidden-value` - The secret value is only shown to the user that created the secret, to the tenant managers, and to sys-admins.
                     Use of the secret is allowed according to user roles and the visibility of the secret.
* `-t, --tenant-name` - The name of the tenant of the secret. If not specified, the current tenant will be used.
* `-p, --provider-name` - Secrets Provider's name.
* `-o, --provider-options` - Secrets Provider's options in stringify JSON

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets create test-secret -s test-value
...

Secret `test-secret` created

...
{{< /highlight >}}

### delete

#### Usage
`cfy secrets delete [OPTIONS] KEY`

Delete a secret.

`KEY` is the secret's key.

#### Optional flags:

* `-t, --tenant-name` - The name of the tenant of the secret. If not specified, the current tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets delete test-secret
...

Deleting secret `test-secret`...
Secret removed

...
{{< /highlight >}}

### get

#### Usage
`cfy secrets get [OPTIONS] KEY`

Get details for a single secret.

`KEY` is the secret's key

#### Optional flags:

* `-t, --tenant-name` - The name of the tenant of the secret. If not specified, the current tenant will be used.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets get test-secret
...

Getting info for secret `test-secret`...
Requested secret info:
key:             test-secret
tenant_name:     default_tenant
created_at:      2018-05-13 16:01:37.420
updated_at:      2018-05-13 16:01:37.420
created_by:      admin
visibility:      tenant
value:           test-value
is_hidden_value: False

...
{{< /highlight >}}

### list

#### Usage
`cfy secrets list [OPTIONS]`

List all secrets.

#### Optional flags

*  `--sort-by TEXT` - Key for sorting the list.
*  `--descending` - Sort list in descending order. [default: False]
*  `-t, --tenant-name TEXT` - The name of the tenant from which to list secrets.
                              If unspecified, the current tenant is used.
                              This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` - Include resources from all tenants associated with the user.
                         This argument cannot be used simultaneously with the `tenant-name` argument.
*  `--search TEXT` - Search secrets by key. The returned list will include only secrets that contain the given search pattern.
*  `-o, --pagination-offset INTEGER` - The number of resources to skip;
                                       --pagination-offset=1 skips the first resource [default: 0]
*  `-s, --pagination-size INTEGER` - The max number of results to retrieve per page [default: 1000]


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets list
...

Listing all secrets...

Secrets:
+-------------+--------------------------+--------------------------+------------+----------------+------------+-----------------+
|     key     |        created_at        |        updated_at        | visibility |  tenant_name   | created_by | is_hidden_value |
+-------------+--------------------------+--------------------------+------------+----------------+------------+-----------------+
| test-secret | 2018-05-13 16:01:37.420  | 2018-05-13 16:01:37.420  |   tenant   | default_tenant |   admin    |      False      |
+-------------+--------------------------+--------------------------+------------+----------------+------------+-----------------+

Showing 1 of 1 secrets
...
{{< /highlight >}}

### export

#### Usage
`cfy secrets export [OPTIONS]`

Export secrets from the manager to a file.

#### Optional Flags

*  `-p, --passphrase TEXT` -  The passphrase used to encrypt the secrets' values, must be 8 characters long.
* `--non-encrypted`  -       Use this flag for none encrypted scerets' values. You cannot use this argument with
                          arguments: [passphrase]
*  `-l, --visibility TEXT` - Filters the secrets exported according to their visibility,
							can be set to one of the following ['private', 'tenant', 'global'].
*  `-t, --tenant-name TEXT` - The name of the tenant from which to export secrets.
							  If unspecified, the current tenant will be used.
							  This argument cannot be used simultaneously with the `all-tenants` argument.
*  `-a, --all-tenants` - Include resources from all tenants associated with the user.
                         This argument cannot be used simultaneously with the `tenant-name` argument.
*  `--filter-by TEXT` - Filters the secrets exported according to a keyword.
*  `-o, --output-path TEXT` - The local path to download the exported secrets to.
							  If not specified, the secrets' file will be downloaded to `<current directory>/secrets.json`

### import

#### Usage
`cfy secrets import [OPTIONS]`

Import secrets from a file to the manager.


#### Optional Flags

* `-p, --passphrase TEXT` -  The passphrase used to encrypt or decrypt the secrets' values, must be 8 characters long.
* `-i, --input-path TEXT` - Path to secrets file to import. 
* `--non-encrypted`  -       Use this flag for none encrypted secrets' values. You cannot use this argument with
                          arguments: `passphrase`
* `--override-collisions` - If a certain key already exists in the destination
                         manager, its value will be updated with the new
                         imported value.                          
* `-m, --tenant-map TEXT` - Path to a json file containing a from-to tenant names mapping.

#### Inputs examples

secrets input file:
```json
[
	{
		"key": "key",
		"value": "value",
		"tenant_name": "tenant_name",
		"visibility": "tenant",
		"is_hidden_value": "False",
		"encrypted": false
	}
]
```

tenant mapping input file:
```json
{
	"source_tenant1": "destination_tenant1",
	"source_tenant2": "destination_tenant2"
}
```

### update

#### Usage
`cfy secrets update [OPTIONS] KEY`

Update an existing secret.

`KEY` is the secret's key.

#### Required flags

One of these flags:

* `-s, --secret-string TEXT` - The string to use as the secret's value.
* `-f, --secret-file TEXT` - The file with the contents of the secret.

#### Optional flags:

* `--hidden-value / --not-hidden-value` - The secret value is only shown to the user that created the secret, to the tenant managers, and to sys-admins.
                                          Use of the secret is allowed according to user roles and the visibility of the secret.
* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['private', 'tenant', 'global'].
* `-t, --tenant-name TEXT` - The name of the tenant of the secret. If not specified, the current tenant will be used.
* `-p, --provider-name` - Secrets Provider's name.
* `-o, --provider-options` - Secrets Provider's options in stringify JSON

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets update test-secret -s test-value2
...

Secret `test-secret` updated

...
{{< /highlight >}}

### set-visibility

#### Usage
`cfy secrets set-visibility [OPTIONS] KEY`

Set the secret's visibility

`KEY` - The secret's key.

#### Mandatory flags

* `-l, --visibility TEXT` - Defines who can see the resource, can be set to one of ['tenant', 'global']  [required].

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets set-visibility test-secret -l global
...

Secret `test-secret` was set to global

...
{{< /highlight >}}


### set-owner

#### Usage
`cfy secrets set-owner [OPTIONS] KEY`

Change ownership of a secret.

`KEY` - The key of the secret to update.

#### Optional flags

* `-s, --username USERNAME` - The name of the user who will be the new owner of the
                              resource.  [required]
* `-t, --tenant-name TEXT`  - The name of the tenant of the secret. If not specified, the current
                              tenant will be used.

&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy secrets set-owner test-secret -s admin
...

Secret `test-secret` is now owned by user `admin`.

...
{{< /highlight >}}
