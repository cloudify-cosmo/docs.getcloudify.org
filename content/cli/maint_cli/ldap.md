---
title: ldap
description: The `cfy ldap` command is used to set LDAP authentication to enable you to integrate your LDAP users and groups with Cloudify.
category: Docs
draft: false
abstract: Command-Line Interface
aliases: /cli/ldap/
---

The `cfy ldap` command is used to set LDAP authentication to enable you to integrate your LDAP users and groups with {{< param product_name >}}.


#### Optional flags
These commands support the [common CLI flags]({{< relref "cli/_index.md#common-options" >}}).

## Commands

### set

#### Usage
`cfy LDAP set [OPTIONS]`

Set the {{< param cfy_manager_name >}} to use the LDAP authenticator.

#### Required flags

  `-s, --ldap-server TEXT` - The LDAP address against which to authenticate, for example: `ldaps://ldap.domain.com`.

  `-u, --ldap-username TEXT`- The LDAP admin username to be set on the
                                  {{< param cfy_manager_name >}}.

  `-p, --ldap-password TEXT` - The LDAP admin password to be set on the
                                  {{< param cfy_manager_name >}}.

  `-d, --ldap-domain TEXT` - The LDAP domain to be used by the server.



#### Optional flags



  `-a, --ldap-is-active-directory` - Specify whether the LDAP used for authentication is Active-Directory.

  `-e, --ldap-dn-extra TEXT` - Additional LDAP DN options.


&nbsp;
#### Example

{{< highlight  bash  >}}
$ cfy ldap set -s [LDAP SERVER ADDRESS] -u [LDAP ADMIN USERNAME] -p [LDAP ADMIN PASSWORD] -d [DOMAIN NAME]
{{< /highlight >}}
